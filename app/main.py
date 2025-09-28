from __future__ import annotations
import os
import joblib
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Literal
from datetime import datetime, date
from decimal import Decimal
import requests
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .features.featureizer import make_purchase_features, get_feature_columns
from .models.gbm import GBMRegressor
from .utils.scoring import (
    purchases_to_daily_spend,
    llm_cashflow_adjustments_usd,
    fit_money_trajectory,
    money_goal_curve,
    money_correlation_score,
)
from .utils.plotting import plot_money_projection

app = FastAPI(title="Coach ML Service", version="1.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

ARTIFACT_DIR = os.getenv("MODEL_DIR", "./model_artifacts")
MODEL = None
LSTM_MODEL = None
CURRENT_USER_ID = None

class GraphDataRequest(BaseModel):
    days_horizon: int = 120
    projection_mode: Literal["piecewise", "logistic", "linear"] = "piecewise"
    current_savings: float = 1000
    user_id: int
    income_per_month: float
    goal_amount: float
    target_date: Optional[str] = None
    purchases: List[Dict[str, Any]] = []

@app.get("/")
def root():
    return {"ok": True}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/reload_model")
def reload_model():
    global MODEL, LSTM_MODEL
    try:
        if MODEL is None:
            MODEL = GBMRegressor()
        MODEL.load(ARTIFACT_DIR)
        if LSTM_MODEL is None:
            try:
                from .models.lstm_forecaster import forecast_daily_spend
                LSTM_MODEL = forecast_daily_spend
            except Exception:
                import numpy as np
                LSTM_MODEL = lambda history, horizon=30: np.full(int(horizon), float(history[-1]) if len(history) else 0.0)
        return {"ok": True, "gbm_loaded": True, "lstm_ready": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

BACKEND_URL = "http://143.215.104.239:8080"

class DataResponse(BaseModel):
    income: Decimal
    score: int
    amount: Optional[Decimal] = None
    saved: Optional[Decimal] = None
    expenditures: Decimal
    merchant: Optional[str] = None
    category: Optional[str] = None
    days: Optional[int] = None
    purchase_time: Optional[datetime] = None
    userId: int

@app.get("/all-data", response_model=DataResponse)
def get_all_data(x_user_id: int = Header(..., alias="X-User-Id")):
    url = f"{BACKEND_URL}/dashboard/{x_user_id}"
    resp = requests.get(url, timeout=5)
    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Backend error: {resp.text}"
        )
    return DataResponse(**resp.json())


@app.get("/get_graph_data")
def get_graph_data(x_user_id: int = Header(..., alias="X-User-Id")):
    global CURRENT_USER_ID
    CURRENT_USER_ID = int(x_user_id)

    try:
        payload_obj = get_all_data(x_user_id=CURRENT_USER_ID)
        payload = payload_obj.dict() if hasattr(payload_obj, "dict") else payload_obj
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch all-data: {e}")

    income_monthly = float(payload.get("income") or 0.0)
    current_savings = float(payload.get("saved") or 0.0)

    purchases_df = build_purchases_df(payload)
    purchases_records = purchases_df.to_dict(orient="records")

    model_error = None
    scores = []
    used_features = []
    try:
        _ensure_loaded_model()
        feats = make_purchase_features(purchases_df, income=income_monthly) if not purchases_df.empty else pd.DataFrame()
        if not feats.empty:
            scores = MODEL.predict(feats).tolist()
            used_features = get_feature_columns()
    except Exception as e:
        model_error = f"ML pipeline failed: {e}"
        scores = []

    days_horizon = int(payload.get("days") or 90)
    goal_amount = float(payload.get("saved") or 10000.0)

    traj_money, dbg = fit_money_trajectory(
        current_savings=current_savings,
        income_monthly=income_monthly,
        days_horizon=days_horizon,
        purchases=purchases_records,  # <-- pass list of dicts, not a DataFrame
    )

    goal_money = money_goal_curve(
        current_savings=current_savings,
        goal_amount=goal_amount,
        days_horizon=days_horizon,
    )

    money_score = money_correlation_score(goal_money, traj_money)
    days = list(range(len(goal_money)))

    return {
        "metadata": {
            "current_savings": float(current_savings),
            "goal_amount": float(goal_amount),
            "income_monthly": float(income_monthly),
            "days_horizon": int(days_horizon),
            "projection_mode": "piecewise",
            "money_score": float(money_score),
            "model_error": model_error,
            "user_id": CURRENT_USER_ID,
            "target_date": None,
            "has_goal": False,
            "purchases_processed": int(len(purchases_records)),
            "model_updated": True
        },
        "data_points": {
            "days": days,
            "projected_savings": traj_money.tolist(),
            "ideal_plan": goal_money.tolist(),
            "goal_line": [float(goal_amount)] * len(days)
        },
        "time_series": {
            "daily_net_savings": dbg.get("net_future", []),
            "daily_income": [dbg.get("daily_income", 0)] * len(days),
            "llm_adjustments": dbg.get("llm_adjustments", []),
            "trend_factor": dbg.get("trend_factor", [])
        },
        "purchase_scores": {
            "scores": scores,
            "used_features": used_features
        },
        "views": {
            "week": {
                "days": days[:7],
                "projected_savings": traj_money[:7].tolist(),
                "ideal_plan": goal_money[:7].tolist(),
                "goal_line": [float(goal_amount)] * min(7, len(days))
            },
            "month": {
                "days": days[:30],
                "projected_savings": traj_money[:30].tolist(),
                "ideal_plan": goal_money[:30].tolist(),
                "goal_line": [float(goal_amount)] * min(30, len(days))
            },
            "full_horizon": {
                "days": days,
                "projected_savings": traj_money.tolist(),
                "ideal_plan": goal_money.tolist(),
                "goal_line": [float(goal_amount)] * len(days)
            }
        }
    }

def build_purchases_df(payload: Dict[str, Any]) -> pd.DataFrame:
    df = pd.DataFrame([payload]).rename(columns={"purchase_time": "ts", "userId": "user_id"})
    if "category" not in df.columns:
        df["category"] = ""
    df["is_recurring"] = False
    if "description" not in df.columns:
        df["description"] = ""
    cols = ["user_id", "ts", "merchant", "category", "amount", "is_recurring", "description"]
    for c in cols:
        if c not in df.columns:
            df[c] = "" if c in ("merchant", "category", "description") else 0
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0.0)
    return df[cols]
def _ensure_loaded_model():
    global MODEL
    if MODEL is None:
        MODEL = GBMRegressor()
        MODEL.load(ARTIFACT_DIR)
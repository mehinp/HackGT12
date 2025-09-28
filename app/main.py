from __future__ import annotations
import os
import json
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
from app.models.lstm_forecaster import forecast_daily_spend
from app.models.planner import project_savings_money, build_money_trajectory
from app.models.model_retrainer import model_retrainer

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
    allow_origins=["*"], allow_credentials=False,
    allow_methods=["*"], allow_headers=["*"],
)

ARTIFACT_DIR = os.getenv("MODEL_DIR", "./model_artifacts")
MODEL = None
LSTM_MODEL = None
CURRENT_USER_ID = None
PURCHASE_CACHE_DIR = os.getenv("PURCHASE_CACHE_DIR", ARTIFACT_DIR)
PURCHASE_HISTORY: Dict[int, List[Dict[str, Any]]] = {}
os.makedirs(PURCHASE_CACHE_DIR, exist_ok=True)

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
    """
    Builds the money projection using:
      - LSTM forecast of daily spend (from models/lstm_forecaster.py)
      - Planner (from models/planner.py) to turn daily budget + adjustments into savings curves
      - Optional GBM retrainer (from models/model_retrainer.py) to update 'score' when a new purchase arrives

    Assumes your upstream "get-all" only returns the newest purchase; history grows via _merge_history().
    """
    # ---- lazy imports to keep the patch self-contained ----
    import numpy as np
    import pandas as pd

    # Your local model/planner helpers
    from app.models.lstm_forecaster import forecast_daily_spend
    from app.models.planner import project_savings_money, build_money_trajectory
    from app.models.model_retrainer import model_retrainer

    global CURRENT_USER_ID
    CURRENT_USER_ID = int(x_user_id)

    # ---- 1) Fetch newest payload and merge into local history ----
    try:
        payload_obj = get_all_data(x_user_id=CURRENT_USER_ID)
        payload = payload_obj.dict() if hasattr(payload_obj, "dict") else payload_obj
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch all-data: {e}")

    income_monthly = float(payload.get("income") or 0.0)
    current_savings = float(payload.get("saved") or payload.get("current_savings") or 0.0)

    latest_df = build_purchases_df(payload)                     # builds a DF from the newest-record payload
    latest_records = latest_df.to_dict(orient="records")
    purchases_records = _merge_history(CURRENT_USER_ID, latest_records)  # appends by timestamp change

    # ---- 2) Optional: existing pipeline score (kept from your original) ----
    model_error = None
    scores = []
    used_features = []
    try:
        _ensure_loaded_model()
        feats = make_purchase_features(pd.DataFrame(purchases_records), income=income_monthly) if len(purchases_records) else pd.DataFrame()
        if not feats.empty:
            scores = MODEL.predict(feats).tolist()
            used_features = get_feature_columns()
    except Exception as e:
        model_error = f"ML pipeline failed: {e}"
        scores = []

    # ---- 3) Horizon + goal ----
    days_horizon = int(payload.get("days") or 90)
    goal_amount = float(payload.get("goal_amount") or payload.get("saved") or 10000.0)

    # ---- 4) Build daily spend history from purchases_records ----
    df_hist = pd.DataFrame(purchases_records)
    # accept either 'purchase_time' or 'ts'
    if "purchase_time" in df_hist.columns and "ts" not in df_hist.columns:
        df_hist["ts"] = pd.to_datetime(df_hist["purchase_time"], errors="coerce")
    else:
        df_hist["ts"] = pd.to_datetime(df_hist.get("ts", pd.NaT), errors="coerce")

    df_hist["amount"] = pd.to_numeric(df_hist.get("amount", 0.0), errors="coerce")
    df_hist = df_hist.dropna(subset=["ts"]).sort_values("ts")

    # positive "spend per day" (if your amounts are negative for spend, flip sign here)
    daily_spend = (
        df_hist
        .set_index("ts")["amount"]
        .resample("D")
        .sum()
        .fillna(0.0)
    )
    daily_spend_hist = daily_spend.values.astype(float).tolist()

    # ---- 5) Convert monthly income to a simple daily budget baseline ----
    daily_income = income_monthly / 30.0 if income_monthly else 0.0
    recent_avg_spend = float(pd.Series(daily_spend_hist[-14:]).mean()) if len(daily_spend_hist) else 0.0
    daily_savings_budget = max(daily_income - recent_avg_spend, 0.0)

    # ---- 6) LSTM forecast of daily SPEND, then convert to daily 'adjustments' in savings space ----
    try:
        spend_forecast = forecast_daily_spend(daily_spend_hist, horizon=days_horizon)  # np.ndarray (length H)
        # If forecast > recent_avg_spend, we save less (negative adjustment); if lower, we save more.
        daily_adjustments = -(spend_forecast - recent_avg_spend)
    except Exception:
        # Safe fallback: no change vs recent average
        daily_adjustments = np.zeros(days_horizon, dtype=float)

    # ---- 7) Build curves with your planner ----
    projected_money, proj_views = build_money_trajectory(
        current_savings=current_savings,
        daily_savings_budget=daily_savings_budget,
        days_horizon=days_horizon,
        daily_adjustments=daily_adjustments,
    )

    ideal_money, ideal_views = project_savings_money(
        current_savings=current_savings,
        daily_savings_budget=daily_savings_budget,
        goal_amount=goal_amount,
        days_horizon=days_horizon,
    )

    # ---- 8) Rebase both to start at 0, and scale the "goal" view as before ----
    traj_money = _rebase_to_zero(projected_money)
    goal_money = _rebase_to_zero(ideal_money)

    scale_factor = _scale_factor_to_goal(goal_money, goal_amount)
    ideal = np.asarray(goal_money, dtype=float) * scale_factor
    projected = np.asarray(traj_money, dtype=float) * scale_factor

    # ---- 9) Score the shapes (your existing logic) ----
    money_score_raw = float(money_correlation_score(ideal, projected))
    overall_score = _compute_overall_score(ideal, projected)
    days = list(range(len(ideal)))

    # ---- 10) Time-series debug lines (approximate to keep response shape stable) ----
    # daily_net_savings: day-over-day change of the (unscaled) projected curve
    unscaled_proj = np.asarray(_rebase_to_zero(projected_money), dtype=float)
    daily_net = np.diff(unscaled_proj, prepend=0.0)

    # llm_adjustments not used in this flow; keep zeros for compatibility
    llm_adj = np.zeros(days_horizon, dtype=float)

    # trend factor: neutral (ones) — your planner already encapsulates dynamics
    trend = np.ones(days_horizon, dtype=float)

    # ---- 11) OPTIONAL (requested): retrain GBM on newest record & expose a live score ----
    gbm_model_score = None
    try:
        latest_for_train = dict(purchases_records[-1]) if purchases_records else None
        if latest_for_train is not None:
            # ensure retrainer sees a timestamp field it expects
            if latest_for_train.get("purchase_time") is None:
                latest_for_train["purchase_time"] = latest_for_train.get("ts")

            # retrain with just the newest record (your constraint)
            model_retrainer.retrain_model([latest_for_train], user_income=income_monthly)

            # build features for the current snapshot and predict
            feat_df = make_purchase_features(pd.DataFrame(purchases_records), income=income_monthly)
            if not feat_df.empty:
                pred = model_retrainer.predict(feat_df.tail(1))
                if hasattr(pred, "size") and pred.size:
                    gbm_model_score = float(pred[-1])
                elif isinstance(pred, (list, tuple)) and len(pred):
                    gbm_model_score = float(pred[-1])
    except Exception:
        # keep gbm_model_score = None if anything goes wrong
        pass

    # ---- 12) Build response ----
    return {
        "metadata": {
            "current_savings": float(current_savings),
            "goal_amount": float(goal_amount),
            "income_monthly": float(income_monthly),
            "days_horizon": int(days_horizon),
            "projection_mode": "lstm+planner",
            "money_score": float(money_score_raw),
            "score": int(overall_score),
            "model_error": model_error,
            "user_id": CURRENT_USER_ID,
            "target_date": None,
            "has_goal": bool(goal_amount),
            "purchases_processed": int(len(purchases_records)),
            "model_updated": True,
            "gbm_model_score": gbm_model_score,
            "scale_factor": float(scale_factor)
        },

        "data_points": {
            "days": days,
            "projected_savings": projected.tolist(),
            "ideal_plan": ideal.tolist(),
            "goal_line": [float(goal_amount)] * len(days)
        },
        "time_series": {
            "daily_net_savings": daily_net.tolist(),
            "daily_income": [daily_income] * len(days),
            "llm_adjustments": llm_adj.tolist(),
            "trend_factor": trend.tolist()
        },
        "purchase_scores": {
            "scores": scores,
            "used_features": used_features
        },
        "views": {
            "week": {
                "days": days[:7],
                "projected_savings": projected[:7].tolist(),
                "ideal_plan": ideal[:7].tolist(),
                "goal_line": [float(goal_amount)] * min(7, len(days))
            },
            "month": {
                "days": days[:30],
                "projected_savings": projected[:30].tolist(),
                "ideal_plan": ideal[:30].tolist(),
                "goal_line": [float(goal_amount)] * min(30, len(days))
            },
            "full_horizon": {
                "days": days,
                "projected_savings": projected.tolist(),
                "ideal_plan": ideal.tolist(),
                "goal_line": [float(goal_amount)] * len(days)
            }
        }
    }

def _safe_ts_str(v) -> str:
    """Normalize timestamp-ish values to a comparable string; None -> ''."""
    if v is None:
        return ""
    try:
        # accept epoch, ISO, date, datetime
        import datetime as _dt
        if isinstance(v, (int, float)):
            return str(int(v))
        if isinstance(v, (_dt.datetime, _dt.date)):
            return v.isoformat()
        return str(v)
    except Exception:
        return str(v)
def build_purchases_df(payload: Dict[str, Any]) -> pd.DataFrame:
    if isinstance(payload.get("purchases"), list) and payload["purchases"]:
        df = pd.DataFrame(payload["purchases"]).rename(
            columns={"purchase_time": "ts", "userId": "user_id"}
        )
    else:
        df = pd.DataFrame([payload]).rename(
            columns={"purchase_time": "ts", "userId": "user_id"}
        )

    if "category" not in df.columns:
        df["category"] = ""
    if "description" not in df.columns:
        df["description"] = ""
    if "is_recurring" not in df.columns:
        df["is_recurring"] = False
    if "user_id" not in df.columns:
        df["user_id"] = payload.get("userId", 0)
    if "ts" not in df.columns:
        df["ts"] = None
    if "merchant" not in df.columns:
        df["merchant"] = ""
    if "amount" not in df.columns:
        df["amount"] = 0

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0.0)

    if "ts" in df.columns:
        df = df.sort_values("ts", kind="stable")

    cols = ["user_id", "ts", "merchant", "category", "amount", "is_recurring", "description"]
    return df[cols]

def _rebase_to_zero(arr_like):
    import numpy as np
    arr = np.asarray(arr_like, dtype=float)
    if arr.size == 0:
        return arr
    return arr - arr[0]

def _scale_factor_to_goal(arr_like, goal):
    import numpy as np
    arr = np.asarray(arr_like, dtype=float)
    if arr.size == 0:
        return 1.0
    last = float(arr[-1])
    if last == 0.0:
        return 1.0
    return float(goal) / last

def _compute_overall_score(ideal, projected) -> int:
    import numpy as np
    ideal = np.asarray(ideal, dtype=float)
    projected = np.asarray(projected, dtype=float)
    if ideal.size == 0 or projected.size == 0:
        return 0
    base = float(money_correlation_score(ideal, projected))  # expected 0..1000
    base01 = max(0.0, min(1.0, base / 1000.0))
    end_ratio = 0.0
    if float(ideal[-1]) != 0.0:
        end_ratio = float(projected[-1]) / float(ideal[-1])
    end_ratio = max(0.0, min(1.0, end_ratio))
    final01 = 0.7 * base01 + 0.3 * end_ratio
    return int(round(final01 * 1000))


def _purchase_key(p: Dict[str, Any]) -> tuple:
    return (
        str(p.get("ts")),
        float(p.get("amount") or 0.0),
        str(p.get("merchant") or ""),
        str(p.get("category") or "")
    )
@app.delete("/purchases/cache")
def clear_purchase_cache(x_user_id: int = Header(..., alias="X-User-Id")):
    uid = int(x_user_id)
    PURCHASE_HISTORY.pop(uid, None)
    try:
        os.remove(_history_path(uid))
    except FileNotFoundError:
        pass
    return {"ok": True}
def _normalize_purchase_dict(p: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "user_id": int(p.get("user_id") or p.get("userId") or 0),
        "ts": str(p.get("ts") or p.get("purchase_time") or ""),  # store as plain string; no parsing
        "merchant": str(p.get("merchant") or ""),
        "category": str(p.get("category") or ""),
        "amount": float(p.get("amount") or 0.0),
        "is_recurring": bool(p.get("is_recurring") or False),
        "description": str(p.get("description") or "")
    }


def _history_path(user_id: int) -> str:
    return os.path.join(PURCHASE_CACHE_DIR, f"purchases_{user_id}.jsonl")

def _load_user_history(user_id: int) -> List[Dict[str, Any]]:
    if user_id in PURCHASE_HISTORY:
        return PURCHASE_HISTORY[user_id]
    path = _history_path(user_id)
    records: List[Dict[str, Any]] = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    rec = _normalize_purchase_dict(json.loads(line.strip()))
                    records.append(rec)
                except Exception:
                    continue
    PURCHASE_HISTORY[user_id] = records
    return records

def _save_user_history(user_id: int, records: List[Dict[str, Any]]) -> None:
    path = _history_path(user_id)
    with open(path, "w", encoding="utf-8") as f:
        for r in records:
            f.write(json.dumps(r, default=str) + "\n")
    PURCHASE_HISTORY[user_id] = records


def _merge_history(user_id: int, new_records: list[dict]) -> list[dict]:
    """
    Designed for a source that only returns the *newest* purchase:
    - Normalize incoming record.
    - If history is empty -> append.
    - If history exists:
        * If timestamp changed (even if merchant/amount are same) -> append.
        * If timestamp missing:
              append unless the entire record is byte-for-byte identical.
    """
    hist = _load_user_history(user_id)
    if not new_records:
        return hist

    # newest-only feed
    latest = _normalize_purchase_dict(new_records[-1])

    # accept either 'purchase_time' or 'ts'
    latest['ts'] = latest.get('ts') or latest.get('purchase_time')

    if not hist:
        full = [latest]
        _save_user_history(user_id, full)
        return full

    last = hist[-1]
    last_ts = _safe_ts_str(last.get("ts") or last.get("purchase_time"))
    new_ts  = _safe_ts_str(latest.get("ts"))

    # If timestamp differs, always append (this is the key to growing history)
    if new_ts and new_ts != last_ts:
        full = hist + [latest]
        _save_user_history(user_id, full)
        return full

    # If timestamp absent or same, only block if fully identical
    identical = (
        float(last.get("amount") or 0.0) == float(latest.get("amount") or 0.0)
        and str(last.get("merchant") or "")   == str(latest.get("merchant") or "")
        and str(last.get("category") or "")   == str(latest.get("category") or "")
        and str(last.get("description") or "")== str(latest.get("description") or "")
        and last_ts == new_ts
    )
    if identical:
        return hist

    full = hist + [latest]
    _save_user_history(user_id, full)
    return full


def _ensure_loaded_model():
    global MODEL
    if MODEL is None:
        MODEL = GBMRegressor()
        MODEL.load(ARTIFACT_DIR)
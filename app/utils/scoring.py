from __future__ import annotations
from typing import Dict, List, Tuple, Sequence
import math
import numpy as np
import pandas as pd

try:
    from .llm_enrich import classify_purchase_semantics
except Exception:
    def classify_purchase_semantics(merchant: str, category: str, description: str = "", **_) -> dict:
        return {
            "relation": "other",
            "replaces_category": "",
            "typical_complements": [],
            "est_monthly_complement_cost": 0.0,
            "expected_lifespan_months": 0,
            "necessity": 0.4,
            "payback_days": 0,
            "notes": ""
        }

def _norm(s: str) -> str:
    return (s or "").strip().lower()

def daily_income_from_monthly(income_monthly: float) -> float:
    return float(income_monthly) / 30.0

def purchases_to_daily_spend(
    purchases: Sequence[dict] | pd.DataFrame,
    days_back: int = 30,
) -> pd.Series:
    if isinstance(purchases, pd.DataFrame):
        df = purchases.copy()
    else:
        df = pd.DataFrame([p if isinstance(p, dict) else p.dict() for p in purchases])

    if df.empty:
        idx = pd.date_range(end=pd.Timestamp.today().normalize(), periods=days_back, freq="D")
        return pd.Series(0.0, index=idx)

    if "ts" not in df.columns:
        idx = pd.date_range(end=pd.Timestamp.today().normalize(), periods=days_back, freq="D")
        return pd.Series(0.0, index=idx)
    
    valid_ts_mask = (
        df["ts"].notna() & 
        (df["ts"] != "string") & 
        (df["ts"] != "") & 
        (df["ts"].astype(str).str.strip() != "")
    )
    
    if not valid_ts_mask.any():
        idx = pd.date_range(end=pd.Timestamp.today().normalize(), periods=days_back, freq="D")
        return pd.Series(0.0, index=idx)
    
    df = df[valid_ts_mask].copy()
    
    try:
        df["ts"] = pd.to_datetime(df["ts"], errors='coerce')
        df = df.dropna(subset=["ts"])
        
        if df.empty:
            idx = pd.date_range(end=pd.Timestamp.today().normalize(), periods=days_back, freq="D")
            return pd.Series(0.0, index=idx)
            
        df = df.sort_values("ts")
        end_date = df["ts"].max().normalize()
        start_date = end_date - pd.Timedelta(days=days_back - 1)
        df = df[(df["ts"] >= start_date) & (df["ts"] <= end_date)]

        day_spend = df.groupby(df["ts"].dt.normalize())["amount"].sum()
        idx = pd.date_range(start=start_date, end=end_date, freq="D")
        day_spend = day_spend.reindex(idx, fill_value=0.0).astype("float64")
        day_spend.index.name = "date"
        return day_spend
    except Exception:
        idx = pd.date_range(end=pd.Timestamp.today().normalize(), periods=days_back, freq="D")
        return pd.Series(0.0, index=idx)

def llm_cashflow_adjustments_usd(
    purchases: Sequence[dict] | pd.DataFrame,
    days_horizon: int,
) -> np.ndarray:
    steps = max(1, int(days_horizon))
    adj = np.zeros(steps, dtype="float32")
    if isinstance(purchases, pd.DataFrame) and purchases.empty:
        return adj
    elif not purchases:
        return adj

    df = pd.DataFrame([p if isinstance(p, dict) else p.dict() for p in purchases])
    
    if "ts" in df.columns and not df.empty:
        valid_ts_mask = (
            df["ts"].notna() & 
            (df["ts"] != "string") & 
            (df["ts"] != "") & 
            (df["ts"].astype(str).str.strip() != "")
        )
        df = df[valid_ts_mask].copy()
        
        if not df.empty:
            try:
                df["ts"] = pd.to_datetime(df["ts"], errors='coerce')
                df = df.dropna(subset=["ts"])
                df = df.sort_values("ts")
            except Exception:
                return adj
    
    if df.empty:
        return adj
    
    np.random.seed(42)
    base_variation = np.random.normal(0, 0.8, steps)
    
    for _, row in df.iterrows():
        merchant = row["merchant"] if "merchant" in row.index else ""
        category = row["category"] if "category" in row.index else ""
        description = row["description"] if "description" in row.index else ""
        amount = float(row["amount"]) if "amount" in row.index else 0.0

        meta = classify_purchase_semantics(merchant, category, description)
        relation = meta.get("relation", "other")
        payback_days = int(meta.get("payback_days", 0))
        monthly_comp = float(meta.get("est_monthly_complement_cost", 0.0))
        necessity = float(meta.get("necessity", 0.4))

        if relation == "substitute":
            base_daily_saving = min(15.0, 0.25 * (amount / 30.0))
            start = min(max(payback_days, 0), steps - 1)
            
            actual_start = min(start + np.random.randint(-5, 6), steps - 1)
            actual_start = max(0, actual_start)
            
            for t in range(actual_start, steps):
                days_since_start = t - actual_start
                base_ramp = 1.0 / (1.0 + np.exp(-0.1 * (days_since_start - 5)))
                
                weekly_factor = 1.0 + 0.5 * np.sin(2 * np.pi * t / 7)
                
                variation_factor = 1.0 + 0.3 * np.random.normal(0, 1)
                
                daily_saving = base_daily_saving * base_ramp * weekly_factor * variation_factor
                adj[t] += daily_saving

        elif relation == "complement" and monthly_comp > 0:
            base_per_day = (monthly_comp / 30.0) * (1.2 + 0.8 * necessity)
            start = min(7 + np.random.randint(0, 8), steps - 1)
            
            for t in range(start, steps):
                monthly_factor = 1.0 + 0.6 * np.sin(2 * np.pi * t / 30)
                
                variation_factor = 1.0 + 0.4 * np.random.normal(0, 1)
                
                per_day = base_per_day * monthly_factor * variation_factor
                adj[t] -= per_day

    salary_effect = 2.0 * np.sin(2 * np.pi * np.arange(steps) / 30) * np.exp(-np.arange(steps) / 30)
    adj += salary_effect
    
    adj += base_variation

    return adj

def fit_money_trajectory(
    current_savings: float,
    income_monthly: float,
    days_horizon: int,
    purchases: Sequence[dict] | pd.DataFrame,
) -> Tuple[np.ndarray, Dict]:
    steps = max(1, int(days_horizon))
    daily_income = daily_income_from_monthly(income_monthly)

    spend_hist = purchases_to_daily_spend(purchases, days_back=30)
    net_hist = (daily_income - spend_hist).astype("float64")

    x = np.arange(len(net_hist))
    x_future = np.arange(len(net_hist), len(net_hist) + steps)
    
    if len(x) >= 5:
        deg = min(3, len(x) - 1)
        coef = np.polyfit(x, net_hist.values, deg=deg)
        poly = np.poly1d(coef)
        trend_pred = poly(x_future)
        
        if len(net_hist) >= 14:
            day_of_week = np.array([d.weekday() for d in net_hist.index])
            weekly_pattern = np.zeros(7)
            for day in range(7):
                day_mask = day_of_week == day
                if day_mask.sum() > 0:
                    weekly_pattern[day] = net_hist[day_mask].mean() - net_hist.mean()
            
            future_days = (x_future + len(net_hist)) % 7
            seasonal_pred = np.array([weekly_pattern[day] for day in future_days])
        else:
            seasonal_pred = np.zeros(steps)
        
        if len(net_hist) >= 7:
            daily_changes = np.diff(net_hist.values)
            volatility = np.std(daily_changes) if len(daily_changes) > 0 else daily_income * 0.3
            
            np.random.seed(42)
            random_walk = np.random.normal(0, volatility * 0.8, steps)
            
            mean_reversion = -0.05 * np.cumsum(random_walk) / np.arange(1, steps + 1)
            volatility_pred = random_walk + mean_reversion
        else:
            volatility_pred = np.zeros(steps)
        
        base_pred = trend_pred + seasonal_pred + volatility_pred
        
        if len(net_hist) >= 7:
            large_purchases = spend_hist[spend_hist > daily_income * 2]
            spike_prob = len(large_purchases) / len(spend_hist) if len(spend_hist) > 0 else 0.05
            
            spike_mask = np.random.random(steps) < spike_prob * 0.5
            spike_amounts = -np.random.exponential(daily_income * 4, steps) * spike_mask
            base_pred += spike_amounts
        
    else:
        base_net = max(daily_income * 0.3, net_hist.mean()) if len(net_hist) > 0 else daily_income * 0.4
        variation = daily_income * 0.2 * np.sin(np.linspace(0, 8*np.pi, steps))
        base_pred = np.full(steps, base_net) + variation

    alpha = 0.05
    sm = []
    ema = float(base_pred[0])
    for i, v in enumerate(base_pred):
        if i > 0:
            recent_vol = np.std(base_pred[max(0, i-3):i+1])
            adaptive_alpha = min(0.2, max(0.02, alpha * (1 + recent_vol / daily_income)))
        else:
            adaptive_alpha = alpha
            
        ema = adaptive_alpha * float(v) + (1 - adaptive_alpha) * ema
        sm.append(ema)
    pred = np.array(sm, dtype="float64")

    pred = np.maximum(pred, daily_income * 0.05)
    max_daily_savings = daily_income * 0.8
    pred = np.clip(pred, daily_income * 0.05, max_daily_savings)

    adj = llm_cashflow_adjustments_usd(purchases, steps)
    net_future = pred + adj

    trend_factor = 1.0 + 0.3 * np.sin(np.linspace(0, 4*np.pi, steps)) * np.linspace(0, 1.0, steps)
    net_future = net_future * trend_factor
    
    additional_variation = daily_income * 0.15 * np.sin(np.linspace(0, 12*np.pi, steps))
    net_future += additional_variation
    
    net_future = np.maximum(net_future, daily_income * 0.02)
    net_future = np.clip(net_future, daily_income * 0.02, daily_income * 0.9)

    cum = current_savings + np.cumsum(net_future)
    dbg = {
        "daily_income": daily_income,
        "spend_hist": spend_hist.values.tolist(),
        "net_hist": net_hist.values.tolist(),
        "pred_net": pred.tolist(),
        "llm_adjustments": adj.tolist(),
        "net_future": net_future.tolist(),
        "trend_factor": trend_factor.tolist(),
    }
    return cum.astype("float32"), dbg

def money_goal_curve(
    current_savings: float,
    goal_amount: float,
    days_horizon: int,
) -> np.ndarray:
    steps = max(1, int(days_horizon))
    x = np.linspace(0, 1, steps)
    k = 5.2
    y01 = 1.0 / (1.0 + np.exp(-k * (x - 0.10)))
    return (current_savings + (goal_amount - current_savings) * y01).astype("float32")

def _safe_corr(a: np.ndarray, b: np.ndarray) -> float:
    a = np.asarray(a, float); b = np.asarray(b, float)
    if len(a) < 3 or len(b) < 3 or a.std() == 0 or b.std() == 0:
        return 0.0
    return float(np.corrcoef(a, b)[0, 1])

def money_correlation_score(ideal: np.ndarray, proj: np.ndarray) -> float:
    n = min(len(ideal), len(proj))
    ideal = np.asarray(ideal[:n], float)
    proj = np.asarray(proj[:n], float)

    c_path = _safe_corr(ideal, proj)
    di1 = np.diff(ideal, n=1)
    dp1 = np.diff(proj, n=1)
    di2 = np.diff(ideal, n=2)
    dp2 = np.diff(proj, n=2)
    c_d1 = _safe_corr(di1, dp1)
    c_d2 = _safe_corr(di2, dp2)

    w_path, w_d1, w_d2 = 0.50, 0.35, 0.15
    blended = w_path * c_path + w_d1 * c_d1 + w_d2 * c_d2
    return float(np.clip((blended + 1.0) / 2.0 * 1000.0, 0.0, 1000.0))

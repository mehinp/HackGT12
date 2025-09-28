# app/utils/merchant.py
from __future__ import annotations
from typing import Sequence, Tuple, Dict, List
import math
import numpy as np
import pandas as pd

# LLM hook (safe fallback if llm_enrich is not available)
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
            "necessity": 0.3,
            "payback_days": 0,
            "notes": "",
        }

NECESSITIES = {
    "rent", "rent/mortgage", "utilities", "grocery", "groceries",
    "public transport", "transport", "transportation",
    "general insurance", "insurance",
    "health", "healthcare/fitness", "healthcare", "occupation",
}
LONG_TERM_HINTS = {"ikea","home depot","lowe's","best buy","costco","target","walmart",
                   "keurig","dyson","whirlpool","samsung","lg","apple store"}
SHORT_TERM_HINTS = {"starbucks","dunkin","bluebottle","coffee bean","mcdonald","burger king",
                    "chipotle","taco bell","ubereats","doordash"}
COFFEE_MERCHANTS = {"starbucks","dunkin","bluebottle","coffee bean","peet","philz"}
DURABLE_KEYWORDS = {"coffee maker","coffee machine","keurig","espresso","appliance",
                    "water filter","air purifier","air fryer","vacuum","dishwasher",
                    "washer","dryer","fridge","refrigerator"}

def _norm(s: str) -> str:
    return (s or "").strip().lower()

# ---------- (existing) per-purchase score deltas (kept for completeness) ----------
def purchase_delta_to_score(preds: Sequence[float], purchases: pd.DataFrame, baseline: float = 750.0):
    n = len(preds)
    if n == 0:
        return np.array([], dtype="float32"), []

    df = purchases.copy()
    for col in ("merchant", "category", "description"):
        if col not in df.columns:
            df[col] = ""
    df["merchant_n"] = df["merchant"].map(_norm)
    df["category_n"] = df["category"].map(_norm)
    df["description_n"] = df["description"].map(_norm)

    tweights = np.linspace(0.55, 1.0, num=n, dtype="float32") if n > 1 else np.array([1.0], dtype="float32")

    scores: List[float] = []
    impacts: List[Dict] = []
    cur = float(baseline)

    for i, raw in enumerate(preds):
        cat = df.loc[i, "category_n"]
        mer = df.loc[i, "merchant_n"]
        desc = df.loc[i, "description_n"]
        amt = float(df.loc[i, "amount"])

        st = float(np.clip(raw, -100.0, 100.0))
        if cat in NECESSITIES:
            st *= 0.6
            importance = "short_term"
        else:
            importance = "short_term"

        lt = 0.0
        if mer in LONG_TERM_HINTS or any(k in desc for k in DURABLE_KEYWORDS):
            lt = +min(25.0, 0.08 * amt)
            importance = "long_term"
        elif mer in SHORT_TERM_HINTS:
            lt = -min(20.0, 0.05 * amt)

        influence = float(tweights[i])
        st *= influence
        lt *= influence * 0.8

        cur = float(np.clip(cur + st, 0.0, 1000.0))
        scores.append(cur)

        impacts.append({
            "merchant": df.loc[i, "merchant"],
            "category": df.loc[i, "category"],
            "amount": amt,
            "importance": importance,
            "influence": influence,
            "short_term_delta": st,
            "long_term_delta_hint": lt,
        })

    return np.array(scores, dtype="float32"), impacts

# ---------- NEW: per-day MONEY adjustments (dollars/day) ----------
def _estimate_coffee_weekly_savings(prior14: pd.DataFrame) -> float:
    coffee_mask = prior14["merchant_n"].isin(COFFEE_MERCHANTS)
    weekly_spend = float(prior14.loc[coffee_mask, "amount"].sum()) * (7.0 / max(14.0, 1.0))
    if weekly_spend <= 0:
        weekly_spend = 25.0  # fallback
    # assume ~60% capture if replacing outside coffee with home-brew
    return max(weekly_spend * 0.6, 6.0)

def build_money_adjustments(purchases: Sequence, days_horizon: int) -> Tuple[np.ndarray, List[Dict]]:
    """
    Returns (daily_adjustments, notes)
      daily_adjustments[t] = +/− dollars per day added to savings from day t

    - Substitute durable (e.g., Keurig): +$ per day after payback, ramping up to target
    - Complement (e.g., filters/pods/batteries): −$ per day after a delay
    """
    steps = max(1, int(days_horizon))
    daily_adj = np.zeros(steps, dtype="float32")
    notes: List[Dict] = []

    if not purchases:
        return daily_adj, notes

    df = pd.DataFrame([p.dict() if hasattr(p, "dict") else dict(p) for p in purchases]).sort_values("ts")
    for col in ("merchant", "category", "description"):
        if col not in df.columns:
            df[col] = ""
    df["merchant_n"] = df["merchant"].map(_norm)
    df["category_n"] = df["category"].map(_norm)
    df["description_n"] = df["description"].map(_norm)
    df["ts"] = pd.to_datetime(df["ts"])

    for _, row in df.iterrows():
        merchant = row["merchant_n"]
        category = row["category_n"]
        description = row["description_n"]
        amount = float(row["amount"])
        ts = row["ts"]

        meta = classify_purchase_semantics(row["merchant"], row["category"], row.get("description", ""))
        relation = meta.get("relation", "other")
        necessity = float(meta.get("necessity", 0.3))
        payback_days = int(meta.get("payback_days", 0))
        monthly_comp = float(meta.get("est_monthly_complement_cost", 0.0))

        # Substitutes / durables → positive daily savings ramp (e.g., Keurig replaces Starbucks)
        if relation == "substitute" or (merchant in LONG_TERM_HINTS or any(k in description for k in DURABLE_KEYWORDS)):
            prior14 = df[(df["ts"] < ts) & (df["ts"] >= ts - pd.Timedelta(days=14))]
            weekly_savings = _estimate_coffee_weekly_savings(prior14)
            target_daily_savings = weekly_savings / 7.0  # $/day at full effect
            # if LLM provided stronger signal (big durable), mildly scale with price & necessity
            target_daily_savings *= (0.8 + 0.4 * necessity) * (1.0 + min(amount, 400.0)/1000.0)

            # If LLM gave payback_days, start after that; else estimate from price
            if payback_days <= 0:
                payback_days = int(math.ceil(amount / max(target_daily_savings, 0.1)))

            start = min(max(payback_days, 0), steps - 1)
            ramp_days = min(45, max(10, int(10 + amount / 12)))  # larger item → longer ramp
            end = min(start + ramp_days, steps)

            if end > start and target_daily_savings > 0:
                x = np.linspace(0, 1, end - start)
                ramp = target_daily_savings / (1.0 + np.exp(-6.0 * (x - 0.35)))  # 0 → target
                daily_adj[start:end] += ramp.astype("float32")

                notes.append({
                    "type": "substitute_gain",
                    "merchant": row["merchant"],
                    "amount": amount,
                    "start_day": int(start),
                    "ramp_days": int(end - start),
                    "target_daily_savings": float(target_daily_savings),
                })

        # Complements → ongoing daily cost after a short delay
        if relation == "complement" and monthly_comp > 0.0:
            delay_days = 14
            start = min(delay_days, steps - 1)
            per_day_cost = monthly_comp / 30.0
            per_day_cost *= (0.7 + 0.6 * necessity)  # essentials hit harder
            for t in range(start, steps):
                daily_adj[t] -= per_day_cost
            notes.append({
                "type": "complement_cost",
                "merchant": row["merchant"],
                "monthly_comp": monthly_comp,
                "start_day": int(start),
                "per_day_cost": float(per_day_cost),
            })

    return daily_adj, notes

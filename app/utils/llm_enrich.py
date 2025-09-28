from __future__ import annotations
import os
from typing import Tuple, List, Dict

_OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")

def classify_purchase_semantics(merchant: str, category: str, description: str = "", **_) -> dict:
    text = f"{merchant} {category} {description}".lower()
    
    if "coffee maker" in text or "keurig" in text:
        relation = "substitute"
    elif "filter" in text or "pods" in text or "milk" in text or "cereal" in text:
        relation = "complement"
    else:
        relation = "other"
    
    est_monthly_complement_cost = 0.0
    if relation == "complement":
        if "filter" in text or "pods" in text:
            est_monthly_complement_cost = 15.0
        elif "milk" in text or "cereal" in text:
            est_monthly_complement_cost = 25.0
    
    payback_days = 0
    if relation == "substitute":
        if "coffee maker" in text or "keurig" in text:
            payback_days = 90
    
    necessity = 0.4
    if any(word in text for word in ["rent", "mortgage", "utilities", "insurance", "medicine"]):
        necessity = 0.9
    elif any(word in text for word in ["entertainment", "luxury", "gaming", "hobby"]):
        necessity = 0.1
    
    return {
        "relation": relation,
        "replaces_category": "coffee" if relation == "substitute" and "coffee" in text else "",
        "typical_complements": ["filters", "pods"] if relation == "complement" and "coffee" in text else [],
        "est_monthly_complement_cost": est_monthly_complement_cost,
        "expected_lifespan_months": 24 if relation == "substitute" else 0,
        "necessity": necessity,
        "payback_days": payback_days,
        "notes": f"Classified as {relation} based on heuristics"
    }


def simulate_future_purchases(history: List[Dict], days: int, daily_income: float) -> List[Dict]:
    lower = lambda s: (s or "").lower()
    txt = " ".join([lower(h.get("merchant", "")) + " " + lower(h.get("description", "")) for h in history[-20:]])
    has_k_cup = "keurig" in txt or "coffee maker" in txt
    has_filter = "filter" in txt or "pods" in txt

    rng = __import__("random")
    sims = []
    for d in range(1, days + 1):
        base_spend = 0.6 * daily_income
        if has_k_cup:
            base_spend *= 0.92
            if d % 7 == 0:
                sims.append({"day_offset": d, "amount": 9.0})
        if has_filter and d % 30 == 0:
            sims.append({"day_offset": d, "amount": 10.0})
        wiggle = rng.uniform(-0.08, 0.08) * daily_income
        sims.append({"day_offset": d, "amount": max(0.0, base_spend + wiggle)})
    return sims

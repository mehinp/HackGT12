# app/models/planner.py
from __future__ import annotations
from typing import Dict, Tuple
import numpy as np

def project_savings_money(
    *,
    current_savings: float,
    daily_savings_budget: float,
    goal_amount: float,
    days_horizon: int,
    curvature: float = 4.8,
) -> Tuple[np.ndarray, Dict[str, np.ndarray]]:
    """
    Ideal/goal money path: a capped logistic growth toward the goal,
    limited by the linear 'you can only save what your daily budget allows' cap.
    """
    steps = max(1, int(days_horizon))
    x = np.linspace(0, 1, steps)
    y01 = 1.0 / (1.0 + np.exp(-curvature * (x - 0.35)))

    linear_cap = current_savings + daily_savings_budget * np.arange(steps, dtype=float)
    ideal = current_savings + (goal_amount - current_savings) * y01
    money = np.minimum(ideal, linear_cap).astype("float32")

    week = money[: min(7, steps)]
    month = money[: min(30, steps)]
    views = {"week": week, "month": month, "goal": money}
    return money, views

def build_money_trajectory(
    *,
    current_savings: float,
    daily_savings_budget: float,
    days_horizon: int,
    daily_adjustments: np.ndarray | None = None,
) -> Tuple[np.ndarray, Dict[str, np.ndarray]]:
    """
    Projected savings path in dollars:
      cum_t = current_savings + cumsum( daily_budget + adjustments[t] )

    daily_adjustments are +/− dollars per day (e.g., substitutes/complements effects).
    """
    steps = max(1, int(days_horizon))
    daily = np.full(steps, float(daily_savings_budget), dtype=float)

    if daily_adjustments is not None and len(daily_adjustments) > 0:
        m = min(len(daily_adjustments), steps)
        daily[:m] += daily_adjustments[:m]

    # Savings can't go negative day-to-day (soft clamp)
    daily = np.maximum(daily, 0.0)

    money = current_savings + np.cumsum(daily)
    money = money.astype("float32")

    week = money[: min(7, steps)]
    month = money[: min(30, steps)]
    views = {"week": week, "month": month, "goal": money}
    return money, views

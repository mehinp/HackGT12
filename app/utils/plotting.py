from __future__ import annotations
import io, base64
import numpy as np
import matplotlib.pyplot as plt

def plot_money_projection(
    goal_curve_money: np.ndarray,
    traj_curve_money: np.ndarray,
    goal_amount: float,
    current_savings: float,
) -> str:
    days = np.arange(len(goal_curve_money))
    fig = plt.figure(figsize=(12, 6))
    plt.plot(days, traj_curve_money, label="Projected savings")
    plt.plot(days, goal_curve_money, label="Ideal plan")
    plt.hlines(y=goal_amount, xmin=days.min() if len(days) else 0, xmax=days.max() if len(days) else 0, linestyles="dashed", label="Goal")
    plt.title("Savings Projection")
    plt.xlabel("Days")
    plt.ylabel("Cumulative Savings (USD)")
    plt.legend(loc="best")
    buf = io.BytesIO()
    fig.tight_layout()
    fig.savefig(buf, format="png", dpi=144)
    plt.close(fig)
    data = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{data}"


from __future__ import annotations
from typing import List, Dict
import pandas as pd


CANON_CATS: List[str] = [
    "groceries",
    "rent",
    "utilities",
    "restaurants",
    "entertainment",
    "other",
]


_ALIASES: Dict[str, str] = {
    "grocery": "groceries", "groceries": "groceries", "supermart": "groceries",
    "target": "groceries", "costco": "groceries", "whole foods": "groceries",
    "walmart": "groceries", "trader joe": "groceries", "trader joe's": "groceries",

    "rent": "rent", "rentco": "rent", "mortgage": "rent", "hoa": "rent",

    "utility": "utilities", "utilities": "utilities", "city power": "utilities",
    "internet": "utilities", "wifi": "utilities", "electric": "utilities",
    "gas": "utilities", "water": "utilities", "comcast": "utilities", "verizon": "utilities",

    "restaurant": "restaurants", "resturant": "restaurants", "food": "restaurants",
    "other food": "restaurants", "starbucks": "restaurants", "bluebottle": "restaurants",
    "coffee": "restaurants", "ubereats": "restaurants", "doordash": "restaurants",
    "chipotle": "restaurants", "office lunch": "restaurants", "deli": "restaurants",

    "entertainment": "entertainment", "netflix": "entertainment", "amc": "entertainment",
    "concert": "entertainment", "spotify": "entertainment", "theatre": "entertainment",
}


def _to_canon_category(raw: str) -> str:
    if not raw:
        return "other"
    s = raw.strip().lower()
    if s in _ALIASES:
        return _ALIASES[s]
    for k, v in _ALIASES.items():
        if k in s:
            return v
    if "rent" in s or "mortgage" in s:
        return "rent"
    if any(t in s for t in ["power", "gas", "water", "internet", "wifi", "electric", "utility"]):
        return "utilities"
    if any(t in s for t in [
        "restaurant", "resturant", "cafe", "coffee", "eat", "food", "deli", "pizza", "bar", "grill", "dash", "eats"
    ]):
        return "restaurants"
    if any(t in s for t in ["movie", "netflix", "spotify", "concert", "amc", "theatre"]):
        return "entertainment"
    if any(t in s for t in ["grocery", "mart", "market", "costco", "target", "walmart", "trader joe", "whole foods"]):
        return "groceries"
    return "other"


def canonicalize_categories(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    src = df["category"].fillna("") + " " + df["merchant"].fillna("")
    df["canon_category"] = src.apply(_to_canon_category)
    return df


def get_feature_columns() -> List[str]:
    onehots = [f"cat_{c}" for c in CANON_CATS]
    base = ["dow", "hour", "month", "amount", "is_recurring", "income", "is_discretionary", "delta_vs_cat"]
    return base + onehots


def make_purchase_features(purchases: pd.DataFrame, income: float) -> pd.DataFrame:
    df = purchases.copy()
    if df.empty:
        return pd.DataFrame(columns=get_feature_columns())

    df["ts"] = pd.to_datetime(df["ts"], errors="coerce")
    df["dow"] = df["ts"].dt.dayofweek.fillna(0).astype(int)
    df["hour"] = df["ts"].dt.hour.fillna(0).astype(int)
    df["month"] = df["ts"].dt.month.fillna(1).astype(int)

    df = canonicalize_categories(df)

    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0.0)
    df["is_recurring"] = df["is_recurring"].astype(int)

    essentials = {"rent", "utilities", "groceries"}
    df["is_discretionary"] = (~df["canon_category"].isin(essentials)).astype(int)

    df["cat_roll_avg"] = df.groupby("canon_category")["amount"].transform(
        lambda s: s.rolling(20, min_periods=1).mean()
    )
    df["delta_vs_cat"] = (df["amount"] - df["cat_roll_avg"]).fillna(0.0)

    df["income"] = float(income)

    for c in CANON_CATS:
        df[f"cat_{c}"] = (df["canon_category"] == c).astype(int)

    feats = df[get_feature_columns()].copy()
    return feats



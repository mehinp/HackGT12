from __future__ import annotations
import os, json
import joblib
import numpy as np
from typing import List, Optional

try:
    from xgboost import XGBRegressor
    _HAS_XGB = True
except Exception:
    _HAS_XGB = False

try:
    import lightgbm as lgb
    _HAS_LGB = True
except Exception:
    _HAS_LGB = False


class GBMRegressor:

    def __init__(self, model_type: str = "xgboost", **kwargs):
        self.model_type = model_type.lower()
        self.kwargs = dict(kwargs)
        self.model = None
        self.is_fitted: bool = False

        defaults = {
            "random_state": 42,
            "n_estimators": 400,
            "max_depth": 6,
            "learning_rate": 0.05,
            "subsample": 1.0,
            "colsample_bytree": 1.0,
            "reg_alpha": 0.0,
            "reg_lambda": 1.0,
            "n_jobs": 0,
        }
        for k, v in defaults.items():
            self.kwargs.setdefault(k, v)

        self.random_state: int = int(self.kwargs["random_state"])
        self.n_estimators: int = int(self.kwargs["n_estimators"])
        self.max_depth: int = int(self.kwargs["max_depth"])
        self.learning_rate: float = float(self.kwargs["learning_rate"])
        self.subsample: float = float(self.kwargs["subsample"])
        self.colsample_bytree: float = float(self.kwargs["colsample_bytree"])
        self.reg_alpha: float = float(self.kwargs["reg_alpha"])
        self.reg_lambda: float = float(self.kwargs["reg_lambda"])
        self.n_jobs: int = int(self.kwargs["n_jobs"])

        self.feature_order: List[str] = []

        if self.model_type == "xgboost":
            if not _HAS_XGB:
                raise RuntimeError("xgboost is not installed")
            xgb_args = {
                "n_estimators": self.n_estimators,
                "max_depth": self.max_depth,
                "learning_rate": self.learning_rate,
                "random_state": self.random_state,
                "subsample": self.subsample,
                "colsample_bytree": self.colsample_bytree,
                "reg_alpha": self.reg_alpha,
                "reg_lambda": self.reg_lambda,
                "tree_method": self.kwargs.get("tree_method", "hist"),
                "objective": "reg:squarederror",
                "n_jobs": self.n_jobs,
            }
            self.model = XGBRegressor(**xgb_args)

        elif self.model_type == "lightgbm":
            if not _HAS_LGB:
                raise RuntimeError("lightgbm is not installed")
            lgb_args = {
                "n_estimators": self.n_estimators,
                "max_depth": self.max_depth,
                "learning_rate": self.learning_rate,
                "random_state": self.random_state,
                "subsample": self.subsample,
                "colsample_bytree": self.colsample_bytree,
                "reg_alpha": self.reg_alpha,
                "reg_lambda": self.reg_lambda,
                "objective": "regression",
                "n_jobs": self.kwargs.get("n_jobs", -1),
            }
            self.model = lgb.LGBMRegressor(**lgb_args)
        else:
            raise ValueError(f"Unknown model_type: {self.model_type}")

    def fit(self, X, y, **fit_kwargs):
        if "eval_set" in fit_kwargs and isinstance(fit_kwargs["eval_set"], tuple):
            fit_kwargs["eval_set"] = [fit_kwargs["eval_set"]]

        try:
            self.model.fit(X, y, **fit_kwargs)
        except TypeError:
            for bad in ("early_stopping_rounds", "callbacks", "verbose", "eval_metric"):
                fit_kwargs.pop(bad, None)
            self.model.fit(X, y, **fit_kwargs)

        self.is_fitted = True
        return self

    def predict(self, X) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("Model is not fitted.")
        return self.model.predict(X)

    def save(self, out_dir: str) -> dict:
        os.makedirs(out_dir, exist_ok=True)
        model_path = os.path.join(out_dir, "model.joblib")
        meta_path = os.path.join(out_dir, "meta.json")

        joblib.dump(
            {
                "model_type": self.model_type,
                "sk_model": self.model,
                "feature_order": self.feature_order,
                "random_state": self.random_state,
                "params": {
                    "n_estimators": self.n_estimators,
                    "learning_rate": self.learning_rate,
                    "max_depth": self.max_depth,
                    "subsample": self.subsample,
                    "colsample_bytree": self.colsample_bytree,
                    "reg_alpha": self.reg_alpha,
                    "reg_lambda": self.reg_lambda,
                    "n_jobs": self.n_jobs,
                },
            },
            model_path,
        )

        meta = {
            "path": out_dir,
            "model_dir": out_dir,
            "model_path": model_path,
            "feature_order": self.feature_order,
            "model_type": self.model_type,
            "random_state": self.random_state,
        }
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2)

        return meta

    def load(self, in_dir: str) -> None:
        model_path = os.path.join(in_dir, "model.joblib")
        meta_path  = os.path.join(in_dir, "meta.json")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Missing model at {model_path}")

        bundle = joblib.load(model_path)
        self.model = bundle["sk_model"]
        self.model_type = bundle["model_type"]
        self.feature_order = bundle.get("feature_order", [])
        self.random_state = bundle.get("random_state", self.random_state)

        if os.path.exists(meta_path):
            with open(meta_path, "r", encoding="utf-8") as f:
                _meta = json.load(f)
        self.is_fitted = True

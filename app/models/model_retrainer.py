import pandas as pd
import numpy as np
from typing import List, Dict
import joblib
import os
from app.features.featureizer import make_purchase_features
from app.models.gbm import GBMRegressor


class ModelRetrainer:
    def __init__(self):
        self.model_path = "model_artifacts/model.joblib"
        self.meta_path = "model_artifacts/meta.json"
        self.training_data_path = "model_artifacts/training_data.pkl"
        self.model = None
        self.training_history = []
        self.load_model()
        self.load_training_history()

    def load_model(self):
        try:
            if os.path.exists(self.model_path):
                model_data = joblib.load(self.model_path)
                if isinstance(model_data, dict) and 'sk_model' in model_data:
                    # Load from the structured format
                    self.model = GBMRegressor()
                    self.model.model = model_data['sk_model']
                    self.model.is_fitted = True
                    self.model.model_type = model_data.get('model_type', 'xgboost')
                else:
                    # Legacy format or direct model
                    self.model = model_data if hasattr(model_data, 'predict') else GBMRegressor()
            else:
                self.model = GBMRegressor()
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = GBMRegressor()

    def load_training_history(self):
        try:
            if os.path.exists(self.training_data_path):
                self.training_history = joblib.load(self.training_data_path)
        except Exception as e:
            print(f"Error loading training history: {e}")
            self.training_history = []

    def save_training_history(self):
        try:
            os.makedirs(os.path.dirname(self.training_data_path), exist_ok=True)
            joblib.dump(self.training_history, self.training_data_path)
        except Exception as e:
            print(f"Error saving training history: {e}")

    def prepare_training_data(self, purchases: List[Dict], user_income: float) -> pd.DataFrame:
        if not purchases:
            return pd.DataFrame()

        df = pd.DataFrame(purchases)

        # Handle both 'purchase_time' and 'ts' columns
        if 'purchase_time' in df.columns and 'ts' not in df.columns:
            df['ts'] = df['purchase_time']
        elif 'ts' not in df.columns:
            df['ts'] = pd.Timestamp.now()

        df['ts'] = pd.to_datetime(df['ts'], errors='coerce')
        df = df.dropna(subset=['ts'])

        if df.empty:
            return pd.DataFrame()

        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0.0)
        df['is_recurring'] = df.get('is_recurring', False).fillna(False)
        df['description'] = df.get('description', '').fillna('')
        df['merchant'] = df.get('merchant', '').fillna('')
        df['category'] = df.get('category', '').fillna('')

        features = make_purchase_features(df, income=user_income)
        return features

    def calculate_target_score(self, purchase_data: Dict, user_income: float) -> float:
        """
        Calculate a more realistic target score based on purchase characteristics
        """
        amount = float(purchase_data.get('amount', 0))
        merchant = str(purchase_data.get('merchant', '')).lower()
        category = str(purchase_data.get('category', '')).lower()

        # Base score
        base_score = 750.0

        # Income-based adjustment
        income_ratio = amount / (user_income / 30.0) if user_income > 0 else 0

        # Category-based scoring
        essential_categories = ['groceries', 'rent', 'utilities', 'healthcare']
        discretionary_categories = ['entertainment', 'restaurants', 'shopping']

        if any(cat in category for cat in essential_categories):
            # Essential purchases get better scores, but large amounts still hurt
            category_modifier = 50 - min(income_ratio * 100, 150)
        elif any(cat in category for cat in discretionary_categories):
            # Discretionary purchases are penalized more
            category_modifier = -min(income_ratio * 150, 200)
        else:
            # Unknown categories get moderate penalty
            category_modifier = -min(income_ratio * 100, 100)

        # Merchant-based adjustments
        good_merchants = ['grocery', 'pharmacy', 'gas station', 'utility']
        bad_merchants = ['casino', 'luxury', 'expensive']

        if any(merch in merchant for merch in good_merchants):
            merchant_modifier = 25
        elif any(merch in merchant for merch in bad_merchants):
            merchant_modifier = -75
        else:
            merchant_modifier = 0

        # Amount-based penalty (larger purchases generally hurt scores more)
        amount_penalty = -min(amount / 10, 100)

        final_score = base_score + category_modifier + merchant_modifier + amount_penalty

        # Clamp to reasonable range
        return max(300, min(1000, final_score))

    def retrain_model(self, new_purchases: List[Dict], user_income: float) -> bool:
        try:
            if not new_purchases:
                return True

            # Add new purchases to training history
            for purchase in new_purchases:
                purchase_copy = dict(purchase)
                purchase_copy['user_income'] = user_income
                purchase_copy['target_score'] = self.calculate_target_score(purchase, user_income)
                self.training_history.append(purchase_copy)

            # Keep only recent history (last 1000 purchases) to prevent memory issues
            if len(self.training_history) > 1000:
                self.training_history = self.training_history[-1000:]

            # Prepare features for all historical data
            all_features = []
            all_targets = []

            for purchase in self.training_history:
                features = self.prepare_training_data([purchase], purchase['user_income'])
                if not features.empty:
                    all_features.append(features.iloc[0])
                    all_targets.append(purchase['target_score'])

            if not all_features:
                return True

            X = pd.DataFrame(all_features)
            y = np.array(all_targets)

            # Retrain the model
            if self.model is None:
                self.model = GBMRegressor()

            self.model.fit(X, y)

            # Save the retrained model
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            self.model.save(os.path.dirname(self.model_path))

            # Save training history
            self.save_training_history()

            print(
                f"Model retrained with {len(new_purchases)} new purchases. Total training samples: {len(self.training_history)}")
            return True

        except Exception as e:
            print(f"Error retraining model: {e}")
            import traceback
            traceback.print_exc()
            return False

    def predict(self, features: pd.DataFrame) -> np.ndarray:
        if self.model is None or not self.model.is_fitted:
            # Return default scores if model not ready
            return np.full(len(features), 750.0)

        try:
            return self.model.predict(features)
        except Exception as e:
            print(f"Error making prediction: {e}")
            return np.full(len(features), 750.0)

    def get_latest_score(self, purchase_data: Dict, user_income: float) -> float:
        """Get score for a single purchase"""
        try:
            features = self.prepare_training_data([purchase_data], user_income)
            if features.empty:
                return 750.0

            scores = self.predict(features)
            return float(scores[0]) if len(scores) > 0 else 750.0
        except Exception as e:
            print(f"Error getting latest score: {e}")
            return 750.0


model_retrainer = ModelRetrainer()
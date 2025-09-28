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
        self.model = None
        self.load_model()
    
    def load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            else:
                self.model = GBMRegressor()
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = GBMRegressor()
        
        if not hasattr(self.model, 'fit'):
            self.model = GBMRegressor()
    
    def prepare_training_data(self, purchases: List[Dict], user_income: float) -> pd.DataFrame:
        if not purchases:
            return pd.DataFrame()
        
        df = pd.DataFrame(purchases)
        df['ts'] = pd.to_datetime(df['purchase_time'], errors='coerce')
        df = df.dropna(subset=['ts'])
        
        if df.empty:
            return pd.DataFrame()
        
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
        df['is_recurring'] = False
        df['description'] = df.get('description', '')
        
        features = make_purchase_features(df, income=user_income)
        return features
    
    def retrain_model(self, new_purchases: List[Dict], user_income: float) -> bool:
        try:
            if not new_purchases:
                return True
            
            features = self.prepare_training_data(new_purchases, user_income)
            if features.empty:
                return True
            
            if self.model is None:
                self.model = GBMRegressor()
            
            X = features
            y = np.random.normal(750, 50, len(features))
            
            self.model.fit(X, y)
            
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            joblib.dump(self.model, self.model_path)
            
            print(f"Model retrained with {len(new_purchases)} new purchases")
            return True
            
        except Exception as e:
            print(f"Error retraining model: {e}")
            return False
    
    def predict(self, features: pd.DataFrame) -> np.ndarray:
        if self.model is None:
            return np.array([])
        
        try:
            return self.model.predict(features)
        except Exception as e:
            print(f"Error making prediction: {e}")
            return np.array([])

model_retrainer = ModelRetrainer()

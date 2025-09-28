from __future__ import annotations
import numpy as np
import hashlib
import json
import os
import joblib

try:
    import torch
    import torch.nn as nn

    _HAS_TORCH = True
except Exception:
    _HAS_TORCH = False

if _HAS_TORCH:
    class _TinyLSTM(nn.Module):
        def __init__(self, input_dim=1, hidden=32):
            super().__init__()
            self.lstm = nn.LSTM(input_dim, hidden, batch_first=True)
            self.lin = nn.Linear(hidden, 1)

        def forward(self, x):
            out, _ = self.lstm(x)
            out = self.lin(out[:, -1, :])
            return out


class LSTMForecaster:
    def __init__(self):
        self.model = None
        self.is_trained = False
        self.model_path = "model_artifacts/lstm_model.pkl"
        self.last_training_data_hash = None
        self.load_model()

    def load_model(self):
        """Load saved LSTM model if it exists"""
        try:
            if os.path.exists(self.model_path):
                saved_data = joblib.load(self.model_path)
                if _HAS_TORCH and isinstance(saved_data, dict):
                    self.model = saved_data.get('model')
                    self.is_trained = saved_data.get('is_trained', False)
                    self.last_training_data_hash = saved_data.get('data_hash')
        except Exception as e:
            print(f"Error loading LSTM model: {e}")
            self.model = None
            self.is_trained = False

    def save_model(self):
        """Save LSTM model to disk"""
        try:
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            save_data = {
                'model': self.model,
                'is_trained': self.is_trained,
                'data_hash': self.last_training_data_hash
            }
            joblib.dump(save_data, self.model_path)
        except Exception as e:
            print(f"Error saving LSTM model: {e}")

    def get_data_hash(self, history):
        """Generate hash of training data to detect changes"""
        data_str = json.dumps(history, sort_keys=True)
        return hashlib.md5(data_str.encode()).hexdigest()

    def train_model(self, history):
        """Train LSTM on new data if needed"""
        if not _HAS_TORCH:
            return False

        h = np.array(history or [], dtype=float).reshape(-1)
        if h.size < 10:
            return False

        # Check if we need to retrain
        current_hash = self.get_data_hash(history[-100:] if len(history) > 100 else history)
        if current_hash == self.last_training_data_hash and self.is_trained:
            print("LSTM model already trained on this data")
            return True

        print(f"Training LSTM on {len(h)} data points...")

        x = torch.tensor(h[:-1], dtype=torch.float32).view(1, -1, 1)
        y = torch.tensor(h[1:], dtype=torch.float32).view(1, -1, 1)

        self.model = _TinyLSTM(input_dim=1, hidden=32)
        opt = torch.optim.Adam(self.model.parameters(), lr=1e-2)
        loss_fn = nn.MSELoss()

        self.model.train()
        for epoch in range(200):
            opt.zero_grad()
            pred = self.model(x)
            loss = loss_fn(pred.view_as(y[:, -1, :]), y[:, -1, :])
            loss.backward()
            opt.step()

            if epoch % 50 == 0:
                print(f"  Epoch {epoch}, Loss: {loss.item():.4f}")

        self.is_trained = True
        self.last_training_data_hash = current_hash
        self.save_model()
        print("LSTM training complete")
        return True

    def forecast(self, history, horizon=30):
        """Generate forecast using trained model or fallback"""
        horizon = int(horizon)
        h = np.array(history or [], dtype=float).reshape(-1)

        if not _HAS_TORCH or not self.is_trained or self.model is None or h.size < 10:
            return self._numpy_forecast(h, horizon)

        self.model.eval()
        with torch.no_grad():
            cur = torch.tensor(h[-10:], dtype=torch.float32).view(1, -1, 1)
            out = []
            for _ in range(horizon):
                nxt = self.model(cur)
                out.append(nxt.item())
                cur = torch.cat([cur[:, 1:, :], nxt.view(1, 1, 1)], dim=1)

        out = np.array(out, dtype=float)
        out = np.maximum(out, 0.0)
        return out

    def _numpy_forecast(self, history: np.ndarray, horizon: int) -> np.ndarray:
        """Fallback numpy-based forecast"""
        h = np.asarray(history, dtype=float).flatten()
        if h.size == 0:
            return np.zeros(int(horizon), dtype=float)
        if h.size < 7:
            return np.full(int(horizon), float(h[-1]), dtype=float)
        last = float(h[-1])
        weekly = float(np.mean(h[-7:]))
        trend = (last - float(h[max(0, h.size - 14)])) / max(1, min(7, h.size - 7))
        base = 0.5 * last + 0.5 * weekly
        out = base + trend * np.arange(int(horizon))
        return np.maximum(out, 0.0)


# Global forecaster instance
_forecaster = None


def get_forecaster():
    """Get or create the global forecaster instance"""
    global _forecaster
    if _forecaster is None:
        _forecaster = LSTMForecaster()
    return _forecaster


def forecast_daily_spend(history, horizon=30):
    """Main entry point for forecasting"""
    forecaster = get_forecaster()

    # Try to train if we have enough data
    if len(history) >= 10:
        forecaster.train_model(history)

    return forecaster.forecast(history, horizon)
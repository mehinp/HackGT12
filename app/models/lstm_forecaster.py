from __future__ import annotations
import numpy as np

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

def _numpy_forecast(history: np.ndarray, horizon: int) -> np.ndarray:
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

def forecast_daily_spend(history, horizon=30):
    horizon = int(horizon)
    if not _HAS_TORCH:
        return _numpy_forecast(np.array(history or [], dtype=float), horizon)

    h = np.array(history or [], dtype=float).reshape(-1)
    if h.size < 10:
        return _numpy_forecast(h, horizon)

    x = torch.tensor(h[:-1], dtype=torch.float32).view(1, -1, 1)
    y = torch.tensor(h[1:], dtype=torch.float32).view(1, -1, 1)

    model = _TinyLSTM(input_dim=1, hidden=32)
    opt = torch.optim.Adam(model.parameters(), lr=1e-2)
    loss_fn = nn.MSELoss()

    model.train()
    for _ in range(200):
        opt.zero_grad()
        pred = model(x)
        loss = loss_fn(pred.view_as(y[:, -1, :]), y[:, -1, :])
        loss.backward()
        opt.step()

    model.eval()
    with torch.no_grad():
        cur = torch.tensor(h[-10:], dtype=torch.float32).view(1, -1, 1)
        out = []
        for _ in range(horizon):
            nxt = model(cur)
            out.append(nxt.item())
            cur = torch.cat([cur[:, 1:, :], nxt.view(1, 1, 1)], dim=1)

    out = np.array(out, dtype=float)
    out = np.maximum(out, 0.0)
    return out

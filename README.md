# Hackathon ML Pipeline (Purchases → Score 0..1000 → Trajectory)

This repo contains:
- **FastAPI service** for scoring purchases and returning goal trajectories
- **GBM model** (XGBoost or LightGBM) with explainable, fast inference
- **Feature engineering** for temporal context (rolling windows, deviations, categorical one-hots)
- **CLI trainer** to train locally on synthetic or CSV transactions in <~30 minutes

## Quickstart

```bash
cd ml_service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Train locally (synthetic data)
python ../scripts/train_local.py --income 6000 --model-type xgboost --out-dir ./model_artifacts

# Run API
uvicorn app.main:app --reload --port 8000
```

### Request example
POST /score_purchase_batch
```json
{
  "user_id": 1,
  "income": 6000,
  "baseline_score": 750,
  "goal_amount": 3000,
  "current_savings": 500,
  "days_horizon": 90,
  "prior_scores": [750,748,752],
  "purchases": [
    {"user_id":1,"ts":"2025-08-25T12:00:00","merchant":"Coffee","category":"restaurants","amount":12.5,"is_recurring":0},
    {"user_id":1,"ts":"2025-08-26T18:45:00","merchant":"SuperMart","category":"groceries","amount":82.4,"is_recurring":0}
  ]
}
```

### Where to store code?
- Keep this service code in **/ml_service** as a standalone module. 
- Use a **Jupyter/Colab notebook** only for exploratory analysis; production code should live here.
- Commit the folder to your main repo (e.g., `/app/ml`) and call the API from your Spring Boot backend.

### Switching models
Set env `MODEL_TYPE=lightgbm` to use LightGBM. Default is XGBoost.

### Nessie + MySQL
- Configure `MYSQL_URL` and `NESSIE_API_KEY` in environment. 
- Add data adapters in `app/data/` to pull mock transactions from Nessie or real ones from MySQL.

### Graph updates
The API returns `update_graph` flag so the frontend updates only on meaningful changes.

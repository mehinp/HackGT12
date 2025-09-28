import requests
import json
import time

BASE_URL = "http://127.0.0.1:8080"

def test_apis_without_database():
    print("Testing ML Service APIs (without database)...")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing /health")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ SUCCESS: Health check passed")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 2: Original score_purchase_batch endpoint
    print("\n2. Testing /score_purchase_batch")
    try:
        test_data = {
            "income": 6000,
            "baseline_score": 750,
            "days_horizon": 120,
            "projection_mode": "piecewise",
            "goal_amount": 5000,
            "current_savings": 1000,
            "purchases": [
                {
                    "user_id": 0,
                    "ts": "2024-01-01",
                    "merchant": "coffee_shop",
                    "category": "food",
                    "amount": 50.0,
                    "is_recurring": False,
                    "description": "morning coffee"
                }
            ]
        }
        response = requests.post(f"{BASE_URL}/score_purchase_batch", json=test_data)
        if response.status_code == 200:
            result = response.json()
            trajectory = result["money_projection"]["trajectory"]
            print(f"✅ SUCCESS: Score batch working - Trajectory range: ${min(trajectory):.2f} to ${max(trajectory):.2f}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 3: Original get_graph_data endpoint
    print("\n3. Testing /get_graph_data (original)")
    try:
        response = requests.post(f"{BASE_URL}/get_graph_data", json=test_data)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Graph data working - Data points: {len(result['data_points']['days'])}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 50)
    print("API Testing Complete!")
    print("\nNote: Database-dependent endpoints require MySQL setup.")
    print("Run 'mysql -u root -p < database_schema.sql' to set up the database.")

if __name__ == "__main__":
    test_apis_without_database()

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://127.0.0.1:8080"

def test_all_apis():
    print("Testing all ML Service APIs...")
    print("=" * 50)
    
    # Test 1: Set User ID (Login)
    print("\n1. Testing /set_user_id (User Login)")
    login_data = {"user_id": 1}
    try:
        response = requests.post(f"{BASE_URL}/set_user_id", json=login_data)
        if response.status_code == 200:
            result = response.json()
            session_id = result["session_id"]
            print(f"✅ SUCCESS: User logged in, session_id: {session_id[:8]}...")
        else:
            print(f" FAILED: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f" ERROR: {e}")
        return
    
    # Test 2: Get User Info
    print("\n2. Testing /get_user_info")
    try:
        headers = {"X-Session-ID": session_id}
        response = requests.get(f"{BASE_URL}/get_user_info", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f" SUCCESS: User info retrieved - Income: ${result['income_per_month']}")
        else:
            print(f" FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 3: Get User Purchases
    print("\n3. Testing /get_user_purchases")
    try:
        response = requests.get(f"{BASE_URL}/get_user_purchases", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Retrieved {len(result)} purchases")
            if result:
                print(f"   Sample purchase: ${result[0]['amount']} at {result[0]['merchant']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 4: Get New Purchases (with model retraining)
    print("\n4. Testing /get_purchases (with model retraining)")
    try:
        response = requests.get(f"{BASE_URL}/get_purchases", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: {result['new_purchases_count']} new purchases, model retrained: {result['model_retrained']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 5: Get Graph Data (with user data)
    print("\n5. Testing /get_graph_data (with user data)")
    try:
        graph_request = {
            "days_horizon": 120,
            "projection_mode": "piecewise",
            "goal_amount": 5000,
            "current_savings": 1000
        }
        response = requests.post(f"{BASE_URL}/get_graph_data", json=graph_request, headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Graph data generated")
            print(f"   User ID: {result['metadata']['user_id']}")
            print(f"   Income: ${result['metadata']['income_monthly']}")
            print(f"   Money Score: {result['metadata']['money_score']:.2f}")
            print(f"   Data points: {len(result['data_points']['days'])}")
            print(f"   Purchase scores: {len(result['purchase_scores']['scores'])}")
            
            # Show trajectory variation
            trajectory = result['data_points']['projected_savings']
            print(f"   Trajectory range: ${min(trajectory):.2f} to ${max(trajectory):.2f}")
            print(f"   Trajectory variation: ${max(trajectory) - min(trajectory):.2f}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 6: Test with different user
    print("\n6. Testing with different user (User ID 2)")
    try:
        login_data_2 = {"user_id": 2}
        response = requests.post(f"{BASE_URL}/set_user_id", json=login_data_2)
        if response.status_code == 200:
            result = response.json()
            session_id_2 = result["session_id"]
            print(f"✅ SUCCESS: User 2 logged in, session_id: {session_id_2[:8]}...")
            
            # Get user 2's graph data
            headers_2 = {"X-Session-ID": session_id_2}
            response = requests.post(f"{BASE_URL}/get_graph_data", json=graph_request, headers=headers_2)
            if response.status_code == 200:
                result = response.json()
                print(f"✅ SUCCESS: User 2's graph data - Income: ${result['metadata']['income_monthly']}")
            else:
                print(f"❌ FAILED: {response.status_code} - {response.text}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 50)
    print("API Testing Complete!")

if __name__ == "__main__":
    test_all_apis()

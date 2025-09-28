import requests
import json
import time
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8080"

def test_goal_management_apis():
    print("Testing Goal Management APIs...")
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
            print(f"❌ FAILED: {response.status_code} - {response.text}")
            return
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return
    
    headers = {"X-Session-ID": session_id}
    
    # Test 2: Get Goal (should return empty if no goal set)
    print("\n2. Testing /get_goal (initial - should be empty)")
    try:
        response = requests.get(f"{BASE_URL}/get_goal", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result == {}:
                print("✅ SUCCESS: No goal set (empty response)")
            else:
                print(f"✅ SUCCESS: Goal found - Amount: ${result['goal_amount']}, Date: {result['target_date']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 3: Set Goal
    print("\n3. Testing /set_goal")
    try:
        future_date = (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d')
        goal_data = {
            "goal_amount": 10000.0,
            "target_date": future_date
        }
        response = requests.post(f"{BASE_URL}/set_goal", json=goal_data, headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Goal set - Amount: ${result['goal']['goal_amount']}, Date: {result['goal']['target_date']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 4: Get Goal (should now return the goal)
    print("\n4. Testing /get_goal (after setting)")
    try:
        response = requests.get(f"{BASE_URL}/get_goal", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result != {}:
                print(f"✅ SUCCESS: Goal retrieved - Amount: ${result['goal_amount']}, Date: {result['target_date']}")
            else:
                print("❌ FAILED: Goal not found after setting")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 5: Update Goal
    print("\n5. Testing /set_goal (update existing goal)")
    try:
        future_date = (datetime.now() + timedelta(days=180)).strftime('%Y-%m-%d')
        goal_data = {
            "goal_amount": 15000.0,
            "target_date": future_date
        }
        response = requests.post(f"{BASE_URL}/set_goal", json=goal_data, headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Goal updated - Amount: ${result['goal']['goal_amount']}, Date: {result['goal']['target_date']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 6: Test Graph Data with Goal
    print("\n6. Testing /get_graph_data (with user goal)")
    try:
        graph_request = {
            "days_horizon": 120,
            "projection_mode": "piecewise",
            "current_savings": 1000
        }
        response = requests.post(f"{BASE_URL}/get_graph_data", json=graph_request, headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Graph data with goal generated")
            print(f"   Goal Amount: ${result['metadata']['goal_amount']}")
            print(f"   Target Date: {result['metadata']['target_date']}")
            print(f"   Has Goal: {result['metadata']['has_goal']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 7: Delete Goal
    print("\n7. Testing /delete_goal")
    try:
        response = requests.delete(f"{BASE_URL}/delete_goal", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: {result['message']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 8: Get Goal (should be empty again)
    print("\n8. Testing /get_goal (after deletion)")
    try:
        response = requests.get(f"{BASE_URL}/get_goal", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result == {}:
                print("✅ SUCCESS: Goal deleted (empty response)")
            else:
                print(f"❌ FAILED: Goal still exists: {result}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 50)
    print("Goal Management API Testing Complete!")

if __name__ == "__main__":
    test_goal_management_apis()

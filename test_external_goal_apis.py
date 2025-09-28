import requests
import json
import time
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8080"

def test_external_goal_apis():
    print("Testing External Goal API Integration...")
    print("=" * 60)
    
    # Test 1: Test External API Connection
    print("\n1. Testing External API Connection")
    try:
        response = requests.get(f"{BASE_URL}/test_external_api")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ External API Status: {result['external_api_available']}")
            print(f"   URL: {result['external_api_url']}")
            print(f"   Message: {result['message']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 2: Set User ID (Login)
    print("\n2. Testing /set_user_id (User Login)")
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
    
    # Test 3: Get External Goal
    print("\n3. Testing /get_external_goal")
    try:
        response = requests.get(f"{BASE_URL}/get_external_goal", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result == {}:
                print("✅ SUCCESS: No external goal found (empty response)")
            else:
                print(f"✅ SUCCESS: External goal found")
                print(f"   Amount: ${result['goal_amount']}")
                print(f"   Target Date: {result['target_date']}")
                print(f"   Source: {result['source']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 4: Sync External Goal
    print("\n4. Testing /sync_external_goal")
    try:
        response = requests.post(f"{BASE_URL}/sync_external_goal", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✅ SUCCESS: {result['message']}")
                if result['goal']:
                    print(f"   Local Goal Amount: ${result['goal']['goal_amount']}")
                    print(f"   Local Goal Date: {result['goal']['target_date']}")
                if result['external_goal']:
                    print(f"   External Goal Amount: ${result['external_goal']['goal_amount']}")
                    print(f"   External Goal Date: {result['external_goal']['target_date']}")
            else:
                print(f"⚠️  INFO: {result['message']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 5: Get Goal with External Fallback
    print("\n5. Testing /get_goal_with_external")
    try:
        response = requests.get(f"{BASE_URL}/get_goal_with_external", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result == {}:
                print("✅ SUCCESS: No goal found anywhere")
            else:
                print(f"✅ SUCCESS: Goal found from {result['source']}")
                goal = result['goal']
                print(f"   Amount: ${goal['goal_amount']}")
                print(f"   Target Date: {goal['target_date']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 6: Test Graph Data with External Goal
    print("\n6. Testing /get_graph_data (with external goal integration)")
    try:
        graph_request = {
            "days_horizon": 120,
            "projection_mode": "piecewise",
            "current_savings": 1000
        }
        response = requests.post(f"{BASE_URL}/get_graph_data", json=graph_request, headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Graph data generated")
            print(f"   Goal Amount: ${result['metadata']['goal_amount']}")
            print(f"   Target Date: {result['metadata']['target_date']}")
            print(f"   Has Goal: {result['metadata']['has_goal']}")
            print(f"   User ID: {result['metadata']['user_id']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("External Goal API Integration Testing Complete!")
    print("\nNew APIs Added:")
    print("  GET  /get_external_goal - Get goal from external API")
    print("  POST /sync_external_goal - Sync external goal to local DB")
    print("  GET  /get_goal_with_external - Get goal with external fallback")
    print("  GET  /test_external_api - Test external API connection")

if __name__ == "__main__":
    test_external_goal_apis()

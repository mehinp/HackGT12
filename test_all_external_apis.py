import requests
import json
import time
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8080"

def test_all_external_apis():
    print("Testing All External API Integrations...")
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
    
    # Test 3: Get External User
    print("\n3. Testing /get_external_user")
    try:
        response = requests.get(f"{BASE_URL}/get_external_user", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result == {}:
                print("✅ SUCCESS: No external user found (empty response)")
            else:
                print(f"✅ SUCCESS: External user found")
                print(f"   User ID: {result['user_id']}")
                print(f"   Income: ${result['income_per_month']}")
                print(f"   Source: {result['source']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 4: Get External Purchases
    print("\n4. Testing /get_external_purchases")
    try:
        response = requests.get(f"{BASE_URL}/get_external_purchases", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Found {len(result)} external purchases")
            if result:
                sample = result[0]
                print(f"   Sample Purchase:")
                print(f"     Amount: ${sample['amount']}")
                print(f"     Category: {sample['category']}")
                print(f"     Merchant: {sample['merchant']}")
                print(f"     Source: {sample['source']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 5: Sync External User
    print("\n5. Testing /sync_external_user")
    try:
        response = requests.post(f"{BASE_URL}/sync_external_user", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✅ SUCCESS: {result['message']}")
                print(f"   Income: ${result['user']['income_per_month']}")
            else:
                print(f"⚠️  INFO: {result['message']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 6: Sync External Purchases
    print("\n6. Testing /sync_external_purchases")
    try:
        response = requests.post(f"{BASE_URL}/sync_external_purchases", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✅ SUCCESS: {result['message']}")
                print(f"   Total Purchases: {result['total_purchases']}")
                print(f"   Synced Purchases: {result['synced_purchases']}")
            else:
                print(f"⚠️  INFO: {result['message']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 7: Get External Goal
    print("\n7. Testing /get_external_goal")
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
    
    # Test 8: Sync External Goal
    print("\n8. Testing /sync_external_goal")
    try:
        response = requests.post(f"{BASE_URL}/sync_external_goal", headers=headers)
        if response.status_code == 200:
            result = response.json()
            if result['success']:
                print(f"✅ SUCCESS: {result['message']}")
                if result['goal']:
                    print(f"   Local Goal Amount: ${result['goal']['goal_amount']}")
                    print(f"   Local Goal Date: {result['goal']['target_date']}")
            else:
                print(f"⚠️  INFO: {result['message']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 9: Test Complete Workflow with External Data
    print("\n9. Testing Complete Workflow with External Data")
    try:
        graph_request = {
            "days_horizon": 120,
            "projection_mode": "piecewise",
            "current_savings": 1000
        }
        response = requests.post(f"{BASE_URL}/get_graph_data", json=graph_request, headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Graph data generated with external data")
            print(f"   Goal Amount: ${result['metadata']['goal_amount']}")
            print(f"   Target Date: {result['metadata']['target_date']}")
            print(f"   Income: ${result['metadata']['income_monthly']}")
            print(f"   Has Goal: {result['metadata']['has_goal']}")
            print(f"   User ID: {result['metadata']['user_id']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 60)
    print("All External API Integration Testing Complete!")
    print("\nExternal APIs Added:")
    print("  GET  /get_external_user - Get user from external API")
    print("  GET  /get_external_purchases - Get purchases from external API")
    print("  POST /sync_external_user - Sync user to local DB")
    print("  POST /sync_external_purchases - Sync purchases to local DB")
    print("  GET  /get_external_goal - Get goal from external API")
    print("  POST /sync_external_goal - Sync goal to local DB")
    print("  GET  /test_external_api - Test external API connection")

if __name__ == "__main__":
    test_all_external_apis()

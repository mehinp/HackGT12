import requests
import json

BASE_URL = "http://127.0.0.1:8080"

def test_clean_apis():
    print("Testing Clean APIs (No Database)...")
    print("=" * 50)
    
    # Test 1: Health Check
    print("\n1. Testing /health")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: {result['status']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 2: Get External User
    print("\n2. Testing /get_external_user")
    try:
        response = requests.get(f"{BASE_URL}/get_external_user?user_id=1")
        if response.status_code == 200:
            result = response.json()
            if result == {}:
                print("✅ SUCCESS: No external user found")
            else:
                print(f"✅ SUCCESS: External user found")
                print(f"   User ID: {result['user_id']}")
                print(f"   Income: ${result['income_per_month']}")
                print(f"   Source: {result['source']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 3: Get External Purchases
    print("\n3. Testing /get_external_purchases")
    try:
        response = requests.get(f"{BASE_URL}/get_external_purchases?user_id=1")
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
    
    # Test 4: Get External Goal
    print("\n4. Testing /get_external_goal")
    try:
        response = requests.get(f"{BASE_URL}/get_external_goal?user_id=1")
        if response.status_code == 200:
            result = response.json()
            if result == {}:
                print("✅ SUCCESS: No external goal found")
            else:
                print(f"✅ SUCCESS: External goal found")
                print(f"   Amount: ${result['goal_amount']}")
                print(f"   Target Date: {result['target_date']}")
                print(f"   Source: {result['source']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 5: Goal Data with Header
    print("\n5. Testing /goal-data (with X-User-Id header)")
    try:
        headers = {"X-User-Id": "1"}
        response = requests.get(f"{BASE_URL}/goal-data", headers=headers)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Goal data retrieved")
            print(f"   Saved: {result.get('saved')}")
            print(f"   End Date: {result.get('endDate')}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    # Test 6: Generate Graph Data (Core ML API)
    print("\n6. Testing /get_graph_data (Core ML API)")
    try:
        graph_request = {
            "days_horizon": 120,
            "projection_mode": "piecewise",
            "current_savings": 1000,
            "user_id": 1,
            "income_per_month": 6000,
            "goal_amount": 10000,
            "target_date": "2024-12-31",
            "purchases": [
                {
                    "user_id": 1,
                    "ts": "2024-01-01",
                    "merchant": "coffee_shop",
                    "category": "restaurants",
                    "amount": 5.50,
                    "is_recurring": False,
                    "description": "Morning coffee"
                }
            ]
        }
        response = requests.post(f"{BASE_URL}/get_graph_data", json=graph_request)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS: Graph data generated")
            print(f"   Goal Amount: ${result['metadata']['goal_amount']}")
            print(f"   Income: ${result['metadata']['income_monthly']}")
            print(f"   User ID: {result['metadata']['user_id']}")
            print(f"   Has Goal: {result['metadata']['has_goal']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 50)
    print("Clean API Testing Complete!")
    print("\nClean APIs (No Database):")
    print("  GET  /health - Health check")
    print("  GET  /get_external_user?user_id={id} - Get user from external API")
    print("  GET  /get_external_purchases?user_id={id} - Get purchases from external API")
    print("  GET  /get_external_goal?user_id={id} - Get goal from external API")
    print("  GET  /goal-data - Get goal data with X-User-Id header")
    print("  POST /get_graph_data - Generate ML projections")
    print("  POST /score_purchase_batch - Score purchases with PNG plot")

if __name__ == "__main__":
    test_clean_apis()

import requests
import json

BASE_URL = "http://127.0.0.1:8080"

def test_essential_apis():
    print("Testing Essential APIs Only...")
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
    
    # Test 2: Get External User
    print("\n2. Testing /get_external_user")
    try:
        response = requests.get(f"{BASE_URL}/get_external_user", headers=headers)
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
    
    # Test 4: Get External Goal
    print("\n4. Testing /get_external_goal")
    try:
        response = requests.get(f"{BASE_URL}/get_external_goal", headers=headers)
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
    
    # Test 5: Generate Graph Data (Core ML API)
    print("\n5. Testing /get_graph_data (Core ML API)")
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
            print(f"   Income: ${result['metadata']['income_monthly']}")
            print(f"   User ID: {result['metadata']['user_id']}")
        else:
            print(f"❌ FAILED: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print("\n" + "=" * 50)
    print("Essential API Testing Complete!")
    print("\nEssential APIs:")
    print("  POST /set_user_id - User login")
    print("  GET  /get_external_user - Get user from external API")
    print("  GET  /get_external_purchases - Get purchases from external API")
    print("  GET  /get_external_goal - Get goal from external API")
    print("  POST /get_graph_data - Generate ML projections")

if __name__ == "__main__":
    test_essential_apis()

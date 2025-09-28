import requests
import json
from typing import Dict, Optional, Any, List
from datetime import datetime

class NessieClient:
    def __init__(self, api_key: str, base_url: str = "https://api.nessieisreal.com"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = 30
        self.headers = {
            "Content-Type": "application/json",
            "api-key": api_key
        }
    
    def get_customer(self, customer_id: str) -> Dict[str, Any]:
        """Get customer information from Nessie API"""
        try:
            url = f"{self.base_url}/customers/{customer_id}"
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting customer {customer_id}: {e}")
            return {}
    
    def get_purchase(self, purchase_id: str) -> Dict[str, Any]:
        """Get purchase information from Nessie API"""
        try:
            url = f"{self.base_url}/purchases/{purchase_id}"
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting purchase {purchase_id}: {e}")
            return {}
    
    def get_accounts(self, customer_id: str) -> List[Dict[str, Any]]:
        """Get all accounts for a customer from Nessie API"""
        try:
            url = f"{self.base_url}/customers/{customer_id}/accounts"
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting accounts for customer {customer_id}: {e}")
            return []
    
    def get_purchases(self, account_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Get purchases for an account from Nessie API"""
        try:
            url = f"{self.base_url}/accounts/{account_id}/purchases"
            params = {"limit": limit}
            response = requests.get(url, headers=self.headers, params=params, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting purchases for account {account_id}: {e}")
            return []
    
    def get_merchants(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get merchants from Nessie API"""
        try:
            url = f"{self.base_url}/merchants"
            params = {"limit": limit}
            response = requests.get(url, headers=self.headers, params=params, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting merchants: {e}")
            return []
    
    def get_merchant(self, merchant_id: str) -> Dict[str, Any]:
        """Get specific merchant from Nessie API"""
        try:
            url = f"{self.base_url}/merchants/{merchant_id}"
            response = requests.get(url, headers=self.headers, timeout=self.timeout)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error getting merchant {merchant_id}: {e}")
            return {}
    
    def test_connection(self) -> bool:
        """Test if Nessie API is accessible"""
        try:
            url = f"{self.base_url}/merchants"
            response = requests.get(url, headers=self.headers, timeout=10)
            return response.status_code == 200
        except:
            return False

# Example usage:
# nessie = NessieClient(api_key="your_api_key_here")
# customer = nessie.get_customer("customer_id")
# purchases = nessie.get_purchases("account_id")

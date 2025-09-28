# Complete External API Integration

## Overview
The ML Service now fully integrates with the external backend APIs at `http://143.215.104.239` to fetch user data, purchases, and goals, then sync them to the local database for ML processing.

## External APIs Integrated

### 1. User API
- **Endpoint**: `http://143.215.104.239/user/{userId}`
- **Purpose**: Get user information (income) by user ID
- **Data Extracted**: Income per month

### 2. Purchases API  
- **Endpoint**: `http://143.215.104.239/purchase/admin/user/{userId}`
- **Purpose**: Get all purchases for a specific user
- **Data Extracted**: Amount, category, merchant, purchase time
- **Category Normalization**: Maps external categories to internal format

### 3. Goals API
- **Endpoint**: `http://143.215.104.239/goals/my-goals?userId={userId}`
- **Purpose**: Get user's financial goal
- **Data Extracted**: Goal amount, target date

## New APIs Added (6 new endpoints)

### External User APIs
1. **GET /get_external_user** - Get user from external API
2. **POST /sync_external_user** - Sync user to local database

### External Purchases APIs  
3. **GET /get_external_purchases** - Get purchases from external API
4. **POST /sync_external_purchases** - Sync purchases to local database

### External Goal APIs
5. **GET /get_external_goal** - Get goal from external API
6. **POST /sync_external_goal** - Sync goal to local database

## Complete API List (25 total)

### 📊 Core ML APIs (4)
- `POST /score_purchase_batch` - Score purchases with PNG plot
- `POST /get_graph_data` - Structured data (2 versions)
- `POST /reload_model` - Reload ML model

### 👤 User Management APIs (4)
- `POST /set_user_id` - User login
- `GET /get_user_info` - Get user income
- `GET /get_user_purchases` - Get all purchases
- `GET /get_purchases` - Get new purchases + retrain model

### 🎯 Goal Management APIs (3)
- `GET /get_goal` - Get local goal
- `POST /set_goal` - Set/update goal
- `DELETE /delete_goal` - Delete goal

### 🌐 External User APIs (4) - NEW!
- `GET /get_external_user` - Get user from external API
- `POST /sync_external_user` - Sync user to local DB
- `GET /get_external_purchases` - Get purchases from external API
- `POST /sync_external_purchases` - Sync purchases to local DB

### 🎯 External Goal APIs (2) - NEW!
- `GET /get_external_goal` - Get goal from external API
- `POST /sync_external_goal` - Sync goal to local DB

### 🛠️ System APIs (8)
- `GET /health` - Health check
- `GET /test_external_api` - Test external API connection
- `GET /docs` - API documentation
- `GET /openapi.json` - OpenAPI spec
- `GET /redoc` - Alternative docs
- `GET /` - Root endpoint

## Data Transformation

### User Data
**External API Response**:
```json
{
    "id": "ext_user_123",
    "income": 6000.00
}
```

**Transformed to Internal Format**:
```json
{
    "user_id": 1,
    "income_per_month": 6000.00,
    "external_user_id": "ext_user_123",
    "source": "external_api"
}
```

### Purchase Data
**External API Response**:
```json
{
    "id": "ext_purchase_456",
    "amount": 50.00,
    "category": "restaurant",
    "merchant": "coffee_shop",
    "purchaseTime": "2024-01-01T08:30:00"
}
```

**Transformed to Internal Format**:
```json
{
    "id": "ext_purchase_456",
    "user_id": 1,
    "amount": 50.00,
    "category": "restaurants",
    "merchant": "coffee_shop",
    "purchase_time": "2024-01-01T08:30:00",
    "external_purchase_id": "ext_purchase_456",
    "source": "external_api"
}
```

### Goal Data
**External API Response**:
```json
{
    "id": "ext_goal_789",
    "amount": 10000.00,
    "timeframe": "2024-12-31"
}
```

**Transformed to Internal Format**:
```json
{
    "goal_amount": 10000.00,
    "target_date": "2024-12-31",
    "external_goal_id": "ext_goal_789",
    "source": "external_api"
}
```

## Category Normalization

The system automatically normalizes external categories to internal format:

```python
category_mapping = {
    "food": "food",
    "restaurant": "restaurants", 
    "dining": "restaurants",
    "grocery": "food",
    "groceries": "food",
    "entertainment": "entertainment",
    "electronics": "electronics",
    "clothing": "clothing",
    "health": "health",
    "medical": "health",
    "gym": "health",
    "fitness": "health",
    "utilities": "utilities",
    "rent": "rent",
    "housing": "rent",
    "transportation": "transportation",
    "gas": "transportation",
    "fuel": "transportation",
    "shopping": "other",
    "misc": "other",
    "other": "other"
}
```

## Complete Workflow

### 1. User Login and Data Sync
```javascript
// 1. User logs in
const loginResponse = await fetch('/set_user_id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 1 })
});
const { session_id } = await loginResponse.json();

// 2. Sync user data from external API
const userSyncResponse = await fetch('/sync_external_user', {
    method: 'POST',
    headers: { 'X-Session-ID': session_id }
});
const userSync = await userSyncResponse.json();

// 3. Sync purchases from external API
const purchasesSyncResponse = await fetch('/sync_external_purchases', {
    method: 'POST',
    headers: { 'X-Session-ID': session_id }
});
const purchasesSync = await purchasesSyncResponse.json();

// 4. Sync goal from external API
const goalSyncResponse = await fetch('/sync_external_goal', {
    method: 'POST',
    headers: { 'X-Session-ID': session_id }
});
const goalSync = await goalSyncResponse.json();
```

### 2. Generate Projections with Synced Data
```javascript
// 5. Generate projections using all synced data
const graphResponse = await fetch('/get_graph_data', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'X-Session-ID': session_id 
    },
    body: JSON.stringify({
        days_horizon: 120,
        projection_mode: 'piecewise',
        current_savings: 1000
    })
});
const graphData = await graphResponse.json();

// The graph data will use all synced external data
console.log(`Income: $${graphData.metadata.income_monthly}`);
console.log(`Goal: $${graphData.metadata.goal_amount}`);
console.log(`Target Date: ${graphData.metadata.target_date}`);
```

## Testing

### Test All External APIs
```bash
python test_all_external_apis.py
```

This will test:
1. External API connection
2. Getting external user data
3. Getting external purchases
4. Syncing user data to local database
5. Syncing purchases to local database
6. Getting external goals
7. Syncing goals to local database
8. Complete workflow with all external data

## Key Features

- **Complete Integration**: All external APIs integrated (user, purchases, goals)
- **Data Transformation**: External format converted to internal format
- **Category Normalization**: Automatic category mapping
- **Error Resilience**: Graceful handling when external APIs are down
- **Session Security**: All operations require valid user session
- **Real-time Sync**: Data syncs immediately when requested
- **ML Integration**: Synced data automatically used in projections
- **Fallback Support**: Local database first, external API as backup

## API URLs Summary

```
# External User APIs
GET    http://127.0.0.1:8080/get_external_user
POST   http://127.0.0.1:8080/sync_external_user

# External Purchases APIs
GET    http://127.0.0.1:8080/get_external_purchases
POST   http://127.0.0.1:8080/sync_external_purchases

# External Goal APIs
GET    http://127.0.0.1:8080/get_external_goal
POST   http://127.0.0.1:8080/sync_external_goal

# System APIs
GET    http://127.0.0.1:8080/test_external_api
```

The complete external API integration is now fully functional and ready for production use! 🚀

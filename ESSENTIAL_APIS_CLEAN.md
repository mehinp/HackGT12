# Essential ML Service APIs (Clean)

## Overview
Clean, essential ML Service with only the APIs you need, using your exact external API URLs.

## External APIs Integrated

### 1. getUserById
- **URL**: `http://143.215.104.239/user/{userId}`
- **Purpose**: Get user information (income) by user ID
- **Internal API**: `GET /get_external_user`

### 2. getAllPurchasesByUserId
- **URL**: `http://143.215.104.239/purchase/admin/user/{userId}`
- **Purpose**: Get all purchases for a specific user
- **Internal API**: `GET /get_external_purchases`

### 3. getGoalByUserId
- **URL**: `http://143.215.104.239/goals/my-goals?userId={userId}`
- **Purpose**: Get user's financial goal
- **Internal API**: `GET /get_external_goal`

## Essential API List (20 total)

### 📊 Core ML APIs (4)
- `POST /score_purchase_batch` - Score purchases with PNG plot
- `POST /get_graph_data` - Generate ML projections (2 versions)
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

### 🌐 External APIs (3) - YOUR APIs
- `GET /get_external_user` - Get user from external API
- `GET /get_external_purchases` - Get purchases from external API
- `GET /get_external_goal` - Get goal from external API

### 🛠️ System APIs (6)
- `GET /health` - Health check
- `GET /docs` - API documentation
- `GET /openapi.json` - OpenAPI spec
- `GET /redoc` - Alternative docs
- `GET /` - Root endpoint

## Data Flow

### 1. User Login
```javascript
const loginResponse = await fetch('/set_user_id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 1 })
});
const { session_id } = await loginResponse.json();
```

### 2. Get External Data
```javascript
const headers = { 'X-Session-ID': session_id };

// Get user from external API
const userResponse = await fetch('/get_external_user', { headers });
const user = await userResponse.json();

// Get purchases from external API
const purchasesResponse = await fetch('/get_external_purchases', { headers });
const purchases = await purchasesResponse.json();

// Get goal from external API
const goalResponse = await fetch('/get_external_goal', { headers });
const goal = await goalResponse.json();
```

### 3. Generate ML Projections
```javascript
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
```

## External API Data Transformation

### User Data
**External**: `http://143.215.104.239/user/{userId}`
```json
{
    "id": "ext_user_123",
    "income": 6000.00
}
```
**Internal Format**:
```json
{
    "user_id": 1,
    "income_per_month": 6000.00,
    "external_user_id": "ext_user_123",
    "source": "external_api"
}
```

### Purchase Data
**External**: `http://143.215.104.239/purchase/admin/user/{userId}`
```json
{
    "id": "ext_purchase_456",
    "amount": 50.00,
    "category": "restaurant",
    "merchant": "coffee_shop",
    "purchaseTime": "2024-01-01T08:30:00"
}
```
**Internal Format**:
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
**External**: `http://143.215.104.239/goals/my-goals?userId={userId}`
```json
{
    "id": "ext_goal_789",
    "amount": 10000.00,
    "timeframe": "2024-12-31"
}
```
**Internal Format**:
```json
{
    "goal_amount": 10000.00,
    "target_date": "2024-12-31",
    "external_goal_id": "ext_goal_789",
    "source": "external_api"
}
```

## Testing

### Test Essential APIs
```bash
python test_essential_apis.py
```

## Key Features

- **Clean & Essential**: Only the APIs you need
- **Exact URLs**: Uses your exact external API URLs
- **Simple GET Requests**: Direct calls to your external APIs
- **Data Transformation**: Converts external format to internal format
- **Category Normalization**: Maps external categories to internal format
- **Session Security**: All operations require valid user session
- **ML Integration**: External data used in projections

## API URLs Summary

```
# Your External APIs
GET    http://127.0.0.1:8080/get_external_user
GET    http://127.0.0.1:8080/get_external_purchases  
GET    http://127.0.0.1:8080/get_external_goal

# Core ML API
POST   http://127.0.0.1:8080/get_graph_data

# User Management
POST   http://127.0.0.1:8080/set_user_id
```

The essential ML Service is now clean and ready for production! 🚀

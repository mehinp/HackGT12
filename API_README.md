# ML Service API Documentation

## Overview
This ML Service provides 5 REST APIs for managing user sessions, retrieving purchase data, and generating financial projections using machine learning models.

## API Architecture

### 1. User Session Management
- **POST /set_user_id** - Login and create session
- **GET /get_user_info** - Get user income information
- **GET /get_user_purchases** - Get all user purchases
- **GET /get_purchases** - Get new purchases and retrain model
- **POST /get_graph_data** - Generate financial projection graph data

### 2. Database Schema
```sql
-- User Information Table
user_information (
    user_id INT PRIMARY KEY,
    income_per_month DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Purchases Table
purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    merchant VARCHAR(200) NOT NULL,
    purchase_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP
)
```

## API Endpoints

### 1. POST /set_user_id
**Purpose**: Login user and create session
**Request Body**:
```json
{
    "user_id": 1
}
```
**Response**:
```json
{
    "success": true,
    "session_id": "uuid-string",
    "user_id": 1,
    "message": "User ID set successfully"
}
```

### 2. GET /get_user_info
**Purpose**: Get user income information
**Headers**: `X-Session-ID: session_id`
**Response**:
```json
{
    "user_id": 1,
    "income_per_month": 6000.00
}
```

### 3. GET /get_user_purchases
**Purpose**: Get all user purchases
**Headers**: `X-Session-ID: session_id`
**Query Parameters**: `limit` (optional, default: 1000)
**Response**:
```json
[
    {
        "id": 1,
        "user_id": 1,
        "amount": 50.00,
        "category": "food",
        "merchant": "coffee_shop",
        "purchase_time": "2024-01-01T08:30:00"
    }
]
```

### 4. GET /get_purchases
**Purpose**: Get new purchases and retrain ML model
**Headers**: `X-Session-ID: session_id`
**Response**:
```json
{
    "success": true,
    "new_purchases_count": 5,
    "purchases": [...],
    "model_retrained": true
}
```

### 5. POST /get_graph_data
**Purpose**: Generate financial projection graph data
**Headers**: `X-Session-ID: session_id`
**Request Body**:
```json
{
    "days_horizon": 120,
    "projection_mode": "piecewise",
    "goal_amount": 5000,
    "current_savings": 1000
}
```
**Response**:
```json
{
    "metadata": {
        "current_savings": 1000.0,
        "goal_amount": 5000.0,
        "income_monthly": 6000.0,
        "days_horizon": 120,
        "projection_mode": "piecewise",
        "money_score": 768.76,
        "model_error": null,
        "user_id": 1
    },
    "data_points": {
        "days": [0, 1, 2, ...],
        "projected_savings": [1000.0, 1010.4, 1030.0, ...],
        "ideal_plan": [1000.0, 1020.0, 1040.0, ...],
        "goal_line": [5000.0, 5000.0, 5000.0, ...]
    },
    "time_series": {
        "daily_net_savings": [...],
        "daily_income": [...],
        "llm_adjustments": [...],
        "trend_factor": [...]
    },
    "purchase_scores": {
        "scores": [747.7, 749.7, ...],
        "used_features": ["dow", "hour", "month", ...]
    },
    "views": {
        "week": {...},
        "month": {...},
        "full_horizon": {...}
    }
}
```

## Setup Instructions

### 1. Database Setup
```bash
# Create MySQL database
mysql -u root -p < database_schema.sql
```

### 2. Environment Configuration
Create `.env` file:
```
DB_HOST=localhost
DB_NAME=ml_service_db
DB_USER=root
DB_PASSWORD=your_password
DB_PORT=3306
MODEL_DIR=./model_artifacts
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Service
```bash
uvicorn app.main:app --reload --port 8080
```

### 5. Test APIs
```bash
python test_all_apis.py
```

## Workflow

1. **User Login**: Frontend calls `/set_user_id` with user_id
2. **Get User Data**: Frontend calls `/get_user_info` to get income
3. **Get Purchases**: Frontend calls `/get_purchases` to get new purchases and retrain model
4. **Generate Graph**: Frontend calls `/get_graph_data` to get projection data
5. **Display Results**: Frontend uses the structured data to create visualizations

## Features

- **Session Management**: Secure user sessions with timeout
- **Model Retraining**: Automatic ML model updates with new purchase data
- **Realistic Projections**: Enhanced model with variation and non-linear growth
- **REST API**: Standard HTTP methods with JSON responses
- **MySQL Integration**: Persistent data storage
- **Error Handling**: Comprehensive error responses
- **CORS Support**: Cross-origin requests enabled

## Error Handling

All APIs return appropriate HTTP status codes:
- `200`: Success
- `401`: Unauthorized (invalid session)
- `404`: User not found
- `500`: Internal server error

Error responses include descriptive messages:
```json
{
    "detail": "Invalid or expired session"
}
```

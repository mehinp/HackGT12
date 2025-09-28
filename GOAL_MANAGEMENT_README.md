# Goal Management API Documentation

## Overview
The ML Service now includes comprehensive goal management functionality that allows users to set, retrieve, update, and delete their financial goals. Goals are automatically integrated into the financial projection system.

## New APIs Added

### 1. GET /get_goal
**Purpose**: Retrieve user's current financial goal
**Headers**: `X-Session-ID: session_id`
**Response**:
```json
{
    "id": 1,
    "user_id": 1,
    "goal_amount": 10000.00,
    "target_date": "2024-12-31",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
}
```
**Empty Response**: `{}` (if no goal is set)

### 2. POST /set_goal
**Purpose**: Set or update user's financial goal
**Headers**: `X-Session-ID: session_id`
**Request Body**:
```json
{
    "goal_amount": 10000.00,
    "target_date": "2024-12-31"
}
```
**Response**:
```json
{
    "success": true,
    "message": "Goal set successfully",
    "goal": {
        "id": 1,
        "user_id": 1,
        "goal_amount": 10000.00,
        "target_date": "2024-12-31",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }
}
```

### 3. DELETE /delete_goal
**Purpose**: Delete user's financial goal
**Headers**: `X-Session-ID: session_id`
**Response**:
```json
{
    "success": true,
    "message": "Goal deleted successfully"
}
```

## Enhanced /get_graph_data API

The `/get_graph_data` API now automatically uses the user's goal from the database:

**Enhanced Response**:
```json
{
    "metadata": {
        "current_savings": 1000.0,
        "goal_amount": 10000.0,  // From user's goal
        "income_monthly": 6000.0,
        "days_horizon": 120,
        "projection_mode": "piecewise",
        "money_score": 768.76,
        "model_error": null,
        "user_id": 1,
        "target_date": "2024-12-31",  // From user's goal
        "has_goal": true  // Indicates if user has a goal set
    },
    // ... rest of the response
}
```

## Database Schema

### Goals Table
```sql
CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_amount DECIMAL(10, 2) NOT NULL,
    target_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_information(user_id) ON DELETE CASCADE,
    INDEX idx_user_goals (user_id),
    UNIQUE KEY unique_user_goal (user_id)
);
```

## Workflow

### 1. User Login and Goal Check
```javascript
// 1. User logs in
const loginResponse = await fetch('/set_user_id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 1 })
});
const { session_id } = await loginResponse.json();

// 2. Check if user has a goal
const goalResponse = await fetch('/get_goal', {
    headers: { 'X-Session-ID': session_id }
});
const goal = await goalResponse.json();

if (Object.keys(goal).length === 0) {
    // No goal set, show goal creation form
    console.log('No goal set');
} else {
    // Goal exists, show current goal
    console.log(`Goal: $${goal.goal_amount} by ${goal.target_date}`);
}
```

### 2. Set/Update Goal
```javascript
// Set or update goal
const setGoalResponse = await fetch('/set_goal', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'X-Session-ID': session_id 
    },
    body: JSON.stringify({
        goal_amount: 10000.00,
        target_date: '2024-12-31'
    })
});
const result = await setGoalResponse.json();
```

### 3. Generate Projections with Goal
```javascript
// Get graph data (automatically uses user's goal)
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

// The graph data will use the user's goal automatically
console.log(`Projecting towards goal: $${graphData.metadata.goal_amount}`);
console.log(`Target date: ${graphData.metadata.target_date}`);
```

## Error Handling

All goal APIs return appropriate HTTP status codes:
- `200`: Success
- `401`: Unauthorized (invalid session)
- `404`: User not found
- `500`: Internal server error

## Testing

Run the goal management test:
```bash
python test_goal_apis.py
```

This will test:
1. Setting a goal
2. Retrieving a goal
3. Updating a goal
4. Generating projections with the goal
5. Deleting a goal
6. Verifying goal deletion

## Key Features

- **Automatic Integration**: Goals are automatically used in financial projections
- **Try-Catch Handling**: Returns empty JSON `{}` when no goal exists
- **Goal Persistence**: Goals are stored in MySQL database
- **Session-Based**: All goal operations require valid user session
- **Unique Goals**: Each user can have only one goal (updates existing)
- **Date Validation**: Target dates are stored as proper DATE format
- **Real-time Updates**: Goal changes immediately affect projections

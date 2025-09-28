# External Goal API Integration

## Overview
The ML Service now integrates with the external backend API at `http://143.215.104.239/goals/my-goals` to fetch user goals and sync them with the local database.

## New APIs Added

### 1. GET /get_external_goal
**Purpose**: Get user's goal directly from external backend API
**Headers**: `X-Session-ID: session_id`
**Response**:
```json
{
    "goal_amount": 10000.00,
    "target_date": "2024-12-31",
    "external_goal_id": "ext_123",
    "source": "external_api"
}
```
**Empty Response**: `{}` (if no goal found in external API)

### 2. POST /sync_external_goal
**Purpose**: Sync external goal to local database
**Headers**: `X-Session-ID: session_id`
**Response**:
```json
{
    "success": true,
    "message": "Goal synced successfully from external API",
    "goal": {
        "id": 1,
        "user_id": 1,
        "goal_amount": 10000.00,
        "target_date": "2024-12-31",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    },
    "external_goal": {
        "goal_amount": 10000.00,
        "target_date": "2024-12-31",
        "external_goal_id": "ext_123",
        "source": "external_api"
    }
}
```

### 3. GET /get_goal_with_external
**Purpose**: Get goal from local database, fallback to external API
**Headers**: `X-Session-ID: session_id`
**Response**:
```json
{
    "source": "local_database",  // or "external_api"
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

### 4. GET /test_external_api
**Purpose**: Test connection to external goal API
**Response**:
```json
{
    "external_api_available": true,
    "external_api_url": "http://143.215.104.239/goals/my-goals",
    "message": "External API is reachable"
}
```

## External API Integration

### External API Client
The `ExternalAPIClient` class handles communication with the external backend:

```python
class ExternalAPIClient:
    def __init__(self, base_url: str = "http://143.215.104.239"):
        self.base_url = base_url.rstrip("/")
        self.timeout = 30
    
    def get_goal_by_user_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        # Calls GET http://143.215.104.239/goals/my-goals?userId={user_id}
        # Transforms response to internal format
```

### Data Transformation
The external API response is transformed to match the internal format:

**External API Response**:
```json
{
    "amount": 10000.00,
    "timeframe": "2024-12-31",
    "id": "ext_123"
}
```

**Transformed to Internal Format**:
```json
{
    "goal_amount": 10000.00,
    "target_date": "2024-12-31",
    "external_goal_id": "ext_123",
    "source": "external_api"
}
```

## Workflow Integration

### 1. User Login and Goal Check
```javascript
// 1. User logs in
const loginResponse = await fetch('/set_user_id', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: 1 })
});
const { session_id } = await loginResponse.json();

// 2. Check for goal with external fallback
const goalResponse = await fetch('/get_goal_with_external', {
    headers: { 'X-Session-ID': session_id }
});
const goalData = await goalResponse.json();

if (Object.keys(goalData).length === 0) {
    console.log('No goal found anywhere');
} else {
    console.log(`Goal from ${goalData.source}: $${goalData.goal.goal_amount}`);
}
```

### 2. Sync External Goal
```javascript
// Sync external goal to local database
const syncResponse = await fetch('/sync_external_goal', {
    method: 'POST',
    headers: { 'X-Session-ID': session_id }
});
const syncResult = await syncResponse.json();

if (syncResult.success) {
    console.log('Goal synced successfully');
    console.log(`Amount: $${syncResult.goal.goal_amount}`);
    console.log(`Date: ${syncResult.goal.target_date}`);
}
```

### 3. Generate Projections with Synced Goal
```javascript
// Get graph data (automatically uses synced goal)
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

// The graph data will use the synced goal
console.log(`Projecting towards goal: $${graphData.metadata.goal_amount}`);
console.log(`Target date: ${graphData.metadata.target_date}`);
```

## Error Handling

### External API Errors
- **Connection Timeout**: Returns `{}` if external API is unreachable
- **Invalid Response**: Logs error and returns `None`
- **Network Issues**: Handles gracefully with fallback to local data

### Sync Errors
- **External API Unavailable**: Returns `success: false` with appropriate message
- **Database Sync Failure**: Returns HTTP 500 with error details
- **Invalid Data**: Validates and transforms data before syncing

## Testing

### Test External API Integration
```bash
python test_external_goal_apis.py
```

This will test:
1. External API connection
2. Getting external goals
3. Syncing external goals to local database
4. Fallback behavior
5. Graph data generation with synced goals

## Configuration

### Environment Variables
```bash
# External API Configuration (optional)
EXTERNAL_API_BASE_URL=http://143.215.104.239
EXTERNAL_API_TIMEOUT=30
```

### Default Configuration
- **Base URL**: `http://143.215.104.239`
- **Timeout**: 30 seconds
- **Parameter**: `userId` (adjustable in code)

## Key Features

- **Seamless Integration**: External goals automatically sync to local database
- **Fallback Support**: Local database first, external API as fallback
- **Data Transformation**: External API format converted to internal format
- **Error Resilience**: Graceful handling of external API failures
- **Session Security**: All operations require valid user session
- **Real-time Sync**: Goals sync immediately when requested
- **Dual Source Support**: Can work with both local and external goals

## API URLs Summary

```
GET    http://127.0.0.1:8080/get_external_goal
POST   http://127.0.0.1:8080/sync_external_goal
GET    http://127.0.0.1:8080/get_goal_with_external
GET    http://127.0.0.1:8080/test_external_api
```

The external goal integration is now fully functional and ready for production use! 🚀

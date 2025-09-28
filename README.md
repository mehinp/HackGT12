# 🎯 Metron Finance - Smart Financial Wellness Platform

A comprehensive financial management platform that gamifies personal finance through social features, AI-powered insights, and dynamic goal tracking with ML-driven score adjustments.

## 🚀 Project Overview
Metron Finance transforms financial management into an engaging, social experience. Users can track purchases, set savings goals, compete with friends on leaderboards, and receive personalized financial guidance through an AI chatbot.  
The platform uses machine learning to automatically assess goal adherence and adjust user scores in real time.

## ✨ Key Features

### 📊 Dynamic Financial Scoring
- Real-time financial health score (0-1000 range)
- ML model automatically adjusts scores based on goal adherence
- Visual progress tracking with intuitive score breakdowns
- Gamified achievement system with badges and levels

### 🎯 Smart Goal Management
- Create personalized financial goals (emergency funds, vacations, etc.)
- ML-powered progress prediction and timeline optimization
- Visual progress charts showing goal curves vs. actual trajectory
- Automated milestone tracking and celebrations

### 💳 Intelligent Purchase Tracking
- Easy transaction recording with category classification
- Score impact calculation for each purchase
- Spending pattern analysis and insights
- Monthly/weekly spending summaries

### 👥 Social Financial Community
- Friend-based leaderboards with emoji reactions
- Competitive scoring system to motivate financial wellness
- Social achievements and community challenges
- Privacy-focused sharing (scores only, not sensitive data)

### 🤖 AI Financial Assistant
- Context-aware chatbot for personalized financial advice
- Goal-specific recommendations and strategies
- Spending analysis and budgeting tips
- Educational content on financial literacy

### 📈 Advanced Analytics
- Spending trend visualization
- Goal progress forecasting using ML models
- Category-wise expense breakdown
- Financial health insights and recommendations

## 🛠 Tech Stack

### Frontend
- **React 18** – Modern UI with hooks and context
- **React Router** – Client-side routing
- **Recharts** – Data visualization and charts
- **CSS3** – Custom styling with utility classes
- **Responsive Design** – Mobile-first approach

### Backend
- **Spring Boot 3.5.6** – REST API framework
- **Java 21**
- **Spring Data JPA** – Database abstraction
- **Spring JDBC** – Direct database operations
- **Maven** – Dependency management

### Database
- **MySQL** – Primary data storage
- **JDBC** – Database connectivity
- **Connection pooling** – Optimized performance

### AI & ML
- **OpenAI GPT-4** – Conversational AI chatbot
- **Custom ML Model** – Goal-adherence prediction
- **FastAPI** – Python ML service integration
- **Real-time score adjustment** – Based on ML predictions

## 📁 Project Structure
````
metron-finance/
├── backend/ # Spring Boot API
│ ├── src/main/java/
│ │ └── com/finance/hackathon/
│ │ ├── config/ # CORS and security config
│ │ ├── domain/ # Entity models
│ │ ├── repository/ # Data access layer
│ │ ├── resource/ # REST controllers
│ │ ├── service/ # Business logic
│ │ └── queries/ # SQL queries
│ └── src/main/resources/
│ ├── application.yml # Spring configuration
│ └── schema.sql # Database schema
├── frontend/ # React application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page components
│ │ ├── context/ # React context providers
│ │ ├── hooks/ # Custom React hooks
│ │ ├── services/ # API service layer
│ │ └── index.css # Global styles
│ └── chatbot/ # AI chatbot service
│ └── money_tutor/
│ └── app.py # FastAPI chatbot server
├── ml-service/ # 🧠 Python machine learning module
│ ├── app/ # Core ML application package
│ │ ├── pycache/ # Compiled Python cache
│ │ ├── data/ # Training and test data
│ │ ├── features/ # Feature engineering scripts
│ │ ├── models/ # Trained models and model definitions
│ │ ├── utils/ # Helper functions (preprocessing, scoring, etc.)
│ │ ├── init.py # Makes app a Python package
│ │ ├── config.py # Model configuration & hyperparameters
│ │ └── main.py # FastAPI entrypoint exposing ML endpoints
│ └── requirements.txt # Python dependencies
└── README.md # This file

````
## How to Use

1. **Create Account**  
   Sign up with email, income, and expenditure information.  
   Your initial financial score is calculated automatically.

2. **Set Financial Goals**  
   Create specific savings goals with target amounts and timelines.  
   AI assistant provides personalized recommendations.  
   Track progress with visual charts and ML predictions.

3. **Record Purchases**  
   Log transactions with merchant, amount, and category.  
   View real-time score impact for each purchase.  
   Analyze spending patterns over time.

4. **Connect with Friends**  
   Add friends by email address.  
   Compete on leaderboards based on financial scores.  
   Share achievements and motivate each other.

5. **Get AI Guidance**  
   Chat with the AI financial assistant.  
   Receive personalized advice based on your financial data.  
   Learn about budgeting, saving, and investing.

## 🧠 ML Model Features

### Goal Adherence Prediction
- Analyzes spending patterns vs. goal timelines
- Predicts and visually graphs likelihood of achieving financial goals
- Automatically adjusts user scores based on progress

### Smart Score Calculation
- Income-to-expenditure ratio analysis
- Goal progress weighting
- Purchase category impact assessment
- Time-based trend analysis

### Real-time Adjustments
- Continuous model evaluation
- Dynamic score updates
- Predictive goal timeline adjustments
- Personalized recommendation engine

## 🔗 API Endpoints

> **Header requirement**  
> Many endpoints require the header:  
> `X-User-Id: <long>` – ID of the authenticated user.  
> If missing, the server responds with **401 Unauthorized**.

### 👤 Authentication & User
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/user/register` | Create a new user account. Body: `User` JSON. |
| **POST** | `/user/login` | Authenticate with email & password. Returns `User` object on success. |
| **POST** | `/user/logout` | Invalidate the current session. |
| **GET**  | `/user/{id}` | Retrieve a user by ID. |
| **GET**  | `/user/user-score` | Get the current user’s score. Requires `X-User-Id`. |
| **PATCH**| `/user/update-score` | Update the user’s score. Requires `X-User-Id`. Body: `{ "score": <int> }`. |

### 💳 Purchases
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/purchase/record` | Record a new purchase. Requires `X-User-Id`. Body: `Purchase` JSON. |
| **GET**  | `/purchase/my-purchases` | Retrieve all purchases for the authenticated user. |
| **GET**  | `/purchase/admin/{id}` | Admin: Get a single purchase by purchase ID. |
| **GET**  | `/purchase/admin/user/{userId}` | Admin: Get all purchases for a specific user ID. |

### 🎯 Goals
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/goals/new` | Create a financial goal. Requires `X-User-Id`. Body: `Goal` JSON. |
| **GET**  | `/goals/my-goals` | Retrieve the goal for the current user. Returns an `Optional<Goal>`. |

### 🏆 Social / Leaderboard
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/leaderboard/new-friend/{friendEmail}` | Add a friend by email. Requires `X-User-Id`. |
| **GET**  | `/leaderboard/count` | Get the number of friends for the current user. |
| **GET**  | `/leaderboard/rankings` | Get a sorted list of friends **plus the current user**, ranked by `score` (descending). |

### 📊 Dashboard
| Method | Endpoint | Description |
|--------|---------|-------------|
| **GET** | `/dashboard/{userId}` | Retrieve a full dashboard summary (income, expenditures, latest purchase info, goal progress, and score) for the given user ID. |

---

Enjoy and remember to be wise with your money!

Transform your financial future with Metron Finance – where smart money management meets social motivation! 🚀💰
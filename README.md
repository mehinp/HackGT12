# 🎯 Metron Finance - Smart Financial Wellness Platform

A comprehensive financial management platform that gamifies personal finance through social features, AI-powered insights, and dynamic goal tracking with ML-driven score adjustments.

## 🚀 Project Overview

Metron Finance transforms financial management into an engaging, social experience. Users can track purchases, set savings goals, compete with friends on leaderboards, and receive personalized financial guidance through an AI chatbot. The platform uses machine learning to automatically assess goal adherence and adjust user scores in real-time.

## ✨ Key Features

### 📊 **Dynamic Financial Scoring**
- Real-time financial health score (0-1000 range)
- ML model automatically adjusts scores based on goal adherence
- Visual progress tracking with intuitive score breakdowns
- Gamified achievement system with badges and levels

### 🎯 **Smart Goal Management**
- Create personalized financial goals (emergency funds, vacations, etc.)
- ML-powered progress prediction and timeline optimization
- Visual progress charts showing goal curves vs. actual trajectory
- Automated milestone tracking and celebrations

### 💳 **Intelligent Purchase Tracking**
- Easy transaction recording with category classification
- Score impact calculation for each purchase
- Spending pattern analysis and insights
- Monthly/weekly spending summaries

### 👥 **Social Financial Community**
- Friend-based leaderboards with emoji reactions
- Competitive scoring system to motivate financial wellness
- Social achievements and community challenges
- Privacy-focused sharing (scores only, not sensitive data)

### 🤖 **AI Financial Assistant**
- Context-aware chatbot for personalized financial advice
- Goal-specific recommendations and strategies
- Spending analysis and budgeting tips
- Educational content on financial literacy

### 📈 **Advanced Analytics**
- Spending trend visualization
- Goal progress forecasting using ML models
- Category-wise expense breakdown
- Financial health insights and recommendations

## 🛠 Tech Stack

### **Frontend**
- **React 18** - Modern UI with hooks and context
- **React Router** - Client-side routing
- **Recharts** - Data visualization and charts
- **CSS3** - Custom styling with utility classes
- **Responsive Design** - Mobile-first approach

### **Backend**
- **Spring Boot 3.5.6** - REST API framework
- **Java 21** - Java 
- **Spring Data JPA** - Database abstraction
- **Spring JDBC** - Direct database operations
- **Maven** - Dependency management

### **Database**
- **MySQL** - Primary data storage
- **JDBC** - Database connectivity
- **Connection pooling** - Optimized performance

### **AI & ML**
- **OpenAI GPT-4** - Conversational AI chatbot
- **Custom ML Model** - Goal adherence prediction
- **FastAPI** - Python ML service integration
- **Real-time score adjustment** - Based on ML predictions

## 📁 Project Structure

```
metron-finance/
├── backend/                    # Spring Boot API
│   ├── src/main/java/
│   │   └── com/finance/hackathon/
│   │       ├── config/         # CORS and security config
│   │       ├── domain/         # Entity models
│   │       ├── repository/     # Data access layer
│   │       ├── resource/       # REST controllers
│   │       ├── service/        # Business logic
│   │       └── queries/        # SQL queries
│   └── src/main/resources/
│       ├── application.yml     # Spring configuration
│       └── schema.sql         # Database schema
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   └── index.css         # Global styles
│   └── chatbot/              # AI chatbot service
│       └── money_tutor/
│           └── app.py        # FastAPI chatbot server
└── README.md                 # This file
```

## How to Use

### 1. **Create Account**
- Sign up with email, income, and expenditure information
- Your initial financial score is calculated automatically

### 2. **Set Financial Goals**
- Create specific savings goals with target amounts and timelines
- AI assistant provides personalized recommendations
- Track progress with visual charts and ML predictions

### 3. **Record Purchases**
- Log transactions with merchant, amount, and category
- View real-time score impact for each purchase
- Analyze spending patterns over time

### 4. **Connect with Friends**
- Add friends by email address
- Compete on leaderboards based on financial scores
- Share achievements and motivate each other

### 5. **Get AI Guidance**
- Chat with the AI financial assistant
- Receive personalized advice based on your financial data
- Learn about budgeting, saving, and investing

## 🧠 ML Model Features

### **Goal Adherence Prediction**
- Analyzes spending patterns vs. goal timelines
- Predicts likelihood of achieving financial goals
- Automatically adjusts user scores based on progress

### **Smart Score Calculation**
- Income-to-expenditure ratio analysis
- Goal progress weighting
- Purchase category impact assessment
- Time-based trend analysis

### **Real-time Adjustments**
- Continuous model evaluation
- Dynamic score updates
- Predictive goal timeline adjustments
- Personalized recommendation engine

## 🔗 API Endpoints

### **Authentication**
- `POST /user/register` - Create new account
- `POST /user/login` - User authentication
- `POST /user/logout` - End session

### **Purchases**
- `POST /purchase/record` - Log new purchase
- `GET /purchase/my-purchases` - Get user transactions

### **Goals**
- `POST /goals/new` - Create financial goal
- `GET /goals/my-goals` - Get user goals

### **Social Features**
- `POST /leaderboard/new-friend/{email}` - Add friend
- `GET /leaderboard/rankings` - Get leaderboard
- `GET /leaderboard/count` - Get friend count

### **Dashboard**
- `GET /dashboard/{userId}` - Get user dashboard data

___
Enjoy and remember to be wise with your money!

*Transform your financial future with Metron Finance - where smart money management meets social motivation!* 🚀💰
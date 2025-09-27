// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import ScoreWidget from '../components/Dashboard Widgets/ScoreWidget'
import QuickStatsWidget from '../components/Dashboard Widgets/QuickStatsWidget'

const Home = () => {
  const { user } = useAuthContext()
  const [userData, setUserData] = useState({
    creditScore: 500,
    scoreChange: 0
  })
  const [transactions, setTransactions] = useState([])
  const [goalsData, setGoalsData] = useState({
    activeGoal: null
  })

  // Calculate dynamic stats from transactions
  const monthlySpending = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const monthlyIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const activeGoals = goalsData.activeGoal ? 1 : 0

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with your actual API call
        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        }
      } catch (error) {
        console.error('Error fetching user stats:', error)
      }
    }

    if (user?.token) {
      fetchUserData()
    }
  }, [user])

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) return user.firstName
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const getCreditScoreColor = (score) => {
    if (score >= 800) return '#0f766e'
    if (score >= 740) return '#004977'
    if (score >= 670) return '#d97706'
    if (score >= 580) return '#ea580c'
    return '#D22E1E'
  }

  const getCreditScoreLabel = (score) => {
    if (score >= 800) return 'Excellent'
    if (score >= 740) return 'Very Good'
    if (score >= 670) return 'Good'
    if (score >= 580) return 'Fair'
    return 'Poor'
  }

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getTipOfTheDay = () => {
    const tips = [
      "Consider setting up automatic transfers to your savings account to build wealth consistently.",
      "Track your daily expenses to identify areas where you can save money.",
      "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt repayment.",
      "Review your subscriptions monthly and cancel ones you don't use.",
      "Set up price alerts for items you want to buy to get the best deals."
    ]
    const dayOfMonth = new Date().getDate()
    return tips[dayOfMonth % tips.length]
  }

  return (
    <div style={{
      padding: '1.5rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#dc2626'
        }}>
          Dashboard
        </h1>
      </div>



      {/* User Info Section */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#0f172a',
            textAlign: 'center'
          }}>
            Welcome Back, {getUserName()}
          </h2>
        </div>
        
        {/* Credit Score Widget */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <div style={{
              width: '100%',
              backgroundColor: '#e2e8f0',
              borderRadius: '0.375rem',
              height: '1rem',
              border: '1px solid #cbd5e1'
            }}>
              <div style={{
                height: '100%',
                borderRadius: '0.375rem',
                transition: 'all 0.5s ease',
                width: `${((userData.creditScore - 300) / 550) * 100}%`,
                backgroundColor: getCreditScoreColor(userData.creditScore)
              }} />
            </div>
          </div>
          
          {/* Score labels under the bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', color: '#64748b' }}>300</div>
              <div style={{ fontWeight: 'bold', color: '#D22E1E' }}>Poor</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', color: '#64748b' }}>600</div>
              <div style={{ fontWeight: 'bold', color: '#ea580c' }}>Fair</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', color: '#64748b' }}>700</div>
              <div style={{ fontWeight: 'bold', color: '#d97706' }}>Good</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'monospace', color: '#64748b' }}>850</div>
              <div style={{ fontWeight: 'bold', color: '#0f766e' }}>Excellent</div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0f172a' }}>
              {userData.creditScore}
            </span>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              Credit Score
            </div>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              color: getCreditScoreColor(userData.creditScore),
              marginTop: '0.5rem'
            }}>
              {getCreditScoreLabel(userData.creditScore)}
            </div>
          </div>
        </div>

        {/* Recent Activity Impact - Removed */}
        {/* This section has been removed as requested */}
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#2563eb' }}>
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#2563eb',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ACTIVE GOALS
            </h3>
          </div>
          <p style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#dc2626'
          }}>
            {activeGoals}
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '0.5rem'
          }}>
            In progress
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: '#10b981' }}>
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '700',
              color: '#2563eb',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              THIS MONTH
            </h3>
          </div>
          <p style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#dc2626'
          }}>
            ${Math.round(monthlySpending)}
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginTop: '0.5rem'
          }}>
            Spent
          </p>
        </div>
      </div>

      {/* Financial Overview */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: '#dc2626',
          marginBottom: '1.5rem'
        }}>
          Financial Overview
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.25rem',
              color: '#059669'
            }}>
              ${Math.round(monthlyIncome)}
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Income
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.25rem',
              color: '#dc2626'
            }}>
              ${Math.round(monthlySpending)}
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Expenses
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '0.25rem',
              color: '#2563eb'
            }}>
              ${Math.round(monthlyIncome - monthlySpending)}
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Net
            </p>
          </div>
        </div>
      </div>

      {/* Financial Insights Section - Moved to Bottom */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.375rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📈 Financial Insights
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#10b981',
              marginBottom: '0.5rem'
            }}>
              💡 Tip of the Day
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              {getTipOfTheDay()}
            </p>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#3b82f6',
              marginBottom: '0.5rem'
            }}>
              📊 This Month
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              lineHeight: '1.5'
            }}>
              You've spent ${monthlySpending.toLocaleString()} out of your ${monthlyIncome.toLocaleString()} income this month. Net: ${(monthlyIncome - monthlySpending).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
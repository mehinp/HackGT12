// src/pages/Home.jsx - Clean, working version with dynamic values
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'

const Home = () => {
  const { user } = useAuthContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [purchases, setPurchases] = useState([])
  const [goals, setGoals] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const userId = localStorage.getItem('userId')
        
        if (userId) {
          // Fetch purchases
          try {
            const purchasesResponse = await fetch('http://143.215.104.239:8080/purchase/my-purchases', {
              credentials: 'include',
              headers: {
                'X-User-Id': userId
              }
            })
            if (purchasesResponse.ok) {
              const data = await purchasesResponse.json()
              setPurchases(data.purchases || [])
            }
          } catch (e) {
            console.log('Could not fetch purchases:', e)
          }

          // Fetch goals
          try {
            const goalsResponse = await fetch('http://143.215.104.239:8080/goals/my-goals', {
              credentials: 'include',
              headers: {
                'X-User-Id': userId
              }
            })
            if (goalsResponse.ok) {
              const data = await goalsResponse.json()
              setGoals(data.goal ? [data.goal] : [])
            }
          } catch (e) {
            console.log('Could not fetch goals:', e)
          }
        }
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ----- Credit score helpers (proportional ticks + clamping) -----
  const SCORE_MIN = 0
  const SCORE_MAX = 1000
  const clamp = (v, min, max) => Math.min(Math.max(v ?? 0, min), max)
  const toPct = (v) => ((clamp(v, SCORE_MIN, SCORE_MAX) - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100

  const SCORE_TICKS = [
    { value: 300, label: 'Poor', color: '#D22E1E' },
    { value: 600, label: 'Fair', color: '#ea580c' },
    { value: 700, label: 'Good', color: '#d97706' },
    { value: 900, label: 'Excellent', color: '#0f766e' },
  ]
  // ---------------------------------------------------------------

  // Calculate dynamic values
  const monthlyIncome = user?.income || 0
  
  // Calculate monthly spending from purchases
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyPurchases = purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.purchaseTime || purchase.date)
    return purchaseDate.getMonth() === currentMonth && 
           purchaseDate.getFullYear() === currentYear
  })
  const monthlySpending = monthlyPurchases.reduce((total, purchase) => {
    return total + (parseFloat(purchase.amount) || 0)
  }, 0)

  const netAmount = monthlyIncome - monthlySpending
  const activeGoals = goals.length

  // Create a utility function for consistent score calculation
  const calculateUserScore = (userdata) => {
    let score = 500
    if (userdata?.income && userdata?.expenditures) {
      const ratio = userdata.income / userdata.expenditures
      if (ratio >= 2.0) score += 150
      else if (ratio >= 1.5) score += 100
      else if (ratio >= 1.2) score += 50
      else if (ratio >= 1.0) score += 25
      else score -= 100
      
      // Add user-specific variance for consistency
      const userId = parseInt(localStorage.getItem('userId')) || 0
      const variance = (userId % 100) - 50
      score += variance
    }
    return Math.max(0, Math.min(1000, Math.round(score)))
  }

  // Calculate dynamic financial score (consistent across app)
  const currentScore = calculateUserScore(user)

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) return user.firstName
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const getFinancialScoreColor = (score) => {
    if (score >= 800) return '#0f766e'
    if (score >= 740) return '#004977'
    if (score >= 700) return '#d97706'
    if (score >= 600) return '#ea580c'
    return '#D22E1E'
  }

  const getFinancialScoreLabel = (score) => {
    if (score >= 800) return 'Excellent'
    if (score >= 740) return 'Very Good'
    if (score >= 700) return 'Good'
    if (score >= 600) return 'Fair'
    return 'Poor'
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

  if (loading) {
    return (
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '1.125rem',
        color: '#6b7280'
      }}>
        Loading dashboard...
      </div>
    )
  }

  return (
    <div style={{
      padding: '1.5rem',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

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
        
        {/* Financial Score Widget */}
        <div style={{ marginBottom: '2rem' }}>
          {/* Score Display */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#0f172a' }}>
              {clamp(currentScore, SCORE_MIN, SCORE_MAX)}
            </span>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
              Financial Score
            </div>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              color: getFinancialScoreColor(currentScore),
              marginTop: '0.5rem'
            }}>
              {getFinancialScoreLabel(currentScore)}
            </div>
          </div>

          {/* Progress Bar Container */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            {/* Track */}
            <div style={{
              width: '100%',
              backgroundColor: '#e2e8f0',
              borderRadius: '0.375rem',
              height: '1rem',
              border: '1px solid #cbd5e1',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Fill (proportional + clamped) */}
              <div style={{
                height: '100%',
                borderRadius: '0.375rem',
                transition: 'width 0.5s ease',
                width: `${toPct(currentScore)}%`,
                backgroundColor: getFinancialScoreColor(currentScore)
              }} />
            </div>

            {/* Tick marks */}
            {SCORE_TICKS.map(tick => (
              <div
                key={tick.value}
                style={{
                  position: 'absolute',
                  left: `${toPct(tick.value)}%`,
                  top: '100%',
                  width: '2px',
                  height: '8px',
                  backgroundColor: '#64748b',
                  transform: 'translateX(-1px)' // Center the tick mark
                }}
              />
            ))}
          </div>

          {/* Tick labels container */}
          <div style={{ 
            position: 'relative', 
            height: '3rem', 
            display: 'flex',
            width: '100%',
            paddingTop: '0.5rem'
          }}>
            {SCORE_TICKS.map((tick, index) => (
              <div
                key={tick.label}
                style={{
                  position: 'absolute',
                  left: `${toPct(tick.value)}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  fontFamily: 'monospace', 
                  color: '#64748b', 
                  lineHeight: 1.2,
                  fontSize: '0.75rem'
                }}>
                  {tick.value}
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: tick.color, 
                  lineHeight: 1.2,
                  fontSize: '0.75rem',
                  marginTop: '2px'
                }}>
                  {tick.label}
                </div>
              </div>
            ))}
          </div>
        </div>
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
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        marginBottom: '2rem'
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
              color: netAmount >= 0 ? '#2563eb' : '#dc2626'
            }}>
              ${Math.round(netAmount)}
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

      {/* Financial Insights */}
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
              You've spent ${monthlySpending.toLocaleString()} out of your ${monthlyIncome.toLocaleString()} income this month. 
              {netAmount >= 0 ? ` Great job saving $${netAmount.toLocaleString()}!` : ` You're over budget by $${Math.abs(netAmount).toLocaleString()}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
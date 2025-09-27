// src/components/Dashboard Widgets/RecentPurchasesWidget.jsx
import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'
import Button from '../Button'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const RecentPurchasesWidget = () => {
  const { darkMode } = useTheme()
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRecentPurchases()
  }, [])

  const fetchRecentPurchases = async () => {
    try {
      const response = await fetch('http://143.215.104.239:8080/purchase/my-purchases')
      
      if (!response.ok) {
        throw new Error('Failed to fetch purchases')
      }

      const data = await response.json()
      
      // Transform and limit to recent 5 purchases
      const transformedPurchases = data.purchases.slice(0, 5).map(purchase => ({
        id: purchase.id,
        merchant: purchase.merchant,
        amount: parseFloat(purchase.amount),
        category: purchase.category,
        date: new Date(purchase.purchaseTime),
        scoreImpact: calculateScoreImpact(purchase.amount, purchase.category)
      }))

      setPurchases(transformedPurchases)
    } catch (err) {
      console.error('Error fetching purchases:', err)
      setError(err.message)
      // Fall back to mock data for demo
      setPurchases(mockPurchases)
    } finally {
      setLoading(false)
    }
  }

  const calculateScoreImpact = (amount, category) => {
    if (category === 'investment') return Math.floor(amount / 10)
    if (category === 'bills') return 0
    return -Math.floor(amount / 20)
  }

  // Mock data fallback
  const mockPurchases = [
    {
      id: 1,
      merchant: 'Starbucks',
      amount: 4.75,
      category: 'food',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      scoreImpact: -2
    },
    {
      id: 2,
      merchant: 'Amazon',
      amount: 29.99,
      category: 'shopping',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      scoreImpact: -5
    },
    {
      id: 3,
      merchant: 'Investment App',
      amount: 100.00,
      category: 'investment',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      scoreImpact: +8
    }
  ]

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  }

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const purchaseItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.5rem',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
    marginBottom: '0.75rem',
    transition: 'all 0.2s ease'
  }

  const merchantInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  }

  const merchantNameStyle = {
    fontWeight: '500',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: '0.875rem'
  }

  const categoryBadgeStyle = (category) => {
    const colors = {
      'food': '#f59e0b',
      'entertainment': '#8b5cf6',
      'transportation': '#06b6d4',
      'shopping': '#ec4899',
      'bills': '#ef4444',
      'investment': '#10b981',
      'other': '#64748b'
    }
    
    return {
      backgroundColor: colors[category] || colors.other,
      color: '#ffffff',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500'
    }
  }

  const amountStyle = {
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: '1rem'
  }

  const timeStyle = {
    fontSize: '0.75rem',
    color: darkMode ? '#9ca3af' : '#6b7280'
  }

  const scoreImpactStyle = (impact) => ({
    fontSize: '0.75rem',
    fontWeight: '500',
    color: impact > 0 ? '#10b981' : impact < 0 ? '#ef4444' : '#64748b'
  })

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '2rem',
    color: darkMode ? '#9ca3af' : '#6b7280'
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      'food': '🍽️',
      'entertainment': '🎬',
      'transportation': '🚗',
      'shopping': '🛒',
      'bills': '💳',
      'investment': '📈',
      'other': '💰'
    }
    return emojis[category] || emojis.other
  }

  if (loading) {
    return (
      <div>
        <div style={headerStyle}>
          <h3 style={titleStyle}>🛒 Recent Purchases</h3>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
          color: darkMode ? '#9ca3af' : '#6b7280'
        }}>
          Loading...
        </div>
      </div>
    )
  }

  if (error && purchases.length === 0) {
    return (
      <div>
        <div style={headerStyle}>
          <h3 style={titleStyle}>🛒 Recent Purchases</h3>
        </div>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
          <p>Unable to load purchases</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          🛒 Recent Purchases
        </h3>
        <Link to="/purchases">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      {purchases.length > 0 ? (
        <div>
          {purchases.map((purchase) => (
            <div 
              key={purchase.id}
              style={purchaseItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#475569' : '#f1f5f9'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f8fafc'
              }}
            >
              <div style={merchantInfoStyle}>
                <span style={{ fontSize: '1.25rem' }}>
                  {getCategoryEmoji(purchase.category)}
                </span>
                <div>
                  <div style={merchantNameStyle}>
                    {purchase.merchant}
                  </div>
                  <div style={timeStyle}>
                    {formatDistanceToNow(new Date(purchase.date), { addSuffix: true })}
                  </div>
                </div>
                <div style={categoryBadgeStyle(purchase.category)}>
                  {purchase.category}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={amountStyle}>
                  ${purchase.amount.toFixed(2)}
                </div>
                <div style={scoreImpactStyle(purchase.scoreImpact)}>
                  {purchase.scoreImpact > 0 ? '+' : ''}{purchase.scoreImpact} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
          <p>No purchases yet</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Add your first purchase to get started!
          </p>
        </div>
      )}
    </div>
  )
}

export default RecentPurchasesWidget
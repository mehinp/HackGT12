import { usePurchasesContext } from '../../hooks/Data Management Hooks/usePurchasesContext'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'
import Button from '../Button'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const RecentPurchasesWidget = () => {
  const { purchases } = usePurchasesContext()
  const { darkMode } = useTheme()

  // Mock data if no purchases
  const mockPurchases = [
    {
      id: 1,
      merchant: 'Starbucks',
      amount: 4.75,
      category: 'food',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      scoreImpact: -2
    },
    {
      id: 2,
      merchant: 'Amazon',
      amount: 29.99,
      category: 'shopping',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      scoreImpact: -5
    },
    {
      id: 3,
      merchant: 'Investment App',
      amount: 100.00,
      category: 'investment',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      scoreImpact: +8
    },
    {
      id: 4,
      merchant: 'Gas Station',
      amount: 45.20,
      category: 'transportation',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      scoreImpact: -3
    }
  ]

  const recentPurchases = purchases?.slice(0, 5) || mockPurchases

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

      {recentPurchases.length > 0 ? (
        <div>
          {recentPurchases.map((purchase) => (
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

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <Button variant="secondary" size="sm">
              ➕ Add New Purchase
            </Button>
          </div>
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛒</div>
          <p>No purchases yet</p>
          <Button variant="primary" size="sm" style={{ marginTop: '1rem' }}>
            Add Your First Purchase
          </Button>
        </div>
      )}
    </div>
  )
}

export default RecentPurchasesWidget
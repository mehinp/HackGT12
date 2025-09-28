// src/pages/Purchases.jsx
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import Button from '../components/Button'
import Input from '../components/Input'
import PurchaseForm from '../components/Purchases Components/PurchaseForm'

const Purchases = () => {
  const { darkMode } = useTheme()
  const [showAddPurchase, setShowAddPurchase] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  // Fetch purchases from backend
  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        setError('User not authenticated. Please log in again.')
        return
      }

      const response = await fetch('http://143.215.104.239:8080/purchase/my-purchases', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch purchases')
      }

      const data = await response.json()
      
      // Transform backend data to match frontend format
      const transformedPurchases = data.purchases.map(purchase => ({
        id: purchase.id,
        merchant: purchase.merchant,
        amount: parseFloat(purchase.amount),
        category: purchase.category,
        date: new Date(purchase.purchaseTime),
        description: `Purchase at ${purchase.merchant}`,
        scoreImpact: calculateScoreImpact(purchase.amount, purchase.category),
        createdAt: new Date(purchase.purchaseTime)
      }))

      setPurchases(transformedPurchases)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching purchases:', err)
    } finally {
      setLoading(false)
    }
  }

  const calculateScoreImpact = (amount, category) => {
    // Simple score calculation logic
    if (category === 'investment') return Math.floor(amount / 10)
    if (category === 'bills') return 0
    return -Math.floor(amount / 20)
  }

  const handlePurchaseSuccess = (newPurchase) => {
    // Refresh purchases after adding new one
    fetchPurchases()
    // Show success notification
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const pageStyle = {
    padding: '1rem 0',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  }

  const titleSectionStyle = {
    flex: 1,
    minWidth: '300px'
  }

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#dc2626', // red-600 to match demo
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#64748b', // slate-500 to match demo
    marginBottom: '1rem'
  }

  const actionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }

  const filtersRowStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#ffffff', // white background like demo
    borderRadius: '0.5rem', // rounded-md like demo
    border: '1px solid #e2e8f0', // slate-200 border
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' // demo shadow
  }

  const mainContentStyle = {
    backgroundColor: '#ffffff', // white background like demo
    borderRadius: '0.5rem', // rounded-md like demo
    padding: '1.5rem',
    border: '1px solid #e2e8f0', // slate-200 border
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' // demo shadow
  }

  const selectStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0', // slate-200 border
    backgroundColor: '#f8fafc', // slate-50 background
    color: '#1e293b', // slate-800 text
    fontSize: '0.875rem',
    minWidth: '120px'
  }

  const purchaseItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#ffffff', // white background
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0', // slate-200 border
    marginBottom: '0.75rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' // demo shadow
  }

  const notificationStyle = {
    position: 'fixed',
    bottom: '1rem',
    left: '1rem',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    transform: showNotification ? 'translateY(0)' : 'translateY(100px)',
    opacity: showNotification ? 1 : 0,
    transition: 'all 0.3s ease'
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

  // Filter purchases
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || purchase.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '1.125rem',
          color: '#64748b' // slate-500
        }}>
          Loading purchases...
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleSectionStyle}>
          <h1 style={titleStyle}>
            🛒 Purchase History
          </h1>
          <p style={subtitleStyle}>
            Track and analyze all your spending in one place
          </p>
        </div>

        <div style={actionButtonsStyle}>
          <Button 
            variant="primary" 
            icon="➕"
            onClick={() => setShowAddPurchase(true)}
          >
            Add Purchase
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      {/* Filters Row */}
      <div style={filtersRowStyle}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="🔍"
          />
        </div>

        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Categories</option>
          <option value="food">Food & Dining</option>
          <option value="entertainment">Entertainment</option>
          <option value="transportation">Transportation</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills & Utilities</option>
          <option value="investment">Investment</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b' // slate-800
          }}>
            Recent Transactions
          </h2>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b' // slate-500
          }}>
            {sortedPurchases.length} purchases found
          </div>
        </div>
        
        {/* Purchases List */}
        {sortedPurchases.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: '#64748b' // slate-500
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: '#1e293b' // slate-800
            }}>
              {purchases.length === 0 ? 'No purchases yet' : 'No purchases match your filters'}
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              {purchases.length === 0 
                ? 'Start by adding your first purchase to track your spending.'
                : 'Try adjusting your search or category filter.'
              }
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sortedPurchases.map((purchase) => (
              <div 
                key={purchase.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.14s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{
                      fontWeight: '600',
                      color: '#0f172a',
                      marginBottom: '0.5rem',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      {purchase.merchant}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                        padding: '0.125rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderRadius: '0.375rem'
                      }}>
                        {purchase.category}
                      </span>
                      <span style={{ color: '#64748b' }}>
                        {purchase.date.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: '#0f172a'
                    }}>
                      ${purchase.amount.toFixed(2)}
                    </p>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      color: purchase.scoreImpact > 0 ? '#0f766e' : purchase.scoreImpact < 0 ? '#dc2626' : '#64748b'
                    }}>
                      Score: {purchase.scoreImpact > 0 ? '+' : ''}{purchase.scoreImpact} pts
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Notification */}
      <div style={notificationStyle}>
        ✅ Purchase recorded successfully
      </div>

      {/* Add Purchase Modal */}
      {showAddPurchase && (
        <PurchaseForm 
          onClose={() => setShowAddPurchase(false)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  )
}

export default Purchases
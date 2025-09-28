// src/pages/Purchases.jsx
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Button from '../components/Button'
import Input from '../components/Input'
import PurchaseForm from '../components/Purchases Components/PurchaseForm'

const Purchases = () => {
  const { darkMode } = useTheme()
  const location = useLocation()
  const [showAddPurchase, setShowAddPurchase] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  // Currency/number formatters (adds commas)
  const fmtCurrency = (n) =>
    new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n) || 0)
  const fmtNumber = (n) => Number(n || 0).toLocaleString()

  // Auto-open Add Purchase modal if requested
  useEffect(() => {
    if (location.state?.openAddForm) {
      setShowAddPurchase(true)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

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

      if (!response.ok) throw new Error('Failed to fetch purchases')

      const data = await response.json()

      // Normalize backend -> frontend shape
      const transformedPurchases = (data.purchases || []).map(purchase => ({
        id: purchase.id,
        merchant: purchase.merchant,
        amount: parseFloat(purchase.amount),
        category: purchase.category,
        date: new Date(purchase.purchaseTime),
        description: `Purchase at ${purchase.merchant}`,
        createdAt: new Date(purchase.purchaseTime)
      }))

      setPurchases(transformedPurchases)
      setError('')
    } catch (err) {
      setError(err.message)
      console.error('Error fetching purchases:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseSuccess = () => {
    fetchPurchases()
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const SearchIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: '#64748b', opacity: 0.7 }}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  )

  const pageStyle = {
    padding: '1rem 0',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
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
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  }

  const searchContainerStyle = { position: 'relative', flex: 1, minWidth: '200px' }

  const searchInputStyle = {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.5rem',
    fontSize: '0.875rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.2s ease'
  }

  const searchIconContainerStyle = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none'
  }

  const mainContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  }

  const selectStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontSize: '0.875rem',
    minWidth: '120px'
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
      food: '🍽️',
      entertainment: '🎬',
      transportation: '🚗',
      shopping: '🛒',
      bills: '💳',
      investment: '📈',
      other: '💰'
    }
    return emojis[category] || emojis.other
  }

  // Filter + sort
  const filteredPurchases = purchases.filter(purchase => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      purchase.merchant.toLowerCase().includes(q) ||
      purchase.description?.toLowerCase().includes(q)
    const matchesCategory = selectedCategory === 'all' || purchase.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedPurchases = [...filteredPurchases].sort((a, b) => new Date(b.date) - new Date(a.date))

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '1.125rem',
          color: '#64748b'
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
        <div style={actionButtonsStyle}>
          <Button variant="primary" icon="+" onClick={() => setShowAddPurchase(true)}>
            Add Purchase
          </Button>
        </div>
      </div>

      {/* Error */}
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

      {/* Filters */}
      <div style={filtersRowStyle}>
        <div style={searchContainerStyle}>
          <div style={searchIconContainerStyle}><SearchIcon /></div>
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6'
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.boxShadow = 'none'
            }}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
            Recent Transactions
          </h2>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            {fmtNumber(sortedPurchases.length)} purchases found
          </div>
        </div>

        {/* List */}
        {sortedPurchases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
              {purchases.length === 0 ? 'No purchases yet' : 'No purchases match your filters'}
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              {purchases.length === 0
                ? 'Start by adding your first purchase to track your spending.'
                : 'Try adjusting your search or category filter.'}
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
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
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
                    <p style={{ fontSize: '1.125rem', fontWeight: '700', color: '#0f172a' }}>
                      {fmtCurrency(purchase.amount)}
                    </p>
                    {/* Score impact removed */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Toast */}
      <div style={notificationStyle}>
        ✅ Purchase recorded successfully
      </div>

      {/* Add Purchase Modal */}
      {showAddPurchase && (
        <PurchaseForm onClose={() => setShowAddPurchase(false)} onSuccess={handlePurchaseSuccess} />
      )}
    </div>
  )
}

export default Purchases

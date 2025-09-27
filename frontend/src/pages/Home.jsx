// src/pages/Home.jsx
import { useState } from 'react'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import ScoreWidget from '../components/Dashboard Widgets/ScoreWidget'
import QuickStatsWidget from '../components/Dashboard Widgets/QuickStatsWidget'
import Button from '../components/Button'
import PurchaseForm from '../components/Purchases Components/PurchaseForm'

const Home = () => {
  const { user } = useAuthContext()
  const [showAddPurchase, setShowAddPurchase] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const getUserName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) return user.firstName
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  const pageStyle = {
    padding: '1rem 0'
  }

  const headerStyle = {
    marginBottom: '2rem'
  }

  const welcomeStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#64748b',
    marginBottom: '1rem'
  }

  const quickActionsStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '2rem'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  }

  const widgetContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s ease'
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

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handlePurchaseSuccess = () => {
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  return (
    <div style={pageStyle}>
      {/* Header Section */}
      <div style={headerStyle}>
        <h1 style={welcomeStyle}>
          👋 {getCurrentTimeGreeting()}, {getUserName()}!
        </h1>
        <p style={subtitleStyle}>
          Here's what's happening with your finances today
        </p>

        {/* Quick Actions */}
        <div style={quickActionsStyle}>
          <Button 
            variant="primary" 
            icon="➕"
            onClick={() => setShowAddPurchase(true)}
          >
            Add Purchase
          </Button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div style={gridStyle}>
        {/* Score Widget */}
        <div style={widgetContainerStyle}>
          <ScoreWidget />
        </div>

        {/* Quick Stats */}
        <div style={widgetContainerStyle}>
          <QuickStatsWidget />
        </div>
      </div>

      {/* Additional Insights Section */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
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
              Consider setting up automatic transfers to your savings account to build wealth consistently.
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
              Track your spending with our new purchase tracker. Add purchases as you go!
            </p>
          </div>
        </div>
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

export default Home
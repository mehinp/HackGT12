import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import { useTheme } from '../context/ThemeContext'
import ScoreWidget from '../components/Dashboard Widgets/ScoreWidget'
import RecentPurchasesWidget from '../components/Dashboard Widgets/RecentPurchasesWidget'
import GoalProgressWidget from '../components/Dashboard Widgets/GoalProgressWidget'
import QuickStatsWidget from '../components/Dashboard Widgets/QuickStatsWidget'
import Button from '../components/Button'

const Home = () => {
  const { user } = useAuthContext()
  const { darkMode } = useTheme()

  const getUserName = () => {
    if (user?.name) return user.name
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
    color: darkMode ? '#f8fafc' : '#1e293b',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: darkMode ? '#94a3b8' : '#64748b',
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
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: darkMode 
      ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.07)',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    transition: 'all 0.2s ease'
  }

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
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
          <Button variant="primary" icon="➕">
            Add Purchase
          </Button>
          <Button variant="secondary" icon="🎯">
            Set New Goal
          </Button>
          <Button variant="outline" icon="💬">
            Ask AI Assistant
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

        {/* Goal Progress */}
        <div style={widgetContainerStyle}>
          <GoalProgressWidget />
        </div>

        {/* Recent Purchases */}
        <div style={{
          ...widgetContainerStyle,
          gridColumn: 'span 2',
          '@media (max-width: 768px)': {
            gridColumn: 'span 1'
          }
        }}>
          <RecentPurchasesWidget />
        </div>
      </div>

      {/* Additional Insights Section */}
      <div style={{
        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: darkMode 
          ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
          : '0 4px 6px rgba(0, 0, 0, 0.07)',
        border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: darkMode ? '#f8fafc' : '#1e293b',
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
            backgroundColor: darkMode ? '#374151' : '#f8fafc',
            borderRadius: '0.5rem',
            border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
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
              color: darkMode ? '#cbd5e1' : '#64748b',
              lineHeight: '1.5'
            }}>
              Consider setting up automatic transfers to your savings account to build wealth consistently.
            </p>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: darkMode ? '#374151' : '#f8fafc',
            borderRadius: '0.5rem',
            border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
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
              color: darkMode ? '#cbd5e1' : '#64748b',
              lineHeight: '1.5'
            }}>
              You're spending 15% less than last month. Keep up the great work!
            </p>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: darkMode ? '#374151' : '#f8fafc',
            borderRadius: '0.5rem',
            border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#f59e0b',
              marginBottom: '0.5rem'
            }}>
            ⚠️ Watch Out
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: darkMode ? '#cbd5e1' : '#64748b',
              lineHeight: '1.5'
            }}>
              Entertainment spending is 20% above your budget this month.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
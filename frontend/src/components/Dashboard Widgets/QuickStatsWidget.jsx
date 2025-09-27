import { usePurchasesContext } from '../../hooks/Data Management Hooks/usePurchasesContext'
import { useTheme } from '../../context/ThemeContext'

const QuickStatsWidget = () => {
  const { purchases } = usePurchasesContext()
  const { darkMode } = useTheme()

  // Calculate stats from purchases (mock data for now)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const mockStats = {
    monthlySpending: 1250.75,
    budgetRemaining: 749.25,
    savingsRate: 23,
    topCategory: 'Food & Dining'
  }

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  }

  const statItemStyle = {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.5rem',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
  }

  const statValueStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.25rem'
  }

  const statLabelStyle = {
    fontSize: '0.75rem',
    color: darkMode ? '#9ca3af' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const getStatColor = (type, value) => {
    switch (type) {
      case 'spending':
        return '#3b82f6'
      case 'budget':
        return value > 0 ? '#10b981' : '#ef4444'
      case 'savings':
        return value >= 20 ? '#10b981' : value >= 10 ? '#f59e0b' : '#ef4444'
      case 'category':
        return '#8b5cf6'
      default:
        return darkMode ? '#f8fafc' : '#1e293b'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div>
      <h3 style={titleStyle}>
        📈 Quick Stats
      </h3>

      <div style={statsGridStyle}>
        {/* Monthly Spending */}
        <div style={statItemStyle}>
          <div style={{
            ...statValueStyle,
            color: getStatColor('spending')
          }}>
            {formatCurrency(mockStats.monthlySpending)}
          </div>
          <div style={statLabelStyle}>
            This Month
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: darkMode ? '#cbd5e1' : '#64748b',
            marginTop: '0.25rem'
          }}>
            💳 Spent
          </div>
        </div>

        {/* Budget Remaining */}
        <div style={statItemStyle}>
          <div style={{
            ...statValueStyle,
            color: getStatColor('budget', mockStats.budgetRemaining)
          }}>
            {formatCurrency(mockStats.budgetRemaining)}
          </div>
          <div style={statLabelStyle}>
            Budget Left
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: darkMode ? '#cbd5e1' : '#64748b',
            marginTop: '0.25rem'
          }}>
            💰 Remaining
          </div>
        </div>

        {/* Savings Rate */}
        <div style={statItemStyle}>
          <div style={{
            ...statValueStyle,
            color: getStatColor('savings', mockStats.savingsRate)
          }}>
            {mockStats.savingsRate}%
          </div>
          <div style={statLabelStyle}>
            Savings Rate
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: darkMode ? '#cbd5e1' : '#64748b',
            marginTop: '0.25rem'
          }}>
            📊 Monthly
          </div>
        </div>

        {/* Top Category */}
        <div style={statItemStyle}>
          <div style={{
            ...statValueStyle,
            color: getStatColor('category'),
            fontSize: '1rem'
          }}>
            {mockStats.topCategory}
          </div>
          <div style={statLabelStyle}>
            Top Category
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: darkMode ? '#cbd5e1' : '#64748b',
            marginTop: '0.25rem'
          }}>
            🏆 Most Spent
          </div>
        </div>
      </div>

      {/* Additional insights */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
        borderRadius: '0.5rem',
        border: darkMode ? '1px solid #334155' : '1px solid #d1d5db'
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: darkMode ? '#cbd5e1' : '#64748b',
          textAlign: 'center'
        }}>
          💡 You're spending 15% less than last month!
        </div>
      </div>
    </div>
  )
}

export default QuickStatsWidget
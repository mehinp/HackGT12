import { useGoalsContext } from '../../hooks/Data Management Hooks/useGoalsContext'
import { useTheme } from '../../context/ThemeContext'
import { Link } from 'react-router-dom'
import Button from '../Button'

const GoalProgressWidget = () => {
  const { goals } = useGoalsContext()
  const { darkMode } = useTheme()

  // Mock data if no goals
  const mockGoals = [
    {
      id: 1,
      title: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 3200,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      category: 'savings'
    },
    {
      id: 2,
      title: 'Vacation to Japan',
      targetAmount: 3000,
      currentAmount: 800,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days
      category: 'travel'
    }
  ]

  const currentGoals = goals || mockGoals
  const primaryGoal = currentGoals[0]

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

  const goalItemStyle = {
    padding: '1rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.75rem',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
    marginBottom: '1rem'
  }

  const goalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  }

  const goalTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b',
    marginBottom: '0.25rem'
  }

  const goalAmountStyle = {
    fontSize: '0.875rem',
    color: darkMode ? '#9ca3af' : '#6b7280'
  }

  const progressBarContainerStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '0.75rem'
  }

  const progressBarStyle = (progress) => ({
    height: '100%',
    backgroundColor: progress >= 100 ? '#10b981' : progress >= 75 ? '#84cc16' : progress >= 50 ? '#f59e0b' : '#3b82f6',
    borderRadius: '4px',
    width: `${Math.min(progress, 100)}%`,
    transition: 'width 0.5s ease'
  })

  const progressTextStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: darkMode ? '#9ca3af' : '#6b7280'
  }

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '2rem',
    color: darkMode ? '#9ca3af' : '#6b7280'
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      'savings': '💰',
      'travel': '✈️',
      'house': '🏠',
      'car': '🚗',
      'education': '🎓',
      'investment': '📈',
      'other': '🎯'
    }
    return emojis[category] || emojis.other
  }

  const formatTimeToGoal = (deadline) => {
    const now = new Date()
    const timeDiff = deadline - now
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    
    if (days < 0) return 'Overdue'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days < 30) return `${days} days`
    if (days < 365) return `${Math.ceil(days / 30)} months`
    return `${Math.ceil(days / 365)} years`
  }

  return (
    <div>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          🎯 Goal Progress
        </h3>
        <Link to="/goals">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </div>

      {currentGoals.length > 0 ? (
        <div>
          {currentGoals.slice(0, 2).map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            const remaining = goal.targetAmount - goal.currentAmount

            return (
              <div key={goal.id} style={goalItemStyle}>
                <div style={goalHeaderStyle}>
                  <div>
                    <div style={goalTitleStyle}>
                      {getCategoryEmoji(goal.category)} {goal.title}
                    </div>
                    <div style={goalAmountStyle}>
                      ${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    textAlign: 'right'
                  }}>
                    <div>{formatTimeToGoal(goal.deadline)}</div>
                    <div style={{ fontWeight: '500', color: progress >= 100 ? '#10b981' : '#3b82f6' }}>
                      {progress.toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div style={progressBarContainerStyle}>
                  <div style={progressBarStyle(progress)}></div>
                </div>

                <div style={progressTextStyle}>
                  <span>${remaining.toLocaleString()} to go</span>
                  <span>{progress >= 100 ? '🎉 Complete!' : `${(100 - progress).toFixed(0)}% remaining`}</span>
                </div>
              </div>
            )
          })}

          {currentGoals.length > 2 && (
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              color: darkMode ? '#9ca3af' : '#6b7280',
              fontSize: '0.875rem'
            }}>
              +{currentGoals.length - 2} more goals
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem'
          }}>
            <Button variant="secondary" size="sm">
              ➕ Add New Goal
            </Button>
          </div>
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
          <p>No goals set yet</p>
          <Button variant="primary" size="sm" style={{ marginTop: '1rem' }}>
            Set Your First Goal
          </Button>
        </div>
      )}
    </div>
  )
}

export default GoalProgressWidget
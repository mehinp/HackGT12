import { useTheme } from '../../context/ThemeContext'

const GoalChart = ({ goals }) => {
  const { darkMode } = useTheme()

  if (!goals || goals.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: darkMode ? '#9ca3af' : '#6b7280'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
        <p style={{ fontSize: '0.875rem' }}>No goals to display</p>
      </div>
    )
  }

  const chartContainerStyle = {
    padding: '1rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.75rem',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
  }

  // Calculate progress for each goal
  const goalsWithProgress = goals.map(goal => ({
    ...goal,
    progress: (goal.currentAmount / goal.targetAmount) * 100,
    remaining: goal.targetAmount - goal.currentAmount
  }))

  // Sort by progress for better visualization
  const sortedGoals = goalsWithProgress.sort((a, b) => b.progress - a.progress)

  const barHeight = 24
  const barSpacing = 32

  const getCategoryColor = (category) => {
    const colors = {
      'savings': '#10b981',
      'travel': '#06b6d4', 
      'house': '#f59e0b',
      'car': '#8b5cf6',
      'education': '#ec4899',
      'investment': '#3b82f6',
      'other': '#64748b'
    }
    return colors[category] || colors.other
  }

  const maxWidth = 200 // Maximum width for progress bars

  return (
    <div style={chartContainerStyle}>
      <h4 style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: darkMode ? '#f8fafc' : '#1e293b',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        Progress Overview
      </h4>

      {/* Goals Progress Bars */}
      <div style={{ marginBottom: '1.5rem' }}>
        {sortedGoals.map((goal, index) => (
          <div key={goal.id} style={{ marginBottom: '1rem' }}>
            {/* Goal Name and Progress */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: darkMode ? '#f8fafc' : '#1e293b',
                maxWidth: '60%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {goal.title}
              </div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: getCategoryColor(goal.category)
              }}>
                {goal.progress.toFixed(1)}%
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: `${barHeight}px`,
              backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                backgroundColor: getCategoryColor(goal.category),
                borderRadius: '12px',
                width: `${Math.min(goal.progress, 100)}%`,
                transition: 'width 0.8s ease',
                position: 'relative'
              }}>
                {/* Progress bar shine effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
                  borderRadius: '12px 12px 0 0'
                }}></div>
              </div>
              
              {/* Progress text overlay */}
              {goal.progress > 15 && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '8px',
                  transform: 'translateY(-50%)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  ${goal.currentAmount.toLocaleString()}
                </div>
              )}
            </div>

            {/* Goal Details */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.25rem'
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}>
                ${goal.remaining.toLocaleString()} remaining
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}>
                Target: ${goal.targetAmount.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div style={{
        borderTop: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`,
        paddingTop: '1rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#10b981'
            }}>
              {sortedGoals.filter(g => g.progress >= 100).length}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textTransform: 'uppercase'
            }}>
              Completed
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#3b82f6'
            }}>
              {(sortedGoals.reduce((sum, g) => sum + g.progress, 0) / sortedGoals.length).toFixed(0)}%
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textTransform: 'uppercase'
            }}>
              Avg Progress
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: darkMode ? '#1e40af' : '#dbeafe',
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: darkMode ? '#ffffff' : '#1e40af',
          fontWeight: '500'
        }}>
          {sortedGoals.filter(g => g.progress >= 100).length === sortedGoals.length
            ? "🎉 All goals completed! Time to set new ones!"
            : sortedGoals.some(g => g.progress >= 75)
            ? "🚀 You're so close! Keep pushing!"
            : "💪 Every step counts towards your goals!"
          }
        </div>
      </div>
    </div>
  )
}

export default GoalChart
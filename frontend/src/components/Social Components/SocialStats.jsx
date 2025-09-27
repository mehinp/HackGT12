import { useTheme } from '../../context/ThemeContext'

const SocialStats = ({ friends, currentUser }) => {
  const { darkMode } = useTheme()

  // Calculate social statistics
  const allUsers = [...friends, currentUser]
  const averageScore = allUsers.reduce((sum, user) => sum + user.score, 0) / allUsers.length
  const myRank = allUsers.sort((a, b) => b.score - a.score).findIndex(user => user.id === currentUser.id) + 1
  const scoreAboveAverage = currentUser.score - averageScore
  const topPerformer = allUsers.reduce((top, user) => user.score > top.score ? user : top)

  const statItemStyle = {
    padding: '1rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.5rem',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
    marginBottom: '1rem'
  }

  const statValueStyle = {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '0.25rem'
  }

  const statLabelStyle = {
    fontSize: '0.75rem',
    color: darkMode ? '#9ca3af' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const comparisonItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.5rem',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
    marginBottom: '0.75rem'
  }

  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: darkMode ? '#4b5563' : '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem'
  }

  const nameStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: darkMode ? '#f8fafc' : '#1e293b'
  }

  const progressBarStyle = {
    width: '100%',
    height: '6px',
    backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '0.5rem'
  }

  const progressFillStyle = (percentage) => ({
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '3px',
    width: `${Math.min(percentage, 100)}%`,
    transition: 'width 0.5s ease'
  })

  const rankPercentile = ((allUsers.length - myRank + 1) / allUsers.length) * 100

  return (
    <div>
      {/* My Performance */}
      <div style={statItemStyle}>
        <div style={{ ...statValueStyle, color: '#3b82f6' }}>
          #{myRank}
        </div>
        <div style={statLabelStyle}>
          My Rank
        </div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle(rankPercentile)}></div>
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: darkMode ? '#9ca3af' : '#6b7280',
          marginTop: '0.25rem'
        }}>
          Top {(100 - rankPercentile).toFixed(0)}% of friends
        </div>
      </div>

      {/* Score Comparison */}
      <div style={statItemStyle}>
        <div style={{ 
          ...statValueStyle, 
          color: scoreAboveAverage >= 0 ? '#10b981' : '#ef4444' 
        }}>
          {scoreAboveAverage >= 0 ? '+' : ''}{Math.round(scoreAboveAverage)}
        </div>
        <div style={statLabelStyle}>
          vs. Group Average
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: darkMode ? '#9ca3af' : '#6b7280'
        }}>
          Group avg: {Math.round(averageScore)}
        </div>
      </div>

      {/* Top Performers */}
      <div style={{
        marginBottom: '1rem'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: darkMode ? '#f8fafc' : '#1e293b',
          marginBottom: '0.75rem'
        }}>
          🏆 Top Performer
        </h4>
        
        <div style={comparisonItemStyle}>
          <div style={userInfoStyle}>
            <div style={avatarStyle}>
              {topPerformer.avatar}
            </div>
            <div>
              <div style={nameStyle}>
                {topPerformer.name}
                {topPerformer.id === currentUser.id && ' (You)'}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}>
                Leading the board
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#f59e0b'
            }}>
              {topPerformer.score}
            </div>
          </div>
        </div>
      </div>

      {/* Group Stats */}
      <div style={{
        padding: '1rem',
        backgroundColor: darkMode ? '#374151' : '#f8fafc',
        borderRadius: '0.5rem',
        border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
      }}>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: '600',
          color: darkMode ? '#f8fafc' : '#1e293b',
          marginBottom: '0.75rem'
        }}>
          📊 Group Statistics
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#8b5cf6'
            }}>
              {Math.round(averageScore)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              Avg Score
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#f59e0b'
            }}>
              {allUsers.length}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              Total Members
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: darkMode ? '#1e40af' : '#dbeafe',
        borderRadius: '0.5rem',
        border: '1px solid #3b82f6'
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: darkMode ? '#ffffff' : '#1e40af',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {myRank === 1 
            ? "🎉 You're leading the pack! Keep it up!"
            : myRank <= 3
            ? "🔥 So close to the top! Push a little harder!"
            : scoreAboveAverage > 0
            ? "💪 Above average! You're doing great!"
            : "📈 Every improvement counts! Keep going!"
          }
        </div>
      </div>
    </div>
  )
}

export default SocialStats
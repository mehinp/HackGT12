import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuthContext } from '../../hooks/Authentication hooks/useAuthContext'

const Leaderboard = ({ data, currentUser, showDeleteButton = false }) => {
  const { darkMode } = useTheme()
  const { user } = useAuthContext()
  const [selectedReaction, setSelectedReaction] = useState(null)

  const reactions = ['👏', '🔥', '💪', '🎉', '⭐', '💯']

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#f59e0b'
      case 2: return '#9ca3af'
      case 3: return '#cd7c2f'
      default: return darkMode ? '#f8fafc' : '#1e293b'
    }
  }

  const handleDeleteFriend = (friendId) => {
    // Implement delete logic here
    console.log('Delete friend:', friendId)
    // You would typically call an API or update context here
  }

  const itemStyle = (isCurrentUser, rank) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: isCurrentUser 
      ? (darkMode ? '#1e40af' : '#dbeafe')
      : (darkMode ? '#374151' : '#f8fafc'),
    borderRadius: '0.75rem',
    border: isCurrentUser 
      ? '2px solid #3b82f6'
      : darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
    marginBottom: '0.75rem',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden'
  })

  const rankStyle = (rank) => ({
    fontSize: '1.25rem',
    fontWeight: '700',
    color: getRankColor(rank),
    minWidth: '40px',
    textAlign: 'center'
  })

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: darkMode ? '#4b5563' : '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    border: '2px solid transparent'
  }

  const nameStyle = (isCurrentUser) => ({
    fontSize: '1rem',
    fontWeight: '600',
    color: isCurrentUser 
      ? (darkMode ? '#ffffff' : '#1e40af')
      : (darkMode ? '#f8fafc' : '#1e293b'),
    marginBottom: '0.25rem'
  })

  const scoreStyle = (isCurrentUser) => ({
    fontSize: '1.25rem',
    fontWeight: '700',
    color: isCurrentUser 
      ? (darkMode ? '#ffffff' : '#1e40af')
      : '#10b981',
    textAlign: 'right'
  })

  const reactionsStyle = {
    display: 'flex',
    gap: '0.25rem',
    marginTop: '0.5rem'
  }

  const reactionButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '0.25rem',
    transition: 'all 0.2s ease'
  }

  const achievementBadgeStyle = {
    fontSize: '0.75rem',
    padding: '0.125rem 0.5rem',
    backgroundColor: darkMode ? '#4b5563' : '#e2e8f0',
    borderRadius: '1rem',
    marginRight: '0.25rem'
  }

  const deleteButtonStyle = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#ef4444',
    padding: '0.25rem',
    borderRadius: '0.25rem',
    transition: 'all 0.2s ease'
  }

  const handleReaction = (friendId, reaction) => {
    // Mock reaction functionality
    console.log(`Reacted to ${friendId} with ${reaction}`)
    setSelectedReaction({ friendId, reaction })
    setTimeout(() => setSelectedReaction(null), 1000)
  }

  return (
    <div>
      {data.map((friend, index) => {
        const rank = index + 1
        const isCurrentUser = friend.email === user?.email
        
        return (
          <div 
            key={friend.id}
            style={itemStyle(isCurrentUser, rank)}
            onMouseEnter={(e) => {
              if (!isCurrentUser) {
                e.currentTarget.style.backgroundColor = darkMode ? '#475569' : '#f1f5f9'
              }
            }}
            onMouseLeave={(e) => {
              if (!isCurrentUser) {
                e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f8fafc'
              }
            }}
          >
            {/* Delete button - only show for friends, not current user */}
            {showDeleteButton && !isCurrentUser && (
              <button 
                onClick={() => handleDeleteFriend(friend.id)}
                style={deleteButtonStyle}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
                title="Remove friend"
              >
                ❌
              </button>
            )}

            {/* Rank */}
            <div style={rankStyle(rank)}>
              {getRankIcon(rank)}
            </div>

            {/* Avatar */}
            <div style={{
              ...avatarStyle,
              borderColor: rank <= 3 ? getRankColor(rank) : 'transparent'
            }}>
              {friend.avatar}
            </div>

            {/* User Info */}
            <div style={{ flex: 1 }}>
              <div style={nameStyle(isCurrentUser)}>
                {friend.name}
                {isCurrentUser && ' (You)'}
              </div>

              {/* Achievements */}
              <div style={{ marginTop: '0.5rem' }}>
                {friend.achievements?.slice(0, 2).map((achievement, idx) => (
                  <span key={idx} style={achievementBadgeStyle}>
                    {achievement}
                  </span>
                ))}
              </div>

              {/* Reactions (only for non-current users) */}
              {!isCurrentUser && (
                <div style={reactionsStyle}>
                  {reactions.map((reaction, idx) => (
                    <button
                      key={idx}
                      style={reactionButtonStyle}
                      onClick={() => handleReaction(friend.id, reaction)}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = darkMode ? '#4b5563' : '#e2e8f0'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent'
                      }}
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Score */}
            <div style={{ textAlign: 'right' }}>
              <div style={scoreStyle(isCurrentUser)}>
                {friend.score}
              </div>
            </div>

            {/* Reaction Animation */}
            {selectedReaction?.friendId === friend.id && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '2rem',
                animation: 'reactionPop 1s ease-out',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                {selectedReaction.reaction}
              </div>
            )}
          </div>
        )
      })}

      {/* Reaction Animation Styles */}
      <style>
        {`
          @keyframes reactionPop {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -70%) scale(1.2);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -90%) scale(1);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  )
}

export default Leaderboard
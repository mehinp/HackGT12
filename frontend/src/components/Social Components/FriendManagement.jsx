import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import Button from '../Button'

const FriendManagement = ({ friends }) => {
  const { darkMode } = useTheme()
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const friendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.5rem',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
    marginBottom: '0.75rem',
    transition: 'all 0.2s ease'
  }

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: darkMode ? '#4b5563' : '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem'
  }

  const nameStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b',
    marginBottom: '0.25rem'
  }

  const statusStyle = (isOnline) => ({
    fontSize: '0.75rem',
    color: isOnline ? '#10b981' : (darkMode ? '#9ca3af' : '#6b7280'),
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  })

  const statusDotStyle = (isOnline) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: isOnline ? '#10b981' : (darkMode ? '#9ca3af' : '#6b7280')
  })

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.25rem'
  }

  const isOnline = (lastActive) => {
    const now = new Date()
    const diff = now - lastActive
    return diff < 30 * 60 * 1000 // Online if active within 30 minutes
  }

  const formatLastSeen = (lastActive) => {
    const now = new Date()
    const diff = now - lastActive
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 30) return 'Online'
    if (hours < 1) return `${minutes}m ago`
    if (days < 1) return `${hours}h ago`
    return `${days}d ago`
  }

  const handleRemoveFriend = (friendId) => {
    setSelectedFriend(friendId)
    setShowRemoveConfirm(true)
  }

  const confirmRemoveFriend = () => {
    // Mock remove functionality
    console.log(`Removing friend ${selectedFriend}`)
    setShowRemoveConfirm(false)
    setSelectedFriend(null)
  }

  if (!friends || friends.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        color: darkMode ? '#9ca3af' : '#6b7280'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👫</div>
        <p style={{ fontSize: '0.875rem' }}>No friends added yet</p>
        <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
          Invite friends to start competing!
        </p>
      </div>
    )
  }

  return (
    <div>
      {friends.map((friend) => {
        const friendIsOnline = isOnline(friend.lastActive)
        
        return (
          <div 
            key={friend.id}
            style={friendItemStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#475569' : '#f1f5f9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f8fafc'
            }}
          >
            {/* Avatar */}
            <div style={avatarStyle}>
              {friend.avatar}
            </div>

            {/* Friend Info */}
            <div style={{ flex: 1 }}>
              <div style={nameStyle}>
                {friend.name}
              </div>
              <div style={statusStyle(friendIsOnline)}>
                <div style={statusDotStyle(friendIsOnline)}></div>
                {formatLastSeen(friend.lastActive)}
              </div>
            </div>

            {/* Score */}
            <div style={{
              textAlign: 'right',
              marginRight: '0.5rem'
            }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#10b981'
              }}>
                {friend.score}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}>
                score
              </div>
            </div>

            {/* Action Buttons */}
            <div style={actionButtonsStyle}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.2s ease',
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#4b5563' : '#e2e8f0'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
                title="Send message"
              >
                💬
              </button>
              
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.2s ease',
                  color: '#ef4444'
                }}
                onClick={() => handleRemoveFriend(friend.id)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#4b5563' : '#fee2e2'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
                title="Remove friend"
              >
                🗑️
              </button>
            </div>
          </div>
        )
      })}

      {/* Friend Stats */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: darkMode ? '#374151' : '#f8fafc',
        borderRadius: '0.5rem',
        border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
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
              color: '#3b82f6'
            }}>
              {friends.length}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textTransform: 'uppercase'
            }}>
              Total Friends
            </div>
          </div>
          
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#10b981'
            }}>
              {friends.filter(f => isOnline(f.lastActive)).length}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: darkMode ? '#9ca3af' : '#6b7280',
              textTransform: 'uppercase'
            }}>
              Online Now
            </div>
          </div>
        </div>
      </div>

      {/* Remove Friend Confirmation Modal */}
      {showRemoveConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: darkMode ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              Remove Friend?
            </h3>
            
            <p style={{
              fontSize: '0.875rem',
              color: darkMode ? '#9ca3af' : '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Are you sure you want to remove this friend? They will no longer appear on your leaderboard and you won't be able to see each other's progress.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <Button 
                variant="secondary" 
                onClick={() => setShowRemoveConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger"
                onClick={confirmRemoveFriend}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FriendManagement
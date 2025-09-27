import { useState } from 'react'
import { useSocialContext } from '../hooks/Data Management Hooks/useSocialContext'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Leaderboard from '../components/Social Components/Leaderboard'

const Social = () => {
  const { friends } = useSocialContext()
  const { user } = useAuthContext()
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friendEmail, setFriendEmail] = useState('')
  const [isAddingFriend, setIsAddingFriend] = useState(false)
  const [addFriendError, setAddFriendError] = useState('')

  const currentFriends = friends || []
  
  // Current user data (simplified without streak/online features)
  const currentUser = {
    id: user?.id,
    name: user?.name || `${user?.firstName} ${user?.lastName}`.trim() || 'User',
    email: user?.email,
    score: 750, // This would come from score context
    avatar: '👤',
    achievements: ['🚀 Getting Started', '💪 Consistent']
  }

  // Create leaderboard with current user
  const leaderboardData = [...currentFriends, currentUser].sort((a, b) => b.score - a.score)

  const handleAddFriend = async () => {
    if (!friendEmail.trim()) {
      setAddFriendError('Please enter an email address')
      return
    }

    if (friendEmail === user?.email) {
      setAddFriendError('You cannot add yourself as a friend')
      return
    }

    setIsAddingFriend(true)
    setAddFriendError('')

    try {
      // API call to add friend by email
      const response = await fetch('http://143.215.104.239:8080/social/add-friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': localStorage.getItem('userId')
        },
        credentials: 'include',
        body: JSON.stringify({
          friendEmail: friendEmail.trim().toLowerCase()
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to add friend')
      }

      const newFriend = await response.json()
      
      // Update friends list (this would typically be handled by context)
      // dispatch({ type: 'ADD_FRIEND', payload: newFriend })
      
      setShowAddFriend(false)
      setFriendEmail('')
      
    } catch (err) {
      setAddFriendError(err.message)
    } finally {
      setIsAddingFriend(false)
    }
  }

  const pageStyle = {
    padding: '1rem 0'
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

  const actionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }

  const mainContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
  }

  const userRank = leaderboardData.findIndex(f => f.email === user?.email) + 1

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleSectionStyle}>
          <h1 style={titleStyle}>
            👥 Social Dashboard
          </h1>
          <p style={subtitleStyle}>
            Compare progress and stay motivated with friends
          </p>
        </div>

        <div style={actionButtonsStyle}>
          <Button 
            variant="primary" 
            icon="➕"
            onClick={() => setShowAddFriend(true)}
          >
            Add Friend
          </Button>
        </div>
      </div>

      {/* User Rank Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              fontSize: '3rem',
              backgroundColor: '#f8fafc',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #e2e8f0'
            }}>
              {currentUser.avatar}
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '0.25rem'
              }}>
                {currentUser.name}
              </h2>
              <div style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                Rank #{userRank} • Score: {currentUser.score}
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {currentUser.achievements.map((achievement, index) => (
                  <span key={index} style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '1rem',
                    color: '#1e293b'
                  }}>
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#3b82f6'
              }}>
                {currentUser.score}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Current Score
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#f59e0b'
              }}>
                {currentFriends.length}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Friends
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div style={mainContentStyle}>
        <div style={{
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            🏆 Leaderboard
          </h2>
        </div>
        
        <Leaderboard data={leaderboardData} currentUser={currentUser} showDeleteButton={true} />
      </div>

      {/* Add Friend Modal */}
      {showAddFriend && (
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
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Add Friend
            </h3>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Enter your friend's email address to add them to your network!
            </p>

            {addFriendError && (
              <div style={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #fecaca',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}>
                {addFriendError}
              </div>
            )}
            
            <div style={{ marginBottom: '1.5rem' }}>
              <Input 
                label="Friend's Email"
                type="email"
                placeholder="Enter email address"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                icon="📧"
              />
            </div>
            
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowAddFriend(false)
                  setFriendEmail('')
                  setAddFriendError('')
                }}
                disabled={isAddingFriend}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={handleAddFriend}
                disabled={!friendEmail.trim() || isAddingFriend}
              >
                {isAddingFriend ? 'Adding...' : 'Add Friend'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Social
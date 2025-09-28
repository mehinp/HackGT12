import { useState, useEffect } from 'react'
import { useSocialContext } from '../hooks/Data Management Hooks/useSocialContext'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import { useScoreContext } from '../hooks/Data Management Hooks/useScoreContext'
import Button from '../components/Button'
import Input from '../components/Input'
import Leaderboard from '../components/Social Components/Leaderboard'
import { socialService } from '../services/socialService'

const Social = () => {
  const { friends } = useSocialContext()
  const { user } = useAuthContext()
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friendEmail, setFriendEmail] = useState('')
  const [isAddingFriend, setIsAddingFriend] = useState(false)
  const [addFriendError, setAddFriendError] = useState('')
  const [friendCount, setFriendCount] = useState(0)
  const [loadingCount, setLoadingCount] = useState(true)
  const [countError, setCountError] = useState('')
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)
  const [leaderboardError, setLeaderboardError] = useState('')
  const [reactions, setReactions] = useState({}) // Store reactions for each user

  const currentFriends = friends || []
  
  // Enhanced emoji reactions
  const emojiReactions = ['👍', '🔥', '💪', '🎉', '⚡', '🌟']
  
  // Function to get achievement emojis based on score
  const getAchievementEmojis = (score, rank) => {
    const emojis = []
    
    // Rank-based emojis
    if (rank === 1) emojis.push('👑')
    if (rank <= 3) emojis.push('🏅')
    if (rank <= 5) emojis.push('⭐')
    
    // Score-based emojis
    if (score >= 1000) emojis.push('🚀')
    if (score >= 800) emojis.push('💎')
    if (score >= 600) emojis.push('🔥')
    if (score >= 400) emojis.push('💪')
    if (score >= 200) emojis.push('⚡')
    
    return emojis
  }

  // Function to get motivational emoji based on score range
  const getMotivationalEmoji = (score) => {
    if (score >= 1000) return '🌟'
    if (score >= 800) return '🚀'
    if (score >= 600) return '💎'
    if (score >= 400) return '🔥'
    if (score >= 200) return '💪'
    return '⚡'
  }
  
  // Current user data with enhanced achievements
  const currentUser = {
    id: user?.id,
    name: user?.name || `${user?.firstName} ${user?.lastName}`.trim() || 'User',
    email: user?.email,
    score: 750,
    avatar: '👤',
    achievements: ['🚀 Getting Started', '💪 Consistent', '🎯 Focused']
  }

  // Fetch friend count when component mounts
  useEffect(() => {
    fetchFriendCount()
    fetchLeaderboardRankings()
  }, [])

  const fetchFriendCount = async () => {
    try {
      setLoadingCount(true)
      setCountError('')
      
      const userId = localStorage.getItem('userId')
      console.log('Fetching friend count for userId:', userId)
      
      if (!userId) {
        setCountError('User not authenticated. Please log in again.')
        return
      }

      const result = await socialService.getFriendCount()
      console.log('Friend count API response:', result)
      
      if (result && typeof result.friendsCount === 'number') {
        setFriendCount(result.friendsCount)
      } else {
        console.log('Unexpected response format:', result)
        setFriendCount(currentFriends.length)
      }
      
    } catch (err) {
      console.error('Error fetching friend count:', err)
      setCountError(err.message)
      setFriendCount(currentFriends.length)
    } finally {
      setLoadingCount(false)
    }
  }

  const fetchLeaderboardRankings = async () => {
    try {
      setLoadingLeaderboard(true)
      setLeaderboardError('')
      
      const userId = localStorage.getItem('userId')
      console.log('DEBUG: userId from localStorage:', userId)
      
      if (!userId) {
        setLeaderboardError('User not authenticated. Please log in again.')
        return
      }

      console.log('DEBUG: About to call getLeaderboardRankings API...')
      const response = await socialService.getLeaderboardRankings()
      console.log('DEBUG: Raw API response:', response)
      
      const rankings = response.ranks || []
      console.log('DEBUG: Extracted rankings array:', rankings)
      
      const transformedRankings = rankings.map(person => ({
        ...person,
        name: `${person.firstName} ${person.lastName}`.trim(),
        avatar: '👤'
      }))
      
      console.log('DEBUG: Transformed rankings:', transformedRankings)
      
      const sortedLeaderboard = transformedRankings.sort((a, b) => (b.score || 0) - (a.score || 0))
      
      console.log('DEBUG: Final sorted leaderboard:', sortedLeaderboard)
      setLeaderboardData(sortedLeaderboard)
      
    } catch (err) {
      console.error('DEBUG: Error in fetchLeaderboardRankings:', err)
      console.error('DEBUG: Error message:', err.message)
      setLeaderboardError(err.message)
      setLeaderboardData([])
    } finally {
      setLoadingLeaderboard(false)
    }
  }

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
      const result = await socialService.addFriend(friendEmail.trim().toLowerCase())
      
      console.log('Friend added successfully:', result)
      
      setShowAddFriend(false)
      setFriendEmail('')
      
      fetchFriendCount()
      fetchLeaderboardRankings()
      
    } catch (err) {
      setAddFriendError(err.message)
    } finally {
      setIsAddingFriend(false)
    }
  }

  const removeFriend = async (friendId) => {
    try {
      await socialService.removeFriend(friendId)
      fetchFriendCount()
      fetchLeaderboardRankings()
    } catch (err) {
      console.error('Error removing friend:', err)
    }
  }

  // Handle emoji reactions
  const handleReaction = (userId, emoji) => {
    setReactions(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [emoji]: (prev[userId]?.[emoji] || 0) + 1
      }
    }))
  }

  const createLeaderboardWithCurrentUser = () => {
    const allUsers = [...leaderboardData]
    
    const userExists = allUsers.find(u => u.email === currentUser.email)
    if (!userExists) {
      allUsers.push({
        ...currentUser,
        firstName: currentUser.name.split(' ')[0],
        lastName: currentUser.name.split(' ').slice(1).join(' '),
        isCurrentUser: true
      })
    } else {
      allUsers.forEach(u => {
        if (u.email === currentUser.email) {
          u.isCurrentUser = true
        }
      })
    }
    
    return allUsers.sort((a, b) => (b.score || 0) - (a.score || 0))
  }

  const leaderboardWithUser = createLeaderboardWithCurrentUser()

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Error Display for Count */}
      {countError && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          ⚠️ {countError}
          <button
            onClick={fetchFriendCount}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #dc2626',
              borderRadius: '0.25rem',
              color: '#dc2626',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Error Display for Leaderboard */}
      {leaderboardError && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          ⚠️ Failed to load leaderboard: {leaderboardError}
          <button
            onClick={fetchLeaderboardRankings}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #dc2626',
              borderRadius: '0.25rem',
              color: '#dc2626',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Enhanced User Rank Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '6px',
        padding: '24px',
        marginBottom: '32px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              fontSize: '48px',
              backgroundColor: '#f8fafc',
              borderRadius: '50%',
              width: '80px',
              height: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #e2e8f0',
              position: 'relative'
            }}>
              {currentUser.avatar}
              {/* Add motivational emoji based on score */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                fontSize: '20px',
                background: '#ffffff',
                borderRadius: '50%',
                padding: '2px',
                border: '2px solid #e2e8f0'
              }}>
                {getMotivationalEmoji(currentUser.score)}
              </div>
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1e293b',
                marginBottom: '4px',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {currentUser.name}
                {/* Add achievement emojis */}
                {getAchievementEmojis(currentUser.score, leaderboardWithUser.findIndex(u => u.email === currentUser.email) + 1).map((emoji, i) => (
                  <span key={i} style={{ fontSize: '18px' }}>{emoji}</span>
                ))}
              </h2>
              <div style={{
                fontSize: '16px',
                color: '#6b7280',
                marginBottom: '8px'
              }}>
                Rank #{leaderboardWithUser.findIndex(u => u.email === currentUser.email) + 1 || 'N/A'} • Score: {currentUser.score}
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                {currentUser.achievements.map((achievement, index) => (
                  <span key={index} style={{
                    fontSize: '12px',
                    padding: '4px 8px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '16px',
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
            gap: '16px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                {currentUser.score} 🎯
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Current Score
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                {loadingCount ? '...' : friendCount} 👥
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Friends
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Leaderboard */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        padding: '24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontWeight: '700',
            color: '#dc2626',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🏆 Leaderboard
          </h3>
          
          <button
            onClick={() => setShowAddFriend(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            Add Friend
          </button>
        </div>
        
        {loadingLeaderboard ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
            <p>Loading leaderboard...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leaderboardWithUser.map((person, index) => (
              <div
                key={person.id || person.email}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: person.isCurrentUser ? '#dbeafe' : '#f8fafc',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      border: '1px solid #d1d5db',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#64748b',
                      backgroundColor: '#ffffff'
                    }}>
                      {person.name ? person.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                    </div>
                    
                    {/* Enhanced Trophy/Medal icons with additional emojis */}
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        fontSize: '16px',
                        display: 'flex',
                        gap: '2px'
                      }}>
                        🏆
                      </div>
                    )}
                    {index === 1 && (
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        fontSize: '16px'
                      }}>
                        🥈
                      </div>
                    )}
                    {index === 2 && (
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        fontSize: '16px'
                      }}>
                        🥉
                      </div>
                    )}
                    
                    {/* Achievement indicator for high scores */}
                    {person.score >= 800 && index > 2 && (
                      <div style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        fontSize: '12px'
                      }}>
                        ⭐
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 style={{
                      fontWeight: '600',
                      color: '#1e293b',
                      margin: '0 0 4px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {person.isCurrentUser ? `${person.name} (You)` : person.name}
                      {/* Add achievement emojis next to name */}
                      {getAchievementEmojis(person.score || 0, index + 1).slice(0, 2).map((emoji, i) => (
                        <span key={i} style={{ fontSize: '14px' }}>{emoji}</span>
                      ))}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        Score: {person.score || 0} {getMotivationalEmoji(person.score || 0)}
                      </p>
                      {person.scoreChange && (
                        <span style={{
                          fontSize: '12px',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: person.scoreChange > 0 ? '#dcfce7' : '#fef2f2',
                          color: person.scoreChange > 0 ? '#16a34a' : '#dc2626',
                          border: `1px solid ${person.scoreChange > 0 ? '#bbf7d0' : '#fecaca'}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}>
                          {person.scoreChange > 0 ? '📈+' : '📉'}{person.scoreChange}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Emoji Reactions */}
                  {!person.isCurrentUser && (
                    <div style={{ display: 'flex', gap: '4px', marginRight: '8px' }}>
                      {emojiReactions.slice(0, 3).map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(person.id, emoji)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '16px',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'transform 0.1s ease',
                            ':hover': {
                              transform: 'scale(1.2)'
                            }
                          }}
                          title={`React with ${emoji}`}
                        >
                          {emoji}
                          {reactions[person.id]?.[emoji] && (
                            <span style={{
                              fontSize: '10px',
                              marginLeft: '2px',
                              color: '#6b7280'
                            }}>
                              {reactions[person.id][emoji]}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: '700',
                    backgroundColor: index === 0 ? '#fef3c7' : 
                                   index === 1 ? '#f1f5f9' : 
                                   index === 2 ? '#fefce8' : '#f8fafc',
                    color: index === 0 ? '#92400e' : 
                           index === 1 ? '#475569' : 
                           index === 2 ? '#a16207' : '#64748b',
                    border: `1px solid ${index === 0 ? '#fde68a' : 
                                        index === 1 ? '#e2e8f0' : 
                                        index === 2 ? '#fde047' : '#e2e8f0'}`
                  }}>
                    #{index + 1}
                  </div>
                  
                  {!person.isCurrentUser && (
                    <button
                      onClick={() => removeFriend(person.id)}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove Friend"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <line x1="22" y1="11" x2="16" y2="11"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              👥 Add Friend
            </h3>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Enter your friend's email address to add them to your network! 🚀
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
                ❌ {addFriendError}
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
                ❌ Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={handleAddFriend}
                disabled={!friendEmail.trim() || isAddingFriend}
              >
                {isAddingFriend ? '⏳ Adding...' : '✅ Add Friend'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Social
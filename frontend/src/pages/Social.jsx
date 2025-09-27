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
  const [friendName, setFriendName] = useState('')

  // Mock data for friends and leaderboard
  const mockFriends = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      score: 785,
      avatar: '👩‍💼',
      streak: 12,
      achievements: ['💰 Savings Master', '🎯 Goal Crusher'],
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      monthlyImprovement: +25
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      score: 742,
      avatar: '👨‍💻',
      streak: 8,
      achievements: ['📈 Investor', '🔥 Hot Streak'],
      lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
      monthlyImprovement: +15
    },
    {
      id: 3,
      name: 'Emily Davis',
      email: 'emily@example.com',
      score: 698,
      avatar: '👩‍🎓',
      streak: 15,
      achievements: ['🎓 Smart Spender', '⭐ Rising Star'],
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
      monthlyImprovement: +35
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex@example.com',
      score: 750, // Current user
      avatar: '👤',
      streak: 10,
      achievements: ['🚀 Getting Started', '💪 Consistent'],
      lastActive: new Date(),
      monthlyImprovement: +20
    },
    {
      id: 5,
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      score: 721,
      avatar: '👩‍🔬',
      streak: 6,
      achievements: ['🔬 Analyzer', '💡 Smart Choices'],
      lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      monthlyImprovement: +10
    }
  ]

  const currentFriends = friends || mockFriends.filter(f => f.email !== user?.email)
  const currentUser = mockFriends.find(f => f.email === user?.email) || mockFriends[3]

  // Create leaderboard with current user
  const leaderboardData = [...currentFriends, currentUser].sort((a, b) => b.score - a.score)

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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#3b82f6'
              }}>
                {currentUser.streak}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                Day Streak
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#10b981'
              }}>
                +{currentUser.monthlyImprovement}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                textTransform: 'uppercase'
              }}>
                This Month
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
              Add friends to join your financial journey and compete on the leaderboard!
            </p>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <Input 
                label="Friend's Name"
                type="text"
                placeholder="Enter friend's name"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                icon="👤"
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
                  setFriendName('')
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                disabled={!friendName}
              >
                Add Friend
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Social
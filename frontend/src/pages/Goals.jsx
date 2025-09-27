import { useState } from 'react'
import { useGoalsContext } from '../hooks/useGoalsContext'
import { useTheme } from '../context/ThemeContext'
import Button from '../components/Button'
import GoalsList from '../components/GoalsList'
import GoalForm from '../components/GoalForm'
import GoalChart from '../components/GoalChart'
import ChatbotModal from '../components/ChatbotModal'

const Goals = () => {
  const { goals } = useGoalsContext()
  const { darkMode } = useTheme()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)

  // Mock data if no goals
  const mockGoals = [
    {
      id: 1,
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
      category: 'savings',
      description: 'Build a 6-month emergency fund for financial security',
      priority: 'high',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: 'Dream Vacation to Japan',
      targetAmount: 5000,
      currentAmount: 1200,
      deadline: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
      category: 'travel',
      description: 'Two weeks exploring Tokyo, Kyoto, and Osaka',
      priority: 'medium',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: 'New Car Down Payment',
      targetAmount: 8000,
      currentAmount: 3200,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      category: 'car',
      description: 'Down payment for a reliable used car',
      priority: 'high',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      title: 'Investment Portfolio',
      targetAmount: 15000,
      currentAmount: 4800,
      deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      category: 'investment',
      description: 'Build a diversified investment portfolio',
      priority: 'medium',
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    }
  ]

  const currentGoals = goals || mockGoals

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

  const actionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }

  const statsRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  }

  const statCardStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.07)'
  }

  const statValueStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem'
  }

  const statLabelStyle = {
    fontSize: '0.875rem',
    color: darkMode ? '#9ca3af' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const contentGridStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr'
    }
  }

  const mainContentStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.07)'
  }

  const sidebarStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.07)',
    height: 'fit-content'
  }

  // Calculate stats
  const totalGoals = currentGoals.length
  const completedGoals = currentGoals.filter(g => (g.currentAmount / g.targetAmount) >= 1).length
  const totalTargetAmount = currentGoals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalCurrentAmount = currentGoals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleSectionStyle}>
          <h1 style={titleStyle}>
            🎯 Financial Goals
          </h1>
          <p style={subtitleStyle}>
            Track your progress and achieve your financial dreams
          </p>
        </div>

        <div style={actionButtonsStyle}>
          <Button 
            variant="primary" 
            icon="➕"
            onClick={() => setShowAddGoal(true)}
          >
            Add New Goal
          </Button>
          <Button 
            variant="secondary" 
            icon="💬"
            onClick={() => setShowChatbot(true)}
          >
            Ask AI Assistant
          </Button>
          <Button 
            variant="outline" 
            icon="📊"
          >
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={statsRowStyle}>
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#3b82f6' }}>
            {totalGoals}
          </div>
          <div style={statLabelStyle}>
            Total Goals
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#10b981' }}>
            {completedGoals}
          </div>
          <div style={statLabelStyle}>
            Completed
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#f59e0b' }}>
            {overallProgress.toFixed(1)}%
          </div>
          <div style={statLabelStyle}>
            Overall Progress
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#8b5cf6' }}>
            ${(totalTargetAmount - totalCurrentAmount).toLocaleString()}
          </div>
          <div style={statLabelStyle}>
            Remaining to Save
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={contentGridStyle}>
        {/* Goals List */}
        <div style={mainContentStyle}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: darkMode ? '#f8fafc' : '#1e293b'
            }}>
              Your Goals
            </h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
                backgroundColor: darkMode ? '#374151' : '#f8fafc',
                color: darkMode ? '#f8fafc' : '#1e293b',
                fontSize: '0.875rem'
              }}>
                <option>All Goals</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>High Priority</option>
              </select>
            </div>
          </div>
          
          <GoalsList goals={currentGoals} onSelectGoal={setSelectedGoal} />
        </div>

        {/* Sidebar */}
        <div>
          {/* Progress Chart */}
          <div style={sidebarStyle}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: darkMode ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              📈 Progress Overview
            </h3>
            <GoalChart goals={currentGoals} />
          </div>

          {/* Quick Tips */}
          <div style={{ ...sidebarStyle, marginTop: '1rem' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: darkMode ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              💡 Quick Tips
            </h3>
            
            <div style={{ space: '1rem' }}>
              <div style={{
                padding: '1rem',
                backgroundColor: darkMode ? '#374151' : '#f8fafc',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '0.5rem'
                }}>
                  🎯 Set SMART Goals
                </h4>
                <p style={{
                  fontSize: '0.75rem',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  lineHeight: '1.4'
                }}>
                  Make your goals Specific, Measurable, Achievable, Relevant, and Time-bound.
                </p>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: darkMode ? '#374151' : '#f8fafc',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#3b82f6',
                  marginBottom: '0.5rem'
                }}>
                  💰 Automate Savings
                </h4>
                <p style={{
                  fontSize: '0.75rem',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  lineHeight: '1.4'
                }}>
                  Set up automatic transfers to reach your goals faster.
                </p>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: darkMode ? '#374151' : '#f8fafc',
                borderRadius: '0.5rem',
                border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
              }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#f59e0b',
                  marginBottom: '0.5rem'
                }}>
                  📊 Track Progress
                </h4>
                <p style={{
                  fontSize: '0.75rem',
                  color: darkMode ? '#cbd5e1' : '#64748b',
                  lineHeight: '1.4'
                }}>
                  Review and update your goals monthly to stay on track.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddGoal && (
        <GoalForm 
          onClose={() => setShowAddGoal(false)} 
          goal={selectedGoal}
        />
      )}

      {showChatbot && (
        <ChatbotModal 
          onClose={() => setShowChatbot(false)}
          context="goals"
        />
      )}
    </div>
  )
}

export default Goals
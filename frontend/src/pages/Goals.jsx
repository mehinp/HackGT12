import { useState } from 'react'
import { useGoalsContext } from '../hooks/Data Management Hooks/useGoalsContext'
import { useTheme } from '../context/ThemeContext'
import Button from '../components/Button'
import GoalsList from '../components/Goals Components/GoalsList'
import GoalForm from '../components/Goals Components/GoalForm'
import ChatbotModal from '../components/chatbot/ChatbotModal'

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

  const mainContentStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.07)'
  }

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

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={{
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: darkMode ? '#f8fafc' : '#1e293b'
          }}>
            Your Goals
          </h2>
        </div>
        
        <GoalsList goals={currentGoals} onSelectGoal={setSelectedGoal} />
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
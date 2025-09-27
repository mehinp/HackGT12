// src/pages/Goals.jsx - Updated with proper data fetching
import { useState, useEffect } from 'react'
import { useGoalsContext } from '../hooks/Data Management Hooks/useGoalsContext'
import { authService } from '../services/authService'
import Button from '../components/Button'
import GoalsList from '../components/Goals Components/GoalsList'
import GoalForm from '../components/Goals Components/GoalForm'
import ChatbotModal from '../components/chatbot/ChatbotModal'

const Goals = () => {
  const { goals, dispatch } = useGoalsContext()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch goals when component mounts
  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
  try {
    setLoading(true)
    setError('')
    
    const userId = localStorage.getItem('userId')
    console.log('Fetching goals for userId:', userId)
    
    if (!userId) {
      setError('User not authenticated. Please log in again.')
      return
    }

    // Fetch goals from the backend
    const response = await fetch('http://143.215.104.239:8080/goals/my-goals', {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId
      }
    })

    console.log('Goals API Response Status:', response.status)
    console.log('Goals API Response Headers:', [...response.headers.entries()])

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Goals API Error Response:', errorText)
      
      if (response.status === 401) {
        setError('Session expired. Please log in again.')
        localStorage.removeItem('userId')
        localStorage.removeItem('user')
        return
      }
      throw new Error(`Failed to fetch goals: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Goals API Response Data:', data)
    
    // Check if data has the expected structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response format from goals API')
    }

    // Transform single goal from backend
    let transformedGoals = []
    
    if (data.goal) {
      console.log('Transforming single goal:', data.goal)
      const goal = data.goal
      
      const transformedGoal = {
        title: goal.title || `Goal ${goal.id}`,
        saved: parseFloat(goal.saved) || 0,
        endDate: new Date(goal.endDate)
      }
      
      transformedGoals = [transformedGoal]
      console.log('Transformed goal:', transformedGoal)
    } else {
      console.log('No goal found in response')
      transformedGoals = []
    }

    console.log('Final goals array:', transformedGoals)

    // Update context with fetched goals
    dispatch({ type: 'SET_GOALS', payload: transformedGoals })
    
  } catch (err) {
    console.error('Error fetching goals:', err)
    setError(err.message || 'Failed to load goals')
    
    // Set empty goals array if fetch fails
    dispatch({ type: 'SET_GOALS', payload: [] })
  } finally {
    setLoading(false)
  }
}

  const handleGoalCreated = () => {
    // Refresh goals after creating a new one
    fetchGoals()
    setShowAddGoal(false)
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

  const errorStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #fecaca'
  }

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.125rem',
    color: '#6b7280'
  }

  // Show loading state
  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={titleSectionStyle}>
            <h1 style={titleStyle}>
              🎯 Financial Goals
            </h1>
            <p style={subtitleStyle}>
              Track your progress and achieve your financial dreams
            </p>
          </div>
        </div>

        <div style={mainContentStyle}>
          <div style={loadingStyle}>
            Loading your goals...
          </div>
        </div>
      </div>
    )
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
            onClick={fetchGoals}
          >
            Refresh Goals
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={errorStyle}>
          ⚠️ {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchGoals}
            style={{ marginLeft: '1rem' }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={{
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Your Goals ({goals?.length || 0})
          </h2>
        </div>
        
        <GoalsList goals={goals} onSelectGoal={setSelectedGoal} />
      </div>

      {/* Modals */}
      {showAddGoal && (
        <GoalForm 
          onClose={handleGoalCreated} 
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
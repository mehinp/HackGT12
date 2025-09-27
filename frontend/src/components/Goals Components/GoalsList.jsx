import { useTheme } from '../context/ThemeContext'
import { useGoalsContext } from '../hooks/useGoalsContext'
import GoalCard from './GoalCard'

const GoalsList = ({ goals, onSelectGoal }) => {
  const { darkMode } = useTheme()
  const { dispatch } = useGoalsContext()

  const handleDeleteGoal = async (goalId) => {
    // Mock delete - would normally make API call
    dispatch({ type: 'DELETE_GOAL', payload: { _id: goalId } })
  }

  const handleUpdateGoal = async (goalId, updates) => {
    // Mock update - would normally make API call
    const updatedGoal = goals.find(g => g.id === goalId)
    if (updatedGoal) {
      dispatch({ type: 'UPDATE_GOAL', payload: { ...updatedGoal, ...updates, _id: goalId } })
    }
  }

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: darkMode ? '#9ca3af' : '#6b7280'
  }

  if (!goals || goals.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          marginBottom: '0.5rem',
          color: darkMode ? '#f8fafc' : '#1e293b'
        }}>
          No goals yet
        </h3>
        <p style={{ marginBottom: '1.5rem' }}>
          Start by creating your first financial goal to track your progress.
        </p>
      </div>
    )
  }

  return (
    <div>
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onSelect={() => onSelectGoal && onSelectGoal(goal)}
          onDelete={() => handleDeleteGoal(goal.id)}
          onUpdate={(updates) => handleUpdateGoal(goal.id, updates)}
        />
      ))}
    </div>
  )
}

export default GoalsList
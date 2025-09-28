// src/components/Goals Components/GoalForm.jsx
import { useState } from 'react'
import { goalService } from '../../services/goalService'
import { useGoalsContext } from '../../hooks/Data Management Hooks/useGoalsContext'
import Button from '../Button'
import Input from '../Input'

const GoalForm = ({ onClose, goal, onSuccess }) => {
  const { dispatch } = useGoalsContext()
  const [formData, setFormData] = useState({
    title: goal?.title || '',
    amount: goal?.targetAmount || '',
    targetDate: goal?.deadline ? goal.deadline.toISOString().split('T')[0] : ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.title || !formData.amount || !formData.targetDate) {
      setError('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    // Check if date is at least 3 months away
    const selectedDate = new Date(formData.targetDate)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    
    if (selectedDate <= threeMonthsFromNow) {
      setError('Target date must be at least 3 months from today for a realistic spending reduction goal')
      return
    }

    setIsSubmitting(true)

    try {
      const goalData = {
        title: formData.title,
        saved: parseFloat(formData.amount),
        endDate: formData.targetDate
      }

      const result = await goalService.createGoal(goalData)
      console.log('Goal created:', result)
      
      // Add the goal to context
      dispatch({ type: 'ADD_GOAL', payload: result })
      
      // Call onSuccess callback with the new goal
      if (onSuccess) {
        onSuccess(result)
      }
      
      onClose()
    } catch (err) {
      console.error('Goal creation error:', err)
      setError(err.message || 'Failed to create goal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalStyle = {
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
  }

  const formContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    border: '1px solid #e2e8f0',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
  }

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#374151',
    fontSize: '0.875rem'
  }

  const dateInputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontSize: '1rem'
  }

  const errorStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #fecaca',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  }

  const descriptionStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0'
  }

  const getMinDate = () => {
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return threeMonthsFromNow.toISOString().split('T')[0]
  }

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={formContainerStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={titleStyle}>
          Create Spending Reduction Goal
        </h3>

        <div style={descriptionStyle}>
          Set a goal to reduce your spending and build better financial habits. 
          Choose a realistic timeframe of at least 3 months to see meaningful results.
        </div>
        
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              label="Goal Title"
              placeholder="e.g., Reduce Dining Out Expenses"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>I want to reduce my total spending  by </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}>
              <span style={{ color: '#1e293b' }}>$</span>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="500"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                style={{
                  ...dateInputStyle,
                  width: '120px',
                  display: 'inline-block'
                }}
                required
              />
              <span style={{ color: '#1e293b' }}>by</span>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                style={{
                  ...dateInputStyle,
                  width: '150px',
                  display: 'inline-block'
                }}
                min={getMinDate()}
                required
              />
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.5rem'
            }}>
              Target date must be at least 3 months from today
            </div>
          </div>

          {formData.amount && formData.targetDate && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderRadius: '0.5rem',
              border: '1px solid #bbf7d0',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#166534',
                fontWeight: '500'
              }}>
                Goal Preview: Reduce spending by ${parseFloat(formData.amount || 0).toFixed(2)}
                {' '}by {formData.targetDate ? new Date(formData.targetDate).toLocaleDateString() : 'selected date'}

              </div>
            </div>
          )}
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <Button 
              type="button"
              variant="secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Goal...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GoalForm
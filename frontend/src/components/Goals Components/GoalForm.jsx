import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useGoalsContext } from '../../hooks/Data Management Hooks/useGoalsContext'
import Button from '../Button'
import Input from '../Input'

const GoalForm = ({ onClose, goal = null }) => {
  const { darkMode } = useTheme()
  const { dispatch } = useGoalsContext()
  const isEditing = !!goal

  const [formData, setFormData] = useState({
    title: goal?.title || '',
    description: goal?.description || '',
    targetAmount: goal?.targetAmount || '',
    currentAmount: goal?.currentAmount || 0,
    deadline: goal?.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
    category: goal?.category || 'savings',
    priority: goal?.priority || 'medium'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    { value: 'savings', label: '💰 Emergency Fund', emoji: '💰' },
    { value: 'travel', label: '✈️ Travel & Vacation', emoji: '✈️' },
    { value: 'house', label: '🏠 Home & Property', emoji: '🏠' },
    { value: 'car', label: '🚗 Vehicle', emoji: '🚗' },
    { value: 'education', label: '🎓 Education', emoji: '🎓' },
    { value: 'investment', label: '📈 Investment', emoji: '📈' },
    { value: 'other', label: '🎯 Other', emoji: '🎯' }
  ]

  const priorities = [
    { value: 'low', label: 'Low Priority', color: '#10b981' },
    { value: 'medium', label: 'Medium Priority', color: '#f59e0b' },
    { value: 'high', label: 'High Priority', color: '#ef4444' }
  ]

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  }

  const formContainerStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  }

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: darkMode ? '#f8fafc' : '#1e293b',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const subtitleStyle = {
    fontSize: '0.875rem',
    color: darkMode ? '#9ca3af' : '#6b7280',
    marginBottom: '2rem'
  }

  const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem'
  }

  const selectStyle = {
    width: '100%',
    padding: '0.75rem',
    border: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
    borderRadius: '0.5rem',
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: '1rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: darkMode ? '#f8fafc' : '#374151',
    fontSize: '0.875rem'
  }

  const priorityButtonStyle = (priority, isSelected) => ({
    flex: 1,
    padding: '0.75rem',
    border: `2px solid ${isSelected ? priorities.find(p => p.value === priority)?.color : (darkMode ? '#374151' : '#e2e8f0')}`,
    borderRadius: '0.5rem',
    backgroundColor: isSelected ? (priorities.find(p => p.value === priority)?.color + '20') : 'transparent',
    color: isSelected ? priorities.find(p => p.value === priority)?.color : (darkMode ? '#f8fafc' : '#1e293b'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.875rem',
    fontWeight: '500'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required'
    }

    if (!formData.targetAmount || formData.targetAmount <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0'
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required'
    } else {
      const deadlineDate = new Date(formData.deadline)
      const today = new Date()
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future'
      }
    }

    if (formData.currentAmount < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative'
    }

    if (formData.currentAmount > formData.targetAmount) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount || 0),
        deadline: new Date(formData.deadline),
        id: isEditing ? goal.id : Date.now(),
        createdAt: isEditing ? goal.createdAt : new Date()
      }

      if (isEditing) {
        dispatch({ type: 'UPDATE_GOAL', payload: { ...goalData, _id: goal.id } })
      } else {
        dispatch({ type: 'CREATE_GOAL', payload: goalData })
      }

      onClose()
    } catch (error) {
      console.error('Error saving goal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = formData.targetAmount > 0 ? (formData.currentAmount / formData.targetAmount) * 100 : 0

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={formContainerStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div>
          <h2 style={titleStyle}>
            🎯 {isEditing ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <p style={subtitleStyle}>
            {isEditing ? 'Update your financial goal' : 'Set a new financial target to work towards'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Goal Title */}
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Goal Title"
              placeholder="e.g., Emergency Fund, Dream Vacation"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              required
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your goal and why it's important to you..."
              style={{
                ...selectStyle,
                minHeight: '80px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Amount Fields */}
          <div style={formRowStyle}>
            <Input
              label="Target Amount"
              type="number"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={(e) => handleInputChange('targetAmount', e.target.value)}
              error={errors.targetAmount}
              icon="💰"
              required
            />
            
            <Input
              label="Current Amount"
              type="number"
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={(e) => handleInputChange('currentAmount', e.target.value)}
              error={errors.currentAmount}
              icon="💵"
            />
          </div>

          {/* Progress Preview */}
          {formData.targetAmount > 0 && (
            <div style={{
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: darkMode ? '#374151' : '#f8fafc',
              borderRadius: '0.5rem',
              border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                color: darkMode ? '#f8fafc' : '#1e293b'
              }}>
                <span>Progress Preview</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: '#10b981',
                  borderRadius: '4px',
                  width: `${Math.min(progress, 100)}%`,
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
          )}

          {/* Deadline and Category */}
          <div style={formRowStyle}>
            <div>
              <label style={labelStyle}>Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                style={selectStyle}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deadline && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.deadline}
                </div>
              )}
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                style={selectStyle}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>Priority Level</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {priorities.map(priority => (
                <button
                  key={priority.value}
                  type="button"
                  onClick={() => handleInputChange('priority', priority.value)}
                  style={priorityButtonStyle(priority.value, formData.priority === priority.value)}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <Button
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
              {isSubmitting 
                ? (isEditing ? '⏳ Updating...' : '⏳ Creating...') 
                : (isEditing ? '✅ Update Goal' : '🚀 Create Goal')
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GoalForm
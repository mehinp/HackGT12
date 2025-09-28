// src/components/Goals Components/GoalCard.jsx
import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import Button from '../Button'

const GoalCard = ({ goal, onSelect, onDelete, onUpdate }) => {
  const { darkMode } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  // Calculate progress
  const targetAmount = goal.saved || goal.targetAmount || 0
  const currentSaved = goal.currentAmount || goal.progress || 0
  const progressPercentage = targetAmount > 0 ? Math.min((currentSaved / targetAmount) * 100, 100) : 0
  
  // Calculate time remaining
  const endDate = new Date(goal.endDate || goal.deadline)
  const today = new Date()
  const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
  const isOverdue = daysRemaining < 0
  
  // Format dates
  const formattedEndDate = endDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const cardStyle = {
    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
    border: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: darkMode 
      ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.07)',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  }

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b',
    marginBottom: '0.5rem'
  }

  const amountStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: darkMode ? '#10b981' : '#059669',
    marginBottom: '0.25rem'
  }

  const progressBarContainerStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: darkMode ? '#374151' : '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '1rem'
  }

  const progressBarStyle = {
    height: '100%',
    backgroundColor: progressPercentage >= 100 ? '#10b981' : '#3b82f6',
    width: `${progressPercentage}%`,
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  }

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem'
  }

  const statItemStyle = {
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.5rem'
  }

  const statLabelStyle = {
    fontSize: '0.75rem',
    color: darkMode ? '#9ca3af' : '#6b7280',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const statValueStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b'
  }

  const timeRemainingStyle = {
    fontSize: '0.875rem',
    color: isOverdue 
      ? '#dc2626' 
      : daysRemaining <= 30 
        ? '#f59e0b' 
        : darkMode ? '#9ca3af' : '#6b7280',
    fontWeight: '500'
  }

  const actionButtonsStyle = {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
    marginTop: '1rem'
  }

  const getStatusBadge = () => {
    if (progressPercentage >= 100) {
      return {
        text: 'Completed ✅',
        style: {
          backgroundColor: '#d1fae5',
          color: '#065f46',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '500'
        }
      }
    } else if (isOverdue) {
      return {
        text: 'Overdue ⚠️',
        style: {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '500'
        }
      }
    } else if (daysRemaining <= 30) {
      return {
        text: 'Due Soon 🔥',
        style: {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '0.25rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '500'
        }
      }
    }
    return {
      text: 'In Progress 📈',
      style: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '0.25rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '500'
      }
    }
  }

  const statusBadge = getStatusBadge()

  return (
    <div 
      style={cardStyle}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <h3 style={titleStyle}>{goal.title}</h3>
          <div style={amountStyle}>
            ${currentSaved.toFixed(2)} / ${targetAmount.toFixed(2)}
          </div>
          <div style={timeRemainingStyle}>
            {isOverdue 
              ? `Overdue by ${Math.abs(daysRemaining)} days`
              : `${daysRemaining} days remaining • Due ${formattedEndDate}`
            }
          </div>
        </div>
        <div style={statusBadge.style}>
          {statusBadge.text}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={progressBarContainerStyle}>
        <div style={progressBarStyle} />
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        color: darkMode ? '#9ca3af' : '#6b7280',
        marginBottom: '1rem'
      }}>
        <span>{progressPercentage.toFixed(1)}% Complete</span>
        <span>${(targetAmount - currentSaved).toFixed(2)} remaining</span>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div>
          <div style={statsContainerStyle}>
            <div style={statItemStyle}>
              <div style={statLabelStyle}>Daily Target</div>
              <div style={statValueStyle}>
                ${daysRemaining > 0 ? ((targetAmount - currentSaved) / daysRemaining).toFixed(2) : '0.00'}
              </div>
            </div>
            <div style={statItemStyle}>
              <div style={statLabelStyle}>Weekly Target</div>
              <div style={statValueStyle}>
                ${daysRemaining > 0 ? ((targetAmount - currentSaved) / Math.max(daysRemaining / 7, 1)).toFixed(2) : '0.00'}
              </div>
            </div>
            <div style={statItemStyle}>
              <div style={statLabelStyle}>Created</div>
              <div style={statValueStyle}>
                {goal.createdAt ? new Date(goal.createdAt).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={actionButtonsStyle}>
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                const newAmount = prompt(`Current saved amount (current: $${currentSaved}):`, currentSaved)
                if (newAmount !== null && !isNaN(parseFloat(newAmount))) {
                  onUpdate({ currentAmount: parseFloat(newAmount) })
                }
              }}
            >
              Update Progress
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              Edit Goal
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm('Are you sure you want to delete this goal?')) {
                  onDelete()
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoalCard
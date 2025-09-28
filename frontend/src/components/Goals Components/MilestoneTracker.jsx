import React, { useState } from 'react'
import { useGoalsContext } from '../hooks/useGoalsContext'
import { useScoreContext } from '../hooks/useScoreContext'
import ProgressBar from './ProgressBar'
import ScoreDisplay from './ScoreDisplay'

const MilestoneTracker = ({ goalId, showDetails = true }) => {
  const { goals, progress, updateProgress, calculateGoalScore } = useGoalsContext()
  const { addXP, updateCategoryScore } = useScoreContext()
  const [isEditing, setIsEditing] = useState(false)
  const [newAmount, setNewAmount] = useState('')

  const goal = goals.find(g => g.id === goalId)
  const goalProgress = progress[goalId]
  
  if (!goal) return null

  const progressPercentage = goalProgress?.percentage || 0
  const currentAmount = goal.currentAmount || 0
  const remainingAmount = goal.targetAmount - currentAmount
  const goalScore = calculateGoalScore(goalId)

  const handleProgressUpdate = (amount) => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    updateProgress(goalId, numAmount)
    
    // Award XP for progress
    const xpReward = Math.floor(numAmount / 10) // 1 XP per $10
    addXP(xpReward, 'goal progress')

    // Update goal category score
    updateCategoryScore('goals', goalScore)

    setNewAmount('')
    setIsEditing(false)
  }

  const getMilestones = () => {
    const milestones = []
    const totalAmount = goal.targetAmount
    
    // Create milestones at 25%, 50%, 75%, and 100%
    for (let i = 25; i <= 100; i += 25) {
      const milestoneAmount = (totalAmount * i) / 100
      const isReached = currentAmount >= milestoneAmount
      const isNext = !isReached && currentAmount >= (totalAmount * (i - 25)) / 100
      
      milestones.push({
        percentage: i,
        amount: milestoneAmount,
        isReached,
        isNext,
        label: i === 100 ? 'Goal Complete!' : `${i}% Complete`
      })
    }
    
    return milestones
  }

  const getTimeRemaining = () => {
    const now = new Date()
    const targetDate = new Date(goal.targetDate)
    const diffTime = targetDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return '1 day remaining'
    if (diffDays < 30) return `${diffDays} days remaining`
    
    const diffMonths = Math.floor(diffDays / 30)
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} remaining`
  }

  const getStatusColor = () => {
    if (goalScore >= 5) return 'var(--score-excellent)'
    if (goalScore >= 0) return 'var(--score-good)'
    if (goalScore >= -5) return 'var(--score-fair)'
    return 'var(--score-poor)'
  }

  const milestones = getMilestones()

  return (
    <div className="milestone-tracker" style={{ 
      background: 'var(--bg-secondary)', 
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      marginBottom: '1rem'
    }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{goal.name}</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {goal.category} • {getTimeRemaining()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ScoreDisplay score={goalScore} size="small" />
          <div className="text-right">
            <div className="font-semibold">
              ${currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              ${remainingAmount.toLocaleString()} remaining
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar 
          progress={progressPercentage} 
          height="12px"
          color={getStatusColor()}
          showLabel={true}
          label={`${progressPercentage.toFixed(1)}%`}
        />
      </div>

      {showDetails && (
        <>
          {/* Milestones */}
          <div className="milestones mb-4">
            <h4 className="font-medium mb-3">Milestones</h4>
            <div className="grid grid-cols-2 gap-2">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`milestone-item p-2 rounded ${milestone.isReached ? 'bg-green-100' : milestone.isNext ? 'bg-blue-100' : 'bg-gray-100'}`}
                  style={{
                    background: milestone.isReached 
                      ? 'var(--success-light)' 
                      : milestone.isNext 
                      ? 'var(--primary-light)' 
                      : 'var(--bg-tertiary)',
                    border: milestone.isNext ? '2px solid var(--primary)' : '1px solid var(--border)'
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{milestone.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">${milestone.amount.toLocaleString()}</span>
                      {milestone.isReached && <span className="text-green-600">✓</span>}
                      {milestone.isNext && <span className="text-blue-600">→</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Progress */}
          <div className="add-progress">
            <h4 className="font-medium mb-3">Update Progress</h4>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  padding: '0.75rem 1.5rem'
                }}
              >
                Add Progress
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="form-input flex-1"
                  style={{ maxWidth: '150px' }}
                />
                <button
                  onClick={() => handleProgressUpdate(newAmount)}
                  className="btn"
                  style={{
                    background: 'var(--success)',
                    color: 'white',
                    padding: '0.75rem 1rem'
                  }}
                  disabled={!newAmount || parseFloat(newAmount) <= 0}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setNewAmount('')
                  }}
                  className="btn"
                  style={{
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    padding: '0.75rem 1rem'
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {goal.status === 'active' && (
            <div className="quick-actions mt-4">
              <h5 className="font-medium mb-2">Quick Add</h5>
              <div className="flex gap-2 flex-wrap">
                {[10, 25, 50, 100].map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleProgressUpdate(amount)}
                    className="btn text-sm"
                    style={{
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)',
                      padding: '0.5rem 1rem',
                      border: '1px solid var(--border)'
                    }}
                  >
                    +${amount}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goal Analysis */}
          <div className="goal-analysis mt-4 p-3 rounded" style={{ background: 'var(--bg-tertiary)' }}>
            <h5 className="font-medium mb-2">Progress Analysis</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Daily Target:</span>
                <div className="font-medium">
                  ${((goal.targetAmount - currentAmount) / Math.max(1, Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)))).toFixed(2)}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>On Track:</span>
                <div className="font-medium" style={{ color: goalScore >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {goalScore >= 0 ? 'Yes' : 'Behind'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MilestoneTracker
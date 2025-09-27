import { useScoreContext } from '../hooks/useScoreContext'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'

const ScoreWidget = () => {
  const { currentScore, getScoreColor, getScoreLabel } = useScoreContext()
  const { darkMode } = useTheme()
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    // Animate score counting up
    const timer = setTimeout(() => {
      if (animatedScore < currentScore) {
        setAnimatedScore(prev => Math.min(prev + 5, currentScore))
      }
    }, 20)
    return () => clearTimeout(timer)
  }, [animatedScore, currentScore])

  const scoreColor = getScoreColor(currentScore)
  const scoreLabel = getScoreLabel(currentScore)

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  }

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const scoreContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5rem'
  }

  const scoreNumberStyle = {
    fontSize: '3rem',
    fontWeight: '700',
    color: scoreColor,
    lineHeight: '1',
    marginBottom: '0.5rem'
  }

  const scoreLabelStyle = {
    fontSize: '1rem',
    fontWeight: '500',
    color: scoreColor,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: darkMode ? '#374151' : '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '1rem'
  }

  const progressFillStyle = {
    height: '100%',
    backgroundColor: scoreColor,
    borderRadius: '4px',
    width: `${(currentScore / 850) * 100}%`,
    transition: 'width 0.5s ease'
  }

  const rangeLabelsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: darkMode ? '#9ca3af' : '#6b7280',
    marginBottom: '1.5rem'
  }

  const improvementStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '0.5rem',
    border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
  }

  const getScoreEmoji = (score) => {
    if (score >= 800) return '🏆'
    if (score >= 700) return '✨'
    if (score >= 600) return '👍'
    return '📈'
  }

  const getImprovementTip = (score) => {
    if (score >= 800) return "Excellent! You're in the top tier!"
    if (score >= 700) return "Great job! Small optimizations can boost you higher"
    if (score >= 600) return "Good progress! Focus on reducing unnecessary spending"
    return "Room for improvement! Start by tracking all expenses"
  }

  return (
    <div>
      <div style={headerStyle}>
        <h3 style={titleStyle}>
          📊 Financial Score
        </h3>
        <span style={{ fontSize: '1.5rem' }}>
          {getScoreEmoji(currentScore)}
        </span>
      </div>

      <div style={scoreContainerStyle}>
        <div style={scoreNumberStyle}>
          {animatedScore}
        </div>
        <div style={scoreLabelStyle}>
          {scoreLabel}
        </div>
      </div>

      <div style={progressBarStyle}>
        <div style={progressFillStyle}></div>
      </div>

      <div style={rangeLabelsStyle}>
        <span>Poor (300)</span>
        <span>Fair (600)</span>
        <span>Good (700)</span>
        <span>Excellent (850)</span>
      </div>

      <div style={improvementStyle}>
        <span style={{ fontSize: '0.875rem', textAlign: 'center', color: darkMode ? '#cbd5e1' : '#64748b' }}>
          {getImprovementTip(currentScore)}
        </span>
      </div>
    </div>
  )
}

export default ScoreWidget
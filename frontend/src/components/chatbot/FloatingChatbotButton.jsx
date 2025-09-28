// src/components/chatbot/FloatingChatbotButton.jsx
import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

const FloatingChatbotButton = ({ onClick, context = 'general' }) => {
  const { darkMode } = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const buttonStyle = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    border: 'none',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: '#ffffff',
    transition: 'all 0.3s ease',
    zIndex: 999,
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    animation: showTooltip ? 'none' : 'float 3s ease-in-out infinite'
  }

  const tooltipStyle = {
    position: 'absolute',
    bottom: '70px',
    right: '0',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    opacity: showTooltip ? 1 : 0,
    transform: showTooltip ? 'translateY(0)' : 'translateY(10px)',
    transition: 'all 0.3s ease',
    pointerEvents: 'none'
  }

  const tooltipArrowStyle = {
    position: 'absolute',
    bottom: '-6px',
    right: '20px',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: `6px solid ${darkMode ? '#1e293b' : '#ffffff'}`
  }

  const getTooltipText = () => {
    switch (context) {
      case 'goals':
        return '💬 Ask me about your goals!'
      case 'purchases':
        return '💬 Get spending insights!'
      case 'social':
        return '💬 Social features help!'
      default:
        return '💬 Need financial help?'
    }
  }

  const pulseStyle = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes pulse {
      0% { box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3); }
      50% { box-shadow: 0 8px 35px rgba(59, 130, 246, 0.5); }
      100% { box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3); }
    }
  `

  return (
    <>
      <style>{pulseStyle}</style>
      <div style={{ position: 'relative' }}>
        <button
          style={buttonStyle}
          onClick={onClick}
          onMouseEnter={() => {
            setIsHovered(true)
            setShowTooltip(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
            setShowTooltip(false)
          }}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          aria-label="Open AI Assistant"
          title={getTooltipText()}
        >
          🤖
        </button>
        
        <div style={tooltipStyle}>
          {getTooltipText()}
          <div style={tooltipArrowStyle}></div>
        </div>
      </div>
    </>
  )
}

export default FloatingChatbotButton
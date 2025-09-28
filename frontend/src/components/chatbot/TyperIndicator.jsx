import { useTheme } from '../context/ThemeContext'

const TypingIndicator = () => {
  const { darkMode } = useTheme()

  const containerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: '0.5rem',
    maxWidth: '100%'
  }

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    flexShrink: 0
  }

  const bubbleStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '1rem 1rem 1rem 0.25rem',
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    border: !darkMode ? '1px solid #e2e8f0' : 'none',
    boxShadow: darkMode 
      ? '0 2px 4px rgba(0,0,0,0.3)' 
      : '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  }

  const dotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: darkMode ? '#9ca3af' : '#6b7280',
    animation: 'typing 1.4s infinite ease-in-out'
  }

  const dot2Style = {
    ...dotStyle,
    animationDelay: '0.2s'
  }

  const dot3Style = {
    ...dotStyle,
    animationDelay: '0.4s'
  }

  const textStyle = {
    fontSize: '0.875rem',
    color: darkMode ? '#9ca3af' : '#6b7280',
    marginLeft: '0.5rem'
  }

  return (
    <>
      <style>
        {`
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
        `}
      </style>
      
      <div style={containerStyle}>
        <div style={avatarStyle}>
          🤖
        </div>
        
        <div style={bubbleStyle}>
          <div style={dotStyle}></div>
          <div style={dot2Style}></div>
          <div style={dot3Style}></div>
          <span style={textStyle}>AI is thinking...</span>
        </div>
      </div>
    </>
  )
}

export default TypingIndicator
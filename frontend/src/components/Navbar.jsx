import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import { useScoreContext } from '../hooks/Data Management Hooks/useScoreContext'
import Button from './Button'

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme()
  const { user, dispatch } = useAuthContext()
  const { currentScore, getScoreColor } = useScoreContext()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  const navStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderBottom: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#3b82f6',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const navLinksStyle = {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#3b82f6' : darkMode ? '#cbd5e1' : '#64748b',
    textDecoration: 'none',
    fontWeight: location.pathname === path ? '600' : '500',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease',
    position: 'relative'
  })

  const scoreDisplayStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    borderRadius: '2rem',
    border: `1px solid ${darkMode ? '#4b5563' : '#e2e8f0'}`
  }

  const userMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }

  const themeToggleStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.25rem',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease',
    color: darkMode ? '#f8fafc' : '#374151'
  }

  const mobileMenuStyle = {
    display: 'none'
  }

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          💰 FinanceTracker
        </Link>

        {/* Desktop Navigation */}
        <div style={navLinksStyle}>
          <Link 
            to="/" 
            style={linkStyle('/')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/') {
                e.target.style.backgroundColor = darkMode ? '#374151' : '#f8fafc'
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/') {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            🏠 Home
          </Link>
          
          <Link 
            to="/goals" 
            style={linkStyle('/goals')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/goals') {
                e.target.style.backgroundColor = darkMode ? '#374151' : '#f8fafc'
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/goals') {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            🎯 Goals
          </Link>
          
          <Link 
            to="/purchases" 
            style={linkStyle('/purchases')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/purchases') {
                e.target.style.backgroundColor = darkMode ? '#374151' : '#f8fafc'
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/purchases') {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            🛒 Purchases
          </Link>
          
          <Link 
            to="/social" 
            style={linkStyle('/social')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/social') {
                e.target.style.backgroundColor = darkMode ? '#374151' : '#f8fafc'
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/social') {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            👥 Social
          </Link>
        </div>

        {/* User Menu */}
        <div style={userMenuStyle}>
          {/* Score Display */}
          <div style={scoreDisplayStyle}>
            <span style={{ fontSize: '0.875rem', color: darkMode ? '#cbd5e1' : '#64748b' }}>
              Score:
            </span>
            <span style={{ 
              fontWeight: '700', 
              color: getScoreColor(currentScore),
              fontSize: '1rem'
            }}>
              {currentScore}
            </span>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            style={themeToggleStyle}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = darkMode ? '#374151' : '#f8fafc'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Profile */}
          <Link 
            to="/profile" 
            style={{
              ...linkStyle('/profile'),
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            👤 {user?.name || user?.email?.split('@')[0] || 'Profile'}
          </Link>

          {/* Logout Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            icon="🚪"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile menu toggle - for future implementation */}
      <div style={mobileMenuStyle}>
        <button>☰</button>
      </div>
    </nav>
  )
}

export default Navbar
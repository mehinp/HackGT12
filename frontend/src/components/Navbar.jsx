// src/components/Navbar.jsx - Simple dynamic score without context dependency
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import { useLogout } from '../hooks/Authentication hooks/useLogout'
import Button from './Button'

const Navbar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const location = useLocation()
  const [currentScore, setCurrentScore] = useState(500)

  // Calculate score based on user's financial situation (consistent with Home page)
  useEffect(() => {
    const calculateDynamicScore = () => {
      try {
        // Base score
        let calculatedScore = 500

        // Adjust based on user's income vs expenditures ratio (same as Home page)
        if (user?.income && user?.expenditures) {
          const ratio = user.income / user.expenditures
          
          if (ratio >= 2.0) {
            calculatedScore += 150
          } else if (ratio >= 1.5) {
            calculatedScore += 100
          } else if (ratio >= 1.2) {
            calculatedScore += 50
          } else if (ratio >= 1.0) {
            calculatedScore += 25
          } else {
            calculatedScore -= 100
          }
          
          // Add user-specific variance for consistency
          const userId = parseInt(localStorage.getItem('userId')) || 0
          const variance = (userId % 100) - 50
          calculatedScore += variance
        }

        // Clamp between 300 and 850
        calculatedScore = Math.max(300, Math.min(850, calculatedScore))
        
        setCurrentScore(Math.round(calculatedScore))
      } catch (error) {
        console.log('Error calculating score, using default:', error)
        setCurrentScore(500)
      }
    }

    if (user) {
      calculateDynamicScore()
    }
  }, [user])

  const getScoreColor = (score) => {
    if (score >= 700) return '#10b981'
    if (score >= 600) return '#f59e0b'
    if (score >= 500) return '#ef4444'
    return '#6b7280'
  }

  const getScoreStatus = (score) => {
    if (score >= 700) return 'Excellent'
    if (score >= 600) return 'Good'
    if (score >= 500) return 'Fair'
    return 'Poor'
  }

  const handleLogout = async () => {
    await logout()
  }

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    if (user?.firstName) return user.firstName
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return 'Profile'
  }

  const navStyle = {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
    gap: '0.5rem',
    alignItems: 'center'
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#ffffff' : '#64748b',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    transition: 'all 0.2s ease',
    position: 'relative',
    backgroundColor: location.pathname === path ? '#dc2626' : 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '4.5rem',
    fontSize: '0.75rem'
  })

  const scoreDisplayStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#f8fafc',
    borderRadius: '2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease'
  }

  const userMenuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }

  const userLinkStyle = {
    ...linkStyle('/profile'),
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem'
  }

  const iconStyle = {
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
    display: 'block'
  }

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: '1'
  }

  // Add hover effect for score display
  const handleScoreHover = (e, isEntering) => {
    if (isEntering) {
      e.currentTarget.style.backgroundColor = '#f1f5f9'
      e.currentTarget.style.transform = 'scale(1.02)'
    } else {
      e.currentTarget.style.backgroundColor = '#f8fafc'
      e.currentTarget.style.transform = 'scale(1)'
    }
  }

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <Link to="/" style={logoStyle}>
          📊 Metron Finance
        </Link>

        {/* Desktop Navigation */}
        <div style={navLinksStyle}>
          <Link 
            to="/" 
            style={linkStyle('/')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/') {
                e.target.style.backgroundColor = '#f8fafc'
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/') {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div style={iconStyle}>🏠</div>
            <span style={labelStyle}>Home</span>
          </Link>
          
          <Link 
            to="/goals" 
            style={linkStyle('/goals')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/goals') {
                e.target.style.backgroundColor = '#f8fafc'
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/goals') {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div style={iconStyle}>🎯</div>
            <span style={labelStyle}>Goals</span>
          </Link>
          
          <Link 
            to="/purchases" 
            style={linkStyle('/purchases')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/purchases') {
                e.target.style.backgroundColor = '#f8fafc'
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/purchases') {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div style={iconStyle}>🛒</div>
            <span style={labelStyle}>Transactions</span>
          </Link>
          
          <Link 
            to="/social" 
            style={linkStyle('/social')}
            onMouseEnter={(e) => {
              if (location.pathname !== '/social') {
                e.target.style.backgroundColor = '#f8fafc'
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/social') {
                e.target.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div style={iconStyle}>👥</div>
            <span style={labelStyle}>Social</span>
          </Link>
        </div>

        {/* User Menu */}
        <div style={userMenuStyle}>
          {/* Enhanced Score Display */}
          <div 
            style={scoreDisplayStyle}
            onMouseEnter={(e) => handleScoreHover(e, true)}
            onMouseLeave={(e) => handleScoreHover(e, false)}
            title={`Financial Score: ${currentScore} (${getScoreStatus(currentScore)})`}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getScoreColor(currentScore),
                boxShadow: `0 0 6px ${getScoreColor(currentScore)}40`
              }}></div>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#64748b',
                fontWeight: '500'
              }}>
                Score:
              </span>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '1px'
            }}>
              <span style={{ 
                fontWeight: '700', 
                color: getScoreColor(currentScore),
                fontSize: '1.125rem',
                lineHeight: '1'
              }}>
                {currentScore}
              </span>
              <span style={{
                fontSize: '0.6rem',
                color: getScoreColor(currentScore),
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: '1'
              }}>
                {getScoreStatus(currentScore)}
              </span>
            </div>
          </div>

          {/* User Profile */}
          <Link to="/profile" style={userLinkStyle}>
            <div style={iconStyle}>👤</div>
            <span style={labelStyle}>{getUserDisplayName()}</span>
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
    </nav>
  )
}

export default Navbar
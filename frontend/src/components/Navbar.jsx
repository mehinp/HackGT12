// src/components/Navbar.jsx
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

  // ---- Score calculation ----
  useEffect(() => {
    const calculateDynamicScore = () => {
      try {
        let calculatedScore = 500
        if (user?.income && user?.expenditures) {
          const ratio = user.income / user.expenditures
          if (ratio >= 2.0) calculatedScore += 150
          else if (ratio >= 1.5) calculatedScore += 100
          else if (ratio >= 1.2) calculatedScore += 50
          else if (ratio >= 1.0) calculatedScore += 25
          else calculatedScore -= 100

          const userId = parseInt(localStorage.getItem('userId')) || 0
          const variance = (userId % 100) - 50
          calculatedScore += variance
        }
        calculatedScore = Math.max(300, Math.min(850, calculatedScore))
        setCurrentScore(Math.round(calculatedScore))
      } catch (e) {
        console.log('Error calculating score, using default:', e)
        setCurrentScore(500)
      }
    }
    if (user) calculateDynamicScore()
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

  const handleLogout = async () => { await logout() }

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
    if (user?.firstName) return user.firstName
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return 'Profile'
  }

  // ---- Styles ----
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
    alignItems: 'center',
    gap: '1rem'
  }
  const leftGroupStyle = { display: 'flex', alignItems: 'center', gap: '1.25rem' }
  const rightGroupStyle = { display: 'flex', alignItems: 'center', gap: '1rem' }

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1e293b',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  }
  const logoImageStyle = { width: '40px', height: '40px', objectFit: 'contain' }

  const navLinksStyle = { display: 'flex', gap: '0.5rem', alignItems: 'center' }
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
  const iconStyle = { fontSize: '1.5rem', marginBottom: '0.25rem', display: 'block' }
  const labelStyle = { fontSize: '0.75rem', fontWeight: '500', textAlign: 'center', lineHeight: '1' }

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
  const handleScoreHover = (e, isEntering) => {
    e.currentTarget.style.backgroundColor = isEntering ? '#f1f5f9' : '#f8fafc'
    e.currentTarget.style.transform = isEntering ? 'scale(1.02)' : 'scale(1)'
  }

  const userMenuStyle = { display: 'flex', alignItems: 'center', gap: '1rem' }
  const userLinkStyle = {
    ...linkStyle('/profile'),
    flexDirection: 'row',
    gap: '0.5rem',
    fontSize: '0.875rem',
    minWidth: 'unset',
    backgroundColor: 'transparent',
    color: '#64748b',
    padding: '0.5rem 0.75rem'
  }

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* LEFT: Logo + Nav */}
        <div style={leftGroupStyle}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIxMDAiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIi8+CiAgPHBhdGggZD0iTTgwIDgwQzgwIDgwIDgwIDIyMCAyMjAgMjIwIiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMTUiIGZpbGw9Im5vbmUiLz4KICA8cGF0aCBkPSJNMTgwIDE4MEwyMjAgMTQwTDE5MCAxMDAiIHN0cm9rZT0iI2RjMjYyNiIgc3Ryb2tlLXdpZHRoPSIxMiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgPHRleHQgeD0iMTUwIiB5PSIxODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxZTI5M2IiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4MCIgZm9udC13ZWlnaHQ9ImJvbGQiPk08L3RleHQ+Cjwvc3ZnPgo="
              alt="Metron Finance Logo"
              style={logoImageStyle}
            />
            Metron Finance
          </Link>

          {/* Desktop Navigation */}
          <div style={navLinksStyle}>
            <Link
              to="/"
              style={linkStyle('/')}
              onMouseEnter={(e) => { if (location.pathname !== '/') e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if (location.pathname !== '/') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <div style={iconStyle}>🏠</div>
              <span style={labelStyle}>Home</span>
            </Link>

            <Link
              to="/goals"
              style={linkStyle('/goals')}
              onMouseEnter={(e) => { if (location.pathname !== '/goals') e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if (location.pathname !== '/goals') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <div style={iconStyle}>🎯</div>
              <span style={labelStyle}>Goals</span>
            </Link>

            <Link
              to="/purchases"
              style={linkStyle('/purchases')}
              onMouseEnter={(e) => { if (location.pathname !== '/purchases') e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if (location.pathname !== '/purchases') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <div style={iconStyle}>🛒</div>
              <span style={labelStyle}>Transactions</span>
            </Link>

            <Link
              to="/social"
              style={linkStyle('/social')}
              onMouseEnter={(e) => { if (location.pathname !== '/social') e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if (location.pathname !== '/social') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <div style={iconStyle}>👥</div>
              <span style={labelStyle}>Social</span>
            </Link>
          </div>
        </div>

        {/* RIGHT: Score + Profile + Logout */}
        <div style={rightGroupStyle}>
          <div
            style={scoreDisplayStyle}
            onMouseEnter={(e) => handleScoreHover(e, true)}
            onMouseLeave={(e) => handleScoreHover(e, false)}
            title={`Financial Score: ${currentScore} (${getScoreStatus(currentScore)})`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: getScoreColor(currentScore),
                  boxShadow: `0 0 6px ${getScoreColor(currentScore)}40`
                }}
              />
              <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                Score:
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
              <span style={{ fontWeight: '700', color: getScoreColor(currentScore), fontSize: '1.125rem', lineHeight: '1' }}>
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

          <Link to="/profile" style={userLinkStyle}>
            <div style={iconStyle}>👤</div>
            <span style={labelStyle}>{getUserDisplayName()}</span>
          </Link>

          <Button variant="ghost" size="sm" onClick={handleLogout} icon="🚪">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

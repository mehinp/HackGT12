// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import { useLogout } from '../hooks/Authentication hooks/useLogout'
import { userScoreService } from '../services/userScoreService'
import Button from './Button'

const Navbar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const location = useLocation()

  // --- Score state pulled from API (mirrors Home.jsx pattern) ---
  const [currentScore, setCurrentScore] = useState(500)
  const [scoreLoading, setScoreLoading] = useState(true)

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          setCurrentScore(500)
          return
        }
        setScoreLoading(true)
        const score = await userScoreService.getUserScore()
        // Clamp to a sane range like Home.jsx does (0–1000)
        const clamped = Math.max(0, Math.min(1000, Number(score) || 500))
        setCurrentScore(Math.round(clamped))
      } catch (e) {
        console.log('Could not fetch user score:', e)
        setCurrentScore(500) // Fallback score
      } finally {
        setScoreLoading(false)
      }
    }
    fetchScore()
  }, [user])

const getScoreStatus = (score) => {
  const s = Math.max(0, Math.min(1000, Number(score) || 0))
  if (s >= 900) return 'Excellent'
  if (s >= 700) return 'Good'
  if (s >= 600) return 'Fair'
  if (s >= 300) return 'Poor'
  return 'Dreadful'
}

const getScoreColor = (score) => {
  const s = Math.max(0, Math.min(1000, Number(score) || 0))
  if (s >= 900) return '#16a34a'   // green (excellent)
  if (s >= 700) return '#86efac'   // light green (good)
  if (s >= 600) return '#facc15'   // yellow (fair)
  if (s >= 300) return '#f97316'   // orange (poor)
  return '#7f1d1d'                 // dark red (dreadful)
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
    alignItems: 'center',
    fontSize: '0.875rem'
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
    backgroundColor: 'transparent',
    color: '#64748b',
    padding: '0.5rem 0.75rem'
  }

  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#64748b',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  const logoutIconStyle = {
    width: '16px',
    height: '16px',
    strokeWidth: '2',
    stroke: 'currentColor',
    fill: 'none'
  }

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* LEFT: Logo + Nav */}
        <div style={leftGroupStyle}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <img
              src="/Logo_image.png"
              alt="Metron Finance Logo"
              style={logoImageStyle}
              onError={(e) => {
                const fallbacks = ['/Logo_image.jpg', '/Logo_image.jpeg', '/Logo_image.svg', '/Logo_image.gif'];
                const currentSrc = e.target.src;
                const currentIndex = fallbacks.findIndex(fallback => currentSrc.includes(fallback.split('.')[1]));
                if (currentIndex < fallbacks.length - 1) {
                  e.target.src = fallbacks[currentIndex + 1];
                } else {
                  e.target.style.display = 'none';
                  e.target.nextSibling.textContent = 'M';
                }
              }}
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
              Home
            </Link>

            <Link
              to="/goals"
              style={linkStyle('/goals')}
              onMouseEnter={(e) => { if (location.pathname !== '/goals') e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if (location.pathname !== '/goals') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Goals
            </Link>

            <Link
              to="/purchases"
              style={linkStyle('/purchases')}
              onMouseEnter={(e) => { if (location.pathname !== '/purchases') e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if (location.pathname !== '/purchases') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Transactions
            </Link>

            <Link
              to="/social"
              style={linkStyle('/social')}
              onMouseEnter={(e) => { if (location.pathname !== '/social') e.currentTarget.style.backgroundColor = '#f8fafc' }}
              onMouseLeave={(e) => { if (location.pathname !== '/social') e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              Social
            </Link>
          </div>
        </div>

        {/* RIGHT: Score + Profile + Logout */}
        <div style={rightGroupStyle}>
          <div
            style={scoreDisplayStyle}
            onMouseEnter={(e) => handleScoreHover(e, true)}
            onMouseLeave={(e) => handleScoreHover(e, false)}
            title={`Financial Score: ${scoreLoading ? '...' : currentScore.toLocaleString()} (${scoreLoading ? 'Loading...' : getScoreStatus(currentScore)})`}
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
                {scoreLoading ? '...' : currentScore.toLocaleString()}
              </span>
              <span style={{
                fontSize: '0.6rem',
                color: getScoreColor(currentScore),
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: '1'
              }}>
                {scoreLoading ? 'Loading...' : getScoreStatus(currentScore)}
              </span>
            </div>
          </div>

          <Link to="/profile" style={userLinkStyle}>
            <div style={{ fontSize: '1rem' }}>👤</div>
            <span>{getUserDisplayName()}</span>
          </Link>

          <button
            style={logoutButtonStyle}
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc'
              e.currentTarget.style.color = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#64748b'
            }}
          >
            <svg style={logoutIconStyle} viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

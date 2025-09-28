// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useLogin } from '../hooks/Authentication hooks/useLogin'
import Button from '../components/Button'
import Input from '../components/Input'

const Login = () => {
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [debug, setDebug] = useState(null)

  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const { login, error, isLoading } = useLogin()

  // Success message from signup
  const successMessage = location.state?.message

  const handleSubmit = async (e) => {
    e.preventDefault()
    setDebug(null)
    const ok = await login(email, password, rememberMe)
    if (ok) {
      // go to dashboard/home; change this to your desired route
      navigate('/')
    } else {
      // If the hook surfaced structured info on error, show it
      // (the improved useAPI attaches status/payload on Error)
      setDebug((prev) => prev ?? 'Login failed. Check Network tab for details.')
    }
  }

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }

  const containerStyle = {
    width: '100%',
    maxWidth: '448px' // max-w-md equivalent
  }

  const logoContainerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  }

  const logoImageStyle = {
    width: '64px',
    height: '64px',
    objectFit: 'contain',
    margin: '0 auto 1rem auto',
    display: 'block'
  }

  const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a', // slate-900
    marginBottom: '8px'
  }

  const subtitleStyle = {
    color: '#64748b', // slate-600
    fontSize: '16px'
  }

  const cardStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0', // slate-200
    borderRadius: '6px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px'
  }

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#64748b' // slate-600
  }

  const checkboxStyle = {
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    accentColor: '#dc2626'
  }

  const forgotPasswordStyle = {
    color: '#dc2626',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.14s'
  }

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.14s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  }

  const buttonHoverStyle = {
    backgroundColor: '#b91c1c' // red-700
  }

  const buttonDisabledStyle = {
    backgroundColor: '#cbd5e1',
    color: '#64748b',
    cursor: 'not-allowed'
  }

  const footerStyle = {
    textAlign: 'center',
    marginTop: '24px'
  }

  const footerTextStyle = {
    color: '#64748b',
    fontSize: '14px'
  }

  const linkStyle = {
    color: '#dc2626',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.14s'
  }

  const demoCredentialsStyle = {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#dbeafe', // blue-50
    border: '1px solid #bfdbfe', // blue-200
    borderRadius: '6px'
  }

  const demoTitleStyle = {
    color: '#1e3a8a', // blue-900
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px'
  }

  const demoTextStyle = {
    color: '#1e40af', // blue-800
    fontSize: '12px',
    margin: '0'
  }

  const themeToggleStyle = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s ease'
  }

  const errorStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    fontSize: '14px',
    marginBottom: '4px'
  }

  const successStyle = {
    backgroundColor: darkMode ? '#064e3b' : '#f0fdf4',
    color: darkMode ? '#34d399' : '#166534',
    padding: '12px',
    borderRadius: '6px',
    border: darkMode ? '1px solid #065f46' : '1px solid #bbf7d0',
    fontSize: '14px',
    marginBottom: '16px'
  }

  const debugStyle = {
    backgroundColor: darkMode ? '#0b1020' : '#f1f5f9',
    color: darkMode ? '#cbd5e1' : '#334155',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '12px'
  }

  const spinnerStyle = {
    width: '16px',
    height: '16px',
    border: '2px solid white',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }

  return (
    <div style={pageStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* Header */}
        <div style={logoContainerStyle}>
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iMTQwIiBzdHJva2U9IiNkYzI2MjYiIHN0cm9rZS13aWR0aD0iMTAiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIxMDAiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik04MCA4MEM4MCA4MCA4MCAyMjAgMjIwIDIyMCIgc3Ryb2tlPSIjZGMyNjI2IiBzdHJva2Utd2lkdGg9IjE1IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0xODAgMTgwTDIyMCAxNDBMMTkwIDEwMCIgc3Ryb2tlPSIjZGMyNjI2IiBzdHJva2Utd2lkdGg9IjEyIiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHR4dCB4PSIxNTAiIHk9IjE4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzFlMjkzYiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgwIiBmb250LXdlaWdodD0iYm9sZCI+TTwvdGV4dD4KPC9zdmc+Cg==" 
            alt="Metron Finance Logo" 
            style={logoImageStyle}
          />
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Sign in to your financial dashboard</p>
        </div>

        {/* Login Form */}
        <div style={cardStyle}>
          <form onSubmit={handleSubmit} style={formStyle} noValidate>
            {/* Show success message if coming from signup */}
            {successMessage && (
              <div style={successStyle}>
                ✅ {successMessage}
              </div>
            )}
            
            {error && <div style={errorStyle}>{error}</div>}
            {debug && <div style={debugStyle}>{debug}</div>}

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="📧"
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon="🔒"
              required
              autoComplete="current-password"
            />

            <div style={checkboxContainerStyle}>
              <label style={checkboxLabelStyle}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={checkboxStyle}
                />
                Remember me
              </label>
              <a href="#" style={forgotPasswordStyle}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...buttonStyle,
                ...(isLoading ? buttonDisabledStyle : {}),
                ':hover': !isLoading ? buttonHoverStyle : {}
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#b91c1c'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = '#dc2626'
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={spinnerStyle}></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div style={footerStyle}>
            <p style={footerTextStyle}>
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                style={linkStyle}
                onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.color = '#dc2626'}
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
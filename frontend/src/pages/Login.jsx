// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useLogin } from '../hooks/Authentication hooks/useLogin'
import Button from '../components/Button'
import Input from '../components/Input'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [debug, setDebug] = useState(null) // shows extra error info if available

  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const { login, error, isLoading } = useLogin()

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
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative'
  }

  const containerStyle = {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: darkMode
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0'
  }

  const headerStyle = { textAlign: 'center', marginBottom: '2rem' }
  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: darkMode ? '#f8fafc' : '#1e293b',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  }
  const subtitleStyle = { color: darkMode ? '#94a3b8' : '#64748b', fontSize: '1rem' }
  const formStyle = { display: 'flex', flexDirection: 'column', gap: '1rem' }
  const linkStyle = { color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }
  const footerStyle = { textAlign: 'center', marginTop: '1.5rem', color: darkMode ? '#94a3b8' : '#64748b' }
  const themeToggleStyle = {
    position: 'absolute', top: '1rem', right: '1rem', background: 'none',
    border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem',
    borderRadius: '0.5rem', transition: 'all 0.2s ease'
  }
  const errorStyle = {
    backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem',
    borderRadius: '0.5rem', border: '1px solid #fecaca',
    fontSize: '0.875rem', marginBottom: '0.25rem'
  }
  const debugStyle = {
    backgroundColor: darkMode ? '#0b1020' : '#f1f5f9',
    color: darkMode ? '#cbd5e1' : '#334155',
    padding: '0.5rem', borderRadius: '0.5rem', fontSize: '0.75rem'
  }

  return (
    <div style={pageStyle}>
      <button
        onClick={toggleDarkMode}
        style={themeToggleStyle}
        onMouseEnter={(e) => { e.target.style.backgroundColor = darkMode ? '#374151' : '#f8fafc' }}
        onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent' }}
        aria-label="Toggle theme"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>💰 Welcome Back</h1>
          <p style={subtitleStyle}>Sign in to track your financial journey</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle} noValidate>
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

          {/* Remember me */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: darkMode ? '#cbd5e1' : '#334155' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            style={{ marginTop: '0.25rem' }}
          >
            {isLoading ? '🔄 Signing In...' : '🚀 Sign In'}
          </Button>
        </form>

        <div style={footerStyle}>
          <p>
            Don't have an account?{' '}
            <Link to="/signup" style={linkStyle}>Sign up here</Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: darkMode ? '#374151' : '#f8fafc',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: darkMode ? '#cbd5e1' : '#64748b'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Demo Credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  )
}

export default Login

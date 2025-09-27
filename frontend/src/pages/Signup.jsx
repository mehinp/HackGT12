import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useSignup } from '../hooks/useSignup'
import Button from '../components/Button'
import Input from '../components/Input'

const Signup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { darkMode, toggleDarkMode } = useTheme()
  const { signup, error, isLoading } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      // Handle password mismatch error
      return
    }
    
    await signup(firstName, lastName, email, password)
  }

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  }

  const containerStyle = {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: darkMode 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' 
      : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0'
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  }

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

  const subtitleStyle = {
    color: darkMode ? '#94a3b8' : '#64748b',
    fontSize: '1rem'
  }

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }

  const nameRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  }

  const linkStyle = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '500'
  }

  const footerStyle = {
    textAlign: 'center',
    marginTop: '1.5rem',
    color: darkMode ? '#94a3b8' : '#64748b'
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
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #fecaca',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  }

  const passwordMismatchError = password !== confirmPassword && confirmPassword !== ''

  return (
    <div style={pageStyle}>
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

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            🚀 Join FinanceTracker
          </h1>
          <p style={subtitleStyle}>
            Start your journey to financial freedom
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          {passwordMismatchError && (
            <div style={errorStyle}>
              Passwords do not match
            </div>
          )}

          {/* Name Fields */}
          <div style={nameRowStyle}>
            <Input
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              icon="👤"
              required
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              icon="👤"
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="📧"
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="🔒"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon="🔒"
            error={passwordMismatchError ? "Passwords don't match" : ''}
            required
          />

          <Button
            type="submit"
            size="lg"
            disabled={isLoading || passwordMismatchError || !firstName || !lastName || !email || !password || !confirmPassword}
            style={{ marginTop: '0.5rem' }}
          >
            {isLoading ? '⏳ Creating Account...' : '🎉 Create Account'}
          </Button>
        </form>

        <div style={footerStyle}>
          <p>
            Already have an account?{' '}
            <Link to="/login" style={linkStyle}>
              Sign in here
            </Link>
          </p>
        </div>

        {/* Password Requirements */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: darkMode ? '#374151' : '#f8fafc',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: darkMode ? '#cbd5e1' : '#64748b'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Password Requirements:</p>
          <ul style={{ paddingLeft: '1rem', margin: 0 }}>
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
          </ul>
        </div>

        {/* Terms and Privacy */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          fontSize: '0.75rem',
          color: darkMode ? '#9ca3af' : '#6b7280',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          By creating an account, you agree to our{' '}
          <a href="#" style={linkStyle}>Terms of Service</a> and{' '}
          <a href="#" style={linkStyle}>Privacy Policy</a>
        </div>
      </div>
    </div>
  )
}

export default Signup
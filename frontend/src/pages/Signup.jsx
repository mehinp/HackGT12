import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useSignup } from '../hooks/Authentication hooks/useSignup'
import Button from '../components/Button'
import Input from '../components/Input'

const Signup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [income, setIncome] = useState('')
  const [expenditures, setExpenditures] = useState('')

  const { signup, error, isLoading } = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const success = await signup(firstName, lastName, email, password, confirmPassword, income, expenditures)
    
    // Clear form fields after successful signup
    if (success) {
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setIncome('')
      setExpenditures('')
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
    gap: '8px',
    marginTop: '8px'
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

  const errorStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #fecaca',
    fontSize: '14px',
    marginBottom: '16px'
  }

  const termsStyle = {
    display: 'flex',
    alignItems: 'start',
    gap: '12px',
    fontSize: '14px'
  }

  const checkboxStyle = {
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    accentColor: '#dc2626',
    marginTop: '1px'
  }

  const termsTextStyle = {
    color: '#64748b'
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
            src="/Logo_image.png" 
            alt="Metron Finance Logo" 
            style={logoImageStyle}
          />
          <h1 style={titleStyle}>Create Account</h1>
          <p style={subtitleStyle}>Join thousands improving their financial health</p>
        </div>

        {/* Signup Form */}
        <div style={cardStyle}>
          <form onSubmit={handleSubmit} style={formStyle}>
            {error && (
              <div style={errorStyle}>
                {error}
              </div>
            )}

            <Input
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <Input
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Create Password"
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Input
              label="Monthly Income"
              type="number"
              placeholder="5000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              required
            />

            <Input
              label="Monthly Expenditure"
              type="number"
              placeholder="3500"
              value={expenditures}
              onChange={(e) => setExpenditures(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={isLoading || !firstName || !lastName || !email || !password || !confirmPassword || !income || !expenditures}
              style={{
                ...buttonStyle,
                ...(isLoading || !firstName || !lastName || !email || !password || !confirmPassword || !income || !expenditures ? buttonDisabledStyle : {})
              }}
              onMouseEnter={(e) => {
                if (!isLoading && firstName && lastName && email && password && confirmPassword && income && expenditures) {
                  e.target.style.backgroundColor = '#b91c1c'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && firstName && lastName && email && password && confirmPassword && income && expenditures) {
                  e.target.style.backgroundColor = '#dc2626'
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={spinnerStyle}></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div style={footerStyle}>
            <p style={footerTextStyle}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={linkStyle}
                onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                onMouseLeave={(e) => e.target.style.color = '#dc2626'}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props 
}) => {
  const { darkMode } = useTheme()
  const [isFocused, setIsFocused] = useState(false)

  const inputStyle = {
    width: '100%',
    padding: icon ? '0.75rem 0.75rem 0.75rem 2.5rem' : '0.75rem',
    border: `1px solid ${error ? '#ef4444' : isFocused ? '#3b82f6' : darkMode ? '#374151' : '#e2e8f0'}`,
    borderRadius: '0.5rem',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: darkMode ? '#f8fafc' : '#374151',
    fontSize: '0.875rem'
  }

  const containerStyle = {
    position: 'relative',
    width: '100%'
  }

  const iconStyle = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: darkMode ? '#9ca3af' : '#6b7280',
    fontSize: '1.25rem',
    pointerEvents: 'none'
  }

  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  }

  const focusStyle = isFocused ? {
    boxShadow: `0 0 0 3px ${error ? '#fecaca' : '#dbeafe'}`,
    borderColor: error ? '#ef4444' : '#3b82f6'
  } : {}

  return (
    <div className={className} style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </label>
      )}
      
      <div style={containerStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...inputStyle,
            ...focusStyle
          }}
          {...props}
        />
      </div>
      
      {error && <div style={errorStyle}>{error}</div>}
    </div>
  )
}

export default Input
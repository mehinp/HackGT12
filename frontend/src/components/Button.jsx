import { useTheme } from '../context/ThemeContext'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  type = 'button',
  className = '',
  icon = null,
  ...props 
}) => {
  const { darkMode } = useTheme()

  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        border: '1px solid #3b82f6',
        hover: '#2563eb'
      },
      secondary: {
        backgroundColor: darkMode ? '#374151' : '#f8fafc',
        color: darkMode ? '#f8fafc' : '#374151',
        border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
        hover: darkMode ? '#4b5563' : '#f1f5f9'
      },
      success: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        border: '1px solid #10b981',
        hover: '#059669'
      },
      danger: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: '1px solid #ef4444',
        hover: '#dc2626'
      },
      warning: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
        border: '1px solid #f59e0b',
        hover: '#d97706'
      },
      outline: {
        backgroundColor: 'transparent',
        color: '#3b82f6',
        border: '1px solid #3b82f6',
        hover: '#3b82f6',
        hoverColor: '#ffffff'
      },
      ghost: {
        backgroundColor: 'transparent',
        color: darkMode ? '#f8fafc' : '#374151',
        border: '1px solid transparent',
        hover: darkMode ? '#374151' : '#f8fafc'
      }
    }
    return variants[variant] || variants.primary
  }

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        height: '2rem'
      },
      md: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        height: '2.5rem'
      },
      lg: {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
        height: '3rem'
      },
      xl: {
        padding: '1.25rem 2.5rem',
        fontSize: '1.25rem',
        height: '3.5rem'
      }
    }
    return sizes[size] || sizes.md
  }

  const variantStyles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: icon ? '0.5rem' : '0',
    backgroundColor: variantStyles.backgroundColor,
    color: variantStyles.color,
    border: variantStyles.border,
    borderRadius: '0.5rem',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    ...sizeStyles,
    ...props.style
  }

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.target.style.backgroundColor = variantStyles.hover
      if (variantStyles.hoverColor) {
        e.target.style.color = variantStyles.hoverColor
      }
    }
  }

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.target.style.backgroundColor = variantStyles.backgroundColor
      e.target.style.color = variantStyles.color
    }
  }

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      className={className}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}

export default Button
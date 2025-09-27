import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (firstName, lastName, email, password) => {
    setIsLoading(true)
    setError(null)

    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return false
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return false
    }

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          password,
          name: `${firstName} ${lastName}` // Combine for full name
        })
      })
      
      const json = await response.json()

      if (!response.ok) {
        setIsLoading(false)
        setError(json.error || 'Failed to create account')
        return false
      }

      // Save user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // Update auth context
      dispatch({ type: 'LOGIN', payload: json })

      setIsLoading(false)
      return true

    } catch (err) {
      setIsLoading(false)
      setError('Network error. Please try again.')
      return false
    }
  }

  return { signup, isLoading, error }
}
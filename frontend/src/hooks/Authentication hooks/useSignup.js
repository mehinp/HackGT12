// hooks/useSignup.js
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
      // Mock signup - replace with actual API call
      const mockUser = {
        id: Date.now(),
        name: `${firstName} ${lastName}`,
        email,
        token: 'mock-jwt-token'
      }

      localStorage.setItem('user', JSON.stringify(mockUser))
      dispatch({ type: 'LOGIN', payload: mockUser })
      setIsLoading(false)
      return true
    } catch (err) {
      setIsLoading(false)
      setError('Failed to create account')
      return false
    }
  }

  return { signup, isLoading, error }
}
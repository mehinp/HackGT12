// hooks/useLogin.js
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true)
    setError(null)

    try {
      // Mock login - replace with actual API call
      if (email === 'demo@example.com' && password === 'demo123') {
        const mockUser = {
          id: 1,
          name: 'Demo User',
          email: 'demo@example.com',
          token: 'mock-jwt-token'
        }

        localStorage.setItem('user', JSON.stringify(mockUser))
        dispatch({ type: 'LOGIN', payload: mockUser })
        setIsLoading(false)
        return true
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err) {
      setIsLoading(false)
      setError(err.message)
      return false
    }
  }

  return { login, isLoading, error }
}
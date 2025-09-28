// src/hooks/Authentication hooks/useLogin.js
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { authService } from '../../services/authService'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const userData = await authService.login(email.trim().toLowerCase(), password)
      
      // Store user data in localStorage and context
      localStorage.setItem('user', JSON.stringify(userData))
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: userData 
      })
      
      setIsLoading(false)
      return true

    } catch (err) {
      setError(err.message || 'Login failed')
      setIsLoading(false)
      return false
    }
  }

  return { login, isLoading, error }
}
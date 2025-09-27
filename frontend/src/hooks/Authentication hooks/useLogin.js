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
      const response = await fetch('http://143.215.104.239:8080/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password,
          rememberMe 
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const userData = await response.json()
      
      // Store user data
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
// src/hooks/Authentication hooks/useLogin.js
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import useAPI from '../Data Management Hooks/useAPI'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()
  const api = useAPI()

  const login = async (rawEmail, password, rememberMe = false) => {
    setIsLoading(true)
    setError(null)
    const email = (rawEmail || '').trim().toLowerCase()

    try {
      const data = await api.post('/user/login', { email, password, rememberMe })
      let user = data?.user || data // handle either {user:...} or plain user

      if (!user) throw new Error('No user returned from API')

      dispatch({ type: 'LOGIN', payload: user })
      setIsLoading(false)
      return true
    } catch (e) {
      setError(e.message || 'Login failed')
      setIsLoading(false)
      return false
    }
  }

  return { login, isLoading, error }
}

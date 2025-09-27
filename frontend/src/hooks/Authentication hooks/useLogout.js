// src/hooks/Authentication hooks/useLogout.js
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await fetch('http://143.215.104.239:8080/user/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with local logout even if backend call fails
    }

    // Remove user from storage
    localStorage.removeItem('user')

    // Clear auth context
    dispatch({ type: 'LOGOUT' })
  }

  return { logout }
}
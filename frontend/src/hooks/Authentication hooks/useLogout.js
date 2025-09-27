// hooks/useLogout.js
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = () => {
    // Remove user from storage
    localStorage.removeItem('user')

    // Clear auth context
    dispatch({ type: 'LOGOUT' })
  }

  return { logout }
}
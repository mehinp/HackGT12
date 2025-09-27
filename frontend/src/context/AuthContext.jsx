import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Create the context
const AuthContext = createContext()

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false
}

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

// Context Provider Component
export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Helper functions
  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const userData = await response.json()
      
      // Store token in localStorage
      localStorage.setItem('authToken', userData.token)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          createdAt: userData.createdAt
        }
      })

      return { success: true }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Signup failed')
      }

      const newUser = await response.json()
      
      // Store token in localStorage
      localStorage.setItem('authToken', newUser.token)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
          createdAt: newUser.createdAt
        }
      })

      return { success: true }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates })
    
    // TODO: Also update on server
    // updateUserProfile(updates)
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      try {
        // TODO: Replace with actual API call to validate token
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: userData
          })
        } else {
          // Token is invalid
          localStorage.removeItem('authToken')
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        // For development, simulate a logged-in user
        // Remove this in production!
        setTimeout(() => {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              id: 'dev_user_1',
              email: 'user@example.com',
              name: 'Demo User',
              avatar: null,
              createdAt: new Date().toISOString()
            }
          })
        }, 1000)
      }
    }

    checkAuth()
  }, [])

  const value = {
    ...state,
    login,
    signup,
    logout,
    updateUser,
    clearError,
    dispatch
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Export the context
export { AuthContext }
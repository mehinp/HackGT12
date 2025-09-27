// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AuthContext = createContext()

const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false
}

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

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const logout = async () => {
    try {
      await fetch('http://143.215.104.239:8080/user/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user')
        
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: userData
          })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Auth check error:', error)
        localStorage.removeItem('user')
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const value = {
    ...state,
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

export { AuthContext }
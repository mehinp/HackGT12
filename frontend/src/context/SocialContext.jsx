import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { socialService } from '../services/socialService'

export const SocialContext = createContext(null) // <-- NAMED export

const initialState = {
  rankings: [],      // [{ id, firstName, lastName, email, score, ... }] - from API
  loading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_RANKINGS':
      return { ...state, rankings: action.payload, error: null }
    default:
      return state
  }
}

export function SocialContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(() => ({
    ...state,
    setLoading: (b) => dispatch({ type: 'SET_LOADING', payload: b }),
    setError: (e) => dispatch({ type: 'SET_ERROR', payload: e }),
    setRankings: (rows) => dispatch({ type: 'SET_RANKINGS', payload: rows }),
    
    // API functions
    async fetchRankings() {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })
      try {
        const rankings = await socialService.getLeaderboardRankings()
        dispatch({ type: 'SET_RANKINGS', payload: rankings })
        return rankings
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
        throw error
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },

    dispatch,
  }), [state])

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>
}

// Optional convenience hook (you can use this instead of a separate useSocialContext.js)
export const useSocial = () => {
  const ctx = useContext(SocialContext)
  if (!ctx) console.error('useSocial must be used within SocialContextProvider')
  return ctx
}
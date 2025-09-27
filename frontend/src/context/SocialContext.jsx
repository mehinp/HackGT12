import React, { createContext, useContext, useMemo, useReducer } from 'react'

export const SocialContext = createContext(null) // <-- NAMED export

const initialState = {
  friends: [],       // [{ id, name, handle, avatarUrl, score, level }]
  reactions: [],     // [{ id, subjectId, fromUserId, emoji, createdAt }]
  leaderboard: [],   // [{ handle, score, rank }]
  loading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_FRIENDS':
      return { ...state, friends: action.payload, error: null }
    case 'ADD_FRIEND':
      return { ...state, friends: [...state.friends, action.payload] }
    case 'REMOVE_FRIEND':
      return { ...state, friends: state.friends.filter(f => f.id !== action.payload) }
    case 'ADD_REACTION':
      return { ...state, reactions: [action.payload, ...state.reactions] }
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload }
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
    setFriends: (rows) => dispatch({ type: 'SET_FRIENDS', payload: rows }),
    addFriend: (row) => dispatch({ type: 'ADD_FRIEND', payload: row }),
    removeFriend: (id) => dispatch({ type: 'REMOVE_FRIEND', payload: id }),
    addReaction: (row) => dispatch({ type: 'ADD_REACTION', payload: row }),
    setLeaderboard: (rows) => dispatch({ type: 'SET_LEADERBOARD', payload: rows }),
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

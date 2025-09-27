import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const ThemeContext = createContext(null)

const initialState = {
  darkMode: false,   // default; will hydrate from localStorage
  theme: 'light',    // 'light' | 'dark' (kept in sync with darkMode)
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_THEME': {
      const theme = action.payload === 'dark' ? 'dark' : 'light'
      return { darkMode: theme === 'dark', theme }
    }
    case 'TOGGLE': {
      const theme = state.theme === 'dark' ? 'light' : 'dark'
      return { darkMode: theme === 'dark', theme }
    }
    default:
      return state
  }
}

export function ThemeContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // hydrate from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') {
      dispatch({ type: 'SET_THEME', payload: stored })
    }
  }, [])

  // keep <html class="dark"> and localStorage in sync
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark')
    localStorage.setItem('theme', state.theme)
  }, [state.theme])

  const value = useMemo(() => ({
    ...state,
    setTheme: (t) => dispatch({ type: 'SET_THEME', payload: t }),
    toggleTheme: () => dispatch({ type: 'TOGGLE' }),
  }), [state])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) console.error('useTheme must be used within ThemeContextProvider')
  return ctx
}

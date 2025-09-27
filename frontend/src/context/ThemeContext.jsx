// src/context/ThemeContext.jsx - Simplified for light mode only
import React, { createContext, useContext } from 'react'

const ThemeContext = createContext(null)

export function ThemeContextProvider({ children }) {
  // Always return light mode - no state needed
  const value = {
    darkMode: false,
    theme: 'light'
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    console.error('useTheme must be used within ThemeContextProvider')
    // Return default light mode if context is missing
    return { darkMode: false, theme: 'light' }
  }
  return ctx
}
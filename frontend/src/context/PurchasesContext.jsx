// src/context/PurchasesContext.jsx
import React, { createContext, useContext, useMemo, useReducer } from 'react'

export const PurchasesContext = createContext(null) // <— was missing "export"

const initialState = { purchases: [], loading: false, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload }
    case 'SET_ERROR': return { ...state, error: action.payload }
    case 'SET_PURCHASES': return { ...state, purchases: action.payload, error: null }
    case 'ADD_PURCHASE': return { ...state, purchases: [action.payload, ...state.purchases] }
    case 'REMOVE_PURCHASE': return { ...state, purchases: state.purchases.filter(p => p.id !== action.payload) }
    case 'UPDATE_PURCHASE':
      return { ...state, purchases: state.purchases.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p) }
    default: return state
  }
}

export function PurchasesContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({
    ...state,
    setLoading: (b) => dispatch({ type: 'SET_LOADING', payload: b }),
    setError: (e) => dispatch({ type: 'SET_ERROR', payload: e }),
    setPurchases: (rows) => dispatch({ type: 'SET_PURCHASES', payload: rows }),
    addPurchase: (row) => dispatch({ type: 'ADD_PURCHASE', payload: row }),
    removePurchase: (id) => dispatch({ type: 'REMOVE_PURCHASE', payload: id }),
    updatePurchase: (row) => dispatch({ type: 'UPDATE_PURCHASE', payload: row }),
    dispatch,
  }), [state])

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>
}

// optional convenience hook (use this instead of a separate usePurchasesContext.js)
export const usePurchases = () => {
  const ctx = useContext(PurchasesContext)
  if (!ctx) console.error('usePurchases must be used within PurchasesContextProvider')
  return ctx
}

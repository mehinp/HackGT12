// src/context/PurchasesContext.jsx - Updated to use purchaseService
import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { purchaseService } from '../services/purchaseService'

export const PurchasesContext = createContext(null)

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
    
    // API methods now use purchaseService
    async fetchPurchases() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const data = await purchaseService.getUserPurchases()
        dispatch({ type: 'SET_PURCHASES', payload: data.purchases || [] })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },

    async createPurchase(purchaseData) {
      try {
        const newPurchase = await purchaseService.createPurchase(purchaseData)
        dispatch({ type: 'ADD_PURCHASE', payload: newPurchase })
        return newPurchase
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
        throw error
      }
    },

    async updatePurchaseById(id, purchaseData) {
      try {
        const updated = await purchaseService.updatePurchase(id, purchaseData)
        dispatch({ type: 'UPDATE_PURCHASE', payload: updated })
        return updated
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
        throw error
      }
    },

    async deletePurchaseById(id) {
      try {
        await purchaseService.deletePurchase(id)
        dispatch({ type: 'REMOVE_PURCHASE', payload: id })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
        throw error
      }
    },

    dispatch,
  }), [state])

  return <PurchasesContext.Provider value={value}>{children}</PurchasesContext.Provider>
}

export const usePurchases = () => {
  const ctx = useContext(PurchasesContext)
  if (!ctx) {
    throw new Error('usePurchases must be used within PurchasesContextProvider')
  }
  return ctx
}
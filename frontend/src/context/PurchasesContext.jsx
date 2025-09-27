// src/context/PurchasesContext.jsx - Updated with authentication
import React, { createContext, useContext, useMemo, useReducer } from 'react'

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

// Helper function to get authenticated headers
const getAuthHeaders = () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    throw new Error('User not authenticated')
  }
  return {
    'Content-Type': 'application/json',
    'X-User-Id': userId
  }
}

// API functions with authentication
const purchasesAPI = {
  async fetchPurchases() {
    const response = await fetch('http://143.215.104.239:8080/purchase/my-purchases', {
      credentials: 'include',
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to fetch purchases')
    return response.json()
  },

  async createPurchase(purchaseData) {
    const response = await fetch('http://143.215.104.239:8080/purchase/record', {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(purchaseData)
    })
    if (!response.ok) throw new Error('Failed to create purchase')
    return response.json()
  },

  async updatePurchase(id, purchaseData) {
    const response = await fetch(`http://143.215.104.239:8080/purchase/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify(purchaseData)
    })
    if (!response.ok) throw new Error('Failed to update purchase')
    return response.json()
  },

  async deletePurchase(id) {
    const response = await fetch(`http://143.215.104.239:8080/purchase/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error('Failed to delete purchase')
    return response.json()
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
    
    // API methods with authentication
    async fetchPurchases() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        const data = await purchasesAPI.fetchPurchases()
        dispatch({ type: 'SET_PURCHASES', payload: data.purchases || [] })
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },

    async createPurchase(purchaseData) {
      try {
        const newPurchase = await purchasesAPI.createPurchase(purchaseData)
        dispatch({ type: 'ADD_PURCHASE', payload: newPurchase })
        return newPurchase
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
        throw error
      }
    },

    async updatePurchaseById(id, purchaseData) {
      try {
        const updated = await purchasesAPI.updatePurchase(id, purchaseData)
        dispatch({ type: 'UPDATE_PURCHASE', payload: updated })
        return updated
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
        throw error
      }
    },

    async deletePurchaseById(id) {
      try {
        await purchasesAPI.deletePurchase(id)
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
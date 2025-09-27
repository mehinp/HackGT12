// src/context/GoalsContext.jsx - Updated with SET_GOALS action
import { createContext, useReducer } from 'react'

export const GoalsContext = createContext()

export const goalsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GOALS':
      return {
        ...state,
        goals: action.payload,
        loading: false,
        error: null
      }
    case 'CREATE_GOAL':
      return {
        ...state,
        goals: [action.payload, ...(state.goals || [])],
        loading: false,
        error: null
      }
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((goal) => 
          goal._id === action.payload._id ? action.payload : goal
        ),
        loading: false,
        error: null
      }
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((goal) => goal._id !== action.payload._id),
        loading: false,
        error: null
      }
    case 'UPDATE_GOAL_PROGRESS':
      return {
        ...state,
        goals: state.goals.map((goal) => 
          goal._id === action.payload.goalId 
            ? { ...goal, currentAmount: action.payload.newAmount }
            : goal
        ),
        loading: false,
        error: null
      }
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
    default:
      return state
  }
}

export const GoalsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goalsReducer, {
    goals: null,
    loading: false,
    error: null
  })

  return (
    <GoalsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GoalsContext.Provider>
  )
}
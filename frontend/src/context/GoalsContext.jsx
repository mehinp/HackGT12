import { createContext, useReducer } from 'react'

export const GoalsContext = createContext()

export const goalsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GOALS':
      return {
        goals: action.payload
      }
    case 'CREATE_GOAL':
      return {
        goals: [action.payload, ...(state.goals || [])]
      }
    case 'UPDATE_GOAL':
      return {
        goals: state.goals.map((goal) => 
          goal._id === action.payload._id ? action.payload : goal
        )
      }
    case 'DELETE_GOAL':
      return {
        goals: state.goals.filter((goal) => goal._id !== action.payload._id)
      }
    case 'UPDATE_GOAL_PROGRESS':
      return {
        goals: state.goals.map((goal) => 
          goal._id === action.payload.goalId 
            ? { ...goal, currentAmount: action.payload.newAmount }
            : goal
        )
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
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
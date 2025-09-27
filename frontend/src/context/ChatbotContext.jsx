import React, { createContext, useContext, useReducer } from 'react'

// Create the context
const ChatbotContext = createContext()

// Initial state
const initialState = {
  messages: [],
  isLoading: false,
  isTyping: false,
  currentConversation: null,
  chatHistory: [],
  suggestions: [],
  context: {
    recentPurchases: [],
    currentGoals: [],
    financialSituation: null
  }
}

// Reducer function
function chatbotReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        suggestions: action.payload.sender === 'bot' ? action.payload.suggestions || [] : state.suggestions
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      }
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: []
      }
    case 'UPDATE_CONTEXT':
      return {
        ...state,
        context: {
          ...state.context,
          ...action.payload
        }
      }
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      }
    case 'SET_SUGGESTIONS':
      return {
        ...state,
        suggestions: action.payload
      }
    default:
      return state
  }
}

// Context Provider Component
export function ChatbotContextProvider({ children }) {
  const [state, dispatch] = useReducer(chatbotReducer, initialState)

  // Helper functions
  const sendMessage = async (message) => {
    // Add user message
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      }
    })

    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_TYPING', payload: true })

    try {
      // TODO: Replace with actual API call to your RAG chatbot
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: state.context
        })
      })

      const data = await response.json()

      // Add bot response
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now() + 1,
          text: data.response,
          sender: 'bot',
          timestamp: new Date(),
          suggestions: data.suggestions || [],
          recommendations: data.recommendations || []
        }
      })
    } catch (error) {
      // Fallback response for development
      setTimeout(() => {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: Date.now() + 1,
            text: generateMockResponse(message),
            sender: 'bot',
            timestamp: new Date(),
            suggestions: ['Tell me about my spending', 'Show my progress', 'Budget advice']
          }
        })
      }, 1000)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
      dispatch({ type: 'SET_TYPING', payload: false })
    }
  }

  const clearChat = () => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }

  const updateContext = (newContext) => {
    dispatch({ type: 'UPDATE_CONTEXT', payload: newContext })
  }

  const value = {
    ...state,
    sendMessage,
    clearChat,
    updateContext,
    dispatch
  }

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  )
}

// Mock response generator for development
function generateMockResponse(message) {
  const responses = {
    spending: "Based on your recent purchases, you've spent $234 this week. That's 15% over your weekly budget. Consider reducing dining out expenses.",
    budget: "Your current budget utilization is at 78%. You're doing well! Try to keep discretionary spending under $150 for the rest of the month.",
    goals: "You're 67% towards your emergency fund goal! At your current savings rate, you'll reach it in 3.2 months.",
    investment: "Based on your spending pattern, you could potentially invest an additional $200/month. Consider index funds for long-term growth."
  }

  const lowerMessage = message.toLowerCase()
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }

  return "I'm here to help you with your financial decisions! Ask me about your spending, savings goals, or investment opportunities."
}

// Export the context
export { ChatbotContext }
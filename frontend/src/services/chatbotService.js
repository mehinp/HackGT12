// src/services/chatbotService.js
const BASE = 'http://143.215.104.239:8080'

export const chatbotService = {
  // Send message to chatbot API
  async sendMessage(message, context = {}) {
    try {
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(`${BASE}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        credentials: 'include',
        body: JSON.stringify({
          message: message,
          context: {
            page: context.page || 'general',
            userGoals: context.goals || [],
            userPurchases: context.purchases || [],
            userProfile: context.user || {}
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get chatbot response')
      }

      const data = await response.json()
      return {
        response: data.response || data.message,
        suggestions: data.suggestions || [],
        context: data.context || {}
      }
    } catch (error) {
      console.error('Chatbot service error:', error)
      // Return fallback response for now
      return {
        response: "I'm having trouble connecting right now. Please try again in a moment!",
        suggestions: [],
        context: {}
      }
    }
  },

  // Get conversation history (if implemented)
  async getConversationHistory() {
    try {
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(`${BASE}/chatbot/history`, {
        headers: {
          'X-User-Id': userId
        },
        credentials: 'include'
      })

      if (!response.ok) {
        return [] // Return empty history if not available
      }

      const data = await response.json()
      return data.messages || []
    } catch (error) {
      console.error('Failed to load conversation history:', error)
      return []
    }
  },

  // Save conversation (if implemented)
  async saveConversation(messages) {
    try {
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        return false
      }

      const response = await fetch(`${BASE}/chatbot/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        credentials: 'include',
        body: JSON.stringify({
          messages: messages,
          timestamp: new Date().toISOString()
        })
      })

      return response.ok
    } catch (error) {
      console.error('Failed to save conversation:', error)
      return false
    }
  },

  // Get contextual suggestions based on user data
  async getContextualSuggestions(context) {
    const suggestions = []
    
    if (context.page === 'goals') {
      if (!context.goals || context.goals.length === 0) {
        suggestions.push(
          "How do I create my first financial goal?",
          "What's an emergency fund?",
          "Help me set a savings target"
        )
      } else {
        suggestions.push(
          "How can I save money faster?",
          "Tips for staying motivated",
          "Should I adjust my timeline?"
        )
      }
    } else if (context.page === 'purchases') {
      suggestions.push(
        "How can I reduce my spending?",
        "Analyze my spending patterns",
        "What's my biggest expense category?"
      )
    } else if (context.page === 'social') {
      suggestions.push(
        "How do I compare with friends?",
        "Tips for friendly competition",
        "How to stay motivated together"
      )
    }

    return suggestions
  }
}
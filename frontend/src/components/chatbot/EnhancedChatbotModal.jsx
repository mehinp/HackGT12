// src/components/chatbot/EnhancedChatbotModal.jsx
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuthContext } from '../../hooks/Authentication hooks/useAuthContext'
import { useGoalsContext } from '../../hooks/Data Management Hooks/useGoalsContext'
import { usePurchasesContext } from '../../hooks/Data Management Hooks/usePurchasesContext'
import Button from '../Button'
import ChatInterface from './ChatInterface'

const EnhancedChatbotModal = ({ onClose, context = 'goals', initialMessage = null }) => {
  const { darkMode } = useTheme()
  const { user } = useAuthContext()
  const { goals } = useGoalsContext()
  const { purchases } = usePurchasesContext()
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const getUserName = useCallback(() => {
    if (user?.firstName) return user.firstName
    if (user?.name) return user.name.split(' ')[0]
    if (user?.email) return user.email.split('@')[0]
    return 'there'
  }, [user])

  const getContextualWelcome = useCallback(() => {
    const userName = getUserName()
    const goalCount = goals?.length || 0
    const monthlySpending = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    let welcome = `Hi ${userName}! 🎯 I'm your AI financial assistant. `
    
    if (context === 'goals') {
      if (goalCount === 0) {
        welcome += "I see you haven't set any financial goals yet. I can help you create your first goal and develop a savings strategy!"
      } else if (goalCount === 1) {
        welcome += `I see you have 1 financial goal. Great start! I can help you optimize your progress or create additional goals.`
      } else {
        welcome += `You have ${goalCount} active goals - excellent! I can help you track progress, adjust timelines, or optimize your savings strategy.`
      }
    }

    welcome += "\n\nWhat would you like to discuss today?"
    return welcome
  }, [context, goals, purchases, getUserName])

  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: initialMessage || getContextualWelcome(),
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [initialMessage, getContextualWelcome])

  const generateContextualResponse = (userMessage, chatContext) => {
    const message = userMessage.toLowerCase()
    const userName = getUserName()
    const goalCount = goals?.length || 0
    const userIncome = user?.income || 0
    const userExpenses = user?.expenditures || 0
    const monthlySpending = purchases?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

    // Goal-specific responses
    if (chatContext === 'goals') {
      if (message.includes('create') || message.includes('new goal') || message.includes('set goal')) {
        return `Great! Let me help you create a new goal. Here's my recommended approach:

📋 **Goal Setting Steps:**
1. **Define your target** - What are you saving for?
2. **Set the amount** - How much do you need?
3. **Choose timeline** - When do you want to achieve it?
4. **Plan contributions** - How much can you save monthly?

💡 **Popular goal types:**
• Emergency fund (3-6 months expenses)
• Vacation fund
• House down payment
• Car purchase
• Debt payoff

Based on your income of $${userIncome}/month, I'd suggest starting with an emergency fund of $${Math.round(userIncome * 3)}.

What type of goal would you like to create?`
      }

      if (message.includes('emergency fund') || message.includes('emergency')) {
        const recommendedAmount = userIncome * 3
        return `Emergency funds are crucial! 🛡️

**Why you need one:**
• Covers unexpected expenses
• Prevents debt accumulation
• Provides peace of mind

**Recommended amount:** $${Math.round(recommendedAmount)} (3 months of expenses)

**How to build it:**
• Start with $1,000 mini-emergency fund
• Save $${Math.round(recommendedAmount / 12)}/month to reach full fund in 1 year
• Keep it in a high-yield savings account

Would you like me to help you set up an emergency fund goal?`
      }

      if (message.includes('progress') || message.includes('track')) {
        if (goalCount === 0) {
          return `You don't have any goals to track yet. Let's create your first one! I recommend starting with an emergency fund goal.`
        } else {
          return `Great question about tracking progress! 📊

**Effective tracking strategies:**
• Weekly check-ins on savings
• Visual progress charts
• Milestone celebrations
• Automatic transfers to goal accounts

**Your current status:**
• ${goalCount} active goal${goalCount > 1 ? 's' : ''}
• Monthly spending: $${Math.round(monthlySpending)}

Would you like tips on staying motivated or adjusting your savings rate?`
        }
      }

      if (message.includes('save') || message.includes('saving')) {
        const savingsRate = userIncome > 0 ? Math.max(0, (userIncome - userExpenses) / userIncome * 100) : 0
        return `Let's talk saving strategies! 💰

**Your situation:**
• Monthly income: $${userIncome}
• Current savings rate: ~${Math.round(savingsRate)}%

**Savings tips:**
• **50/30/20 rule**: 50% needs, 30% wants, 20% savings
• **Pay yourself first**: Save before spending
• **Automate**: Set up automatic transfers
• **Start small**: Even $25/week = $1,300/year

**Quick wins:**
• Cancel unused subscriptions
• Cook more meals at home
• Use the 24-hour rule for purchases >$50

What's your biggest savings challenge right now?`
      }

      if (message.includes('timeline') || message.includes('deadline') || message.includes('when')) {
        return `Timeline planning is key to goal success! ⏰

**Timeline factors to consider:**
• **Urgency**: Emergency fund = 6-12 months
• **Flexibility**: Vacation = 1-2 years is fine
• **Large goals**: House down payment = 3-5 years

**Timeline tips:**
• Be realistic but ambitious
• Break into smaller milestones
• Adjust if circumstances change
• Celebrate progress along the way

**Example timelines:**
• Emergency fund ($5,000): 10-12 months
• Vacation ($3,000): 12-18 months
• Car down payment ($5,000): 12-24 months

What timeline feels realistic for your goal?`
      }

      if (message.includes('help') || message.includes('how')) {
        return `I'm here to help with all aspects of financial goal setting! 🎯

**I can assist with:**
• Creating SMART financial goals
• Calculating savings timelines
• Budgeting strategies
• Progress tracking tips
• Motivation and accountability
• Adjusting goals as life changes

**Popular topics:**
• Emergency fund planning
• Vacation savings
• Home buying preparation
• Debt payoff strategies
• Investment goal setting

What specific area would you like to dive into?`
      }
    }

    // General financial responses
    if (message.includes('budget')) {
      return `Budgeting is the foundation of financial success! 📊

**Simple budgeting method (50/30/20):**
• 50% - Needs (rent, utilities, groceries)
• 30% - Wants (entertainment, dining out)
• 20% - Savings & debt repayment

**Your numbers:**
• Monthly income: $${userIncome}
• Suggested savings: $${Math.round(userIncome * 0.2)}

**Budgeting tips:**
• Track expenses for a week first
• Use apps or spreadsheets
• Review and adjust monthly
• Be realistic but disciplined

Would you like help setting up a budget or tracking expenses?`
    }

    if (message.includes('debt') || message.includes('pay off')) {
      return `Debt payoff is a great goal! 💪

**Two popular strategies:**
• **Debt Snowball**: Pay minimums on all debts, extra on smallest balance
• **Debt Avalanche**: Pay minimums on all debts, extra on highest interest rate

**Tips for success:**
• List all debts (amount, minimum payment, interest rate)
• Choose your strategy and stick to it
• Consider debt consolidation if it lowers rates
• Avoid taking on new debt

**Motivation boosters:**
• Celebrate each debt eliminated
• Track progress visually
• Consider side income for extra payments

What type of debt are you looking to eliminate?`
    }

    if (message.includes('invest') || message.includes('investment')) {
      return `Investment goals are smart for long-term wealth! 📈

**Investment basics:**
• Start with emergency fund first
• Consider 401(k) employer match
• Index funds for beginners
• Diversification is key
• Time in market > timing market

**Goal timeline matters:**
• Short-term (< 3 years): High-yield savings
• Medium-term (3-10 years): Conservative investments
• Long-term (10+ years): Stock market growth

**Remember:** This is educational info, not personalized investment advice. Consider consulting a financial advisor for specific recommendations.

What's your investment timeline and risk tolerance?`
    }

    if (message.includes('thank')) {
      return `You're very welcome, ${userName}! 😊 

I'm always here to help you achieve your financial goals. Remember:
• Small steps lead to big results
• Consistency beats perfection
• You've got this! 💪

Feel free to ask me anything else about your financial journey!`
    }

    // Default responses based on context
    const defaultResponses = [
      `I'd love to help you with that! Could you be more specific about what you're looking to achieve with your ${context === 'goals' ? 'financial goals' : 'finances'}?`,
      `That's a great question! For the best advice, could you tell me more about your specific situation or what outcome you're hoping for?`,
      `I'm here to help you succeed! What aspect of ${context === 'goals' ? 'goal setting and achievement' : 'financial planning'} would you like to focus on?`,
      `Excellent! Let me help you with that. What's your main priority right now - saving more, spending less, or planning for the future?`
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async (messageText) => {
    const userMessage = { 
      id: Date.now(), 
      text: messageText, 
      sender: 'user', 
      timestamp: new Date() 
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    // Simulate thinking time
    const thinkingTime = 1500 + Math.random() * 1000

    try {
      // Here you could make an API call to your chatbot service
      // For now, we'll use the contextual response generator
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: generateContextualResponse(messageText, context),
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }, thinkingTime)
    } catch (error) {
      console.error('Chatbot error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble right now. Please try again in a moment!",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsTyping(false)
    }
  }

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      text: getContextualWelcome(),
      sender: 'bot',
      timestamp: new Date()
    }])
  }

  const getSuggestedQuestions = () => {
    if (context === 'goals') {
      const goalCount = goals?.length || 0
      if (goalCount === 0) {
        return [
          "How do I create my first financial goal?",
          "What's an emergency fund?",
          "How much should I save each month?",
          "Help me set up a vacation fund"
        ]
      } else {
        return [
          "How can I save money faster?",
          "Should I adjust my timeline?",
          "Tips for staying motivated",
          "How to track my progress better"
        ]
      }
    }
    return [
      "Help me with budgeting",
      "How to save more money",
      "Investment basics",
      "Debt payoff strategies"
    ]
  }

  const modalStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
  }

  const containerStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '900px',
    height: '90vh',
    maxHeight: '700px',
    display: 'flex',
    flexDirection: 'column',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
    backgroundColor: darkMode ? '#374151' : '#f8fafc'
  }

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: darkMode ? '#f8fafc' : '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const contextBadgeStyle = {
    fontSize: '0.75rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '1rem',
    textTransform: 'uppercase',
    fontWeight: '500'
  }

  const contentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }

  const suggestionsStyle = {
    padding: '1rem',
    borderTop: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
    backgroundColor: darkMode ? '#374151' : '#f8fafc'
  }

  const suggestionButtonStyle = {
    padding: '0.5rem 1rem',
    margin: '0.25rem',
    backgroundColor: 'transparent',
    border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '1rem',
    color: darkMode ? '#f8fafc' : '#374151',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  return (
    <div style={modalStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>🤖 AI Financial Assistant</h2>
            <span style={contextBadgeStyle}>{context}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="ghost" size="sm" onClick={handleClearChat} icon="🗑️">
              Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} icon="✕">
              Close
            </Button>
          </div>
        </div>

        {/* Chat Interface */}
        <div style={contentStyle}>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>

        {/* Quick Suggestions */}
        <div style={suggestionsStyle}>
          <div style={{ 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            marginBottom: '0.5rem',
            color: darkMode ? '#f8fafc' : '#374151'
          }}>
            💡 Quick questions:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {getSuggestedQuestions().map((question, index) => (
              <button
                key={index}
                style={suggestionButtonStyle}
                onClick={() => handleSendMessage(question)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = darkMode ? '#4b5563' : '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedChatbotModal
import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuthContext } from '../../hooks/Authentication hooks/useAuthContext'
import Button from '../Button'
import ChatInterface from './ChatInterface'

const ChatbotModal = ({ onClose, context = 'general' }) => {
  const { darkMode } = useTheme()
  const { user } = useAuthContext()
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  const getWelcomeMessage = useCallback((ctx) => {
    const userName = user?.name?.split(' ')[0] || 'there'
    switch (ctx) {
      case 'goals':
        return `Hi ${userName}! 🎯 I'm here to help you with your financial goals. I can provide advice on saving strategies, goal setting, and tracking progress. What would you like to know?`
      case 'purchases':
        return `Hello ${userName}! 🛒 I can help you analyze your spending patterns, categorize purchases, and suggest ways to optimize your budget. How can I assist you today?`
      case 'social':
        return `Hey ${userName}! 👥 I'm here to help with social features, challenges, and comparing your progress with friends. What would you like to explore?`
      default:
        return `Hi ${userName}! 💰 I'm your AI financial assistant. I can help you with budgeting, saving tips, goal planning, and analyzing your spending habits. What would you like to discuss?`
    }
  }, [user])

  useEffect(() => {
    setMessages([{
      id: 1,
      text: getWelcomeMessage(context),
      sender: 'bot',
      timestamp: new Date()
    }])
  }, [context, getWelcomeMessage])

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
    maxWidth: '800px',
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
    fontWeight: '500',
    display: 'inline-block',
    marginTop: '0.25rem'
  }

  const contentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }

  const generateBotResponse = (userMessage, ctx) => {
    const message = userMessage.toLowerCase()

    if (ctx === 'goals') {
      if (message.includes('save') || message.includes('saving')) {
        return "Great question about saving! 💰 Here are some effective strategies:\n\n1. **50/30/20 Rule**: Allocate 50% for needs, 30% for wants, 20% for savings\n2. **Automate your savings**: Set up automatic transfers to your goal accounts\n3. **Start small**: Even $25/week adds up to $1,300/year\n4. **Track progress**: Use visual reminders to stay motivated\n\nWhich goal are you working towards? I can provide more specific advice!"
      }
      if (message.includes('goal') || message.includes('target')) {
        return "Setting SMART goals is key! 🎯 Your goals should be:\n\n✅ **Specific**\n✅ **Measurable**\n✅ **Achievable**\n✅ **Relevant**\n✅ **Time-bound**\n\nFor example: 'Save $5,000 for emergency fund by December 2024'. What goal would you like help structuring?"
      }
    }

    if (ctx === 'purchases') {
      if (message.includes('budget') || message.includes('spending')) {
        return "Let's optimize your spending! 📊 Recommendations:\n\n1. Track all transactions\n2. Categorize wisely\n3. Set category limits\n4. Review weekly\n\nWant me to analyze your recent purchases?"
      }
      if (message.includes('reduce') || message.includes('cut')) {
        return "Smart thinking! 💡 Ways to reduce expenses:\n\n• Audit subscriptions\n• Cook more\n• Carpool/public transit\n• Compare prices/buy generic\n• Watch small daily purchases\n\nWhich category first?"
      }
    }

    if (message.includes('help') || message.includes('how')) {
      return "I can help with planning, goals, spending analysis, investment basics, and social features. What specific area would you like to explore?"
    }

    if (message.includes('invest')) {
      return "Beginner investment flow: emergency fund → simple index funds → DCA → diversify → long horizon. This is general info, not personal advice."
    }

    if (message.includes('score') || message.includes('improve')) {
      return "To improve your score: save/invest regularly, stay within budget, hit goals on time, and build an emergency fund. Which area should we target?"
    }

    if (message.includes('thank')) {
      return "You're welcome! 😊 Small, consistent steps add up. Ask me anything else!"
    }

    const defaultResponses = [
      "Interesting! Could you share a bit more detail so I can tailor the advice?",
      "Happy to help. What outcome are you aiming for—budgeting, saving, investing, or goals?",
      "I can help with budgeting, goal setting, spending analysis, and saving strategies. Which one should we dive into?",
      "I'm here for your financial success! What's top of mind right now?"
    ]
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSendMessage = async (messageText) => {
    const userMessage = { id: Date.now(), text: messageText, sender: 'user', timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: generateBotResponse(messageText, context),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      text: getWelcomeMessage(context),
      sender: 'bot',
      timestamp: new Date()
    }])
  }

  return (
    <div style={modalStyle} onClick={onClose} role="dialog" aria-modal="true">
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>🤖 AI Financial Assistant</h2>
            <span style={contextBadgeStyle}>{context}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="ghost" size="sm" onClick={handleClearChat} icon="🗑️">Clear</Button>
            <Button variant="ghost" size="sm" onClick={onClose} icon="✕">Close</Button>
          </div>
        </div>

        <div style={contentStyle}>
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatbotModal
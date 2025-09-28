import { ChatbotContext } from '../context/ChatbotContext'
import { useContext } from 'react'

export const useChatbot = () => {
  const context = useContext(ChatbotContext)

  if (!context) {
    throw Error('useChatbot must be used inside a ChatbotContextProvider')
  }

  return context
}
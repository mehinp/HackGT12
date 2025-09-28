// hooks/useSocialContext.js
import { SocialContext } from '../../context/SocialContext'
import { useContext } from 'react'

export const useSocialContext = () => {
  const context = useContext(SocialContext)

  if (!context) {
    throw Error('useSocialContext must be used inside a SocialContextProvider')
  }

  return context
}
// hooks/useScoreContext.js
import { ScoreContext } from '../../context/ScoreContext'
import { useContext } from 'react'

export const useScoreContext = () => {
  const context = useContext(ScoreContext)

  if (!context) {
    throw Error('useScoreContext must be used inside a ScoreContextProvider')
  }

  return context
}
// hooks/usePurchasesContext.js
import { PurchasesContext } from '../../context/PurchasesContext'
import { useContext } from 'react'

export const usePurchasesContext = () => {
  const context = useContext(PurchasesContext)

  if (!context) {
    throw Error('usePurchasesContext must be used inside a PurchasesContextProvider')
  }

  return context
}
import { useState, useEffect } from 'react'
import { usePurchasesContext } from './usePurchasesContext'

export const usePurchaseAnalysis = () => {
  const { purchases } = usePurchasesContext()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (purchases && purchases.length > 0) {
      setLoading(true)
      
      // Mock ML analysis - would normally call API
      setTimeout(() => {
        const mockAnalysis = {
          totalSpent: purchases.reduce((sum, p) => sum + p.amount, 0),
          averageTransaction: purchases.reduce((sum, p) => sum + p.amount, 0) / purchases.length,
          topCategory: 'food',
          spendingTrend: 'increasing',
          recommendations: [
            'Consider reducing entertainment spending',
            'Great job on investment contributions',
            'Try to automate your savings'
          ]
        }
        setAnalysis(mockAnalysis)
        setLoading(false)
      }, 1000)
    }
  }, [purchases])

  return { analysis, loading }
}
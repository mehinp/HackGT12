// hooks/useSignup.js
import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (firstName, lastName, email, password, income, expenditures) => {
    setIsLoading(true)
    setError(null)

    // Basic validation
    if (!firstName || !lastName || !email || !password || income === '' || expenditures === '') {
      setError('Please fill in all fields')
      setIsLoading(false)
      return false
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsLoading(false)
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return false
    }

    // Validate income and expenditures
    const incomeNum = parseFloat(income)
    const expendituresNum = parseFloat(expenditures)

    if (isNaN(incomeNum) || incomeNum <= 0) {
      setError('Income must be a valid number greater than 0')
      setIsLoading(false)
      return false
    }

    if (isNaN(expendituresNum) || expendituresNum <= 0) {
      setError('Expenditures must be a valid number greater than 0')
      setIsLoading(false)
      return false
    }

    // Optional: Check if expenditures exceed income (warning, not error)
    if (expendituresNum > incomeNum) {
      setError('Warning: Your expenditures exceed your income. Please verify these amounts.')
      setIsLoading(false)
      return false
    }

    try {
      // Mock signup - replace with actual API call
      const mockUser = {
        id: Date.now(),
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        income: incomeNum,
        expenditures: expendituresNum,
        token: 'mock-jwt-token'
      }

      localStorage.setItem('user', JSON.stringify(mockUser))
      dispatch({ type: 'LOGIN', payload: mockUser })
      setIsLoading(false)
      return true
    } catch (err) {
      setIsLoading(false)
      setError('Failed to create account')
      return false
    }
  }

  return { signup, isLoading, error }
}
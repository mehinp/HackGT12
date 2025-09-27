// hooks/useSignup.js
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate()

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
      // Prepare the request body to match your backend User model
      const requestBody = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        income: incomeNum,
        expenditures: expendituresNum
      }

      // Make API call to your backend
      const response = await fetch('http://143.215.104.239:8080/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      // Parse the response
      const data = await response.json()

      if (!response.ok) {
        // Handle different error scenarios
        if (response.status === 400) {
          setError(data.message || 'Invalid input data. Please check your information.')
        } else if (response.status === 409) {
          setError('An account with this email already exists.')
        } else if (response.status >= 500) {
          setError('Server error. Please try again later.')
        } else {
          setError(data.message || 'Registration failed. Please try again.')
        }
        setIsLoading(false)
        return false
      }

      // Registration successful
      setIsLoading(false)
      
      // Navigate to login page with success message
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! Please log in with your credentials.',
          email: requestBody.email // Pre-fill email on login page
        } 
      })
      
      return true

    } catch (err) {
      setIsLoading(false)
      
      // Handle network errors or other exceptions
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection.')
      } else if (err.name === 'SyntaxError') {
        setError('Server response error. Please try again.')
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      
      console.error('Signup error:', err)
      return false
    }
  }

  return { signup, isLoading, error }
}
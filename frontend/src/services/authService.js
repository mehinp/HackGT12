// src/services/authService.js
const BASE = 'http://143.215.104.239:8080'

export const authService = {
  async register(userData) {
    const response = await fetch(`${BASE}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        income: parseFloat(userData.income),
        expenditures: parseFloat(userData.expenditures)
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Registration failed')
    }

    return await response.json()
  },

  async login(email, password) {
    const response = await fetch(`${BASE}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // FIXED: Added credentials for session
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw new Error('Invalid credentials')
    }

    const user = await response.json() // FIXED: Only call response.json() once
    localStorage.setItem('userId', user.id)
    return user
  },

  async logout() {
    const response = await fetch(`${BASE}/user/logout`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    // Clear localStorage on successful logout
    localStorage.removeItem('userId')
    localStorage.removeItem('user')
  },

  async getUser(id) {
    const response = await fetch(`${BASE}/user/${id}`, {
      headers: {
        'X-User-Id': id || localStorage.getItem('userId') // Add User-ID header
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }

    return await response.json()
  },

  // Helper function to get headers with User-ID for authenticated requests
  getAuthHeaders() {
    const userId = localStorage.getItem('userId')
    return {
      'Content-Type': 'application/json',
      'X-User-Id': userId
    }
  },

  // Generic authenticated request helper
  async authenticatedRequest(url, options = {}) {
    const userId = localStorage.getItem('userId')
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
        ...options.headers
      },
      credentials: 'include'
    })

    if (!response.ok) {
      if (response.status === 401) {
        // Clear invalid session
        localStorage.removeItem('userId')
        localStorage.removeItem('user')
        throw new Error('Session expired. Please log in again.')
      }
      throw new Error(`Request failed: ${response.status}`)
    }

    return response
  },
}
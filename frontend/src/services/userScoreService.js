// src/services/userScoreService.js
const BASE = 'http://143.215.104.239:8080'

export const userScoreService = {
  /**
   * Get user score from the backend API
   * @returns {Promise<number>} The user's current score
   */
  async getUserScore() {
    try {
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(`${BASE}/user/user-score`, {
        method: 'GET',
        headers: {
          'X-User-Id': userId
        },
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('userId')
          localStorage.removeItem('user')
          throw new Error('Session expired. Please log in again.')
        }
        throw new Error(`Failed to fetch user score: ${response.status}`)
      }

      const data = await response.json()
      
      // Return the score, defaulting to 500 if not provided
      return data.score || data.userScore || 500
    } catch (error) {
      console.error('User Score Service: Error fetching score:', error)
      // Return fallback score on error
      return 500
    }
  }
}
// src/services/socialService.js
const BASE = 'http://143.215.104.239:8080'

export const socialService = {
  // Get leaderboard rankings (all friends sorted by score)
  async getLeaderboardRankings() {
    const userId = localStorage.getItem('userId')
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${BASE}/leaderboard/rankings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
      throw new Error(`Failed to fetch rankings: ${response.status}`)
    }

    return await response.json()
  },

  async addFriend(friendEmail) {
    const userId = localStorage.getItem('userId')
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${BASE}/leaderboard/new-friend/${encodeURIComponent(friendEmail)}`, {
      method: 'POST',
      headers: {
        'X-User-Id': userId
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to add friend')
    }

    return await response.json()
  },

  async getFriendCount() {
    const userId = localStorage.getItem('userId')
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const response = await fetch(`${BASE}/leaderboard/count`, {
      method: 'GET',
      headers: {
        'X-User-Id': userId
      },
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to get friend count')
    }

    return await response.json()
  },

  // TODO: Implement when backend is ready
  async reactToFriend(friendId, reaction) {
    const userId = localStorage.getItem('userId')
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Placeholder for future backend implementation
    console.log(`Would send reaction ${reaction} to friend ${friendId}`)
  }
}
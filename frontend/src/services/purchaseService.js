// src/services/purchaseService.js
const BASE = 'http://143.215.104.239:8080'

export const purchaseService = {
  async recordPurchase(purchase) {
    const response = await fetch(`${BASE}/purchase/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session management
      body: JSON.stringify({
        amount: parseFloat(purchase.amount),
        category: purchase.category,
        merchant: purchase.merchant
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to record purchase')
    }

    return await response.json()
  },

  async getMyPurchases() {
    const response = await fetch(`${BASE}/purchase/my-purchases`, {
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to fetch purchases')
    }

    return await response.json()
  },

  async getPurchaseById(id) {
    const response = await fetch(`${BASE}/purchase/admin/${id}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Purchase not found')
    }

    return await response.json()
  },

  async getAllPurchasesByUserId(userId) {
    const response = await fetch(`${BASE}/purchase/admin/user/${userId}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user purchases')
    }

    return await response.json()
  }
}
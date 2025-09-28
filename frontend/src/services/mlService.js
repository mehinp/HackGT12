// src/services/mlService.js
const ML_BASE = 'http://128.61.8.194:8082'

export const mlService = {
  /**
   * Get graph data from ML service
   * Returns projected savings, ideal plan, and goal targets
   */
  async getGraphData() {
    try {
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      console.log('ML Service: Fetching graph data for user:', userId)

      const response = await fetch(`${ML_BASE}/get_graph_data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        }
      })

      console.log('ML Service: Graph data response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('ML Service: Graph data error:', errorText)
        throw new Error(`ML Service error: ${response.status}`)
      }

      const data = await response.json()
      console.log('ML Service: Received graph data:', {
        metadata: data.metadata,
        dataPointsKeys: Object.keys(data.data_points || {}),
        dataPointsLength: data.data_points?.days?.length,
        gbmModelScore: data.metadata?.gbm_model_score
      })

      // Store the GBM model score for later database update
      if (data.metadata?.gbm_model_score !== null && data.metadata?.gbm_model_score !== undefined) {
        this.storeUserScore(userId, data.metadata.gbm_model_score)
      }

      return data
    } catch (error) {
      console.error('ML Service: Error fetching graph data:', error)
      throw error
    }
  },

  /**
   * Store user score in localStorage for later database sync
   */
  storeUserScore(userId, score) {
    try {
      const scoreData = {
        userId: userId,
        score: score,
        timestamp: new Date().toISOString(),
        synced: false
      }
      
      // Store individual user score
      localStorage.setItem(`user_score_${userId}`, JSON.stringify(scoreData))
      
      // Also maintain a list of pending score updates
      const pendingScores = this.getPendingScoreUpdates()
      const existingIndex = pendingScores.findIndex(item => item.userId === userId)
      
      if (existingIndex >= 0) {
        pendingScores[existingIndex] = scoreData
      } else {
        pendingScores.push(scoreData)
      }
      
      localStorage.setItem('pending_score_updates', JSON.stringify(pendingScores))
      
      console.log('ML Service: Stored user score:', scoreData)
    } catch (error) {
      console.error('ML Service: Error storing user score:', error)
    }
  },

  /**
   * Get pending score updates that need to be synced to database
   */
  getPendingScoreUpdates() {
    try {
      const pending = localStorage.getItem('pending_score_updates')
      return pending ? JSON.parse(pending) : []
    } catch (error) {
      console.error('ML Service: Error getting pending score updates:', error)
      return []
    }
  },

  /**
   * Get stored user score
   */
  getStoredUserScore(userId) {
    try {
      const stored = localStorage.getItem(`user_score_${userId}`)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('ML Service: Error getting stored user score:', error)
      return null
    }
  },

  /**
   * Mark score as synced to database
   */
  markScoreSynced(userId) {
    try {
      const scoreData = this.getStoredUserScore(userId)
      if (scoreData) {
        scoreData.synced = true
        scoreData.syncedAt = new Date().toISOString()
        localStorage.setItem(`user_score_${userId}`, JSON.stringify(scoreData))
      }
      
      // Remove from pending updates
      const pendingScores = this.getPendingScoreUpdates()
      const filteredScores = pendingScores.filter(item => item.userId !== userId)
      localStorage.setItem('pending_score_updates', JSON.stringify(filteredScores))
      
      console.log('ML Service: Marked score as synced for user:', userId)
    } catch (error) {
      console.error('ML Service: Error marking score as synced:', error)
    }
  },

  /**
   * Sync pending scores to backend database
   */
  async syncScoresToDatabase() {
    const pendingScores = this.getPendingScoreUpdates()
    const results = []
    
    for (const scoreData of pendingScores) {
      try {
        // Call your backend API to update the score
        const response = await fetch('http://143.215.104.239:8080/users/update-score', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': scoreData.userId
          },
          credentials: 'include',
          body: JSON.stringify({
            score: scoreData.score,
            timestamp: scoreData.timestamp
          })
        })
        
        if (response.ok) {
          this.markScoreSynced(scoreData.userId)
          results.push({ userId: scoreData.userId, success: true })
          console.log('ML Service: Successfully synced score for user:', scoreData.userId)
        } else {
          results.push({ 
            userId: scoreData.userId, 
            success: false, 
            error: `HTTP ${response.status}` 
          })
          console.error('ML Service: Failed to sync score for user:', scoreData.userId, response.status)
        }
      } catch (error) {
        results.push({ 
          userId: scoreData.userId, 
          success: false, 
          error: error.message 
        })
        console.error('ML Service: Error syncing score for user:', scoreData.userId, error)
      }
    }
    
    return results
  },

  /**
   * Reload ML model (when user updates data)
   */
  async reloadModel() {
    try {
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(`${ML_BASE}/reload_model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to reload model: ${response.status}`)
      }

      const data = await response.json()
      console.log('ML Service: Model reloaded:', data)
      return data
    } catch (error) {
      console.error('ML Service: Error reloading model:', error)
      throw error
    }
  },

  /**
   * Get all user data from ML service
   */
  async getAllData() {
    try {
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const response = await fetch(`${ML_BASE}/all-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to get all data: ${response.status}`)
      }

      const data = await response.json()
      console.log('ML Service: All data received:', data)
      return data
    } catch (error) {
      console.error('ML Service: Error fetching all data:', error)
      throw error
    }
  },

  /**
   * Transform ML service response to chart format
   */
  transformToChartData(mlData) {
    if (!mlData?.data_points) {
      console.warn('ML Service: No data_points in response:', mlData)
      return []
    }

    const { data_points } = mlData
    const chartData = []
    
    // Get the length of the shortest array to avoid index errors
    const lengths = [
      data_points.days?.length || 0,
      data_points.projected_savings?.length || 0,
      data_points.ideal_plan?.length || 0,
      data_points.goal_line?.length || 0
    ]
    const maxLength = Math.min(...lengths.filter(l => l > 0))

    console.log('ML Service: Transforming data with length:', maxLength)

    for (let i = 0; i < maxLength; i++) {
      chartData.push({
        day: data_points.days?.[i] || i + 1,
        'Projected Savings': data_points.projected_savings?.[i] || 0,
        'Ideal Plan': data_points.ideal_plan?.[i] || 0,
        'Goal Target': data_points.goal_line?.[i] || 0
      })
    }

    console.log('ML Service: Transformed chart data (first 3):', chartData.slice(0, 3))
    return chartData
  },

  /**
   * Get time series data for detailed analysis
   */
  getTimeSeriesData(mlData) {
    if (!mlData?.time_series) {
      return null
    }

    return {
      dailyNetSavings: mlData.time_series.daily_net_savings || [],
      dailyIncome: mlData.time_series.daily_income || [],
      llmAdjustments: mlData.time_series.llm_adjustments || [],
      trendFactor: mlData.time_series.trend_factor || []
    }
  },

  /**
   * Get purchase scores from ML service
   */
  getPurchaseScores(mlData) {
    if (!mlData?.purchase_scores) {
      return {
        scores: [],
        usedFeatures: []
      }
    }

    return {
      scores: mlData.purchase_scores.scores || [],
      usedFeatures: mlData.purchase_scores.used_features || []
    }
  },

  /**
   * Get different view data (week, month, full horizon)
   */
  getViewData(mlData, view = 'full_horizon') {
    if (!mlData?.views?.[view]) {
      return null
    }

    const viewData = mlData.views[view]
    const chartData = []
    
    const maxLength = Math.min(
      viewData.days?.length || 0,
      viewData.projected_savings?.length || 0,
      viewData.ideal_plan?.length || 0,
      viewData.goal_line?.length || 0
    )

    for (let i = 0; i < maxLength; i++) {
      chartData.push({
        day: viewData.days?.[i] || i + 1,
        'Projected Savings': viewData.projected_savings?.[i] || 0,
        'Ideal Plan': viewData.ideal_plan?.[i] || 0,
        'Goal Target': viewData.goal_line?.[i] || 0
      })
    }

    return chartData
  },

  /**
   * Get ML insights and metadata
   */
  getInsights(mlData) {
    if (!mlData?.metadata) {
      return null
    }

    const metadata = mlData.metadata
    return {
      currentSavings: metadata.current_savings || 0,
      goalAmount: metadata.goal_amount || 0,
      incomeMonthly: metadata.income_monthly || 0,
      daysHorizon: metadata.days_horizon || 90,
      moneyScore: metadata.money_score || 0,
      projectionMode: metadata.projection_mode || 'piecewise',
      purchasesProcessed: metadata.purchases_processed || 0,
      modelUpdated: metadata.model_updated || false,
      modelError: metadata.model_error || null,
      // Use GBM model score as the primary user score
      userScore: metadata.gbm_model_score || metadata.score || 0,
      gbmModelScore: metadata.gbm_model_score,
      dailySavingsBudget: metadata.daily_savings_budget || 0,
      recentAvgSpend: metadata.recent_avg_spend || 0
    }
  },

  /**
   * Calculate goal achievement probability based on current trajectory
   */
  calculateGoalProbability(mlData, goalAmount) {
    if (!mlData?.data_points?.projected_savings) {
      return 0
    }

    const projectedSavings = mlData.data_points.projected_savings
    const finalProjectedAmount = projectedSavings[projectedSavings.length - 1] || 0
    
    // Simple probability calculation based on trajectory
    if (finalProjectedAmount >= goalAmount) {
      return Math.min(95, 70 + (finalProjectedAmount - goalAmount) / goalAmount * 25)
    } else {
      return Math.max(5, 70 * finalProjectedAmount / goalAmount)
    }
  },

  /**
   * Get projected completion date for a goal
   */
  getProjectedCompletionDate(mlData, goalAmount) {
    if (!mlData?.data_points?.projected_savings || !mlData?.data_points?.days) {
      return null
    }

    const projectedSavings = mlData.data_points.projected_savings
    const days = mlData.data_points.days

    // Find when projected savings will reach the goal
    for (let i = 0; i < projectedSavings.length; i++) {
      if (projectedSavings[i] >= goalAmount) {
        const completionDate = new Date()
        completionDate.setDate(completionDate.getDate() + days[i])
        return completionDate
      }
    }

    // If goal won't be reached in the projection period, estimate based on trend
    if (projectedSavings.length >= 2) {
      const lastAmount = projectedSavings[projectedSavings.length - 1]
      const secondLastAmount = projectedSavings[projectedSavings.length - 2]
      const dailyGrowth = lastAmount - secondLastAmount
      
      if (dailyGrowth > 0) {
        const remainingAmount = goalAmount - lastAmount
        const additionalDays = Math.ceil(remainingAmount / dailyGrowth)
        const completionDate = new Date()
        completionDate.setDate(completionDate.getDate() + days[days.length - 1] + additionalDays)
        return completionDate
      }
    }

    return null
  }
}
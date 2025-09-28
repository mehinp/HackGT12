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
        dataPointsLength: data.data_points?.days?.length
      })

      return data
    } catch (error) {
      console.error('ML Service: Error fetching graph data:', error)
      throw error
    }
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
      modelError: metadata.model_error || null
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
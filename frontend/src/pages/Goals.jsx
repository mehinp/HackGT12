// src/pages/Goals.jsx - Updated with ML service integration and comma formatting
import { useState, useEffect } from 'react'
import { useGoalsContext } from '../hooks/Data Management Hooks/useGoalsContext'
import { useScoreContext } from '../hooks/Data Management Hooks/useScoreContext'
import { mlService } from '../services/mlService'
import Button from '../components/Button'
import GoalsList from '../components/Goals Components/GoalsList'
import GoalForm from '../components/Goals Components/GoalForm'
import EnhancedChatbotModal from '../components/chatbot/EnhancedChatbotModal'
import FloatingChatbotButton from '../components/chatbot/FloatingChatbotButton'
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Goals = () => {
  const { goals, dispatch } = useGoalsContext()
  const { currentScore } = useScoreContext()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [chatbotContext, setChatbotContext] = useState('goals')
  
  // ML data states
  const [mlData, setMlData] = useState(null)
  const [chartData, setChartData] = useState([])
  const [mlInsights, setMlInsights] = useState(null)
  const [mlLoading, setMlLoading] = useState(false)
  const [mlError, setMlError] = useState('')
  const [selectedView, setSelectedView] = useState('full_horizon') // week, month, full_horizon

  // Number formatting function
  const formatNumber = (num) => {
    return Math.round(num).toLocaleString()
  }

  // Fetch both goals and ML data when component mounts
  useEffect(() => {
    Promise.all([
      fetchGoals(),
      fetchMLData()
    ]).finally(() => {
      setLoading(false)
    })
  }, [])

  const fetchGoals = async () => {
    try {
      setError('')
      
      const userId = localStorage.getItem('userId')
      console.log('Fetching goals for userId:', userId)
      
      if (!userId) {
        setError('User not authenticated. Please log in again.')
        return
      }

      // Fetch goals from the backend
      const response = await fetch('http://143.215.104.239:8080/goals/my-goals', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        }
      })

      console.log('Goals API Response Status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Goals API Error Response:', errorText)
        
        if (response.status === 401) {
          setError('Session expired. Please log in again.')
          localStorage.removeItem('userId')
          localStorage.removeItem('user')
          return
        }
        throw new Error(`Failed to fetch goals: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('Goals API Response Data:', data)
      
      // Transform single goal from backend
      let transformedGoals = []
      
      if (data.goal) {
        console.log('Transforming single goal:', data.goal)
        const goal = data.goal
        
        const transformedGoal = {
          title: goal.title || `Goal ${goal.id}`,
          saved: parseFloat(goal.saved) || 0,
          days: goal.days
        }
        
        transformedGoals = [transformedGoal]
        console.log('Transformed goal:', transformedGoal)
      } else {
        console.log('No goal found in response')
        transformedGoals = []
      }

      console.log('Final goals array:', transformedGoals)

      // Update context with fetched goals
      dispatch({ type: 'SET_GOALS', payload: transformedGoals })
      
    } catch (err) {
      console.error('Error fetching goals:', err)
      setError(err.message || 'Failed to load goals')
      
      // Set empty goals array if fetch fails
      dispatch({ type: 'SET_GOALS', payload: [] })
    }
  }

  const fetchMLData = async () => {
    try {
      setMlLoading(true)
      setMlError('')
      
      console.log('Fetching ML data...')
      const data = await mlService.getGraphData()
      
      console.log('ML Data received:', data)
      setMlData(data)
      
      // Transform data for chart
      const transformedData = mlService.transformToChartData(data)
      setChartData(transformedData)
      
      // Get insights
      const insights = mlService.getInsights(data)
      setMlInsights(insights)
      
      console.log('Chart data:', transformedData.slice(0, 3))
      console.log('Insights:', insights)
      
    } catch (err) {
      console.error('Error fetching ML data:', err)
      setMlError(err.message || 'Failed to load projection data')
      
      // Set fallback data
      setChartData([])
      setMlInsights(null)
    } finally {
      setMlLoading(false)
    }
  }

  const handleViewChange = (view) => {
    setSelectedView(view)
    if (mlData) {
      const viewData = mlService.getViewData(mlData, view)
      if (viewData) {
        setChartData(viewData)
      }
    }
  }

  const handleGoalCreated = () => {
    // Refresh both goals and ML data after creating a new goal
    Promise.all([
      fetchGoals(),
      fetchMLData()
    ])
    setShowAddGoal(false)
  }

  const handleRefreshData = async () => {
    setLoading(true)
    try {
      // Reload ML model first, then fetch fresh data
      await mlService.reloadModel()
      await Promise.all([
        fetchGoals(),
        fetchMLData()
      ])
    } catch (err) {
      console.error('Error refreshing data:', err)
      setError('Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }

  // Enhanced chatbot triggers
  const openChatbotForNewGoal = () => {
    setChatbotContext('goals')
    setShowChatbot(true)
  }

  const openChatbotForProgress = () => {
    setChatbotContext('goals')
    setShowChatbot(true)
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ 
            fontWeight: '600', 
            color: '#1e293b',
            marginBottom: '0.5rem' 
          }}>
            Day {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              color: entry.color,
              margin: '0.25rem 0',
              fontSize: '0.875rem'
            }}>
              {entry.name}: ${formatNumber(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Calculate goal probability and completion date
  const getGoalAnalysis = (goal) => {
    if (!mlData || !goal) return null
    
    const probability = mlService.calculateGoalProbability(mlData, goal.saved)
    const completionDate = mlService.getProjectedCompletionDate(mlData, goal.saved)
    
    return { probability, completionDate }
  }

  const pageStyle = {
    padding: '1rem 0',
    position: 'relative'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  }

  const actionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }

  const mainContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
  }

  const chartCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
    marginBottom: '2rem'
  }

  const errorStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #fecaca'
  }

  const warningStyle = {
    backgroundColor: '#fffbeb',
    color: '#d97706',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #fed7aa'
  }

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.125rem',
    color: '#6b7280'
  }

  const viewButtonsStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem'
  }

  const viewButtonStyle = (isActive) => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: '1px solid #e2e8f0',
    backgroundColor: isActive ? '#3b82f6' : '#ffffff',
    color: isActive ? '#ffffff' : '#6b7280',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  })

  // Show loading state
  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={actionButtonsStyle}>
            <Button 
              variant="primary" 
              icon="➕"
              onClick={() => setShowAddGoal(true)}
            >
              Add New Goal
            </Button>
          </div>
        </div>

        <div style={mainContentStyle}>
          <div style={loadingStyle}>
            Loading your goals and projections...
          </div>
        </div>
        
        <FloatingChatbotButton 
          onClick={() => setShowChatbot(true)} 
          context="goals"
        />
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={actionButtonsStyle}>
          <Button 
            variant="primary" 
            icon="➕"
            onClick={() => setShowAddGoal(true)}
          >
            Add New Goal
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={errorStyle}>
          ⚠️ {error}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            style={{ marginLeft: '1rem' }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* ML Error Display */}
      {mlError && (
        <div style={warningStyle}>
          Projection data unavailable: {mlError}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchMLData}
            style={{ marginLeft: '1rem' }}
          >
            Retry ML Data
          </Button>
        </div>
      )}

      {/* Chart Section */}
      <div style={chartCardStyle}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Financial Projection
            </h2>
            
            <div style={viewButtonsStyle}>
              <button 
                style={viewButtonStyle(selectedView === 'week')}
                onClick={() => handleViewChange('week')}
              >
                Week
              </button>
              <button 
                style={viewButtonStyle(selectedView === 'month')}
                onClick={() => handleViewChange('month')}
              >
                Month
              </button>
              <button 
                style={viewButtonStyle(selectedView === 'full_horizon')}
                onClick={() => handleViewChange('full_horizon')}
              >
                Full
              </button>
            </div>
          </div>
          
          {mlLoading && (
            <div style={{ textAlign: 'center', color: '#6b7280', marginBottom: '1rem' }}>
              Loading ML projections...
            </div>
          )}
          
          {mlInsights?.modelError && (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              color: '#dc2626', 
              padding: '0.5rem', 
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              ⚠️ ML Model Issue: {mlInsights.modelError}
            </div>
          )}
        </div>
        
        <div style={{ width: '100%', height: '400px' }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: 'Days', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' } }}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${formatNumber(value / 1000)}k`}
                  label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' } }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="Projected Savings"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                />
                <Line
                  type="monotone"
                  dataKey="Ideal Plan"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                  activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
                />
                <Line
                  type="monotone"
                  dataKey="Goal Target"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  strokeOpacity={0.6}
                  dot={false}
                  strokeDasharray="2 2"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={loadingStyle}>
              {mlLoading ? 'Loading projection data...' : 'No projection data available'}
            </div>
          )}
        </div>
      </div>

      {/* Goals List Section */}
      <div style={mainContentStyle}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Your Goals
          </h2>
        </div>
        
        {/* Enhanced Goals List with ML Analysis */}
        {goals && goals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {goals.map((goal, index) => {
              const analysis = getGoalAnalysis(goal)
              return (
                <div key={index} style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '0.5rem'
                      }}>
                        {goal.title}
                      </h3>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.875rem'
                      }}>
                        Target: ${formatNumber(goal.saved)} by {formatNumber(goal.days)} days
                      </p>
                    </div>
                  </div>
                  
                  {analysis && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1rem',
                      marginTop: '1rem'
                    }}>
                      <div style={{
                        backgroundColor: '#ffffff',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Achievement Probability
                        </div>
                        <div style={{
                          fontSize: '1.25rem',
                          fontWeight: '600',
                          color: analysis.probability > 70 ? '#10b981' : analysis.probability > 40 ? '#f59e0b' : '#ef4444'
                        }}>
                          {Math.round(analysis.probability)}%
                        </div>
                      </div>
                      
                      {analysis.completionDate && (
                        <div style={{
                          backgroundColor: '#ffffff',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                            Projected Completion
                          </div>
                          <div style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#1e293b'
                          }}>
                            {analysis.completionDate.toLocaleDateString()}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty state with chatbot integration */
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.75rem',
            border: '1px solid #e2e8f0',
            marginTop: '1rem'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem'
            }}>
              Ready to set your first goal?
            </h3>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              {mlInsights 
                ? `With your current savings of ${formatNumber(mlInsights.currentSavings)}, our AI can help you create realistic goals.`
                : 'Our AI assistant can help you create personalized financial goals based on your situation.'
              }
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Button
                variant="primary"
                onClick={() => setShowAddGoal(true)}
                icon="🎯"
              >
                Create Goal Manually
              </Button>
              <Button
                variant="secondary"
                onClick={openChatbotForNewGoal}
                icon="🤖"
              >
                Get AI Help
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddGoal && (
        <GoalForm 
          onClose={() => setShowAddGoal(false)} 
          goal={selectedGoal}
          onSuccess={handleGoalCreated}
          mlInsights={mlInsights} // Pass ML insights to the form
        />
      )}

      {/* Enhanced Chatbot Integration */}
      {showChatbot && (
        <EnhancedChatbotModal 
          onClose={() => setShowChatbot(false)}
          context={chatbotContext}
          initialMessage={
            goals?.length === 0 
              ? `I see you haven't set any financial goals yet! 🎯 ${mlInsights ? `With your current savings of ${formatNumber(mlInsights.currentSavings)} and monthly income of ${formatNumber(mlInsights.incomeMonthly)}, ` : ''}I can help you create your first goal. Would you like to start with an emergency fund, vacation savings, or something else?`
              : mlInsights 
                ? `Your current trajectory score is ${Math.round(mlInsights.moneyScore * 100)}%. Let me help you optimize your financial strategy! 📊`
                : null
          }
          userData={{
            currentSavings: mlInsights?.currentSavings,
            monthlyIncome: mlInsights?.incomeMonthly,
            trajectoryScore: mlInsights?.moneyScore,
            goals: goals
          }}
        />
      )}

      {/* Floating Chatbot Button */}
      <FloatingChatbotButton 
        onClick={() => setShowChatbot(true)} 
        context="goals"
      />
    </div>
  )
}

export default Goals
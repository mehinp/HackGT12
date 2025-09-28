// src/pages/Goals.jsx - Updated with proper data fetching and chart
import { useState, useEffect } from 'react'
import { useGoalsContext } from '../hooks/Data Management Hooks/useGoalsContext'
import { useScoreContext } from '../hooks/Data Management Hooks/useScoreContext'
import { authService } from '../services/authService'
import Button from '../components/Button'
import GoalsList from '../components/Goals Components/GoalsList'
import GoalForm from '../components/Goals Components/GoalForm'
import ChatbotModal from '../components/chatbot/ChatbotModal'
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

  // Mock data from your JSON (replace with actual API call)
  const getChartData = () => {
    const goalCurve = [
      2491.408935546875, 2532.50244140625, 2574.017822265625, 2615.921142578125, 2658.177734375,
      2700.7509765625, 2743.603515625, 2786.69677734375, 2829.9912109375, 2873.446533203125,
      2917.0224609375, 2960.67724609375, 3004.36962890625, 3048.057861328125, 3091.700439453125,
      3135.25537109375, 3178.681884765625, 3221.939453125, 3264.987548828125, 3307.787109375,
      3350.300048828125, 3392.48876953125, 3434.3173828125, 3475.7509765625, 3516.75634765625,
      3557.30126953125, 3597.35546875, 3636.890625, 3675.87939453125, 3714.296630859375,
      3752.119140625, 3789.3251953125, 3825.895263671875, 3861.8115234375, 3897.057861328125,
      3931.6201171875, 3965.486083984375, 3998.645263671875, 4031.0888671875, 4062.809814453125,
      4093.802734375, 4124.06396484375, 4153.5908203125, 4182.3828125, 4210.44091796875,
      4237.7666015625, 4264.36376953125, 4290.23583984375, 4315.388671875, 4339.8291015625,
      4363.56494140625, 4386.603515625, 4408.955078125, 4430.62890625, 4451.6357421875,
      4471.98681640625, 4491.69384765625, 4510.76953125, 4529.22509765625, 4547.07470703125,
      4564.3310546875, 4581.00732421875, 4597.11767578125, 4612.67578125, 4627.69482421875,
      4642.189453125, 4656.1728515625, 4669.65966796875, 4682.66357421875, 4695.19775390625,
      4707.2763671875, 4718.91259765625, 4730.1201171875, 4740.91162109375, 4751.30078125,
      4761.2998046875, 4770.92138671875, 4780.177734375, 4789.08056640625, 4797.642578125,
      4805.875, 4813.78857421875, 4821.39501953125, 4828.70458984375, 4835.7275390625,
      4842.474609375, 4848.95556640625, 4855.1796875, 4861.15673828125, 4866.89599609375,
      4872.4052734375, 4877.69384765625, 4882.77001953125, 4887.6416015625, 4892.31640625,
      4896.8017578125, 4901.10498046875, 4905.2333984375, 4909.193359375, 4912.9912109375,
      4916.63427734375, 4920.12744140625, 4923.47705078125, 4926.68896484375, 4929.7685546875,
      4932.720703125, 4935.55126953125, 4938.26416015625, 4940.86474609375, 4943.357421875,
      4945.74609375, 4948.03564453125, 4950.22998046875, 4952.33251953125, 4954.34765625,
      4956.2783203125, 4958.1279296875, 4959.900390625, 4961.59814453125, 4963.22509765625
    ]
    
    const trajectory = [
      1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000,
      4200, 4400, 4600, 4800, 5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000,
      7200, 7400, 7600, 7800, 8000, 8200, 8400, 8600, 8800, 9000, 9200, 9400, 9600, 9800, 10000,
      10200, 10400, 10600, 10800, 11000, 11200, 11400, 11600, 11800, 12000, 12200, 12400, 12600,
      12800, 13000, 13200, 13400, 13600, 13800, 14000, 14200, 14400, 14600, 14800, 15000, 15200,
      15400, 15600, 15800, 16000, 16200, 16400, 16600, 16800, 17000, 17200, 17400, 17600, 17800,
      18000, 18200, 18400, 18600, 18800, 19000, 19200, 19400, 19600, 19800, 20000, 20200, 20400,
      20600, 20800, 21000, 21200, 21400, 21600, 21800, 22000, 22200, 22400, 22600, 22800, 23000,
      23200, 23400, 23600, 23800, 24000, 24200, 24400, 24600, 24800, 25000
    ]
    
    const data = []
    const maxLength = Math.min(goalCurve.length, trajectory.length)
    
    for (let i = 0; i < maxLength; i++) {
      data.push({
        day: i + 1,
        'Goal Curve': goalCurve[i],
        'Current Trajectory': trajectory[i]
      })
    }
    
    return data
  }

  const chartData = getChartData()

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
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Fetch goals when component mounts
  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
  try {
    setLoading(true)
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
    console.log('Goals API Response Headers:', [...response.headers.entries()])

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
    
    // Check if data has the expected structure
    if (!data || typeof data !== 'object') {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response format from goals API')
    }

    // Transform single goal from backend
    let transformedGoals = []
    
    if (data.goal) {
      console.log('Transforming single goal:', data.goal)
      const goal = data.goal
      
      const transformedGoal = {
        title: goal.title || `Goal ${goal.id}`,
        saved: parseFloat(goal.saved) || 0,
        endDate: new Date(goal.endDate)
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
  } finally {
    setLoading(false)
  }
}

  const handleGoalCreated = () => {
    // Refresh goals after creating a new one
    fetchGoals()
    setShowAddGoal(false)
  }

  const pageStyle = {
    padding: '1rem 0'
  }

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  }

  const titleSectionStyle = {
    flex: 1,
    minWidth: '300px'
  }

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: '#64748b',
    marginBottom: '1rem'
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

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '1.125rem',
    color: '#6b7280'
  }

  // Show loading state
  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <div style={titleSectionStyle}>
            <h1 style={titleStyle}>
              🎯 Financial Goals
            </h1>
            <p style={subtitleStyle}>
              Track your progress and achieve your financial dreams
            </p>
          </div>
        </div>

        <div style={mainContentStyle}>
          <div style={loadingStyle}>
            Loading your goals...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleSectionStyle}>
          <h1 style={titleStyle}>
            🎯 Financial Goals
          </h1>
          <p style={subtitleStyle}>
            Track your progress and achieve your financial dreams
          </p>
        </div>

        <div style={actionButtonsStyle}>
          <Button 
            variant="primary" 
            icon="➕"
            onClick={() => setShowAddGoal(true)}
          >
            Add New Goal
          </Button>
          <Button 
            variant="secondary" 
            icon="💬"
            onClick={() => setShowChatbot(true)}
          >
            Ask AI Assistant
          </Button>
          <Button 
            variant="outline" 
            icon="📊"
            onClick={fetchGoals}
          >
            Refresh Goals
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
            onClick={fetchGoals}
            style={{ marginLeft: '1rem' }}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Chart Section */}
      <div style={chartCardStyle}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            📈 Progress Visualization
          </h2>
          {currentScore && (
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginTop: '0.25rem'
            }}>
              Current Score: {Math.round(currentScore)}
            </p>
          )}
        </div>
        
        <div style={{ width: '100%', height: '400px' }}>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="Goal Curve"
                stroke="#3b82f6"
                strokeWidth={1}
                strokeOpacity = {0.6}
                dot={{ fill: '#3b82f6', strokeWidth: 1, r: 3 }}
                activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              />
              <Line
                type="monotone"
                dataKey="Current Trajectory"
                stroke="#10b981"
                strokeWidth={1}
                strokeOpacity = {0.6}
                dot={{ fill: '#10b981', strokeWidth: 1, r: 3 }}
                activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Goals List Section */}
      <div style={mainContentStyle}>
        <div style={{
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Your Goals ({goals?.length || 0})
          </h2>
        </div>
        
        <GoalsList goals={goals} onSelectGoal={setSelectedGoal} />
      </div>

      {/* Modals */}
      {showAddGoal && (
        <GoalForm 
          onClose={handleGoalCreated} 
          goal={selectedGoal}
        />
      )}

      {showChatbot && (
        <ChatbotModal 
          onClose={() => setShowChatbot(false)}
          context="goals"
        />
      )}
    </div>
  )
}

export default Goals
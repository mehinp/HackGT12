import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import Button from '../Button'

const PurchaseFilter = ({ onFilterChange }) => {
  const { darkMode } = useTheme()
  const [filters, setFilters] = useState({
    category: 'all',
    dateRange: 'all',
    amountRange: 'all',
    scoreImpact: 'all'
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange && onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: 'all',
      dateRange: 'all', 
      amountRange: 'all',
      scoreImpact: 'all'
    }
    setFilters(clearedFilters)
    onFilterChange && onFilterChange(clearedFilters)
  }

  const selectStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    backgroundColor: darkMode ? '#374151' : '#f8fafc',
    color: darkMode ? '#f8fafc' : '#1e293b',
    fontSize: '0.875rem',
    minWidth: '120px'
  }

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: '1rem',
      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
      borderRadius: '0.75rem',
      border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0'
    }}>
      <select
        value={filters.category}
        onChange={(e) => handleFilterChange('category', e.target.value)}
        style={selectStyle}
      >
        <option value="all">All Categories</option>
        <option value="food">Food & Dining</option>
        <option value="entertainment">Entertainment</option>
        <option value="transportation">Transportation</option>
        <option value="shopping">Shopping</option>
        <option value="bills">Bills & Utilities</option>
        <option value="investment">Investment</option>
        <option value="other">Other</option>
      </select>

      <select
        value={filters.dateRange}
        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
        style={selectStyle}
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="quarter">This Quarter</option>
        <option value="year">This Year</option>
      </select>

      <select
        value={filters.amountRange}
        onChange={(e) => handleFilterChange('amountRange', e.target.value)}
        style={selectStyle}
      >
        <option value="all">Any Amount</option>
        <option value="0-25">$0 - $25</option>
        <option value="25-100">$25 - $100</option>
        <option value="100-500">$100 - $500</option>
        <option value="500+">$500+</option>
      </select>

      <select
        value={filters.scoreImpact}
        onChange={(e) => handleFilterChange('scoreImpact', e.target.value)}
        style={selectStyle}
      >
        <option value="all">Any Impact</option>
        <option value="positive">Positive Impact</option>
        <option value="negative">Negative Impact</option>
        <option value="neutral">No Impact</option>
      </select>

      <Button
        variant="outline"
        size="sm"
        onClick={clearFilters}
      >
        🗑️ Clear
      </Button>
    </div>
  )
}

export default PurchaseFilter
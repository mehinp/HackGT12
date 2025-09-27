import { useState } from 'react'
import { usePurchasesContext } from '../hooks/usePurchasesContext'
import { useTheme } from '../context/ThemeContext'
import Button from '../components/Button'
import Input from '../components/Input'
import PurchasesList from '../components/PurchasesList'
import PurchaseFilter from '../components/PurchaseFilter'
import PurchaseStats from '../components/PurchaseStats'

const Purchases = () => {
  const { purchases } = usePurchasesContext()
  const { darkMode } = useTheme()
  const [showAddPurchase, setShowAddPurchase] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  // Mock data if no purchases
  const mockPurchases = [
    {
      id: 1,
      merchant: 'Whole Foods Market',
      amount: 87.45,
      category: 'food',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      description: 'Weekly grocery shopping',
      scoreImpact: -4,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      merchant: 'Netflix',
      amount: 15.99,
      category: 'entertainment',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      description: 'Monthly subscription',
      scoreImpact: -2,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 3,
      merchant: 'Robinhood',
      amount: 500.00,
      category: 'investment',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      description: 'Monthly investment contribution',
      scoreImpact: +15,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      merchant: 'Shell Gas Station',
      amount: 52.30,
      category: 'transportation',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      description: 'Gas fill-up',
      scoreImpact: -3,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      id: 5,
      merchant: 'Amazon',
      amount: 124.99,
      category: 'shopping',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      description: 'Bluetooth headphones',
      scoreImpact: -8,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 6,
      merchant: 'Electric Company',
      amount: 145.67,
      category: 'bills',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: 'Monthly electricity bill',
      scoreImpact: 0,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: 7,
      merchant: 'Starbucks',
      amount: 6.75,
      category: 'food',
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      description: 'Morning coffee',
      scoreImpact: -1,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      id: 8,
      merchant: 'Movie Theater',
      amount: 28.50,
      category: 'entertainment',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      description: 'Movie tickets for two',
      scoreImpact: -3,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ]

  const currentPurchases = purchases || mockPurchases

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
    color: darkMode ? '#f8fafc' : '#1e293b',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }

  const subtitleStyle = {
    fontSize: '1.125rem',
    color: darkMode ? '#94a3b8' : '#64748b',
    marginBottom: '1rem'
  }

  const actionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  }

  const filtersRowStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: darkMode ? '0 2px 4px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.07)'
  }

  const contentGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '2rem',
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr'
    }
  }

  const mainContentStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.07)'
  }

  const sidebarStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.07)',
    height: 'fit-content'
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

  // Filter purchases based on current filters
  const filteredPurchases = currentPurchases.filter(purchase => {
    const matchesSearch = purchase.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || purchase.category === selectedCategory
    
    // Date filtering logic would go here
    const matchesDateRange = true // Simplified for now
    
    return matchesSearch && matchesCategory && matchesDateRange
  })

  // Sort purchases
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date) - new Date(a.date)
      case 'amount':
        return b.amount - a.amount
      case 'merchant':
        return a.merchant.localeCompare(b.merchant)
      case 'impact':
        return b.scoreImpact - a.scoreImpact
      default:
        return 0
    }
  })

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleSectionStyle}>
          <h1 style={titleStyle}>
            🛒 Purchase History
          </h1>
          <p style={subtitleStyle}>
            Track and analyze all your spending in one place
          </p>
        </div>

        <div style={actionButtonsStyle}>
          <Button 
            variant="primary" 
            icon="➕"
            onClick={() => setShowAddPurchase(true)}
          >
            Add Purchase
          </Button>
          <Button 
            variant="secondary" 
            icon="📊"
          >
            Export Data
          </Button>
          <Button 
            variant="outline" 
            icon="📈"
          >
            View Analytics
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div style={filtersRowStyle}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Input
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="🔍"
          />
        </div>

        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={selectStyle}
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="merchant">Sort by Merchant</option>
          <option value="impact">Sort by Impact</option>
        </select>
      </div>

      {/* Main Content */}
      <div style={contentGridStyle}>
        {/* Purchases List */}
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
              color: darkMode ? '#f8fafc' : '#1e293b'
            }}>
              Recent Transactions
            </h2>
            <div style={{
              fontSize: '0.875rem',
              color: darkMode ? '#9ca3af' : '#6b7280'
            }}>
              {sortedPurchases.length} purchases found
            </div>
          </div>
          
          <PurchasesList purchases={sortedPurchases} />
        </div>

        {/* Sidebar with Stats */}
        <div style={sidebarStyle}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: darkMode ? '#f8fafc' : '#1e293b',
            marginBottom: '1rem'
          }}>
            📊 Purchase Analytics
          </h3>
          
          <PurchaseStats purchases={currentPurchases} />
        </div>
      </div>

      {/* Add Purchase Modal */}
      {showAddPurchase && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: darkMode ? '#f8fafc' : '#1e293b',
              marginBottom: '1.5rem'
            }}>
              Add New Purchase
            </h3>
            
            {/* Add Purchase Form would go here */}
            <div style={{ marginBottom: '1rem' }}>
              <Input label="Merchant" placeholder="Enter merchant name" />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Input label="Amount" type="number" placeholder="0.00" />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <select style={{
                ...selectStyle,
                width: '100%',
                padding: '0.75rem'
              }}>
                <option>Select Category</option>
                <option value="food">Food & Dining</option>
                <option value="entertainment">Entertainment</option>
                <option value="transportation">Transportation</option>
                <option value="shopping">Shopping</option>
                <option value="bills">Bills & Utilities</option>
                <option value="investment">Investment</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <Input label="Description" placeholder="Optional description" />
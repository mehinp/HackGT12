// src/components/Purchases Components/PurchaseForm.jsx
import { useState } from 'react'
import Button from '../Button'
import Input from '../Input'

const PurchaseForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    merchant: '',
    amount: '',
    category: 'groceries'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { value: 'groceries', label: 'Groceries' },
    { value: 'rent', label: 'Rent' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'restaurants', label: 'Restaurants' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.merchant || !formData.amount) {
      setError('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    setIsSubmitting(true)

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        setError('User not authenticated. Please log in again.')
        return
      }

      const response = await fetch('http://143.215.104.239:8080/purchase/record', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify({
          merchant: formData.merchant,
          amount: parseFloat(formData.amount),
          category: formData.category
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to record purchase')
      }

      const result = await response.json()
      console.log('Purchase recorded:', result)
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to record purchase')
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalStyle = {
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
  }

  const formContainerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    border: '1px solid #e2e8f0',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
  }

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem'
  }

  const selectStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    fontSize: '1rem'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#374151',
    fontSize: '0.875rem'
  }

  const errorStyle = {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #fecaca',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  }

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={formContainerStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={titleStyle}>
          Add New Purchase
        </h3>
        
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Merchant"
              placeholder="Enter merchant name"
              value={formData.merchant}
              onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              style={selectStyle}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <Button 
              type="button"
              variant="secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording...' : 'Add Purchase'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PurchaseForm
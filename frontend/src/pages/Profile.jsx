// src/pages/Profile.jsx
import { useState } from 'react'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import Button from '../components/Button'
import Input from '../components/Input'

const Profile = () => {
  const { user } = useAuthContext()
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  // Profile form state
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || ''
  })

  // Income form state
  const [incomeData, setIncomeData] = useState({
    monthlyIncome: user?.income || '',
    monthlyExpenditures: user?.expenditures || ''
  })

  // Security form state
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [securityMessage, setSecurityMessage] = useState(null)

  // Notification settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weeklySummary: true,
    goalAlerts: true
  })

  const pageStyle = { padding: '1rem 0' }
  const headerStyle = { marginBottom: '2rem' }
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
    color: '#64748b'
  }
  const tabsStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
    overflowX: 'auto'
  }
  const tabStyle = (isActive) => ({
    padding: '1rem 1.5rem',
    backgroundColor: isActive ? '#f8fafc' : 'transparent',
    color: isActive ? '#1e293b' : '#6b7280',
    border: 'none',
    borderRadius: '0.5rem 0.5rem 0 0',
    cursor: 'pointer',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    borderBottom: isActive ? '2px solid #3b82f6' : 'none'
  })
  const contentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
  }

  const tabs = [
    { id: 'profile', label: '👤 Personal Info' },
    { id: 'income', label: '💰 Income & Expenditures' },
    { id: 'security', label: '🔒 Security' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'account', label: '⚙️ Account' }
  ]

  const handleProfileSave = () => {
    // Mock save functionality
    setIsEditing(false)
  }

  const handleIncomeUpdate = () => {
    // Mock update functionality
    console.log('Income updated:', incomeData)
  }

  const handlePasswordChange = () => {
    if (securityData.newPassword.length < 8) {
      setSecurityMessage('Password must be at least 8 characters.')
      return
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityMessage('New passwords do not match.')
      return
    }
    setSecurityMessage('Password updated successfully!')
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Personal Information
              </h3>
              <Button
                variant={isEditing ? 'primary' : 'secondary'}
                onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
              >
                {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                disabled={!isEditing}
              />
              
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                disabled={!isEditing}
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                disabled={true}
              />
            </div>
          </div>
        )

      case 'income':
        return (
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '2rem'
            }}>
              Income & Expenditures
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <Input
                label="Monthly Income ($)"
                type="number"
                step="0.01"
                min="0.01"
                value={incomeData.monthlyIncome}
                onChange={(e) => setIncomeData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
              />
              
              <Input
                label="Monthly Expenditures ($)"
                type="number"
                step="0.01"
                min="0.01"
                value={incomeData.monthlyExpenditures}
                onChange={(e) => setIncomeData(prev => ({ ...prev, monthlyExpenditures: e.target.value }))}
              />
            </div>

            <Button variant="primary" onClick={handleIncomeUpdate}>
              Update Financial Information
            </Button>
          </div>
        )

      case 'security':
        return (
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '2rem'
            }}>
              Security Settings
            </h3>

            <div style={{
              display: 'grid',
              gap: '1rem',
              maxWidth: '420px',
              marginBottom: '2rem'
            }}>
              <Input
                label="Current Password"
                type="password"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
              
              <Input
                label="New Password"
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>

            <Button variant="primary" onClick={handlePasswordChange}>
              Update Password
            </Button>

            {securityMessage && (
              <div style={{
                marginTop: '1rem',
                fontSize: '0.875rem',
                color: securityMessage.includes('successfully') ? '#10b981' : '#ef4444'
              }}>
                {securityMessage}
              </div>
            )}
          </div>
        )

      case 'notifications':
        return (
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '2rem'
            }}>
              Notification Settings
            </h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {[
                ['email', 'Email notifications'],
                ['push', 'Push notifications'],
                ['weeklySummary', 'Weekly summary'],
                ['goalAlerts', 'Goal progress alerts'],
              ].map(([key, label]) => (
                <label key={key} style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={!!notifications[key]}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ color: '#1e293b' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'account':
        return (
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              Account Settings
            </h3>

            {/* Account Overview */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.75rem',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '60px', height: '60px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  👤
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                    {user?.name || `${formData.firstName} ${formData.lastName}`.trim() || 'User Name'}
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#fef2f2',
              borderRadius: '0.75rem',
              border: '1px solid #fecaca'
            }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#dc2626', marginBottom: '1rem' }}>
                ⚠️ Danger Zone
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h5 style={{ fontSize: '1rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.25rem' }}>
                    Delete Account
                  </h5>
                  <p style={{ fontSize: '0.875rem', color: '#7f1d1d' }}>
                    Permanently delete your account and all data. This cannot be undone.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDeleteAccount(true)}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>⚙️ Settings & Profile</h1>
        <p style={subtitleStyle}>Manage your account, privacy, and preferences</p>
      </div>

      {/* Tabs */}
      <div style={tabsStyle}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabStyle(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {renderTabContent()}
      </div>

      {/* Delete modal could go here based on showDeleteAccount */}
    </div>
  )
}

export default Profile
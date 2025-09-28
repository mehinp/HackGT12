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

  const pageStyle = { 
    padding: '1.5rem',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  }

  const tabsStyle = {
    display: 'flex',
    gap: '0',
    marginBottom: '2rem',
    borderBottom: '1px solid #e2e8f0',
    overflowX: 'auto'
  }

  const tabStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    color: isActive ? '#3b82f6' : '#6b7280',
    border: 'none',
    cursor: 'pointer',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  })

  const contentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  }

  const fieldContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    marginBottom: '0.75rem'
  }

  const labelStyle = {
    fontSize: '0.75rem',
    color: '#6b7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem'
  }

  const valueStyle = {
    fontWeight: '600',
    color: '#1f2937',
    fontSize: '0.875rem'
  }

  // Fixed SVG icon style
  const iconStyle = {
    width: '16px',
    height: '16px',
    color: '#6b7280',
    flexShrink: 0
  }

  const tabs = [
    { id: 'profile', label: 'Personal Info'},
    { id: 'income', label: 'Income & Expenditures' },
    { id: 'security', label: 'Security'},
    { id: 'notifications', label: 'Notifications' },
    { id: 'account', label: 'Account'}
  ]

  const handleProfileSave = () => {
    setIsEditing(false)
  }

  const handleIncomeUpdate = () => {
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
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                Personal Information
              </h3>
              <Button
                variant={isEditing ? 'primary' : 'secondary'}
                onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={fieldContainerStyle}>
                <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>FIRST NAME</div>
                  {isEditing ? (
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.875rem' }}
                    />
                  ) : (
                    <div style={valueStyle}>{formData.firstName}</div>
                  )}
                </div>
              </div>

              <div style={fieldContainerStyle}>
                <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>LAST NAME</div>
                  {isEditing ? (
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.875rem' }}
                    />
                  ) : (
                    <div style={valueStyle}>{formData.lastName}</div>
                  )}
                </div>
              </div>

              <div style={fieldContainerStyle}>
                <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>EMAIL</div>
                  <div style={valueStyle}>{formData.email}</div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'income':
        return (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '2rem'
            }}>
              Income & Expenditures
            </h3>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div style={fieldContainerStyle}>
                <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>MONTHLY INCOME ($)</div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={incomeData.monthlyIncome}
                    onChange={(e) => setIncomeData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                    style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={fieldContainerStyle}>
                <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>MONTHLY EXPENDITURES ($)</div>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={incomeData.monthlyExpenditures}
                    onChange={(e) => setIncomeData(prev => ({ ...prev, monthlyExpenditures: e.target.value }))}
                    style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.875rem' }}
                  />
                </div>
              </div>
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
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '2rem'
            }}>
              Security Settings
            </h3>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
              <div style={fieldContainerStyle}>
                <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>CURRENT PASSWORD</div>
                  <Input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={fieldContainerStyle}>
                <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>NEW PASSWORD</div>
                  <Input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                    style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={fieldContainerStyle}>
                <svg style={iconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={labelStyle}>CONFIRM NEW PASSWORD</div>
                  <Input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    style={{ margin: 0, border: 'none', padding: 0, fontSize: '0.875rem' }}
                  />
                </div>
              </div>
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
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '2rem'
            }}>
              Notification Settings
            </h3>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {[
                ['email', 'Email notifications'],
                ['push', 'Push notifications'],
                ['weeklySummary', 'Weekly summary'],
                ['goalAlerts', 'Goal progress alerts'],
              ].map(([key, label]) => (
                <label key={key} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '0.75rem',
                  backgroundColor: notifications[key] ? '#fef3f2' : '#ffffff',
                  border: `1px solid ${notifications[key] ? '#fecaca' : '#e2e8f0'}`,
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={!!notifications[key]}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    style={{ 
                      cursor: 'pointer',
                      accentColor: '#3b82f6'
                    }}
                  />
                  <span style={{ 
                    color: '#1f2937',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}>
                    {notifications[key] && '🔸 '}
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'account':
        return (
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '2rem'
            }}>
              Account Settings
            </h3>

            {/* User Overview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              marginBottom: '2rem'
            }}>
              <svg style={{ width: '16px', height: '16px', color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <div style={labelStyle}>USER EMAIL</div>
                <div style={valueStyle}>{user?.email || formData.email || 'rizz@gmail.com'}</div>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#fef2f2',
              borderRadius: '0.75rem',
              border: '1px solid #fecaca'
            }}>
              <h4 style={{ 
                fontSize: '0.875rem', 
                fontWeight: '700', 
                color: '#dc2626', 
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ⚠️ DANGER ZONE
              </h4>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                flexWrap: 'wrap', 
                gap: '1rem' 
              }}>
                <div>
                  <h5 style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#dc2626', 
                    marginBottom: '0.25rem' 
                  }}>
                    Delete Account
                  </h5>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#7f1d1d',
                    margin: 0
                  }}>
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
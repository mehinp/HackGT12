import { useState } from 'react'
import { useAuthContext } from '../hooks/Authentication hooks/useAuthContext'
import { useTheme } from '../context/ThemeContext'
import Button from '../components/Button'
import Input from '../components/Input'
import ProfileForm from '../components/Profile Components/ProfileForm'
import IncomeSettings from '../components/Profile Components/IncomeSettings'
import SecuritySettings from '../components/Profile Components/SecuritySettings'
import NotificationSettings from '../components/Profile Components/NotificationSettings'

const Profile = () => {
  const { user } = useAuthContext()
  const { darkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)

  const pageStyle = { padding: '1rem 0' }
  const headerStyle = { marginBottom: '2rem' }
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
    color: darkMode ? '#94a3b8' : '#64748b'
  }
  const tabsStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    borderBottom: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
    overflowX: 'auto'
  }
  const tabStyle = (isActive) => ({
    padding: '1rem 1.5rem',
    backgroundColor: isActive ? (darkMode ? '#374151' : '#f8fafc') : 'transparent',
    color: isActive ? (darkMode ? '#f8fafc' : '#1e293b') : (darkMode ? '#9ca3af' : '#6b7280'),
    border: 'none',
    borderRadius: '0.5rem 0.5rem 0 0',
    cursor: 'pointer',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    borderBottom: isActive ? `2px solid #3b82f6` : 'none'
  })
  const contentStyle = {
    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    border: darkMode ? '1px solid #374151' : '1px solid #e2e8f0',
    boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.07)'
  }

  const tabs = [
    { id: 'profile', label: '👤 Personal Info' },
    { id: 'income', label: '💰 Income & Job' },
    { id: 'security', label: '🔒 Security' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'account', label: '⚙️ Account' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileForm />
      case 'income':
        return <IncomeSettings />
      case 'security':
        return <SecuritySettings />
      case 'notifications':
        return <NotificationSettings />
      case 'account':
        return (
          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: darkMode ? '#f8fafc' : '#1e293b',
              marginBottom: '1rem'
            }}>
              Account Settings
            </h3>

            {/* Account Overview */}
            <div style={{
              padding: '1.5rem',
              backgroundColor: darkMode ? '#374151' : '#f8fafc',
              borderRadius: '0.75rem',
              marginBottom: '2rem',
              border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '60px', height: '60px',
                  backgroundColor: darkMode ? '#4b5563' : '#e2e8f0',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  👤
                </div>
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '600', color: darkMode ? '#f8fafc' : '#1e293b', marginBottom: '0.25rem' }}>
                    {user?.name || 'User Name'}
                  </h4>
                  <p style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '0.875rem' }}>
                    {user?.email || 'user@example.com'}
                  </p>
                  <p style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '0.75rem' }}>
                    Account created: January 2024
                  </p>
                </div>
              </div>
            </div>

            {/* Data Management */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: darkMode ? '#f8fafc' : '#1e293b', marginBottom: '1rem' }}>
                📊 Data Management
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: darkMode ? '#374151' : '#f8fafc',
                  borderRadius: '0.5rem',
                  border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
                }}>
                  <h5 style={{ fontSize: '1rem', fontWeight: '600', color: darkMode ? '#f8fafc' : '#1e293b', marginBottom: '0.5rem' }}>
                    Export Data
                  </h5>
                  <p style={{ fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: '1rem' }}>
                    Download all your financial data
                  </p>
                  <Button variant="outline" size="sm">📥 Export</Button>
                </div>

                <div style={{
                  padding: '1rem',
                  backgroundColor: darkMode ? '#374151' : '#f8fafc',
                  borderRadius: '0.5rem',
                  border: darkMode ? '1px solid #4b5563' : '1px solid #e2e8f0'
                }}>
                  <h5 style={{ fontSize: '1rem', fontWeight: '600', color: darkMode ? '#f8fafc' : '#1e293b', marginBottom: '0.5rem' }}>
                    Import Data
                  </h5>
                  <p style={{ fontSize: '0.875rem', color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: '1rem' }}>
                    Import from bank or other apps
                  </p>
                  <Button variant="outline" size="sm">📤 Import</Button>
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

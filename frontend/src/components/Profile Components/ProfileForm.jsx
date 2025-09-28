import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuthContext } from '../../hooks/Authentication hooks/useAuthContext'
import Button from '../Button'
import Input from '../Input'

const ProfileForm = () => {
  const { darkMode } = useTheme()
  const { user, dispatch } = useAuthContext()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  })

  const handleSave = () => {
    // Mock save functionality
    dispatch({ 
      type: 'UPDATE_USER', 
      payload: { 
        ...user, 
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        bio: formData.bio
      }
    })
    setIsEditing(false)
  }

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
          color: darkMode ? '#f8fafc' : '#1e293b'
        }}>
          Personal Information
        </h3>
        <Button
          variant={isEditing ? 'primary' : 'secondary'}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
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
          disabled={true} // Email usually can't be changed
        />
        
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          disabled={!isEditing}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: darkMode ? '#f8fafc' : '#374151'
        }}>
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          disabled={!isEditing}
          placeholder="Tell us about yourself..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.75rem',
            border: `1px solid ${darkMode ? '#374151' : '#e2e8f0'}`,
            borderRadius: '0.5rem',
            backgroundColor: isEditing ? (darkMode ? '#374151' : '#ffffff') : (darkMode ? '#1e293b' : '#f8fafc'),
            color: darkMode ? '#f8fafc' : '#1e293b',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>
    </div>
  )
}

export default ProfileForm
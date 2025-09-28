import { useTheme } from '../context/ThemeContext'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  const { darkMode } = useTheme()

  const layoutStyle = {
    minHeight: '100vh',
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    color: darkMode ? '#f8fafc' : '#1e293b'
  }

  const mainStyle = {
    minHeight: 'calc(100vh - 80px)', // Account for navbar height
    padding: '2rem 0'
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem'
  }

  return (
    <div style={layoutStyle}>
      <Navbar />
      <main style={mainStyle}>
        <div style={containerStyle}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
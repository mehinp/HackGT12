import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import { ThemeContextProvider } from './context/ThemeContext'
import { PurchasesContextProvider } from './context/PurchasesContext'
import { GoalsContextProvider } from './context/GoalsContext'
import { SocialContextProvider } from './context/SocialContext'
import { ScoreContextProvider } from './context/ScoreContext'
import { useAuthContext } from "./hooks/Authentication hooks/useAuthContext.js";


import Layout from './components/Layout'
import Home from './pages/Home'
import Goals from './pages/Goals'
import Purchases from './pages/Purchases'
import Social from './pages/Social'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <AuthContextProvider>
      <ThemeContextProvider>
        <AppContent />
      </ThemeContextProvider>
    </AuthContextProvider>
  )
}

function AppContent() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      {user ? (
        <PurchasesContextProvider>
          <GoalsContextProvider>
            <SocialContextProvider>
              <ScoreContextProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/purchases" element={<Purchases />} />
                    <Route path="/social" element={<Social />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Layout>
              </ScoreContextProvider>
            </SocialContextProvider>
          </GoalsContextProvider>
        </PurchasesContextProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  )
}

export default App
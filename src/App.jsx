import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import AccountTypeSelection from './components/AccountTypeSelection'
import Dashboard from './components/Dashboard'
import ExchangeSuccess from './components/ExchangeSuccess'
import VipTrading from './components/VipTrading'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/account-type" element={<AccountTypeSelection />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/exchange-success" 
          element={
            <ProtectedRoute>
              <ExchangeSuccess />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vip-trading" 
          element={
            <ProtectedRoute>
              <VipTrading />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App

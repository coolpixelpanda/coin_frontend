import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import AccountTypeSelection from './components/AccountTypeSelection'
import Dashboard from './components/Dashboard'
import ExchangeSuccess from './components/ExchangeSuccess'
import VipTrading from './components/VipTrading'
import ProtectedRoute from './components/ProtectedRoute'
import PrivacyPolicy from './components/PrivacyPolicy'
import UserAgreements from './components/UserAgreements'
import TermsOfService from './components/TermsOfService'
import Support from './components/Support'
import Contact from './components/Contact'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/account-type" element={<AccountTypeSelection />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/user-agreements" element={<UserAgreements />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/support" element={<Support />} />
        <Route path="/contact" element={<Contact />} />
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
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App

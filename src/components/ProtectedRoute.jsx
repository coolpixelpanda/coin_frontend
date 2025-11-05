import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // TEMPORARY: Bypass authentication - backend is down for testing
  // TODO: Remove this bypass when backend is back up
  // Uncomment the code below to restore authentication checks
  
  // Show loading state while checking authentication
  // if (loading) {
  //   return (
  //     <div style={{
  //       minHeight: '100vh',
  //       display: 'flex',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       backgroundColor: '#f9fafb'
  //     }}>
  //       <div>Loading...</div>
  //     </div>
  //   )
  // }

  // Redirect to sign in if not authenticated
  // if (!isAuthenticated) {
  //   return <Navigate to="/signin" replace />
  // }

  // Render protected component if authenticated
  return children
}

export default ProtectedRoute


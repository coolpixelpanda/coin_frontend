import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    // Use sessionStorage instead of localStorage so session expires when tab closes
    const token = sessionStorage.getItem('token')
    const userData = sessionStorage.getItem('user')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      console.log('AuthContext - Full login response:', response)
      
      const { User_id, Total_amount } = response
      
      // Create user object from API response
      const userData = {
        id: User_id,
        username: credentials.username || '',
        email: credentials.email,
        total_amount: Total_amount
      }
      
      // Extract token from API response (check multiple possible field names)
      const authToken = response.token || 
                       response.accessToken || 
                       response.access_token ||
                       response.Token ||
                       response.AccessToken ||
                       response.Access_Token
      
      // If no token is provided by backend, generate a session token based on User_id
      // This allows the app to work even if backend doesn't return tokens
      const sessionToken = authToken || `session-${User_id}-${Date.now()}`
      
      sessionStorage.setItem('token', sessionToken)
      sessionStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      console.error('AuthContext - Login error:', error)
      console.error('AuthContext - Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      // Only allow login if user exists in database
      // If API returns error, user doesn't exist
      return { 
        success: false, 
        error: error.response?.data?.message || 
               error.response?.data?.error || 
               error.message || 
               'Invalid credentials or user does not exist. Please sign up first.' 
      }
    }
  }

  const register = async (userData) => {
    console.log('AuthContext - Register called with:', userData)
    try {
      const response = await authAPI.register(userData)
      console.log('AuthContext - Register API response:', response)
      
      // If API call succeeds but doesn't return user data, handle gracefully
      // In a real app, the API should return the created user
      
      // Return success - user is now in database
      return { success: true }
    } catch (error) {
      console.error('AuthContext - Registration error:', error)
      
      // Check if error is because user already exists
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || ''
      
      if (errorMessage.toLowerCase().includes('already exist') || 
          errorMessage.toLowerCase().includes('duplicate') ||
          error.response?.status === 409) {
        // User already exists - this is okay, we'll try to login
        return { 
          success: false, 
          error: 'User already exists',
          userExists: true
        }
      }
      
      // If registration fails for other reasons, return error
      return { 
        success: false, 
        error: errorMessage || 'Registration failed. Please try again.' 
      }
    }
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

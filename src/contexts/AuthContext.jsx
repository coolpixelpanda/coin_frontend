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
  // TEMPORARY: Set default user for testing when backend is down
  // TODO: Remove this default user when backend is back up
  const [user, setUser] = useState({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    total_amount: 10001
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // TEMPORARY: Commented out for testing - backend is down
    // TODO: Uncomment when backend is back up
    
    // Check if user is logged in on app start
    // Use sessionStorage instead of localStorage so session expires when tab closes
    // const token = sessionStorage.getItem('token')
    // const userData = sessionStorage.getItem('user')
    // 
    // if (token && userData) {
    //   try {
    //     setUser(JSON.parse(userData))
    //   } catch (error) {
    //     sessionStorage.removeItem('token')
    //     sessionStorage.removeItem('user')
    //   }
    // }
    // setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const { User_id, Total_amount } = response
      
      // Create user object from API response
      const userData = {
        id: User_id,
        username: credentials.username,
        email: credentials.email,
        total_amount: Total_amount
      }
      
      sessionStorage.setItem('token', 'mock-token')
      sessionStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      console.error('AuthContext - Login error:', error)
      
      // Only allow login if user exists in database
      // If API returns error, user doesn't exist
      return { 
        success: false, 
        error: 'Invalid credentials or user does not exist. Please sign up first.' 
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
      
      // If registration fails, return error
      return { 
        success: false, 
        error: 'Registration failed. User may already exist or there was a server error.' 
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

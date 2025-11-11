import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    setError('')

    const result = await login(formData)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#ffffff',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Sign in to your account
          </h2>
          <p style={{ color: '#6b7280' }}>
            Access your cryptocurrency dashboard
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '1.5rem'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {error && (
              <div style={{ 
                backgroundColor: '#f9fafb',
                border: '1px solid #9ca3af',
                color: '#111827',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}>
                {error}
              </div>
            )}
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                style={{
                  width: '100%',
                  height: '2.5rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                style={{
                  width: '100%',
                  height: '2.5rem',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  style={{
                    width: '100%',
                    height: '2.5rem',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                Remember me
              </label>
              <a href="#" style={{ fontSize: '0.875rem', color: '#000000', textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '2.75rem',
                backgroundColor: loading ? '#9ca3af' : '#000000',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#1a1a1a'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#000000'
              }}
              onMouseDown={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#333333'
              }}
              onMouseUp={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#1a1a1a'
              }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#000000', textDecoration: 'none', fontWeight: '500' }}>
                  Sign up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn
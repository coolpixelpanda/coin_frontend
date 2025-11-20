import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff } from 'lucide-react'

const SignUp = () => {
  const [searchParams] = useSearchParams()
  const accountType = searchParams.get('accountType') || 'personal'
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: accountType
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('SignUp - Form submitted with:', formData)
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    console.log('SignUp - Calling register with:', {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      accountType: formData.accountType
    })

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password,
      accountType: formData.accountType
    })
    
    console.log('SignUp - Register result:', result)
    
    if (result.success) {
      console.log('SignUp - Registration successful, navigating to sign in')
      // Show success message and redirect to sign in
      setSuccess('Registration successful! Please sign in with your credentials.')
      setTimeout(() => {
        navigate('/signin')
      }, 1500)
    } else {
      console.log('SignUp - Registration failed:', result.error)
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
            fontWeight: '400', 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Create your {accountType} account
          </h2>
          <p style={{ color: '#6b7280' }}>
            Start trading cryptocurrencies today
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
            
            {success && (
              <div style={{ 
                backgroundColor: '#f9fafb',
                border: '1px solid #9ca3af',
                color: '#111827',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}>
                {success}
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
                placeholder="Choose a username"
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
                  placeholder="Create a password"
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

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
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
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
              <input type="checkbox" required style={{ marginRight: '0.5rem' }} />
              I agree to the{' '}
              <a href="#" style={{ color: '#00CDCB', textDecoration: 'none' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#00CDCB', textDecoration: 'none' }}>Privacy Policy</a>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '2.75rem',
                backgroundColor: loading ? '#9ca3af' : '#00CDCB',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(0, 205, 203, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#00B8B6'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#00CDCB'
              }}
              onMouseDown={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#333333'
              }}
              onMouseUp={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#1a1a1a'
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                to="/account-type"
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                ← Back
              </Link>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Already have an account?{' '}
                <Link to="/signin" style={{ color: '#00CDCB', textDecoration: 'none', fontWeight: '500' }}>
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp
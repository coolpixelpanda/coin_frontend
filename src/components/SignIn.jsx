import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Key, Mail } from 'lucide-react'

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswordField, setShowPasswordField] = useState(false)
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)
  
  const { login, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  const handleChange = (e) => {
    const value = e.target.value
    setFormData({
      ...formData,
      [e.target.name]: value,
    })
    setError('')
    
    // Reset password field if email is cleared
    if (e.target.name === 'email' && value.length === 0) {
      setShowPasswordField(false)
    }
  }

  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter' && formData.email && !showPasswordField) {
      e.preventDefault()
      setShowPasswordField(true)
      setTimeout(() => {
        passwordInputRef.current?.focus()
      }, 100)
    }
  }

  const handlePasskeySignIn = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Passkey can work without email, but we'll use it if provided
      const emailToUse = formData.email || 'user@example.com'

      // Request passkey authentication
      // This will trigger the Windows Security dialog
      // When deployed to CEX-USA.com domain, Windows will display "Passkey for CEX-USA.com"
      const publicKeyCredentialRequestOptions = {
        challenge: Uint8Array.from(
          `CEX-USA-${emailToUse}-${Date.now()}`,
          c => c.charCodeAt(0)
        ),
        allowCredentials: [],
        // rpId must match the domain (without protocol, lowercase)
        // For production: use 'cex-usa.com' when deployed to that domain
        // Windows Security will automatically display "Passkey for CEX-USA.com" based on rpId
        rpId: window.location.hostname.replace(/^www\./, '') || 'localhost',
        userVerification: 'required',
        timeout: 60000,
      }

      // Request authentication
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      })

      if (assertion) {
        // Convert assertion to base64 for sending to backend
        const assertionData = {
          id: assertion.id,
          rawId: Array.from(new Uint8Array(assertion.rawId)),
          response: {
            authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData)),
            clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON)),
            signature: Array.from(new Uint8Array(assertion.response.signature)),
            userHandle: assertion.response.userHandle ? Array.from(new Uint8Array(assertion.response.userHandle)) : null,
          },
          type: assertion.type,
        }

        // Attempt login with passkey
        const result = await login({
          username: '',
          email: emailToUse,
          password: '',
          passkeyAssertion: assertionData
        })

        if (result.success) {
          navigate('/dashboard')
        } else {
          setError(result.error || 'Passkey authentication failed')
        }
      }
    } catch (error) {
      console.error('Passkey authentication error:', error)
      if (error.name === 'NotAllowedError') {
        setError('Passkey authentication was cancelled or not available.')
      } else if (error.name === 'NotSupportedError') {
        setError('Passkey authentication is not supported on this device.')
      } else {
        setError('Passkey authentication failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!formData.email) {
      setError('Please enter your email')
      return
    }

    if (!showPasswordField) {
      setShowPasswordField(true)
      setTimeout(() => {
        passwordInputRef.current?.focus()
      }, 100)
      return
    }
    
    if (!formData.password) {
      setError('Please enter your password')
      return
    }
    
    setLoading(true)
    setError('')

    const result = await login({
      username: '', // No username needed
      email: formData.email,
      password: formData.password
    })
    
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
            fontWeight: '400', 
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
                backgroundColor: '#fef2f2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
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
                Email address
              </label>
              <input
                ref={emailInputRef}
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
                onKeyDown={handleEmailKeyDown}
                autoComplete="email"
              />
            </div>

            {/* Auth Options - Always show (even when email is empty) */}
            {!showPasswordField && (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}>
                <button
                  type="button"
                  onClick={handlePasskeySignIn}
                  disabled={loading}
                  style={{
                    width: '100%',
                    height: '2.75rem',
                    backgroundColor: loading ? '#9ca3af' : '#00CDCB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(0, 205, 203, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#00B8B6'
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#00CDCB'
                  }}
                >
                  <Key size={18} />
                  Sign in with Passkey
                </button>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  margin: '0.5rem 0'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordField(true)
                    setTimeout(() => {
                      passwordInputRef.current?.focus()
                    }, 100)
                  }}
                  style={{
                    width: '100%',
                    height: '2.75rem',
                    backgroundColor: 'transparent',
                    color: '#000000',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.borderColor = '#9ca3af'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#d1d5db'
                  }}
                >
                  <Mail size={18} />
                  Continue with password
                </button>
              </div>
            )}

            {/* Password Field - Show only after email is entered and Enter is pressed */}
            {showPasswordField && (
              <div style={{ animation: 'fadeIn 0.3s ease-in' }}>
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
                    ref={passwordInputRef}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required={showPasswordField}
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e)
                      }
                    }}
                    autoComplete="current-password"
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
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                Remember me
              </label>
              <a href="#" style={{ fontSize: '0.875rem', color: '#00CDCB', textDecoration: 'none' }}>
                Forgot password?
              </a>
            </div>

            {/* Sign in button - Show only when password field is visible */}
            {showPasswordField && (
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
                  if (!loading) e.currentTarget.style.backgroundColor = '#00A3A1'
                }}
                onMouseUp={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#00B8B6'
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            )}


            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{ color: '#00CDCB', textDecoration: 'none', fontWeight: '500' }}>
                  Sign up
                </Link>
              </span>
            </div>

            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>
              Not your device? Use a private window. See our{' '}
              <Link 
                to="/privacy-policy" 
                target="_blank"
                style={{ color: '#00CDCB', textDecoration: 'underline' }}
              >
                Privacy Policy
              </Link>
              {' '}for more info.
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default SignIn
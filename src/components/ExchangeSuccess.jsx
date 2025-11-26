import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, AlertTriangle, Clock, RefreshCw, Copy, ChevronLeft } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useNotification } from '../contexts/NotificationContext'

// Generate random wallet address for different cryptocurrencies
const generateWalletAddress = (cryptoType) => {
  const prefixes = {
    'BTC': '1',
    'ETH': '0x',
    'USDT': '0x',
    'XRP': 'r',
    'BNB': '0x',
    'SOL': ''
  }
  
  const lengths = {
    'BTC': 34,
    'ETH': 42,
    'USDT': 42,
    'XRP': 34,
    'BNB': 42,
    'SOL': 44
  }
  
  const prefix = prefixes[cryptoType] || ''
  const length = lengths[cryptoType] || 34
  const remainingLength = length - prefix.length
  
  // Use crypto-specific character sets
  const charSets = {
    'BTC': '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    'ETH': '0123456789abcdef',
    'USDT': '0123456789abcdef',
    'XRP': 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz',
    'BNB': '0123456789abcdef',
    'SOL': '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  }
  
  const chars = charSets[cryptoType] || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let address = prefix
  
  for (let i = 0; i < remainingLength; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return address
}

const ExchangeSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { showNotification } = useNotification()
  const [exchangeData, setExchangeData] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [countdown, setCountdown] = useState(1800) // 30 minutes countdown
  const [startTime, setStartTime] = useState(null) // Store start time in state
  const [currentPrice, setCurrentPrice] = useState(null)
  const [receivingMultiplier, setReceivingMultiplier] = useState(null) // Random multiplier between 1.1 and 1.15
  const [cryptoAmount, setCryptoAmount] = useState(null) // Actual cryptocurrency amount
  
  useEffect(() => {
    // Get exchange data from location state or sessionStorage
    let exchangeDataToUse = null
    
    if (location.state?.exchangeData) {
      exchangeDataToUse = location.state.exchangeData
    } else {
      // Try to get from localStorage (keyed by user ID) or sessionStorage (backward compatibility)
      // First, we need to get user ID from sessionStorage
      const userData = sessionStorage.getItem('user')
      let userId = null
      if (userData) {
        try {
          const user = JSON.parse(userData)
          userId = user.id
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }
      
      if (userId) {
        const currentExchangeDataKey = `currentExchangeData_${userId}`
        const storedExchangeData = localStorage.getItem(currentExchangeDataKey) || sessionStorage.getItem('currentExchangeData')
        if (storedExchangeData) {
          try {
            exchangeDataToUse = JSON.parse(storedExchangeData)
          } catch (e) {
            console.error('Error parsing stored exchange data:', e)
          }
        }
      } else {
        // Fallback to sessionStorage if no user ID
        const storedExchangeData = sessionStorage.getItem('currentExchangeData')
        if (storedExchangeData) {
          try {
            exchangeDataToUse = JSON.parse(storedExchangeData)
          } catch (e) {
            console.error('Error parsing stored exchange data:', e)
          }
        }
      }
    }
    
    if (exchangeDataToUse) {
      setExchangeData(exchangeDataToUse)
      
      // Get receiving multiplier from exchange data or generate new one
      let multiplier = exchangeDataToUse.receivingMultiplier
      if (!multiplier) {
        // Fallback: get from sessionStorage or generate new
        const multiplierKey = `receiving_multiplier_${exchangeDataToUse.user_id}_${exchangeDataToUse.category}_${exchangeDataToUse.amount}`
        const storedMultiplier = sessionStorage.getItem(multiplierKey)
        if (storedMultiplier) {
          multiplier = parseFloat(storedMultiplier)
        } else {
          // Generate random multiplier between 1.1 and 1.15
          multiplier = 1.1 + Math.random() * 0.05
          sessionStorage.setItem(multiplierKey, multiplier.toFixed(4))
        }
      }
      setReceivingMultiplier(multiplier)
      
      // Map crypto symbols to types for wallet generation
      const cryptoTypeMap = {
        'BTC': 'BTC',
        'ETH': 'ETH', 
        'USDT': 'USDT',
        'XRP': 'XRP',
        'BNB': 'BNB',
        'SOL': 'SOL'
      }
      
      const cryptoType = cryptoTypeMap[exchangeDataToUse.category] || 'BTC'
      
      // Use specific addresses for each cryptocurrency
      let address = ''
      if (exchangeDataToUse.category === 'BTC') {
        address = 'bc1q88lt94hn93tya6f0y4ugfxa820tlhpe3mdxurk'
      } else if (exchangeDataToUse.category === 'ETH') {
        address = '0xC39931D8788DC839341B90Caa1E2cfFe30CD51A8'
      } else if (exchangeDataToUse.category === 'BNB') {
        address = '0xC39931D8788DC839341B90Caa1E2cfFe30CD51A8'
      } else if (exchangeDataToUse.category === 'USDT') {
        address = '0xC39931D8788DC839341B90Caa1E2cfFe30CD51A8'
      } else if (exchangeDataToUse.category === 'XRP') {
        address = 'r9NSgDASgvU3TWEAVyn4LPQFvpnaiULMtb'
      } else if (exchangeDataToUse.category === 'SOL') {
        address = 'r9NSgDASgvU3TWEAVyn4LPQFvpnaiULMtb'
      } else {
        // For other cryptocurrencies, use generated address
        const exchangeId = `${exchangeDataToUse.user_id}_${exchangeDataToUse.category}_${exchangeDataToUse.amount}`
        const savedAddress = sessionStorage.getItem(`wallet_${exchangeId}`)
        address = savedAddress || generateWalletAddress(cryptoType)
        
        if (!savedAddress) {
          sessionStorage.setItem(`wallet_${exchangeId}`, address)
        }
      }
      
      setWalletAddress(address)
      
      // Fetch current price for the cryptocurrency
      const fetchCurrentPrice = async () => {
        try {
          const cryptoIdMap = {
            'BTC': 'bitcoin',
            'ETH': 'ethereum',
            'USDT': 'tether',
            'XRP': 'ripple',
            'BNB': 'binancecoin',
            'SOL': 'solana'
          }
          
          // Set cryptoAmount from stored data if available
          if (exchangeDataToUse.cryptoAmount) {
            setCryptoAmount(exchangeDataToUse.cryptoAmount)
          }
          
          const cryptoId = cryptoIdMap[exchangeDataToUse.category]
          if (cryptoId) {
            const prices = await cryptoAPI.getCryptoPrice([cryptoId])
            if (prices && prices[cryptoId] && prices[cryptoId].price) {
              const pricePerUnit = prices[cryptoId].price
              setCurrentPrice(pricePerUnit)
              
              // Calculate cryptoAmount if not stored (for backward compatibility)
              if (!exchangeDataToUse.cryptoAmount && pricePerUnit > 0) {
                const calculatedCryptoAmount = exchangeDataToUse.amount / pricePerUnit
                setCryptoAmount(calculatedCryptoAmount)
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch current price:', error)
        }
      }
      
      fetchCurrentPrice()
      
      // Initialize countdown - always use exchange timestamp for accurate timing
      // Use wallet address as key for uniqueness
      const exchangeKey = `exchange_countdown_${address}`
      
      // Check if exchange data has a timestamp
      const exchangeTimestamp = exchangeDataToUse.timestamp || Date.now()
      const elapsedSinceExchange = Math.floor((Date.now() - exchangeTimestamp) / 1000)
      
      // If exchange is older than 30 minutes, it's expired
      if (elapsedSinceExchange >= 1800) {
        // Clear expired exchange data
        const userData = sessionStorage.getItem('user')
        if (userData) {
          try {
            const user = JSON.parse(userData)
            if (user.id) {
              localStorage.removeItem(`ongoingExchange_${user.id}`)
              localStorage.removeItem(`currentExchangeData_${user.id}`)
            }
          } catch (e) {
            console.error('Error parsing user data:', e)
          }
        }
        sessionStorage.removeItem('ongoingExchange')
        sessionStorage.removeItem('currentExchangeData')
        sessionStorage.removeItem(exchangeKey)
        sessionStorage.removeItem(`${exchangeKey}_start`)
        // Redirect to dashboard
        navigate('/dashboard')
        return
      }
      
      // Clear any old countdown values to ensure fresh start
      sessionStorage.removeItem(exchangeKey)
      sessionStorage.removeItem(`${exchangeKey}_start`)
      
      // Always start timer based on exchange timestamp (ensures fresh 30 min countdown for new exchanges)
      setStartTime(exchangeTimestamp)
      sessionStorage.setItem(`${exchangeKey}_start`, exchangeTimestamp.toString())
      const remaining = Math.max(0, 1800 - elapsedSinceExchange)
      setCountdown(remaining)
    } else {
      // Redirect to dashboard if no exchange data
      navigate('/dashboard')
    }
  }, [location.state, navigate])
  
  useEffect(() => {
    // Countdown timer that calculates remaining time based on start time
    if (!walletAddress || !startTime) {
      return
    }
    
    // Set up interval to update countdown every second
    const interval = setInterval(() => {
      // Calculate remaining time based on actual elapsed time from start
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(0, 1800 - elapsed)
      
      setCountdown(remaining)
    
      // Update sessionStorage with current remaining time
      const exchangeKey = `exchange_countdown_${walletAddress}`
      sessionStorage.setItem(exchangeKey, remaining.toString())
      
      // If timer reaches 0, clear interval
      if (remaining <= 0) {
        clearInterval(interval)
        // Clear exchange flags when timer expires
        // Get user ID to clear user-specific localStorage
        const userData = sessionStorage.getItem('user')
        if (userData) {
          try {
            const user = JSON.parse(userData)
            if (user.id) {
              localStorage.removeItem(`ongoingExchange_${user.id}`)
              localStorage.removeItem(`currentExchangeData_${user.id}`)
            }
          } catch (e) {
            console.error('Error parsing user data:', e)
          }
        }
        // Also clear sessionStorage for backward compatibility
        sessionStorage.removeItem('ongoingExchange')
        sessionStorage.removeItem('currentExchangeData')
        // Clear countdown keys
        sessionStorage.removeItem(exchangeKey)
        sessionStorage.removeItem(`${exchangeKey}_start`)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [walletAddress, startTime])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      showNotification('Wallet address copied to clipboard!', 'success')
    } catch (err) {
      console.error('Failed to copy: ', err)
      showNotification('Failed to copy wallet address. Please try again.', 'error')
    }
  }
  
  if (!exchangeData) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    )
  }
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: 'clamp(1rem, 2vw, 2rem)'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #00CDCB 0%, #008B8A 100%)',
          padding: '2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            <CheckCircle size={64} />
          </div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '400',
            margin: 0,
            marginBottom: '0.5rem'
          }}>
            Exchange Request Sent Successfully!
          </h1>
          <p style={{
            fontSize: '1.125rem',
            margin: 0,
            opacity: 0.9
          }}>
            Status: {exchangeData.status || 'Processing'}
          </p>
        </div>
        
        {/* Main Content */}
        <div style={{ padding: '2rem' }}>
          {/* Exchange Details */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '400',
              color: '#111827',
              marginBottom: '1rem'
            }}>
              Exchange Details
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Cryptocurrency
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  color: '#111827'
                }}>
                  {exchangeData.category}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Amount
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  color: '#111827'
                }}>
                  {(cryptoAmount || exchangeData.cryptoAmount || (currentPrice && exchangeData.amount / currentPrice) || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })} {exchangeData.category}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Price
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '400',
                  color: '#111827'
                }}>
                  ${exchangeData.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
              {currentPrice && receivingMultiplier && (
                <>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Current Price
                    </div>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '400',
                      color: '#111827'
                    }}>
                      ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Receiving Price
                    </div>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: '400',
                      color: '#10b981'
                    }}>
                      ${(currentPrice * receivingMultiplier).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Payment Instructions */}
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #9ca3af',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <AlertTriangle size={24} color="#00CDCB" />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#111827',
                margin: 0
              }}>
                Payment Instructions
              </h3>
            </div>
            <p style={{
              color: '#111827',
              margin: 0,
              lineHeight: '1.6'
            }}>
              Please send <strong>{(cryptoAmount || exchangeData.cryptoAmount || (currentPrice && exchangeData.amount / currentPrice) || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })} {exchangeData.category}</strong> to the wallet address below. 
              After we confirm the transaction, we will process your USD payment within 24 hours.
            </p>
          </div>
          
          {/* Wallet Address and QR Code */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {/* QR Code */}
            <div style={{
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Scan QR Code
              </h3>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}>
                <QRCodeSVG 
                  value={walletAddress} 
                  size={200}
                  level="M"
                  includeMargin={true}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Scan with your crypto wallet app
              </p>
            </div>
            
            {/* Wallet Address */}
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '400',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                Wallet Address
              </h3>
              <div style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1rem',
                wordBreak: 'break-all',
                fontSize: '0.875rem',
                fontFamily: 'monospace',
                color: '#111827',
                border: '1px solid #d1d5db'
              }}>
                {walletAddress}
              </div>
              <button
                onClick={copyToClipboard}
                style={{
                  width: '100%',
                padding: '0.75rem',
                backgroundColor: '#00CDCB',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00B8B6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00CDCB'}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#00A3A1'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#00B8B6'}
              >
                <Copy size={16} style={{ marginRight: '0.5rem' }} />
                Copy Address
              </button>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #9ca3af',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '400',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              <Clock size={20} style={{ marginRight: '0.5rem', display: 'inline-block' }} />
              Time Remaining
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '400',
              color: '#111827',
              fontFamily: 'monospace'
            }}>
              {formatTime(countdown)}
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: '#111827',
              margin: 0,
              marginTop: '0.5rem'
            }}>
              Please complete the transaction within this time frame
            </p>
          </div>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6b7280'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
            >
              <ChevronLeft size={16} style={{ marginRight: '0.5rem' }} />
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#00CDCB',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '400',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#333333'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            >
              <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExchangeSuccess

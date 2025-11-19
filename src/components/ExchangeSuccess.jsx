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
  const [countdown, setCountdown] = useState(300) // 5 minutes countdown
  const [startTime, setStartTime] = useState(null) // Store start time in state
  const [currentPrice, setCurrentPrice] = useState(null)
  
  useEffect(() => {
    // Get exchange data from location state
    if (location.state?.exchangeData) {
      setExchangeData(location.state.exchangeData)
      
      // Map crypto symbols to types for wallet generation
      const cryptoTypeMap = {
        'BTC': 'BTC',
        'ETH': 'ETH', 
        'USDT': 'USDT',
        'XRP': 'XRP',
        'BNB': 'BNB',
        'SOL': 'SOL'
      }
      
      const cryptoType = cryptoTypeMap[location.state.exchangeData.category] || 'BTC'
      
      // Use specific addresses for Bitcoin and Ethereum
      let address = ''
      if (location.state.exchangeData.category === 'BTC') {
        address = 'bc1q88lt94hn93tya6f0y4ugfxa820tlhpe3mdxurk'
      } else if (location.state.exchangeData.category === 'ETH') {
        address = '0xC39931D8788DC839341B90Caa1E2cfFe30CD51A8'
      } else {
        // For other cryptocurrencies, use generated address
        const exchangeId = `${location.state.exchangeData.user_id}_${location.state.exchangeData.category}_${location.state.exchangeData.amount}`
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
          
          const cryptoId = cryptoIdMap[location.state.exchangeData.category]
          if (cryptoId) {
            const prices = await cryptoAPI.getCryptoPrice([cryptoId])
            if (prices && prices[cryptoId] && prices[cryptoId].price) {
              setCurrentPrice(prices[cryptoId].price)
            }
          }
        } catch (error) {
          console.error('Failed to fetch current price:', error)
        }
      }
      
      fetchCurrentPrice()
      
      // Initialize countdown from sessionStorage or start fresh
      // Use wallet address as key for uniqueness
      const exchangeKey = `exchange_countdown_${address}`
      const savedStartTime = sessionStorage.getItem(`${exchangeKey}_start`)
      
      // Clear any old countdown value to avoid conflicts
      sessionStorage.removeItem(exchangeKey)
      
      if (savedStartTime) {
        // Restore start time from sessionStorage
        const savedTime = parseInt(savedStartTime)
        const elapsed = Math.floor((Date.now() - savedTime) / 1000)
        
        // If timer expired (more than 5 minutes), start fresh
        if (elapsed >= 300) {
          const now = Date.now()
          setStartTime(now)
          sessionStorage.setItem(`${exchangeKey}_start`, now.toString())
          setCountdown(300)
        } else {
          // Restore timer with remaining time
          const remaining = Math.max(0, 300 - elapsed)
          setStartTime(savedTime)
          setCountdown(remaining)
        }
      } else {
        // Start fresh timer
        const now = Date.now()
        setStartTime(now)
        sessionStorage.setItem(`${exchangeKey}_start`, now.toString())
        setCountdown(300)
      }
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
      const remaining = Math.max(0, 300 - elapsed)
      
      setCountdown(remaining)
      
      // Update sessionStorage with current remaining time
      const exchangeKey = `exchange_countdown_${walletAddress}`
      sessionStorage.setItem(exchangeKey, remaining.toString())
      
      // If timer reaches 0, clear interval
      if (remaining <= 0) {
        clearInterval(interval)
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
      padding: '2rem'
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
          background: '#000000',
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
            fontWeight: '700',
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
              fontWeight: '600',
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
                  fontWeight: '600',
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
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  ${exchangeData.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  User ID
                </div>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {exchangeData.user_id}
                </div>
              </div>
              {currentPrice && (
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
                      fontWeight: '600',
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
                      fontWeight: '600',
                      color: '#10b981'
                    }}>
                      ${(currentPrice * 1.24).toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
              <AlertTriangle size={24} color="#000000" />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
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
              Please send <strong>{exchangeData.amount} {exchangeData.category}</strong> to the wallet address below. 
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
                fontWeight: '600',
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
                fontWeight: '600',
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
                backgroundColor: '#000000',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
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
              fontWeight: '600',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              <Clock size={20} style={{ marginRight: '0.5rem', display: 'inline-block' }} />
              Time Remaining
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
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
                fontWeight: '600',
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
                backgroundColor: '#000000',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
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

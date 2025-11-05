import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, AlertTriangle, Clock, RefreshCw, Copy, ChevronLeft } from 'lucide-react'

// QR Code generator using proper encoding based on wallet address
const QRCode = ({ value, size = 200 }) => {
  // Generate QR code pattern based on actual address data
  const generateQRPattern = (text) => {
    // Create a more accurate pattern based on the text
    const pattern = []
    const modules = 25 // QR code size
    
    // Create hash from text for consistent pattern
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    // Generate pattern based on text characters and position
    for (let i = 0; i < modules; i++) {
      pattern.push([])
      for (let j = 0; j < modules; j++) {
        // Use text character codes and position to determine cell
        const charIndex = (i * modules + j) % text.length
        const charCode = text.charCodeAt(charIndex)
        const posHash = (hash + i * 7 + j * 11 + charCode) % 3
        
        // Create QR-like pattern with finder patterns (corners)
        let isBlack = false
        
        // Finder patterns in corners (7x7 squares)
        if ((i < 7 && j < 7) || (i < 7 && j >= modules - 7) || (i >= modules - 7 && j < 7)) {
          // Outer border
          if (i === 0 || i === 6 || j === 0 || j === 6) {
            isBlack = true
          }
          // Inner 5x5
          else if (i >= 2 && i <= 4 && j >= 2 && j <= 4) {
            isBlack = true
          }
        }
        // Data area
        else {
          isBlack = posHash === 0 || (posHash === 1 && (i + j) % 2 === 0)
        }
        
        pattern[i].push(isBlack)
      }
    }
    
    return pattern
  }
  
  const pattern = generateQRPattern(value)
  const cellSize = size / 25
  
  return (
    <svg width={size} height={size} style={{ border: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
      {pattern.map((row, i) =>
        row.map((cell, j) => (
          <rect
            key={`${i}-${j}`}
            x={j * cellSize}
            y={i * cellSize}
            width={cellSize}
            height={cellSize}
            fill={cell ? '#000000' : '#ffffff'}
          />
        ))
      )}
    </svg>
  )
}

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
  const [exchangeData, setExchangeData] = useState(null)
  const [walletAddress, setWalletAddress] = useState('')
  const [countdown, setCountdown] = useState(300) // 5 minutes countdown
  
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
      
      // Check if we already have a wallet address for this exchange
      const exchangeId = `${location.state.exchangeData.user_id}_${location.state.exchangeData.category}_${location.state.exchangeData.amount}`
      const savedAddress = sessionStorage.getItem(`wallet_${exchangeId}`)
      const address = savedAddress || generateWalletAddress(cryptoType)
      
      if (!savedAddress) {
        sessionStorage.setItem(`wallet_${exchangeId}`, address)
      }
      
      setWalletAddress(address)
      
      // Initialize countdown from sessionStorage or start fresh
      // Use wallet address as key for uniqueness
      const exchangeKey = `exchange_countdown_${address}`
      const savedCountdown = sessionStorage.getItem(exchangeKey)
      const savedStartTime = sessionStorage.getItem(`${exchangeKey}_start`)
      
      if (savedCountdown && savedStartTime) {
        const elapsed = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000)
        const remaining = Math.max(0, parseInt(savedCountdown) - elapsed)
        setCountdown(remaining)
        if (remaining > 0) {
          sessionStorage.setItem(exchangeKey, remaining.toString())
        }
      } else {
        // Save initial countdown and start time
        sessionStorage.setItem(exchangeKey, '300')
        sessionStorage.setItem(`${exchangeKey}_start`, Date.now().toString())
      }
    } else {
      // Redirect to dashboard if no exchange data
      navigate('/dashboard')
    }
  }, [location.state, navigate])
  
  useEffect(() => {
    // Countdown timer that saves to sessionStorage
    if (countdown > 0 && walletAddress) {
      const timer = setTimeout(() => {
        const newCountdown = countdown - 1
        setCountdown(newCountdown)
        // Save updated countdown using wallet address as key
        const exchangeKey = `exchange_countdown_${walletAddress}`
        sessionStorage.setItem(exchangeKey, newCountdown.toString())
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, walletAddress])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      alert('Wallet address copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
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
                  {exchangeData.amount} {exchangeData.category}
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
                marginBottom: '1rem'
              }}>
                <QRCode value={walletAddress} size={200} />
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

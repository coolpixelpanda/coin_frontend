import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { cryptoAPI } from '../services/api'
import logoImg from '../Images/logo.png'
import goldenChestImg from '../Images/golden_chest.png'
import vipImg from '../Images/vip.png'
import { 
  Bitcoin, 
  Coins, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Loader2,
  LogOut,
  Eye,
  EyeOff,
  Wallet,
  AlertTriangle,
  CheckCircle,
  X,
  Building2,
  Zap,
  User,
  Shield,
  ChevronRight,
  Star,
  Lock,
  Unlock,
  Sparkles,
  ChevronDown
} from 'lucide-react'
import { 
  FaPaypal, 
  FaUniversity, 
  FaGlobe, 
  FaApplePay,
  FaGooglePay
} from 'react-icons/fa'
import { 
  SiVenmo, 
  SiCashapp, 
  SiZelle,
  SiBitcoin,
  SiEthereum,
  SiTether,
  SiRipple,
  SiBinance,
  SiSolana
} from 'react-icons/si'

// Helper function to get crypto icon
const getCryptoIcon = (cryptoId, size = 24) => {
  const icons = {
    'bitcoin': <SiBitcoin size={size} color="#F7931A" />,
    'ethereum': <SiEthereum size={size} color="#627EEA" />,
    'tether': <SiTether size={size} color="#26A17B" />,
    'ripple': <SiRipple size={size} color="#23292F" />,
    'binancecoin': <SiBinance size={size} color="#F3BA2F" />,
    'solana': <SiSolana size={size} color="#9945FF" />
  }
  return icons[cryptoId] || <Coins size={size} />
}

// Smooth number transition component
const SmoothNumber = ({ value, duration = 1000, decimals = 0, showSign = false }) => {
  const [displayValue, setDisplayValue] = useState(value || 0)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)
  const startValueRef = useRef(0)

  useEffect(() => {
    if (value === null || value === undefined) return
    
    const startValue = displayValue
    const endValue = value
    const difference = endValue - startValue
    
    if (Math.abs(difference) < 0.01) return // No significant change
    
    setIsAnimating(true)
    startValueRef.current = startValue
    startTimeRef.current = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValueRef.current + (difference * easeOutCubic)
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setDisplayValue(endValue)
        setIsAnimating(false)
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  const formatValue = (val) => {
    const formatted = val.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    })
    
    if (showSign && val > 0) {
      return `+${formatted}`
    }
    return formatted
  }

  return (
    <span style={{ 
      color: isAnimating ? '#00CDCB' : '#111827',
      transition: 'color 0.3s ease'
    }}>
      {formatValue(displayValue)}
    </span>
  )
}


const Dashboard = () => {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const previousBalanceRef = useRef(null)
  
  const [cryptoPrices, setCryptoPrices] = useState({
    bitcoin: null,
    ethereum: null,
    tether: null,
    ripple: null,
    binancecoin: null,
    solana: null
  })
  
  const [calculatedValues, setCalculatedValues] = useState({})
  const [showVipModal, setShowVipModal] = useState(false)
  const [showVipCongratulations, setShowVipCongratulations] = useState(false)
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false)
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false)
  const [paymentDropdownDirection, setPaymentDropdownDirection] = useState('down')
  const [cryptoDropdownDirection, setCryptoDropdownDirection] = useState('down')
  const [priceHistory, setPriceHistory] = useState({})
  const [showExchangeModal, setShowExchangeModal] = useState(false)
  const [selectedCryptoForExchange, setSelectedCryptoForExchange] = useState(null)
  const [isExchanging, setIsExchanging] = useState(false)
  const paymentDropdownRef = useRef(null)
  const cryptoDropdownRef = useRef(null)
  
  // Check if user qualifies for VIP (balance >= $100,000)
  const isVipEligible = Number(user?.total_amount || 0) >= 100000

  // Generate consistent color from email (hash-based)
  const getAvatarColor = (email) => {
    if (!email) return '#00CDCB'
    let hash = 0
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash)
    }
    // Generate a bright color palette
    const colors = [
      '#00CDCB', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739',
      '#52BE80', '#F1948A', '#5DADE2', '#F39C12', '#E74C3C'
    ]
    return colors[Math.abs(hash) % colors.length]
  }

  const avatarColor = getAvatarColor(user?.email)
  const avatarLetter = user?.email ? user.email.charAt(0).toUpperCase() : 'U'
  
  const [exchangeForm, setExchangeForm] = useState({
    fromCrypto: 'bitcoin',
    toCurrency: 'usd',
    amount: '',
    paymentAccount: '',
    // PayPal
    email: '',
    paypalAccountId: '',
    // Venmo/Cash App/Zelle
    username: '',
    phoneNumber: '',
    cashtag: '',
    // Wire Transfer
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
    bankName: '',
    beneficiaryName: '',
    bankAddress: '',
    // Apple Pay/Google Pay
    appleId: ''
  })
  

  useEffect(() => {
    loadCryptoPrices(true) // Show loading indicator on initial load
    
    // Check if there's an ongoing exchange in sessionStorage
    const ongoingExchange = sessionStorage.getItem('ongoingExchange')
    if (ongoingExchange === 'true') {
      setIsExchanging(true)
    }
    
    // Poll crypto prices every 30 seconds
    const interval = setInterval(() => {
      console.log('Refreshing crypto prices...')
      loadCryptoPrices(false) // Don't show loading indicator on auto-refresh
    }, 30000) // 30 seconds
    
    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  // Check if user qualifies for VIP Trading and show congratulations modal once
  useEffect(() => {
    const portfolioBalance = Number(user?.total_amount || 0)
    const previousBalance = previousBalanceRef.current
    const hasSeenCongratulations = localStorage.getItem('vipCongratulationsSeen') === 'true'
    
    // Show congratulations modal when balance crosses the $100,000 threshold
    // Or on initial load if already at/above threshold
    // Only show once (check localStorage)
    if (portfolioBalance >= 100000 && !hasSeenCongratulations) {
      if (previousBalance === null || previousBalance < 100000) {
        // User just crossed the threshold or initial load with qualifying balance
        setShowVipCongratulations(true)
        localStorage.setItem('vipCongratulationsSeen', 'true')
      }
    }
    
    // Update previous balance
    previousBalanceRef.current = portfolioBalance
  }, [user?.total_amount])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showVipModal || showVipCongratulations || showExchangeModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showVipModal, showVipCongratulations, showExchangeModal])

  // Close payment dropdown when clicking outside and calculate direction
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPaymentDropdown && !event.target.closest('[data-payment-dropdown]')) {
        setShowPaymentDropdown(false)
      }
      if (showCryptoDropdown && !event.target.closest('[data-crypto-dropdown]')) {
        setShowCryptoDropdown(false)
      }
    }
    
    const calculatePaymentDropdownDirection = () => {
      if (paymentDropdownRef.current) {
        const rect = paymentDropdownRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        const dropdownHeight = 300
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setPaymentDropdownDirection('up')
        } else {
          setPaymentDropdownDirection('down')
        }
      }
    }
    
    const calculateCryptoDropdownDirection = () => {
      if (cryptoDropdownRef.current) {
        const rect = cryptoDropdownRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        const dropdownHeight = 250
        
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
          setCryptoDropdownDirection('up')
        } else {
          setCryptoDropdownDirection('down')
        }
      }
    }
    
    if (showPaymentDropdown) {
      calculatePaymentDropdownDirection()
      window.addEventListener('scroll', calculatePaymentDropdownDirection)
      window.addEventListener('resize', calculatePaymentDropdownDirection)
    }
    
    if (showCryptoDropdown) {
      calculateCryptoDropdownDirection()
      window.addEventListener('scroll', calculateCryptoDropdownDirection)
      window.addEventListener('resize', calculateCryptoDropdownDirection)
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', calculatePaymentDropdownDirection)
      window.removeEventListener('resize', calculatePaymentDropdownDirection)
      window.removeEventListener('scroll', calculateCryptoDropdownDirection)
      window.removeEventListener('resize', calculateCryptoDropdownDirection)
    }
  }, [showPaymentDropdown, showCryptoDropdown])

  const loadCryptoPrices = async (showLoadingIndicator = false) => {
    if (showLoadingIndicator) {
      setLoading(true)
    }
    
    try {
      // Use CoinPaprika API for real-time prices
      const response = await cryptoAPI.getCoinPaprikaTickers()
      console.log("CoinPaprika response:", response)
      
      const prices = {}
      const calculated = {}
      
      // Process all cryptocurrency data
      Object.keys(response).forEach(coinId => {
        const coinData = response[coinId]
        if (coinData) {
          prices[coinId] = {
            price: coinData.price,
            change_1h: coinData.change_1h || 0,
            change_24h: coinData.change_24h || 0,
            change_7d: coinData.change_7d || 0,
            market_cap: coinData.market_cap,
            volume: coinData.volume
          }
          
          // Generate calculated value (price * random between 1.1-2 for BTC/ETH/BNB, 1.5-2 for others)
          const isHighValueCrypto = ['bitcoin', 'ethereum', 'binancecoin'].includes(coinId)
          const multiplier = isHighValueCrypto 
            ? 1.1 + Math.random() * 0.1 // 1.1-1.2 for BTC, ETH, BNB
            : 1.5 + Math.random() * 0.5 // 1.5-2 for others
          calculated[coinId] = coinData.price * multiplier
          
          console.log(`${coinId} price:`, coinData.price, "1h:", coinData.change_1h, "24h:", coinData.change_24h, "7d:", coinData.change_7d)
        }
      })
      
      console.log("Final prices object:", prices)
      console.log("Calculated values:", calculated)
      setCryptoPrices(prices)
      setCalculatedValues(calculated)
      setLastUpdated(new Date())
      
    } catch (error) {
      console.error('Failed to load crypto prices:', error)
      // Keep existing prices on error, don't reset
    } finally {
      if (showLoadingIndicator) {
        setLoading(false)
      }
    }
  }

  const handleExchange = async (e) => {
    e.preventDefault()
    
    // Check if exchange is already in progress
    if (isExchanging) {
      setError('An exchange is already in progress. Please wait for it to complete.')
      return
    }
    
    // Check minimum amount
    const amount = parseFloat(exchangeForm.amount)
    if (isNaN(amount) || amount < 10000) {
      setError('Minimum exchange amount is $10,000.')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    setIsExchanging(true)
    sessionStorage.setItem('ongoingExchange', 'true')

    // Map crypto IDs to symbols for API
    const cryptoSymbolMap = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'tether': 'USDT',
      'ripple': 'XRP',
      'binancecoin': 'BNB',
      'solana': 'SOL'
    }

    try {
      const exchangeData = {
        user_id: user.id,
        category: cryptoSymbolMap[exchangeForm.fromCrypto] || exchangeForm.fromCrypto,
        amount: amount
      }
      
      const result = await cryptoAPI.exchangeCrypto(exchangeData)
      
      // Navigate to exchange success page with exchange data
      navigate('/exchange-success', {
        state: {
          exchangeData: {
            ...exchangeData,
            status: result.Status
          }
        }
      })
      setExchangeForm({
        fromCrypto: 'bitcoin',
        toCurrency: 'usd',
        amount: '',
        paymentAccount: '',
        // PayPal
        email: '',
        paypalAccountId: '',
        // Venmo/Cash App/Zelle
        username: '',
        phoneNumber: '',
        cashtag: '',
        // Wire Transfer
        accountNumber: '',
        routingNumber: '',
        swiftCode: '',
        bankName: '',
        beneficiaryName: '',
        bankAddress: '',
        // Apple Pay/Google Pay
        appleId: ''
      })
    } catch (error) {
      setError(error.message || 'Exchange failed. Please try again.')
      setIsExchanging(false)
      sessionStorage.removeItem('ongoingExchange')
    }
    setLoading(false)
  }


  const isFormValid = () => {
    if (!exchangeForm.amount || !exchangeForm.paymentAccount) return false
    
    // Check minimum amount
    const amount = parseFloat(exchangeForm.amount)
    if (isNaN(amount) || amount < 10000) return false
    
    // Check if exchange is already in progress
    if (isExchanging) return false
    
    // Check required fields based on payment account type
    switch(exchangeForm.paymentAccount) {
      case 'bank_transfer':
        return exchangeForm.accountNumber && exchangeForm.routingNumber
      case 'paypal':
        return (exchangeForm.email || exchangeForm.paypalAccountId)
      case 'venmo':
        return (exchangeForm.username || exchangeForm.phoneNumber || exchangeForm.email)
      case 'cashapp':
        return (exchangeForm.username || exchangeForm.cashtag)
      case 'zelle':
        return (exchangeForm.email || exchangeForm.phoneNumber)
      case 'wire_transfer':
        return exchangeForm.accountNumber && exchangeForm.routingNumber && exchangeForm.swiftCode && 
               exchangeForm.bankName && exchangeForm.beneficiaryName && exchangeForm.bankAddress
      case 'apple_pay':
        return exchangeForm.appleId
      case 'google_pay':
        return exchangeForm.email || exchangeForm.phoneNumber
      default:
        return false
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Debug logging
  console.log('Dashboard - User:', user)
  console.log('Dashboard - isAuthenticated:', isAuthenticated)
  console.log('Dashboard - authLoading:', authLoading)

  if (authLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={32} className="animate-spin" style={{ marginBottom: '1rem', color: '#000000' }} />
          <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('Dashboard - Not authenticated, redirecting to signin')
    return null
  }

  return (
    <>
      <style>{`
        @keyframes starTwinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
        @keyframes vipGlow {
          0%, 100% {
            box-shadow: 0 0 20px ${avatarColor}80, 0 0 40px ${avatarColor}40, 0 4px 12px rgba(0,0,0,0.15);
          }
          50% {
            box-shadow: 0 0 30px ${avatarColor}CC, 0 0 60px ${avatarColor}80, 0 6px 20px rgba(0,0,0,0.2);
          }
        }
        @keyframes pulseLock {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1120px', 
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: '64px',
          gap: '1rem'
        }}>
          {/* User Avatar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: avatarColor,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                fontWeight: '400',
                boxShadow: isVipEligible 
                  ? `0 0 20px ${avatarColor}80, 0 0 40px ${avatarColor}40, 0 4px 12px rgba(0,0,0,0.15)` 
                  : '0 2px 8px rgba(0,0,0,0.1)',
                border: isVipEligible ? `2px solid ${avatarColor}` : '2px solid transparent',
                transition: 'all 0.3s ease',
                position: 'relative',
                cursor: 'pointer',
                animation: isVipEligible ? `vipGlow 3s ease-in-out infinite` : 'none'
              }}
              title={isVipEligible ? 'VIP Trading User' : 'Earn VIP Trading'}
              onClick={() => {
                if (!isVipEligible) {
                  setShowVipModal(true)
                } else {
                  navigate('/vip-trading')
                }
              }}
              onMouseEnter={(e) => {
                if (isVipEligible) {
                  e.currentTarget.style.transform = 'scale(1.1)'
                  e.currentTarget.style.animation = 'none'
                  e.currentTarget.style.boxShadow = `0 0 30px ${avatarColor}CC, 0 0 60px ${avatarColor}80, 0 6px 20px rgba(0,0,0,0.2)`
                }
              }}
              onMouseLeave={(e) => {
                if (isVipEligible) {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.animation = `vipGlow 3s ease-in-out infinite`
                  e.currentTarget.style.boxShadow = `0 0 20px ${avatarColor}80, 0 0 40px ${avatarColor}40, 0 4px 12px rgba(0,0,0,0.15)`
                }
              }}
            >
              {avatarLetter}
            </div>
            {/* Lock Icon for Non-VIP Users */}
            {!isVipEligible && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  border: '2px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  animation: 'pulseLock 2s ease-in-out infinite'
                }}
                title="Earn VIP Trading by reaching $100,000 in exchanges"
              >
                <Lock size={10} color="#92400e" />
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              padding: '0.625rem 1.25rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '0.875rem',
              fontWeight: '400',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
              e.currentTarget.style.borderColor = '#d1d5db'
              e.currentTarget.style.color = '#111827'
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.color = '#374151'
              e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div style={{ 
        maxWidth: '1120px', 
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {/* Top Snapshot */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Portfolio Balance</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 400, color: '#111827' }}>
              ${Number(user?.total_amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : '—'}
            </div>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bitcoin (BTC)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 400, color: '#111827' }}>
              ${cryptoPrices.bitcoin?.price ? cryptoPrices.bitcoin.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
              {(cryptoPrices.bitcoin?.change_24h ?? 0).toFixed(2)}% 24h
            </div>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Ethereum (ETH)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 400, color: '#111827' }}>
              ${cryptoPrices.ethereum?.price ? cryptoPrices.ethereum.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
              {(cryptoPrices.ethereum?.change_24h ?? 0).toFixed(2)}% 24h
            </div>
          </div>
        </div>
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: '400', 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Welcome to your Dashboard
          </h2>
          <p style={{ color: '#6b7280' }}>
            Manage your cryptocurrency portfolio and exchange crypto for USD
          </p>
        </div>

        {/* Crypto Prices Section - Modern List Layout */}
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          marginBottom: '2rem',
          overflow: 'hidden',
          width: '100%',
          margin: '3rem auto'
        }}>
          {/* Header with Refresh Button */}
          <div style={{ 
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #00CDCB 0%, #008B8A 100%)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '400',
              color: 'white',
              margin: 0
            }}>
              Cryptocurrency Prices
            </h2>
            <button
              onClick={() => loadCryptoPrices(true)}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '400',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseDown={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'
              }}
              onMouseUp={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {loading ? 'Refreshing...' : 'Refresh All'}
            </button>
          </div>

          {/* Crypto List */}
          <div style={{ padding: '0' }}>
            {[
              { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', decimals: 2 },
              { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', decimals: 2 },
              { id: 'tether', name: 'Tether', symbol: 'USDT', decimals: 4 },
              { id: 'ripple', name: 'XRP', symbol: 'XRP', decimals: 4 },
              { id: 'binancecoin', name: 'BNB', symbol: 'BNB', decimals: 2 },
              { id: 'solana', name: 'Solana', symbol: 'SOL', decimals: 2 }
            ].map((crypto, index) => {
              const icon = getCryptoIcon(crypto.id, 24)
              return { ...crypto, icon }
            }).map((crypto, index) => {
              const data = cryptoPrices[crypto.id]
              const currentPrice = data?.price || 0
              const receivingPrice = currentPrice * 1.24
              
              return (
                <div key={crypto.id} style={{ 
                  padding: '1.5rem 2rem',
                  borderBottom: index < 5 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  transition: 'background-color 0.2s ease',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                >
                  {/* Icon and Name */}
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flex: '1 1 0',
                    minWidth: 0
                  }}>
                    <div style={{ 
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00CDCB',
                      flexShrink: 0
                    }}>
                      {crypto.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ 
                        fontSize: '1.125rem',
                        fontWeight: '400',
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {crypto.name}
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>

                  {/* Current Price */}
                  <div style={{ 
                    flex: '1 1 0',
                    textAlign: 'right',
                    minWidth: 0
                  }}>
                    <div style={{ 
                      fontSize: '1.25rem',
                      fontWeight: '400',
                      color: '#111827'
                    }}>
                      $<SmoothNumber value={currentPrice} duration={800} decimals={crypto.decimals} />
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      Current Price
                    </div>
                  </div>

                  {/* Receiving Value */}
                  <div style={{ 
                    flex: '1 1 0',
                    textAlign: 'right',
                    minWidth: 0
                  }}>
                    <div style={{ 
                      fontSize: '1.125rem',
                      fontWeight: '400',
                      color: '#10b981'
                    }}>
                      $<SmoothNumber value={receivingPrice} duration={800} decimals={crypto.decimals} />
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      Receiving Value
                    </div>
                  </div>

                  {/* Timeframe Changes */}
                  <div style={{ 
                    display: 'flex',
                    gap: '1rem',
                    flex: '1 1 0',
                    justifyContent: 'center',
                    minWidth: 0
                  }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ 
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        1H
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        color: '#4b5563'
                      }}>
                        <SmoothNumber value={data?.change_1h} duration={600} decimals={2} showSign={true} />%
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ 
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        24H
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        color: '#4b5563'
                      }}>
                        <SmoothNumber value={data?.change_24h} duration={600} decimals={2} showSign={true} />%
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ 
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        7D
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        color: '#4b5563'
                      }}>
                        <SmoothNumber value={data?.change_7d} duration={600} decimals={2} showSign={true} />%
                      </div>
                    </div>
                  </div>

                  {/* Chest Box Button */}
                  <div style={{ 
                    flex: '0 0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '1rem'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isExchanging) {
                          setError('An exchange is already in progress. Please wait for it to complete.')
                          return
                        }
                        setSelectedCryptoForExchange(crypto)
                        setShowExchangeModal(true)
                      }}
                      disabled={isExchanging}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isExchanging ? 'not-allowed' : 'pointer',
                        transition: 'transform 0.2s',
                        opacity: isExchanging ? 0.5 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!isExchanging) e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      <img 
                        src={goldenChestImg} 
                        alt="Golden Chest" 
                        style={{
                          width: '6rem',
                          height: '6rem',
                          objectFit: 'contain'
                        }}
                      />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Exchange Section */}
        <div style={{ 
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {/* Exchange Form */}
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '400',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <Wallet size={20} style={{ marginRight: '0.5rem' }} />
                Exchange Crypto to USD
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Convert your cryptocurrency to USD instantly
              </p>
            </div>

            {error && (
              <div style={{ 
                backgroundColor: '#f9fafb',
                border: '1px solid #9ca3af',
                color: '#111827',
                padding: '0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertTriangle size={16} style={{ marginRight: '0.5rem' }} />
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
                fontSize: '0.875rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={16} style={{ marginRight: '0.5rem' }} />
                {success}
              </div>
            )}

            <form onSubmit={handleExchange} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  From Cryptocurrency
                </label>
                <div style={{ position: 'relative' }} data-crypto-dropdown ref={cryptoDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCryptoDropdown(!showCryptoDropdown)}
                    style={{
                      width: '100%',
                      height: '2.5rem',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                      backgroundColor: 'white',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#9ca3af'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      {getCryptoIcon(exchangeForm.fromCrypto, 18)}
                      <span>
                        {exchangeForm.fromCrypto === 'bitcoin' && 'Bitcoin (BTC)'}
                        {exchangeForm.fromCrypto === 'ethereum' && 'Ethereum (ETH)'}
                        {exchangeForm.fromCrypto === 'tether' && 'Tether (USDT)'}
                        {exchangeForm.fromCrypto === 'ripple' && 'XRP (XRP)'}
                        {exchangeForm.fromCrypto === 'binancecoin' && 'BNB (BNB)'}
                        {exchangeForm.fromCrypto === 'solana' && 'Solana (SOL)'}
                      </span>
                    </div>
                    <ChevronDown size={16} color="#6b7280" style={{ 
                      transform: showCryptoDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }} />
                  </button>
                  
                  {showCryptoDropdown && (
                    <div style={{
                      position: 'absolute',
                      ...(cryptoDropdownDirection === 'up' 
                        ? { bottom: '100%', marginBottom: '0.25rem' }
                        : { top: '100%', marginTop: '0.25rem' }
                      ),
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 1000,
                      maxHeight: '250px',
                      overflowY: 'auto',
                      padding: '0.25rem 0'
                    }}>
                      {[
                        { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
                        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
                        { id: 'tether', name: 'Tether', symbol: 'USDT' },
                        { id: 'ripple', name: 'XRP', symbol: 'XRP' },
                        { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
                        { id: 'solana', name: 'Solana', symbol: 'SOL' }
                      ].map((crypto) => (
                        <div
                          key={crypto.id}
                          onClick={() => {
                            setExchangeForm({...exchangeForm, fromCrypto: crypto.id})
                            setShowCryptoDropdown(false)
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            backgroundColor: exchangeForm.fromCrypto === crypto.id ? '#f3f4f6' : 'white',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9fafb'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = exchangeForm.fromCrypto === crypto.id ? '#f3f4f6' : 'white'
                          }}
                        >
                          {getCryptoIcon(crypto.id, 18)}
                          <span style={{ fontSize: '0.875rem' }}>{crypto.name} ({crypto.symbol})</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                  Amount
                </label>
                <input
                  type="number"
                  step="0.00001"
                  min="10000"
                  value={exchangeForm.amount}
                  onChange={(e) => setExchangeForm({...exchangeForm, amount: e.target.value})}
                  style={{
                    width: '100%',
                    height: '2.5rem',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Minimum $10,000"
                  required
                />
                {exchangeForm.amount && parseFloat(exchangeForm.amount) < 10000 && (
                  <p style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.75rem', 
                    color: '#ef4444' 
                  }}>
                    Minimum exchange amount is $10,000
                  </p>
                )}
                {exchangeForm.amount && parseFloat(exchangeForm.amount) > 0 && cryptoPrices[exchangeForm.fromCrypto] && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    {(() => {
                      const amount = parseFloat(exchangeForm.amount) || 0
                      const currentPrice = cryptoPrices[exchangeForm.fromCrypto]?.price || 0
                      const receivingPrice = currentPrice * 1.24
                      const receivingValue = amount * receivingPrice
                      
                      return (
                        <>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                          }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Price:</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#111827' }}>
                              ${currentPrice.toLocaleString(undefined, { 
                                maximumFractionDigits: ['bitcoin', 'ethereum', 'binancecoin', 'solana'].includes(exchangeForm.fromCrypto) ? 2 : 4 
                              })}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem',
                            paddingTop: '0.5rem',
                            borderTop: '1px solid #e5e7eb'
                          }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Receiving Price:</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#10b981' }}>
                              ${receivingPrice.toLocaleString(undefined, { 
                                maximumFractionDigits: ['bitcoin', 'ethereum', 'binancecoin', 'solana'].includes(exchangeForm.fromCrypto) ? 2 : 4 
                              })}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '0.5rem',
                            borderTop: '1px solid #e5e7eb'
                          }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Receiving Value:</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#10b981' }}>
                              ${receivingValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>

              <div>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Payment Account
                </label>
                <div style={{ position: 'relative' }} data-payment-dropdown ref={paymentDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                    style={{
                      width: '100%',
                      height: '2.5rem',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box',
                      backgroundColor: 'white',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#9ca3af'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                      {!exchangeForm.paymentAccount && (
                        <>
                          <Wallet size={18} color="#6b7280" />
                          <span style={{ color: '#9ca3af' }}>Select payment account</span>
                        </>
                      )}
                      {exchangeForm.paymentAccount === 'bank_transfer' && (
                        <>
                          <FaUniversity size={18} color="#6b7280" />
                          <span>Bank Transfer (ACH)</span>
                        </>
                      )}
                      {exchangeForm.paymentAccount === 'paypal' && (
                        <>
                          <FaPaypal size={18} color="#0070ba" />
                          <span>PayPal</span>
                        </>
                      )}
                      {exchangeForm.paymentAccount === 'venmo' && (
                        <>
                          <SiVenmo size={18} color="#3D95CE" />
                          <span>Venmo</span>
                        </>
                      )}
                      {exchangeForm.paymentAccount === 'cashapp' && (
                        <>
                          <SiCashapp size={18} color="#00D632" />
                          <span>Cash App</span>
                        </>
                      )}
                      {exchangeForm.paymentAccount === 'zelle' && (
                        <>
                          <SiZelle size={18} color="#6D1ED4" />
                          <span>Zelle</span>
                        </>
                      )}
                      {exchangeForm.paymentAccount === 'wire_transfer' && (
                        <>
                          <FaGlobe size={18} color="#6b7280" />
                          <span>Wire Transfer</span>
                        </>
                      )}
                      {exchangeForm.paymentAccount === 'apple_pay' && (
                        <>
                          <FaApplePay size={18} color="#00CDCB" />
                          <span>Apple Pay</span>
                        </>
                      )}
                      {exchangeForm.paymentAccount === 'google_pay' && (
                        <>
                          <FaGooglePay size={18} color="#4285F4" />
                          <span>Google Pay</span>
                        </>
                      )}
                    </div>
                    <ChevronDown size={16} color="#6b7280" style={{ 
                      transform: showPaymentDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }} />
                  </button>
                  
                  {showPaymentDropdown && (
                    <div style={{
                      position: 'absolute',
                      ...(paymentDropdownDirection === 'up' 
                        ? { bottom: '100%', marginBottom: '0.25rem' }
                        : { top: '100%', marginTop: '0.25rem' }
                      ),
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      zIndex: 1000,
                      maxHeight: '300px',
                      overflowY: 'auto',
                      padding: '0.25rem 0'
                    }}>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: '',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f3f4f6',
                          transition: 'background-color 0.2s',
                          marginBottom: '0'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white'
                        }}
                      >
                        <Wallet size={18} color="#9ca3af" />
                        <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Select payment account</span>
                      </div>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: 'bank_transfer',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: exchangeForm.paymentAccount === 'bank_transfer' ? '#f3f4f6' : 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = exchangeForm.paymentAccount === 'bank_transfer' ? '#f3f4f6' : 'white'
                        }}
                      >
                        <FaUniversity size={18} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem' }}>Bank Transfer (ACH)</span>
                      </div>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: 'paypal',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: exchangeForm.paymentAccount === 'paypal' ? '#f3f4f6' : 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = exchangeForm.paymentAccount === 'paypal' ? '#f3f4f6' : 'white'
                        }}
                      >
                        <FaPaypal size={18} color="#0070ba" />
                        <span style={{ fontSize: '0.875rem' }}>PayPal</span>
                      </div>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: 'venmo',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: exchangeForm.paymentAccount === 'venmo' ? '#f3f4f6' : 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = exchangeForm.paymentAccount === 'venmo' ? '#f3f4f6' : 'white'
                        }}
                      >
                        <SiVenmo size={18} color="#3D95CE" />
                        <span style={{ fontSize: '0.875rem' }}>Venmo</span>
                      </div>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: 'cashapp',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: exchangeForm.paymentAccount === 'cashapp' ? '#f3f4f6' : 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = exchangeForm.paymentAccount === 'cashapp' ? '#f3f4f6' : 'white'
                        }}
                      >
                        <SiCashapp size={18} color="#00D632" />
                        <span style={{ fontSize: '0.875rem' }}>Cash App</span>
                      </div>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: 'zelle',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: exchangeForm.paymentAccount === 'zelle' ? '#f3f4f6' : 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = exchangeForm.paymentAccount === 'zelle' ? '#f3f4f6' : 'white'
                        }}
                      >
                        <SiZelle size={18} color="#6D1ED4" />
                        <span style={{ fontSize: '0.875rem' }}>Zelle</span>
                      </div>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: 'wire_transfer',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: exchangeForm.paymentAccount === 'wire_transfer' ? '#f3f4f6' : 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = exchangeForm.paymentAccount === 'wire_transfer' ? '#f3f4f6' : 'white'
                        }}
                      >
                        <FaGlobe size={18} color="#6b7280" />
                        <span style={{ fontSize: '0.875rem' }}>Wire Transfer</span>
                      </div>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: 'apple_pay',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: exchangeForm.paymentAccount === 'apple_pay' ? '#f3f4f6' : 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = exchangeForm.paymentAccount === 'apple_pay' ? '#f3f4f6' : 'white'
                        }}
                      >
                        <FaApplePay size={18} color="#000000" />
                        <span style={{ fontSize: '0.875rem' }}>Apple Pay</span>
                      </div>
                      <div
                        onClick={() => {
                          setExchangeForm({
                            ...exchangeForm,
                            paymentAccount: 'google_pay',
                            email: '',
                            paypalAccountId: '',
                            username: '',
                            phoneNumber: '',
                            cashtag: '',
                            accountNumber: '',
                            routingNumber: '',
                            swiftCode: '',
                            bankName: '',
                            beneficiaryName: '',
                            bankAddress: '',
                            appleId: ''
                          })
                          setShowPaymentDropdown(false)
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          backgroundColor: exchangeForm.paymentAccount === 'google_pay' ? '#f3f4f6' : 'white',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = exchangeForm.paymentAccount === 'google_pay' ? '#f3f4f6' : 'white'
                        }}
                      >
                        <FaGooglePay size={18} color="#4285F4" />
                        <span style={{ fontSize: '0.875rem' }}>Google Pay</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Conditional payment account fields */}
              {exchangeForm.paymentAccount === 'bank_transfer' && (
                <>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={exchangeForm.accountNumber}
                      onChange={(e) => setExchangeForm({...exchangeForm, accountNumber: e.target.value})}
                      style={{
                        width: '100%',
                        height: '2.5rem',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter account number"
                      required
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
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={exchangeForm.routingNumber}
                      onChange={(e) => setExchangeForm({...exchangeForm, routingNumber: e.target.value})}
                      style={{
                        width: '100%',
                        height: '2.5rem',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter routing number"
                      required
                    />
                  </div>
                </>
              )}

              {exchangeForm.paymentAccount === 'paypal' && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    PayPal Email
                  </label>
                  <input
                    type="email"
                    value={exchangeForm.email}
                    onChange={(e) => setExchangeForm({...exchangeForm, email: e.target.value})}
                    style={{
                      width: '100%',
                      height: '2.5rem',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter PayPal email"
                    required
                  />
                </div>
              )}

              {(exchangeForm.paymentAccount === 'venmo' || exchangeForm.paymentAccount === 'cashapp' || exchangeForm.paymentAccount === 'zelle') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    {exchangeForm.paymentAccount === 'zelle' ? 'Email or Phone' : 'Phone Number'}
                  </label>
                  <input
                    type={exchangeForm.paymentAccount === 'zelle' ? 'text' : 'tel'}
                    value={exchangeForm.phoneNumber}
                    onChange={(e) => setExchangeForm({...exchangeForm, phoneNumber: e.target.value})}
                    style={{
                      width: '100%',
                      height: '2.5rem',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder={exchangeForm.paymentAccount === 'zelle' ? 'Enter email or phone' : 'Enter phone number'}
                    required
                  />
                </div>
              )}

              {exchangeForm.paymentAccount === 'wire_transfer' && (
                <>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      SWIFT Code
                    </label>
                    <input
                      type="text"
                      value={exchangeForm.accountNumber}
                      onChange={(e) => setExchangeForm({...exchangeForm, accountNumber: e.target.value})}
                      style={{
                        width: '100%',
                        height: '2.5rem',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter SWIFT code"
                      required
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
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={exchangeForm.routingNumber}
                      onChange={(e) => setExchangeForm({...exchangeForm, routingNumber: e.target.value})}
                      style={{
                        width: '100%',
                        height: '2.5rem',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter account number"
                      required
                    />
                  </div>
                </>
              )}

              {(exchangeForm.paymentAccount === 'apple_pay' || exchangeForm.paymentAccount === 'google_pay') && (
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={exchangeForm.phoneNumber}
                    onChange={(e) => setExchangeForm({...exchangeForm, phoneNumber: e.target.value})}
                    style={{
                      width: '100%',
                      height: '2.5rem',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              )}

              {isExchanging && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fbbf24',
                  borderRadius: '0.375rem',
                  color: '#92400e',
                  fontSize: '0.875rem'
                }}>
                  An exchange is currently in progress. Please wait for it to complete before starting a new exchange.
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !isFormValid() || isExchanging}
                style={{
                  width: '100%',
                  height: '2.75rem',
                  backgroundColor: (loading || !isFormValid() || isExchanging) ? '#9ca3af' : '#00CDCB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: (loading || !isFormValid() || isExchanging) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: (loading || !isFormValid() || isExchanging) ? 'none' : '0 4px 14px rgba(0, 205, 203, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading && isFormValid() && !isExchanging) e.currentTarget.style.backgroundColor = '#00B8B6'
                }}
                onMouseLeave={(e) => {
                  if (!loading && isFormValid() && !isExchanging) e.currentTarget.style.backgroundColor = '#00CDCB'
                }}
                onMouseDown={(e) => {
                  if (!loading && isFormValid() && !isExchanging) e.currentTarget.style.backgroundColor = '#00A3A1'
                }}
                onMouseUp={(e) => {
                  if (!loading && isFormValid() && !isExchanging) e.currentTarget.style.backgroundColor = '#00B8B6'
                }}
              >
                {loading ? 'Processing...' : isExchanging ? 'Exchange In Progress...' : 'Exchange Now'}
              </button>
            </form>
          </div>
        </div>

        {/* API Status Note */}
        {/* <div style={{ 
          marginTop: '2rem',
          backgroundColor: '#f9fafb',
          border: '1px solid #9ca3af',
          borderRadius: '0.375rem',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={20} />
            <div style={{ fontSize: '0.875rem', color: '#111827' }}>
              <strong>Demo Mode:</strong> Running with local data. Backend API at `http://192.168.132.10:3003/api` is not responding.
              <br />• POST /api/register (Username, Email, Password)
              <br />• POST /api/login (Username, Email, Password) → Returns User_id, Total_amount
              <br />• GET /api/crypto-price → Returns array of [Id, Category, Price]
              <br />• POST /api/exchange (User_id, Category, Amount) → Returns User_id, Category, Amount, Status
            </div>
          </div>
        </div> */}
      </div>


      {/* VIP Congratulations Modal */}
      {showVipCongratulations && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '2rem',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={() => setShowVipCongratulations(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '2rem',
            padding: '3rem',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Stars */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              pointerEvents: 'none'
            }}>
              {[...Array(8)].map((_, i) => (
                <Star
                  key={i}
                  size={12 + i * 2}
                  fill="#fbbf24"
                  color="#fbbf24"
                  style={{
                    position: 'absolute',
                    top: `${20 + (i % 3) * 30}%`,
                    left: `${15 + (i % 4) * 25}%`,
                    opacity: 0.4 + (i % 3) * 0.15,
                    animation: `floatStar ${3 + (i % 3)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center'
            }}>
              {/* Sparkle Icons */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                marginBottom: '2rem',
                alignItems: 'center'
              }}>
                <Sparkles 
                  size={32} 
                  fill="#fbbf24" 
                  color="#fbbf24"
                  style={{
                    animation: 'sparkleRotate 2.5s ease-in-out infinite',
                    animationDelay: '0s'
                  }}
                />
                <Star 
                  size={72} 
                  fill="#fbbf24" 
                  color="#fbbf24"
                  style={{
                    animation: 'starBounce 1.5s ease-in-out infinite',
                    animationDelay: '0.1s'
                  }}
                />
                <Sparkles 
                  size={32} 
                  fill="#fbbf24" 
                  color="#fbbf24"
                  style={{
                    animation: 'sparkleRotate 2.5s ease-in-out infinite',
                    animationDelay: '0.5s'
                  }}
                />
              </div>

              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '400',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: '0 0 1rem 0',
                animation: 'textShine 2s ease-in-out infinite'
              }}>
                🎉 Congratulations! 🎉
              </h2>
              
              <p style={{
                fontSize: '1.25rem',
                color: '#374151',
                margin: '0 0 1.5rem 0',
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                You are now eligible for <strong style={{ color: '#fbbf24' }}>VIP Trading</strong>!
              </p>

              <div style={{
                backgroundColor: '#fef3c7',
                border: '2px solid #fbbf24',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <p style={{
                  fontSize: '1rem',
                  color: '#78350f',
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  Unlock exclusive features, premium rates, and priority support for high-volume traders.
                </p>
              </div>

              <button
                onClick={() => setShowVipCongratulations(false)}
                style={{
                  padding: '1rem 2.5rem',
                  backgroundColor: '#fbbf24',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 25px -5px rgba(251, 191, 36, 0.5)',
                  animation: 'buttonPulse 2s ease-in-out infinite'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(251, 191, 36, 0.7)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(251, 191, 36, 0.5)'
                }}
              >
                Get Started
              </button>
            </div>

            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes modalSlideUp {
                0% {
                  opacity: 0;
                  transform: translateY(30px) scale(0.95);
                }
                60% {
                  opacity: 1;
                  transform: translateY(-5px) scale(1.02);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }
              @keyframes starBounce {
                0%, 100% {
                  transform: translateY(0) scale(1) rotate(0deg);
                }
                50% {
                  transform: translateY(-15px) scale(1.15) rotate(10deg);
                }
              }
              @keyframes sparkleRotate {
                0%, 100% {
                  transform: rotate(0deg) scale(1);
                  opacity: 0.8;
                }
                25% {
                  transform: rotate(90deg) scale(1.15);
                  opacity: 1;
                }
                50% {
                  transform: rotate(180deg) scale(1.1);
                  opacity: 0.9;
                }
                75% {
                  transform: rotate(270deg) scale(1.15);
                  opacity: 1;
                }
              }
              @keyframes floatStar {
                0%, 100% {
                  transform: translate(0, 0) rotate(0deg) scale(1);
                  opacity: 0.4;
                }
                33% {
                  transform: translate(15px, -10px) rotate(120deg) scale(1.1);
                  opacity: 0.6;
                }
                66% {
                  transform: translate(-10px, -20px) rotate(240deg) scale(0.9);
                  opacity: 0.5;
                }
              }
              @keyframes textShine {
                0%, 100% {
                  filter: brightness(1);
                }
                50% {
                  filter: brightness(1.3);
                }
              }
              @keyframes buttonPulse {
                0%, 100% {
                  box-shadow: 0 10px 25px -5px rgba(251, 191, 36, 0.5);
                }
                50% {
                  box-shadow: 0 15px 35px -5px rgba(251, 191, 36, 0.7);
                }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* VIP Trading Modal */}
      {showVipModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}
        onClick={() => setShowVipModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent'
                }}>
                  <img 
                    src={vipImg} 
                    alt="VIP" 
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  color: '#111827',
                  margin: 0
                }}>
                  VIP Trading
                </h2>
              </div>
              <button
                onClick={() => setShowVipModal(false)}
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.5rem',
                  height: '2.5rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.75rem',
                border: '1px solid #fbbf24',
                marginBottom: '1rem'
              }}>
                <Lock size={20} color="#92400e" />
                <p style={{
                  fontSize: '1rem',
                  color: '#92400e',
                  fontWeight: '400',
                  margin: 0
                }}>
                  Feature Locked
                </p>
              </div>
              <p style={{
                fontSize: '1rem',
                color: '#374151',
                lineHeight: '1.6',
                margin: 0
              }}>
                To unlock VIP Trading, you need to maintain a minimum Portfolio Balance of <strong style={{ color: '#111827' }}>$100,000</strong> in your account.
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: '1rem 0 0 0'
              }}>
                VIP Trading provides access to exclusive features, premium rates, and priority support for high-volume traders.
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => setShowVipModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                  e.currentTarget.style.borderColor = '#9ca3af'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#d1d5db'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exchange Modal */}
      {showExchangeModal && selectedCryptoForExchange && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '2rem',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={() => setShowExchangeModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getCryptoIcon(selectedCryptoForExchange.id, 24)}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    color: '#111827',
                    margin: 0
                  }}>
                    Exchange {selectedCryptoForExchange.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Confirm your exchange for $100,000
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExchangeModal(false)}
                style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                  e.currentTarget.style.color = '#111827'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                  e.currentTarget.style.color = '#6b7280'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Exchange Details */}
            <div style={{
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Exchange Amount:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '400', color: '#111827' }}>$100,000.00</span>
              </div>
              
              {(() => {
                const currentPrice = cryptoPrices[selectedCryptoForExchange.id]?.price || 0
                const coinCount = currentPrice > 0 ? (100000 / currentPrice) : 0
                const receivingPrice = currentPrice * 1.24
                const receivingValue = coinCount * receivingPrice
                
                return (
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Price:</span>
                      <span style={{ fontSize: '1rem', fontWeight: '400', color: '#111827' }}>
                        ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: selectedCryptoForExchange.decimals || 2 })}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Coin Count:</span>
                      <span style={{ fontSize: '1rem', fontWeight: '400', color: '#111827' }}>
                        {coinCount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {selectedCryptoForExchange.symbol}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Receiving Price:</span>
                      <span style={{ fontSize: '1rem', fontWeight: '400', color: '#10b981' }}>
                        ${receivingPrice.toLocaleString(undefined, { maximumFractionDigits: selectedCryptoForExchange.decimals || 2 })}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '2px solid #10b981',
                      backgroundColor: '#ecfdf5',
                      margin: '0 -1.5rem -1.5rem -1.5rem',
                      padding: '1.5rem',
                      borderRadius: '0 0 0.75rem 0.75rem'
                    }}>
                      <span style={{ fontSize: '1rem', fontWeight: '400', color: '#111827' }}>Total Receiving Value:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: '400', color: '#10b981' }}>
                        ${receivingValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Confirmation Message */}
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'start',
              gap: '0.75rem'
            }}>
              <AlertTriangle size={20} color="#92400e" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
              <p style={{
                fontSize: '0.875rem',
                color: '#92400e',
                margin: 0,
                lineHeight: '1.5'
              }}>
                Are you sure you want to exchange {selectedCryptoForExchange.name} for $100,000? This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => setShowExchangeModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                  e.currentTarget.style.borderColor = '#9ca3af'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#d1d5db'
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Check if exchange is already in progress
                  if (isExchanging) {
                    setError('An exchange is already in progress. Please wait for it to complete.')
                    return
                  }
                  
                  try {
                    setLoading(true)
                    setIsExchanging(true)
                    sessionStorage.setItem('ongoingExchange', 'true')
                    
                    const cryptoSymbolMap = {
                      'bitcoin': 'BTC',
                      'ethereum': 'ETH',
                      'tether': 'USDT',
                      'ripple': 'XRP',
                      'binancecoin': 'BNB',
                      'solana': 'SOL'
                    }
                    
                    const exchangeData = {
                      user_id: user.id,
                      category: cryptoSymbolMap[selectedCryptoForExchange.id] || selectedCryptoForExchange.id,
                      amount: 100000
                    }
                    
                    const result = await cryptoAPI.exchangeCrypto(exchangeData)
                    setShowExchangeModal(false)
                    
                    // Navigate to exchange success page
                    navigate('/exchange-success', {
                      state: {
                        exchangeData: {
                          ...exchangeData,
                          status: result.Status || 'Processing'
                        }
                      }
                    })
                  } catch (error) {
                    setError(error.message || 'Exchange failed. Please try again.')
                    setIsExchanging(false)
                    sessionStorage.removeItem('ongoingExchange')
                    setLoading(false)
                  }
                }}
                disabled={loading || isExchanging}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: loading ? '#9ca3af' : '#10b981',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#059669'
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = '#10b981'
                }}
              >
                {loading ? 'Processing...' : 'Confirm Exchange'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default Dashboard
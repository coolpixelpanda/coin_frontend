import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { cryptoAPI } from '../services/api'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import logoImg from '../Images/logo.png'
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)
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
  const [isExchanging, setIsExchanging] = useState(false)
  const [showExchangeInProgressModal, setShowExchangeInProgressModal] = useState(false)
  const [showCryptoDetailsModal, setShowCryptoDetailsModal] = useState(false)
  const [selectedCryptoDetails, setSelectedCryptoDetails] = useState(null)
  const [cryptoChartData, setCryptoChartData] = useState({})
  const paymentDropdownRef = useRef(null)
  const cryptoDropdownRef = useRef(null)
  
  // Check if user qualifies for VIP (balance >= $100,000)
  const isVipEligible = Number(user?.total_amount || 0) >= 100000

  // Function to cancel ongoing exchange
  const cancelExchange = () => {
    if (user?.id) {
      // Get exchange data to find wallet address for countdown cleanup
      const currentExchangeDataKey = `currentExchangeData_${user.id}`
      const storedExchangeData = localStorage.getItem(currentExchangeDataKey) || sessionStorage.getItem('currentExchangeData')
      
      if (storedExchangeData) {
        try {
          const exchangeData = JSON.parse(storedExchangeData)
          // Clear countdown keys based on wallet address if we can determine it
          // We'll clear all countdown keys to be safe
        } catch (e) {
          console.error('Error parsing exchange data for cleanup:', e)
        }
      }
      
      // Clear from localStorage
      localStorage.removeItem(`ongoingExchange_${user.id}`)
      localStorage.removeItem(currentExchangeDataKey)
      
      // Clear all multiplier keys for this user from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`receiving_multiplier_${user.id}_`)) {
          localStorage.removeItem(key)
        }
      })
    }
    
    // Clear from sessionStorage
    sessionStorage.removeItem('ongoingExchange')
    sessionStorage.removeItem('currentExchangeData')
    
    // Clear all multiplier keys from sessionStorage
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('receiving_multiplier_')) {
        sessionStorage.removeItem(key)
      }
      // Clear countdown timer keys
      if (key.startsWith('exchange_countdown_')) {
        sessionStorage.removeItem(key)
      }
      if (key.endsWith('_start')) {
        sessionStorage.removeItem(key)
      }
    })
    
    // Reset exchange form to default state
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
    
    // Reset state
    setIsExchanging(false)
    setShowExchangeInProgressModal(false)
    setError('')
    setSuccess('Exchange cancelled successfully.')
    
    // Show notification
    setTimeout(() => {
      setSuccess('')
    }, 3000)
  }

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
  

  // Load chart data for all cryptos with caching
  useEffect(() => {
    const CACHE_KEY = 'crypto_chart_data_cache'
    const CACHE_DURATION = 3600000 // 1 hour in milliseconds
    
    const loadAllChartData = async (forceRefresh = false, retryFailed = false) => {
      const coinGeckoMap = {
        'bitcoin': 'bitcoin',
        'ethereum': 'ethereum',
        'tether': 'tether',
        'ripple': 'ripple',
        'binancecoin': 'binancecoin',
        'solana': 'solana'
      }
      
      // Try to load from cache first (unless forcing refresh or retrying failed)
      if (!forceRefresh && !retryFailed) {
        try {
          const cachedDataStr = localStorage.getItem(CACHE_KEY)
          if (cachedDataStr) {
            const cachedData = JSON.parse(cachedDataStr)
            const cacheAge = Date.now() - cachedData.timestamp
            
            // If cache is less than 1 hour old, use it
            if (cacheAge < CACHE_DURATION && cachedData.data) {
              console.log('Using cached chart data')
              setCryptoChartData(cachedData.data)
              
              // Still fetch new data in background if cache is getting old (>50 minutes)
              if (cacheAge > 3000000) { // 50 minutes
                setTimeout(() => loadAllChartData(true, false), 0)
              }
              return
            }
          }
        } catch (error) {
          console.error('Error reading chart cache:', error)
        }
      }
      
      // Fetch fresh data from API with retry logic
      console.log('Fetching fresh chart data from API')
      
      // Helper function to fetch chart data with retry
      const fetchChartDataWithRetry = async (coinId, geckoId, retryCount = 0, maxRetries = 3) => {
        try {
          console.log(`📡 [${coinId}] Making API request to CoinGecko (attempt ${retryCount + 1})...`)
          const historyData = await cryptoAPI.getCoinGeckoHistory(geckoId, 1)
          console.log(`✅ [${coinId}] API request successful, received ${Array.isArray(historyData) ? historyData.length : 0} data points`)
          // API returns array of { timestamp, price } objects
          const prices = Array.isArray(historyData) ? historyData : []
          const last24Hours = prices.slice(-24)
          
          console.log(`Successfully loaded chart data for ${coinId}`)
          return {
            [coinId]: {
              prices: last24Hours.map(item => item.price || 0),
              labels: last24Hours.map((item) => {
                const timestamp = item.timestamp
                const date = new Date(timestamp)
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              })
            }
          }
        } catch (error) {
          console.error(`Failed to load chart data for ${coinId} (attempt ${retryCount + 1}/${maxRetries + 1}):`, error)
          
          // Check if it's a rate limit error (429)
          const isRateLimit = error?.status === 429 || error?.response?.status === 429
          const retryAfter = error?.headers?.['retry-after'] || error?.response?.headers?.['retry-after']
          
          // If we haven't exceeded max retries, retry
          if (retryCount < maxRetries) {
            // Calculate delay: respect Retry-After header for 429, otherwise exponential backoff
            let delay
            if (isRateLimit) {
              if (retryAfter) {
                delay = parseInt(retryAfter) * 1000 // Convert seconds to milliseconds
                console.log(`Rate limited for ${coinId}, waiting ${retryAfter} seconds before retry`)
              } else {
                delay = 60000 // Default 60 seconds for rate limit
                console.log(`Rate limited for ${coinId}, waiting 60 seconds before retry`)
              }
            } else {
              delay = Math.min(1000 * Math.pow(2, retryCount), 10000) // Exponential backoff: 1s, 2s, 4s, max 10s
              console.log(`Retrying ${coinId} in ${delay/1000} seconds...`)
            }
            
            await new Promise(resolve => setTimeout(resolve, delay))
            console.log(`Retrying chart data fetch for ${coinId} (attempt ${retryCount + 2})...`)
            return fetchChartDataWithRetry(coinId, geckoId, retryCount + 1, maxRetries)
          }
          
          // If all retries failed, try to use cached data for this coin
          try {
            const cachedDataStr = localStorage.getItem(CACHE_KEY)
            if (cachedDataStr) {
              const cachedData = JSON.parse(cachedDataStr)
              if (cachedData.data && cachedData.data[coinId]) {
                console.log(`Using cached data for ${coinId} after all retries failed`)
                return { [coinId]: cachedData.data[coinId] }
              }
            }
          } catch (cacheError) {
            console.error(`Error reading cached data for ${coinId}:`, cacheError)
          }
          
          // Return empty data if everything failed
          console.warn(`Could not load chart data for ${coinId} after ${maxRetries + 1} attempts`)
          return { [coinId]: { prices: [], labels: [] } }
        }
      }
      
      const chartDataPromises = Object.keys(coinGeckoMap).map(async (coinId) => {
        const geckoId = coinGeckoMap[coinId]
        return fetchChartDataWithRetry(coinId, geckoId, 0, 3)
      })
      
      const results = await Promise.all(chartDataPromises)
      const combinedData = results.reduce((acc, item) => ({ ...acc, ...item }), {})
      
      // Update chart data immediately with whatever we got (even partial data)
      // This ensures charts display as soon as data is available
      const currentChartData = { ...cryptoChartData }
      const missingCoins = []
      
      Object.keys(coinGeckoMap).forEach(coinId => {
        const coinData = combinedData[coinId]
        // Check if we got valid data
        if (coinData && coinData.prices && coinData.prices.length > 0) {
          console.log(`✅ [${coinId}] Has valid chart data (${coinData.prices.length} points)`)
          currentChartData[coinId] = coinData
        } else {
          // This coin is missing data
          console.log(`❌ [${coinId}] Missing chart data - coinData:`, coinData)
          missingCoins.push(coinId)
          
          // Try to use cached data for this coin if available
          try {
            const cachedDataStr = localStorage.getItem(CACHE_KEY)
            if (cachedDataStr) {
              const cachedData = JSON.parse(cachedDataStr)
              if (cachedData.data && cachedData.data[coinId] && cachedData.data[coinId].prices && cachedData.data[coinId].prices.length > 0) {
                console.log(`📦 [${coinId}] Using cached data while retrying`)
                currentChartData[coinId] = cachedData.data[coinId]
              } else {
                console.log(`⚠️ [${coinId}] No valid cached data available`)
              }
            }
          } catch (cacheError) {
            console.error(`Error reading cached data for ${coinId}:`, cacheError)
          }
        }
      })
      
      // Update state with available data (including cached data)
      setCryptoChartData(currentChartData)
      
      // If any coins are missing data, retry them automatically after a short delay
      // Always retry missing coins, regardless of retryFailed flag
      if (missingCoins.length > 0) {
        const retryDelay = Math.min(2000 + (missingCoins.length * 500), 5000) // 2-5 seconds based on number of missing coins
        console.log(`⚠️ Missing chart data for ${missingCoins.length} coin(s): ${missingCoins.join(', ')}. Retrying in ${retryDelay/1000} seconds...`)
        
        setTimeout(async () => {
          console.log(`🔄 Starting retry for missing coins: ${missingCoins.join(', ')}`)
          
          // Retry only the missing coins with fresh API calls
          const retryPromises = missingCoins.map(async (coinId) => {
            const geckoId = coinGeckoMap[coinId]
            console.log(`📡 Sending API request for ${coinId} (${geckoId})...`)
            return fetchChartDataWithRetry(coinId, geckoId, 0, 3)
          })
          
          const retryResults = await Promise.all(retryPromises)
          const retryCombinedData = retryResults.reduce((acc, item) => ({ ...acc, ...item }), {})
          
          // Update chart data with retry results
          const updatedChartData = { ...currentChartData }
          const stillMissingCoins = []
          
          Object.keys(retryCombinedData).forEach(coinId => {
            const coinData = retryCombinedData[coinId]
            if (coinData.prices && coinData.prices.length > 0) {
              updatedChartData[coinId] = coinData
              console.log(`✅ Successfully loaded chart data for ${coinId} on retry`)
            } else {
              stillMissingCoins.push(coinId)
              console.log(`❌ Still missing data for ${coinId} after retry`)
            }
          })
          
          setCryptoChartData(updatedChartData)
          
          // If still missing, retry again (but with longer delay to avoid rate limits)
          if (stillMissingCoins.length > 0) {
            console.log(`⚠️ Still missing data for ${stillMissingCoins.length} coin(s): ${stillMissingCoins.join(', ')}. Will retry again in 10 seconds...`)
            setTimeout(() => {
              console.log(`🔄 Starting second retry for: ${stillMissingCoins.join(', ')}`)
              // Create a focused retry function for just these coins
              const secondRetryPromises = stillMissingCoins.map(async (coinId) => {
                const geckoId = coinGeckoMap[coinId]
                console.log(`📡 Sending second API request for ${coinId} (${geckoId})...`)
                return fetchChartDataWithRetry(coinId, geckoId, 0, 3)
              })
              
              Promise.all(secondRetryPromises).then(secondRetryResults => {
                const secondRetryCombinedData = secondRetryResults.reduce((acc, item) => ({ ...acc, ...item }), {})
                const finalChartData = { ...updatedChartData }
                
                Object.keys(secondRetryCombinedData).forEach(coinId => {
                  const coinData = secondRetryCombinedData[coinId]
                  if (coinData.prices && coinData.prices.length > 0) {
                    finalChartData[coinId] = coinData
                    console.log(`✅ Successfully loaded chart data for ${coinId} on second retry`)
                  }
                })
                
                setCryptoChartData(finalChartData)
                
                // Save to cache
                try {
                  const cacheData = {
                    timestamp: Date.now(),
                    data: finalChartData
                  }
                  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
                  console.log('Chart data cached successfully after retries')
                } catch (error) {
                  console.error('Error saving chart cache:', error)
                }
              })
            }, 10000) // Wait 10 seconds before next retry to avoid rate limits
          } else {
            // All charts loaded successfully, save to cache
            try {
              const cacheData = {
                timestamp: Date.now(),
                data: updatedChartData
              }
              localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
              console.log('✅ All chart data loaded and cached successfully')
            } catch (error) {
              console.error('Error saving chart cache:', error)
            }
          }
        }, retryDelay)
      }
      
      // Save valid data to cache
      const validData = {}
      Object.keys(combinedData).forEach(coinId => {
        const coinData = combinedData[coinId]
        if (coinData.prices && coinData.prices.length > 0) {
          validData[coinId] = coinData
        }
      })
      
      if (Object.keys(validData).length > 0) {
        try {
          // Merge with existing cache to preserve data for coins that weren't fetched
          const cachedDataStr = localStorage.getItem(CACHE_KEY)
          let existingCache = {}
          if (cachedDataStr) {
            try {
              const cachedData = JSON.parse(cachedDataStr)
              if (cachedData.data) {
                existingCache = cachedData.data
              }
            } catch (e) {
              // Ignore cache parse errors
            }
          }
          
          const cacheData = {
            timestamp: Date.now(),
            data: { ...existingCache, ...validData }
          }
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
          console.log('Chart data cached successfully')
        } catch (error) {
          console.error('Error saving chart cache:', error)
        }
      }
    }
    
    // Load data on mount (will use cache if available)
    loadAllChartData(false, false)
    
    // Set up interval to refresh every hour
    const chartInterval = setInterval(() => {
      loadAllChartData(true, false)
    }, 3600000) // Update every 1 hour
    
    return () => clearInterval(chartInterval)
  }, [])

  useEffect(() => {
    loadCryptoPrices(true) // Show loading indicator on initial load
    
    // Check if there's an ongoing exchange in localStorage (keyed by user ID)
    if (user?.id) {
      const ongoingExchangeKey = `ongoingExchange_${user.id}`
      const currentExchangeDataKey = `currentExchangeData_${user.id}`
      
      const ongoingExchange = localStorage.getItem(ongoingExchangeKey)
      if (ongoingExchange === 'true') {
        setIsExchanging(true)
      }
      
      // Check if there's stored exchange data
      const storedExchangeData = localStorage.getItem(currentExchangeDataKey)
      if (storedExchangeData) {
        try {
          const exchangeData = JSON.parse(storedExchangeData)
          // Verify the exchange is still valid (not expired - 30 minutes)
          if (exchangeData.timestamp && (Date.now() - exchangeData.timestamp) < 1800000) { // 30 minutes
            setIsExchanging(true)
          } else {
            // Clear expired exchange data
            localStorage.removeItem(currentExchangeDataKey)
            localStorage.removeItem(ongoingExchangeKey)
            // Also clear sessionStorage for backward compatibility
            sessionStorage.removeItem('currentExchangeData')
            sessionStorage.removeItem('ongoingExchange')
          }
        } catch (e) {
          console.error('Error parsing stored exchange data:', e)
        }
      }
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
    if (showVipModal || showVipCongratulations) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showVipModal, showVipCongratulations])

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
      setShowExchangeInProgressModal(true)
      return
    }
    
    // Check minimum calculated USD value (amount * current price)
    const amount = parseFloat(exchangeForm.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    
    const currentPrice = cryptoPrices[exchangeForm.fromCrypto]?.price || 0
    const calculatedValue = amount * currentPrice
    if (calculatedValue < 10000) {
      setError(`Minimum exchange value is $10,000. Current value: $${calculatedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
      return
    }
    
    // Map crypto IDs to category names for API (define before validation)
    const cryptoSymbolMap = {
      'bitcoin': 'BITCOIN',
      'ethereum': 'ETHEREUM',
      'tether': 'TETHER',
      'ripple': 'XRP',
      'binancecoin': 'BNB',
      'solana': 'SOLANA'
    }

    // Validate crypto category mapping BEFORE setting any flags
    const category = cryptoSymbolMap[exchangeForm.fromCrypto]
    if (!category) {
      setError(`Invalid cryptocurrency selected: ${exchangeForm.fromCrypto}. Please select a valid cryptocurrency.`)
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    setIsExchanging(true)
    // Store in both localStorage (persistent) and sessionStorage (for backward compatibility)
    const ongoingExchangeKey = `ongoingExchange_${user.id}`
    localStorage.setItem(ongoingExchangeKey, 'true')
    sessionStorage.setItem('ongoingExchange', 'true')

    try {
      
      // Get or generate receiving multiplier (random between 1.1 and 1.15)
      const multiplierKey = `receiving_multiplier_${user.id}_${exchangeForm.fromCrypto}_${calculatedValue}`
      let multiplier = sessionStorage.getItem(multiplierKey)
      if (!multiplier) {
        multiplier = (1.1 + Math.random() * 0.05).toFixed(4)
        sessionStorage.setItem(multiplierKey, multiplier)
      }
      
      const exchangeData = {
        user_id: user.id,
        category: category, // Use validated category
        amount: calculatedValue, // Send calculated USD value to API
        cryptoAmount: amount // Store the actual cryptocurrency amount entered by user
      }
      
      console.log('Sending exchange request:', exchangeData)
      const result = await cryptoAPI.exchangeCrypto(exchangeData)
      console.log('Exchange response:', result)
      
      // Store exchange data in localStorage (keyed by user ID) for persistence across sessions
      const currentExchangeDataKey = `currentExchangeData_${user.id}`
      const fullExchangeData = {
        ...exchangeData,
        status: result.Status || 'Processing',
        timestamp: Date.now(), // Fresh timestamp for new exchange
        receivingMultiplier: parseFloat(multiplier),
        cryptoType: exchangeForm.fromCrypto // Store crypto type for display
      }
      localStorage.setItem(currentExchangeDataKey, JSON.stringify(fullExchangeData))
      // Also store in sessionStorage for backward compatibility
      sessionStorage.setItem('currentExchangeData', JSON.stringify(fullExchangeData))
      
      // Clear any old countdown timer keys to ensure fresh start
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('exchange_countdown_') || key.endsWith('_start')) {
          sessionStorage.removeItem(key)
        }
      })
      
      // Navigate to exchange success page with exchange data
      navigate('/exchange-success', {
        state: {
          exchangeData: fullExchangeData
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
      // Clear from both localStorage and sessionStorage
      if (user?.id) {
        localStorage.removeItem(`ongoingExchange_${user.id}`)
        localStorage.removeItem(`currentExchangeData_${user.id}`)
      }
      sessionStorage.removeItem('ongoingExchange')
      sessionStorage.removeItem('currentExchangeData')
    }
    setLoading(false)
  }


  const isFormValid = () => {
    if (!exchangeForm.amount || !exchangeForm.paymentAccount) return false
    
    // Check minimum calculated USD value (amount * current price)
    const amount = parseFloat(exchangeForm.amount)
    if (isNaN(amount) || amount <= 0) return false
    
    const currentPrice = cryptoPrices[exchangeForm.fromCrypto]?.price || 0
    const calculatedValue = amount * currentPrice
    if (calculatedValue < 10000) return false
    
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
        padding: 'clamp(1rem, 2vw, 2rem) clamp(0.5rem, 2vw, 1rem)'
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
            padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: 'linear-gradient(135deg, #00CDCB 0%, #008B8A 100%)'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', 
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
                padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 2vw, 1.5rem)',
                border: 'none',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                fontWeight: '400',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
                whiteSpace: 'nowrap'
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
              <span className="refresh-text">{loading ? 'Refreshing...' : 'Refresh All'}</span>
            </button>
          </div>

          {/* Crypto List */}
          <div style={{ padding: '0', overflowX: 'auto' }}>
            <style>{`
              @media (max-width: 1024px) {
                .crypto-row {
                  flex-wrap: wrap !important;
                  padding: 1rem !important;
                  gap: 1rem !important;
                }
                .crypto-icon-name { flex: 1 1 100% !important; min-width: 100% !important; }
                .crypto-price { flex: 1 1 calc(50% - 0.5rem) !important; min-width: calc(50% - 0.5rem) !important; }
                .crypto-changes { flex: 1 1 100% !important; min-width: 100% !important; order: 4 !important; }
                .crypto-chart { flex: 1 1 100% !important; min-width: 100% !important; max-width: 100% !important; order: 5 !important; }
              }
              @media (max-width: 768px) {
                .crypto-row {
                  padding: 0.75rem !important;
                  gap: 0.75rem !important;
                }
                .crypto-price { flex: 1 1 100% !important; min-width: 100% !important; text-align: left !important; }
              }
              @media (max-width: 640px) {
                .refresh-text { display: none !important; }
              }
            `}</style>
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
              // Generate consistent multiplier per crypto for table display
              const multiplierKey = `receiving_multiplier_table_${crypto.id}`
              let multiplier = sessionStorage.getItem(multiplierKey)
              if (!multiplier) {
                multiplier = (1.1 + Math.random() * 0.05).toFixed(4)
                sessionStorage.setItem(multiplierKey, multiplier)
              }
              const receivingPrice = currentPrice * parseFloat(multiplier)
              
              return (
                <div 
                key={crypto.id} 
                onClick={() => {
                  setSelectedCryptoDetails(crypto)
                  setShowCryptoDetailsModal(true)
                }}
                className="crypto-row"
                style={{ 
                  padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
                  borderBottom: index < 5 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'clamp(1rem, 2vw, 2rem)',
                  transition: 'background-color 0.2s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  minWidth: 'min-content'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                >
                  {/* Icon and Name */}
                  <div className="crypto-icon-name" style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(0.75rem, 1.5vw, 1rem)',
                    flex: '0 1 auto',
                    minWidth: 'clamp(120px, 15vw, 180px)',
                    flexShrink: 0
                  }}>
                    <div style={{ 
                      width: 'clamp(2.5rem, 4vw, 3rem)',
                      height: 'clamp(2.5rem, 4vw, 3rem)',
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
                        fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                        fontWeight: '400',
                        color: '#111827',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {crypto.name}
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                        color: '#6b7280'
                      }}>
                        {crypto.symbol}
                      </div>
                    </div>
                  </div>

                  {/* Current Price */}
                  <div className="crypto-price" style={{ 
                    flex: '0 1 auto',
                    textAlign: 'right',
                    minWidth: 'clamp(100px, 12vw, 140px)',
                    flexShrink: 0
                  }}>
                    <div style={{ 
                      fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                      fontWeight: '400',
                      color: '#111827',
                      whiteSpace: 'nowrap'
                    }}>
                      $<SmoothNumber value={currentPrice} duration={800} decimals={crypto.decimals} />
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                      color: '#6b7280'
                    }}>
                      Current Price
                    </div>
                  </div>

                  {/* Receiving Value */}
                  <div className="crypto-price" style={{ 
                    flex: '0 1 auto',
                    textAlign: 'right',
                    minWidth: 'clamp(100px, 12vw, 140px)',
                    flexShrink: 0
                  }}>
                    <div style={{ 
                      fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
                      fontWeight: '400',
                      color: '#10b981',
                      whiteSpace: 'nowrap'
                    }}>
                      $<SmoothNumber value={receivingPrice} duration={800} decimals={crypto.decimals} />
                    </div>
                    <div style={{ 
                      fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                      color: '#6b7280'
                    }}>
                      Receiving Value
                    </div>
                  </div>

                  {/* Timeframe Changes */}
                  <div className="crypto-changes" style={{ 
                    display: 'flex',
                    gap: 'clamp(0.5rem, 1vw, 1rem)',
                    flex: '0 1 auto',
                    justifyContent: 'center',
                    minWidth: 'clamp(180px, 22vw, 240px)',
                    flexShrink: 0
                  }}>
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '50px' }}>
                      <div style={{ 
                        fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        1H
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                        fontWeight: '400',
                        color: data?.change_1h >= 0 ? '#10b981' : '#ef4444',
                        whiteSpace: 'nowrap'
                      }}>
                        <SmoothNumber value={data?.change_1h} duration={600} decimals={2} showSign={true} />%
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '50px' }}>
                      <div style={{ 
                        fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        24H
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                        fontWeight: '400',
                        color: data?.change_24h >= 0 ? '#10b981' : '#ef4444',
                        whiteSpace: 'nowrap'
                      }}>
                        <SmoothNumber value={data?.change_24h} duration={600} decimals={2} showSign={true} />%
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, minWidth: '50px' }}>
                      <div style={{ 
                        fontSize: 'clamp(0.625rem, 1vw, 0.75rem)',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        7D
                      </div>
                      <div style={{ 
                        fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                        fontWeight: '400',
                        color: data?.change_7d >= 0 ? '#10b981' : '#ef4444',
                        whiteSpace: 'nowrap'
                      }}>
                        <SmoothNumber value={data?.change_7d} duration={600} decimals={2} showSign={true} />%
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="crypto-chart" style={{ 
                    flex: '0 1 auto',
                    minWidth: 'clamp(150px, 18vw, 180px)',
                    maxWidth: 'clamp(180px, 22vw, 220px)',
                    height: 'clamp(35px, 4vw, 40px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {(() => {
                      // Simple sparkline chart using SVG
                      const prices = cryptoChartData[crypto.id]?.prices || []
                      if (prices.length === 0) {
                        return <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Loading...</div>
                      }
                      
                      const minPrice = Math.min(...prices)
                      const maxPrice = Math.max(...prices)
                      const range = maxPrice - minPrice || 1
                      const width = Math.min(200, window.innerWidth < 768 ? 150 : 200)
                      const height = Math.min(40, window.innerWidth < 768 ? 35 : 40)
                      const stepX = width / (prices.length - 1)
                      
                      const pathData = prices.map((price, index) => {
                        const x = index * stepX
                        const y = height - ((price - minPrice) / range) * height
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')
                      
                      const isPositive = prices[prices.length - 1] > prices[0]
                      const lineColor = isPositive ? '#10b981' : '#ef4444'
                      
                      return (
                        <svg width={width} height={height} style={{ overflow: 'visible' }}>
                          <path
                            d={pathData}
                            fill="none"
                            stroke={lineColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )
                    })()}
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

            {isExchanging && (
              <div style={{ 
                backgroundColor: '#fef3c7',
                border: '1px solid #fbbf24',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  flex: 1
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#92400e',
                    margin: 0,
                    fontWeight: '400',
                    marginBottom: '0.25rem'
                  }}>
                    Exchange in Progress
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#92400e',
                    margin: 0,
                    opacity: 0.8
                  }}>
                    You have an uncompleted exchange currently processing. Please complete the current exchange before starting a new one or you can cancel current process.
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Navigate to exchange success page
                    const currentExchangeDataKey = `currentExchangeData_${user?.id}`
                    const storedExchangeData = localStorage.getItem(currentExchangeDataKey) || sessionStorage.getItem('currentExchangeData')
                    if (storedExchangeData) {
                      try {
                        const exchangeData = JSON.parse(storedExchangeData)
                        navigate('/exchange-success', {
                          state: {
                            exchangeData: exchangeData
                          }
                        })
                      } catch (e) {
                        console.error('Error parsing stored exchange data:', e)
                        navigate('/exchange-success')
                      }
                    } else {
                      navigate('/exchange-success')
                    }
                  }}
                  style={{
                    padding: '0.625rem 1.25rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    backgroundColor: '#00CDCB',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(0, 205, 203, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#00B8B6'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#00CDCB'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  View Current Status
                </button>
                <button
                  onClick={cancelExchange}
                  style={{
                    padding: '0.625rem 1.25rem',
                    border: '1px solid #ef4444',
                    borderRadius: '0.5rem',
                    backgroundColor: 'white',
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2'
                    e.currentTarget.style.borderColor = '#dc2626'
                    e.currentTarget.style.color = '#dc2626'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                    e.currentTarget.style.borderColor = '#ef4444'
                    e.currentTarget.style.color = '#ef4444'
                  }}
                >
                  Cancel
                </button>
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
                  min="0"
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
                  placeholder="Enter amount"
                  required
                />
                {exchangeForm.amount && parseFloat(exchangeForm.amount) > 0 && cryptoPrices[exchangeForm.fromCrypto] && (() => {
                  const amount = parseFloat(exchangeForm.amount)
                  const currentPrice = cryptoPrices[exchangeForm.fromCrypto]?.price || 0
                  const calculatedValue = amount * currentPrice
                  if (calculatedValue < 10000) {
                    return (
                      <p style={{ 
                        marginTop: '0.5rem', 
                        fontSize: '0.75rem', 
                        color: '#ef4444' 
                      }}>
                        Minimum exchange value is $10,000. Current value: ${calculatedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    )
                  }
                  return null
                })()}
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
                      const coinPrice = cryptoPrices[exchangeForm.fromCrypto]?.price || 0
                      const currentPrice = amount * coinPrice // Total USD value
                      // Get or generate receiving multiplier (random between 1.1 and 1.15)
                      // Use calculated USD value rounded to avoid key changes on small amount changes
                      const calculatedValueRounded = Math.round(currentPrice)
                      const multiplierKey = `receiving_multiplier_${user?.id}_${exchangeForm.fromCrypto}_${calculatedValueRounded}`
                      let multiplier = sessionStorage.getItem(multiplierKey)
                      if (!multiplier) {
                        multiplier = (1.1 + Math.random() * 0.05).toFixed(4)
                        sessionStorage.setItem(multiplierKey, multiplier)
                      }
                      const receivingPrice = currentPrice * parseFloat(multiplier) // Receiving price based on current price
                      
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
                              ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: '0.5rem',
                            borderTop: '1px solid #e5e7eb'
                          }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Receiving Price:</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#10b981' }}>
                              ${receivingPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
                Unlock exclusive VIP Trading features including premium exchange rates, priority support, and advanced trading tools for high-volume traders.
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
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(251, 191, 36, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 6px 12px -1px rgba(251, 191, 36, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(251, 191, 36, 0.3)'
                }}
              >
                <Star size={16} fill="white" color="white" />
                Unlock VIP Trading
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Exchange In Progress Modal */}
      {showExchangeInProgressModal && (
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
          padding: '1rem'
        }}
        onClick={() => setShowExchangeInProgressModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: '400',
                color: '#111827',
                margin: 0
              }}>
                Exchange In Progress
              </h2>
              <button
                onClick={() => setShowExchangeInProgressModal(false)}
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
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

            <div style={{
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'start',
                gap: '0.75rem',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.75rem',
                border: '1px solid #fbbf24',
                marginBottom: '1rem'
              }}>
                <AlertTriangle size={20} color="#92400e" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                <p style={{
                  fontSize: '0.875rem',
                  color: '#92400e',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  You have an uncompleted exchange currently in processing. Please complete the current exchange process before starting a new one.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button
                onClick={() => setShowExchangeInProgressModal(false)}
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
              <button
                onClick={cancelExchange}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid #ef4444',
                  borderRadius: '0.5rem',
                  backgroundColor: 'white',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2'
                  e.currentTarget.style.borderColor = '#dc2626'
                  e.currentTarget.style.color = '#dc2626'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#ef4444'
                  e.currentTarget.style.color = '#ef4444'
                }}
              >
                Cancel Exchange
              </button>
              <button
                onClick={() => {
                  setShowExchangeInProgressModal(false)
                  // Navigate to exchange success page
                  const currentExchangeDataKey = `currentExchangeData_${user?.id}`
                  const storedExchangeData = localStorage.getItem(currentExchangeDataKey) || sessionStorage.getItem('currentExchangeData')
                  if (storedExchangeData) {
                    try {
                      const exchangeData = JSON.parse(storedExchangeData)
                      navigate('/exchange-success', {
                        state: {
                          exchangeData: exchangeData
                        }
                      })
                    } catch (e) {
                      console.error('Error parsing stored exchange data:', e)
                      navigate('/exchange-success')
                    }
                  } else {
                    navigate('/exchange-success')
                  }
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  backgroundColor: '#00CDCB',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 14px rgba(0, 205, 203, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00B8B6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00CDCB'
                }}
              >
                View Current Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crypto Details Modal */}
      {showCryptoDetailsModal && selectedCryptoDetails && (
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
          padding: '1rem'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowCryptoDetailsModal(false)
          }
        }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem'
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
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00CDCB'
                }}>
                  {selectedCryptoDetails.icon}
                </div>
                <div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    color: '#111827',
                    margin: 0
                  }}>
                    {selectedCryptoDetails.name}
                  </h2>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {selectedCryptoDetails.symbol}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCryptoDetailsModal(false)}
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

            {/* Current Price */}
            {(() => {
              const data = cryptoPrices[selectedCryptoDetails.id]
              const currentPrice = data?.price || 0
              return (
                <div style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    Current Price
                  </div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '400',
                    color: '#111827'
                  }}>
                    $<SmoothNumber value={currentPrice} duration={800} decimals={selectedCryptoDetails.decimals} />
                  </div>
                </div>
              )
            })()}

            {/* Chart */}
            {(() => {
              const chartData = cryptoChartData[selectedCryptoDetails.id]
              if (!chartData || chartData.prices.length === 0) {
                return (
                  <div style={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Loading chart data...</div>
                  </div>
                )
              }

              // Calculate min and max from actual data
              const prices = chartData.prices.filter(p => p > 0 && !isNaN(p))
              if (prices.length === 0) {
                return (
                  <div style={{
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    marginBottom: '2rem'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>No chart data available</div>
                  </div>
                )
              }
              
              const minPrice = Math.min(...prices)
              const maxPrice = Math.max(...prices)
              const priceRange = maxPrice - minPrice
              
              // Add padding (5% on each side) to make chart more readable
              const padding = priceRange > 0 ? priceRange * 0.05 : (maxPrice * 0.0001) // Use 0.01% if range is 0
              const yMin = Math.max(0, minPrice - padding)
              const yMax = maxPrice + padding
              
              // Calculate appropriate step size for Y-axis ticks
              // For small ranges (like Tether), use smaller steps
              const decimals = selectedCryptoDetails.decimals || 2
              let stepSize
              if (priceRange < 0.01) {
                // Very small range (like Tether around $1.00)
                stepSize = Math.pow(10, -decimals) * 2 // e.g., 0.0002 for 4 decimals
              } else if (priceRange < 1) {
                stepSize = 0.01
              } else if (priceRange < 10) {
                stepSize = 0.1
              } else if (priceRange < 100) {
                stepSize = 1
              } else {
                stepSize = undefined // Let Chart.js auto-calculate for large ranges
              }

              const chartConfig = {
                labels: chartData.labels,
                datasets: [{
                  label: `${selectedCryptoDetails.name} Price`,
                  data: chartData.prices,
                  borderColor: '#00CDCB',
                  backgroundColor: 'rgba(0, 205, 203, 0.1)',
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 4
                }]
              }

              return (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '400',
                    color: '#111827',
                    marginBottom: '1rem'
                  }}>
                    24 Hour Price Chart
                  </h3>
                  <div style={{
                    height: '300px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    padding: '1rem'
                  }}>
                    <Line
                      data={chartConfig}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                              label: function(context) {
                                const decimals = selectedCryptoDetails.decimals || 2
                                return `$${context.parsed.y.toFixed(decimals)}`
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            display: true,
                            grid: {
                              display: false
                            }
                          },
                          y: {
                            display: true,
                            min: yMin,
                            max: yMax,
                            grid: {
                              color: '#e5e7eb'
                            },
                            ticks: {
                              callback: function(value) {
                                const decimals = selectedCryptoDetails.decimals || 2
                                return '$' + value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
                              },
                              stepSize: stepSize
                            }
                          }
                        },
                        interaction: {
                          mode: 'nearest',
                          axis: 'x',
                          intersect: false
                        }
                      }}
                    />
                  </div>
                </div>
              )
            })()}

            {/* Percentage Changes */}
            {(() => {
              const data = cryptoPrices[selectedCryptoDetails.id]
              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem'
                    }}>
                      1H Change
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '400',
                      color: data?.change_1h >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      <SmoothNumber value={data?.change_1h} duration={600} decimals={2} showSign={true} />%
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem'
                    }}>
                      24H Change
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '400',
                      color: data?.change_24h >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      <SmoothNumber value={data?.change_24h} duration={600} decimals={2} showSign={true} />%
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem'
                    }}>
                      7D Change
                    </div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: '400',
                      color: data?.change_7d >= 0 ? '#10b981' : '#ef4444'
                    }}>
                      <SmoothNumber value={data?.change_7d} duration={600} decimals={2} showSign={true} />%
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default Dashboard
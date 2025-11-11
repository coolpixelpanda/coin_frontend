import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { cryptoAPI } from '../services/api'
import logoImg from '../Images/logo.webp'
import { 
  Bitcoin, 
  Coins, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
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
      color: isAnimating ? '#000000' : '#111827',
      transition: 'color 0.3s ease'
    }}>
      {formatValue(displayValue)}
    </span>
  )
}

// Shared function to process chart data consistently
// The API already returns exactly 24 hourly data points, so we just validate and format
const processChartData = (historyData, currentPrice, maxPoints = 24) => {
  if (!historyData || !Array.isArray(historyData) || historyData.length === 0) {
    return null
  }
  
  // Sort by timestamp to ensure chronological order
  const sortedData = [...historyData].sort((a, b) => a.timestamp - b.timestamp)
  
  // Validate and filter data points
  const validData = sortedData.filter(point => 
    point && 
    point.timestamp && 
    point.price && 
    isFinite(point.price) && 
    point.price > 0
  )
  
  // Ensure we have at least 2 points
  if (validData.length < 2) {
    return null
  }
  
  // Take up to maxPoints (should be 24 for hourly data)
  let processedData = validData
  if (validData.length > maxPoints) {
    // If we have more than maxPoints, sample evenly
    const step = Math.ceil(validData.length / maxPoints)
    processedData = validData.filter((_, index) => index % step === 0 || index === validData.length - 1).slice(0, maxPoints)
  } else if (validData.length < maxPoints && validData.length >= 2) {
    // If we have less than 24 points but at least 2, use what we have
    processedData = validData
  }
  
  const now = Date.now()
  
  // Format the data
  const formattedData = processedData.map(item => ({
    timestamp: item.timestamp,
    price: Number(item.price),
    time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }))
  
  // Ensure last point matches current price exactly
  if (formattedData.length > 0 && currentPrice) {
    formattedData[formattedData.length - 1].price = Number(currentPrice)
    formattedData[formattedData.length - 1].timestamp = now
  }
  
  // Validate all prices are valid
  if (!formattedData.every(p => isFinite(p.price) && p.price > 0)) {
    return null
  }
  
  return formattedData
}

// Realistic Graph component for 1-day data
const RealisticGraph = ({ coinId, currentPrice, changes }) => {
  const [graphData, setGraphData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const loadingRef = useRef(false)
  
  useEffect(() => {
    const loadRealData = async () => {
      // Prevent concurrent loads
      if (loadingRef.current || !currentPrice || !coinId) return
      
      loadingRef.current = true
      setIsLoading(true)
      
      try {
        // Fetch real 24-hour historical data from CoinGecko
        const historyData = await cryptoAPI.getCoinGeckoHistory(coinId, 1)
        
        // Process data using shared function (get all 24 hourly points for small graph)
        const processedData = processChartData(historyData, currentPrice, 24)
        
        if (processedData && processedData.length >= 2) {
          setGraphData(processedData)
          setIsLoading(false)
        } else {
          // Fallback: generate mathematically correct data if API fails or insufficient data
          const now = Date.now()
          const change24h = changes?.change_24h || 0
          const data = []
          
          // Generate exactly 24 hourly data points
          if (Math.abs(change24h) < 0.01) {
            for (let i = 23; i >= 0; i--) {
              const timestamp = now - (i * 60 * 60 * 1000)
              data.push({
                timestamp,
                price: Number(currentPrice),
                time: new Date(timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              })
            }
          } else {
            const startPrice = Number(currentPrice) / (1 + change24h / 100)
            
            for (let i = 23; i >= 0; i--) {
              const timestamp = now - (i * 60 * 60 * 1000)
              const progress = (23 - i) / 23
              const price = startPrice + (Number(currentPrice) - startPrice) * progress
              
              data.push({
                timestamp,
                price: Math.max(0, price),
                time: new Date(timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
              })
            }
          }
          setGraphData(data)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error loading chart data:', error)
        setIsLoading(false)
        // Fallback: generate mathematically correct data if API fails
        const now = Date.now()
        const change24h = changes?.change_24h || 0
        const data = []
        
        if (Math.abs(change24h) < 0.01) {
          for (let i = 23; i >= 0; i--) {
            const timestamp = now - (i * 60 * 60 * 1000)
            data.push({
              timestamp,
              price: Number(currentPrice),
              time: new Date(timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            })
          }
        } else {
          const startPrice = Number(currentPrice) / (1 + change24h / 100)
          
          for (let i = 23; i >= 0; i--) {
            const timestamp = now - (i * 60 * 60 * 1000)
            const progress = (23 - i) / 23
            const price = startPrice + (Number(currentPrice) - startPrice) * progress
            
            data.push({
              timestamp,
              price: Math.max(0, price),
              time: new Date(timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })
            })
          }
        }
        setGraphData(data)
        setIsLoading(false)
      } finally {
        loadingRef.current = false
      }
    }
    
    loadRealData()
  }, [currentPrice, coinId, changes])
  
  if (isLoading || graphData.length === 0) {
    return (
      <div style={{ 
        width: '80px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}
      >
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Loading...</div>
      </div>
    )
  }
  
  // Safety check: ensure we have at least 2 points
  if (graphData.length < 2) {
    return (
      <div style={{ 
        width: '150px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Insufficient data</div>
      </div>
    )
  }
  
  // Calculate min/max for scaling
  const prices = graphData.map(d => d.price).filter(p => isFinite(p) && p > 0)
  if (prices.length === 0) {
    return (
      <div style={{ 
        width: '150px', 
        height: '40px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>No valid data</div>
      </div>
    )
  }
  
  let minPrice = Math.min(...prices)
  let maxPrice = Math.max(...prices)
  let priceRange = maxPrice - minPrice
  
  // If flat or near-flat, pad the range by ±0.5% to avoid a degenerate chart
  if (!isFinite(priceRange) || priceRange === 0) {
    const pad = (maxPrice || 1) * 0.005
    minPrice = (maxPrice || 1) - pad
    maxPrice = (maxPrice || 1) + pad
    priceRange = maxPrice - minPrice
  }
  
  // Create SVG path
  const width = 150
  const height = 40
  const padding = 4
  
  const points = graphData.map((point, index) => {
    const x = padding + (index / Math.max(1, graphData.length - 1)) * (width - 2 * padding)
    const y = padding + ((maxPrice - point.price) / Math.max(priceRange, 0.0001)) * (height - 2 * padding)
    return `${x},${y}`
  })
  
  const pathData = `M ${points.join(' L ')}`
  
  // Determine line color based on 24h change
  const lineColor = '#000000'
  
  return (
    <div 
      style={{ 
        width: '150px', 
        height: '40px', 
        position: 'relative'
      }}
      title="Click row to view detailed chart"
    >
      <svg width="150" height="40" style={{ position: 'absolute', top: 0, left: 0, cursor: 'none' }}>
        {/* Grid lines */}
        <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#f3f4f6" strokeWidth="0.5" />
        
        {/* Price line */}
        <path 
          d={pathData} 
          stroke={lineColor} 
          strokeWidth="1.5" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Start and end points */}
        {graphData.length > 0 && (
          <>
            <circle cx={padding} cy={padding + ((maxPrice - graphData[0].price) / Math.max(priceRange, 0.0001)) * (height - 2 * padding)} r="1.5" fill={lineColor} />
            <circle cx={width-padding} cy={padding + ((maxPrice - graphData[graphData.length-1].price) / Math.max(priceRange, 0.0001)) * (height - 2 * padding)} r="1.5" fill={lineColor} />
          </>
        )}
      </svg>
    </div>
  )
}

// Large Graph component for modal (last 24 hours for each coin)
const LargeGraph = ({ coinId, currentPrice, changes }) => {
  const [graphData, setGraphData] = useState([])
  const [hoverInfo, setHoverInfo] = useState(null) // { x, y, price, fullDateTime }
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const loadingRef = useRef(false)
  
  useEffect(() => {
    const loadRealData = async () => {
      // Prevent concurrent loads
      if (loadingRef.current || !currentPrice || !coinId) return
      
      loadingRef.current = true
      
      try {
        // Fetch historical data for the specific coin (last 24 hours)
        const historyData = await cryptoAPI.getCoinGeckoHistory(coinId, 1)
        
        // Process data using shared function (get all 24 hourly points for large graph)
        const processedData = processChartData(historyData, currentPrice, 24)
        
        if (processedData && processedData.length >= 2) {
          // Add additional formatting for large graph
          const formattedData = processedData.map(item => ({
            ...item,
            time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true
            }),
            date: new Date(item.timestamp).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            fullDateTime: new Date(item.timestamp).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })
          }))
          
          setGraphData(formattedData)
        } else {
          // Fallback: generate mathematically correct data if API fails or insufficient data
          const now = Date.now()
          const change24h = changes?.change_24h || 0
          const data = []
          
          // Generate exactly 24 hourly data points
          if (Math.abs(change24h) < 0.01) {
            for (let i = 23; i >= 0; i--) {
              const timestamp = now - (i * 60 * 60 * 1000)
              data.push({
                timestamp,
                price: Number(currentPrice),
                time: new Date(timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true
                }),
                date: new Date(timestamp).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }),
                fullDateTime: new Date(timestamp).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              })
            }
          } else {
            const startPrice = Number(currentPrice) / (1 + change24h / 100)
            
            for (let i = 23; i >= 0; i--) {
              const timestamp = now - (i * 60 * 60 * 1000)
              const progress = (23 - i) / 23
              const price = startPrice + (Number(currentPrice) - startPrice) * progress
              
              data.push({
                timestamp,
                price: Math.max(0, price),
                time: new Date(timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true
                }),
                date: new Date(timestamp).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }),
                fullDateTime: new Date(timestamp).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              })
            }
          }
          setGraphData(data)
        }
      } catch (error) {
        console.error('Error loading chart data:', error)
        // Fallback: generate mathematically correct data if API fails
        const now = Date.now()
        const change24h = changes?.change_24h || 0
        const data = []
        
        if (Math.abs(change24h) < 0.01) {
          for (let i = 23; i >= 0; i--) {
            const timestamp = now - (i * 60 * 60 * 1000)
            data.push({
              timestamp,
              price: Number(currentPrice),
              time: new Date(timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
              }),
              date: new Date(timestamp).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              fullDateTime: new Date(timestamp).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            })
          }
        } else {
          const startPrice = Number(currentPrice) / (1 + change24h / 100)
          
          for (let i = 23; i >= 0; i--) {
            const timestamp = now - (i * 60 * 60 * 1000)
            const progress = (23 - i) / 23
            const price = startPrice + (Number(currentPrice) - startPrice) * progress
            
            data.push({
              timestamp,
              price: Math.max(0, price),
              time: new Date(timestamp).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
              }),
              date: new Date(timestamp).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }),
              fullDateTime: new Date(timestamp).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            })
          }
        }
        setGraphData(data)
      } finally {
        loadingRef.current = false
      }
    }
    
    loadRealData()
  }, [currentPrice, coinId, changes])
  
  if (graphData.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <div style={{ fontSize: '1rem', color: '#6b7280' }}>Loading chart...</div>
      </div>
    )
  }
  
  // Safety check: ensure we have at least 2 points
  if (graphData.length < 2) {
    return (
      <div style={{ 
        width: '100%', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <div style={{ fontSize: '1rem', color: '#6b7280' }}>Insufficient data</div>
      </div>
    )
  }
  
  // Calculate min/max for scaling
  const prices = graphData.map(d => d.price).filter(p => isFinite(p) && p > 0)
  if (prices.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem'
      }}>
        <div style={{ fontSize: '1rem', color: '#6b7280' }}>No valid data</div>
      </div>
    )
  }
  
  let minPrice = Math.min(...prices)
  let maxPrice = Math.max(...prices)
  let priceRange = maxPrice - minPrice
  
  // If flat or near-flat, pad the range by ±0.5% to avoid a degenerate chart
  if (!isFinite(priceRange) || priceRange === 0) {
    const pad = (maxPrice || 1) * 0.005
    minPrice = (maxPrice || 1) - pad
    maxPrice = (maxPrice || 1) + pad
    priceRange = maxPrice - minPrice
  }
  
  // Create SVG path
  const width = 600
  const height = 300
  const padding = 40
  
  const points = graphData.map((point, index) => {
    const x = padding + (index / Math.max(1, graphData.length - 1)) * (width - 2 * padding)
    const y = padding + ((maxPrice - point.price) / Math.max(priceRange, 0.0001)) * (height - 2 * padding)
    return { x, y, ...point }
  })
  
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
  
  // Determine colors
  const lineColor = '#000000'
  const fillColor = '#f3f4f6' // Light gray fill
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xClient = e.clientX - rect.left
    const yClient = e.clientY - rect.top
    // Map from rendered pixels to SVG viewBox coordinates
    const x = (xClient / rect.width) * width
    const y = (yClient / rect.height) * height

    setMousePosition({ x, y })

    if (x < padding || x > width - padding || points.length < 2) {
      setHoverInfo(null)
      return
    }

    // Convert x back to fractional index across points
    const normalized = (x - padding) / Math.max(width - 2 * padding, 1)
    const clamped = Math.max(0, Math.min(1, normalized))
    const indexFloat = clamped * Math.max(1, points.length - 1)
    const leftIndex = Math.floor(indexFloat)
    const rightIndex = Math.min(points.length - 1, leftIndex + 1)
    const t = indexFloat - leftIndex

    const left = points[leftIndex]
    const right = points[rightIndex]

    if (!left || !right) {
      setHoverInfo(null)
      return
    }

    // Linear interpolation for price, y position, and timestamp
    const price = left.price + (right.price - left.price) * t
    const yInterpolated = padding + ((maxPrice - price) / Math.max(priceRange, 0.0001)) * (height - 2 * padding)
    const ts = left.timestamp + (right.timestamp - left.timestamp) * t
    const fullDateTime = new Date(ts).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    setHoverInfo({ x, y: yInterpolated, price, fullDateTime })
  }
  
  const handleMouseLeave = () => {
    setHoverInfo(null)
  }
  
  return (
    <div style={{ 
      width: '100%', 
      height: '300px',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: 'none' }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
          <line 
            key={ratio}
            x1={padding} 
            y1={padding + ratio * (height - 2 * padding)} 
            x2={width-padding} 
            y2={padding + ratio * (height - 2 * padding)} 
            stroke="#f3f4f6" 
            strokeWidth="1" 
          />
        ))}
        
        {/* Price area fill */}
        <path 
          d={`${pathData} L ${width-padding},${height-padding} L ${padding},${height-padding} Z`}
          fill={fillColor}
        />
        
        {/* Price line */}
        <path 
          d={pathData} 
          stroke={lineColor} 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.filter((_, index) => {
          const interval = Math.max(1, Math.floor(points.length / 20))
          return index % interval === 0
        }).map((point, index) => (
          <circle 
            key={index}
            cx={point.x} 
            cy={point.y} 
            r="3" 
            fill={lineColor}
            stroke="white"
            strokeWidth="2"
          />
        ))}
        
        {/* Hover line and tooltip - follows mouse cursor in real-time */}
        {mousePosition.x >= padding && mousePosition.x <= width - padding && hoverInfo && (
          <>
            {/* Vertical line at mouse cursor position */}
            <line 
              x1={mousePosition.x} 
              y1={padding} 
              x2={mousePosition.x} 
              y2={height-padding} 
              stroke="#000000" 
              strokeWidth="2" 
              strokeDasharray="5,5"
              opacity="0.8"
            />

            {/* Marker at interpolated point */}
            <circle cx={mousePosition.x} cy={hoverInfo.y} r="4" fill={lineColor} stroke="white" strokeWidth="2" />
            
            {/* Tooltip positioned above or below based on mouse position */}
            <g>
              <rect 
                x={Math.max(padding, Math.min(width - padding - 200, mousePosition.x - 100))} 
                y={mousePosition.y < height / 2 ? padding + 10 : mousePosition.y - 70} 
                width="200" 
                height="60" 
                fill="#000000"
                rx="8"
              />
              <text 
                x={Math.max(padding + 100, Math.min(width - padding - 100, mousePosition.x))} 
                y={mousePosition.y < height / 2 ? padding + 30 : mousePosition.y - 50} 
                fontSize="11" 
                fill="white"
                textAnchor="middle"
              >
                {hoverInfo.fullDateTime}
              </text>
              <text 
                x={Math.max(padding + 100, Math.min(width - padding - 100, mousePosition.x))} 
                y={mousePosition.y < height / 2 ? padding + 50 : mousePosition.y - 30} 
                fontSize="16" 
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
              >
                ${(() => {
                  // Use 4 decimals for Tether and XRP in tooltip
                  const decimals = (coinId === 'tether' || coinId === 'ripple') ? 4 : 2
                  return hoverInfo.price.toFixed(decimals)
                })()}
              </text>
            </g>
          </>
        )}
        
        {/* Y-axis labels with adaptive decimals */}
        {(() => {
          const ticks = [0, 0.25, 0.5, 0.75, 1]
          // Use 4 decimals for Tether and XRP, otherwise use adaptive decimals
          let decimals
          if (coinId === 'tether' || coinId === 'ripple') {
            decimals = 4
          } else {
            decimals = maxPrice < 0.01 ? 6 : maxPrice < 1 ? 4 : 2
          }
          return ticks.map((ratio, index) => {
            const price = maxPrice - (ratio * priceRange)
            return (
              <text 
                key={index}
                x={padding - 10} 
                y={padding + ratio * (height - 2 * padding) + 4} 
                fontSize="12" 
                fill="#6b7280"
                textAnchor="end"
              >
                ${price.toFixed(decimals)}
              </text>
            )
          })
        })()}
        
        {/* X-axis labels - 6 evenly spaced labels showing weekday and date */}
        {(() => {
          const numLabels = 6
          const step = Math.floor(graphData.length / (numLabels - 1))
          return graphData.filter((_, index) => index % step === 0 || index === graphData.length - 1)
            .slice(0, numLabels)
            .map((point, index) => {
              const actualIndex = graphData.indexOf(point)
              const x = padding + (actualIndex / (graphData.length - 1)) * (width - 2 * padding)
              const dateStr = new Date(point.timestamp).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })
              return (
                <text 
                  key={index}
                  x={x} 
                  y={height - padding + 15} 
                  fontSize="12" 
                  fill="#6b7280"
                  textAnchor="middle"
                >
                  {dateStr}
                </text>
              )
            })
        })()}
      </svg>
    </div>
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
  const [selectedCoin, setSelectedCoin] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showVipModal, setShowVipModal] = useState(false)
  const [showVipCongratulations, setShowVipCongratulations] = useState(false)
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false)
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false)
  const [paymentDropdownDirection, setPaymentDropdownDirection] = useState('down')
  const [cryptoDropdownDirection, setCryptoDropdownDirection] = useState('down')
  const [priceHistory, setPriceHistory] = useState({})
  const paymentDropdownRef = useRef(null)
  const cryptoDropdownRef = useRef(null)
  
  // Check if user qualifies for VIP (balance >= $10,000)
  const isVipEligible = Number(user?.total_amount || 0) >= 10000
  
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
    
    // Show congratulations modal when balance crosses the $10,000 threshold
    // Or on initial load if already at/above threshold
    // Only show once (check localStorage)
    if (portfolioBalance >= 10000 && !hasSeenCongratulations) {
      if (previousBalance === null || previousBalance < 10000) {
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
    if (showModal || showVipModal || showVipCongratulations) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showModal, showVipModal, showVipCongratulations])

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
    setLoading(true)
    setError('')
    setSuccess('')

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
        amount: parseFloat(exchangeForm.amount)
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
    }
    setLoading(false)
  }


  const isFormValid = () => {
    if (!exchangeForm.amount || !exchangeForm.paymentAccount) return false
    
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
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src={logoImg} 
                alt="CoinTransfer Logo" 
                style={{ 
                  height: '32px', 
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'brightness(0)'
                }} 
              />
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#000000',
                margin: 0
              }}>
                CoinTransfer
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link
                to="/"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#111827'
                  e.currentTarget.style.borderBottomColor = '#111827'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#374151'
                  e.currentTarget.style.borderBottomColor = 'transparent'
                }}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  borderBottom: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#111827'
                  e.currentTarget.style.borderBottomColor = '#111827'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#374151'
                  e.currentTarget.style.borderBottomColor = 'transparent'
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  if (isVipEligible) {
                    // Navigate to VIP trading page when unlocked
                    navigate('/vip-trading')
                  } else {
                    // Show locked modal when locked
                    setShowVipModal(true)
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: isVipEligible ? '#dcfce7' : '#fef3c7',
                  border: isVipEligible ? '1px solid #22c55e' : '1px solid #fbbf24',
                  borderRadius: '0.5rem',
                  color: isVipEligible ? '#166534' : '#92400e',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  position: 'relative',
                  opacity: 0.8,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.backgroundColor = isVipEligible ? '#bbf7d0' : '#fde68a'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.8'
                  e.currentTarget.style.backgroundColor = isVipEligible ? '#dcfce7' : '#fef3c7'
                }}
                title={isVipEligible ? "VIP Trading (Unlocked)" : "VIP Trading (Locked)"}
              >
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Star 
                    size={14} 
                    fill={isVipEligible ? "#22c55e" : "#fbbf24"} 
                    style={{
                      animation: 'starTwinkle 1.5s ease-in-out infinite',
                      animationDelay: '0s'
                    }}
                  />
                  <span>VIP trading</span>
                  <Star 
                    size={14} 
                    fill={isVipEligible ? "#22c55e" : "#fbbf24"} 
                    style={{
                      animation: 'starTwinkle 1.5s ease-in-out infinite',
                      animationDelay: '0.75s'
                    }}
                  />
                </div>
                {isVipEligible ? <Unlock size={14} /> : <Lock size={14} />}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Welcome, {user?.username}
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
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
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ 
        maxWidth: '1280px', 
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
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>
              ${Number(user?.total_amount || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : '—'}
            </div>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bitcoin (BTC)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
              ${cryptoPrices.bitcoin?.price ? cryptoPrices.bitcoin.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#4b5563' }}>
              {(cryptoPrices.bitcoin?.change_24h ?? 0).toFixed(2)}% 24h
            </div>
          </div>
          <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Ethereum (ETH)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
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
            fontWeight: 'bold', 
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
          width: '90%',
          margin: '3rem auto'
        }}>
          {/* Header with Refresh Button */}
          <div style={{ 
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#000000'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: 'white',
              margin: 0
            }}>
              <BarChart3 size={24} style={{ marginRight: '0.5rem' }} />
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
                fontWeight: '600',
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
              const calculatedValue = calculatedValues[crypto.id]
              
              return (
                <div key={crypto.id} style={{ 
                  padding: '1.5rem 2rem',
                  borderBottom: index < 5 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                onClick={() => {
                  setSelectedCoin({ ...crypto, data })
                  setShowModal(true)
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
                      color: '#000000',
                      flexShrink: 0
                    }}>
                      {crypto.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ 
                        fontSize: '1.125rem',
                        fontWeight: '600',
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
                      fontWeight: '700',
                      color: '#111827'
                    }}>
                      $<SmoothNumber value={data?.price} duration={800} decimals={crypto.decimals} />
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      Current Price
                    </div>
                  </div>

                  {/* Calculated Value */}
                  <div style={{ 
                    flex: '1 1 0',
                    textAlign: 'right',
                    minWidth: 0
                  }}>
                    <div style={{ 
                      fontSize: '1.125rem',
                      fontWeight: '600',
                      color: '#000000'
                    }}>
                      $<SmoothNumber value={calculatedValue} duration={800} decimals={crypto.decimals} />
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
                        fontWeight: '600',
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
                        fontWeight: '600',
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
                        fontWeight: '600',
                        color: '#4b5563'
                      }}>
                        <SmoothNumber value={data?.change_7d} duration={600} decimals={2} showSign={true} />%
                      </div>
                    </div>
                  </div>

                  {/* Graph */}
                  <div style={{ 
                    flex: '1 1 0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: 0
                  }}>
                    <RealisticGraph 
                      key={`${crypto.id}-${data?.price || 'loading'}`}
                      coinId={crypto.id}
                      currentPrice={data?.price}
                      changes={data}
                    />
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
                fontWeight: '600',
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
                      padding: '0.5rem 0.5rem',
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem',
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
                    padding: '0.5rem 0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter amount to exchange"
                  required
                />
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
                  <Wallet size={16} color="#6b7280" />
                  Payment Account
                </label>
                <div style={{ position: 'relative' }} data-payment-dropdown ref={paymentDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                    style={{
                      width: '100%',
                      height: '2.5rem',
                      padding: '0.5rem 0.5rem',
                      paddingLeft: '2.5rem',
                      paddingRight: '2.5rem',
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
                          <FaApplePay size={18} color="#000000" />
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
                disabled={loading || !isFormValid()}
                style={{
                  width: '100%',
                  height: '2.75rem',
                  backgroundColor: (loading || !isFormValid()) ? '#9ca3af' : '#000000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: (loading || !isFormValid()) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loading && isFormValid()) e.currentTarget.style.backgroundColor = '#1a1a1a'
                }}
                onMouseLeave={(e) => {
                  if (!loading && isFormValid()) e.currentTarget.style.backgroundColor = '#000000'
                }}
                onMouseDown={(e) => {
                  if (!loading && isFormValid()) e.currentTarget.style.backgroundColor = '#333333'
                }}
                onMouseUp={(e) => {
                  if (!loading && isFormValid()) e.currentTarget.style.backgroundColor = '#1a1a1a'
                }}
              >
                {loading ? 'Processing...' : 'Exchange Now'}
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

      {/* Coin Details Modal */}
      {showModal && selectedCoin && (
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
        onClick={() => setShowModal(false)}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  fontSize: '3rem',
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedCoin.icon}
                </div>
                <div>
                  <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#111827',
                    margin: 0
                  }}>
                    {selectedCoin.name}
                  </h2>
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {selectedCoin.symbol}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4f6',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '3rem',
                  height: '3rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                }}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              >
                  <X size={20} />
              </button>
            </div>

            {/* Price Information */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center'
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
                  fontWeight: '700',
                  color: '#111827'
                }}>
                  $<SmoothNumber value={cryptoPrices[selectedCoin.id]?.price || selectedCoin.data?.price} duration={800} decimals={selectedCoin.decimals} />
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  Calculated Value
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#000000'
                }}>
                  $<SmoothNumber value={calculatedValues[selectedCoin.id]} duration={800} decimals={selectedCoin.decimals} />
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  24H Change
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#4b5563'
                }}>
                  <SmoothNumber value={cryptoPrices[selectedCoin.id]?.change_24h ?? selectedCoin.data?.change_24h} duration={600} decimals={2} showSign={true} />%
                </div>
              </div>
            </div>

            {/* Large Chart */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '1rem'
              }}>
                24-Hour Price Chart
              </h3>
              <LargeGraph 
                key={`${selectedCoin.id}-${cryptoPrices[selectedCoin.id]?.price || selectedCoin.data?.price || 'loading'}`}
                coinId={selectedCoin.id}
                currentPrice={cryptoPrices[selectedCoin.id]?.price || selectedCoin.data?.price}
                changes={cryptoPrices[selectedCoin.id] || selectedCoin.data}
              />
            </div>

            {/* Additional Statistics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  1H Change
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#4b5563'
                }}>
                  <SmoothNumber value={cryptoPrices[selectedCoin.id]?.change_1h ?? selectedCoin.data?.change_1h} duration={600} decimals={2} showSign={true} />%
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  7D Change
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#4b5563'
                }}>
                  <SmoothNumber value={cryptoPrices[selectedCoin.id]?.change_7d ?? selectedCoin.data?.change_7d} duration={600} decimals={2} showSign={true} />%
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  Market Cap
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  ${(cryptoPrices[selectedCoin.id]?.market_cap || selectedCoin.data?.market_cap) ? ((cryptoPrices[selectedCoin.id]?.market_cap || selectedCoin.data?.market_cap) / 1e9).toFixed(2) + 'B' : 'N/A'}
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.25rem'
                }}>
                  24H Volume
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  ${(cryptoPrices[selectedCoin.id]?.volume || selectedCoin.data?.volume) ? ((cryptoPrices[selectedCoin.id]?.volume || selectedCoin.data?.volume) / 1e9).toFixed(2) + 'B' : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                fontWeight: '800',
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
                  fontWeight: '700',
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
                  padding: '0.75rem',
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Star size={24} fill="#fbbf24" color="#fbbf24" />
                </div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
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
                  fontWeight: '600',
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
                To unlock VIP Trading, you need to maintain a minimum Portfolio Balance of <strong style={{ color: '#111827' }}>$10,000</strong> in your account.
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
                  fontWeight: '600',
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
      </div>
    </>
  )
}

export default Dashboard
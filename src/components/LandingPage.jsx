import { Link } from 'react-router-dom'
import { Shield, Zap, Wallet, ChevronRight, Percent, CreditCard, CheckCircle2, ArrowRight, TrendingUp, TrendingDown, ArrowRightCircle, Play, Pause, Volume2, VolumeX, Maximize, Minimize, RefreshCw, Coins, Plus, Minus } from 'lucide-react'
import heroAbstract from '../Images/hero-abstract.png'
import coinsStrip from '../Images/coins.png'
import beforeImg from '../Images/before.png'
import afterImg from '../Images/after.png'
import secureTradingImg from '../Images/secure-trading.png'
import instantExchangeImg from '../Images/instant-exchange.png'
import bestRatesImg from '../Images/best-rates.png'
import logoImg from '../Images/logo.png'
import backgroundVideo from '../videos/a6dc3574.mp4'
import introductionVideo from '../videos/CEX_introduction.mp4'
import goldenChestImg from '../Images/golden_chest.png'
import shieldImg from '../Images/golden_shield.png'
import speedImg from '../Images/speed.png'
import ratesImg from '../Images/rates.png'
import { useState, useRef, useEffect } from 'react'

// FAQ Accordion Component
const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'What is crypto?',
      answer: 'Cryptocurrency, or crypto, is a digital form of currency that uses cryptography for security. Unlike traditional currencies issued by governments, cryptocurrencies operate on decentralized networks based on blockchain technology. Bitcoin, Ethereum, and thousands of other cryptocurrencies enable peer-to-peer transactions without the need for intermediaries like banks. Cryptocurrencies can be used for various purposes including payments, investments, and as a store of value.'
    },
    {
      question: 'How to exchange crypto to cash?',
      answer: 'Exchanging crypto to cash on CEX is simple and fast. First, create your account and complete the identity verification process (KYC). Once verified, navigate to the exchange section, select the cryptocurrency you want to exchange (Bitcoin, Ethereum, or others), enter the amount, and choose your payout method (bank transfer, PayPal, card, or e-wallet). Review the transaction details including current rates and receiving value, then confirm your exchange. Your cash will be available in your selected payout method within 5 minutes.'
    },
    {
      question: 'What cryptocurrencies can I exchange?',
      answer: 'CEX supports over 200 cryptocurrencies for exchange including Bitcoin (BTC), Ethereum (ETH), Tether (USDT), XRP, BNB, Solana (SOL), and many more. Simply select your cryptocurrency from the dropdown menu, enter the amount you want to exchange, and our platform will show you the current price and receiving value based on our competitive rates that are better than market prices.'
    },
    {
      question: 'How fast will I receive my cash?',
      answer: 'With CEX, you can receive your cash within 5 minutes after completing an exchange. Our instant exchange technology processes transactions in real-time, eliminating the need to wait hours or days like traditional platforms. The exact time may vary slightly depending on your selected payout method, but most transactions are completed almost immediately.'
    },
    {
      question: 'What are the exchange rates and fees?',
      answer: 'CEX offers the best rates on the market, consistently providing rates that are higher than current market prices. Our transparent pricing starts at just 0.1% for makers with no hidden fees. When you exchange crypto, you\'ll see both the current market price and the receiving value (current price × 1.24), ensuring you get more cash for your cryptocurrency than other platforms.'
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {faqs.map((faq, index) => (
        <div
          key={index}
          style={{
            borderBottom: '1px solid #374151',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => toggleFAQ(index)}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 0',
            gap: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '400',
              color: '#ffffff',
              margin: 0,
              flex: 1
            }}>
              {faq.question}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: '24px',
              height: '24px',
              color: '#ffffff'
            }}>
              {openIndex === index ? (
                <Minus size={20} />
              ) : (
                <Plus size={20} />
              )}
            </div>
          </div>
          {openIndex === index && (
            <div style={{
              paddingBottom: '1.5rem',
              color: '#9ca3af',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              animation: 'fadeIn 0.3s ease'
            }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
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
      `}</style>
    </>
  )
}
import { 
  SiBitcoin,
  SiEthereum,
  SiTether,
  SiRipple,
  SiBinance,
  SiSolana
} from 'react-icons/si'

// Video Player Component
const VideoPlayer = () => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    // Fullscreen change detection
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleSeek = (e) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * duration
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen()
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false)
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#000000',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={introductionVideo}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
        onClick={togglePlayPause}
      />

      {/* Controls Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '1rem',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showControls ? 'auto' : 'none'
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '3px',
            marginBottom: '1rem',
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={handleSeek}
        >
          <div
            style={{
              width: `${(currentTime / duration) * 100}%`,
              height: '100%',
              backgroundColor: '#00CDCB',
              borderRadius: '3px',
              transition: 'width 0.1s linear'
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${(currentTime / duration) * 100}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '14px',
              height: '14px',
              backgroundColor: '#00CDCB',
              borderRadius: '50%',
              border: '2px solid white',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Controls Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {/* Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              togglePlayPause()
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Volume Control */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: '0 0 auto'
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleMute()
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '80px',
                height: '4px',
                cursor: 'pointer',
                accentColor: '#00CDCB'
              }}
            />
          </div>

          {/* Time Display */}
          <div
            style={{
              color: 'white',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              flex: '0 0 auto'
            }}
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Fullscreen Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFullscreen()
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  )
}

// Dashboard Diagram Component
const DashboardDiagram = () => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '640px',
      height: '100%',
      maxHeight: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '0.75rem',
      padding: 'clamp(1rem, 2vw, 1.5rem)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minHeight: 0
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '400' }}>CEX Dashboard</div>
      </div>

      {/* Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'clamp(0.5rem, 1.5vw, 0.75rem)',
        marginBottom: '1rem',
        flexShrink: 0
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: '#6b7280', marginBottom: '0.25rem' }}>Sales</div>
          <div style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: '400', color: '#111827' }}>12,640</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: '#6b7280', marginBottom: '0.25rem' }}>Income</div>
          <div style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: '400', color: '#111827' }}>$231.77</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)', color: '#6b7280', marginBottom: '0.25rem' }}>Balance</div>
          <div style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: '400', color: '#111827' }}>$46,760</div>
        </div>
      </div>

      {/* Trends Chart */}
      <div style={{ marginBottom: '1rem', flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '400', color: '#111827', marginBottom: '0.75rem', flexShrink: 0 }}>Trends</div>
        <div style={{
          flex: '1 1 auto',
          minHeight: '60px',
          maxHeight: '120px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem'
        }}>
          {[65, 45, 80, 55, 70, 60, 75, 50, 85, 65, 90, 70].map((height, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${height}%`,
                backgroundColor: index % 3 === 0 ? '#00CDCB' : index % 3 === 1 ? '#00B8B6' : '#00A3A1',
                borderRadius: '0.25rem 0.25rem 0 0',
                minHeight: '20px'
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress and Tasks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '0.75rem',
        flexShrink: 0
      }}>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '400', color: '#111827', marginBottom: '0.5rem' }}>Progress</div>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '8px solid #e5e7eb',
            borderTopColor: '#10b981',
            transform: 'rotate(-90deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <div style={{
              transform: 'rotate(90deg)',
              fontSize: '1rem',
              fontWeight: '400',
              color: '#111827'
            }}>64%</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '400', color: '#111827', marginBottom: '0.5rem' }}>Tasks</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  width: `${100 - (i * 15)}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Exchange Flow */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e5e7eb',
        flexShrink: 0
      }}>
        <div style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '400', color: '#111827', marginBottom: '0.75rem' }}>Exchange Flow</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(0.25rem, 1vw, 0.5rem)',
          flexWrap: 'wrap'
        }}>
          <div style={{
            flex: '1 1 auto',
            minWidth: '80px',
            padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
            fontWeight: '400',
            color: '#111827'
          }}>
            Select Crypto
          </div>
          <ArrowRightCircle size={20} color="#6b7280" style={{ flexShrink: 0, width: 'clamp(16px, 2.5vw, 20px)', height: 'clamp(16px, 2.5vw, 20px)' }} />
          <div style={{
            flex: '1 1 auto',
            minWidth: '80px',
            padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
            fontWeight: '400',
            color: '#111827'
          }}>
            Enter Amount
          </div>
          <ArrowRightCircle size={20} color="#6b7280" style={{ flexShrink: 0, width: 'clamp(16px, 2.5vw, 20px)', height: 'clamp(16px, 2.5vw, 20px)' }} />
          <div style={{
            flex: '1 1 auto',
            minWidth: '80px',
            padding: 'clamp(0.5rem, 1.5vw, 0.75rem)',
            backgroundColor: '#00CDCB',
            borderRadius: '0.5rem',
            textAlign: 'center',
            fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
            fontWeight: '400',
            color: '#ffffff'
          }}>
            Get USD
          </div>
        </div>
      </div>
    </div>
  )
}

const LandingPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header and Hero Section Container */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Video Background - Covers both header and section */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: '-40px',
            width: 'calc(100% + 80px)',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none',
            filter: 'blur(10px)'
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        
        {/* Dark overlay to prevent white edges from blur */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 0.5,
          pointerEvents: 'none'
        }}></div>

      {/* Navigation */}
      <nav style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '0 1rem',
          zIndex: 1000
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img 
                src={logoImg} 
                alt="CEX Logo" 
                style={{ 
                  height: '32px', 
                  width: 'auto',
                  objectFit: 'contain'
                }} 
              />
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '400', 
                color: '#ffffff',
                margin: 0
              }}>
                CEX
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <Link
                to="/"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                    padding: '0.75rem 0',
                  borderBottom: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#e5e7eb'
                  e.currentTarget.style.borderBottomColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.borderBottomColor = 'transparent'
                }}
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                    padding: '0.75rem 0',
                  borderBottom: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#e5e7eb'
                  e.currentTarget.style.borderBottomColor = '#e5e7eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.borderBottomColor = 'transparent'
                }}
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              to="/signin"
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                cursor: 'pointer',
                backgroundColor: 'white'
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
              Sign In
            </Link>
            <Link
              to="/account-type"
              style={{
                padding: '0.5rem 1rem',
                  backgroundColor: '#00CDCB',
                color: 'white',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                cursor: 'pointer',
                  border: '1px solid #00CDCB',
                  boxShadow: '0 2px 8px rgba(0, 205, 203, 0.3)'
              }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00B8B6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00CDCB'}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#00A3A1'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#00B8B6'}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
          maxWidth: '1405px',
        margin: '0 auto', 
          paddingTop: 'clamp(2rem, 5vw, 5rem)',
          paddingBottom: 'clamp(2rem, 5vw, 5rem)',
          paddingLeft: 'clamp(1rem, 4vw, 4rem)',
          paddingRight: 'clamp(1rem, 4vw, 4rem)',
          backgroundColor: 'transparent',
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
        
        {/* Content Overlay */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center'
      }}>
          <div style={{ 
            width: '100%',
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', 
            gap: 'clamp(1.5rem, 3vw, 2.5rem)', 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          {/* Copy */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: '400', 
                color: '#ffffff',
              marginBottom: '1rem',
                lineHeight: '1.1',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
                Get Your Cash in 5 Minutes. Best Rates Guaranteed.
            </h1>
            <p style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
              color: '#ffffff',
              marginBottom: '1.5rem',
              maxWidth: '38rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              lineHeight: '1.6'
            }}>
              At CEX, we're revolutionizing cryptocurrency exchanges, making them faster and easier than ever. Unlike traditional platforms that can take hours or even days to process transactions, we get your cash to you in just minutes after you start the exchange. Our rates are better than current market prices—meaning you get more value for your coins. With over 200 cryptocurrencies like Bitcoin and Ethereum, over 4 million global users, and over $1 billion monthly trading volume, CEX is the future of crypto exchange.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                to="/account-type"
                style={{
                  padding: '0.85rem 1.5rem',
                  backgroundColor: '#00CDCB',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '400',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 205, 203, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00B8B6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00CDCB'}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#00A3A1'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#00B8B6'}
              >
                Get Started
                <ChevronRight size={20} />
              </Link>
              <Link
                to="/signin"
                style={{
                  padding: '0.85rem 1.5rem',
                  border: '2px solid #ffffff',
                  color: '#ffffff',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '400',
                  transition: 'all 0.2s',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.borderColor = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = '#ffffff'
                }}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              >
                View Dashboard
              </Link>
            </div>
          </div>
            {/* Hero Visual - Diagram Component */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: 'rgba(30, 30, 30, 0.3)', 
              borderRadius: '1rem', 
              padding: 'clamp(0.5rem, 2vw, 1rem)',
              height: '50vh',
              maxHeight: '100%',
              overflow: 'hidden',
              minHeight: 0
            }}>
              <DashboardDiagram />
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* Before vs After */}
      <section style={{ 
        padding: '5rem 1rem', 
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb' 
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', 
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Left Side - Content */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '2rem',
                width: '100%'
              }}>
              {/* Tagline */}
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '400',
                color: '#00CDCB',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                CEX EXCHANGE
                </div>

              {/* Main Headline */}
              <h2 style={{ 
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                fontWeight: 400, 
                color: '#111827', 
                lineHeight: '1.1',
                margin: 0
              }}>
                From Watching Charts All Day → To Earning in Minutes
              </h2>

              {/* Description */}
              <p style={{ 
                color: '#6b7280', 
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                lineHeight: '1.7',
                margin: 0
              }}>
                Before CEX, you had to constantly monitor charts, miss trades, and deal with the stress of timing everything just right. But after using CEX, you can convert your crypto at live market prices, pick your payout method, confirm it, and you're done. You can finally free up your time and earn without having to babysit charts all day.
              </p>

              {/* Feature Points */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem',
                marginTop: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.125rem'
                  }}>
                    <CheckCircle2 size={16} color="#10b981" />
                </div>
                  <div>
                    <div style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.25rem' }}>
                      Convert at Live Market Prices
                </div>
                    <div style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                      Real-time exchange with rates better than current market prices—no waiting, no delays
              </div>
            </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.125rem'
                  }}>
                    <CheckCircle2 size={16} color="#10b981" />
                </div>
                  <div>
                    <div style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.25rem' }}>
                      Get Cash in 5 Minutes
                </div>
                    <div style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                      Pick your payout method, confirm, and receive funds almost immediately—no hours or days of waiting
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '0.125rem'
                  }}>
                    <CheckCircle2 size={16} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.25rem' }}>
                      No More Chart Monitoring
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.6' }}>
                      Forget about monitoring charts or waiting for the perfect moment. With CEX, you're done in minutes
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side - Phone Mockup */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '400px',
                position: 'relative'
              }}>
                {/* Phone Frame */}
                <div style={{
                  backgroundColor: '#1f2937',
                  borderRadius: '2rem',
                  padding: '0.5rem',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 0 0 2px rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  width: '100%',
                  height: '50rem',
                }}>
                  {/* Notch */}
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '25px',
                    backgroundColor: '#1f2937',
                    borderRadius: '0 0 1rem 1rem',
                    zIndex: 10
                  }}></div>
                  
                  {/* Phone Screen */}
                  <div 
                    id="cex-phone-mockup"
                    style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '1.5rem',
                      overflow: 'hidden',
                      width: '100%',
                      height: '100%',
                      overflowY: 'auto',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <style>{`
                      #cex-phone-mockup::-webkit-scrollbar {
                        display: none;
                        width: 0;
                        height: 0;
                      }
                      #cex-phone-mockup {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                    `}</style>
                    {/* Main Content */}
                    <div style={{
                      padding: '1rem',
                      color: '#111827',
                      minHeight: '100%'
                    }}>
                      {/* Top Balance Cards */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          padding: '0.75rem',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '0.625rem', color: '#6b7280', marginBottom: '0.25rem' }}>Portfolio Balance</div>
                          <div style={{ fontSize: '1rem', fontWeight: '400', color: '#111827' }}>$126,000</div>
                          <div style={{ fontSize: '0.5rem', color: '#9ca3af' }}>Updated 10:03 AM</div>
                        </div>
                        <div style={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          padding: '0.75rem',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '0.625rem', color: '#6b7280', marginBottom: '0.25rem' }}>Bitcoin (BTC)</div>
                          <div style={{ fontSize: '1rem', fontWeight: '400', color: '#111827' }}>$89,823</div>
                          <div style={{ fontSize: '0.5rem', color: '#ef4444' }}>-0.17% 24h</div>
                        </div>
                        <div style={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          padding: '0.75rem',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '0.625rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ethereum (ETH)</div>
                          <div style={{ fontSize: '1rem', fontWeight: '400', color: '#111827' }}>$2,955</div>
                          <div style={{ fontSize: '0.5rem', color: '#10b981' }}>+0.08% 24h</div>
                        </div>
                      </div>

                      {/* Welcome Section */}
                      <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '400', color: '#111827', marginBottom: '0.25rem' }}>
                          Welcome to your Dashboard
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Manage your cryptocurrency portfolio and exchange crypto for USD
                        </p>
                      </div>

                      {/* Cryptocurrency Prices Section */}
                      <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        marginBottom: '1rem',
                        overflow: 'hidden'
                      }}>
                        {/* Header */}
                        <div style={{
                          padding: '0.75rem 1rem',
                          background: 'linear-gradient(135deg, #00CDCB 0%, #008B8A 100%)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: '400',
                            color: 'white',
                            margin: 0
                          }}>
                            Cryptocurrency Prices
                          </h4>
                          <button style={{
                            padding: '0.375rem 0.75rem',
                            border: 'none',
                            borderRadius: '0.375rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontSize: '0.625rem',
                            fontWeight: '400',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            cursor: 'pointer'
                          }}>
                            <RefreshCw size={10} />
                            Refresh
                          </button>
                        </div>

                        {/* Crypto List */}
                        <div style={{ padding: '0' }}>
                          {[
                            { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', currentPrice: '$89,823.75', receivingValue: '$111,381.45', change1h: '-0.98%', change24h: '-0.17%', change7d: '-10.73%', color: '#F7931A' },
                            { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', currentPrice: '$2,955.95', receivingValue: '$3,665.38', change1h: '-0.94%', change24h: '+0.08%', change7d: '-10.95%', color: '#627EEA' },
                            { id: 'tether', name: 'Tether', symbol: 'USDT', currentPrice: '$0.9998', receivingValue: '$1.2398', change1h: '-0.03%', change24h: '+0.06%', change7d: '-0.06%', color: '#26A17B' },
                            { id: 'ripple', name: 'XRP', symbol: 'XRP', currentPrice: '$2.0835', receivingValue: '$2.5835', change1h: '-1.11%', change24h: '0.00%', change7d: '-13.16%', color: '#23292F' },
                            { id: 'binancecoin', name: 'BNB', symbol: 'BNB', currentPrice: '$889.37', receivingValue: '$1,102.82', change1h: '-0.52%', change24h: '+0.11%', change7d: '-5.98%', color: '#F3BA2F' },
                            { id: 'solana', name: 'Solana', symbol: 'SOL', currentPrice: '$138.36', receivingValue: '$171.57', change1h: '-1.14%', change24h: '+3.65%', change7d: '-8.36%', color: '#9945FF' }
                          ].map((crypto, index) => (
                            <div 
                              key={crypto.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                borderBottom: index < 5 ? '1px solid #f3f4f6' : 'none'
                              }}
                            >
                              {/* Crypto Icon */}
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: crypto.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                {crypto.id === 'bitcoin' && <SiBitcoin size={20} color="white" />}
                                {crypto.id === 'ethereum' && <SiEthereum size={20} color="white" />}
                                {crypto.id === 'tether' && <SiTether size={20} color="white" />}
                                {crypto.id === 'ripple' && <SiRipple size={20} color="white" />}
                                {crypto.id === 'binancecoin' && <SiBinance size={20} color="white" />}
                                {crypto.id === 'solana' && <SiSolana size={20} color="white" />}
                              </div>

                              {/* Crypto Info */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '400', color: '#111827', marginBottom: '0.125rem' }}>
                                  {crypto.name} ({crypto.symbol})
                                </div>
                                <div style={{ fontSize: '0.625rem', color: '#6b7280', marginBottom: '0.125rem' }}>
                                  Current: {crypto.currentPrice}
                                </div>
                                <div style={{ fontSize: '0.625rem', color: '#00CDCB', fontWeight: '400' }}>
                                  Receiving: {crypto.receivingValue}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                  <span style={{ fontSize: '0.5rem', color: crypto.change1h.startsWith('-') ? '#ef4444' : '#10b981' }}>
                                    1H: {crypto.change1h}
                                  </span>
                                  <span style={{ fontSize: '0.5rem', color: crypto.change24h.startsWith('-') ? '#ef4444' : '#10b981' }}>
                                    24H: {crypto.change24h}
                                  </span>
                                  <span style={{ fontSize: '0.5rem', color: crypto.change7d.startsWith('-') ? '#ef4444' : '#10b981' }}>
                                    7D: {crypto.change7d}
                                  </span>
                                </div>
                              </div>

                              {/* Chest Icon */}
                              <div style={{ flexShrink: 0 }}>
                                <img 
                                  src={goldenChestImg} 
                                  alt="Golden Chest" 
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    objectFit: 'contain'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exchange Crypto to USD Section */}
                      <div style={{
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        padding: '1rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <Coins size={16} color="#00CDCB" />
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: '400',
                            color: '#111827',
                            margin: 0
                          }}>
                            Exchange Crypto to USD
                          </h4>
                        </div>
                        <p style={{
                          fontSize: '0.625rem',
                          color: '#6b7280',
                          marginBottom: '0.75rem'
                        }}>
                          Convert your cryptocurrency to USD instantly
                        </p>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          marginBottom: '0.75rem'
                        }}>
                          <div style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            color: '#111827'
                          }}>
                            Bitcoin (BTC)
                          </div>
                          <div style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            color: '#9ca3af'
                          }}>
                            Enter amount to exchange
                          </div>
                          <div style={{
                            padding: '0.5rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            color: '#9ca3af'
                          }}>
                            Select payment account
                          </div>
                        </div>
                        <button style={{
                          width: '100%',
                          padding: '0.625rem',
                          backgroundColor: '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: '400',
                          cursor: 'pointer'
                        }}>
                          Exchange Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Strip */}
      <section style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Shield size={20} color="#00CDCB" />
            <div>
              <div style={{ fontWeight: 400, color: '#111827' }}>Bank‑level Security</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Encryption, device binding, and session protection</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Percent size={20} color="#00CDCB" />
            <div>
              <div style={{ fontWeight: 400, color: '#111827' }}>Transparent Rates</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Low fees starting at 0.1% for makers, no hidden fees</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <CreditCard size={20} color="#00CDCB" />
            <div>
              <div style={{ fontWeight: 400, color: '#111827' }}>Multiple Payouts</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bank, PayPal, cards, and more</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - Video Player */}
      <section style={{ 
        padding: '4rem 1rem', 
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid #e5e7eb',
        minHeight: '500px',
              display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Blurred Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
                style={{ 
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            width: 'calc(100% + 40px)',
            height: 'calc(100% + 40px)',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'blur(100px)',
            transform: 'scale(1.1)'
                }} 
        >
          <source src={introductionVideo} type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 1
        }}></div>

            {/* Content */}
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          width: '100%'
        }}>
              <h2 style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                fontWeight: 400, 
            color: '#ffffff',
            marginBottom: '2rem',
            textAlign: 'center',
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                About CEX
              </h2>
          <VideoPlayer />
        </div>
      </section>

      {/* Why Choose CEX Section - Card Style */}
      <section style={{ 
        padding: '5rem 1rem', 
        background: '#0a1628', 
        borderTop: '1px solid #e5e7eb'
              }}>
        <div style={{ 
          maxWidth: '1120px', 
          margin: '0 auto'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
            fontWeight: 400, 
            color: '#ffffff',
            marginBottom: '3rem',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            Why Choose CEX?
          </h2>
          
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem'
              }}>
            {/* Card 1 - Security */}
                <div style={{ 
              background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 30%, #3d2817 70%, #1a0f08 100%)',
              borderRadius: '1rem',
              paddingRight: '7.5rem',
              border: '1px solid #6b7280',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              minHeight: '300px',
                  display: 'flex', 
              alignItems: 'center'
                }}>
              {/* Dark overlay for readability */}
                  <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)',
                borderRadius: '1rem'
                  }}></div>
              {/* Content */}
                <div style={{ 
                position: 'relative',
                zIndex: 1,
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '2rem',
                alignItems: 'center'
                }}>
                  <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent'
                }}>
                  <img 
                    src={shieldImg} 
                    alt="Shield" 
                    style={{
                      width: '400px',
                      height: '400px',
                      objectFit: 'contain',
                      backgroundColor: 'transparent',
                      display: 'block'
                    }}
                  />
                  </div>
                <div>
                <div style={{ 
                  display: 'flex', 
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      color: '#00CDCB',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      SECURITY
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    color: 'white',
                    marginBottom: '1rem',
                    lineHeight: '1.3'
                  }}>
                    Bank-Level Security. Your Crypto, Protected.
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    We offer bank-level security with encrypted transactions and secure wallet storage protecting your assets. Founded in 2024, CEX has maintained a clean security record, emphasizing trust and reliability. Your assets are protected with industry-leading security measures—256-bit encryption, multi-factor authentication, and cold storage wallets.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 - Speed */}
      <div style={{ 
              background: 'linear-gradient(135deg, #1a0f08 0%, #3d2817 30%, #1e3a5f 60%, #0a1628 100%)',
              borderRadius: '1rem',
              paddingLeft: '6.5rem',
              border: '1px solid #6b7280',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center'
      }}>
              {/* Dark overlay for readability */}
        <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)',
                borderRadius: '1rem'
              }}></div>
              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '2rem',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
            marginBottom: '1rem'
          }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '400',
                      color: '#00CDCB',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      SPEED
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '400',
                    color: 'white',
                    marginBottom: '1rem',
                    lineHeight: '1.3'
                  }}>
                    Get Your Cash in 5 Minutes. No Delays, No Waiting.
                  </h3>
          <p style={{ 
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    Thanks to our advanced matching engine and instant exchange technology, you don't have to worry about waiting around. Get your cash within 5 minutes—no delays, no waiting. Forget about monitoring charts or waiting for the perfect moment to trade. With CEX, you just choose your cryptocurrency, pick your payout method, and get your funds almost immediately. The exchange happens in real-time, and we offer multiple payout options including bank transfers, cards, and e-wallets, all at your fingertips.
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent'
                }}>
                  <img 
                    src={speedImg} 
                    alt="Speed" 
                    style={{
                      width: '400px',
                      height: '400px',
                      objectFit: 'contain',
                      backgroundColor: 'transparent',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Card 3 - Rates */}
          <div style={{ 
              background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 30%, #3d2817 70%, #1a0f08 100%)',
              borderRadius: '1rem',
              paddingRight: '5.5rem',
              border: '1px solid #6b7280',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              position: 'relative',
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {/* Dark overlay for readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%)',
                borderRadius: '1rem'
              }}></div>
              {/* Content */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
            display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '2rem',
                alignItems: 'center'
          }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent'
              }}>
                <img 
                    src={ratesImg} 
                    alt="Rates" 
                  style={{ 
                      width: '400px',
                      height: '400px',
                      objectFit: 'contain',
                      backgroundColor: 'transparent',
                      display: 'block'
                  }} 
                />
              </div>
                <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                fontWeight: '400', 
                    color: '#00CDCB',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    RATES
                  </span>
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '400',
                  color: 'white',
                  marginBottom: '1rem',
                  lineHeight: '1.3'
              }}>
                  Best Rates on the Market. More Cash for Your Crypto.
              </h3>
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  What really sets CEX apart is our commitment to offering the best rates on the market. While other platforms may offer rates at or even below the current coin prices, we consistently provide rates that are higher, meaning you get more cash for your cryptocurrency. It's a value that no other exchange can match. Best exchange rates with low fees and transparent pricing starting at just 0.1% for makers. Transparent pricing, no hidden fees—just the best rates guaranteed.
              </p>
            </div>
          </div>
            </div>
            
            {/* Card 4 - Join Users Banner */}
              <div style={{ 
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '1.5rem 2.5rem',
              border: '1px solid #6b7280',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#111827'
              }}>
                <span>Join our</span>
                <span style={{
                  fontWeight: '400',
                  color: '#00CDCB'
                }}>1M+</span>
                <span>users. Get started today.</span>
              </div>
              <Link
                to="/account-type"
                  style={{ 
                  padding: '0.875rem 2rem',
                  backgroundColor: '#00CDCB',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '400',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(0, 205, 203, 0.3)',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#00B8B6'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#00CDCB'
                  e.currentTarget.style.transform = 'translateX(0)'
                  }} 
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              </div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section style={{ 
        padding: '5rem 1rem', 
        background: '#ffffff', 
        borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          {/* Vision Label */}
          <div style={{
            fontSize: '0.875rem',
                fontWeight: '400', 
            color: '#00CDCB',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1rem'
              }}>
            OUR VISION
            </div>
            
          {/* Main Vision Statement */}
          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '400',
            color: '#111827',
            marginBottom: '3rem',
            lineHeight: '1.2'
          }}>
            Instant Crypto Exchange in Every Wallet™
          </h2>

          {/* Central Logo/Icon */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '4rem'
              }}>
                <img 
              src={logoImg} 
              alt="CEX Logo" 
                  style={{ 
                width: 'clamp(150px, 25vw, 250px)',
                height: 'auto',
                objectFit: 'contain',
                backgroundColor: 'transparent'
                  }} 
                />
              </div>

          {/* Statistics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {/* Founded */}
            <div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                Founded in
            </div>
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: '400',
                color: '#00CDCB',
                lineHeight: '1'
              }}>
                2024
        </div>
      </div>

            {/* Users */}
            <div>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                Users
              </div>
              <div style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: '400',
                color: '#00CDCB',
                lineHeight: '1'
              }}>
                1M+
            </div>
              </div>
            </div>
              </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '5rem 1rem', background: '#111827', borderTop: '1px solid #374151' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '3rem', alignItems: 'start' }}>
            {/* Left Side - Title */}
            <div>
              <h2 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                fontWeight: '400', 
                color: '#ffffff',
                lineHeight: '1.2',
                marginBottom: '1rem'
              }}>
                Frequently Asked Questions
              </h2>
            </div>

            {/* Right Side - FAQ Accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <FAQAccordion />
          </div>
          </div>
        </div>
      </section>

      

      {/* CTA Section */}
      <div style={{ 
        background: '#ffffff', 
        padding: '5rem 1rem',
        textAlign: 'center',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
            fontWeight: 400, 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Ready to Start Trading?
          </h2>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: '#6b7280',
            marginBottom: '2rem'
          }}>
            Join over 1 million global users who trust CEX for their crypto needs. Welcome to the future of crypto exchange.
          </p>
          <Link
            to="/account-type"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#00CDCB',
              color: '#ffffff',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '400',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 205, 203, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00B8B6'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 205, 203, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#00CDCB'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 205, 203, 0.3)'
            }}
            onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#00A3A1'}
            onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#00B8B6'}
          >
            Create Account Now
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#111827', 
        color: 'white', 
        padding: '3rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '400', 
            marginBottom: '1rem'
          }}>
            CEX
          </h3>
          <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>
            Secure cryptocurrency exchange platform
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1.5rem',
            fontSize: '0.875rem',
            color: '#9ca3af'
          }}>
            <a 
              href="/privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#9ca3af', textDecoration: 'none' }}
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-of-service" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#9ca3af', textDecoration: 'none' }}
            >
              Terms of Service
            </a>
            <a 
              href="/support" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#9ca3af', textDecoration: 'none' }}
            >
              Support
            </a>
            <a 
              href="/contact" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#9ca3af', textDecoration: 'none' }}
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
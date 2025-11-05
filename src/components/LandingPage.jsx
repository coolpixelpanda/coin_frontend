import { Link } from 'react-router-dom'
import { Shield, Zap, Wallet, ChevronRight, Percent, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react'
import heroMock from '../Images/hero-mockup.png'
import heroAbstract from '../Images/hero-abstract.png'
import coinsStrip from '../Images/coins.png'
import beforeImg from '../Images/before.png'
import afterImg from '../Images/after.png'
import secureTradingImg from '../Images/secure-trading.png'
import instantExchangeImg from '../Images/instant-exchange.png'
import bestRatesImg from '../Images/best-rates.png'
import logoImg from '../Images/logo.webp'
import aboutUsImg from '../Images/about-us2.png'

const LandingPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: 'black', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '0 1rem'
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
                alt="CoinTransfer Logo" 
                style={{ 
                  height: '32px', 
                  width: 'auto',
                  objectFit: 'contain'
                }} 
              />
              <h1 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#ffffff',
                margin: 0
              }}>
                CoinTransfer
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
                  padding: '0.5rem 0',
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
                  padding: '0.5rem 0',
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
                backgroundColor: '#000000',
                color: 'white',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: '1px solid #ffffff'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#333333'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        maxWidth: '100%', 
        margin: '0 auto', 
        padding: '5rem 20rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          {/* Copy */}
          <div>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: '800', 
              color: '#111827',
              marginBottom: '1rem',
              lineHeight: '1.1'
            }}>
              Exchange Crypto to USD in Seconds
            </h1>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#4b5563',
              marginBottom: '1.5rem',
              maxWidth: '38rem'
            }}>
              Fast, secure, and transparent. Competitive rates and multiple payout options—built for speed and trust.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                to="/account-type"
                style={{
                  padding: '0.85rem 1.5rem',
                  backgroundColor: '#000000',
                  color: 'white',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
                onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#333333'}
                onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
              >
                Get Started
                <ChevronRight size={20} />
              </Link>
              <Link
                to="/signin"
                style={{
                  padding: '0.85rem 1.5rem',
                  border: '1px solid #d1d5db',
                  color: '#374151',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  backgroundColor: 'white',
                  cursor: 'pointer'
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
                View Dashboard
              </Link>
            </div>
          </div>
          {/* Hero Visual */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src={heroMock}
              alt="CoinTransfer Dashboard preview" 
              style={{ width: '100%', maxWidth: '640px', height: 'auto', borderRadius: '0.75rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
              onError={(e) => { e.currentTarget.src = heroAbstract }}
            />
          </div>
        </div>
      </section>

      {/* Before vs After */}
      <section style={{ padding: '4rem 1rem', background: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: '0.5rem' }}>From Watching Charts All Day → To Earning in Minutes</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '2rem', fontSize: 'clamp(0.95rem, 1.6vw, 1.125rem)' }}>Traditional trading demands constant attention. With CoinTransfer, you convert at live market rates and move on—no full‑time screen watching required.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
              <div style={{ fontWeight: 700, color: '#000000', marginBottom: '0.5rem', fontSize: '1.125rem' }}>Before</div>
              <img src={beforeImg} alt="Before CoinTransfer: monitoring charts full-time" style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.375rem', flexShrink: 0 }}></div>
                  <div style={{ color: '#111827', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '500' }}>Constant chart monitoring</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.375rem', flexShrink: 0 }}></div>
                  <div style={{ color: '#111827', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '500' }}>Missed entries and exits</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.375rem', flexShrink: 0 }}></div>
                  <div style={{ color: '#111827', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '500' }}>Time‑intensive and stressful</div>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem' }}>
              <div style={{ fontWeight: 700, color: '#000000', marginBottom: '0.5rem', fontSize: '1.125rem' }}>After</div>
              <img src={afterImg} alt="After CoinTransfer: quick conversion in minutes" style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.375rem', flexShrink: 0 }}></div>
                  <div style={{ color: '#111827', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '500' }}>Convert at live market price</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.375rem', flexShrink: 0 }}></div>
                  <div style={{ color: '#111827', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '500' }}>Pick payout, confirm, done</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000', marginTop: '0.375rem', flexShrink: 0 }}></div>
                  <div style={{ color: '#111827', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '500' }}>Free your time—earn without babysitting charts</div>
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
            <Shield size={20} color="#000000" />
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>Bank‑level Security</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Encryption, device binding, and session protection</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Percent size={20} color="#000000" />
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>Transparent Rates</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>No hidden fees, real market pricing</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <CreditCard size={20} color="#000000" />
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>Multiple Payouts</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bank, PayPal, cards, and more</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section style={{ 
        padding: '3rem 1rem', 
        background: '#ffffff', 
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '3rem', 
            alignItems: 'center'
          }}>
            {/* Image */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src={aboutUsImg} 
                alt="About CoinTransfer" 
                style={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  height: 'auto', 
                  borderRadius: '0.75rem'
                }} 
              />
            </div>

            {/* Content */}
            <div>
              <h2 style={{ 
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                fontWeight: 700, 
                color: '#111827',
                marginBottom: '1.5rem',
                lineHeight: '1.2'
              }}>
                About CoinTransfer
              </h2>
              <p style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
                color: '#4b5563',
                marginBottom: '1.5rem',
                lineHeight: '1.7'
              }}>
                CoinTransfer revolutionizes the cryptocurrency exchange experience by offering lightning-fast conversions and unmatched rates. Unlike traditional trading platforms that require hours or even days to process transactions, we deliver your cash within <strong style={{ color: '#000000' }}>shortly</strong> of initiating an exchange.
              </p>
              <p style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
                color: '#4b5563',
                marginBottom: '1.5rem',
                lineHeight: '1.7'
              }}>
                What truly sets CoinTransfer apart is our commitment to providing <strong style={{ color: '#000000' }}>the best rates in the market</strong>. While other platforms offer rates at or below current coin prices, we consistently provide rates that exceed market value. This means you get more cash for your cryptocurrency compared to any other exchange platform—a value proposition that's unmatched in the industry.
              </p>
              <p style={{ 
                fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
                color: '#4b5563',
                marginBottom: '1.5rem',
                lineHeight: '1.7'
              }}>
                Our instant exchange technology eliminates the waiting game. No need to monitor charts, wait for optimal trading windows, or navigate complex trading interfaces. Simply select your cryptocurrency, choose your payout method, and receive your funds almost immediately. With CoinTransfer, converting coins to cash has never been faster, easier, or more profitable.
              </p>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.75rem'
                }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#000000', 
                    marginTop: '0.5rem', 
                    flexShrink: 0 
                  }}></div>
                  <div style={{ color: '#111827', fontSize: '1rem', lineHeight: '1.6', fontWeight: '500' }}>
                    <strong>Instant Conversion:</strong> Get your cash within 5 minutes—no delays, no waiting
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.75rem'
                }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#000000', 
                    marginTop: '0.5rem', 
                    flexShrink: 0 
                  }}></div>
                  <div style={{ color: '#111827', fontSize: '1rem', lineHeight: '1.6', fontWeight: '500' }}>
                    <strong>Best Rates Guaranteed:</strong> Rates better than current market prices—more value for your coins
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.75rem'
                }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#000000', 
                    marginTop: '0.5rem', 
                    flexShrink: 0 
                  }}></div>
                  <div style={{ color: '#111827', fontSize: '1rem', lineHeight: '1.6', fontWeight: '500' }}>
                    <strong>Instant Exchange:</strong> Real-time processing with multiple payout options at your fingertips
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '5rem 1rem',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
            fontWeight: 700, 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Why Choose CoinTransfer?
          </h2>
          <p style={{ 
            fontSize: 'clamp(0.95rem, 1.6vw, 1.125rem)', 
            color: '#6b7280',
            marginBottom: '4rem'
          }}>
            Experience the future of cryptocurrency trading
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                margin: '0 auto 1rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '250px',
                height: '250px'
              }}>
                <img 
                  src={secureTradingImg} 
                  alt="Secure Trading" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Secure Trading
              </h3>
              <p style={{ color: '#6b7280' }}>
                Bank-level security with encrypted transactions and secure wallet storage.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                margin: '0 auto 1rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '250px',
                height: '250px'
              }}>
                <img 
                  src={instantExchangeImg} 
                  alt="Instant Exchange" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Instant Exchange
              </h3>
              <p style={{ color: '#6b7280' }}>
                Convert your crypto to USD in seconds with real-time market rates.
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                margin: '0 auto 1rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '250px',
                height: '250px'
              }}>
                <img 
                  src={bestRatesImg} 
                  alt="Best Rates" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain' 
                  }} 
                />
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Best Rates
              </h3>
              <p style={{ color: '#6b7280' }}>
                Get the best exchange rates with low fees and transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section style={{ padding: '4rem 1rem', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: '0.5rem' }}>How it works</h2>
          <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: '2rem' }}>Three simple steps to exchange your crypto</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} color="#000000" />
                <div style={{ fontWeight: 600, color: '#111827' }}>Create your account</div>
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>Sign up and secure your profile with 2‑step verification.</div>
            </div>
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Wallet size={20} color="#000000" />
                <div style={{ fontWeight: 600, color: '#111827' }}>Choose crypto & amount</div>
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>Select BTC, ETH, or more and enter how much to exchange.</div>
            </div>
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Zap size={20} color="#000000" />
                <div style={{ fontWeight: 600, color: '#111827' }}>Receive USD fast</div>
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>Pick your payout method and get notified the moment it settles.</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/account-type" style={{ color: '#000000', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              Get started now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      

      {/* Security & Compliance */}
      <section style={{ padding: '4rem 1rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <Shield size={28} color="#000000" />
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginTop: '0.5rem' }}>Built for Trust</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>This MVP is client‑side only. Production integrates secure authentication, KYC/AML, and audited payout providers. Your data is protected with modern web security practices.</p>
        </div>
      </section>

      

      {/* CTA Section */}
      <div style={{ 
        backgroundColor: '#333333', 
        padding: '5rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', 
            fontWeight: 700, 
            color: '#eeeeee',
            marginBottom: '1rem'
          }}>
            Ready to Start Trading?
          </h2>
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
            color: '#eeeeee',
            marginBottom: '2rem'
          }}>
            Join thousands of users who trust CoinTransfer for their crypto needs
          </p>
          <Link
            to="/account-type"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'white',
              color: '#333333',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
            }}
            onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          >
            Create Account Now
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#000000', 
        color: 'white', 
        padding: '3rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1rem'
          }}>
            CoinTransfer
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
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Support</a>
            <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
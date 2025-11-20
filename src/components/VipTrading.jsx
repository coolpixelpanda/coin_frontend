import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Star, Zap, Shield, TrendingUp } from 'lucide-react'

const VipTrading = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
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
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.5rem',
              border: 'none',
              borderRadius: '0.5rem',
              backgroundColor: '#f3f4f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Star size={24} fill="#fbbf24" color="#fbbf24" />
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '400',
              color: '#00CDCB',
              margin: 0
            }}>
              VIP Trading
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          padding: '3rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem'
          }}>
            <Star size={80} fill="#fbbf24" color="#fbbf24" />
          </div>
          
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '400',
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Welcome to VIP Trading
          </h2>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            marginBottom: '3rem',
            maxWidth: '600px',
            margin: '0 auto 3rem auto'
          }}>
            Experience exclusive features, premium rates, and priority support designed for high-volume traders.
          </p>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem'
          }}>
            <div style={{
              padding: '2rem',
              backgroundColor: '#fef3c7',
              borderRadius: '1rem',
              border: '1px solid #fbbf24'
            }}>
              <Zap size={40} color="#fbbf24" style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '400',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Premium Rates
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Get the best exchange rates with exclusive VIP pricing
              </p>
            </div>

            <div style={{
              padding: '2rem',
              backgroundColor: '#fef3c7',
              borderRadius: '1rem',
              border: '1px solid #fbbf24'
            }}>
              <Shield size={40} color="#fbbf24" style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '400',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Priority Support
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                24/7 dedicated support team for VIP members
              </p>
            </div>

            <div style={{
              padding: '2rem',
              backgroundColor: '#fef3c7',
              borderRadius: '1rem',
              border: '1px solid #fbbf24'
            }}>
              <TrendingUp size={40} color="#fbbf24" style={{ marginBottom: '1rem' }} />
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '400',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                Advanced Tools
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Access to advanced trading features and analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VipTrading


import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Phone, Clock } from 'lucide-react'

const Contact = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      color: '#111827'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link 
          to="/" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#00CDCB',
            textDecoration: 'none',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '400',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          Contact Us
        </h1>

        <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '1rem' }}>
          Have questions or need assistance? We're here to help. Reach out to us through any of the following channels.
        </p>

        {/* Contact Information Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#e0f7fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Mail size={24} color="#00CDCB" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.5rem', color: '#111827' }}>
              Email
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              General inquiries
            </p>
            <a 
              href="mailto:contact@cex-usa.com" 
              style={{ 
                color: '#00CDCB', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              contact@cex-usa.com
            </a>
          </div>

          <div style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#e0f7fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Mail size={24} color="#00CDCB" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.5rem', color: '#111827' }}>
              Support
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              Technical support
            </p>
            <a 
              href="mailto:support@cex-usa.com" 
              style={{ 
                color: '#00CDCB', 
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              support@cex-usa.com
            </a>
          </div>

          <div style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#e0f7fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Clock size={24} color="#00CDCB" />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.5rem', color: '#111827' }}>
              Response Time
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
              We aim to respond
            </p>
            <p style={{ color: '#111827', fontWeight: '500', fontSize: '0.875rem' }}>
              Within 24 hours
            </p>
          </div>
        </div>

        {/* Business Information */}
        <div style={{
          padding: '2rem',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '1.5rem', color: '#111827' }}>
            About CEX
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Founded in 2013, CEX has been revolutionizing cryptocurrency exchanges, making them faster and easier than ever. With over 4 million global users and over $1 billion monthly trading volume, we're committed to providing the best exchange experience.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Our platform offers bank-level security, instant exchanges, and the best rates on the market. Get your cash within 5 minutes with transparent pricing and no hidden fees.
          </p>
        </div>

        {/* Additional Links */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f0fdfa',
          border: '1px solid #00CDCB',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.75rem', color: '#111827' }}>
            Quick Links
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              to="/support"
              style={{
                color: '#00CDCB',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Support Center
            </Link>
            <span style={{ color: '#9ca3af' }}>•</span>
            <Link 
              to="/privacy-policy"
              style={{
                color: '#00CDCB',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Privacy Policy
            </Link>
            <span style={{ color: '#9ca3af' }}>•</span>
            <Link 
              to="/terms-of-service"
              style={{
                color: '#00CDCB',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact


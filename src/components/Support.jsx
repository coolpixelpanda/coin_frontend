import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MessageCircle, HelpCircle, Book, AlertCircle } from 'lucide-react'

const Support = () => {
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
          Support Center
        </h1>

        <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '1rem' }}>
          We're here to help you with any questions or issues you may have.
        </p>

        {/* Contact Methods */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '1.5rem', color: '#111827' }}>
            Get in Touch
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb'
            }}>
              <Mail size={24} color="#00CDCB" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.5rem', color: '#111827' }}>
                Email Support
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                Send us an email and we'll respond within 24 hours.
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
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb'
            }}>
              <MessageCircle size={24} color="#00CDCB" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.5rem', color: '#111827' }}>
                Live Chat
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                Chat with our support team in real-time.
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Available 24/7
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginBottom: '1.5rem', color: '#111827' }}>
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.75rem', color: '#111827' }}>
                How long does it take to receive my funds?
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                With CEX, you can receive your cash within 5 minutes after completing an exchange. Processing times may vary slightly depending on your selected payout method.
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.75rem', color: '#111827' }}>
                What cryptocurrencies do you support?
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                We support over 200 cryptocurrencies including Bitcoin, Ethereum, and many others. Check our exchange page for the full list of supported cryptocurrencies.
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.75rem', color: '#111827' }}>
                What are your fees?
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Our fees are transparent and competitive, starting at just 0.1% for makers. All fees are clearly displayed before you confirm any transaction. There are no hidden fees.
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.75rem', color: '#111827' }}>
                Is my information secure?
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Yes, we use bank-level security with encrypted transactions and secure wallet storage. Founded in 2013, CEX has maintained a clean security record. Your assets are protected with industry-leading security measures.
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.75rem', color: '#111827' }}>
                What payout methods do you offer?
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                We offer multiple payout options including bank transfers, credit/debit cards, PayPal, and e-wallets. Select your preferred method when completing an exchange.
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.75rem', color: '#111827' }}>
                Do I need to verify my identity?
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Yes, we require identity verification (KYC) to comply with anti-money laundering regulations and ensure the security of our platform. This is a one-time process that typically takes just a few minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f0fdfa',
          border: '1px solid #00CDCB',
          borderRadius: '0.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '400', marginBottom: '0.75rem', color: '#111827' }}>
            Need More Help?
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
            Check out our documentation and guides, or contact our support team directly.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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

export default Support


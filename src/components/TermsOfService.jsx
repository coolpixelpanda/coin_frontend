import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const TermsOfService = () => {
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
          Terms of Service
        </h1>

        <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '0.875rem' }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div style={{ fontSize: '1rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            Welcome to CEX. These Terms of Service ("Terms") govern your access to and use of CEX's cryptocurrency exchange platform, website, mobile application, and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            1. Acceptance of Terms
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            By creating an account, accessing, or using CEX Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use our Services.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            2. Eligibility
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            You must be at least 18 years old to use our Services. By using CEX, you represent and warrant that:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>You are at least 18 years of age</li>
            <li style={{ marginBottom: '0.5rem' }}>You have the legal capacity to enter into these Terms</li>
            <li style={{ marginBottom: '0.5rem' }}>You are not located in a jurisdiction where cryptocurrency trading is prohibited</li>
            <li style={{ marginBottom: '0.5rem' }}>You will comply with all applicable laws and regulations</li>
            <li style={{ marginBottom: '0.5rem' }}>All information you provide is accurate and truthful</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            3. Account Registration and Security
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            To use our Services, you must create an account and provide accurate, current, and complete information. You are responsible for:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Maintaining the confidentiality of your account credentials</li>
            <li style={{ marginBottom: '0.5rem' }}>All activities that occur under your account</li>
            <li style={{ marginBottom: '0.5rem' }}>Notifying us immediately of any unauthorized access or security breach</li>
            <li style={{ marginBottom: '0.5rem' }}>Completing identity verification (KYC) as required by law</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            4. Services Description
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            CEX provides a platform for cryptocurrency exchange services, allowing you to:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Exchange cryptocurrencies for fiat currency (USD)</li>
            <li style={{ marginBottom: '0.5rem' }}>Receive funds through multiple payout methods</li>
            <li style={{ marginBottom: '0.5rem' }}>Access real-time market rates and pricing</li>
            <li style={{ marginBottom: '0.5rem' }}>View transaction history and account information</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            5. Fees and Pricing
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            CEX charges fees for our Services. Our fee structure is transparent and displayed before you complete any transaction. Fees may vary based on:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Transaction type and amount</li>
            <li style={{ marginBottom: '0.5rem' }}>Cryptocurrency being exchanged</li>
            <li style={{ marginBottom: '0.5rem' }}>Payout method selected</li>
            <li style={{ marginBottom: '0.5rem' }}>Market conditions</li>
          </ul>

          <p style={{ marginBottom: '1rem' }}>
            All fees are clearly displayed before you confirm any transaction. By completing a transaction, you agree to pay all applicable fees.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            6. Transactions and Exchange Rates
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            Exchange rates are determined by current market conditions and may fluctuate. CEX strives to offer competitive rates, but rates are not guaranteed until a transaction is confirmed. Once a transaction is confirmed, the rate is locked in for that specific transaction.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            7. Prohibited Activities
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            You agree not to:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Use our Services for any illegal purpose</li>
            <li style={{ marginBottom: '0.5rem' }}>Engage in money laundering, fraud, or other financial crimes</li>
            <li style={{ marginBottom: '0.5rem' }}>Attempt to hack, disrupt, or interfere with our Services</li>
            <li style={{ marginBottom: '0.5rem' }}>Provide false or misleading information</li>
            <li style={{ marginBottom: '0.5rem' }}>Violate any applicable laws or regulations</li>
            <li style={{ marginBottom: '0.5rem' }}>Use automated systems to access our Services without permission</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            8. Limitation of Liability
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            CEX provides Services "as is" and "as available" without warranties of any kind. We are not liable for any losses resulting from:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Market volatility or cryptocurrency price fluctuations</li>
            <li style={{ marginBottom: '0.5rem' }}>Technical issues or service interruptions</li>
            <li style={{ marginBottom: '0.5rem' }}>Unauthorized access to your account due to your failure to maintain security</li>
            <li style={{ marginBottom: '0.5rem' }}>Regulatory changes affecting cryptocurrency</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            9. Intellectual Property
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            All content, features, and functionality of our Services, including but not limited to text, graphics, logos, and software, are owned by CEX and protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            10. Termination
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            We reserve the right to suspend or terminate your account at any time if you violate these Terms or engage in fraudulent or illegal activities. You may close your account at any time by contacting our support team.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            11. Changes to Terms
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of our Services after changes become effective constitutes acceptance of the modified Terms.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            12. Contact Information
          </h2>

          <p style={{ marginBottom: '2rem' }}>
            If you have questions about these Terms, please contact us through our Support page or at support@cex-usa.com.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService


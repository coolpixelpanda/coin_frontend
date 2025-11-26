import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const TermsOfService = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      padding: 'clamp(1rem, 3vw, 2rem)',
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
            CEX-USA provides a fast and secure cryptocurrency exchange platform specializing in converting cryptocurrencies to USD cash. Our Services include:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Cryptocurrency to USD Exchange:</strong> Exchange Bitcoin (BTC), Ethereum (ETH), Tether (USDT), XRP, BNB, Solana (SOL), and other supported cryptocurrencies for USD cash</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Multiple Payout Methods:</strong> Receive your funds via bank wire transfer, PayPal, Venmo, Cash App, Zelle, Apple Pay, Google Pay, or other supported payment methods</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Real-Time Market Rates:</strong> Access live cryptocurrency prices updated every 30 seconds with competitive exchange rates that are better than market prices</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Instant Exchange Processing:</strong> Complete exchanges within 5 minutes after transaction confirmation</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Transaction Management:</strong> View your complete transaction history, exchange status, and account balance</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>VIP Trading Program:</strong> Unlock premium features, better rates, and priority support when you reach $100,000 in total exchanges</li>
          </ul>

          <p style={{ marginBottom: '1rem' }}>
            <strong>Important:</strong> CEX-USA is a cryptocurrency-to-cash exchange platform. We do not offer cryptocurrency purchase services or cryptocurrency-to-cryptocurrency trading. Our platform is designed exclusively for converting your existing cryptocurrency holdings into USD cash.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            5. Fees, Pricing, and Exchange Rates
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            CEX-USA offers competitive exchange rates that are consistently better than current market prices. Our pricing structure is transparent and designed to maximize the value you receive for your cryptocurrency:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Best Rates Guaranteed:</strong> Our exchange rates are calculated as current market price multiplied by a factor between 1.1 and 1.15, ensuring you receive more cash than the current market value</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Minimum Exchange Amount:</strong> The minimum exchange value is $10,000 USD (calculated as cryptocurrency amount × current market price)</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Transparent Pricing:</strong> Before confirming any exchange, you will see:
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.25rem' }}>Current Price: The total USD value of your cryptocurrency amount</li>
                <li style={{ marginBottom: '0.25rem' }}>Receiving Price: The amount you will receive (Current Price × multiplier)</li>
                <li style={{ marginBottom: '0.25rem' }}>Cryptocurrency Amount: The exact amount of crypto you are exchanging</li>
              </ul>
            </li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Payout Method Fees:</strong> Some payout methods may have additional processing fees, which will be clearly displayed before transaction confirmation</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>VIP Trading Benefits:</strong> Users who reach $100,000 in total exchanges unlock VIP status with premium rates and priority processing</li>
          </ul>

          <p style={{ marginBottom: '1rem' }}>
            All rates and fees are clearly displayed before you confirm any transaction. Exchange rates are locked in at the time of transaction confirmation and remain valid for 30 minutes. By completing a transaction, you agree to the displayed rates and any applicable fees.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            6. Exchange Process and Transaction Completion
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            When you initiate an exchange on CEX-USA, the following process applies:
          </p>

          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Exchange Initiation:</strong> Select your cryptocurrency, enter the amount, choose your payout method, and review the exchange details</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Rate Lock:</strong> Once you confirm the exchange, the rate is locked in for 30 minutes. You must complete the cryptocurrency transfer within this timeframe</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Cryptocurrency Transfer:</strong> Send the exact cryptocurrency amount displayed to the provided wallet address. The address is unique to each transaction</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Transaction Confirmation:</strong> After we confirm receipt of your cryptocurrency on the blockchain, we process your USD payment</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Funds Delivery:</strong> Your USD funds are delivered to your selected payout method within 24 hours of transaction confirmation, typically within 5 minutes</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>One Exchange at a Time:</strong> You may only have one active exchange in progress at a time. You must complete or cancel the current exchange before starting a new one</li>
          </ul>

          <p style={{ marginBottom: '1rem' }}>
            <strong>Transaction Time Limits:</strong> Each exchange has a 30-minute time limit. If you do not complete the cryptocurrency transfer within this timeframe, the exchange may be cancelled and you will need to initiate a new exchange with updated rates.
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


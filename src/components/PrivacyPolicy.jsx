import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const PrivacyPolicy = () => {
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
          to="/signin" 
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
          Back to Sign In
        </Link>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '400',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          CEX-USA Global Privacy Policy
        </h1>

        <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '0.875rem' }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div style={{ fontSize: '1rem' }}>
          <p style={{ marginBottom: '1.5rem' }}>
            We at CEX-USA (the CEX-USA entities listed in Section 11 below, referred to here as "we", "us" or "our") respect and protect the privacy of those who explore our Services ("Users") and Users who sign up for and access our Services ("Customers") (together referred throughout this policy as "you" and "your").
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            This Privacy Policy describes how we collect, use, and share personal information when you explore, sign up for or access our "Services", which include the services offered on our websites, including cex-usa.com (the "Site") or when you use the CEX-USA mobile app, API, or third party applications relying on such APIs (together, our "Apps") and related services.
          </p>

          <p style={{ marginBottom: '2rem' }}>
            If you reside outside of the UK and the European Economic Area (the "EEA"), accessing and using our Services means that you accept this Privacy Policy and its terms.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            Key Highlights
          </h2>

          <ul style={{ marginBottom: '2rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              Our goal is to simplify your crypto experience. If you do not wish for your personal information to be collected, used, or disclosed as described in this Privacy Policy, or you are under 18 years of age, you should stop accessing our Services.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              We collect and use your information in order to provide and improve our Services and your experience, protect the security and integrity of our platform, and meet our legal obligations.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              We share your information with other CEX-USA companies, as well as trusted third parties and service providers, in order to offer our Services and fulfill legal requirements.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              We offer privacy tools for you to request access to or deletion of information we hold about you. You can use these tools by visiting your Privacy Rights Dashboard. Depending on where you live, you may also have other privacy rights under law.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            1. WHAT INFORMATION WE COLLECT
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            We collect the following personal information and documentation:
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Information You Provide to Us
          </h3>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Account Registration:</strong> Email address, username, password (hashed and encrypted), and account type (Personal, Business, Institutional, or Developer)</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Identity Verification (KYC):</strong> Government-issued identification documents, selfie verification, proof of address, and other documents required for compliance with anti-money laundering (AML) and know-your-customer (KYC) regulations</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Financial Information:</strong> Bank account details, routing numbers, PayPal account information, Venmo/Cash App/Zelle usernames, Apple Pay/Google Pay identifiers, and other payment method details for receiving USD payouts</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Exchange Transaction Data:</strong> Cryptocurrency wallet addresses, transaction amounts (both cryptocurrency amount and USD value), exchange rates, receiving multipliers, transaction timestamps, exchange status, and complete transaction history</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Authentication Data:</strong> Passkey credentials, authentication preferences, and security settings</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Communication Data:</strong> Customer support tickets, inquiries, feedback, and communication preferences</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>VIP Status Information:</strong> Total exchange volume, VIP status eligibility, and account tier information</li>
          </ul>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Information Collected Automatically
          </h3>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}><strong>Device and Browser Information:</strong> IP address, browser type and version, operating system, device type (mobile, tablet, desktop), device identifiers, screen resolution, and language settings</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Usage Analytics:</strong> Pages visited, features accessed, time spent on platform, click patterns, cryptocurrency prices viewed, exchange attempts, and interaction with charts and modals</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Location Data:</strong> Geographic location derived from IP address or device GPS (if enabled) for compliance and fraud prevention</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Technical Data:</strong> Session information, login timestamps, logout times, API usage, error logs, and performance metrics</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Cookies and Tracking:</strong> Authentication tokens, session cookies, preference cookies, and analytics cookies to enhance your experience and maintain security</li>
            <li style={{ marginBottom: '0.5rem' }}><strong>Cryptocurrency Market Data:</strong> Real-time price data, historical price charts, market trends, and percentage changes (1H, 24H, 7D) for display purposes</li>
          </ul>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Information we obtain from Affiliates and third parties
          </h3>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Identity verification services</li>
            <li style={{ marginBottom: '0.5rem' }}>Credit bureaus and financial institutions</li>
            <li style={{ marginBottom: '0.5rem' }}>Public blockchain data</li>
            <li style={{ marginBottom: '0.5rem' }}>Marketing and analytics partners</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            2. HOW WE USE YOUR INFORMATION
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            We use your personal information to deliver, personalize, operate, improve, create, and develop our Services, to provide you with a secure, smooth, efficient and customized experience as you use them, and for legal compliance, loss prevention, and anti-fraud purposes.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Data use necessary to perform our contract with you
          </h3>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Process transactions and facilitate cryptocurrency exchanges</li>
            <li style={{ marginBottom: '0.5rem' }}>Provide customer support and respond to inquiries</li>
            <li style={{ marginBottom: '0.5rem' }}>Verify your identity and maintain account security</li>
            <li style={{ marginBottom: '0.5rem' }}>Send transaction confirmations and account notifications</li>
          </ul>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Data use to comply with our legal obligations
          </h3>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Comply with anti-money laundering (AML) and know-your-customer (KYC) regulations</li>
            <li style={{ marginBottom: '0.5rem' }}>Report to tax authorities and regulatory bodies</li>
            <li style={{ marginBottom: '0.5rem' }}>Respond to legal requests and court orders</li>
            <li style={{ marginBottom: '0.5rem' }}>Prevent fraud and financial crimes</li>
          </ul>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Data use for our Legitimate Interests
          </h3>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Improve and develop new features and services</li>
            <li style={{ marginBottom: '0.5rem' }}>Analyze usage patterns and platform performance</li>
            <li style={{ marginBottom: '0.5rem' }}>Detect and prevent security threats</li>
            <li style={{ marginBottom: '0.5rem' }}>Marketing and promotional communications (with your consent where required)</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            3. HOW AND WHY WE SHARE YOUR INFORMATION
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            We work with service providers, partners and other third parties to help us provide our Services, and as a result we need to share certain information with these third parties.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Affiliates
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We may share your information with our affiliated companies to provide integrated services and improve your experience across our platform.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Third-Party Service Providers
          </h3>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Identity verification and KYC providers</li>
            <li style={{ marginBottom: '0.5rem' }}>Payment processors and banking partners</li>
            <li style={{ marginBottom: '0.5rem' }}>Cloud hosting and infrastructure providers</li>
            <li style={{ marginBottom: '0.5rem' }}>Customer support and communication services</li>
            <li style={{ marginBottom: '0.5rem' }}>Analytics and marketing service providers</li>
          </ul>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '400', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            Professional advisors, industry partners, authorities and regulators
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We may share information with legal advisors, auditors, regulatory authorities, and law enforcement agencies as required by law or to protect our rights and interests.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            4. HOW LONG WE RETAIN YOUR PERSONAL INFORMATION
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            We retain your information as needed to provide our Services, comply with legal obligations, or protect our or others' interests. While retention requirements vary by country, we maintain internal retention policies on the basis of how information needs to be used. This includes considerations such as when the information was collected or created, whether it is necessary in order to continue offering you our Services, whether we are required to hold the information to comply with our legal obligations, including AML/KYC compliance or other financial regulatory obligations.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            5. CHILDREN'S PERSONAL INFORMATION
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            The Sites and Services are not directed to persons under the age of 18, and we do not knowingly request or collect any information about persons under the age of 18. If you are under the age of 18, please do not provide any personal information through the Sites or Services.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            6. INTERNATIONAL TRANSFERS
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            To facilitate our global operations, CEX-USA, its Affiliates, third-party partners, and service providers may transfer, store, and process your personal information throughout the world, including the United States, Ireland, and other jurisdictions where we operate.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            7. YOUR PRIVACY RIGHTS AND CHOICES
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            Depending on where you live, you may be able to exercise certain privacy rights related to your personal information. You can request access to, correction of, or deletion of your personal information by contacting us at privacy@cex-usa.com or through your account settings.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            8. HOW TO CONTACT US WITH QUESTIONS
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            If you have questions or concerns regarding this Privacy Policy, or if you have a complaint, please contact us at privacy@cex-usa.com or through our Support Portal.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            9. CHANGES TO THIS PRIVACY POLICY
          </h2>

          <p style={{ marginBottom: '1rem' }}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '400', marginTop: '2rem', marginBottom: '1rem' }}>
            10. OUR RELATIONSHIP WITH YOU
          </h2>

          <p style={{ marginBottom: '2rem' }}>
            CEX-USA, Inc. acts as the data controller for your personal information. If you reside in the EEA or Switzerland, CEX-USA Europe Limited acts as the data controller for your personal information.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy


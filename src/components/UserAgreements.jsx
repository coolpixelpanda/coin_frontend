import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const UserAgreements = () => {
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
          to="/signin" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#000000',
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
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#111827'
        }}>
          CEX-USA User Agreement
        </h1>

        <p style={{ color: '#6b7280', marginBottom: '3rem', fontSize: '0.875rem' }}>
          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div style={{ fontSize: '1rem' }}>
          <p style={{ marginBottom: '1.5rem', fontWeight: '600' }}>
            PLEASE READ THIS USER AGREEMENT CAREFULLY. BY ACCESSING OR USING CEX-USA'S SERVICES, YOU AGREE TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS AGREEMENT.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            1. ACCEPTANCE OF TERMS
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            This User Agreement ("Agreement") is a legal contract between you ("User", "you", or "your") and CEX-USA, Inc. ("CEX-USA", "we", "us", or "our") governing your use of CEX-USA's cryptocurrency exchange platform, website, mobile applications, and related services (collectively, the "Services").
          </p>
          <p style={{ marginBottom: '1rem' }}>
            By accessing, using, or registering for an account with CEX-USA, you acknowledge that you have read, understood, and agree to be bound by this Agreement and our Privacy Policy. If you do not agree to these terms, you must not access or use our Services.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            2. ELIGIBILITY
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            To use our Services, you must:
          </p>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Be at least 18 years of age or the age of majority in your jurisdiction</li>
            <li style={{ marginBottom: '0.5rem' }}>Have the legal capacity to enter into binding contracts</li>
            <li style={{ marginBottom: '0.5rem' }}>Not be located in, or a resident of, any jurisdiction where cryptocurrency trading is prohibited</li>
            <li style={{ marginBottom: '0.5rem' }}>Not be on any sanctions list maintained by the United States, United Nations, European Union, or other applicable authorities</li>
            <li style={{ marginBottom: '0.5rem' }}>Provide accurate, current, and complete information during registration</li>
            <li style={{ marginBottom: '0.5rem' }}>Maintain the security of your account credentials</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            3. ACCOUNT REGISTRATION AND SECURITY
          </h2>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            3.1 Account Creation
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            To use our Services, you must create an account by providing accurate and complete information, including but not limited to your email address, phone number, and identity verification documents. You agree to maintain and promptly update your account information to keep it accurate and current.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            3.2 Identity Verification
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            As part of our compliance with anti-money laundering (AML) and know-your-customer (KYC) regulations, you must complete identity verification before accessing certain Services. This may include providing government-issued identification, proof of address, and other documentation as requested.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            3.3 Account Security
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            You are solely responsible for maintaining the confidentiality of your account credentials, including your password, two-factor authentication codes, and any other security measures. You agree to:
          </p>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Use a strong, unique password</li>
            <li style={{ marginBottom: '0.5rem' }}>Enable two-factor authentication</li>
            <li style={{ marginBottom: '0.5rem' }}>Notify us immediately of any unauthorized access to your account</li>
            <li style={{ marginBottom: '0.5rem' }}>Not share your account credentials with any third party</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            4. SERVICES AND FEATURES
          </h2>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            4.1 Cryptocurrency Exchange
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            CEX-USA provides a platform for buying, selling, and exchanging cryptocurrencies. All transactions are subject to market conditions, fees, and applicable regulations. We do not guarantee the availability of any specific cryptocurrency or trading pair at any given time.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            4.2 Fees
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            You agree to pay all fees associated with your use of our Services, including but not limited to trading fees, withdrawal fees, and network fees. Fee schedules are available on our website and may be updated from time to time. All fees are non-refundable unless otherwise required by law.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            4.3 Transaction Limits
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We may impose transaction limits on your account based on your verification level, account history, and regulatory requirements. These limits may be adjusted at our discretion.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            5. PROHIBITED ACTIVITIES
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            You agree not to:
          </p>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Use our Services for any illegal purpose or in violation of any applicable laws or regulations</li>
            <li style={{ marginBottom: '0.5rem' }}>Engage in money laundering, terrorist financing, or other financial crimes</li>
            <li style={{ marginBottom: '0.5rem' }}>Manipulate markets or engage in fraudulent trading activities</li>
            <li style={{ marginBottom: '0.5rem' }}>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li style={{ marginBottom: '0.5rem' }}>Use automated systems, bots, or scripts to interact with our Services without authorization</li>
            <li style={{ marginBottom: '0.5rem' }}>Interfere with or disrupt the integrity or performance of our Services</li>
            <li style={{ marginBottom: '0.5rem' }}>Transfer your account to another person without our written consent</li>
            <li style={{ marginBottom: '0.5rem' }}>Use our Services if you are located in a prohibited jurisdiction</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            6. RISK DISCLOSURE
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            You acknowledge and agree that:
          </p>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Cryptocurrency trading involves substantial risk of loss and is not suitable for every investor</li>
            <li style={{ marginBottom: '0.5rem' }}>The value of cryptocurrencies can be extremely volatile and may result in total loss</li>
            <li style={{ marginBottom: '0.5rem' }}>Past performance is not indicative of future results</li>
            <li style={{ marginBottom: '0.5rem' }}>You should only trade with funds you can afford to lose</li>
            <li style={{ marginBottom: '0.5rem' }}>Cryptocurrencies are not backed by any government or central bank</li>
            <li style={{ marginBottom: '0.5rem' }}>Regulatory changes may adversely affect the value and use of cryptocurrencies</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            7. INTELLECTUAL PROPERTY
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            All content, features, and functionality of our Services, including but not limited to text, graphics, logos, and software, are owned by CEX-USA or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on our Services without our express written consent.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            8. DISCLAIMERS AND LIMITATION OF LIABILITY
          </h2>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            8.1 No Warranties
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            8.2 Limitation of Liability
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, CEX-USA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF OUR SERVICES.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            9. INDEMNIFICATION
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            You agree to indemnify, defend, and hold harmless CEX-USA, its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your use of our Services, violation of this Agreement, or infringement of any rights of another party.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            10. TERMINATION
          </h2>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            10.1 Termination by You
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            You may terminate your account at any time by contacting our support team. Upon termination, you remain responsible for all transactions and fees incurred prior to termination.
          </p>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            10.2 Termination by Us
          </h3>
          <p style={{ marginBottom: '1rem' }}>
            We may suspend or terminate your account immediately, without prior notice, if you violate this Agreement, engage in fraudulent or illegal activity, or if we are required to do so by law or regulatory authority.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            11. GOVERNING LAW AND DISPUTE RESOLUTION
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any disputes arising out of or relating to this Agreement shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            12. MODIFICATIONS TO AGREEMENT
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            We reserve the right to modify this Agreement at any time. We will notify you of material changes by posting the updated Agreement on our website and updating the "Last Updated" date. Your continued use of our Services after such modifications constitutes your acceptance of the updated Agreement.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '2rem', marginBottom: '1rem' }}>
            13. CONTACT INFORMATION
          </h2>
          <p style={{ marginBottom: '2rem' }}>
            If you have any questions about this Agreement, please contact us at legal@cex-usa.com or through our Support Portal.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserAgreements


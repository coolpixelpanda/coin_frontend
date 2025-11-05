import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Building2, BarChart3, Zap, Check } from 'lucide-react'

const AccountTypeSelection = () => {
  const [selectedType, setSelectedType] = useState('')
  const navigate = useNavigate()

  const accountTypes = [
    {
      id: 'personal',
      title: 'Personal',
      description: 'Trade crypto as an individual.',
      icon: <User size={24} />,
      color: '#000000'
    },
    {
      id: 'business',
      title: 'Business',
      description: 'For small businesses and startups.',
      icon: <Building2 size={24} />,
      color: '#000000'
    },
    {
      id: 'institutional',
      title: 'Institutional',
      description: 'Recommended for larger institutions.',
      icon: <BarChart3 size={24} />,
      color: '#000000'
    },
    {
      id: 'developer',
      title: 'Developer',
      description: 'Build onchain using developer tooling.',
      icon: <Zap size={24} />,
      color: '#000000'
    }
  ]

  const handleContinue = () => {
    if (selectedType) {
      navigate(`/signup?accountType=${selectedType}`)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#ffffff',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '32rem', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            What kind of account are you creating?
          </h1>
          <p style={{ color: '#6b7280' }}>
            Choose the account type that best fits your needs
          </p>
        </div>

        {/* Account Type Cards */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {accountTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: selectedType === type.id ? `2px solid ${type.color}` : '2px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: selectedType === type.id ? `0 4px 12px ${type.color}20` : '0 1px 3px rgba(0,0,0,0.1)',
                transform: selectedType === type.id ? 'translateY(-2px)' : 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '0.75rem',
                  backgroundColor: `${type.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: type.color
                }}>
                  {type.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    {type.title}
                  </h3>
                  <p style={{ 
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    margin: 0
                  }}>
                    {type.description}
                  </p>
                </div>
                {selectedType === type.id && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: type.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem'
                  }}>
                    <Check size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          justifyContent: 'space-between'
        }}>
          <Link
            to="/"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              color: '#374151',
              fontSize: '1rem',
              fontWeight: '500',
              textAlign: 'center',
              flex: 1,
              transition: 'all 0.2s'
            }}
          >
            ← Back
          </Link>
          <button
            onClick={handleContinue}
            disabled={!selectedType}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: selectedType ? '#000000' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: selectedType ? 'pointer' : 'not-allowed',
              flex: 2,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (selectedType) e.currentTarget.style.backgroundColor = '#1a1a1a'
            }}
            onMouseLeave={(e) => {
              if (selectedType) e.currentTarget.style.backgroundColor = '#000000'
            }}
            onMouseDown={(e) => {
              if (selectedType) e.currentTarget.style.backgroundColor = '#333333'
            }}
            onMouseUp={(e) => {
              if (selectedType) e.currentTarget.style.backgroundColor = '#1a1a1a'
            }}
          >
            Continue →
          </button>
        </div>

        {/* Help Text */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          You can change your account type later in settings
        </div>
      </div>
    </div>
  )
}

export default AccountTypeSelection


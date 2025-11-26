import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Building2, BarChart3, Zap, Check, Lock } from 'lucide-react'

const AccountTypeSelection = () => {
  const [selectedType, setSelectedType] = useState('')
  const navigate = useNavigate()

  const accountTypes = [
    {
      id: 'personal',
      title: 'Personal',
      description: 'Exchange and Trade crypto as an individual.',
      icon: <User size={24} />,
      color: '#00CDCB'
    },
    {
      id: 'business',
      title: 'Business',
      description: 'For small businesses and startups.',
      icon: <Building2 size={24} />,
      color: '#00CDCB',
      locked: true
    },
    {
      id: 'institutional',
      title: 'Institutional',
      description: 'Recommended for larger institutions.',
      icon: <BarChart3 size={24} />,
      color: '#00CDCB',
      locked: true
    },
    {
      id: 'developer',
      title: 'Developer',
      description: 'Build onchain using developer tooling.',
      icon: <Zap size={24} />,
      color: '#00CDCB',
      locked: true
    }
  ]

  const handleContinue = () => {
    if (selectedType) {
      const selectedAccountType = accountTypes.find(type => type.id === selectedType)
      // Don't allow continuing if the selected type is locked
      if (selectedAccountType && selectedAccountType.locked) {
        return
      }
      navigate(`/signup?accountType=${selectedType}`)
    }
  }

  const handleTypeClick = (typeId) => {
    const accountType = accountTypes.find(type => type.id === typeId)
    // Don't allow selection if locked
    if (accountType && accountType.locked) {
      return
    }
    setSelectedType(typeId)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#ffffff',
      padding: 'clamp(0.5rem, 2vw, 1rem)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '32rem', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '400', 
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
          {accountTypes.map((type) => {
            const isLocked = type.locked
            return (
            <div
              key={type.id}
              onClick={() => handleTypeClick(type.id)}
              style={{
                backgroundColor: isLocked ? '#f9fafb' : 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: selectedType === type.id && !isLocked ? `2px solid ${type.color}` : '2px solid #e5e7eb',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: selectedType === type.id && !isLocked ? `0 4px 12px ${type.color}20` : '0 1px 3px rgba(0,0,0,0.1)',
                transform: selectedType === type.id && !isLocked ? 'translateY(-2px)' : 'translateY(0)',
                display: 'flex',
                alignItems: 'center',
                minHeight: '80px',
                opacity: isLocked ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '0.75rem',
                  backgroundColor: `${type.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: type.color,
                  flexShrink: 0
                }}>
                  {type.icon}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '400', 
                      color: isLocked ? '#9ca3af' : '#111827',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {type.title}
                    </h3>
                    {isLocked && (
                      <Lock size={16} color="#9ca3af" />
                    )}
                  </div>
                  <p style={{ 
                    color: isLocked ? '#9ca3af' : '#6b7280',
                    fontSize: '0.875rem',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {type.description}
                  </p>
                </div>
                {selectedType === type.id && !isLocked && (
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: type.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}>
                    <Check size={16} />
                  </div>
                )}
              </div>
            </div>
            )
          })}
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
            disabled={!selectedType || (selectedType && accountTypes.find(t => t.id === selectedType)?.locked)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: (selectedType && !accountTypes.find(t => t.id === selectedType)?.locked) ? '#00CDCB' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: (selectedType && !accountTypes.find(t => t.id === selectedType)?.locked) ? 'pointer' : 'not-allowed',
              flex: 2,
              transition: 'all 0.2s',
              boxShadow: (selectedType && !accountTypes.find(t => t.id === selectedType)?.locked) ? '0 4px 14px rgba(0, 205, 203, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedType) e.currentTarget.style.backgroundColor = '#00B8B6'
            }}
            onMouseLeave={(e) => {
              if (selectedType) e.currentTarget.style.backgroundColor = '#00CDCB'
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


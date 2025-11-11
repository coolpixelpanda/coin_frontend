import { useState, useEffect } from 'react'
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          onClose?.()
        }, 300) // Wait for fade out animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose?.()
    }, 300)
  }

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />
  }

  const colors = {
    success: {
      bg: '#f0fdf4',
      border: '#86efac',
      text: '#166534',
      icon: '#22c55e'
    },
    error: {
      bg: '#fef2f2',
      border: '#fca5a5',
      text: '#991b1b',
      icon: '#ef4444'
    },
    warning: {
      bg: '#fffbeb',
      border: '#fcd34d',
      text: '#92400e',
      icon: '#f59e0b'
    },
    info: {
      bg: '#eff6ff',
      border: '#93c5fd',
      text: '#1e40af',
      icon: '#3b82f6'
    }
  }

  const colorScheme = colors[type] || colors.success

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 10000,
        minWidth: '300px',
        maxWidth: '500px',
        backgroundColor: colorScheme.bg,
        border: `1px solid ${colorScheme.border}`,
        borderRadius: '0.5rem',
        padding: '1rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div style={{ color: colorScheme.icon, flexShrink: 0, marginTop: '0.125rem' }}>
        {icons[type] || icons.success}
      </div>
      <div style={{ flex: 1, color: colorScheme.text, fontSize: '0.875rem', lineHeight: '1.5' }}>
        {message}
      </div>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: colorScheme.text,
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
          transition: 'opacity 0.2s',
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default Notification


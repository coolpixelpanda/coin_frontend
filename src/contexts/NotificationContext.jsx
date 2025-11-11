import { createContext, useContext, useState, useCallback } from 'react'
import Notification from '../components/Notification'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const showNotification = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    const newNotification = { id, message, type, duration }
    
    setNotifications(prev => [...prev, newNotification])
    
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }, [])

  const value = {
    showNotification,
    removeNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map(notif => (
        <Notification
          key={notif.id}
          message={notif.message}
          type={notif.type}
          duration={notif.duration}
          onClose={() => removeNotification(notif.id)}
        />
      ))}
    </NotificationContext.Provider>
  )
}


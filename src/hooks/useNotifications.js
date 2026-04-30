import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToNotifications } from '../services/notificationService.js'

export default function useNotifications() {
  const { user } = useAuth()
  const userId = user?.uid || null

  const [notifications, setNotifications] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (!userId) {
      setNotifications([])
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = subscribeToNotifications(
      userId,
      (items) => {
        setNotifications(items)
        setLoading(false)
        setError('')
      },
      (err) => {
        setError(err?.message || 'Failed to load notifications')
        setLoading(false)
      },
      20 // Max 20 notifications
    )

    return unsubscribe
  }, [userId])

  const unreadCount = React.useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
  }
}

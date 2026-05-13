import React from 'react'
import { markAsRead, markAllAsRead, deleteNotification } from '../services/notificationService.js'

function getNotificationIcon(type) {
  switch (type) {
    case 'warning':
      return '⚠️'
    case 'success':
      return '✅'
    case 'error':
      return '🚨'
    case 'info':
    default:
      return '📊'
  }
}

function getNotificationColor(type) {
  switch (type) {
    case 'warning':
      return 'bg-amber-400/10 border border-amber-300/20 text-amber-600'
    case 'success':
      return 'bg-emerald-400/10 border border-emerald-300/20 text-emerald-600'
    case 'error':
      return 'bg-rose-400/10 border border-rose-300/20 text-rose-600'
    case 'info':
    default:
      return 'bg-surface/90 border border-border-subtle text-ink'
  }
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Just now'
  
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString()
}

function NotificationItem({ notification, onMarkAsRead, onDelete }) {
  const handleClick = async () => {
    if (!notification.read) {
      await onMarkAsRead(notification.id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={[
        'group relative cursor-pointer rounded-3xl p-4 transition shadow-lg shadow-cyan-500/10 backdrop-blur-xl',
        notification.read ? 'bg-surface/90 border border-border-subtle text-ink-secondary opacity-80' : getNotificationColor(notification.type),
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
        
        <div className="flex-1 min-w-0">
          {notification.title && (
            <p className="text-sm font-semibold text-ink truncate">
              {notification.title}
            </p>
          )}
          <p className="text-sm text-ink-tertiary mt-0.5">
            {notification.message}
          </p>
          <p className="text-xs text-ink-tertiary mt-1">
            {formatTimeAgo(notification.createdAt)}
          </p>
        </div>

        {!notification.read && (
          <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
        )}
      </div>

      {/* Delete button (shows on hover) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(notification.id)
        }}
        className="absolute top-2 right-2 rounded-lg p-1 text-ink-secondary opacity-0 transition group-hover:opacity-100 hover:bg-surface-secondary hover:text-ink-tertiary"
        aria-label="Delete notification"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export default function NotificationDropdown({ notifications, userId, onClose }) {
  const unreadCount = notifications.filter((n) => !n.read).length

  async function handleMarkAllAsRead() {
    if (!userId) return
    try {
      await markAllAsRead(userId)
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  async function handleMarkAsRead(notificationId) {
    try {
      await markAsRead(notificationId)
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  async function handleDelete(notificationId) {
    try {
      await deleteNotification(notificationId)
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-96 max-w-[calc(100vw-2rem)]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown */}
      <div className="rounded-[28px] border border-border-subtle bg-surface/95 shadow-2xl shadow-cyan-500/15 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-4">
          <div>
            <h3 className="text-base font-semibold text-ink">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-ink-tertiary mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto p-3">
          {notifications.length === 0 ? (
            <div className="rounded-3xl border border-border-subtle bg-surface/80 p-8 text-center text-ink-secondary">
              <p className="text-4xl">🔔</p>
              <p className="mt-3 text-sm font-bold text-ink">
                No notifications yet
              </p>
              <p className="mt-1 text-xs text-ink-secondary">
                We'll notify you about important updates
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border-subtle px-4 py-2 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-ink-tertiary transition hover:text-ink"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

import {
  Bars3Icon,
  BellIcon,
} from '@heroicons/react/24/outline'
import { Sun, Moon } from 'lucide-react'
import React from 'react'
import { logout } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import useNotifications from '../../hooks/useNotifications.js'
import NotificationDropdown from '../NotificationDropdown.jsx'

function Navbar({ pageTitle, isSidebarOpen, onMenuClick }) {
  const { user, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { notifications, unreadCount } = useNotifications()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false)

  const displayName = user?.displayName || user?.email || 'Signed in user'
  const initials = (displayName || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  async function handleLogout() {
    try {
      setIsLoggingOut(true)
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border-subtle bg-surface/45 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="min-w-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
              className="inline-flex rounded-xl border border-border-subtle bg-surface-secondary p-2 text-ink-secondary shadow-sm transition-colors duration-200 hover:border-cyan-300/30 hover:bg-surface-elevated hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface lg:hidden"
            aria-label="Open sidebar"
            aria-controls="sidebar-navigation"
            aria-expanded={isSidebarOpen}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-tertiary">
              Smart Finance
            </p>
            <h2 className="font-display truncate text-xl font-extrabold tracking-[-0.02em] text-ink sm:text-2xl">
              {pageTitle}
            </h2>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className={[
                'relative rounded-full bg-surface-secondary p-2.5 text-ink-secondary shadow-sm ring-1 ring-border-subtle transition-colors duration-200 hover:bg-surface-elevated hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
                isNotificationOpen ? 'text-ink ring-2 ring-cyan-400' : '',
              ].join(' ')}
              aria-label="View notifications"
              aria-expanded={isNotificationOpen}
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <NotificationDropdown
                notifications={notifications}
                userId={user?.uid}
                onClose={() => setIsNotificationOpen(false)}
              />
            )}
          </div>

          <button
            type="button"
            className="flex items-center gap-3 rounded-full bg-surface-secondary py-1.5 pl-1.5 pr-2 shadow-sm ring-1 ring-border-subtle transition duration-200 hover:bg-surface-elevated hover:shadow-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:pr-4"
            aria-label="Open user profile"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-extrabold text-white shadow-lg shadow-cyan-500/20">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-52 truncate text-sm font-bold text-ink">{displayName}</p>
              <p className="text-xs font-medium text-ink-tertiary">Workspace access</p>
            </div>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl bg-surface-secondary p-2.5 text-ink-secondary shadow-sm ring-1 ring-border-subtle transition hover:bg-surface-elevated hover:text-ink"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-surface-secondary px-3 py-2 text-xs font-bold text-ink-secondary shadow-sm ring-1 ring-border-subtle transition hover:bg-surface-elevated hover:text-ink"
            disabled={loading || isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar

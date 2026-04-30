import {
  Bars3Icon,
  BellIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { logout } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import useNotifications from '../../hooks/useNotifications.js'
import NotificationDropdown from '../NotificationDropdown.jsx'

function Navbar({ pageTitle, isSidebarOpen, onMenuClick }) {
  const { user, loading } = useAuth()
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
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-[#F8F9FB]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="min-w-0 flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors duration-200 hover:border-slate-300 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 lg:hidden"
            aria-label="Open sidebar"
            aria-controls="sidebar-navigation"
            aria-expanded={isSidebarOpen}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 sm:text-sm sm:normal-case sm:tracking-normal">
              Welcome back
            </p>
            <h2 className="truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
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
                'relative rounded-full bg-white p-2.5 text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors duration-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
                isNotificationOpen ? 'text-slate-900 ring-2 ring-cyan-500' : '',
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
            className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-2 shadow-sm ring-1 ring-slate-200 transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 sm:pr-4"
            aria-label="Open user profile"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {initials}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-52 truncate text-sm font-semibold text-slate-800">{displayName}</p>
              <p className="text-xs text-slate-500">Authenticated</p>
            </div>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            disabled={loading || isLoggingOut}
          >
            {isLoggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar

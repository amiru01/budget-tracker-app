import {
  Bars3Icon,
  BellIcon,
} from '@heroicons/react/24/outline'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase.js'

function Navbar({ pageTitle, isSidebarOpen, onMenuClick }) {
  const user = auth.currentUser
  const displayName = user?.displayName || user?.email || 'Signed in user'
  const initials = (displayName || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  async function handleLogout() {
    await signOut(auth)
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
          <button
            type="button"
            className="relative rounded-full bg-white p-2.5 text-slate-500 shadow-sm ring-1 ring-slate-200 transition-colors duration-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
            aria-label="View notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500" aria-hidden="true" />
          </button>

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
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar

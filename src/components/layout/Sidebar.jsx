import { useEffect } from 'react'
import {
  BanknotesIcon,
  ChartBarSquareIcon,
  CreditCardIcon,
  HomeIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', to: '/transactions', icon: CreditCardIcon },
  { name: 'Income', to: '/income', icon: ArrowTrendingUpIcon },
  { name: 'Reports', to: '/reports', icon: ChartBarSquareIcon },
  { name: 'Budgets', to: '/budgets', icon: BanknotesIcon },
  { name: 'Profile', to: '/profile', icon: UserCircleIcon },
]

function Sidebar({ isOpen, onClose, currentPageTitle }) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = ''
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="sidebar-navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[18rem] flex-col bg-slate-900 px-4 py-4 text-slate-100 shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none sm:px-5 sm:py-5 lg:translate-x-0 lg:px-5 lg:py-6 ${
          isOpen ? 'translate-x-0' : '-translate-x-[105%]'
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/90">
              Finance Suite
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Smart Finance
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 flex-1 space-y-1.5" aria-label="Sidebar">
          {navigation.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={onClose}
                aria-label={`Go to ${item.name}`}
                aria-current={
                  currentPageTitle === item.name ? 'page' : undefined
                }
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                    isActive
                      ? 'bg-cyan-400/15 text-white shadow-lg ring-1 ring-cyan-300/20'
                      : 'text-slate-300 hover:bg-white/6 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-5 w-5 shrink-0 transition ${
                        isActive
                          ? 'text-cyan-300'
                          : 'text-slate-400 group-hover:text-cyan-200'
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-white">Monthly Overview</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Monitor budgets, spending, and account activity from a single workspace.
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

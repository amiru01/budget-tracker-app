import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BanknotesIcon,
  ChartBarSquareIcon,
  CreditCardIcon,
  HomeIcon,
  UserCircleIcon,
  XMarkIcon,
  ServerStackIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Transactions', to: '/transactions', icon: CreditCardIcon },
  { name: 'Subscriptions', to: '/subscriptions', icon: ServerStackIcon },
  { name: 'Debt Payoff', to: '/debt', icon: ShieldExclamationIcon },
  { name: 'Reports', to: '/reports', icon: ChartBarSquareIcon },
  { name: 'Budgets', to: '/budgets', icon: BanknotesIcon },
  { name: 'Profile', to: '/profile', icon: UserCircleIcon },
]

function Sidebar({ isOpen, onClose, currentPageTitle }) {
  useEffect(() => {
    if (!isOpen) { document.body.style.overflow = ''; return undefined }
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKeyDown) }
  }, [isOpen, onClose])

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ease-out lg:hidden ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose} aria-hidden="true" />
      <aside id="sidebar-navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-[18rem] flex-col border-r border-white/10 bg-slate-950/76 px-4 py-4 text-slate-100 shadow-2xl shadow-black/30 backdrop-blur-2xl transition-transform duration-300 ease-out motion-reduce:transition-none sm:px-5 sm:py-5 lg:translate-x-0 lg:px-5 lg:py-6 ${isOpen ? 'translate-x-0' : '-translate-x-[105%]'}`}
        aria-label="Primary navigation"
      >
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between border-b border-white/10 pb-5">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-cyan-500/25">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-8 w-8">
                <ellipse cx="256" cy="280" rx="140" ry="110" fill="#ffffff" opacity="0.9"/>
                <ellipse cx="220" cy="250" rx="40" ry="30" fill="#ffffff" opacity="0.4"/>
                <rect x="236" y="190" width="40" height="8" rx="4" fill="#0f172a"/>
                <g transform="translate(256, 160)"><circle cx="0" cy="0" r="24" fill="#fbbf24"/><circle cx="0" cy="0" r="18" fill="#f59e0b"/><text x="0" y="8" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#0f172a" textAnchor="middle">$</text></g>
                <line x1="230" y1="140" x2="220" y2="150" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
                <line x1="282" y1="140" x2="292" y2="150" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
                <ellipse cx="180" cy="240" rx="20" ry="35" fill="#d1fae5" transform="rotate(-20 180 240)"/>
                <ellipse cx="380" cy="280" rx="35" ry="30" fill="#d1fae5"/><circle cx="370" cy="275" r="6" fill="#0f172a"/><circle cx="370" cy="290" r="6" fill="#0f172a"/>
                <circle cx="300" cy="250" r="12" fill="#0f172a"/><circle cx="303" cy="247" r="5" fill="#ffffff"/>
                <rect x="200" y="360" width="25" height="40" rx="12" fill="#d1fae5"/><rect x="260" y="360" width="25" height="40" rx="12" fill="#d1fae5"/>
                <rect x="287" y="360" width="25" height="40" rx="12" fill="#d1fae5"/>
                <path d="M 140 290 Q 120 280, 110 290 T 95 300" stroke="#d1fae5" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <circle cx="220" cy="130" r="3" fill="#fbbf24"/><circle cx="295" cy="125" r="3" fill="#fbbf24"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300/90">Finance OS</p>
              <h1 className="font-display mt-1 text-xl font-extrabold tracking-tight text-white">Smart Finance</h1>
            </div>
          </NavLink>
          <motion.button type="button" onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden" aria-label="Close sidebar">
            <XMarkIcon className="h-6 w-6" />
          </motion.button>
        </motion.div>

        <nav className="mt-5 flex-1 space-y-1 overflow-y-auto" aria-label="Sidebar">
          {navigation.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div key={item.name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + idx * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                <NavLink to={item.to} onClick={onClose} aria-label={`Go to ${item.name}`}
                  aria-current={currentPageTitle === item.name ? 'page' : undefined}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${isActive ? 'bg-gradient-to-r from-emerald-400/18 to-cyan-400/14 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-300/25' : 'text-slate-300 hover:bg-white/8 hover:text-white hover:ring-1 hover:ring-white/10'}`
                  }
                >
                  {({ isActive }) => (
                    <><Icon className={`h-5 w-5 shrink-0 transition ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-200'}`} /><span>{item.name}</span>
                      {isActive && <motion.span layoutId="activeNav" className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                    </>
                  )}
                </NavLink>
              </motion.div>
            )
          })}
        </nav>

        <div className="rounded-2xl border border-emerald-300/15 bg-gradient-to-br from-emerald-400/10 to-cyan-400/8 p-4 shadow-lg shadow-emerald-500/5">
          <p className="font-display text-sm font-bold tracking-tight text-white">Monthly pulse</p>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-300">Review budgets, spending, and account activity from one focused workspace.</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

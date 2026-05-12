import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/subscriptions': 'Subscriptions',
  '/debt': 'Debt Payoff',
  '/reports': 'Reports',
  '/budgets': 'Budgets',
  '/profile': 'Profile',
}

function Layout() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const pageTitle = useMemo(() => {
    return pageTitles[location.pathname] ?? 'Smart Finance'
  }, [location.pathname])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071024] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(6,182,212,0.16),transparent_30%),radial-gradient(circle_at_18%_18%,rgba(16,185,129,0.14),transparent_28%),linear-gradient(180deg,#071024_0%,#0b1326_52%,#071024_100%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <motion.div
        className="pointer-events-none fixed -left-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none fixed -bottom-40 -right-32 h-[30rem] w-[30rem] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25), transparent 70%)' }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ repeat: Infinity, duration: 22, ease: 'easeInOut' }}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPageTitle={pageTitle}
      />

      <div className="relative z-10 lg:pl-72">
        <Navbar
          pageTitle={pageTitle}
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen((current) => !current)}
        />

        <main id="main-content" className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

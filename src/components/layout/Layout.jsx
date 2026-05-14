import { useMemo, useState } from 'react'
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
    <div className="relative min-h-screen bg-surface text-ink">
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

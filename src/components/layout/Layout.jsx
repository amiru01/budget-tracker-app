import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
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
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPageTitle={pageTitle}
      />

      <div className="lg:pl-72">
        <Navbar
          pageTitle={pageTitle}
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen((current) => !current)}
        />

        <main id="main-content" className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

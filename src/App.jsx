import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import Auth from './pages/Auth.jsx'
import Transactions from './pages/Transactions.jsx'
import BudgetRules from './pages/BudgetRules.jsx'
import Reports from './pages/Reports.jsx'
import Profile from './pages/Profile.jsx'
import Subscriptions from './pages/Subscriptions.jsx'
import Debt from './pages/Debt.jsx'
import Landing from './pages/Landing.jsx'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard"
            element={
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                <DashboardPage />
              </motion.div>
            }
          />
          <Route
            path="/transactions"
            element={
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                <Transactions />
              </motion.div>
            }
          />
          <Route
            path="/reports"
            element={
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                <Reports />
              </motion.div>
            }
          />
          <Route
            path="/budgets"
            element={
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                <BudgetRules />
              </motion.div>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                <Subscriptions />
              </motion.div>
            }
          />
          <Route
            path="/debt"
            element={
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                <Debt />
              </motion.div>
            }
          />
          <Route
            path="/profile"
            element={
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }} exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}>
                <Profile />
              </motion.div>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App

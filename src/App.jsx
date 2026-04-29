import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SimplePage from './pages/SimplePage.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Income from './pages/Income.jsx'
import Transactions from './pages/Transactions.jsx'
import BudgetRules from './pages/BudgetRules.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="income" element={<Income />} />
        <Route path="transactions" element={<Transactions />} />
        <Route
          path="reports"
          element={
            <SimplePage
              heading="Reports"
              description="Generate insights from monthly performance, spending, and cash flow trends."
            />
          }
        />
        <Route
          path="budgets"
          element={<BudgetRules />}
        />
        <Route
          path="profile"
          element={
            <SimplePage
              heading="Profile"
              description="Manage your account details, preferences, and connected finance tools."
            />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App

import { Navigate, Route, Routes } from 'react-router-dom'
import React from 'react'
import Layout from './components/layout/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SimplePage from './pages/SimplePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { auth } from './firebase.js'

function App() {
  const [state, setState] = React.useState({
    isLoading: true,
    user: null,
  })

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setState({ isLoading: false, user })
    })
    return () => unsub()
  }, [])

  if (state.isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
        <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          Loading Smart Finance…
        </div>
      </main>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={state.user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={state.user ? '/dashboard' : '/login'} replace />} />
        <Route
          path="dashboard"
          element={state.user ? <DashboardPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="transactions"
          element={
            state.user ? (
              <SimplePage
                heading="Transactions"
                description="Track and review incoming and outgoing activity across all accounts."
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="reports"
          element={
            state.user ? (
              <SimplePage
                heading="Reports"
                description="Generate insights from monthly performance, spending, and cash flow trends."
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="budgets"
          element={
            state.user ? (
              <SimplePage
                heading="Budgets"
                description="Set category goals, compare actuals, and keep your spending on target."
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="profile"
          element={
            state.user ? (
              <SimplePage
                heading="Profile"
                description="Manage your account details, preferences, and connected finance tools."
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Route>
    </Routes>
  )
}

export default App

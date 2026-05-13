import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { logout } from '../services/authService.js'
import useFinanceData from '../hooks/useFinanceData.js'
import { quickFade, modalOverlay, modalContent } from '../utils/animations.js'

function formatDate(date) {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { currency, setCurrency: setGlobalCurrency, formatCurrency } = useCurrency()
  const { theme, toggleTheme } = useTheme()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [notifications, setNotifications] = React.useState(true)
  const { incomes, expenses, totalIncome, totalExpenses, balance, loading } = useFinanceData()

  const totalTransactions = incomes.length + expenses.length
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  const userEmail = user?.email || 'No email'
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const userPhoto = user?.photoURL || null
  const joinDate = user?.metadata?.creationTime ? new Date(user.metadata.creationTime) : null

  async function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) return
    setIsLoggingOut(true)
    try { await logout(); navigate('/login') }
    catch (err) { alert(err?.message || 'Failed to logout'); setIsLoggingOut(false) }
  }
  function handleDeleteAccount() { setShowDeleteModal(true) }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="dashboard-card px-4 py-3 text-sm font-semibold text-slate-300">Loading profile…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0 }}>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Smart Finance</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">Profile & Settings</h1>
          </div>
        </header>
      </motion.div>

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.08 }} className="mx-auto max-w-2xl">
        <article className="dashboard-card p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }} className="flex-shrink-0">
              {userPhoto ? (
                <motion.img whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6,182,212,0.3)' }} src={userPhoto} alt={userName} className="h-24 w-24 rounded-full ring-4 ring-white/20 shadow-lg object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail || userName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`} alt={userName} className="h-24 w-24 rounded-full ring-4 ring-white/20 shadow-lg" />
              )}
            </motion.div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white">{userName}</h2>
              <p className="mt-1 text-sm text-slate-400">{userEmail}</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.3 }}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/20"
                ><span>👤</span><span>Free Account</span></motion.span>
                {joinDate && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.35 }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-white/10"
                  ><span>📅</span><span>Joined {formatDate(joinDate)}</span></motion.span>
                )}
              </div>
            </div>
          </div>
        </article>
      </motion.div>

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.15 }}>
        <section>
          <h2 className="text-lg font-semibold text-white">Account Overview</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Income', value: formatCurrency(totalIncome), icon: '💰' },
              { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: '💸' },
              { label: 'Transactions', value: totalTransactions, icon: '📊' },
              { label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, icon: '📈' },
            ].map((card, idx) => (
              <motion.div key={card.label} {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.2 + idx * 0.08 }}>
                <article className="dashboard-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">{card.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/8 text-2xl">{card.icon}</div>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
        </section>
      </motion.div>

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.25 }}>
        <section className="grid gap-6 lg:grid-cols-2">
          <article className="dashboard-card p-6">
            <h2 className="text-lg font-semibold text-white">General Settings</h2>
            <p className="mt-1 text-sm text-slate-400">Manage your app preferences</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div>
                  <p className="text-sm font-semibold text-white">Currency</p>
                  <p className="mt-0.5 text-xs text-slate-400">Choose your preferred currency</p>
                </div>
                <select value={currency} onChange={(e) => setGlobalCurrency(e.target.value)} className="dashboard-input w-auto">
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                  <option value="AED">AED - UAE Dirham (د.إ)</option>
                  <option value="SAR">SAR - Saudi Riyal (ر.س)</option>
                </select>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div>
                  <p className="text-sm font-semibold text-white">Theme</p>
                  <p className="mt-0.5 text-xs text-slate-400">Switch between light and dark mode</p>
                </div>
                <motion.button type="button" onClick={toggleTheme} whileTap={{ scale: 0.9 }}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-cyan-600' : 'bg-slate-400'}`}
                >
                  <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </motion.button>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                <div>
                  <p className="text-sm font-semibold text-white">Notifications</p>
                  <p className="mt-0.5 text-xs text-slate-400">Receive budget alerts and updates</p>
                </div>
                <motion.button type="button" onClick={() => setNotifications(!notifications)} whileTap={{ scale: 0.9 }}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${notifications ? 'bg-emerald-600' : 'bg-slate-600'}`}
                >
                  <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ${notifications ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </motion.button>
              </div>
            </div>
          </article>
          <article className="dashboard-card p-6">
            <h2 className="text-lg font-semibold text-white">Account Actions</h2>
            <p className="mt-1 text-sm text-slate-400">Manage your account</p>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Export Data', desc: 'Download your financial data as CSV', icon: '📥', action: () => navigate('/dashboard') },
                { label: 'View Reports', desc: 'See detailed financial analytics', icon: '📊', action: () => navigate('/reports') },
                { label: 'Budget Rules', desc: 'Create and manage spending limits', icon: '💰', action: () => navigate('/budgets') },
              ].map((item, idx) => (
                <motion.button key={item.label} type="button" onClick={item.action}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.06, duration: 0.25 }}
                  whileHover={{ x: 4 }} whileTap={{ scale: 0.99 }}
                  className="w-full rounded-xl bg-white/5 px-4 py-3 text-left ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/8 text-xl">{item.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </article>
        </section>
      </motion.div>

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.35 }} className="rounded-2xl bg-rose-400/10 p-6 ring-1 ring-rose-400/20">
        <h2 className="text-lg font-semibold text-rose-200">Danger Zone</h2>
        <p className="mt-1 text-sm text-rose-300">Irreversible actions that affect your account</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <motion.button type="button" onClick={handleLogout} disabled={isLoggingOut} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="button-secondary flex-1 rounded-xl px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </motion.button>
          <motion.button type="button" onClick={handleDeleteAccount} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Delete Account
          </motion.button>
        </div>
      </motion.div>

      {showDeleteModal && (
        <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.button type="button" onClick={() => setShowDeleteModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-label="Close modal" />
          <motion.div {...modalContent} className="dashboard-card relative w-full max-w-md p-6 shadow-xl">
            <div className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-400/10 text-3xl"
              >⚠️</motion.div>
              <h3 className="mt-4 text-xl font-bold text-white">Delete Account</h3>
              <p className="mt-2 text-sm text-slate-400">This action cannot be undone. All your financial data, transactions, and settings will be permanently deleted.</p>
              <div className="mt-6 flex gap-3">
                <motion.button type="button" onClick={() => setShowDeleteModal(false)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="button-secondary flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold"
                >Cancel</motion.button>
                <motion.button type="button" onClick={() => { alert('Account deletion is not implemented yet. This is a UI placeholder.'); setShowDeleteModal(false) }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                >Delete Forever</motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
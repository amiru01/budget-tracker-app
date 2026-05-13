import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import useFinanceData from '../hooks/useFinanceData.js'
import StatCard from '../components/StatCard.jsx'
import TransactionItem from '../components/TransactionItem.jsx'
import IncomeChart from '../components/IncomeChart.jsx'
import InsightCard from '../components/InsightCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { quickFade } from '../utils/animations.js'
import { subscribeToDebts } from '../services/debtService.js'
import { subscribeToSubscriptions } from '../services/subscriptionService.js'

const MODULES = [
  { title: 'Track My Spending', desc: 'Log and categorize every expense with visual analytics.', icon: '💳', path: '/transactions', color: 'from-cyan-500 to-blue-600' },
  { title: 'Control My Subscriptions', desc: 'Monitor recurring payments and manage subscriptions.', icon: '📱', path: '/subscriptions', color: 'from-purple-500 to-pink-600' },
  { title: 'Pay Off My Debt', desc: 'Track debts, prioritize payments, and reach financial freedom.', icon: '🎯', path: '/debt', color: 'from-amber-500 to-rose-600' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { formatCurrency } = useCurrency()
  const [mode, setMode] = React.useState(() => localStorage.getItem('financeMode') || null)
  const [debts, setDebts] = React.useState([])
  const [subs, setSubs] = React.useState([])
  const { expenses, incomes, totalIncome, totalExpenses, balance, loading, error } = useFinanceData()

  React.useEffect(() => {
    if (mode) localStorage.setItem('financeMode', mode)
  }, [mode])

  React.useEffect(() => {
    if (user?.uid) {
      const unsubs = [
        subscribeToDebts(user.uid, setDebts, console.error),
        subscribeToSubscriptions(user.uid, setSubs, console.error),
      ]
      return () => unsubs.forEach((u) => u())
    }
  }, [user?.uid])

  const todayStr = new Date().toISOString().split('T')[0]
  const dueDebts = React.useMemo(() => debts.filter((d) => !d.isPaid && d.dueDate === todayStr), [debts, todayStr])
  const overdueDebts = React.useMemo(() => debts.filter((d) => !d.isPaid && d.dueDate && d.dueDate < todayStr), [debts, todayStr])
  const debtsWithPlan = React.useMemo(() => debts.filter((d) => !d.isPaid && d.savingFrequency && d.savingAmount > 0), [debts])
  const subsDueSoon = React.useMemo(() => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 86400000)
    return subs.filter((s) => s.isActive && s.renewalDate && new Date(s.renewalDate) >= now && new Date(s.renewalDate) <= weekFromNow)
  }, [subs])

  if (!mode) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <motion.div {...quickFade} className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-tertiary">Welcome to</p>
            <h1 className="font-display mt-2 text-4xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Smart Finance</h1>
            <p className="mt-3 text-ink-secondary max-w-md mx-auto">Choose how you want to use your finance workspace.</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            <motion.button onClick={() => setMode('personal')} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -4 }} className="dashboard-card group p-8 text-left transition-all hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-3xl shadow-lg shadow-cyan-500/20">👤</div>
              <h2 className="font-display text-xl font-bold text-ink group-hover:text-emerald-500 transition-colors">Personal Use</h2>
              <p className="mt-2 text-sm text-ink-secondary leading-relaxed">Track spending, manage subscriptions, monitor net worth, and pay off debt — all in one place.</p>
              <div className="mt-4 flex gap-2 text-xs text-ink-tertiary">
                <span className="rounded-full bg-surface-secondary px-2.5 py-1 ring-1 ring-border-subtle">3 Modules</span>
                <span className="rounded-full bg-surface-secondary px-2.5 py-1 ring-1 ring-border-subtle">Personal Finance</span>
              </div>
            </motion.button>
            <motion.button onClick={() => setMode('org')} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -4 }} className="dashboard-card group p-8 text-left transition-all hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 text-3xl shadow-lg shadow-purple-500/20">🏢</div>
              <h2 className="font-display text-xl font-bold text-ink group-hover:text-purple-500 transition-colors">Organizational Use</h2>
              <p className="mt-2 text-sm text-ink-secondary leading-relaxed">Team finance tracking, shared accounts, expense management, budgets, and multi-user reports.</p>
              <div className="mt-4 flex gap-2 text-xs text-ink-tertiary">
                <span className="rounded-full bg-surface-secondary px-2.5 py-1 ring-1 ring-border-subtle">Team Mode</span>
                <span className="rounded-full bg-surface-secondary px-2.5 py-1 ring-1 ring-border-subtle">Shared Access</span>
              </div>
            </motion.button>
          </div>
          <p className="mt-6 text-center text-xs text-ink-quaternary">You can change this later in Settings.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
      <div className="dashboard-card px-4 py-3 text-sm font-bold text-ink-secondary flex items-center gap-3">
        <Spinner size="md" /><span>Loading dashboard...</span>
      </div>
    </div>
  }

  if (mode === 'org') {
    return (
      <div className="space-y-7">
        <motion.div {...quickFade}>
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-tertiary">Finance OS</p>
              <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Organization Dashboard</h1>
              <p className="mt-1 text-sm text-ink-secondary">Team finance tracking and shared expense management.</p>
            </div>
            <button type="button" onClick={() => { localStorage.removeItem('financeMode'); setMode(null) }}
              className="button-secondary rounded-xl px-4 py-2 text-xs">Switch Mode</button>
          </header>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article className="dashboard-card p-8 text-center lg:col-span-3">
            <p className="text-5xl mb-4">🏢</p>
            <h2 className="font-display text-xl font-bold text-ink">Organizational Mode</h2>
            <p className="mt-2 text-ink-secondary max-w-md mx-auto">Team finance features are being rolled out. Start by adding expenses and building your team workspace.</p>
          </article>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod, idx) => (
            <motion.button key={mod.title} onClick={() => navigate(mod.path)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + idx * 0.06, duration: 0.3 }}
              whileHover={{ scale: 1.03, y: -2 }} className="dashboard-card group p-5 text-left transition-all">
              <span className="text-3xl">{mod.icon}</span>
              <h3 className="mt-3 font-semibold text-ink group-hover:text-emerald-500 transition-colors">{mod.title}</h3>
              <p className="mt-1 text-xs text-ink-secondary">{mod.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <motion.div {...quickFade}>
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-tertiary">Smart Finance</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Your finance command center</h1>
            <p className="mt-1 text-sm text-ink-secondary">Track cash flow, spending, and budget signals from one workspace.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => { localStorage.removeItem('financeMode'); setMode(null) }}
              className="button-secondary rounded-xl px-3 py-2 text-xs">Switch Mode</button>
            <button type="button" onClick={() => navigate('/transactions')} className="brand-button px-4 py-2.5 text-sm">Add transaction</button>
          </div>
        </header>
      </motion.div>

      {error ? (
        <motion.div {...quickFade} transition={{ delay: 0.08 }} className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-bold text-rose-600 shadow-lg shadow-rose-500/10 backdrop-blur-xl">
          {error}
        </motion.div>
      ) : null}

      {dueDebts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-amber-400/10 p-4 ring-1 ring-amber-400/20">
          <div className="flex items-start gap-3">
            <span className="text-xl">🔔</span>
            <div>
              <p className="text-sm font-semibold text-amber-600">Debt payment{dueDebts.length > 1 ? 's' : ''} due today</p>
              <p className="mt-1 text-sm text-amber-600">{dueDebts.map((d) => `${d.name} (${formatCurrency(d.remainingBalance)} remaining)`).join(', ')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {overdueDebts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-rose-400/10 p-4 ring-1 ring-rose-400/20">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-rose-600">{overdueDebts.length} overdue debt{overdueDebts.length > 1 ? 's' : ''}</p>
              <p className="mt-1 text-sm text-rose-600">{overdueDebts.map((d) => `${d.name} — was due ${new Date(d.dueDate).toLocaleDateString()}`).join(', ')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {debtsWithPlan.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-cyan-400/10 p-4 ring-1 ring-cyan-400/20">
          <div className="flex items-start gap-3">
            <span className="text-xl">💰</span>
            <div>
              <p className="text-sm font-semibold text-cyan-600">Debt Savings Plans</p>
              <div className="mt-1 space-y-0.5">
                {debtsWithPlan.map((d) => (
                  <p key={d.id} className="text-sm text-ink-secondary">
                    {d.name} — save {formatCurrency(d.savingAmount)} {d.savingFrequency}
                    {d.targetPayoffDate && `, target ${new Date(d.targetPayoffDate).toLocaleDateString()}`}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {subsDueSoon.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-purple-400/10 p-4 ring-1 ring-purple-400/20">
          <div className="flex items-start gap-3">
            <span className="text-xl">📱</span>
            <div>
              <p className="text-sm font-semibold text-purple-600">Subscriptions Renewing Soon</p>
              <div className="mt-1 space-y-0.5">
                {subsDueSoon.map((s) => (
                  <p key={s.id} className="text-sm text-ink-secondary">
                    {s.name} — {formatCurrency(s.price)} on {new Date(s.renewalDate).toLocaleDateString()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div {...quickFade} transition={{ delay: 0.1 }} className="dashboard-card p-6">
        <h2 className="font-display text-lg font-bold tracking-tight text-ink">Quick Actions</h2>
        <p className="mt-1 text-sm text-ink-secondary">Your personal finance modules.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod, idx) => (
            <motion.button key={mod.title} onClick={() => navigate(mod.path)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}
              whileHover={{ scale: 1.03, y: -2 }} className="dashboard-card group p-5 text-left transition-all hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${mod.color} text-xl shadow-lg`}>{mod.icon}</div>
              <h3 className="font-semibold text-ink group-hover:text-emerald-500 transition-colors">{mod.title}</h3>
              <p className="mt-1 text-xs text-ink-secondary">{mod.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div {...quickFade} transition={{ delay: 0.15 }}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total Balance" value={formatCurrency(balance)} sublabel="Across all accounts" accent="blue" />
          <StatCard label="Total Income" value={formatCurrency(totalIncome)} sublabel="Month to date" accent="green" />
          <StatCard label="Total Expenses" value={formatCurrency(totalExpenses)} sublabel="Month to date" accent="red" />
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...quickFade} transition={{ delay: 0.3 }} className="dashboard-card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Recent Activity</h2>
          <p className="mt-1 text-sm text-ink-secondary">Latest expenses across your accounts.</p>
          <ul className="mt-4 space-y-3">
            {expenses.length === 0 ? (
              <li className="rounded-xl bg-surface-secondary px-4 py-4 text-sm font-medium text-ink-secondary ring-1 ring-border-subtle">No transactions yet. Start tracking your spending.</li>
            ) : expenses.slice(0, 6).map((t, idx) => (
              <motion.li key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + idx * 0.04 }}>
                <TransactionItem name={t.type === 'income' ? 'Income' : 'Expense'} category={t.category} amount={t.amount} date={t.date} note={t.note} type={t.type || 'expense'} />
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...quickFade} transition={{ delay: 0.35 }}>
          <IncomeChart monthlyIncomeTrend={[]} incomeBySource={{ total: totalIncome, data: [] }} variant="preview" />
        </motion.div>
      </div>
    </div>
  )
}

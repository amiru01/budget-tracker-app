import React from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import useFinanceData from '../hooks/useFinanceData.js'
import ReportCard from '../components/ReportCard.jsx'
import InsightCard from '../components/InsightCard.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { subscribeToSubscriptions } from '../services/subscriptionService.js'
import { subscribeToDebts } from '../services/debtService.js'
import { quickFade, badgePop } from '../utils/animations.js'

const COLORS = ['#06b6d4', '#10b981', '#22c55e', '#14b8a6', '#0ea5e9', '#5eead4', '#7c3aed']

function CustomTooltip({ active, payload, label, formatCurrency }) {
  if (!active || !payload?.length) return null
  return (
    <div className="dashboard-card p-3 shadow-lg">
      <p className="text-xs font-semibold text-slate-400">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="mt-2 flex items-center justify-between gap-6">
          <span className="text-xs font-medium" style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-xs font-semibold text-slate-100">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Reports() {
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const [timeRange, setTimeRange] = React.useState('30D')
  const [subscriptions, setSubscriptions] = React.useState([])
  const [debts, setDebts] = React.useState([])
  const weeklyDays = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90
  const { incomes, expenses, totalIncome, totalExpenses, balance, categoryData, weeklyData, insights, loading, error } = useFinanceData({ weeklyDays })

  React.useEffect(() => {
    if (!user?.uid) return
    const unsubs = [
      subscribeToSubscriptions(user.uid, setSubscriptions, console.error),
      subscribeToDebts(user.uid, setDebts, console.error),
    ]
    return () => unsubs.forEach((u) => u())
  }, [user?.uid])

  const activeSubs = React.useMemo(() => subscriptions.filter((s) => s.isActive), [subscriptions])
  const subMonthlyTotal = React.useMemo(() => activeSubs.reduce((s, sub) => s + (sub.price || 0), 0), [activeSubs])
  const activeDebts = React.useMemo(() => debts.filter((d) => !d.isPaid && d.remainingBalance > 0), [debts])
  const debtTotalRemaining = React.useMemo(() => activeDebts.reduce((s, d) => s + (d.remainingBalance || 0), 0), [activeDebts])
  const debtTotalPaid = React.useMemo(() => debts.reduce((s, d) => s + ((d.totalAmount || 0) - (d.remainingBalance || 0)), 0), [debts])

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const comparisonData = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpenses, fill: '#f43f5e' },
  ]

  const trendData = React.useMemo(() => {
    if (weeklyData.length === 0) return { direction: 'stable', percentage: 0 }
    const midpoint = Math.floor(weeklyData.length / 2)
    const firstHalf = weeklyData.slice(0, midpoint).reduce((s, d) => s + d.amount, 0)
    const secondHalf = weeklyData.slice(midpoint).reduce((s, d) => s + d.amount, 0)
    if (firstHalf === 0) return { direction: 'stable', percentage: 0 }
    const change = ((secondHalf - firstHalf) / firstHalf) * 100
    return { direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable', percentage: Math.abs(change).toFixed(1) }
  }, [weeklyData])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="dashboard-card px-4 py-3 text-sm font-bold text-slate-300">Loading reports…</div>
      </div>
    )
  }

  const hasData = incomes.length > 0 || expenses.length > 0

  return (
    <div className="space-y-6">
      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0 }}>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Smart Finance</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">Financial Reports</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-400">Period:</span>
            {['7D', '30D', '90D'].map((r) => (
              <button key={r} type="button" onClick={() => setTimeRange(r)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${timeRange === r ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/15' : 'bg-white/8 text-slate-300 ring-1 ring-white/10 hover:bg-white/12 hover:text-white'}`}
              >{r === '7D' ? '7 Days' : r === '30D' ? '30 Days' : '90 Days'}</button>
            ))}
          </div>
        </header>
      </motion.div>

      {error ? (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.08 }} className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-bold text-rose-100 shadow-lg shadow-rose-500/10 backdrop-blur-xl">
          {error}
        </motion.div>
      ) : null}

      {!hasData ? (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.12 }} className="dashboard-card p-12 text-center shadow-md">
          <div className="mx-auto max-w-md">
            <p className="text-6xl">📊</p>
            <h2 className="mt-6 text-xl font-semibold text-white">No financial data available</h2>
            <p className="mt-2 text-sm text-slate-400">Start tracking your finances to see detailed reports and insights.</p>
            <button type="button" onClick={() => (window.location.href = '/transactions')} className="brand-button mt-6 px-6 py-3 text-sm">Add your first transaction</button>
          </div>
        </motion.div>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Income', value: formatCurrency(totalIncome), icon: '💰', variant: 'success' },
              { label: 'Total Expenses', value: formatCurrency(totalExpenses), icon: '💸', trend: trendData, variant: 'danger' },
              { label: 'Net Savings', value: formatCurrency(balance), icon: '💎', variant: balance >= 0 ? 'success' : 'danger' },
              { label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, icon: '📈', variant: savingsRate >= 20 ? 'success' : savingsRate >= 10 ? 'warning' : 'danger' },
            ].map((card, idx) => (
              <motion.div key={card.label} {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.1 + idx * 0.08 }}>
                <ReportCard {...card} />
              </motion.div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div {...quickFade} transition={{ delay: 0.2 }}>
              <ReportCard label="Active Subscriptions" value={`${activeSubs.length}`} icon="📱" variant="success" />
            </motion.div>
            <motion.div {...quickFade} transition={{ delay: 0.22 }}>
              <ReportCard label="Subscriptions Annual" value={formatCurrency(subMonthlyTotal * 12)} icon="💳" variant="warning" />
            </motion.div>
            <motion.div {...quickFade} transition={{ delay: 0.24 }}>
              <ReportCard label="Debt Remaining" value={formatCurrency(debtTotalRemaining)} icon="🎯" variant={debtTotalRemaining > 0 ? 'danger' : 'success'} />
            </motion.div>
            <motion.div {...quickFade} transition={{ delay: 0.26 }}>
              <ReportCard label="Total Debt Paid" value={formatCurrency(debtTotalPaid)} icon="✅" variant="success" />
            </motion.div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.3 }} className="dashboard-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Spending Trend</h2>
                  <p className="mt-1 text-sm text-slate-400">Daily spending over the selected period</p>
                </div>
                <span className="rounded-full bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/20">{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                    <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
                    <Line type="monotone" dataKey="amount" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e', r: 4 }} activeDot={{ r: 6 }} name="Spending" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.35 }} className="dashboard-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Income vs Expenses</h2>
                  <p className="mt-1 text-sm text-slate-400">Comparison of total amounts</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${balance >= 0 ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20' : 'bg-rose-400/10 text-rose-300 ring-rose-400/20'}`}>
                  {balance >= 0 ? 'Surplus' : 'Deficit'}
                </span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
                    <Bar dataKey="amount" radius={[10, 10, 0, 0]} name="Amount">
                      {comparisonData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </section>

          <section className="grid gap-6 lg:grid-cols-5">
            <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.4 }} className="dashboard-card p-6 lg:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">Category Breakdown</h2>
                  <p className="mt-1 text-sm text-slate-400">Spending by category</p>
                </div>
                <motion.span {...badgePop} className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                  {categoryData.data.length} categories
                </motion.span>
              </div>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.data.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{ borderRadius: 12, border: '1px solid rgba(148, 163, 184, 0.18)', background: 'rgba(15, 23, 42, 0.72)', backdropFilter: 'blur(20px)', color: '#f8fafc' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {categoryData.data.slice(0, 6).map((cat, idx) => (
                  <motion.span key={cat.name} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.5 + idx * 0.05 }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-white/10"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {cat.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.45 }} className="dashboard-card p-6 lg:col-span-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">AI Insights</h2>
                  <p className="mt-1 text-sm text-slate-400">Smart analysis of your financial patterns</p>
                </div>
                <motion.span {...badgePop} className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300 ring-1 ring-cyan-400/20">Live</motion.span>
              </div>
              <div className="mt-6 space-y-3">
                {insights.length === 0 ? (
                  <div className="dashboard-card p-4 text-center"><p className="text-sm text-slate-400">Add more transactions to unlock personalized insights</p></div>
                ) : (
                  insights.map((insight, idx) => (
                    <motion.div key={insight.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + idx * 0.08, duration: 0.25 }}>
                      <InsightCard title={insight.title} message={insight.message} />
                    </motion.div>
                  ))
                )}
              </div>
              <div className="mt-6 space-y-3">
                {savingsRate < 10 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.25 }} className="rounded-xl bg-amber-400/10 p-4 ring-1 ring-amber-400/20">
                    <div className="flex items-start gap-3"><span className="text-xl">⚠️</span><div><p className="text-sm font-semibold text-amber-200">Low Savings Rate</p><p className="mt-1 text-sm text-amber-300">Your savings rate is {savingsRate.toFixed(1)}%. Consider reducing expenses or increasing income to reach the recommended 20%.</p></div></div>
                  </motion.div>
                )}
                {trendData.direction === 'up' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.25 }} className="rounded-xl bg-rose-400/10 p-4 ring-1 ring-rose-400/20">
                    <div className="flex items-start gap-3"><span className="text-xl">📈</span><div><p className="text-sm font-semibold text-rose-200">Spending Increased</p><p className="mt-1 text-sm text-rose-300">Your spending increased by {trendData.percentage}% compared to the previous period. Review your expenses to stay on budget.</p></div></div>
                  </motion.div>
                )}
                {trendData.direction === 'down' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.25 }} className="rounded-xl bg-emerald-400/10 p-4 ring-1 ring-emerald-400/20">
                    <div className="flex items-start gap-3"><span className="text-xl">📉</span><div><p className="text-sm font-semibold text-emerald-200">Spending Decreased</p><p className="mt-1 text-sm text-emerald-300">Great job! Your spending decreased by {trendData.percentage}% compared to the previous period.</p></div></div>
                  </motion.div>
                )}
                {categoryData.data.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.25 }} className="rounded-xl bg-sky-400/10 p-4 ring-1 ring-sky-400/20">
                    <div className="flex items-start gap-3"><span className="text-xl">🎯</span><div><p className="text-sm font-semibold text-sky-200">Top Category</p><p className="mt-1 text-sm text-sky-300"><strong>{categoryData.data[0]?.name}</strong> is your highest expense category at {formatCurrency(categoryData.data[0]?.value || 0)}.</p></div></div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </section>
        </>
      )}
    </div>
  )
}
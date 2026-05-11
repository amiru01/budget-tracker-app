import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CartesianGrid,
  Tooltip,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import useFinanceData from '../hooks/useFinanceData.js'
import AddExpenseModal from '../components/AddExpenseModal.jsx'
import BudgetRuleModal from '../components/BudgetRuleModal.jsx'
import InsightCard from '../components/InsightCard.jsx'
import IncomeChart from '../components/IncomeChart.jsx'
import StatCard from '../components/StatCard.jsx'
import TransactionItem from '../components/TransactionItem.jsx'
import ChartTooltip from '../components/ChartTooltip.jsx'
import { addBudgetRule, subscribeToBudgetRules, checkBudgetViolations } from '../services/budgetService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import Spinner from '../components/Spinner.jsx'
import Skeleton from '../components/Skeleton.jsx'

const pieColors = ['#06b6d4', '#10b981', '#22c55e', '#14b8a6', '#0ea5e9', '#5eead4', '#7c3aed']

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { formatCurrency } = useCurrency()
  const [range, setRange] = React.useState('7D')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false)
  const [budgetRules, setBudgetRules] = React.useState([])
  const [isExporting, setIsExporting] = React.useState(false)
  const [hoveredWeekly, setHoveredWeekly] = React.useState(null)

  const weeklyDays = range === '7D' ? 7 : range === '30D' ? 30 : 90

  const {
    expenses,
    incomes,
    totalIncome,
    totalExpenses,
    balance,
    categoryData,
    weeklyData,
    insights,
    incomeMonthlyTrend,
    incomeBySource,
    loading,
    error,
    actions,
  } = useFinanceData({ weeklyDays })

  // Subscribe to budget rules
  React.useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = subscribeToBudgetRules(
      user.uid,
      setBudgetRules,
      (err) => console.error('Budget rules error:', err)
    )

    return unsubscribe
  }, [user?.uid])

  // Check for budget violations
  const budgetViolations = React.useMemo(() => {
    return checkBudgetViolations(expenses, budgetRules)
  }, [expenses, budgetRules])

  async function handleAddExpense(payload) {
    await actions.addExpense(payload)
  }

  async function handleDelete(id) {
    await actions.deleteExpense(id)
  }

  async function handleCreateBudgetRule(ruleData) {
    if (!user?.uid) throw new Error('Please sign in to create budget rules')
    await addBudgetRule({ userId: user.uid, ...ruleData })
  }

  function handleExportData() {
    setIsExporting(true)
    
    try {
      // Merge incomes and expenses
      const allTransactions = [
        ...incomes.map((income) => ({
          date: income.date?.toDate ? income.date.toDate().toISOString() : income.date,
          type: 'Income',
          category: income.source || income.category,
          amount: income.amount,
          note: income.note || '',
        })),
        ...expenses.map((expense) => ({
          date: expense.date?.toDate ? expense.date.toDate().toISOString() : expense.date,
          type: 'Expense',
          category: expense.category,
          amount: expense.amount,
          note: expense.note || '',
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date))

      // Create CSV content
      const headers = ['Date', 'Type', 'Category', 'Amount', 'Note']
      const csvRows = [
        headers.join(','),
        ...allTransactions.map((t) => {
          const date = new Date(t.date).toLocaleDateString()
          const amount = t.amount.toFixed(2)
          const note = `"${(t.note || '').replace(/"/g, '""')}"` // Escape quotes
          return [date, t.type, t.category, amount, note].join(',')
        }),
      ]

      // Add summary at the end
      csvRows.push('')
      csvRows.push('Summary')
      csvRows.push(`Total Income,${totalIncome.toFixed(2)}`)
      csvRows.push(`Total Expenses,${totalExpenses.toFixed(2)}`)
      csvRows.push(`Net Balance,${balance.toFixed(2)}`)

      const csvContent = csvRows.join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `smart-finance-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="dashboard-card px-4 py-3 text-sm font-bold text-slate-700 flex items-center gap-3">
          <Spinner size="md" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Finance dashboard</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-4xl">
            Your financial command center
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Track cash flow, spending behavior, and budget signals from one clean workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting || (expenses.length === 0 && incomes.length === 0)}
            className="button-secondary rounded-xl px-4 py-2.5 text-sm"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="brand-button px-4 py-2.5 text-sm"
          >
            Add transaction
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-bold text-rose-100 shadow-lg shadow-rose-500/10 backdrop-blur-xl">
          {error}
        </div>
      ) : null}

      {budgetViolations.length > 0 ? (
        <div className="rounded-3xl border border-amber-300/20 bg-amber-400/10 p-5 shadow-lg shadow-amber-500/10 backdrop-blur-xl">
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-amber-100">Budget alerts</h3>
          <div className="mt-3 space-y-3">
            {budgetViolations.map((violation, idx) => (
              <div key={idx} className="rounded-2xl border border-amber-300/20 bg-amber-500/5 p-4 text-sm font-medium text-amber-100">
                <strong className="font-bold text-amber-200">{violation.rule.name}</strong>: You&apos;ve spent{' '}
                {formatCurrency(violation.spending)} ({formatCurrency(violation.excess)} over your{' '}
                {violation.period} limit of {formatCurrency(violation.rule.limit)})
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Balance"
          value={formatCurrency(balance)}
          sublabel="Across all connected accounts"
          accent="blue"
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(totalIncome)}
          sublabel="Month to date"
          accent="green"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          sublabel="Month to date"
          accent="red"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <article className="dashboard-card p-6 transition hover:shadow-lg lg:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">Spending trend</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-400">
                Daily outflow across the selected review window.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRange('7D')}
                className={[
                  'rounded-xl px-3 py-2 text-sm font-bold transition',
                  range === '7D'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/15'
                    : 'bg-white/8 text-slate-300 ring-1 ring-white/10 hover:bg-white/12 hover:text-white',
                ].join(' ')}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => setRange('30D')}
                className={[
                  'rounded-xl px-3 py-2 text-sm font-bold transition',
                  range === '30D'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/15'
                    : 'bg-white/8 text-slate-300 ring-1 ring-white/10 hover:bg-white/12 hover:text-white',
                ].join(' ')}
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => setRange('90D')}
                className={[
                  'rounded-xl px-3 py-2 text-sm font-bold transition',
                  range === '90D'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/15'
                    : 'bg-white/8 text-slate-300 ring-1 ring-white/10 hover:bg-white/12 hover:text-white',
                ].join(' ')}
              >
                90D
              </button>
            </div>
          </div>

          <div className="dashboard-panel mt-6 p-4">
            <div className="h-72 rounded-lg bg-slate-950/35 p-2 ring-1 ring-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.18)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    width={40}
                    tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                  />
                  <Tooltip content={<ChartTooltip formatCurrency={formatCurrency} seriesLabel="Spending" />} cursor={{ stroke: 'rgba(45,212,191,0.35)', strokeWidth: 1 }} />

                  <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#06b6d4" onMouseLeave={() => setHoveredWeekly(null)}>
                    {weeklyData.map((entry, idx) => (
                      <Cell
                        key={`weekly-bar-${idx}`}
                        fill="#06b6d4"
                        onMouseEnter={() => setHoveredWeekly(idx)}
                        style={
                          hoveredWeekly === idx
                            ? { filter: 'drop-shadow(0 0 18px rgba(45,212,191,0.18))', transition: 'filter 150ms' }
                            : { transition: 'filter 150ms' }
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>

        <article className="dashboard-card p-6 transition hover:shadow-lg lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">Category mix</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-400">Where your spending is concentrated.</p>
            </div>
            <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-slate-200 ring-1 ring-white/10">
              {formatCurrency(categoryData.total)}
            </span>
          </div>

          <div className="dashboard-panel mt-6 p-4">
            <div className="h-72 rounded-lg bg-slate-950/35 p-2 ring-1 ring-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
                    content={<ChartTooltip formatCurrency={formatCurrency} />}
                  />
                  <Pie
                    data={categoryData.data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {categoryData.data.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categoryData.data.slice(0, 6).map((c, idx) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-slate-300 ring-1 ring-white/10"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                />
                {c.name}
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="dashboard-card p-6 transition hover:shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">Recent activity</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-400">Latest expenses and income entries.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="button-secondary rounded-xl px-4 py-2 text-sm"
            >
              View all
            </button>
          </div>

          <ul className="mt-6 space-y-3">
            {loading ? (
              <li className="rounded-xl bg-white/6 px-4 py-4 text-sm font-medium text-slate-400 ring-1 ring-white/10">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </li>
            ) : null}
            {!loading && expenses.length === 0 ? (
              <li className="rounded-3xl bg-white/6 px-6 py-6 text-sm font-medium text-slate-400 ring-1 ring-white/10 shadow-lg shadow-slate-950/10">
                No transactions yet. Add your first expense to see charts and insights update.
              </li>
            ) : null}

            {expenses.slice(0, 6).map((t) => (
              <TransactionItem
                key={t.id}
                name={t.type === 'income' ? 'Income' : 'Expense'}
                category={t.category}
                amount={t.amount}
                date={t.date}
                note={t.note}
                type={t.type || 'expense'}
                onDelete={() => handleDelete(t.id)}
              />
            ))}
          </ul>
        </article>

        <IncomeChart monthlyIncomeTrend={incomeMonthlyTrend} incomeBySource={incomeBySource} variant="preview" />

        <article className="dashboard-card p-6 transition hover:shadow-cyan-500/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">Planning signals</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-400">Timely prompts based on your current activity.</p>
            </div>
            <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300 ring-1 ring-cyan-300/20">
              Beta
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {insights.map((insight) => (
              <InsightCard key={insight.id} title={insight.title} message={insight.message} />
            ))}
          </div>

          <div className="dashboard-panel mt-6 p-4">
            <p className="text-sm font-bold text-white">Next best action</p>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-400">
              Consider setting a weekly category cap for dining to reduce surprises.
            </p>
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(true)}
              className="brand-button mt-3 w-full px-4 py-2.5 text-sm"
            >
              Create a budget rule
            </button>
          </div>
        </article>
      </section>

      <AddExpenseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExpense}
      />

      <BudgetRuleModal
        open={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={handleCreateBudgetRule}
        onSuccess={() => {
          setIsBudgetModalOpen(false)
          navigate('/budget-rules')
        }}
      />
    </div>
  )
}

export default Dashboard

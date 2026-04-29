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
import { addBudgetRule, subscribeToBudgetRules, checkBudgetViolations } from '../services/budgetService.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'

function SpendingTooltip({ active, payload, label, formatCurrency }) {
  if (!active || !payload?.length) return null

  const expenses = payload.find((p) => p.dataKey === 'amount')?.value ?? 0

  return (
    <div className="rounded-xl bg-white p-3 shadow-lg ring-1 ring-slate-200">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs font-medium text-rose-700">Spending</span>
          <span className="text-xs font-semibold text-slate-900">{formatCurrency(expenses)}</span>
        </div>
      </div>
    </div>
  )
}

const pieColors = ['#0ea5e9', '#10b981', '#f97316', '#a855f7', '#f43f5e', '#14b8a6', '#64748b']

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { formatCurrency } = useCurrency()
  const [range, setRange] = React.useState('7D')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false)
  const [budgetRules, setBudgetRules] = React.useState([])
  const [isExporting, setIsExporting] = React.useState(false)

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
        <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          Loading dashboard…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Finance Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Overview & insights
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportData}
            disabled={isExporting || (expenses.length === 0 && incomes.length === 0)}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md"
          >
            Add transaction
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
          {error}
        </div>
      ) : null}

      {budgetViolations.length > 0 ? (
        <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
          <h3 className="text-sm font-semibold text-amber-800">Budget Alerts</h3>
          <div className="mt-2 space-y-2">
            {budgetViolations.map((violation, idx) => (
              <div key={idx} className="text-sm text-amber-700">
                <strong>{violation.rule.name}</strong>: You've spent{' '}
                {formatCurrency(violation.spending)} (${formatCurrency(violation.excess)} over your{' '}
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
        <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200/70 transition hover:shadow-lg lg:col-span-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Weekly Spending</h2>
              <p className="mt-1 text-sm text-slate-500">
                Real-time spending totals grouped by day.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRange('7D')}
                className={[
                  'rounded-xl px-3 py-2 text-sm font-semibold transition',
                  range === '7D'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ].join(' ')}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => setRange('30D')}
                className={[
                  'rounded-xl px-3 py-2 text-sm font-semibold transition',
                  range === '30D'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ].join(' ')}
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => setRange('90D')}
                className={[
                  'rounded-xl px-3 py-2 text-sm font-semibold transition',
                  range === '90D'
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ].join(' ')}
              >
                90D
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/50">
            <div className="h-72 rounded-lg bg-white/60 p-2 ring-1 ring-slate-200/60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    width={40}
                    tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                  />
                  <Tooltip content={<SpendingTooltip formatCurrency={formatCurrency} />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />

                  <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </article>

        <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200/70 transition hover:shadow-lg lg:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Category Breakdown</h2>
              <p className="mt-1 text-sm text-slate-500">Distribution of spending by category.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {formatCurrency(categoryData.total)}
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/50">
            <div className="h-72 rounded-lg bg-white/60 p-2 ring-1 ring-slate-200/60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgb(226 232 240)',
                    }}
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
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
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
        <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200/70 transition hover:shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
              <p className="mt-1 text-sm text-slate-500">Latest activity across your accounts.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              View all
            </button>
          </div>

          <ul className="mt-6 space-y-3">
            {loading ? (
              <li className="rounded-xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600 ring-1 ring-slate-100">
                Loading transactions…
              </li>
            ) : null}
            {!loading && expenses.length === 0 ? (
              <li className="rounded-xl bg-slate-50 px-4 py-4 text-sm text-slate-600 ring-1 ring-slate-100">
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

        <article className="rounded-xl bg-sky-50 p-6 shadow-md ring-1 ring-sky-200/70 transition hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
              <p className="mt-1 text-sm text-slate-600">Personalized, trend-aware suggestions.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
              Beta
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {insights.map((insight) => (
              <InsightCard key={insight.id} title={insight.title} message={insight.message} />
            ))}
          </div>

          <div className="mt-6 rounded-xl bg-white p-4 ring-1 ring-sky-100">
            <p className="text-sm font-semibold text-slate-900">Next best action</p>
            <p className="mt-1 text-sm text-slate-600">
              Consider setting a weekly category cap for dining to reduce surprises.
            </p>
            <button
              type="button"
              onClick={() => setIsBudgetModalOpen(true)}
              className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
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
      />
    </div>
  )
}

export default Dashboard


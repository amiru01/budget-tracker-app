import React from 'react'
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
import InsightCard from '../components/InsightCard.jsx'
import IncomeChart from '../components/IncomeChart.jsx'
import StatCard from '../components/StatCard.jsx'
import TransactionItem from '../components/TransactionItem.jsx'

function formatCurrency(value) {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return value < 0 ? `-${formatted}` : formatted
}

function SpendingTooltip({ active, payload, label }) {
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
  const [range, setRange] = React.useState('7D')
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const weeklyDays = range === '7D' ? 7 : range === '30D' ? 30 : 90

  const {
    expenses,
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

  async function handleAddExpense(payload) {
    await actions.addExpense(payload)
  }

  async function handleDelete(id) {
    await actions.deleteExpense(id)
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
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:shadow-md"
          >
            Export
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
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
                  <Tooltip content={<SpendingTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />

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
    </div>
  )
}

export default Dashboard


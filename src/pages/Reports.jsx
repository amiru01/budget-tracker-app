import React from 'react'
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
  Legend,
} from 'recharts'
import useFinanceData from '../hooks/useFinanceData.js'
import ReportCard from '../components/ReportCard.jsx'
import InsightCard from '../components/InsightCard.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'

const COLORS = ['#0ea5e9', '#10b981', '#f97316', '#a855f7', '#f43f5e', '#14b8a6', '#64748b']

function CustomTooltip({ active, payload, label, formatCurrency }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl bg-white p-3 shadow-lg ring-1 ring-slate-200">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-2 space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-6">
            <span className="text-xs font-medium" style={{ color: entry.color }}>
              {entry.name}
            </span>
            <span className="text-xs font-semibold text-slate-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reports() {
  const { formatCurrency } = useCurrency()
  const [timeRange, setTimeRange] = React.useState('30D')

  const weeklyDays = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : 90

  const {
    incomes,
    expenses,
    totalIncome,
    totalExpenses,
    balance,
    categoryData,
    weeklyData,
    insights,
    loading,
    error,
  } = useFinanceData({ weeklyDays })

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Prepare income vs expenses comparison data
  const comparisonData = [
    { name: 'Income', amount: totalIncome, fill: '#10b981' },
    { name: 'Expenses', amount: totalExpenses, fill: '#f43f5e' },
  ]

  // Calculate trend (compare first half vs second half of period)
  const trendData = React.useMemo(() => {
    if (weeklyData.length === 0) return { direction: 'stable', percentage: 0 }

    const midpoint = Math.floor(weeklyData.length / 2)
    const firstHalf = weeklyData.slice(0, midpoint)
    const secondHalf = weeklyData.slice(midpoint)

    const firstHalfTotal = firstHalf.reduce((sum, d) => sum + d.amount, 0)
    const secondHalfTotal = secondHalf.reduce((sum, d) => sum + d.amount, 0)

    if (firstHalfTotal === 0) return { direction: 'stable', percentage: 0 }

    const change = ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100

    return {
      direction: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
      percentage: Math.abs(change).toFixed(1),
    }
  }, [weeklyData])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          Loading reports…
        </div>
      </div>
    )
  }

  const hasData = incomes.length > 0 || expenses.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Smart Finance</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Financial Reports
          </h1>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Period:</span>
          <button
            type="button"
            onClick={() => setTimeRange('7D')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              timeRange === '7D'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            7 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30D')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              timeRange === '30D'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('90D')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              timeRange === '90D'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            ].join(' ')}
          >
            90 Days
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
          {error}
        </div>
      ) : null}

      {!hasData ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-md ring-1 ring-slate-200">
          <div className="mx-auto max-w-md">
            <p className="text-6xl">📊</p>
            <h2 className="mt-6 text-xl font-semibold text-slate-900">
              No financial data available
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Start tracking your finances to see detailed reports and insights.
            </p>
            <button
              type="button"
              onClick={() => (window.location.href = '/transactions')}
              className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Add your first transaction
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ReportCard
              label="Total Income"
              value={formatCurrency(totalIncome)}
              icon="💰"
              trend={null}
              variant="success"
            />
            <ReportCard
              label="Total Expenses"
              value={formatCurrency(totalExpenses)}
              icon="💸"
              trend={trendData}
              variant="danger"
            />
            <ReportCard
              label="Net Savings"
              value={formatCurrency(balance)}
              icon="💎"
              trend={null}
              variant={balance >= 0 ? 'success' : 'danger'}
            />
            <ReportCard
              label="Savings Rate"
              value={`${savingsRate.toFixed(1)}%`}
              icon="📈"
              trend={null}
              variant={savingsRate >= 20 ? 'success' : savingsRate >= 10 ? 'warning' : 'danger'}
            />
          </section>

          {/* Charts Section */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Spending Trend Chart */}
            <article className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Spending Trend</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Daily spending over the selected period
                  </p>
                </div>
                <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>

              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#f43f5e"
                      strokeWidth={3}
                      dot={{ fill: '#f43f5e', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Spending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>

            {/* Income vs Expenses Chart */}
            <article className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Income vs Expenses</h2>
                  <p className="mt-1 text-sm text-slate-500">Comparison of total amounts</p>
                </div>
                <span
                  className={[
                    'rounded-full px-3 py-1 text-xs font-semibold',
                    balance >= 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700',
                  ].join(' ')}
                >
                  {balance >= 0 ? 'Surplus' : 'Deficit'}
                </span>
              </div>

              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} />
                    <Bar dataKey="amount" radius={[10, 10, 0, 0]} name="Amount">
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </section>

          {/* Category Breakdown & Insights */}
          <section className="grid gap-6 lg:grid-cols-5">
            {/* Category Breakdown Pie Chart */}
            <article className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 lg:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Category Breakdown</h2>
                  <p className="mt-1 text-sm text-slate-500">Spending by category</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {categoryData.data.length} categories
                </span>
              </div>

              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid rgb(226 232 240)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {categoryData.data.slice(0, 6).map((cat, idx) => (
                  <span
                    key={cat.name}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    {cat.name}
                  </span>
                ))}
              </div>
            </article>

            {/* AI Insights */}
            <article className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-6 shadow-md ring-1 ring-blue-200 lg:col-span-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">AI Insights</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Smart analysis of your financial patterns
                  </p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                  Live
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {insights.length === 0 ? (
                  <div className="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
                    <p className="text-sm text-slate-600">
                      Add more transactions to unlock personalized insights
                    </p>
                  </div>
                ) : (
                  insights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      title={insight.title}
                      message={insight.message}
                    />
                  ))
                )}
              </div>

              {/* Additional Insights */}
              <div className="mt-6 space-y-3">
                {savingsRate < 10 && (
                  <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">⚠️</span>
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Low Savings Rate</p>
                        <p className="mt-1 text-sm text-amber-700">
                          Your savings rate is {savingsRate.toFixed(1)}%. Consider reducing
                          expenses or increasing income to reach the recommended 20%.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {trendData.direction === 'up' && (
                  <div className="rounded-xl bg-rose-50 p-4 ring-1 ring-rose-200">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">📈</span>
                      <div>
                        <p className="text-sm font-semibold text-rose-900">Spending Increased</p>
                        <p className="mt-1 text-sm text-rose-700">
                          Your spending increased by {trendData.percentage}% compared to the
                          previous period. Review your expenses to stay on budget.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {trendData.direction === 'down' && (
                  <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">📉</span>
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">
                          Spending Decreased
                        </p>
                        <p className="mt-1 text-sm text-emerald-700">
                          Great job! Your spending decreased by {trendData.percentage}% compared
                          to the previous period.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {categoryData.data.length > 0 && (
                  <div className="rounded-xl bg-blue-50 p-4 ring-1 ring-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">🎯</span>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Top Category</p>
                        <p className="mt-1 text-sm text-blue-700">
                          <strong>{categoryData.data[0]?.name}</strong> is your highest expense
                          category at {formatCurrency(categoryData.data[0]?.value || 0)}.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  )
}

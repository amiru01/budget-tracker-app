import React from 'react'
import useFinanceData from '../hooks/useFinanceData.js'
import AddIncomeModal from '../components/AddIncomeModal.jsx'
import IncomeItem from '../components/IncomeItem.jsx'
import IncomeChart from '../components/IncomeChart.jsx'
import StatCard from '../components/StatCard.jsx'

export default function Income() {
  const {
    incomes,
    loading,
    error,
    totalIncome,
    allTimeTotalIncome,
    highestIncomeSource,
    incomeMonthlyTrend,
    incomeBySource,
    incomeInsights,
    actions,
  } = useFinanceData()

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingIncome, setEditingIncome] = React.useState(null)

  async function handleDelete(id) {
    await actions.deleteIncome(id)
  }

  function handleAdd() {
    setEditingIncome(null)
    setIsModalOpen(true)
  }

  function handleEdit(income) {
    setEditingIncome(income)
    setIsModalOpen(true)
  }

  async function handleSubmit(payload) {
    if (editingIncome?.id) {
      await actions.updateIncome(editingIncome.id, payload)
      return
    }

    await actions.addIncome(payload)
  }

  if (loading) {
    return (
      <main className="space-y-6">
        <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
          <div className="rounded-xl dashboard-card px-4 py-3 text-sm font-semibold text-ink-secondary shadow-sm ring-1 ring-border-subtle">
            Loading Income Tracking…
          </div>
        </div>
      </main>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-ink-tertiary">Smart Finance</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Income Tracking
          </h1>
        </div>

        <div className="w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAdd}
            className="brand-button w-full px-4 py-2.5 text-sm sm:w-auto"
          >
            Add Income
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
          label="Total Income"
          value={formatCurrency(allTimeTotalIncome)}
          sublabel="Across all sources"
          accent="green"
        />
        <StatCard
          label="Monthly Income"
          value={formatCurrency(totalIncome)}
          sublabel={`This month · ${new Date().toLocaleString(undefined, { month: 'short' })}`}
          accent="green"
        />
        <StatCard
          label="Highest Income Source"
          value={highestIncomeSource?.name ?? '—'}
          sublabel={
            highestIncomeSource
              ? `Peak: ${formatCurrency(highestIncomeSource.value)}`
              : 'Add income to unlock insights'
          }
          accent="green"
        />
      </section>

      {/* Charts */}
      <IncomeChart monthlyIncomeTrend={incomeMonthlyTrend} incomeBySource={incomeBySource} />

      {/* AI Insights */}
      <section className="rounded-2xl dashboard-card p-6 shadow-md ring-1 ring-border-subtle">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">AI Insights</h2>
            <p className="mt-1 text-sm text-ink-secondary">Rule-based guidance based on your income history.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            Live
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {incomeInsights.map((insight) => (
            <div key={insight.id} className="rounded-xl bg-white/70 dark:bg-surface-secondary p-4 ring-1 ring-border-subtle">
              <p className="text-sm font-semibold text-ink-secondary">{insight.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{insight.message}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Income list */}
      <section className="rounded-2xl dashboard-card p-6 shadow-md ring-1 ring-border-subtle">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-ink">Income entries</h2>
            <p className="mt-1 text-sm text-ink-tertiary">All recorded income, updated in real time.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
            {incomes.length} items
          </span>
        </div>

        <ul className="mt-6 space-y-3">
          {incomes.length === 0 ? (
            <li className="rounded-xl bg-slate-50 dark:bg-surface-secondary px-4 py-4 text-sm font-medium text-ink-secondary ring-1 ring-border-subtle">
              No income recorded yet. Tap “Add Income” to get started.
            </li>
          ) : null}

          {incomes.map((inc) => (
            <IncomeItem key={inc.id} income={inc} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </ul>

        <AddIncomeModal
          open={isModalOpen}
          initialIncome={editingIncome}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  )
}

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


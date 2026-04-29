import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import BudgetRuleModal from '../components/BudgetRuleModal.jsx'
import {
  addBudgetRule,
  updateBudgetRule,
  deleteBudgetRule,
  subscribeToBudgetRules,
  checkBudgetViolations,
} from '../services/budgetService.js'
import useFinanceData from '../hooks/useFinanceData.js'

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

function BudgetRuleItem({ rule, onEdit, onDelete, onToggle, violation }) {
  return (
    <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-slate-900">{rule.name}</h3>
            <span
              className={[
                'rounded-full px-2 py-1 text-xs font-semibold',
                rule.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-100 text-slate-600',
              ].join(' ')}
            >
              {rule.isActive ? 'Active' : 'Inactive'}
            </span>
            {violation && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                Over Budget
              </span>
            )}
          </div>
          
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <span>
              <strong>Category:</strong> {rule.category}
            </span>
            <span>
              <strong>Period:</strong> {rule.type}
            </span>
            <span>
              <strong>Limit:</strong> {formatCurrency(rule.limit)}
            </span>
          </div>

          {violation && (
            <div className="mt-2 text-sm text-red-600">
              Current spending: {formatCurrency(violation.spending)} 
              ({formatCurrency(violation.excess)} over limit)
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggle(rule.id, !rule.isActive)}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
              rule.isActive
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200',
            ].join(' ')}
          >
            {rule.isActive ? 'Disable' : 'Enable'}
          </button>
          <button
            type="button"
            onClick={() => onEdit(rule)}
            className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(rule.id)}
            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  )
}

export default function BudgetRules() {
  const { user } = useAuth()
  const { expenses } = useFinanceData()
  const [budgetRules, setBudgetRules] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingRule, setEditingRule] = React.useState(null)

  // Subscribe to budget rules
  React.useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToBudgetRules(
      user.uid,
      (rules) => {
        setBudgetRules(rules)
        setLoading(false)
      },
      (err) => {
        setError(err?.message || 'Failed to load budget rules')
        setLoading(false)
      }
    )

    return unsubscribe
  }, [user?.uid])

  // Check for budget violations
  const budgetViolations = React.useMemo(() => {
    return checkBudgetViolations(expenses, budgetRules)
  }, [expenses, budgetRules])

  async function handleAdd() {
    setEditingRule(null)
    setIsModalOpen(true)
  }

  async function handleEdit(rule) {
    setEditingRule(rule)
    setIsModalOpen(true)
  }

  async function handleSubmit(ruleData) {
    if (!user?.uid) throw new Error('Please sign in to manage budget rules')

    if (editingRule?.id) {
      await updateBudgetRule(editingRule.id, ruleData)
    } else {
      await addBudgetRule({ userId: user.uid, ...ruleData })
    }
  }

  async function handleDelete(ruleId) {
    if (!confirm('Are you sure you want to delete this budget rule?')) return
    await deleteBudgetRule(ruleId)
  }

  async function handleToggle(ruleId, isActive) {
    await updateBudgetRule(ruleId, { isActive })
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          Loading budget rules…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Budget Management</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Budget Rules
          </h1>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Create Budget Rule
        </button>
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
                {formatCurrency(violation.spending)} ({formatCurrency(violation.excess)} over your{' '}
                {violation.period} limit of {formatCurrency(violation.rule.limit)})
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <section className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Your Budget Rules</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage spending limits and get alerts when you exceed them.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {budgetRules.length} rules
          </span>
        </div>

        <ul className="mt-6 space-y-3">
          {budgetRules.length === 0 ? (
            <li className="rounded-xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-600 ring-1 ring-slate-100">
              No budget rules created yet. Create your first rule to start tracking spending limits.
            </li>
          ) : null}

          {budgetRules.map((rule) => {
            const violation = budgetViolations.find(v => v.rule.id === rule.id)
            return (
              <BudgetRuleItem
                key={rule.id}
                rule={rule}
                violation={violation}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
              />
            )
          })}
        </ul>
      </section>

      <BudgetRuleModal
        open={isModalOpen}
        initialRule={editingRule}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
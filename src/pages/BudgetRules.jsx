import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import BudgetRuleModal from '../components/BudgetRuleModal.jsx'
import {
  addBudgetRule,
  updateBudgetRule,
  deleteBudgetRule,
  subscribeToBudgetRules,
  checkBudgetViolations,
} from '../services/budgetService.js'
import useFinanceData from '../hooks/useFinanceData.js'
import { quickFade, slideIn, badgePop } from '../utils/animations.js'

function BudgetRuleItem({ rule, onEdit, onDelete, onToggle, violation, formatCurrency }) {
  const usagePercent = violation ? Math.min((violation.spending / rule.limit) * 100, 100) : 0

  return (
    <li className="dashboard-card p-4 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-white">{rule.name}</h3>
            <motion.span {...badgePop} className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${rule.isActive ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20' : 'bg-slate-400/10 text-slate-300 ring-slate-400/20'}`}>
              {rule.isActive ? 'Active' : 'Inactive'}
            </motion.span>
            {violation && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="rounded-full bg-rose-400/10 px-2 py-1 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/20"
              >
                Over Budget
              </motion.span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span><strong>Category:</strong> {rule.category}</span>
            <span><strong>Period:</strong> {rule.type}</span>
            <span><strong>Limit:</strong> {formatCurrency(rule.limit)}</span>
          </div>
          {violation && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-rose-300">{formatCurrency(violation.spending)} spent</span>
                <span className="text-rose-300">{formatCurrency(violation.excess)} over</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
                  initial={{ width: '0%' }} animate={{ width: `${usagePercent}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <motion.button type="button" onClick={() => onToggle(rule.id, !rule.isActive)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ring-1 ${rule.isActive ? 'bg-white/8 text-slate-300 ring-white/10 hover:bg-white/12 hover:text-white' : 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20 hover:bg-emerald-400/20 hover:text-emerald-200'}`}
          >
            {rule.isActive ? 'Disable' : 'Enable'}
          </motion.button>
          <motion.button type="button" onClick={() => onEdit(rule)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/20 transition hover:bg-sky-400/20 hover:text-sky-200"
          >
            Edit
          </motion.button>
          <motion.button type="button" onClick={() => onDelete(rule.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/20 transition hover:bg-rose-400/20 hover:text-rose-200"
          >
            Delete
          </motion.button>
        </div>
      </div>
    </li>
  )
}

export default function BudgetRules() {
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const { expenses } = useFinanceData()
  const [budgetRules, setBudgetRules] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingRule, setEditingRule] = React.useState(null)

  React.useEffect(() => {
    if (!user?.uid) { setLoading(false); return }
    const unsubscribe = subscribeToBudgetRules(user.uid, (rules) => { setBudgetRules(rules); setLoading(false) }, (err) => { setError(err?.message || 'Failed to load budget rules'); setLoading(false) })
    return unsubscribe
  }, [user?.uid])

  const budgetViolations = React.useMemo(() => checkBudgetViolations(expenses, budgetRules), [expenses, budgetRules])

  async function handleAdd() { setEditingRule(null); setIsModalOpen(true) }
  async function handleEdit(rule) { setEditingRule(rule); setIsModalOpen(true) }
  async function handleSubmit(ruleData) {
    if (!user?.uid) throw new Error('Please sign in to manage budget rules')
    if (editingRule?.id) await updateBudgetRule(editingRule.id, ruleData)
    else await addBudgetRule({ userId: user.uid, ...ruleData })
  }
  async function handleDelete(ruleId) { if (!confirm('Are you sure you want to delete this budget rule?')) return; await deleteBudgetRule(ruleId) }
  async function handleToggle(ruleId, isActive) { await updateBudgetRule(ruleId, { isActive }) }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="dashboard-card px-4 py-3 text-sm font-semibold text-slate-300">Loading budget rules…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0 }}>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Budget Management</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">Budget Rules</h1>
          </div>
          <motion.button type="button" onClick={handleAdd} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="brand-button px-4 py-2 text-sm">
            Create Budget Rule
          </motion.button>
        </header>
      </motion.div>

      {error ? (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.08 }} className="rounded-xl bg-rose-400/10 p-4 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20">
          {error}
        </motion.div>
      ) : null}

      {budgetViolations.length > 0 ? (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.12 }} className="rounded-xl bg-amber-400/10 p-4 ring-1 ring-amber-400/20">
          <h3 className="text-sm font-semibold text-amber-200">Budget Alerts</h3>
          <div className="mt-2 space-y-2">
            {budgetViolations.map((violation, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + idx * 0.08, duration: 0.25 }} className="text-sm text-amber-300">
                <strong>{violation.rule.name}</strong>: You&apos;ve spent {formatCurrency(violation.spending)} ({formatCurrency(violation.excess)} over your {violation.period} limit of {formatCurrency(violation.rule.limit)})
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : null}

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.18 }}>
        <section className="dashboard-card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Your Budget Rules</h2>
              <p className="mt-1 text-sm text-slate-400">Manage spending limits and get alerts when you exceed them.</p>
            </div>
            <motion.span {...badgePop} className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
              {budgetRules.length} rules
            </motion.span>
          </div>
          <ul className="mt-6 space-y-3">
            {budgetRules.length === 0 ? (
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="dashboard-card px-4 py-4 text-sm font-medium text-slate-400">
                No budget rules created yet. Create your first rule to start tracking spending limits.
              </motion.li>
            ) : null}
            {budgetRules.map((rule, idx) => {
              const violation = budgetViolations.find(v => v.rule.id === rule.id)
              return (
                <motion.li key={rule.id} {...slideIn} animate={slideIn.animate(idx)}>
                  <BudgetRuleItem rule={rule} violation={violation} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} formatCurrency={formatCurrency} />
                </motion.li>
              )
            })}
          </ul>
        </section>
      </motion.div>

      <BudgetRuleModal open={isModalOpen} initialRule={editingRule} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  )
}
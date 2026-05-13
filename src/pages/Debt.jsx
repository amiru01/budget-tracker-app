import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import {
  subscribeToDebts, addDebt, deleteDebt, updateDebt,
  addDebtPayment, subscribeToDebtPayments,
} from '../services/debtService.js'
import DebtModal from '../components/DebtModal.jsx'
import DebtPaymentModal from '../components/DebtPaymentModal.jsx'
import { quickFade } from '../utils/animations.js'

function DebtCard({ debt, onEdit, onDelete, onPay, formatCurrency }) {
  const paid = debt.totalAmount - debt.remainingBalance
  const progress = debt.totalAmount > 0 ? (paid / debt.totalAmount) * 100 : 0

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{debt.name}</p>
          <p className="text-xs text-ink-secondary">{debt.category} &middot; {debt.frequency}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-ink">{formatCurrency(debt.remainingBalance)}</p>
          <p className="text-xs text-ink-tertiary">of {formatCurrency(debt.totalAmount)}</p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-ink-secondary">
          <span>{progress.toFixed(0)}% paid</span>
          <span>{formatCurrency(paid)} paid</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
            initial={{ width: '0%' }} animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {debt.interestRate > 0 && <p className="mt-2 text-xs text-ink-tertiary">Interest: {debt.interestRate}%</p>}

      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => onPay(debt)}
          className="brand-button flex-1 rounded-lg px-3 py-1.5 text-xs font-bold">Pay</button>
        <button type="button" onClick={() => onEdit(debt)}
          className="rounded-lg bg-sky-400/10 px-2.5 py-1.5 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/20 hover:bg-sky-400/20">Edit</button>
        <button type="button" onClick={() => onDelete(debt.id)}
          className="rounded-lg bg-rose-400/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-400/20">Delete</button>
      </div>
    </motion.div>
  )
}

export default function Debt() {
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const [debts, setDebts] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(null)
  const [payingDebt, setPayingDebt] = React.useState(null)

  React.useEffect(() => {
    if (!user?.uid) return
    const unsub = subscribeToDebts(user.uid, (data) => { setDebts(data); setLoading(false) }, (err) => { setError(err.message); setLoading(false) })
    return unsub
  }, [user?.uid])

  const activeDebts = React.useMemo(() => debts.filter((d) => !d.isPaid && d.remainingBalance > 0), [debts])
  const paidDebts = React.useMemo(() => debts.filter((d) => d.isPaid || d.remainingBalance <= 0), [debts])
  const totalRemaining = React.useMemo(() => activeDebts.reduce((s, d) => s + (d.remainingBalance || 0), 0), [activeDebts])
  const totalPaid = React.useMemo(() => debts.reduce((s, d) => s + ((d.totalAmount || 0) - (d.remainingBalance || 0)), 0), [debts])
  const totalOriginal = React.useMemo(() => debts.reduce((s, d) => s + (d.totalAmount || 0), 0), [debts])

  async function handleAdd(data) { await addDebt({ userId: user.uid, ...data }) }
  async function handleUpdate(data) { if (editing) await updateDebt(editing.id, data) }
  async function handleDelete(id) { if (!confirm('Delete this debt?')) return; await deleteDebt(id) }
  async function handlePayment(data) {
    if (!payingDebt) return
    const payment = await addDebtPayment({ debtId: payingDebt.id, userId: user.uid, ...data })
    const newRemaining = Math.max(0, payingDebt.remainingBalance - data.amount)
    const isPaid = newRemaining <= 0
    await updateDebt(payingDebt.id, { remainingBalance: newRemaining, isPaid })
  }

  const isNextDue = (debt) => debt.dueDate && new Date(debt.dueDate) <= new Date(Date.now() + 14 * 86400000) && !debt.isPaid

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
      <div className="dashboard-card px-4 py-3 text-sm font-bold text-ink-secondary">Loading debts…</div>
    </div>
  }

  return (
    <div className="space-y-6">
      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0 }}>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-tertiary">Finance OS</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Debt Payoff</h1>
            <p className="mt-1 text-sm text-ink-secondary">Track, manage, and eliminate your debt.</p>
          </div>
          <button type="button" onClick={() => { setEditing(null); setIsModalOpen(true) }} className="brand-button px-4 py-2 text-sm">+ Add Debt</button>
        </header>
      </motion.div>

      {error ? <motion.div {...quickFade} className="rounded-xl bg-rose-400/10 p-4 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20">{error}</motion.div> : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.08 }} className="dashboard-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Active Debts</p>
          <p className="font-display mt-2 text-2xl font-extrabold text-ink">{activeDebts.length}</p>
        </motion.div>
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.1 }} className="dashboard-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Remaining</p>
          <p className="font-display mt-2 text-2xl font-extrabold text-rose-400">{formatCurrency(totalRemaining)}</p>
        </motion.div>
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.12 }} className="dashboard-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Paid So Far</p>
          <p className="font-display mt-2 text-2xl font-extrabold text-emerald-400">{formatCurrency(totalPaid)}</p>
        </motion.div>
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.14 }} className="dashboard-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Paid %</p>
          <p className="font-display mt-2 text-2xl font-extrabold text-cyan-400">
            {totalOriginal > 0 ? ((totalPaid / totalOriginal) * 100).toFixed(0) : 0}%
          </p>
        </motion.div>
      </div>

      <div className="dashboard-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Overall Progress</h2>
            <p className="text-xs text-ink-secondary">{formatCurrency(totalPaid)} paid of {formatCurrency(totalOriginal)}</p>
          </div>
          <span className="text-2xl font-bold text-ink">{totalOriginal > 0 ? ((totalPaid / totalOriginal) * 100).toFixed(0) : 0}%</span>
        </div>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface-elevated">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-emerald-300"
            initial={{ width: '0%' }} animate={{ width: `${totalOriginal > 0 ? Math.min((totalPaid / totalOriginal) * 100, 100) : 0}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {activeDebts.length > 0 && (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.18 }}>
          <h2 className="text-lg font-semibold text-ink mb-3">Active Debts</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeDebts.sort((a, b) => (a.priority || 0) - (b.priority || 0)).map((debt) => (
              <DebtCard key={debt.id} debt={debt} onEdit={(d) => { setEditing(d); setIsModalOpen(true) }}
                onDelete={handleDelete} onPay={(d) => { setPayingDebt(d); setIsPaymentModalOpen(true) }} formatCurrency={formatCurrency} />
            ))}
          </div>
        </motion.div>
      )}

      {paidDebts.length > 0 && (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.22 }} className="dashboard-card p-6">
          <h2 className="font-display text-lg font-bold text-ink">Paid Off 🎉</h2>
          <div className="mt-3 space-y-2">
            {paidDebts.map((debt) => (
              <div key={debt.id} className="flex items-center justify-between rounded-xl bg-emerald-400/10 p-3 ring-1 ring-emerald-400/20">
                <div>
                  <p className="font-semibold text-emerald-600">{debt.name}</p>
                  <p className="text-xs text-emerald-600/70">{debt.category}</p>
                </div>
                <p className="font-bold text-emerald-600">{formatCurrency(debt.totalAmount)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <DebtModal open={isModalOpen} onClose={() => { setIsModalOpen(false); setEditing(null) }}
        onSubmit={editing ? handleUpdate : handleAdd} initial={editing} />

      <DebtPaymentModal open={isPaymentModalOpen} onClose={() => { setIsPaymentModalOpen(false); setPayingDebt(null) }}
        onSubmit={handlePayment} debt={payingDebt} />
    </div>
  )
}

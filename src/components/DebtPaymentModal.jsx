import React from 'react'
import { motion } from 'framer-motion'
import { modalOverlay, modalContent } from '../utils/animations.js'
import { useCurrency } from '../context/CurrencyContext.jsx'

export default function DebtPaymentModal({ open, onClose, onSubmit, debt }) {
  const { formatCurrency } = useCurrency()
  const [amount, setAmount] = React.useState('')
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = React.useState('')
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open) { setAmount(''); setNote(''); setError('') }
  }, [open])

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    if (!amount || Number(amount) <= 0) { setError('Enter a valid payment amount'); return }
    if (debt && Number(amount) > debt.remainingBalance) {
      if (!confirm(`Payment of ${formatCurrency(Number(amount))} exceeds remaining balance of ${formatCurrency(debt.remainingBalance)}. Continue?`)) return
    }
    setSaving(true)
    try {
      await onSubmit({ amount: Number(amount), date, note: note.trim() })
      onClose()
    } catch (err) { setError(err?.message || 'Failed to record payment')
    } finally { setSaving(false) }
  }

  if (!open || !debt) return null

  return (
    <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label="Close" />
      <motion.div {...modalContent} className="dashboard-card relative w-full max-w-sm p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-white">Record Payment</h3>
          <p className="mt-1 text-sm text-slate-400">{debt.name} &mdash; Remaining: {formatCurrency(debt.remainingBalance)}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-300">Payment Amount ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" min="0" placeholder="0.00" className="dashboard-input mt-2" autoFocus />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="dashboard-input mt-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Extra payment" maxLength={100} className="dashboard-input mt-2" />
          </div>
          {error ? <div className="rounded-xl bg-rose-400/10 p-3 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20">{error}</div> : null}
          <button type="submit" disabled={saving} className="brand-button w-full px-4 py-2.5 text-sm font-bold">
            {saving ? 'Recording...' : 'Record Payment'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

import React from 'react'
import { Timestamp } from 'firebase/firestore'
import { motion } from 'framer-motion'
import Spinner from './Spinner.jsx'
import { modalOverlay, modalContent } from '../utils/animations.js'

const defaultCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Subscriptions', 'Health', 'Entertainment', 'Other']

function toTimestampFromDateInput(value) {
  const d = new Date(value)
  d.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(d)
}

export default function AddExpenseModal({
  open,
  onClose,
  onSubmit,
  categories = defaultCategories,
  accounts = [],
}) {
  const [amount, setAmount] = React.useState('')
  const [category, setCategory] = React.useState(categories[0] ?? 'Other')
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = React.useState('')
  const [accountId, setAccountId] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      setError('')
      setSuccess(false)
      setLoading(false)
      setAmount('')
      setNote('')
      setAccountId('')
      setCategory(categories[0] ?? 'Other')
      setDate(new Date().toISOString().slice(0, 10))
    }, 0)
    return () => clearTimeout(t)
  }, [open, categories])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    const numeric = Number(amount)
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError('Enter a valid amount.')
      return
    }
    if (!category) { setError('Choose a category.'); return }
    if (!date) { setError('Choose a date.'); return }

    setLoading(true)
    try {
      await onSubmit({
        type: 'expense',
        amount: numeric,
        category,
        date: toTimestampFromDateInput(date),
        note: note.trim(),
        accountId: accountId || null,
      })
      setSuccess(true)
      setAmount(''); setNote(''); setAccountId('')
      setCategory(categories[0] ?? 'Other')
      setDate(new Date().toISOString().slice(0, 10))
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      setError(err?.message || 'Failed to save expense.')
    } finally { setLoading(false) }
  }

  return (
    <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div {...modalContent} className="dashboard-card relative w-full max-w-lg p-6 shadow-2xl shadow-black/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-secondary">New entry</p>
            <h3 className="font-display mt-1 text-lg font-bold text-ink">Add expense</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-secondary transition hover:bg-surface-elevated hover:text-ink" aria-label="Close">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-ink-secondary">Amount</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} step="1" min="0" placeholder="0.00" className="dashboard-input mt-2" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink-secondary">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="dashboard-input mt-2">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-ink-secondary">Payment Account <span className="text-xs font-normal text-ink-tertiary">(optional)</span></span>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="dashboard-input mt-2">
              <option value="">No account linked</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} — {a.type}</option>)}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-ink-secondary">Date</span>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={new Date().toISOString().split('T')[0]} className="dashboard-input mt-2" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink-secondary">Note</span>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" maxLength="100" className="dashboard-input mt-2" />
            </label>
          </div>

          {error ? <div className="rounded-xl bg-rose-400/10 border border-rose-300/20 p-3 text-sm font-medium text-rose-600 backdrop-blur-xl">❌ {error}</div> : null}
          {success ? <div className="rounded-xl bg-emerald-400/10 border border-emerald-300/20 p-3 text-sm font-medium text-emerald-600 backdrop-blur-xl">✅ Expense saved successfully!</div> : null}

          <button type="submit" disabled={loading || success}
            className="brand-button w-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <span className="flex items-center justify-center gap-2"><Spinner size="sm" /><span>Saving...</span></span> : success ? '✓ Saved!' : 'Save'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

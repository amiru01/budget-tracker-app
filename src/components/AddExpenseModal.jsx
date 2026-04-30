import React from 'react'
import { Timestamp } from 'firebase/firestore'

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
}) {
  const [amount, setAmount] = React.useState('')
  const [category, setCategory] = React.useState(categories[0] ?? 'Other')
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = React.useState('')
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
    if (!category) {
      setError('Choose a category.')
      return
    }
    if (!date) {
      setError('Choose a date.')
      return
    }

    setLoading(true)
    try {
      await onSubmit({
        type: 'expense',
        amount: numeric,
        category,
        date: toTimestampFromDateInput(date),
        note: note.trim(),
      })

      // Show success state immediately
      setSuccess(true)

      // Reset form
      setAmount('')
      setCategory(categories[0] ?? 'Other')
      setDate(new Date().toISOString().slice(0, 10))
      setNote('')
      
      // Close modal after showing success message
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Failed to save expense:', err)
      setError(err?.message || 'Failed to save expense.')
      setSuccess(false)
    } finally {
      // Always reset loading state
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-500">New entry</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Add expense</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Amount</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="1"
                min="0"
                placeholder="0.00"
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Note</span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note"
                maxLength="100"
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
              ❌ {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700 ring-1 ring-green-100">
              ✅ Expense saved successfully!
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading || success}
            className={[
              'w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60',
              success 
                ? 'bg-green-600 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            ].join(' ')}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : success ? (
              '✓ Saved!'
            ) : (
              'Save'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

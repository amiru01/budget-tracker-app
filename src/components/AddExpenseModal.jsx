import React from 'react'
import { Timestamp } from 'firebase/firestore'

const defaultCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Subscriptions', 'Health', 'Entertainment', 'Other']
const defaultIncomeSources = ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Other']

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
  incomeSources = defaultIncomeSources,
}) {
  const [type, setType] = React.useState('expense')
  const [amount, setAmount] = React.useState('')
  const [category, setCategory] = React.useState(categories[0] ?? 'Other')
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    // Reset all form state when modal opens
    const t = setTimeout(() => {
      setError('')
      setSuccess('')
      setIsSaving(false)
      setAmount('')
      setNote('')
      setType('expense')
      setCategory(categories[0] ?? 'Other')
      setDate(new Date().toISOString().slice(0, 10))
    }, 0)
    return () => clearTimeout(t)
  }, [open, categories])

  // Update category when type changes
  React.useEffect(() => {
    if (type === 'expense') {
      setCategory(categories[0] ?? 'Other')
    } else {
      setCategory(incomeSources[0] ?? 'Other')
    }
  }, [type, categories, incomeSources])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

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

    setIsSaving(true)
    try {
      await onSubmit({
        type,
        amount: numeric,
        category,
        date: toTimestampFromDateInput(date),
        note: note.trim(),
      })
      
      // Show success message
      setSuccess(`${type === 'expense' ? 'Expense' : 'Income'} saved successfully!`)
      
      // Close modal after a brief delay to show success message
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      setError(err?.message || 'Failed to save.')
    } finally {
      setIsSaving(false)
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
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Add expense / income</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Amount</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="0.00"
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                {type === 'expense' ? 'Category' : 'Source'}
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                {(type === 'expense' ? categories : incomeSources).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Note</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note (e.g. Uber to office)"
              className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </label>

          {error ? (
            <div className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700 ring-1 ring-green-100">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSaving}
            className={[
              'w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60',
              success 
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            ].join(' ')}
          >
            {success ? '✓ Saved!' : isSaving ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}


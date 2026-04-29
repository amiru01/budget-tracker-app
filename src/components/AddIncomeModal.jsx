import React from 'react'
import { Timestamp } from 'firebase/firestore'

const defaultSources = ['Salary', 'Freelance', 'Business', 'Other']

function toTimestampFromDateInput(value) {
  const d = new Date(value)
  d.setHours(0, 0, 0, 0)
  return Timestamp.fromDate(d)
}

function formatDateInputValue(value) {
  if (!value) return ''
  if (typeof value?.toDate === 'function') return value.toDate().toISOString().slice(0, 10)
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

export default function AddIncomeModal({
  open,
  onClose,
  onSubmit,
  sources = defaultSources,
  initialIncome = null,
}) {
  const [amount, setAmount] = React.useState('')
  const [source, setSource] = React.useState(sources[0] ?? 'Other')
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = React.useState('')
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    if (!open) return

    const next = {
      amount: initialIncome ? String(initialIncome.amount ?? '') : '',
      source: initialIncome?.source ?? sources[0] ?? 'Other',
      date: formatDateInputValue(initialIncome?.date) || new Date().toISOString().slice(0, 10),
      note: initialIncome?.note ?? '',
    }

    const t = setTimeout(() => {
      setError('')
      setAmount(next.amount)
      setSource(next.source)
      setDate(next.date)
      setNote(next.note)
    }, 0)

    return () => clearTimeout(t)
  }, [open, initialIncome, sources])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const numeric = Number(amount)
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError('Enter a valid amount.')
      return
    }
    if (!source) {
      setError('Choose a source.')
      return
    }
    if (!date) {
      setError('Choose a date.')
      return
    }

    // Close modal immediately
    onClose()
    
    // Save in background
    try {
      await onSubmit({
        amount: numeric,
        source,
        date: toTimestampFromDateInput(date),
        note: note.trim(),
      })
    } catch (err) {
      console.error('Failed to save income:', err)
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
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Add income</h3>
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
                step="0.01"
                min="0"
                placeholder="0.00"
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Source</span>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Note</span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional"
                maxLength="100"
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </label>
          </div>

          {error ? (
            <div className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Save income
          </button>
        </form>
      </div>
    </div>
  )
}

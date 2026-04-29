import React from 'react'

const defaultCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Subscriptions', 'Health', 'Entertainment', 'Other']

export default function BudgetRuleModal({
  open,
  onClose,
  onSubmit,
  categories = defaultCategories,
  initialRule = null,
}) {
  const [name, setName] = React.useState('')
  const [category, setCategory] = React.useState(categories[0] ?? 'Other')
  const [type, setType] = React.useState('weekly')
  const [limit, setLimit] = React.useState('')
  const [isActive, setIsActive] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  React.useEffect(() => {
    if (!open) return

    const next = {
      name: initialRule?.name ?? '',
      category: initialRule?.category ?? categories[0] ?? 'Other',
      type: initialRule?.type ?? 'weekly',
      limit: initialRule?.limit ? String(initialRule.limit) : '',
      isActive: initialRule?.isActive ?? true,
    }

    // Defer state updates to satisfy react-hooks linting.
    const t = setTimeout(() => {
      setError('')
      setSuccess('')
      setIsSaving(false)
      setName(next.name)
      setCategory(next.category)
      setType(next.type)
      setLimit(next.limit)
      setIsActive(next.isActive)
    }, 0)

    return () => clearTimeout(t)
  }, [open, initialRule, categories])

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) {
      setError('Enter a rule name.')
      return
    }

    const numeric = Number(limit)
    if (!Number.isFinite(numeric) || numeric <= 0) {
      setError('Enter a valid limit amount.')
      return
    }

    if (!category) {
      setError('Choose a category.')
      return
    }

    setIsSaving(true)
    try {
      await onSubmit({
        name: name.trim(),
        category,
        type,
        limit: numeric,
        isActive,
      })

      // Show success message
      setSuccess(initialRule ? 'Budget rule updated successfully!' : 'Budget rule created successfully!')

      // Reset form if adding new rule
      if (!initialRule) {
        setName('')
        setLimit('')
        setCategory(categories[0] ?? 'Other')
        setType('weekly')
        setIsActive(true)
      }
      
      // Close modal after a brief delay to show success message
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      setError(err?.message || 'Failed to save budget rule.')
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
            <p className="text-sm font-medium text-slate-500">Budget Management</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {initialRule ? 'Edit Budget Rule' : 'Create Budget Rule'}
            </h3>
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
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Rule Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekly Dining Limit"
              className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Period</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Spending Limit</span>
            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              inputMode="decimal"
              placeholder="0.00"
              className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-700">Active rule</span>
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
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ].join(' ')}
          >
            {success ? '✓ Saved!' : isSaving ? 'Saving…' : initialRule ? 'Update Rule' : 'Create Rule'}
          </button>
        </form>
      </div>
    </div>
  )
}
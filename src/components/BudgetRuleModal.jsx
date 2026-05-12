import React from 'react'

const defaultCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Subscriptions', 'Health', 'Entertainment', 'Other']

export default function BudgetRuleModal({
  open,
  onClose,
  onSubmit,
  onSuccess,
  categories = defaultCategories,
  initialRule = null,
}) {
  const [name, setName] = React.useState('')
  const [category, setCategory] = React.useState(categories[0] ?? 'Other')
  const [type, setType] = React.useState('weekly')
  const [limit, setLimit] = React.useState('')
  const [isActive, setIsActive] = React.useState(true)
  const [error, setError] = React.useState('')

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

    // Close modal immediately
    onClose()
    
    // Save in background
    try {
      await onSubmit({
        name: name.trim(),
        category,
        type,
        limit: numeric,
        isActive,
      })

      // Call onSuccess callback if provided (for navigation)
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      console.error('Failed to save budget rule:', err)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      />

      <div className="dashboard-card relative w-full max-w-lg p-6 shadow-2xl shadow-black/30">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-400">Budget Management</p>
            <h3 className="font-display mt-1 text-lg font-bold text-white">
              {initialRule ? 'Edit Budget Rule' : 'Create Budget Rule'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Rule Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Weekly Dining Limit"
              maxLength="50"
              className="dashboard-input mt-2"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="dashboard-input mt-2"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Period</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="dashboard-input mt-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-slate-300">Spending Limit</span>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              step="1"
              min="0"
              placeholder="0.00"
              className="dashboard-input mt-2"
            />
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-400 bg-slate-800"
            />
            <span className="text-sm font-semibold text-slate-300">Active rule</span>
          </label>

          {error ? (
            <div className="rounded-xl bg-rose-400/10 p-3 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20">
              ❌ {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="brand-button w-full px-4 py-2.5 text-sm font-bold transition-all duration-300 ease-out"
          >
            {initialRule ? 'Update Rule' : 'Create Rule'}
          </button>
        </form>
      </div>
    </div>
  )
}
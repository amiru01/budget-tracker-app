import React from 'react'

export default function TransactionFilters({
  activeFilter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  categories,
  dateRange,
  onDateRangeChange,
}) {
  return (
    <div className="space-y-4">
      {/* Type Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink-secondary">Type:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink shadow-lg shadow-cyan-500/15'
                : 'bg-surface-secondary text-ink-secondary ring-1 ring-border-subtle hover:bg-surface-elevated hover:text-ink',
            ].join(' ')}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('income')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              activeFilter === 'income'
                ? 'bg-emerald-600 text-ink shadow-sm shadow-emerald-500/15 ring-1 ring-emerald-400/30'
                : 'bg-surface-secondary text-ink-secondary ring-1 ring-border-subtle hover:bg-surface-elevated hover:text-ink',
            ].join(' ')}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('expense')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              activeFilter === 'expense'
                ? 'bg-rose-600 text-ink shadow-sm shadow-rose-500/15 ring-1 ring-rose-400/30'
                : 'bg-surface-secondary text-ink-secondary ring-1 ring-border-subtle hover:bg-surface-elevated hover:text-ink',
            ].join(' ')}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Category & Date Filters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Category Filter */}
        <label className="block">
          <span className="text-sm font-semibold text-ink-secondary">Category</span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="dashboard-input mt-2"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        {/* Date Range Filter */}
        <label className="block">
          <span className="text-sm font-semibold text-ink-secondary">Time Period</span>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="dashboard-input mt-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </label>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              onFilterChange('all')
              onCategoryChange('all')
              onDateRangeChange('all')
            }}
            className="button-secondary w-full rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

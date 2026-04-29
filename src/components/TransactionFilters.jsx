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
        <span className="text-sm font-semibold text-slate-700">Type:</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition',
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
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
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
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
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100',
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
          <span className="text-sm font-semibold text-slate-700">Category</span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
          <span className="text-sm font-semibold text-slate-700">Time Period</span>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
            className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

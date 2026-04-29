import React from 'react'

function formatCurrency(value) {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return value < 0 ? `-${formatted}` : formatted
}

function formatDate(date) {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getCategoryIcon(category, type) {
  const icons = {
    // Expense categories
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Bills: '📄',
    Subscriptions: '📱',
    Health: '⚕️',
    Entertainment: '🎬',
    // Income sources
    Salary: '💼',
    Freelance: '💻',
    Business: '🏢',
    Investment: '📈',
    Rental: '🏠',
    Gift: '🎁',
    Other: type === 'income' ? '💰' : '💳',
  }
  return icons[category] || (type === 'income' ? '💰' : '💳')
}

export default function TransactionListItem({ transaction, onDelete }) {
  const isIncome = transaction.type === 'income'
  const category = transaction.category || transaction.source || 'Other'
  const icon = getCategoryIcon(category, transaction.type)

  return (
    <li className="group rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3">
          {/* Icon */}
          <div
            className={[
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg',
              isIncome ? 'bg-emerald-100' : 'bg-rose-100',
            ].join(' ')}
          >
            {icon}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{category}</h3>
                {transaction.note && (
                  <p className="mt-0.5 text-sm text-slate-600 line-clamp-2">
                    {transaction.note}
                  </p>
                )}
              </div>
              
              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p
                  className={[
                    'text-lg font-bold',
                    isIncome ? 'text-emerald-600' : 'text-rose-600',
                  ].join(' ')}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>

            {/* Date and Actions */}
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>📅</span>
                <span>{formatDate(transaction.date)}</span>
                <span
                  className={[
                    'rounded-full px-2 py-0.5 text-xs font-semibold',
                    isIncome
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700',
                  ].join(' ')}
                >
                  {isIncome ? 'Income' : 'Expense'}
                </span>
              </div>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(transaction.id)}
                  className="opacity-0 group-hover:opacity-100 rounded-lg bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

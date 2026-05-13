import React from 'react'
import { useCurrency } from '../context/CurrencyContext.jsx'

function formatDate(date) {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getCategoryIcon(category, type) {
  const icons = {
    Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '📄',
    Subscriptions: '📱', Health: '⚕️', Entertainment: '🎬',
    Salary: '💼', Freelance: '💻', Business: '🏢',
    Investment: '📈', Rental: '🏠', Gift: '🎁',
    Other: type === 'income' ? '💰' : '💳',
  }
  return icons[category] || (type === 'income' ? '💰' : '💳')
}

export default function TransactionListItem({ transaction, onDelete, accountName }) {
  const { formatCurrency } = useCurrency()
  const isIncome = transaction.type === 'income'
  const category = transaction.category || transaction.source || 'Other'
  const icon = getCategoryIcon(category, transaction.type)

  return (
    <li className="group rounded-xl bg-surface-secondary p-4 ring-1 ring-border-subtle transition hover:bg-surface-elevated hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-1 items-start gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg ${isIncome ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-400/10 text-rose-600'}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink truncate">{category}</h3>
                {transaction.note && <p className="mt-0.5 text-sm text-ink-secondary line-clamp-2">{transaction.note}</p>}
                {accountName && <p className="mt-0.5 text-xs text-ink-tertiary">From: {accountName}</p>}
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-lg font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-ink-secondary">
                <span>📅</span>
                <span>{formatDate(transaction.date)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${isIncome ? 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20' : 'bg-rose-400/10 text-rose-600 ring-1 ring-rose-400/20'}`}>
                  {isIncome ? 'Income' : 'Expense'}
                </span>
              </div>
              {onDelete && (
                <button type="button" onClick={() => onDelete(transaction.id)} className="button-secondary rounded-lg px-2 py-1 text-xs font-semibold">
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

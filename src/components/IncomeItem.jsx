import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useCurrency } from '../context/CurrencyContext.jsx'

function formatDate(value) {
  if (!value) return ''
  const d = typeof value?.toDate === 'function' ? value.toDate() : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function IncomeItem({ income, onEdit, onDelete }) {
  const { formatCurrency } = useCurrency()
  const amount = Number(income?.amount) || 0
  const dateLabel = income?.date ? formatDate(income.date) : ''
  const note = income?.note ? String(income.note) : ''

  return (
    <li className="dashboard-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{income?.source || 'Other'}</p>
        <p className="mt-1 text-sm text-slate-400">
          {dateLabel || '—'}{note ? ` · ${note}` : ''}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        <p className="text-base font-semibold text-emerald-400">+{formatCurrency(amount).replace('-', '')}</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onEdit?.(income)}
            className="rounded-lg bg-sky-400/10 px-2.5 py-1.5 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/20 transition hover:bg-sky-400/20">
            <span className="inline-flex items-center gap-1.5"><PencilSquareIcon className="h-3.5 w-3.5" /> Edit</span>
          </button>
          <button type="button" onClick={() => onDelete?.(income?.id)}
            className="rounded-lg bg-rose-400/10 px-2.5 py-1.5 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/20 transition hover:bg-rose-400/20">
            <span className="inline-flex items-center gap-1.5"><TrashIcon className="h-3.5 w-3.5" /> Delete</span>
          </button>
        </div>
      </div>
    </li>
  )
}

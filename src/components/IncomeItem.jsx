import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

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

function formatDate(value) {
  if (!value) return ''
  const d = typeof value?.toDate === 'function' ? value.toDate() : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function IncomeItem({ income, onEdit, onDelete }) {
  const amount = Number(income?.amount) || 0
  const dateLabel = income?.date ? formatDate(income.date) : ''
  const note = income?.note ? String(income.note) : ''

  return (
    <li className="flex flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-emerald-100 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">{income?.source || 'Other'}</p>
        <p className="mt-1 text-sm text-slate-500">
          {dateLabel ? dateLabel : '—'}
          {note ? ` · ${note}` : ''}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        <p className="text-base font-semibold text-emerald-700">
          +
          {formatCurrency(amount).replace('-', '')}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(income)}
            className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
          >
            <span className="inline-flex items-center gap-2">
              <PencilSquareIcon className="h-4 w-4" />
              Edit
            </span>
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(income?.id)}
            className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-100 transition hover:bg-rose-50"
          >
            <span className="inline-flex items-center gap-2">
              <TrashIcon className="h-4 w-4" />
              Delete
            </span>
          </button>
        </div>
      </div>
    </li>
  )
}


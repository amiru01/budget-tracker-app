import React from 'react'

export default function SummaryCard({ label, value, sublabel, icon, variant = 'default' }) {
  const variantStyles = {
    default: 'bg-white ring-slate-200',
    income: 'bg-gradient-to-br from-emerald-50 to-white ring-emerald-200',
    expense: 'bg-gradient-to-br from-rose-50 to-white ring-rose-200',
    balance: 'bg-gradient-to-br from-blue-50 to-white ring-blue-200',
  }

  const iconStyles = {
    default: 'bg-slate-100 text-slate-600',
    income: 'bg-emerald-100 text-emerald-600',
    expense: 'bg-rose-100 text-rose-600',
    balance: 'bg-blue-100 text-blue-600',
  }

  return (
    <article
      className={[
        'rounded-2xl p-6 shadow-md ring-1 transition hover:shadow-lg',
        variantStyles[variant],
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
          {sublabel && <p className="mt-1 text-xs text-slate-600">{sublabel}</p>}
        </div>
        {icon && (
          <div
            className={[
              'flex h-12 w-12 items-center justify-center rounded-xl text-xl',
              iconStyles[variant],
            ].join(' ')}
          >
            {icon}
          </div>
        )}
      </div>
    </article>
  )
}

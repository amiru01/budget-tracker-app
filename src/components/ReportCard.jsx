import React from 'react'

export default function ReportCard({ label, value, icon, trend, variant = 'default' }) {
  const variantStyles = {
    default: 'bg-white ring-slate-200',
    success: 'bg-gradient-to-br from-emerald-50 to-white ring-emerald-200',
    danger: 'bg-gradient-to-br from-rose-50 to-white ring-rose-200',
    warning: 'bg-gradient-to-br from-amber-50 to-white ring-amber-200',
  }

  const iconStyles = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-600',
    danger: 'bg-rose-100 text-rose-600',
    warning: 'bg-amber-100 text-amber-600',
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
          
          {trend && (
            <div className="mt-2 flex items-center gap-2">
              {trend.direction === 'up' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
                  <span>↑</span>
                  <span>{trend.percentage}%</span>
                </span>
              )}
              {trend.direction === 'down' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <span>↓</span>
                  <span>{trend.percentage}%</span>
                </span>
              )}
              {trend.direction === 'stable' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  <span>→</span>
                  <span>Stable</span>
                </span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div
            className={[
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-xl',
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

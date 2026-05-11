import React from 'react'

export default function ReportCard({ label, value, icon, trend, variant = 'default' }) {
  const variantStyles = {
    default: 'ring-slate-300/20',
    success: 'ring-emerald-300/20',
    danger: 'ring-rose-300/20',
    warning: 'ring-amber-300/20',
  }

  const iconStyles = {
    default: 'bg-slate-400/10 text-slate-300',
    success: 'bg-emerald-400/10 text-emerald-300',
    danger: 'bg-rose-400/10 text-rose-300',
    warning: 'bg-amber-400/10 text-amber-300',
  }

  const glowStyles = {
    default: 'hover:shadow-[0_0_24px_rgba(148,163,184,0.2)]',
    success: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.2)]',
    danger: 'hover:shadow-[0_0_24px_rgba(244,63,94,0.2)]',
    warning: 'hover:shadow-[0_0_24px_rgba(251,191,36,0.2)]',
  }

  return (
    <article
      className={[
        'dashboard-card card-hover p-6',
        variantStyles[variant],
        glowStyles[variant],
        glowStyles[variant],
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400">{label}</p>
          <p className="font-display mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
          
          {trend && (
            <div className="mt-2 flex items-center gap-2">
              {trend.direction === 'up' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/10 px-2 py-0.5 text-xs font-semibold text-rose-300">
                  <span>↑</span>
                  <span>{trend.percentage}%</span>
                </span>
              )}
              {trend.direction === 'down' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                  <span>↓</span>
                  <span>{trend.percentage}%</span>
                </span>
              )}
              {trend.direction === 'stable' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-400/10 px-2 py-0.5 text-xs font-semibold text-slate-300">
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

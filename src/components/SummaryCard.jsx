import React from 'react'

export default function SummaryCard({ label, value, sublabel, icon, variant = 'default' }) {
  const variantStyles = {
    default: 'ring-slate-300/20',
    income: 'ring-emerald-300/20',
    expense: 'ring-rose-300/20',
    balance: 'ring-cyan-300/20',
  }

  const iconStyles = {
    default: 'bg-slate-400/10 text-slate-300',
    income: 'bg-emerald-400/10 text-emerald-300',
    expense: 'bg-rose-400/10 text-rose-300',
    balance: 'bg-cyan-400/10 text-cyan-300',
  }

  const glowStyles = {
    default: 'hover:shadow-[0_0_24px_rgba(148,163,184,0.2)]',
    income: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.2)]',
    expense: 'hover:shadow-[0_0_24px_rgba(244,63,94,0.2)]',
    balance: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.2)]',
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
          {sublabel && <p className="mt-1 text-xs text-slate-400">{sublabel}</p>}
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

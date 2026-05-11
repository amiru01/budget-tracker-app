import React from 'react'

export default function ChartTooltip({ active, payload, label, formatCurrency, seriesLabel }) {
  if (!active || !payload?.length) return null

  const entry = payload[0]
  const value = Number(entry?.value ?? 0)
  const name = seriesLabel || entry?.name || 'Value'

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-500/15 backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-300">{name}</span>
        <span className="text-sm font-bold text-white">{formatCurrency(value)}</span>
      </div>
    </div>
  )
}

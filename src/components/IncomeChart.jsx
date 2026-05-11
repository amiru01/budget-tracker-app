import React from 'react'
import { useCurrency } from '../context/CurrencyContext.jsx'
import ChartTooltip from './ChartTooltip.jsx'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const pieColors = ['#10b981', '#22c55e', '#34d399', '#16a34a', '#0ea5e9', '#a7f3d0', '#047857']

export default function IncomeChart({
  monthlyIncomeTrend,
  incomeBySource,
  variant = 'full',
}) {
  const { formatCurrency } = useCurrency()
  const showPie = variant !== 'preview'
  const monthly = monthlyIncomeTrend || []
  const bySource = incomeBySource || { total: 0, data: [] }
  const [hoverIdx, setHoverIdx] = React.useState(null)

  return (
    <div className="space-y-6">
      <article className="dashboard-card p-6 transition hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-white">Income trend</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-400">Monthly inflow over the last six months.</p>
          </div>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-300/20">
            {formatCurrency(bySource.total)}
          </span>
        </div>

        <div className="dashboard-panel mt-6 p-4">
          <div className={variant === 'preview' ? 'h-56' : 'h-72'}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.18)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  width={44}
                  tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                />
                <Tooltip content={<ChartTooltip formatCurrency={formatCurrency} seriesLabel="Income" />} cursor={{ stroke: 'rgba(16,185,129,0.36)', strokeWidth: 1 }} />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </article>

      {showPie ? (
        <article className="dashboard-card p-6 transition hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">Income sources</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-400">How each source contributes to total inflow.</p>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-300/20">
              {formatCurrency(bySource.total)}
            </span>
          </div>

          <div className="dashboard-panel mt-6 p-4">
            <div className="h-72 rounded-lg bg-slate-950/35 p-2 ring-1 ring-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<ChartTooltip formatCurrency={formatCurrency} />} />
                  <Pie
                    data={bySource.data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {bySource.data.map((entry, idx) => (
                      <Cell key={entry.name} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {bySource.data.slice(0, 6).map((c, idx) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-slate-300 ring-1 ring-white/10"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[idx % pieColors.length] }} />
                {c.name}
              </span>
            ))}
          </div>
        </article>
      ) : null}
    </div>
  )
}

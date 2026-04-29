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

const pieColors = ['#10b981', '#22c55e', '#34d399', '#16a34a', '#0ea5e9', '#a7f3d0', '#047857']

function MonthlyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const amount = payload[0]?.value ?? 0
  return (
    <div className="rounded-xl bg-white p-3 shadow-lg ring-1 ring-emerald-100">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-700">{formatCurrency(Number(amount))}</p>
    </div>
  )
}

export default function IncomeChart({
  monthlyIncomeTrend,
  incomeBySource,
  variant = 'full',
}) {
  const showPie = variant !== 'preview'
  const monthly = monthlyIncomeTrend || []
  const bySource = incomeBySource || { total: 0, data: [] }

  return (
    <div className="space-y-6">
      <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-emerald-200/60 transition hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Monthly income</h2>
            <p className="mt-1 text-sm text-slate-500">Trend over the last 6 months.</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            {formatCurrency(bySource.total)}
          </span>
        </div>

        <div className="mt-6 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
          <div className={variant === 'preview' ? 'h-56' : 'h-72'}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  width={44}
                  tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                />
                <Tooltip content={<MonthlyTooltip />} cursor={{ stroke: '#bbf7d0', strokeWidth: 1 }} />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]} fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </article>

      {showPie ? (
        <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-emerald-200/60 transition hover:shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Income by source</h2>
              <p className="mt-1 text-sm text-slate-500">Where your income is coming from.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              {formatCurrency(bySource.total)}
            </span>
          </div>

          <div className="mt-6 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
            <div className="h-72 rounded-lg bg-white/60 p-2 ring-1 ring-emerald-200/60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(Number(value)), String(name)]}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgb(220 252 231)',
                    }}
                  />
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
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
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


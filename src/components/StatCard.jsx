export default function StatCard({ label, value, accent = 'blue', sublabel }) {
  const accents = {
    blue: {
      ring: 'ring-sky-200/70',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      dot: 'bg-sky-500',
    },
    green: {
      ring: 'ring-emerald-200/70',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      dot: 'bg-emerald-500',
    },
    red: {
      ring: 'ring-rose-200/70',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      dot: 'bg-rose-500',
    },
  }

  const tone = accents[accent] ?? accents.blue

  return (
    <article
      className={[
        'group rounded-xl bg-white p-6 shadow-md ring-1 transition',
        'hover:shadow-lg hover:-translate-y-0.5',
        tone.ring,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
          {sublabel ? <p className="mt-2 text-sm text-slate-500">{sublabel}</p> : null}
        </div>

        <div className={`rounded-full ${tone.badgeBg} px-3 py-1 text-xs font-semibold ${tone.badgeText}`}>
          <span className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${tone.dot}`} />
          Live
        </div>
      </div>
    </article>
  )
}


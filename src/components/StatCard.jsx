export default function StatCard({ label, value, accent = 'blue', sublabel }) {
  const accents = {
    blue: {
      ring: 'ring-cyan-300/20',
      badgeBg: 'bg-cyan-400/10',
      badgeText: 'text-cyan-300',
      dot: 'bg-cyan-400',
      glow: 'hover:shadow-[0_0_24px_rgba(6,182,212,0.2)]'
    },
    green: {
      ring: 'ring-emerald-300/20',
      badgeBg: 'bg-emerald-400/10',
      badgeText: 'text-emerald-300',
      dot: 'bg-emerald-400',
      glow: 'hover:shadow-[0_0_24px_rgba(16,185,129,0.2)]'
    },
    red: {
      ring: 'ring-rose-300/20',
      badgeBg: 'bg-rose-400/10',
      badgeText: 'text-rose-600',
      dot: 'bg-rose-400',
      glow: 'hover:shadow-[0_0_24px_rgba(244,63,94,0.2)]'
    },
  }

  const tone = accents[accent] ?? accents.blue

  return (
    <article
      className={[
        'dashboard-card card-hover group p-6',
        tone.ring,
        tone.glow
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">{label}</p>
          <p className="font-display mt-3 text-3xl font-extrabold tracking-[-0.025em] text-ink">{value}</p>
          {sublabel ? <p className="mt-2 text-sm font-medium leading-6 text-ink-secondary">{sublabel}</p> : null}
        </div>

        <div className={`rounded-full ${tone.badgeBg} px-3 py-1 text-xs font-bold ${tone.badgeText}`}>
          <span className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${tone.dot}`} />
          Live
        </div>
      </div>
    </article>
  )
}

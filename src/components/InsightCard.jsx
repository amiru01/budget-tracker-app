export default function InsightCard({ title, message }) {
  return (
    <div className="dashboard-card p-4">
      <h3 className="font-display text-lg font-bold tracking-tight text-ink">{title}</h3>
      <p className="mt-1 text-sm font-medium leading-6 text-ink-secondary">{message}</p>
    </div>
  )
}

export default function InsightCard({ title, message }) {
  return (
    <div className="rounded-xl bg-white/70 p-4 ring-1 ring-sky-100">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{message}</p>
    </div>
  )
}


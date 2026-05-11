function SimplePage({ heading, description }) {
  return (
    <section className="rounded-3xl bg-white dark:dashboard-card p-8 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">
          Smart Finance
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {heading}
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
      </div>
    </section>
  )
}

export default SimplePage

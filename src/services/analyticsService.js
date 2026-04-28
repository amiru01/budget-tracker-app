function toDate(value) {
  // Firestore Timestamp has toDate(). We also accept JS Date/string.
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value?.toDate === 'function') return value.toDate()
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDayLabel(date) {
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export function computeTotals(expenses) {
  let income = 0
  let expenseTotal = 0

  for (const e of expenses) {
    const amount = Number(e.amount) || 0
    const type = e.type || 'expense'
    if (type === 'income') income += amount
    else expenseTotal += amount
  }

  return {
    income,
    expenses: expenseTotal,
    balance: income - expenseTotal,
  }
}

export function computeCategoryBreakdown(expenses) {
  const byCategory = new Map()
  let total = 0

  for (const e of expenses) {
    const type = e.type || 'expense'
    if (type === 'income') continue
    const amount = Number(e.amount) || 0
    if (amount <= 0) continue
    const category = e.category || 'Other'
    total += amount
    byCategory.set(category, (byCategory.get(category) || 0) + amount)
  }

  const data = Array.from(byCategory.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return { total, data }
}

export function computeWeeklySpending(expenses, days = 7) {
  const today = startOfDay(new Date())
  const buckets = []

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    buckets.push({
      date: d,
      label: formatDayLabel(d),
      value: 0,
    })
  }

  const start = new Date(today)
  start.setDate(today.getDate() - (days - 1))

  for (const e of expenses) {
    const type = e.type || 'expense'
    if (type === 'income') continue
    const amount = Number(e.amount) || 0
    if (amount <= 0) continue
    const d = toDate(e.date)
    if (!d) continue
    const day = startOfDay(d)
    if (day < start || day > today) continue
    const idx = Math.round((day - start) / (24 * 60 * 60 * 1000))
    if (idx >= 0 && idx < buckets.length) buckets[idx].value += amount
  }

  return buckets.map((b) => ({ day: b.label, amount: Number(b.value.toFixed(2)), date: b.date }))
}

export function generateInsights(expenses) {
  const insights = []

  const weekly = computeWeeklySpending(expenses, 14)
  const last7 = weekly.slice(7).reduce((sum, d) => sum + d.amount, 0)
  const prev7 = weekly.slice(0, 7).reduce((sum, d) => sum + d.amount, 0)

  const { total, data: categories } = computeCategoryBreakdown(expenses)
  const food = categories.find((c) => c.name.toLowerCase() === 'food')
  const top = categories[0]

  if (total > 0 && food && food.value / total > 0.3) {
    insights.push({
      id: 'food-30',
      title: 'Food spending',
      message: 'You are spending too much on food (over 30% of total spending).',
    })
  }

  if (prev7 > 0 && last7 / prev7 > 1.2) {
    insights.push({
      id: 'week-up-20',
      title: 'Weekly trend',
      message: 'Your spending increased this week by more than 20% compared to last week.',
    })
  }

  if (top && top.name.toLowerCase() === 'transport') {
    insights.push({
      id: 'transport-top',
      title: 'Top category',
      message: 'Transport is your top expense category right now.',
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'steady',
      title: 'All good',
      message: 'Your spending looks steady. Keep tracking for better insights.',
    })
  }

  return insights.slice(0, 3)
}


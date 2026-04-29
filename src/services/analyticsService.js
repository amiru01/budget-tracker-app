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

function startOfMonth(date) {
  const d = new Date(date)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

function nextMonth(date) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + 1)
  return d
}

function isInDateRange(date, start, endExclusive) {
  const t = startOfDay(date).getTime()
  return t >= start.getTime() && t < endExclusive.getTime()
}

function isPositiveAmount(value) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0
}

function sumAmounts(items, amountSelector) {
  let sum = 0
  for (const item of items) sum += Number(amountSelector(item)) || 0
  return sum
}

function filterToCurrentMonth(incomes) {
  const now = new Date()
  const start = startOfMonth(now)
  const end = nextMonth(start)
  return incomes.filter((inc) => {
    const d = toDate(inc.date)
    if (!d) return false
    return isInDateRange(d, start, end)
  })
}

function filterExpensesToCurrentMonth(expenses) {
  const now = new Date()
  const start = startOfMonth(now)
  const end = nextMonth(start)
  return expenses.filter((e) => {
    const d = toDate(e.date)
    if (!d) return false
    const type = e.type || 'expense'
    if (type === 'income') return false
    return isInDateRange(d, start, end)
  })
}

export function calculateTotalIncome(incomes) {
  // Month-to-date total (for dashboard).
  const monthly = Array.isArray(incomes) ? filterToCurrentMonth(incomes) : []
  return sumAmounts(monthly, (i) => {
    const n = Number(i.amount) || 0
    return n > 0 ? n : 0
  })
}

export function calculateTotalIncomeAllTime(incomes) {
  if (!Array.isArray(incomes) || incomes.length === 0) return 0
  return sumAmounts(incomes, (i) => {
    const n = Number(i.amount) || 0
    return n > 0 ? n : 0
  })
}

export function calculateTotalExpenses(expenses) {
  // Month-to-date expense total (ignores entries marked as type==='income').
  const monthly = Array.isArray(expenses) ? filterExpensesToCurrentMonth(expenses) : []
  return sumAmounts(monthly, (e) => {
    const n = Number(e.amount) || 0
    return n > 0 ? n : 0
  })
}

export function calculateTotalExpensesAllTime(expenses) {
  if (!Array.isArray(expenses) || expenses.length === 0) return 0
  let sum = 0
  for (const e of expenses) {
    const type = e.type || 'expense'
    if (type === 'income') continue
    const n = Number(e.amount) || 0
    if (n > 0) sum += n
  }
  return sum
}

export function calculateBalance(incomes, expenses) {
  return calculateTotalIncome(incomes) - calculateTotalExpenses(expenses)
}

export function groupExpensesByCategory(expenses) {
  const monthly = Array.isArray(expenses) ? filterExpensesToCurrentMonth(expenses) : []
  const byCategory = new Map()
  let total = 0

  for (const e of monthly) {
    const amount = Number(e.amount) || 0
    if (!isPositiveAmount(amount)) continue
    const category = e.category || 'Other'
    total += amount
    byCategory.set(category, (byCategory.get(category) || 0) + amount)
  }

  const data = Array.from(byCategory.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return { total, data }
}

export function getWeeklySpending(expenses, days = 7) {
  const safeDays = Math.max(1, Number(days) || 7)
  const today = startOfDay(new Date())
  const buckets = []

  for (let i = safeDays - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    buckets.push({
      date: d,
      label: formatDayLabel(d),
      value: 0,
    })
  }

  const start = new Date(today)
  start.setDate(today.getDate() - (safeDays - 1))

  for (const e of expenses || []) {
    const type = e.type || 'expense'
    if (type === 'income') continue
    const amount = Number(e.amount) || 0
    if (!isPositiveAmount(amount)) continue

    const d = toDate(e.date)
    if (!d) continue

    const day = startOfDay(d)
    if (day < start || day > today) continue

    const idx = Math.round((day - start) / (24 * 60 * 60 * 1000))
    if (idx >= 0 && idx < buckets.length) buckets[idx].value += amount
  }

  return buckets.map((b) => ({
    day: b.label,
    amount: Number(b.value.toFixed(2)),
    date: b.date,
  }))
}

function groupIncomeBySource(incomes) {
  const by = new Map()
  let total = 0

  for (const inc of incomes || []) {
    const amount = Number(inc.amount) || 0
    if (!isPositiveAmount(amount)) continue
    const source = inc.source || 'Other'
    total += amount
    by.set(source, (by.get(source) || 0) + amount)
  }

  const data = Array.from(by.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)

  return { total, data }
}

function computeMonthlyIncomeTrend(incomes, months = 6) {
  const now = startOfDay(new Date())
  const buckets = []

  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(now)
    d.setMonth(now.getMonth() - i)
    d.setDate(1)
    d.setHours(0, 0, 0, 0)

    buckets.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString(undefined, { month: 'short' }),
      value: 0,
    })
  }

  for (const inc of incomes || []) {
    const d = toDate(inc.date)
    if (!d) continue

    const day = startOfDay(d)
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}`
    const bucket = buckets.find((b) => b.key === key)
    if (!bucket) continue

    const amount = Number(inc.amount) || 0
    if (!isPositiveAmount(amount)) continue
    bucket.value += amount
  }

  return buckets.map((b) => ({ month: b.label, amount: Number(b.value.toFixed(2)) }))
}

export function generateIncomeInsights(incomes) {
  const cleaned = Array.isArray(incomes) ? incomes : []
  const insights = []
  const total = cleaned.reduce((sum, i) => sum + (Number(i.amount) || 0), 0)
  const { data: bySource } = groupIncomeBySource(cleaned)
  const top = bySource[0]
  const topShare = top && total > 0 ? top.value / total : 0

  if (topShare >= 0.8 && top) {
    insights.push({
      id: 'income-single-source-heavy',
      title: 'Source concentration',
      message: `You rely heavily on a single income source (${top.name}).`,
    })
  }

  const now = startOfDay(new Date())
  const currentMonthStart = startOfMonth(now)
  const lastMonthStart = new Date(currentMonthStart)
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1)
  const nextMonthStart = nextMonth(currentMonthStart)

  const lastMonthEnd = currentMonthStart

  const currentMonthTotal = cleaned.reduce((sum, inc) => {
    const d = toDate(inc.date)
    if (!d) return sum
    if (isInDateRange(d, currentMonthStart, nextMonthStart)) return sum + (Number(inc.amount) || 0)
    return sum
  }, 0)

  const lastMonthTotal = cleaned.reduce((sum, inc) => {
    const d = toDate(inc.date)
    if (!d) return sum
    if (isInDateRange(d, lastMonthStart, lastMonthEnd)) return sum + (Number(inc.amount) || 0)
    return sum
  }, 0)

  if (currentMonthTotal > 0 && currentMonthTotal > lastMonthTotal) {
    insights.push({
      id: 'income-increased-month',
      title: 'Income trend',
      message: 'Your income has increased this month.',
    })
  }

  const mostRecentDate = cleaned
    .map((inc) => toDate(inc.date))
    .filter(Boolean)
    .sort((a, b) => b.getTime() - a.getTime())[0]

  const daysSince = mostRecentDate
    ? Math.floor((now.getTime() - startOfDay(mostRecentDate).getTime()) / (24 * 60 * 60 * 1000))
    : null

  if (!mostRecentDate || (daysSince !== null && daysSince >= 30)) {
    insights.push({
      id: 'income-no-record-recently',
      title: 'Keep momentum',
      message: "You haven’t recorded income recently.",
    })
  }

  if (insights.length === 0) {
    insights.push({
      id: 'income-steady',
      title: 'All good',
      message: 'Your income records look steady. Keep tracking to unlock better insights.',
    })
  }

  return insights.slice(0, 3)
}

function generateExpenseInsights(expenses) {
  const insights = []
  const weekly = getWeeklySpending(expenses, 14)
  const last7 = weekly.slice(7).reduce((sum, d) => sum + d.amount, 0)
  const prev7 = weekly.slice(0, 7).reduce((sum, d) => sum + d.amount, 0)

  const { total, data: categories } = groupExpensesByCategory(expenses)
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

export function generateInsights(incomes, expenses) {
  const incomeInsights = generateIncomeInsights(incomes)
  const expenseInsights = generateExpenseInsights(expenses)
  return [...incomeInsights, ...expenseInsights].slice(0, 3)
}

export function calculateIncomeBySource(incomes) {
  return groupIncomeBySource(incomes)
}

export function calculateMonthlyIncomeTrend(incomes, months = 6) {
  return computeMonthlyIncomeTrend(incomes, months)
}


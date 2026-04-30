import { addNotification, notificationExists } from './notificationService.js'

/**
 * Smart notification triggers based on financial data
 */

/**
 * Check for budget violations and create notifications
 */
export async function checkBudgetNotifications(userId, expenses, budgetRules) {
  if (!userId || !budgetRules || budgetRules.length === 0) return

  const now = new Date()

  for (const rule of budgetRules) {
    if (!rule.isActive) continue

    let startDate
    const endDate = new Date(now)

    switch (rule.type) {
      case 'daily':
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
        break
      case 'weekly':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        continue
    }

    // Calculate spending for this category in the time period
    const categorySpending = expenses
      .filter((expense) => {
        if (expense.category !== rule.category) return false
        if (expense.type === 'income') return false

        const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date)
        return expenseDate >= startDate && expenseDate <= endDate
      })
      .reduce((sum, expense) => sum + (expense.amount || 0), 0)

    // Check if budget exceeded
    if (categorySpending > rule.limit) {
      const excess = categorySpending - rule.limit
      const message = `You exceeded your ${rule.category} budget by ${excess.toFixed(2)}. Limit: ${rule.limit.toFixed(2)}`

      // Check if notification already exists (prevent spam)
      const exists = await notificationExists(userId, message, 1440) // 24 hours
      if (!exists) {
        await addNotification({
          userId,
          title: '🚨 Budget Exceeded',
          message,
          type: 'error',
          metadata: {
            category: rule.category,
            limit: rule.limit,
            spending: categorySpending,
            excess,
          },
        })
      }
    }
    // Warning at 80% of budget
    else if (categorySpending > rule.limit * 0.8) {
      const percentage = ((categorySpending / rule.limit) * 100).toFixed(0)
      const message = `You've used ${percentage}% of your ${rule.category} budget (${categorySpending.toFixed(2)} / ${rule.limit.toFixed(2)})`

      const exists = await notificationExists(userId, message, 1440)
      if (!exists) {
        await addNotification({
          userId,
          title: '⚠️ Budget Warning',
          message,
          type: 'warning',
          metadata: {
            category: rule.category,
            limit: rule.limit,
            spending: categorySpending,
            percentage,
          },
        })
      }
    }
  }
}

/**
 * Check for unusual spending patterns
 */
export async function checkSpendingPatterns(userId, expenses) {
  if (!userId || !expenses || expenses.length === 0) return

  const now = new Date()
  const thisWeekStart = new Date(now)
  thisWeekStart.setDate(now.getDate() - 7)

  const lastWeekStart = new Date(now)
  lastWeekStart.setDate(now.getDate() - 14)
  const lastWeekEnd = new Date(thisWeekStart)

  // Calculate this week's spending
  const thisWeekSpending = expenses
    .filter((expense) => {
      if (expense.type === 'income') return false
      const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date)
      return expenseDate >= thisWeekStart && expenseDate <= now
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0)

  // Calculate last week's spending
  const lastWeekSpending = expenses
    .filter((expense) => {
      if (expense.type === 'income') return false
      const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date)
      return expenseDate >= lastWeekStart && expenseDate < lastWeekEnd
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0)

  // Alert if spending increased by more than 50%
  if (lastWeekSpending > 0 && thisWeekSpending > lastWeekSpending * 1.5) {
    const increase = ((thisWeekSpending - lastWeekSpending) / lastWeekSpending * 100).toFixed(0)
    const message = `Your spending increased by ${increase}% this week (${thisWeekSpending.toFixed(2)} vs ${lastWeekSpending.toFixed(2)} last week)`

    const exists = await notificationExists(userId, message, 10080) // 7 days
    if (!exists) {
      await addNotification({
        userId,
        title: '⚠️ Spending Alert',
        message,
        type: 'warning',
        metadata: {
          thisWeek: thisWeekSpending,
          lastWeek: lastWeekSpending,
          increase,
        },
      })
    }
  }
}

/**
 * Check savings rate and alert if low
 */
export async function checkSavingsRate(userId, incomes, expenses) {
  if (!userId || !incomes || incomes.length === 0) return

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  // Calculate this month's income
  const monthlyIncome = incomes
    .filter((income) => {
      const incomeDate = income.date?.toDate ? income.date.toDate() : new Date(income.date)
      return incomeDate >= monthStart && incomeDate <= now
    })
    .reduce((sum, income) => sum + (income.amount || 0), 0)

  // Calculate this month's expenses
  const monthlyExpenses = expenses
    .filter((expense) => {
      if (expense.type === 'income') return false
      const expenseDate = expense.date?.toDate ? expense.date.toDate() : new Date(expense.date)
      return expenseDate >= monthStart && expenseDate <= now
    })
    .reduce((sum, expense) => sum + (expense.amount || 0), 0)

  if (monthlyIncome === 0) return

  const savingsRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100

  // Alert if savings rate is below 10%
  if (savingsRate < 10 && savingsRate > -100) {
    const message = `Your savings rate is ${savingsRate.toFixed(1)}% this month. Consider reducing expenses to save more.`

    const exists = await notificationExists(userId, message, 43200) // 30 days
    if (!exists) {
      await addNotification({
        userId,
        title: '💰 Low Savings Rate',
        message,
        type: 'warning',
        metadata: {
          income: monthlyIncome,
          expenses: monthlyExpenses,
          savingsRate: savingsRate.toFixed(1),
        },
      })
    }
  }
}

/**
 * Send welcome notification for new users
 */
export async function sendWelcomeNotification(userId) {
  if (!userId) return

  const message = 'Welcome to Smart Finance! Start by adding your first income or expense to track your finances.'

  const exists = await notificationExists(userId, message, 10080) // 7 days
  if (!exists) {
    await addNotification({
      userId,
      title: '👋 Welcome!',
      message,
      type: 'info',
    })
  }
}

/**
 * Notify when income is added
 */
export async function notifyIncomeAdded(userId, amount, source) {
  if (!userId) return

  await addNotification({
    userId,
    title: '💰 Income Added',
    message: `${amount.toFixed(2)} from ${source} has been recorded`,
    type: 'success',
    metadata: {
      amount,
      source,
    },
  })
}

/**
 * Send monthly report notification
 */
export async function sendMonthlyReport(userId, totalIncome, totalExpenses, balance) {
  if (!userId) return

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0
  const message = `Income: ${totalIncome.toFixed(2)} | Expenses: ${totalExpenses.toFixed(2)} | Savings: ${savingsRate}%`

  const exists = await notificationExists(userId, message, 43200) // 30 days
  if (!exists) {
    await addNotification({
      userId,
      title: '📊 Monthly Report',
      message,
      type: 'info',
      metadata: {
        income: totalIncome,
        expenses: totalExpenses,
        balance,
        savingsRate,
      },
    })
  }
}

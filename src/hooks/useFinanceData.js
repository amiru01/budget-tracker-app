import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { addIncome, deleteIncome, updateIncome, subscribeToIncomes } from '../services/incomeService.js'
import {
  addExpense,
  deleteExpense,
  updateExpense,
  subscribeToExpenses,
} from '../services/expenseService.js'
import {
  calculateBalance,
  calculateIncomeBySource,
  calculateMonthlyIncomeTrend,
  calculateTotalExpenses,
  calculateTotalExpensesAllTime,
  calculateTotalIncome,
  calculateTotalIncomeAllTime,
  generateInsights,
  generateIncomeInsights,
  getWeeklySpending,
  groupExpensesByCategory,
} from '../services/analyticsService.js'
import { ensureUserDoc } from '../services/userService.js'

export default function useFinanceData({ weeklyDays = 7 } = {}) {
  const { user, loading: authLoading } = useAuth()
  const userId = user?.uid || null

  const [incomes, setIncomes] = React.useState([])
  const [expenses, setExpenses] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  const loadedRef = React.useRef({ incomes: false, expenses: false })

  React.useEffect(() => {
    const t = setTimeout(() => setError(''), 0)
    loadedRef.current = { incomes: false, expenses: false }
    return () => clearTimeout(t)
  }, [userId])

  React.useEffect(() => {
    if (authLoading) return
    if (!userId) {
      const t = setTimeout(() => {
        setIncomes([])
        setExpenses([])
        setLoading(false)
      }, 0)
      return () => clearTimeout(t)
    }

    let unsubIncomes = null
    let unsubExpenses = null

    // Keep user document in sync for Firestore-based app features.
    ensureUserDoc(user)
      .catch(() => {
        // Non-blocking: dashboard still works without this.
      })

    const tLoading = setTimeout(() => setLoading(true), 0)

    unsubIncomes = subscribeToIncomes(
      userId,
      (items) => {
        setIncomes(items)
        loadedRef.current.incomes = true
        setLoading(!(loadedRef.current.incomes && loadedRef.current.expenses))
      },
      (err) => {
        setError(err?.message || 'Failed to load incomes')
        setLoading(false)
      },
    )

    unsubExpenses = subscribeToExpenses(
      userId,
      (items) => {
        setExpenses(items)
        loadedRef.current.expenses = true
        setLoading(!(loadedRef.current.incomes && loadedRef.current.expenses))
      },
      (err) => {
        setError(err?.message || 'Failed to load expenses')
        setLoading(false)
      },
    )

    return () => {
      clearTimeout(tLoading)
      if (typeof unsubIncomes === 'function') unsubIncomes()
      if (typeof unsubExpenses === 'function') unsubExpenses()
    }
  }, [authLoading, userId, user])

  const totalIncome = React.useMemo(() => calculateTotalIncome(incomes), [incomes])
  const totalExpenses = React.useMemo(() => calculateTotalExpenses(expenses), [expenses])
  const balance = React.useMemo(() => calculateBalance(incomes, expenses), [incomes, expenses])

  const categoryData = React.useMemo(() => groupExpensesByCategory(expenses), [expenses])
  const weeklyData = React.useMemo(() => getWeeklySpending(expenses, weeklyDays), [expenses, weeklyDays])

  const insights = React.useMemo(() => generateInsights(incomes, expenses), [incomes, expenses])
  const incomeInsights = React.useMemo(() => generateIncomeInsights(incomes), [incomes])

  const incomeMonthlyTrend = React.useMemo(() => calculateMonthlyIncomeTrend(incomes, 6), [incomes])
  const incomeBySource = React.useMemo(() => calculateIncomeBySource(incomes), [incomes])

  const allTimeTotalIncome = React.useMemo(() => calculateTotalIncomeAllTime(incomes), [incomes])
  const allTimeTotalExpenses = React.useMemo(() => calculateTotalExpensesAllTime(expenses), [expenses])
  const highestIncomeSource = React.useMemo(() => incomeBySource.data?.[0] ?? null, [incomeBySource])

  async function addIncomeEntry(data) {
    if (!userId) throw new Error('Not signed in')
    return addIncome({ userId, ...data })
  }

  async function deleteIncomeEntry(id) {
    return deleteIncome(id)
  }

  async function updateIncomeEntry(id, data) {
    if (!userId) throw new Error('Not signed in')
    return updateIncome(id, { userId, ...data })
  }

  async function addExpenseEntry(data) {
    if (!userId) throw new Error('Not signed in')
    return addExpense({ userId, ...data })
  }

  async function deleteExpenseEntry(id) {
    return deleteExpense(id)
  }

  async function updateExpenseEntry(id, data) {
    if (!userId) throw new Error('Not signed in')
    return updateExpense(id, { userId, ...data })
  }

  return {
    user,
    userId,
    incomes,
    expenses,
    totalIncome,
    totalExpenses,
    balance,
    categoryData,
    weeklyData,
    insights,
    incomeInsights,
    incomeMonthlyTrend,
    incomeBySource,
    highestIncomeSource,
    allTimeTotalIncome,
    allTimeTotalExpenses,
    loading: authLoading || loading,
    error,
    actions: {
      addIncome: addIncomeEntry,
      deleteIncome: deleteIncomeEntry,
      updateIncome: updateIncomeEntry,
      addExpense: addExpenseEntry,
      deleteExpense: deleteExpenseEntry,
      updateExpense: updateExpenseEntry,
    },
  }
}


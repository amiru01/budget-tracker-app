import { db } from '../firebase.js'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

const budgetRulesCol = collection(db, 'budgetRules')

/**
 * Schema for budget rules:
 * - userId: string
 * - name: string (e.g., "Weekly Dining Limit")
 * - category: string (e.g., "Food")
 * - type: 'weekly' | 'monthly' | 'daily'
 * - limit: number (spending limit)
 * - isActive: boolean
 * - createdAt: server timestamp
 */

export async function addBudgetRule({
  userId,
  name,
  category,
  type,
  limit,
  isActive = true,
}) {
  if (!userId) throw new Error('Missing userId')
  if (!name) throw new Error('Missing rule name')
  if (!category) throw new Error('Missing category')
  if (!type) throw new Error('Missing type')
  if (typeof limit !== 'number' || limit <= 0) throw new Error('Invalid limit amount')

  return await addDoc(budgetRulesCol, {
    userId,
    name,
    category,
    type,
    limit,
    isActive,
    createdAt: serverTimestamp(),
  })
}

export async function updateBudgetRule(ruleId, updatedData) {
  const { name, category, type, limit, isActive } = updatedData || {}

  if (!ruleId) throw new Error('Missing ruleId')
  if (name && !name.trim()) throw new Error('Invalid rule name')
  if (limit !== undefined && (typeof limit !== 'number' || limit <= 0)) {
    throw new Error('Invalid limit amount')
  }

  const updateFields = {}
  if (name !== undefined) updateFields.name = name
  if (category !== undefined) updateFields.category = category
  if (type !== undefined) updateFields.type = type
  if (limit !== undefined) updateFields.limit = limit
  if (isActive !== undefined) updateFields.isActive = isActive

  return updateDoc(doc(db, 'budgetRules', ruleId), updateFields)
}

export async function deleteBudgetRule(ruleId) {
  if (!ruleId) throw new Error('Missing ruleId')
  return await deleteDoc(doc(db, 'budgetRules', ruleId))
}

export function subscribeToBudgetRules(userId, onChange, onError) {
  if (!userId) {
    onChange([])
    return () => {}
  }

  const q = query(
    budgetRulesCol,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const rules = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      onChange(rules)
    },
    (err) => {
      if (onError) onError(err)
    }
  )
}

// Helper function to check if spending exceeds budget rules
export function checkBudgetViolations(expenses, budgetRules) {
  const violations = []
  const now = new Date()

  budgetRules.forEach((rule) => {
    if (!rule.isActive) return

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
        return
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

    if (categorySpending > rule.limit) {
      violations.push({
        rule,
        spending: categorySpending,
        excess: categorySpending - rule.limit,
        period: rule.type,
      })
    }
  })

  return violations
}
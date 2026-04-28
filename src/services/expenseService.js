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
  where,
} from 'firebase/firestore'

const expensesCol = collection(db, 'expenses')

/**
 * Schema (minimum):
 * - userId: string
 * - amount: number (positive)
 * - category: string
 * - date: Timestamp
 * - note: string
 *
 * We also store optional:
 * - type: 'expense' | 'income' (defaults to 'expense')
 * - createdAt: server timestamp
 */
export async function addExpense({
  userId,
  amount,
  category,
  date,
  note = '',
  type = 'expense',
}) {
  if (!userId) throw new Error('Missing userId')
  if (typeof amount !== 'number' || Number.isNaN(amount)) throw new Error('Invalid amount')
  if (!category) throw new Error('Missing category')
  if (!date) throw new Error('Missing date')

  return await addDoc(expensesCol, {
    userId,
    amount,
    category,
    date,
    note,
    type,
    createdAt: serverTimestamp(),
  })
}

export async function deleteExpense(expenseId) {
  if (!expenseId) throw new Error('Missing expenseId')
  return await deleteDoc(doc(db, 'expenses', expenseId))
}

export function subscribeToExpensesByUser(userId, onChange, onError) {
  if (!userId) {
    onChange([])
    return () => {}
  }

  const q = query(expensesCol, where('userId', '==', userId), orderBy('date', 'desc'))

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      onChange(items)
    },
    (err) => {
      if (onError) onError(err)
    },
  )
}


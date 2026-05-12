import { db } from '../firebase.js'
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'

const COLLECTION = 'debts'
const PAYMENTS_COLLECTION = 'debtPayments'

export function addDebt({ userId, name, totalAmount, remainingBalance, interestRate, dueDate, category, frequency = 'monthly', note = '', priority = 0 }) {
  if (!userId) throw new Error('User ID is required')
  if (!name?.trim()) throw new Error('Debt name is required')
  if (!totalAmount || Number(totalAmount) <= 0) throw new Error('Valid total amount is required')

  const remaining = remainingBalance !== undefined ? Number(remainingBalance) : Number(totalAmount)

  return addDoc(collection(db, COLLECTION), {
    userId,
    name: name.trim(),
    totalAmount: Number(totalAmount),
    remainingBalance: remaining,
    interestRate: Number(interestRate) || 0,
    dueDate: dueDate || null,
    category: category || 'Other',
    frequency: ['daily', 'weekly', 'monthly'].includes(frequency) ? frequency : 'monthly',
    note: note.trim(),
    priority: Number(priority) || 0,
    isPaid: remaining <= 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export function deleteDebt(debtId) {
  return deleteDoc(doc(db, COLLECTION, debtId))
}

export function updateDebt(debtId, data) {
  return updateDoc(doc(db, COLLECTION, debtId), {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export function subscribeToDebts(userId, onChange, onError) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('priority', 'asc'),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const debts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    onChange(debts)
  }, onError)
}

export function addDebtPayment({ debtId, userId, amount, date, note = '' }) {
  if (!debtId) throw new Error('Debt ID is required')
  if (!amount || Number(amount) <= 0) throw new Error('Valid payment amount is required')

  return addDoc(collection(db, PAYMENTS_COLLECTION), {
    debtId,
    userId,
    amount: Number(amount),
    date: date || Timestamp.now(),
    note: note.trim(),
    createdAt: Timestamp.now(),
  })
}

export function subscribeToDebtPayments(debtId, onChange, onError) {
  const q = query(
    collection(db, PAYMENTS_COLLECTION),
    where('debtId', '==', debtId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const payments = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    onChange(payments)
  }, onError)
}

import { db } from '../firebase.js'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

const incomesCol = collection(db, 'incomes')

async function addIncome(incomeData) {
  const { userId, amount, source, date, note = '' } = incomeData || {}

  if (!userId) throw new Error('Missing userId')
  if (typeof amount !== 'number' || Number.isNaN(amount)) throw new Error('Invalid amount')
  if (!source) throw new Error('Missing source')
  if (!date) throw new Error('Missing date')

  return addDoc(incomesCol, {
    userId,
    amount,
    source,
    date,
    note,
    createdAt: serverTimestamp(),
  })
}

async function getUserIncomes(userId) {
  if (!userId) return []

  const q = query(incomesCol, where('userId', '==', userId), orderBy('date', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

function subscribeToIncomes(userId, onChange, onError) {
  if (!userId) {
    onChange([])
    return () => {}
  }

  const q = query(incomesCol, where('userId', '==', userId), orderBy('date', 'desc'))
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

async function deleteIncome(incomeId) {
  if (!incomeId) throw new Error('Missing incomeId')
  return deleteDoc(doc(db, 'incomes', incomeId))
}

async function updateIncome(incomeId, updatedData) {
  const { userId, amount, source, date, note = '' } = updatedData || {}

  if (!incomeId) throw new Error('Missing incomeId')
  if (!userId) throw new Error('Missing userId')
  if (typeof amount !== 'number' || Number.isNaN(amount)) throw new Error('Invalid amount')
  if (!source) throw new Error('Missing source')
  if (!date) throw new Error('Missing date')

  return updateDoc(doc(db, 'incomes', incomeId), {
    userId,
    amount,
    source,
    date,
    note,
  })
}

export { addIncome, getUserIncomes, subscribeToIncomes, deleteIncome, updateIncome }


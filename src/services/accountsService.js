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

const COLLECTION = 'accounts'

export function addAccount({ userId, name, type, balance, note = '' }) {
  if (!userId) throw new Error('User ID is required')
  if (!name?.trim()) throw new Error('Account name is required')
  const types = ['bank', 'cash', 'wallet', 'savings', 'investment', 'other']
  if (!types.includes(type)) throw new Error('Invalid account type')

  return addDoc(collection(db, COLLECTION), {
    userId,
    name: name.trim(),
    type,
    balance: Number(balance) || 0,
    note: note.trim(),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export function deleteAccount(accountId) {
  return deleteDoc(doc(db, COLLECTION, accountId))
}

export function updateAccount(accountId, data) {
  return updateDoc(doc(db, COLLECTION, accountId), {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export function subscribeToAccounts(userId, onChange, onError) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const accounts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    onChange(accounts)
  }, onError)
}

export function updateAccountBalance(accountId, newBalance) {
  return updateDoc(doc(db, COLLECTION, accountId), {
    balance: Number(newBalance) || 0,
    updatedAt: Timestamp.now(),
  })
}

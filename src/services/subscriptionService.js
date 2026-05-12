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

const COLLECTION = 'subscriptions'

export function addSubscription({ userId, name, price, renewalDate, accountId, category, note = '', isActive = true }) {
  if (!userId) throw new Error('User ID is required')
  if (!name?.trim()) throw new Error('Subscription name is required')
  if (!price || Number(price) <= 0) throw new Error('Valid price is required')

  return addDoc(collection(db, COLLECTION), {
    userId,
    name: name.trim(),
    price: Number(price),
    renewalDate: renewalDate || null,
    accountId: accountId || null,
    category: category || 'Other',
    note: note.trim(),
    isActive,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export function deleteSubscription(subId) {
  return deleteDoc(doc(db, COLLECTION, subId))
}

export function updateSubscription(subId, data) {
  return updateDoc(doc(db, COLLECTION, subId), {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export function toggleSubscription(subId, isActive) {
  return updateDoc(doc(db, COLLECTION, subId), {
    isActive,
    updatedAt: Timestamp.now(),
  })
}

export function subscribeToSubscriptions(userId, onChange, onError) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const subs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    onChange(subs)
  }, onError)
}

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

function calcNextReminderDate(frequency) {
  const now = new Date()
  switch (frequency) {
    case 'daily': now.setDate(now.getDate() + 1); break
    case 'weekly': now.setDate(now.getDate() + 7); break
    case 'monthly': now.setMonth(now.getMonth() + 1); break
  }
  now.setHours(8, 0, 0, 0)
  return Timestamp.fromDate(now)
}

export function addSubscription({ userId, name, price, renewalDate, accountId, category, note = '', isActive = true, savingAmount = '', savingFrequency = '' }) {
  if (!userId) throw new Error('User ID is required')
  if (!name?.trim()) throw new Error('Subscription name is required')
  if (!price || Number(price) <= 0) throw new Error('Valid price is required')

  const freq = ['daily', 'weekly', 'monthly'].includes(savingFrequency) ? savingFrequency : ''
  const nextReminder = freq && savingAmount ? calcNextReminderDate(freq) : null

  return addDoc(collection(db, COLLECTION), {
    userId,
    name: name.trim(),
    price: Number(price),
    renewalDate: renewalDate || null,
    accountId: accountId || null,
    category: category || 'Other',
    note: note.trim(),
    isActive,
    savingAmount: savingAmount ? Number(savingAmount) : 0,
    savingFrequency: freq,
    nextReminderDate: nextReminder,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export function deleteSubscription(subId) {
  return deleteDoc(doc(db, COLLECTION, subId))
}

export function updateSubscription(subId, data) {
  const updated = { ...data, updatedAt: Timestamp.now() }
  if (data.savingFrequency !== undefined || data.savingAmount !== undefined) {
    const freq = data.savingFrequency
    const amt = data.savingAmount
    if (freq && amt) {
      updated.nextReminderDate = calcNextReminderDate(freq)
    } else {
      updated.nextReminderDate = null
    }
  }
  return updateDoc(doc(db, COLLECTION, subId), updated)
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

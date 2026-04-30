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
  writeBatch,
  limit,
} from 'firebase/firestore'

const notificationsCol = collection(db, 'notifications')

/**
 * Notification types:
 * - 'warning': Budget exceeded, overspending
 * - 'info': General updates, reports
 * - 'success': Income added, goals achieved
 * - 'error': Critical issues
 */

/**
 * Add a new notification
 */
export async function addNotification({
  userId,
  message,
  type = 'info',
  title = '',
  metadata = {},
}) {
  if (!userId) throw new Error('Missing userId')
  if (!message) throw new Error('Missing message')

  return await addDoc(notificationsCol, {
    userId,
    title,
    message,
    type,
    metadata,
    read: false,
    createdAt: serverTimestamp(),
  })
}

/**
 * Subscribe to user notifications (real-time)
 */
export function subscribeToNotifications(userId, onChange, onError, maxResults = 20) {
  if (!userId) {
    onChange([])
    return () => {}
  }

  const q = query(
    notificationsCol,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  )

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
      onChange(notifications)
    },
    (err) => {
      if (onError) onError(err)
    }
  )
}

/**
 * Mark a single notification as read
 */
export async function markAsRead(notificationId) {
  if (!notificationId) throw new Error('Missing notificationId')
  return await updateDoc(doc(db, 'notifications', notificationId), {
    read: true,
  })
}

/**
 * Mark all user notifications as read
 */
export async function markAllAsRead(userId) {
  if (!userId) throw new Error('Missing userId')

  const q = query(
    notificationsCol,
    where('userId', '==', userId),
    where('read', '==', false)
  )

  const snapshot = await new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(q, resolve, reject)
    // Clean up immediately after getting the snapshot
    setTimeout(() => unsubscribe(), 100)
  })

  if (snapshot.empty) return

  const batch = writeBatch(db)
  snapshot.docs.forEach((document) => {
    batch.update(document.ref, { read: true })
  })

  return await batch.commit()
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId) {
  if (!notificationId) throw new Error('Missing notificationId')
  return await deleteDoc(doc(db, 'notifications', notificationId))
}

/**
 * Delete all user notifications
 */
export async function deleteAllNotifications(userId) {
  if (!userId) throw new Error('Missing userId')

  const q = query(notificationsCol, where('userId', '==', userId))

  const snapshot = await new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(q, resolve, reject)
    setTimeout(() => unsubscribe(), 100)
  })

  if (snapshot.empty) return

  const batch = writeBatch(db)
  snapshot.docs.forEach((document) => {
    batch.delete(document.ref)
  })

  return await batch.commit()
}

/**
 * Helper: Check if notification already exists (prevent duplicates)
 */
export async function notificationExists(userId, message, withinMinutes = 60) {
  const cutoffTime = new Date()
  cutoffTime.setMinutes(cutoffTime.getMinutes() - withinMinutes)

  const q = query(
    notificationsCol,
    where('userId', '==', userId),
    where('message', '==', message),
    orderBy('createdAt', 'desc'),
    limit(1)
  )

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        unsubscribe()
        if (snapshot.empty) {
          resolve(false)
        } else {
          const notification = snapshot.docs[0].data()
          const createdAt = notification.createdAt?.toDate()
          resolve(createdAt && createdAt > cutoffTime)
        }
      },
      (err) => {
        unsubscribe()
        reject(err)
      }
    )
  })
}

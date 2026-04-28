import { db } from '../firebase.js'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

export async function ensureUserDoc(user) {
  if (!user?.uid) return
  const ref = doc(db, 'users', user.uid)
  await setDoc(
    ref,
    {
      userId: user.uid,
      email: user.email ?? null,
      isAnonymous: Boolean(user.isAnonymous),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )
}


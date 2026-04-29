import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase.js'

function getAuthErrorMessage(error, context = 'auth') {
  const code = error?.code || ''

  const map = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account is disabled. Contact support.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'This email is already in use. Try signing in instead.',
    'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
    'auth/popup-closed-by-user': 'Google sign-in was closed. Please try again.',
    'auth/cancelled-popup-request': 'Google sign-in was cancelled. Please try again.',
  }

  if (map[code]) return map[code]
  if (context === 'google') return 'Google sign-in failed. Please try again.'
  return 'Authentication failed. Please try again.'
}

async function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

async function logout() {
  return signOut(auth)
}

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  return signInWithPopup(auth, provider)
}

export { signup, login, logout, signInWithGoogle, getAuthErrorMessage }


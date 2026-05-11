import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
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
    'auth/unauthorized-domain': 'This domain is not authorized. Please add your domain to Firebase authorized domains.',
    'auth/operation-not-allowed': 'Google sign-in is not enabled. Please enable it in Firebase Console.',
    'auth/popup-blocked': 'Popup was blocked by browser. Please allow popups and try again.',
    'auth/invalid-api-key': 'Invalid Firebase API key. Check your environment variables.',
    'auth/app-not-authorized': 'App not authorized to use Firebase Authentication. Check your Firebase config.',
  }

  if (map[code]) return map[code]
  
  // Show the actual error code for debugging
  if (context === 'google') {
    return code ? `Google sign-in failed: ${code}` : 'Google sign-in failed. Please try again.'
  }
  
  return code ? `Authentication failed: ${code}` : 'Authentication failed. Please try again.'
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
  // Add common scopes if needed
  provider.addScope('profile')
  provider.addScope('email')
  return signInWithPopup(auth, provider)
}

async function resetPassword(email) {
  return sendPasswordResetEmail(auth, email)
}

export { signup, login, logout, signInWithGoogle, resetPassword, getAuthErrorMessage }


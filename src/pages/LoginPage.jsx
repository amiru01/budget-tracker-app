import React from 'react'
import { Navigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { auth } from '../firebase.js'

function getAuthMessage(error, context = 'auth') {
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
  }

  if (map[code]) return map[code]
  if (context === 'reset') return 'Could not send reset email. Please try again.'
  return 'Authentication failed. Please try again.'
}

function LoginPage() {
  const [user, setUser] = React.useState(() => auth.currentUser)
  const [mode, setMode] = React.useState('signin')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [toast, setToast] = React.useState({ show: false, type: 'success', message: '' })

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((nextUser) => setUser(nextUser))
    return () => unsub()
  }, [])

  React.useEffect(() => {
    if (!toast.show) return
    const timer = setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' })
    }, 3200)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (mode === 'signup' && (!firstName.trim() || !lastName.trim())) {
      setError('First name and last name are required for sign up.')
      return
    }

    setIsLoading(true)
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email.trim(), password)
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
        await updateProfile(credential.user, {
          displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
        })
      }
    } catch (err) {
      setError(getAuthMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleForgotPassword() {
    setError('')
    if (!email.trim()) {
      setToast({
        show: true,
        type: 'error',
        message: 'Enter your email first, then tap forgot password.',
      })
      return
    }

    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setToast({
        show: true,
        type: 'success',
        message: 'Password reset email sent. Check your inbox.',
      })
    } catch (err) {
      setToast({
        show: true,
        type: 'error',
        message: getAuthMessage(err, 'reset'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (user) return <Navigate to="/dashboard" replace />

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-medium text-slate-500">Smart Finance</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          {mode === 'signin' ? 'Sign in to your dashboard' : 'Create your account'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Use your email and password to continue.
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError('')
              setShowPassword(false)
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError('')
              setShowPassword(false)
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === 'signup' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">First name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  placeholder="John"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Last name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  placeholder="Doe"
                />
              </label>
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <div className="mt-2 flex rounded-xl bg-white ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-300">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full rounded-l-xl bg-transparent px-3 py-2 text-sm focus:outline-none"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-r-xl px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>

          {mode === 'signin' ? (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Forgot password?
            </button>
          ) : null}
        </form>

        {error ? (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
            {error}
          </div>
        ) : null}

        {toast.show ? (
          <div
            className={`mt-4 rounded-xl p-3 text-sm font-medium ring-1 ${
              toast.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                : 'bg-rose-50 text-rose-700 ring-rose-100'
            }`}
          >
            {toast.message}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default LoginPage


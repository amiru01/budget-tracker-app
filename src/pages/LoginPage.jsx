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
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-border-subtle bg-white/[0.06] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
        <p className="section-kicker">Smart Finance</p>
        <h1 className="font-display mt-3 text-3xl font-extrabold tracking-[-0.025em] text-ink">
          {mode === 'signin' ? 'Open your workspace' : 'Create your workspace'}
        </h1>
        <p className="mt-3 text-sm font-medium leading-6 text-ink-secondary">
          Continue to your focused dashboard for income, spending, budgets, and reports.
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-surface p-1 ring-1 ring-border-subtle">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError('')
              setShowPassword(false)
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-ink-secondary hover:text-ink'
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
              mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          {mode === 'signup' ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-ink-secondary">First name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  className="mt-2 w-full rounded-xl bg-slate-950/50 px-3 py-2 text-sm font-medium text-ink ring-1 ring-border-subtle placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Maya"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-ink-secondary">Last name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  className="mt-2 w-full rounded-xl bg-slate-950/50 px-3 py-2 text-sm font-medium text-ink ring-1 ring-border-subtle placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Patel"
                />
              </label>
            </div>
          ) : null}

          <label className="block">
            <span className="text-sm font-bold text-ink-secondary">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-2 w-full rounded-xl bg-slate-950/50 px-3 py-2 text-sm font-medium text-ink ring-1 ring-border-subtle placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="name@company.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-ink-secondary">Password</span>
            <div className="mt-2 flex rounded-xl bg-surface-secondary ring-1 ring-border-subtle focus-within:ring-2 focus-within:ring-emerald-500">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full rounded-l-xl bg-transparent px-3 py-2 text-sm font-medium text-ink placeholder:text-slate-600 focus:outline-none"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-r-xl px-3 text-xs font-bold text-ink-secondary transition hover:bg-surface-secondary hover:text-ink"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-extrabold text-white transition hover:from-emerald-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Please wait...' : mode === 'signin' ? 'Open dashboard' : 'Create workspace'}
          </button>

          {mode === 'signin' ? (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="w-full rounded-xl bg-surface-secondary px-4 py-2.5 text-sm font-bold text-ink-secondary ring-1 ring-border-subtle transition hover:bg-surface-elevated disabled:cursor-not-allowed disabled:opacity-60"
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

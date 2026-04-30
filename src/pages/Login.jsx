import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getAuthErrorMessage, login, signInWithGoogle } from '../services/authService.js'

function Login() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (loading) return
    if (user) navigate('/dashboard', { replace: true })
  }, [loading, user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Email is required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsLoading(true)
    try {
      await login(trimmedEmail, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setIsLoading(true)
    try {
      await signInWithGoogle()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getAuthErrorMessage(err, 'google'))
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4 py-10">
        <div className="rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          Loading Smart Finance…
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-4 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 sm:p-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-14 w-14">
              <ellipse cx="256" cy="280" rx="140" ry="110" fill="#ffffff" opacity="0.9"/>
              <ellipse cx="220" cy="250" rx="40" ry="30" fill="#ffffff" opacity="0.4"/>
              <rect x="236" y="190" width="40" height="8" rx="4" fill="#0f172a"/>
              <g transform="translate(256, 160)">
                <circle cx="0" cy="0" r="24" fill="#fbbf24"/>
                <circle cx="0" cy="0" r="18" fill="#f59e0b"/>
                <text x="0" y="8" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#0f172a" textAnchor="middle">$</text>
              </g>
              <line x1="230" y1="140" x2="220" y2="150" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <line x1="282" y1="140" x2="292" y2="150" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <ellipse cx="180" cy="240" rx="20" ry="35" fill="#d1fae5" transform="rotate(-20 180 240)"/>
              <ellipse cx="380" cy="280" rx="35" ry="30" fill="#d1fae5"/>
              <circle cx="370" cy="275" r="6" fill="#0f172a"/>
              <circle cx="370" cy="290" r="6" fill="#0f172a"/>
              <circle cx="300" cy="250" r="12" fill="#0f172a"/>
              <circle cx="303" cy="247" r="5" fill="#ffffff"/>
              <rect x="200" y="360" width="25" height="40" rx="12" fill="#d1fae5"/>
              <rect x="260" y="360" width="25" height="40" rx="12" fill="#d1fae5"/>
              <rect x="287" y="360" width="25" height="40" rx="12" fill="#d1fae5"/>
              <path d="M 140 290 Q 120 280, 110 290 T 95 300" stroke="#d1fae5" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <circle cx="220" cy="130" r="3" fill="#fbbf24"/>
              <circle cx="295" cy="125" r="3" fill="#fbbf24"/>
            </svg>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-slate-500">Smart Finance</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Login</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to view your dashboard.</p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Please wait…' : 'Continue with Google'}
          </button>
        </div>

        <div className="mt-5">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="rounded-full bg-white px-3 text-xs font-medium text-slate-500">or</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                autoComplete="current-password"
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
            {isLoading ? 'Signing in…' : 'Login'}
          </button>

          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">New to Smart Finance?</p>
            <Link to="/signup" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700">
              Create an account
            </Link>
          </div>
        </form>

        {error ? (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
            {error}
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default Login


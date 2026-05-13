import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { subscribeToSubscriptions, addSubscription, deleteSubscription, toggleSubscription, updateSubscription } from '../services/subscriptionService.js'
import { subscribeToAccounts } from '../services/accountsService.js'
import SubscriptionModal from '../components/SubscriptionModal.jsx'
import { quickFade, badgePop } from '../utils/animations.js'

export default function Subscriptions() {
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const [subs, setSubs] = React.useState([])
  const [accounts, setAccounts] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(null)

  React.useEffect(() => {
    if (!user?.uid) return
    const unsubs = [
      subscribeToSubscriptions(user.uid, (data) => { setSubs(data); setLoading(false) }, (err) => { setError(err.message); setLoading(false) }),
      subscribeToAccounts(user.uid, setAccounts, console.error),
    ]
    return () => unsubs.forEach((u) => u())
  }, [user?.uid])

  const activeSubs = React.useMemo(() => subs.filter((s) => s.isActive), [subs])
  const monthlyTotal = React.useMemo(() => activeSubs.reduce((s, sub) => s + (sub.price || 0), 0), [activeSubs])

  const now = new Date()
  const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().split('T')[0]

  const dueToday = React.useMemo(() => {
    return activeSubs.filter((s) => s.renewalDate && s.renewalDate === todayStr)
  }, [activeSubs, todayStr])

  const overdue = React.useMemo(() => {
    return activeSubs.filter((s) => s.renewalDate && s.renewalDate < todayStr)
  }, [activeSubs, todayStr])

  const upcomingPayments = React.useMemo(() => {
    return activeSubs
      .filter((s) => s.renewalDate && s.renewalDate >= todayStr)
      .map((s) => ({ ...s, renewal: new Date(s.renewalDate) }))
      .sort((a, b) => a.renewal - b.renewal)
      .slice(0, 6)
  }, [activeSubs, todayStr])

  const grouped = React.useMemo(() => {
    const map = {}
    activeSubs.forEach((s) => {
      const cat = s.category || 'Other'
      if (!map[cat]) map[cat] = { count: 0, total: 0 }
      map[cat].count++; map[cat].total += s.price || 0
    })
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total)
  }, [activeSubs])

  async function handleAdd(data) { await addSubscription({ userId: user.uid, ...data }) }
  async function handleUpdate(data) { if (editing) await updateSubscription(editing.id, data) }

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
      <div className="dashboard-card px-4 py-3 text-sm font-bold text-ink-secondary">Loading subscriptions…</div>
    </div>
  }

  const subColors = ['bg-cyan-400/10 text-cyan-300 ring-cyan-400/20', 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20', 'bg-purple-400/10 text-purple-300 ring-purple-400/20', 'bg-amber-400/10 text-amber-300 ring-amber-400/20', 'bg-rose-400/10 text-rose-300 ring-rose-400/20', 'bg-sky-400/10 text-sky-300 ring-sky-400/20']

  return (
    <div className="space-y-6">
      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0 }}>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-tertiary">Finance OS</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Subscriptions</h1>
            <p className="mt-1 text-sm text-ink-secondary">Track and manage your recurring subscriptions.</p>
          </div>
          <button type="button" onClick={() => { setEditing(null); setIsModalOpen(true) }} className="brand-button px-4 py-2 text-sm">+ Add Subscription</button>
        </header>
      </motion.div>

      {error ? <motion.div {...quickFade} className="rounded-xl bg-rose-400/10 p-4 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20">{error}</motion.div> : null}

      {dueToday.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-amber-400/10 p-4 ring-1 ring-amber-400/20">
          <div className="flex items-start gap-3">
            <span className="text-xl">🔔</span>
            <div>
              <p className="text-sm font-semibold text-amber-600">Payment{dueToday.length > 1 ? 's' : ''} due today</p>
              <p className="mt-1 text-sm text-amber-300">{dueToday.map((s) => `${s.name} (${formatCurrency(s.price)})`).join(', ')}</p>
            </div>
          </div>
        </motion.div>
      )}

      {overdue.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-rose-400/10 p-4 ring-1 ring-rose-400/20">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-rose-600">{overdue.length} overdue subscription{overdue.length > 1 ? 's' : ''}</p>
              <p className="mt-1 text-sm text-rose-300">{overdue.map((s) => `${s.name} — was due ${new Date(s.renewalDate).toLocaleDateString()}`).join(', ')}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.1 }} className="dashboard-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Active Subs</p>
          <p className="font-display mt-2 text-3xl font-extrabold text-ink">{activeSubs.length}</p>
        </motion.div>
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.13 }} className="dashboard-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Monthly Cost</p>
          <p className="font-display mt-2 text-3xl font-extrabold text-cyan-400">{formatCurrency(monthlyTotal)}</p>
        </motion.div>
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.16 }} className="dashboard-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Yearly Cost</p>
          <p className="font-display mt-2 text-3xl font-extrabold text-amber-400">{formatCurrency(monthlyTotal * 12)}</p>
        </motion.div>
      </div>

      {upcomingPayments.length > 0 && (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.18 }} className="dashboard-card p-6">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">Upcoming Renewals</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingPayments.map((sub) => (
              <div key={sub.id} className="dashboard-panel flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-ink">{sub.name}</p>
                  <p className="text-xs text-ink-secondary">Renews {sub.renewal.toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-ink">{formatCurrency(sub.price)}<span className="text-xs text-ink-secondary">/mo</span></p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.2 }} className="dashboard-card p-6 lg:col-span-3">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">All Subscriptions</h2>
          <p className="mt-1 text-sm text-ink-secondary">{subs.length} total &middot; {activeSubs.length} active</p>
          <div className="mt-4 space-y-3">
            {subs.length === 0 ? (
              <p className="text-sm text-ink-tertiary py-4">No subscriptions yet. Add your first one.</p>
            ) : subs.map((sub, idx) => (
              <motion.div key={sub.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + idx * 0.03, duration: 0.2 }}
                className="dashboard-card flex items-center justify-between p-4 transition hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold text-ink">{sub.name}</p>
                    <p className="text-xs text-ink-secondary">{sub.category}{sub.renewalDate ? ` · Renews ${new Date(sub.renewalDate).toLocaleDateString()}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                <p className="font-bold text-ink">{formatCurrency(sub.price)}<span className="text-xs text-ink-secondary">/mo</span></p>
                    {!sub.isActive && <span className="text-xs text-ink-tertiary">Inactive</span>}
                  </div>
                  <button type="button" onClick={() => toggleSubscription(sub.id, !sub.isActive)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 transition ${sub.isActive ? 'bg-amber-400/10 text-amber-300 ring-amber-400/20' : 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20'}`}>
                    {sub.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button type="button" onClick={() => { setEditing(sub); setIsModalOpen(true) }}
                    className="rounded-lg bg-sky-400/10 px-2.5 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/20 hover:bg-sky-400/20">Edit</button>
                  <button type="button" onClick={async () => { if (confirm(`Delete ${sub.name}?`)) await deleteSubscription(sub.id) }}
                    className="rounded-lg bg-rose-400/10 px-2.5 py-1 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-400/20">Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.22 }} className="dashboard-card p-6 lg:col-span-1">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">By Category</h2>
          <div className="mt-4 space-y-3">
            {grouped.map(([cat, info]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-secondary">{cat}</span>
                  <span className="text-ink font-semibold">{formatCurrency(info.total)}</span>
                </div>
                <p className="text-xs text-ink-tertiary">{info.count} service{info.count > 1 ? 's' : ''}</p>
              </div>
            ))}
            {grouped.length === 0 && <p className="text-sm text-ink-tertiary">No active subscriptions.</p>}
          </div>
        </motion.div>
      </div>

      <SubscriptionModal open={isModalOpen} onClose={() => { setIsModalOpen(false); setEditing(null) }}
        onSubmit={editing ? handleUpdate : handleAdd} accounts={accounts} initial={editing} />
    </div>
  )
}

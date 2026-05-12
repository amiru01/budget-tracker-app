import React from 'react'
import { motion } from 'framer-motion'
import { modalOverlay, modalContent } from '../utils/animations.js'

const CATEGORIES = ['Entertainment', 'Productivity', 'Cloud', 'Design', 'Music', 'News', 'Health', 'Food', 'Other']

export default function SubscriptionModal({ open, onClose, onSubmit, accounts = [], initial = null }) {
  const [name, setName] = React.useState('')
  const [price, setPrice] = React.useState('')
  const [renewalDate, setRenewalDate] = React.useState('')
  const [category, setCategory] = React.useState('Other')
  const [accountId, setAccountId] = React.useState('')
  const [isActive, setIsActive] = React.useState(true)
  const [note, setNote] = React.useState('')
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    if (initial) {
      setName(initial.name || '')
      setPrice(String(initial.price || ''))
      setRenewalDate(initial.renewalDate || '')
      setCategory(initial.category || 'Other')
      setAccountId(initial.accountId || '')
      setIsActive(initial.isActive ?? true)
      setNote(initial.note || '')
    } else {
      setName(''); setPrice(''); setRenewalDate(''); setCategory('Other'); setAccountId(''); setIsActive(true); setNote('')
    }
    setError('')
  }, [open, initial])

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    if (!name.trim()) { setError('Enter a subscription name'); return }
    if (!price || Number(price) <= 0) { setError('Enter a valid monthly price'); return }
    setSaving(true)
    try {
      await onSubmit({ name: name.trim(), price: Number(price), renewalDate, category, accountId: accountId || null, isActive, note: note.trim() })
      onClose()
    } catch (err) { setError(err?.message || 'Failed to save subscription')
    } finally { setSaving(false) }
  }

  if (!open) return null

  return (
    <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label="Close" />
      <motion.div {...modalContent} className="dashboard-card relative w-full max-w-md p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-white">{initial ? 'Edit Subscription' : 'Add Subscription'}</h3>
          <p className="mt-1 text-sm text-slate-400">Track a recurring subscription or service.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-300">Service Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Netflix" maxLength={50}
                className="dashboard-input mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Monthly Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} step="0.01" min="0" placeholder="9.99"
                className="dashboard-input mt-2" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-300">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="dashboard-input mt-2">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Renewal Date</label>
              <input type="date" value={renewalDate} onChange={(e) => setRenewalDate(e.target.value)} className="dashboard-input mt-2" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300">Payment Account <span className="text-xs font-normal text-slate-500">(optional)</span></label>
            <select value={accountId} onChange={(e) => setAccountId(e.target.value)} className="dashboard-input mt-2">
              <option value="">No account linked</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.type})</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-300">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Annual plan" maxLength={100} className="dashboard-input mt-2" />
          </div>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-400 bg-slate-800" />
            <span className="text-sm font-semibold text-slate-300">Active subscription</span>
          </label>
          {error ? <div className="rounded-xl bg-rose-400/10 p-3 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20">{error}</div> : null}
          <button type="submit" disabled={saving} className="brand-button w-full px-4 py-2.5 text-sm font-bold">
            {saving ? 'Saving...' : initial ? 'Update Subscription' : 'Add Subscription'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

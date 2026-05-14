import React from 'react'
import { motion } from 'framer-motion'
import { modalOverlay, modalContent } from '../utils/animations.js'

const ACCOUNT_TYPES = [
  { value: 'bank', label: 'Bank Account', icon: '🏦' },
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'wallet', label: 'Wallet', icon: '👛' },
  { value: 'savings', label: 'Savings', icon: '💰' },
  { value: 'investment', label: 'Investment', icon: '📈' },
  { value: 'other', label: 'Other', icon: '📦' },
]

export default function AccountModal({ open, onClose, onSubmit, initial = null }) {
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState('bank')
  const [balance, setBalance] = React.useState('')
  const [note, setNote] = React.useState('')
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    if (initial) {
      setName(initial.name || '')
      setType(initial.type || 'bank')
      setBalance(String(initial.balance || ''))
      setNote(initial.note || '')
    } else {
      setName(''); setType('bank'); setBalance(''); setNote('')
    }
    setError('')
  }, [open, initial])

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    if (!name.trim()) { setError('Enter an account name'); return }
    if (!balance || Number(balance) < 0) { setError('Enter a valid balance'); return }
    setSaving(true)
    try {
      await onSubmit({ name: name.trim(), type, balance: Number(balance), note: note.trim() })
      onClose()
    } catch (err) { setError(err?.message || 'Failed to save account')
    } finally { setSaving(false) }
  }

  if (!open) return null

  return (
    <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-label="Close" />
      <motion.div {...modalContent} className="dashboard-card relative w-full max-w-md p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-ink">{initial ? 'Edit Account' : 'Add Account'}</h3>
          <p className="mt-1 text-sm text-ink-secondary">Track a bank account, cash, wallet, or savings.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink-secondary">Account Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Main Checking" maxLength={50}
              className="dashboard-input mt-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-secondary">Account Type</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {ACCOUNT_TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className={`rounded-xl p-3 text-center text-xs font-semibold transition ring-1 ${type === t.value ? 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/20' : 'bg-surface-secondary text-ink-secondary ring-border-subtle hover:bg-surface-elevated'}`}
                >
                  <span className="block text-lg">{t.icon}</span>
                  <span className="mt-1 block">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-secondary">Current Balance</label>
            <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} step="1" min="0" placeholder="0.00"
              className="dashboard-input mt-2" />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-secondary">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Joint account" maxLength={100}
              className="dashboard-input mt-2" />
          </div>
          {error ? <div className="rounded-xl bg-rose-400/10 p-3 text-sm font-medium text-rose-600 ring-1 ring-rose-400/20">❌ {error}</div> : null}
          <button type="submit" disabled={saving}
            className="brand-button w-full px-4 py-2.5 text-sm font-bold transition-all duration-300">
            {saving ? 'Saving...' : initial ? 'Update Account' : 'Add Account'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

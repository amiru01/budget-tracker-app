import React from 'react'
import { motion } from 'framer-motion'
import { modalOverlay, modalContent } from '../utils/animations.js'

const CATEGORIES = ['Credit Card', 'Student Loan', 'Mortgage', 'Car Loan', 'Medical', 'Personal Loan', 'Business', 'Other']
const FREQUENCIES = ['daily', 'weekly', 'monthly']

export default function DebtModal({ open, onClose, onSubmit, initial = null }) {
  const [name, setName] = React.useState('')
  const [totalAmount, setTotalAmount] = React.useState('')
  const [remainingBalance, setRemainingBalance] = React.useState('')
  const [interestRate, setInterestRate] = React.useState('')
  const [dueDate, setDueDate] = React.useState('')
  const [category, setCategory] = React.useState('Other')
  const [frequency, setFrequency] = React.useState('monthly')
  const [priority, setPriority] = React.useState('0')
  const [note, setNote] = React.useState('')
  const [error, setError] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    if (initial) {
      setName(initial.name || '')
      setTotalAmount(String(initial.totalAmount || ''))
      setRemainingBalance(String(initial.remainingBalance || initial.totalAmount || ''))
      setInterestRate(String(initial.interestRate || ''))
      setDueDate(initial.dueDate || '')
      setCategory(initial.category || 'Other')
      setFrequency(initial.frequency || 'monthly')
      setPriority(String(initial.priority || '0'))
      setNote(initial.note || '')
    } else {
      setName(''); setTotalAmount(''); setRemainingBalance(''); setInterestRate(''); setDueDate('')
      setCategory('Other'); setFrequency('monthly'); setPriority('0'); setNote('')
    }
    setError('')
  }, [open, initial])

  async function handleSubmit(e) {
    e.preventDefault(); setError('')
    if (!name.trim()) { setError('Enter a debt name'); return }
    if (!totalAmount || Number(totalAmount) <= 0) { setError('Enter a valid total amount'); return }
    setSaving(true)
    try {
      await onSubmit({
        name: name.trim(),
        totalAmount: Number(totalAmount),
        remainingBalance: remainingBalance ? Number(remainingBalance) : Number(totalAmount),
        interestRate: Number(interestRate) || 0,
        dueDate,
        category,
        frequency,
        priority: Number(priority) || 0,
        note: note.trim(),
      })
      onClose()
    } catch (err) { setError(err?.message || 'Failed to save debt')
    } finally { setSaving(false) }
  }

  if (!open) return null

  return (
    <motion.div {...modalOverlay} className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" aria-label="Close" />
      <motion.div {...modalContent} className="dashboard-card relative w-full max-w-md p-6 shadow-xl">
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-white">{initial ? 'Edit Debt' : 'Add Debt'}</h3>
          <p className="mt-1 text-sm text-slate-400">Track and manage your debt payoff plan.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-300">Debt Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Visa Card" maxLength={50} className="dashboard-input mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="dashboard-input mt-2">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-300">Total Amount ($)</label>
              <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} step="0.01" min="0" placeholder="5000" className="dashboard-input mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Remaining Balance ($)</label>
              <input type="number" value={remainingBalance} onChange={(e) => setRemainingBalance(e.target.value)} step="0.01" min="0" placeholder={totalAmount || '5000'} className="dashboard-input mt-2" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-300">Interest Rate (%)</label>
              <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} step="0.1" min="0" placeholder="5.0" className="dashboard-input mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="dashboard-input mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Payment Freq.</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="dashboard-input mt-2">
                {FREQUENCIES.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-300">Priority (0 = highest)</label>
              <input type="number" value={priority} onChange={(e) => setPriority(e.target.value)} min="0" max="99" placeholder="0" className="dashboard-input mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-300">Note</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional notes" maxLength={100} className="dashboard-input mt-2" />
            </div>
          </div>
          {error ? <div className="rounded-xl bg-rose-400/10 p-3 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20">{error}</div> : null}
          <button type="submit" disabled={saving} className="brand-button w-full px-4 py-2.5 text-sm font-bold">
            {saving ? 'Saving...' : initial ? 'Update Debt' : 'Add Debt'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

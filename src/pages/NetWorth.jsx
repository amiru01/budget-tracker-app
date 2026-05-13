import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { subscribeToAccounts, deleteAccount } from '../services/accountsService.js'
import { subscribeToIncomes } from '../services/incomeService.js'
import { subscribeToExpenses } from '../services/expenseService.js'
import AddIncomeModal from '../components/AddIncomeModal.jsx'
import IncomeItem from '../components/IncomeItem.jsx'
import { quickFade } from '../utils/animations.js'

export default function NetWorth() {
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const [accounts, setAccounts] = React.useState([])
  const [incomes, setIncomes] = React.useState([])
  const [expenses, setExpenses] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [isIncomeModalOpen, setIsIncomeModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (!user?.uid) return
    const unsubs = [
      subscribeToAccounts(user.uid, (data) => { setAccounts(data); setLoading(false) }, (err) => { setError(err.message); setLoading(false) }),
      subscribeToIncomes(user.uid, (data) => setIncomes(data), console.error),
      subscribeToExpenses(user.uid, (data) => setExpenses(data), console.error),
    ]
    return () => unsubs.forEach((u) => u())
  }, [user?.uid])

  const totalBalance = React.useMemo(() => accounts.reduce((s, a) => s + (a.balance || 0), 0), [accounts])
  const totalIncome = React.useMemo(() => incomes.reduce((s, i) => s + (i.amount || 0), 0), [incomes])
  const totalExpenses = React.useMemo(() => expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses])
  const netWorth = totalBalance - totalExpenses

  async function handleDeleteAccount(id) {
    if (!confirm('Delete this account?')) return
    await deleteAccount(id)
  }

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
      <div className="dashboard-card px-4 py-3 text-sm font-bold text-ink-secondary">Loading accounts…</div>
    </div>
  }

  const grouped = {
    bank: accounts.filter((a) => a.type === 'bank'),
    cash: accounts.filter((a) => a.type === 'cash'),
    wallet: accounts.filter((a) => a.type === 'wallet'),
    savings: accounts.filter((a) => a.type === 'savings'),
    investment: accounts.filter((a) => a.type === 'investment'),
    other: accounts.filter((a) => a.type === 'other'),
  }

  return (
    <div className="space-y-6">
      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0 }}>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-tertiary">Finance OS</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink sm:text-4xl">Net Worth</h1>
            <p className="mt-1 text-sm text-ink-secondary">Track your accounts, income, and total net worth.</p>
          </div>
          <button type="button" onClick={() => setIsIncomeModalOpen(true)} className="brand-button px-4 py-2 text-sm">+ Add Income</button>
        </header>
      </motion.div>

      {error ? <motion.div {...quickFade} className="rounded-xl bg-rose-400/10 p-4 text-sm font-medium text-rose-300 ring-1 ring-rose-400/20">{error}</motion.div> : null}

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.1 }}>
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <article className="dashboard-card p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Total Balance</p>
            <p className="font-display mt-2 text-2xl font-extrabold text-ink">{formatCurrency(totalBalance)}</p></article>
          <article className="dashboard-card p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Total Income</p>
            <p className="font-display mt-2 text-2xl font-extrabold text-emerald-400">{formatCurrency(totalIncome)}</p></article>
          <article className="dashboard-card p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Total Expenses</p>
            <p className="font-display mt-2 text-2xl font-extrabold text-rose-400">{formatCurrency(totalExpenses)}</p></article>
          <article className="dashboard-card p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-secondary">Net Worth</p>
            <p className={`font-display mt-2 text-2xl font-extrabold ${netWorth >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(netWorth)}</p></article>
        </section>
      </motion.div>

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.15 }}>
        <section className="dashboard-card p-6">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">Your Accounts</h2>
          <p className="mt-1 text-sm text-ink-secondary">Manage your bank accounts, cash, wallets, and savings.</p>
          <div className="mt-6 space-y-6">
            {['bank', 'cash', 'wallet', 'savings', 'investment', 'other'].map((type) => {
              const items = grouped[type]
              if (items.length === 0 && type !== 'other') return null
              return (
                <div key={type}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink-tertiary">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((account, idx) => (
                      <motion.div key={account.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.04, duration: 0.2 }}
                        className="dashboard-card group p-4 transition hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-ink">{account.name}</p>
                            <p className="mt-1 text-sm text-ink-secondary">{account.note || `${type.charAt(0).toUpperCase() + type.slice(1)} account`}</p>
                          </div>
                          <p className="text-lg font-bold text-ink">{formatCurrency(account.balance)}</p>
                        </div>
                        <div className="mt-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button type="button" onClick={() => handleDeleteAccount(account.id)}
                            className="rounded-lg bg-rose-400/10 px-2.5 py-1 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/20 hover:bg-rose-400/20">Delete</button>
                        </div>
                      </motion.div>
                    ))}
                    {items.length === 0 && (
                      <p className="col-span-full text-sm text-ink-tertiary py-2">No {type} accounts yet.</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </motion.div>

      {incomes.length > 0 && (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.2 }} className="dashboard-card p-6">
          <h2 className="font-display text-xl font-bold tracking-tight text-ink">Income History</h2>
          <p className="mt-1 text-sm text-ink-secondary">All income entries recorded across the app.</p>
          <div className="mt-4 space-y-2">
            {incomes.slice(0, 10).map((inc) => <IncomeItem key={inc.id} income={inc} />)}
          </div>
        </motion.div>
      )}

      <AddIncomeModal open={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)}
        onSubmit={async (data) => {
          const { addIncome } = await import('../services/incomeService.js')
          await addIncome({ userId: user.uid, ...data })
        }} />
    </div>
  )
}

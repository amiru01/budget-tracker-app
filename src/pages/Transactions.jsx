import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import useFinanceData from '../hooks/useFinanceData.js'
import { subscribeToAccounts } from '../services/accountsService.js'
import TransactionListItem from '../components/TransactionListItem.jsx'
import AddExpenseModal from '../components/AddExpenseModal.jsx'
import AddIncomeModal from '../components/AddIncomeModal.jsx'
import { quickFade, slideIn, badgePop } from '../utils/animations.js'

export default function Transactions() {
  const { user } = useAuth()
  const { formatCurrency } = useCurrency()
  const { incomes, expenses, loading, error, actions } = useFinanceData()
  const [accounts, setAccounts] = React.useState([])
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false)
  const [isIncomeModalOpen, setIsIncomeModalOpen] = React.useState(false)

  React.useEffect(() => {
    if (!user?.uid) return
    const unsub = subscribeToAccounts(user.uid, setAccounts, console.error)
    return unsub
  }, [user?.uid])

  const accountMap = React.useMemo(() => {
    const m = {}
    accounts.forEach((a) => { m[a.id] = a.name })
    return m
  }, [accounts])

  const allTransactions = React.useMemo(() => {
    const incomeTx = incomes.map((i) => ({ ...i, type: 'income', category: i.source }))
    const expenseTx = expenses.map((e) => ({ ...e, type: e.type || 'expense' }))
    return [...incomeTx, ...expenseTx].sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
      return dateB - dateA
    })
  }, [incomes, expenses])

  async function handleDeleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    const t = allTransactions.find((tx) => tx.id === id)
    if (!t) return
    try {
      if (t.type === 'income') await actions.deleteIncome(id)
      else await actions.deleteExpense(id)
    } catch (err) { alert(err?.message || 'Failed to delete transaction') }
  }

  async function handleAddExpense(payload) { await actions.addExpense(payload) }
  async function handleAddIncome(payload) { await actions.addIncome(payload) }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="dashboard-card px-4 py-3 text-sm font-bold text-slate-300">Loading transactions…</div>
      </div>
    )
  }

  const totalIncomeAll = incomes.reduce((s, i) => s + (i.amount || 0), 0)
  const totalExpensesAll = expenses.reduce((s, e) => s + (e.amount || 0), 0)
  const netBalance = totalIncomeAll - totalExpensesAll

  return (
    <div className="space-y-6">
      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0 }}>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Smart Finance</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">Transactions</h1>
            <p className="mt-1 text-sm text-slate-400">Net worth overview with all your income and expense entries.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setIsIncomeModalOpen(true)} className="brand-button px-4 py-2 text-sm">+ Add Income</button>
            <button type="button" onClick={() => setIsExpenseModalOpen(true)} className="button-secondary rounded-xl px-4 py-2 text-sm">+ Add Expense</button>
          </div>
        </header>
      </motion.div>

      {error ? (
        <motion.div {...quickFade} transition={{ delay: 0.08 }} className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-bold text-rose-100 shadow-lg shadow-rose-500/10 backdrop-blur-xl">
          {error}
        </motion.div>
      ) : null}

      <motion.div {...quickFade} transition={{ delay: 0.1 }}>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article className="dashboard-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Total Income</p>
            <p className="font-display mt-2 text-2xl font-extrabold text-emerald-400">{formatCurrency(totalIncomeAll)}</p>
            <p className="mt-1 text-xs text-slate-500">{incomes.length} entries</p>
          </article>
          <article className="dashboard-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Total Expenses</p>
            <p className="font-display mt-2 text-2xl font-extrabold text-rose-400">{formatCurrency(totalExpensesAll)}</p>
            <p className="mt-1 text-xs text-slate-500">{expenses.length} entries</p>
          </article>
          <article className="dashboard-card p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Net Balance</p>
            <p className={`font-display mt-2 text-2xl font-extrabold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(netBalance)}
            </p>
            <p className="mt-1 text-xs text-slate-500">{netBalance >= 0 ? 'Positive' : 'Negative'}</p>
          </article>
        </section>
      </motion.div>

      <motion.div {...quickFade} transition={{ delay: 0.2 }}>
        <section className="dashboard-card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">Transaction History</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-400">All your income and expenses with payment accounts.</p>
            </div>
            <motion.span {...badgePop} className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-slate-200 ring-1 ring-white/10">
              {allTransactions.length} entries
            </motion.span>
          </div>

          <ul className="mt-6 space-y-3">
            {allTransactions.length === 0 ? (
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="rounded-3xl bg-white/6 px-6 py-6 text-center ring-1 ring-white/10 shadow-lg shadow-slate-950/10">
                <div className="mx-auto max-w-sm">
                  <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.45 }} className="text-5xl">📊</motion.p>
                  <p className="mt-4 text-lg font-bold text-white">No entries yet</p>
                  <p className="mt-2 text-sm font-medium text-slate-400">Add your first income or expense to start tracking.</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={() => setIsIncomeModalOpen(true)} className="brand-button px-4 py-2 text-sm">+ Add Income</button>
                    <button type="button" onClick={() => setIsExpenseModalOpen(true)} className="button-secondary rounded-xl px-4 py-2 text-sm">+ Add Expense</button>
                  </div>
                </div>
              </motion.li>
            ) : allTransactions.map((transaction, idx) => (
              <motion.li key={transaction.id} {...slideIn} animate={slideIn.animate(idx)}>
                <TransactionListItem
                  transaction={transaction}
                  onDelete={handleDeleteTransaction}
                  accountName={transaction.accountId ? accountMap[transaction.accountId] : null}
                />
              </motion.li>
            ))}
          </ul>
        </section>
      </motion.div>

      <AddExpenseModal open={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSubmit={handleAddExpense} accounts={accounts} />
      <AddIncomeModal open={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} onSubmit={handleAddIncome} />
    </div>
  )
}

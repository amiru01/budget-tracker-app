import React from 'react'
import { motion } from 'framer-motion'
import useFinanceData from '../hooks/useFinanceData.js'
import SummaryCard from '../components/SummaryCard.jsx'
import TransactionFilters from '../components/TransactionFilters.jsx'
import TransactionListItem from '../components/TransactionListItem.jsx'
import AddExpenseModal from '../components/AddExpenseModal.jsx'
import AddIncomeModal from '../components/AddIncomeModal.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { quickFade, slideIn, badgePop } from '../utils/animations.js'

function isInDateRange(date, range) {
  if (range === 'all') return true
  const transactionDate = date?.toDate ? date.toDate() : new Date(date)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (range) {
    case 'today': return transactionDate >= today
    case 'week': { const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7); return transactionDate >= weekAgo }
    case 'month': { const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); return transactionDate >= monthStart }
    case 'year': { const yearStart = new Date(now.getFullYear(), 0, 1); return transactionDate >= yearStart }
    default: return true
  }
}

export default function Transactions() {
  const { formatCurrency } = useCurrency()
  const { incomes, expenses, totalIncome, totalExpenses, balance, loading, error, actions } = useFinanceData()
  const [activeFilter, setActiveFilter] = React.useState('all')
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [dateRange, setDateRange] = React.useState('all')
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false)
  const [isIncomeModalOpen, setIsIncomeModalOpen] = React.useState(false)

  const allTransactions = React.useMemo(() => {
    const incomeTx = incomes.map((i) => ({ ...i, type: 'income', category: i.source }))
    const expenseTx = expenses.map((e) => ({ ...e, type: e.type || 'expense' }))
    return [...incomeTx, ...expenseTx].sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
      return dateB - dateA
    })
  }, [incomes, expenses])

  const allCategories = React.useMemo(() => {
    const cats = new Set()
    allTransactions.forEach((t) => { if (t.category) cats.add(t.category) })
    return Array.from(cats).sort()
  }, [allTransactions])

  const filteredTransactions = React.useMemo(() => {
    return allTransactions.filter((t) => {
      if (activeFilter !== 'all' && t.type !== activeFilter) return false
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false
      if (!isInDateRange(t.date, dateRange)) return false
      return true
    })
  }, [allTransactions, activeFilter, selectedCategory, dateRange])

  const filteredStats = React.useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0)
    const expense = filteredTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0)
    return { income, expense, balance: income - expense }
  }, [filteredTransactions])

  async function handleDeleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    const t = allTransactions.find((tx) => tx.id === id)
    if (!t) return
    try { if (t.type === 'income') await actions.deleteIncome(id); else await actions.deleteExpense(id) }
    catch (err) { alert(err?.message || 'Failed to delete transaction') }
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

  return (
    <div className="space-y-6">
      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0 }}>
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Smart Finance</p>
            <h1 className="font-display mt-2 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl">Transactions</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setIsIncomeModalOpen(true)} className="brand-button px-4 py-2 text-sm">Add Income</button>
            <button type="button" onClick={() => setIsExpenseModalOpen(true)} className="button-secondary rounded-xl px-4 py-2 text-sm">Add Expense</button>
          </div>
        </header>
      </motion.div>

      {error ? (
        <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.08 }} className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm font-bold text-rose-100 shadow-lg shadow-rose-500/10 backdrop-blur-xl">
          {error}
        </motion.div>
      ) : null}

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: 'Total Income', value: formatCurrency(filteredStats.income), sublabel: `${filteredTransactions.filter((t) => t.type === 'income').length} transactions`, icon: '💰', variant: 'income' },
          { label: 'Total Expenses', value: formatCurrency(filteredStats.expense), sublabel: `${filteredTransactions.filter((t) => t.type === 'expense').length} transactions`, icon: '💸', variant: 'expense' },
          { label: 'Net Balance', value: formatCurrency(filteredStats.balance), sublabel: filteredStats.balance >= 0 ? 'Positive flow' : 'Negative flow', icon: '📊', variant: 'balance' },
        ].map((card, idx) => (
          <motion.div key={card.label} {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.1 + idx * 0.08 }}>
            <SummaryCard {...card} />
          </motion.div>
        ))}
      </section>

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.3 }}>
        <section className="dashboard-card p-6">
          <h2 className="font-display text-xl font-bold tracking-tight text-white">Filters</h2>
          <div className="mt-4">
            <TransactionFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} categories={allCategories} dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>
        </section>
      </motion.div>

      <motion.div {...quickFade} transition={{ ...quickFade.animate.transition, delay: 0.35 }}>
        <section className="dashboard-card p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-white">Transaction History</h2>
              <p className="mt-1 text-sm font-medium leading-6 text-slate-400">All your financial activity in one place</p>
            </div>
            <motion.span {...badgePop} className="rounded-full bg-white/8 px-3 py-1 text-xs font-bold text-slate-200 ring-1 ring-white/10">
              {filteredTransactions.length} items
            </motion.span>
          </div>

          <ul className="mt-6 space-y-3">
            {filteredTransactions.length === 0 ? (
              <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="rounded-3xl bg-white/6 px-6 py-6 text-center ring-1 ring-white/10 shadow-lg shadow-slate-950/10">
                <div className="mx-auto max-w-sm">
                  <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.45 }} className="text-5xl">📊</motion.p>
                  <p className="mt-4 text-lg font-bold text-white">No transactions yet</p>
                  <p className="mt-2 text-sm font-medium text-slate-400">Start tracking your finances by adding your first income or expense.</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button type="button" onClick={() => setIsIncomeModalOpen(true)} className="brand-button px-4 py-2 text-sm">Add Income</button>
                    <button type="button" onClick={() => setIsExpenseModalOpen(true)} className="button-secondary rounded-xl px-4 py-2 text-sm">Add Expense</button>
                  </div>
                </div>
              </motion.li>
            ) : null}

            {filteredTransactions.map((transaction, idx) => (
              <motion.li key={transaction.id} {...slideIn} animate={slideIn.animate(idx)}>
                <TransactionListItem transaction={transaction} onDelete={handleDeleteTransaction} />
              </motion.li>
            ))}
          </ul>
        </section>
      </motion.div>

      <AddExpenseModal open={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} onSubmit={handleAddExpense} />
      <AddIncomeModal open={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} onSubmit={handleAddIncome} />
    </div>
  )
}
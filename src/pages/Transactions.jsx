import React from 'react'
import useFinanceData from '../hooks/useFinanceData.js'
import SummaryCard from '../components/SummaryCard.jsx'
import TransactionFilters from '../components/TransactionFilters.jsx'
import TransactionListItem from '../components/TransactionListItem.jsx'
import AddExpenseModal from '../components/AddExpenseModal.jsx'
import AddIncomeModal from '../components/AddIncomeModal.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'

function isInDateRange(date, range) {
  if (range === 'all') return true
  
  const transactionDate = date?.toDate ? date.toDate() : new Date(date)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (range) {
    case 'today':
      return transactionDate >= today
    case 'week': {
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      return transactionDate >= weekAgo
    }
    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      return transactionDate >= monthStart
    }
    case 'year': {
      const yearStart = new Date(now.getFullYear(), 0, 1)
      return transactionDate >= yearStart
    }
    default:
      return true
  }
}

export default function Transactions() {
  const { formatCurrency } = useCurrency()
  const {
    incomes,
    expenses,
    totalIncome,
    totalExpenses,
    balance,
    loading,
    error,
    actions,
  } = useFinanceData()

  const [activeFilter, setActiveFilter] = React.useState('all')
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [dateRange, setDateRange] = React.useState('all')
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false)
  const [isIncomeModalOpen, setIsIncomeModalOpen] = React.useState(false)

  // Merge and transform transactions
  const allTransactions = React.useMemo(() => {
    const incomeTransactions = incomes.map((income) => ({
      ...income,
      type: 'income',
      category: income.source,
    }))

    const expenseTransactions = expenses.map((expense) => ({
      ...expense,
      type: expense.type || 'expense',
    }))

    return [...incomeTransactions, ...expenseTransactions].sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
      return dateB - dateA // Latest first
    })
  }, [incomes, expenses])

  // Get all unique categories
  const allCategories = React.useMemo(() => {
    const categories = new Set()
    allTransactions.forEach((t) => {
      if (t.category) categories.add(t.category)
    })
    return Array.from(categories).sort()
  }, [allTransactions])

  // Filter transactions
  const filteredTransactions = React.useMemo(() => {
    return allTransactions.filter((transaction) => {
      // Type filter
      if (activeFilter !== 'all' && transaction.type !== activeFilter) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'all' && transaction.category !== selectedCategory) {
        return false
      }

      // Date range filter
      if (!isInDateRange(transaction.date, dateRange)) {
        return false
      }

      return true
    })
  }, [allTransactions, activeFilter, selectedCategory, dateRange])

  // Calculate filtered totals
  const filteredStats = React.useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    const expense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    return {
      income,
      expense,
      balance: income - expense,
    }
  }, [filteredTransactions])

  async function handleDeleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    const transaction = allTransactions.find((t) => t.id === id)
    if (!transaction) return

    try {
      if (transaction.type === 'income') {
        await actions.deleteIncome(id)
      } else {
        await actions.deleteExpense(id)
      }
    } catch (err) {
      alert(err?.message || 'Failed to delete transaction')
    }
  }

  async function handleAddExpense(payload) {
    await actions.addExpense(payload)
  }

  async function handleAddIncome(payload) {
    await actions.addIncome(payload)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          Loading transactions…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Smart Finance</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Transactions
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsIncomeModalOpen(true)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            Add Income
          </button>
          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(true)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Add Expense
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
          {error}
        </div>
      ) : null}

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          label="Total Income"
          value={formatCurrency(filteredStats.income)}
          sublabel={`${filteredTransactions.filter((t) => t.type === 'income').length} transactions`}
          icon="💰"
          variant="income"
        />
        <SummaryCard
          label="Total Expenses"
          value={formatCurrency(filteredStats.expense)}
          sublabel={`${filteredTransactions.filter((t) => t.type === 'expense').length} transactions`}
          icon="💸"
          variant="expense"
        />
        <SummaryCard
          label="Net Balance"
          value={formatCurrency(filteredStats.balance)}
          sublabel={filteredStats.balance >= 0 ? 'Positive flow' : 'Negative flow'}
          icon="📊"
          variant="balance"
        />
      </section>

      {/* Filters */}
      <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
        <div className="mt-4">
          <TransactionFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={allCategories}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </section>

      {/* Transactions List */}
      <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Transaction History</h2>
            <p className="mt-1 text-sm text-slate-500">
              All your financial activity in one place
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {filteredTransactions.length} items
          </span>
        </div>

        <ul className="mt-6 space-y-3">
          {filteredTransactions.length === 0 ? (
            <li className="rounded-xl bg-slate-50 p-8 text-center ring-1 ring-slate-100">
              <div className="mx-auto max-w-sm">
                <p className="text-4xl">📊</p>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  No transactions yet
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Start tracking your finances by adding your first income or expense.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsIncomeModalOpen(true)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    Add Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                  >
                    Add Expense
                  </button>
                </div>
              </div>
            </li>
          ) : null}

          {filteredTransactions.map((transaction) => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              onDelete={handleDeleteTransaction}
            />
          ))}
        </ul>
      </section>

      {/* Modals */}
      <AddExpenseModal
        open={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleAddExpense}
      />

      <AddIncomeModal
        open={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSubmit={handleAddIncome}
      />
    </div>
  )
}

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: "Is my financial data secure and encrypted?",
    answer: "Yes. We use military-grade 256-bit AES encryption for all data in transit and at rest. Your credentials are encrypted with a separate key and never stored on our servers. We use read-only access tokens and comply with SOC 2 Type II standards."
  },
  {
    question: "Can I connect multiple bank accounts and investments?",
    answer: "Absolutely. Smart Finance supports over 10,000 financial institutions worldwide across 195 countries. You can seamlessly connect checking accounts, savings, credit cards, investment portfolios, and crypto wallets in one unified dashboard."
  },
  {
    question: "Is there a native mobile app available?",
    answer: "Our web application is fully responsive and performs like a native app on mobile devices with offline capability. We're also launching dedicated iOS and Android apps in Q3 2024 with additional native features and Apple Watch integration."
  },
  {
    question: "How does Smart Finance differ from other budgeting apps?",
    answer: "Smart Finance combines premium 3D visualization, AI-driven insights, and cinematic UI design to transform financial management. Rather than sterile spreadsheets, our approach makes understanding your money intuitive, engaging, and enjoyable."
  },
  {
    question: "What's the pricing model?",
    answer: "We offer a free tier with core features, plus premium plans starting at $9.99/month with advanced analytics, unlimited accounts, and priority support. All plans include a 30-day free trial."
  },
  {
    question: "Can I export my financial reports?",
    answer: "Yes. You can export custom reports in PDF, Excel, and CSV formats. Reports include tax-optimized summaries, spending analysis, and goal tracking visualizations."
  }
]

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <motion.button
        onClick={onToggle}
        className="relative w-full text-left"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Background */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20'
            : 'bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 hover:bg-gradient-to-r hover:from-white/8 hover:to-white/5 hover:border-white/20'
        }`} />

        {/* Content */}
        <div className="relative flex items-center justify-between px-6 py-5">
          <span className={`text-lg font-semibold transition-colors duration-300 ${
            isOpen ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400' : 'text-white group-hover:text-slate-50'
          }`}>
            {faq.question}
          </span>

          {/* Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className={`flex-shrink-0 ${isOpen ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}`}
          >
            <Plus className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.button>

      {/* Answer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-slate-300 leading-relaxed border-l-2 border-emerald-500/30 pl-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="relative bg-slate-900 py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Frequently asked <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              questions
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            Everything you need to know about Smart Finance
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 mb-4">
            Still have questions? We're here to help.
          </p>
          <a
            href="mailto:support@smartfinance.app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 transition-all backdrop-blur-sm"
          >
            Contact our support team
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

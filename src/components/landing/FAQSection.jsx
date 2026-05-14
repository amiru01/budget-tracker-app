import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What does Smart Finance help me do day to day?",
    answer:
      "It gives you a clear place to review income, spending, budgets, and recent activity. The goal is to make daily money checks faster and monthly planning less scattered.",
  },
  {
    question: "Do I need to be good with spreadsheets to use it?",
    answer:
      "No. Smart Finance is designed around plain-language summaries, simple categories, and visual dashboards. You can still export your data when you need a spreadsheet.",
  },
  {
    question: "Can I track both income and expenses?",
    answer:
      "Yes. You can record income sources, expenses, categories, notes, and dates, then review totals, trends, and breakdowns from the dashboard.",
  },
  {
    question: "How are budget alerts supposed to work?",
    answer:
      "Budget rules help you define category limits for a period. When spending moves past a limit, the dashboard surfaces the issue so you can adjust before it surprises you.",
  },
  {
    question: "Can I export my records?",
    answer:
      "Yes. The dashboard includes an export flow for your transaction history and summary totals, so you can keep records outside the app when needed.",
  },
  {
    question: "Is this only for personal finance?",
    answer:
      "It is built for personal finance first, but it also works well for freelancers, solo operators, and households that need a clean view of cash flow.",
  },
];

function FAQItem({ faq, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <button type="button" onClick={onToggle} className="relative w-full text-left">
        <div
          className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
            isOpen
              ? "border-emerald-300 bg-gradient-to-r from-emerald-50 to-cyan-50"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
          }`}
        />

        <div className="relative flex items-center justify-between gap-5 px-5 py-5 sm:px-6">
          <span
            className={`font-display text-base font-bold leading-6 tracking-tight transition-colors duration-300 sm:text-lg ${
              isOpen
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent"
                : "text-slate-900 group-hover:text-slate-700"
            }`}
          >
            {faq.question}
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className={isOpen ? "text-emerald-500" : "text-slate-400"}
          >
            <Plus className="h-5 w-5" />
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: "auto", opacity: 1, marginTop: 8 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-5 border-l-2 border-emerald-300 px-5 pb-5 text-[0.96rem] leading-7 text-slate-600 sm:ml-6">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-shell">
      <div className="absolute left-1/3 top-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center sm:mb-20">
          <p className="section-kicker mb-4">Questions</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="section-title text-balance mb-6"
          >
            Practical answers before you
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              {" "}get started.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="section-copy mx-auto max-w-2xl text-pretty"
          >
            A quick overview of how Smart Finance fits into your everyday
            planning routine.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3 }}
          className="mt-14 text-center"
        >
          <p className="mb-4 text-sm font-medium text-slate-500">
            Need help thinking through your setup?
          </p>
          <a
            href="mailto:support@smartfinance.app"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
          >
            Contact support
          </a>
        </motion.div>
      </div>
    </section>
  );
}

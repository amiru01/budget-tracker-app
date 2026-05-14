import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const modules = [
  {
    icon: "💳",
    title: "Track My Spending",
    desc: "Log and categorize every expense. Visualize where your money goes with pie charts, line charts, and monthly analytics. Know your daily, weekly, and monthly totals at a glance.",
    color: "from-cyan-100 to-blue-50",
    glow: "shadow-cyan-200/50",
    border: "hover:border-cyan-300",
  },
  {
    icon: "📊",
    title: "Track My Net Worth",
    desc: "Connect all your accounts — bank, cash, wallet, savings, investments. Add income anytime, see expenses deducted automatically, and watch your real-time net worth grow.",
    color: "from-emerald-100 to-teal-50",
    glow: "shadow-emerald-200/50",
    border: "hover:border-emerald-300",
  },
  {
    icon: "📱",
    title: "Control My Subscriptions",
    desc: "Monitor every recurring payment in one place. Track monthly costs, get renewal reminders, pause unused services, and know exactly what you're spending each month.",
    color: "from-purple-100 to-pink-50",
    glow: "shadow-purple-200/50",
    border: "hover:border-purple-300",
  },
  {
    icon: "🎯",
    title: "Pay Off My Debt",
    desc: "Add debts, set payment priorities, and choose daily, weekly, or monthly payment plans. Watch progress bars fill as you pay down balances and work toward financial freedom.",
    color: "from-amber-100 to-rose-50",
    glow: "shadow-amber-200/50",
    border: "hover:border-amber-300",
  },
];

export default function ModulesSection() {
  return (
    <section className="section-shell">
      <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="section-container">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <p className="section-kicker mb-4">Four core modules</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="section-title text-balance"
          >
            Everything you need to master
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500"> your finances.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="section-copy mt-6 text-pretty"
          >
            From spending to net worth, subscriptions to debt — manage every part of your financial life from one dashboard.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {modules.map((mod, index) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`group relative rounded-2xl border border-slate-200 bg-gradient-to-br ${mod.color} bg-white p-8 shadow-sm ${mod.glow} ${mod.border} transition-all duration-300 hover:shadow-xl`}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-emerald-50 to-transparent" />

              <div className="relative z-10">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, delay: index * 0.15, repeat: Infinity }}
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-white text-3xl ring-1 ring-slate-200 group-hover:ring-emerald-200"
                >
                  {mod.icon}
                </motion.div>

                <h3 className="card-title mb-3 group-hover:text-emerald-600 transition-all duration-300">
                  {mod.title}
                </h3>

                <p className="card-copy group-hover:text-slate-600 transition-colors duration-300 mb-5">
                  {mod.desc}
                </p>

                <div className="flex items-center gap-2 text-sm font-bold text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Explore module</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

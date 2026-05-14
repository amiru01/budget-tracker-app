import { motion } from "framer-motion";
import { CheckCircle, TrendingUp, Lock, Zap, Globe, Award } from "lucide-react";

const benefits = [
  {
    icon: <TrendingUp className="text-emerald-500" size={32} />,
    title: "Decisions in minutes",
    description:
      "See what changed, what matters, and where to focus before you open another spreadsheet.",
  },
  {
    icon: <Lock className="text-cyan-500" size={32} />,
    title: "A cleaner money routine",
    description:
      "Keep income, bills, savings, and everyday spending organized without rebuilding your system each month.",
  },
  {
    icon: <Zap className="text-amber-500" size={32} />,
    title: "Less manual cleanup",
    description:
      "Use consistent categories and simple review flows to keep your dashboard accurate with less effort.",
  },
  {
    icon: <Globe className="text-indigo-500" size={32} />,
    title: "Clearer priorities",
    description:
      "Compare spending against goals so your next move is obvious, whether you are saving or cutting back.",
  },
  {
    icon: <Award className="text-rose-500" size={32} />,
    title: "Built for repeat use",
    description:
      "Dense enough for serious tracking, polished enough that checking your numbers feels calm.",
  },
  {
    icon: <CheckCircle className="text-purple-500" size={32} />,
    title: "Exportable records",
    description:
      "Turn your activity into clean files for reporting, budgeting sessions, and end-of-month reviews.",
  },
];

export default function BenefitsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="section-shell">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <p className="section-kicker mb-4">Why it feels better</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="section-title text-balance mb-6"
          >
            Designed for the way people actually
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              {" "}manage money.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="section-copy text-pretty"
          >
            A premium finance tool should reduce mental load. Smart Finance
            keeps your most important numbers visible, structured, and easy to
            act on.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              <div className="relative rounded-2xl border border-slate-200 bg-white p-8 overflow-hidden h-full transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{
                    duration: 3,
                    delay: index * 0.1,
                    repeat: Infinity,
                  }}
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-white ring-1 ring-slate-200 group-hover:ring-emerald-200 group-hover:from-emerald-50 transition-all"
                >
                  {benefit.icon}
                </motion.div>

                <h3 className="card-title mb-3 group-hover:text-emerald-600 transition-all duration-300">
                  {benefit.title}
                </h3>

                <p className="card-copy group-hover:text-slate-600 transition-colors duration-300">
                  {benefit.description}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-500 mb-6">
            Ready to make your finances easier to read?
          </p>
          <a
            href="#auth"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50 transition-all hover:scale-105 active:scale-95"
          >
            Create your workspace
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

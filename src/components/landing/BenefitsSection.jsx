import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, TrendingUp, Lock, Zap, Globe, Award } from 'lucide-react'

const benefits = [
  {
    icon: <TrendingUp className="text-emerald-400" size={32} />,
    title: 'Real-time Insights',
    description: 'Get instant updates on your financial health with AI-powered analysis and predictive trends.',
  },
  {
    icon: <Lock className="text-cyan-400" size={32} />,
    title: 'Bank-Level Security',
    description: 'Your data is protected with military-grade 256-bit encryption and SOC 2 compliance.',
  },
  {
    icon: <Zap className="text-amber-400" size={32} />,
    title: 'Ultra Fast',
    description: 'Lightning-fast performance optimized for seamless interactions and instant feedback.',
  },
  {
    icon: <Globe className="text-indigo-400" size={32} />,
    title: 'Multi-Currency',
    description: 'Manage finances across 195 countries with real-time exchange rates and global support.',
  },
  {
    icon: <Award className="text-rose-400" size={32} />,
    title: 'Award Winning',
    description: 'Recognized by industry leaders for premium design and financial innovation.',
  },
  {
    icon: <CheckCircle className="text-purple-400" size={32} />,
    title: 'Always Available',
    description: '24/7 access to your financial data with offline capability and automatic sync.',
  },
]

export default function BenefitsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative bg-slate-900 py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Why choose <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Smart Finance?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400"
          >
            We combine premium design, cutting-edge technology, and financial expertise to create the ultimate personal finance platform.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              {/* Card Background */}
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl p-8 overflow-hidden h-full transition-all duration-300 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:shadow-xl hover:shadow-emerald-500/10">
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Icon */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3, delay: index * 0.1, repeat: Infinity }}
                  className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/20 group-hover:from-white/15 group-hover:to-white/10 group-hover:ring-white/40 transition-all"
                >
                  {benefit.icon}
                </motion.div>

                {/* Content */}
                <h3 className="mb-3 text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-300">
                  {benefit.title}
                </h3>

                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                  {benefit.description}
                </p>

                {/* Animated border bottom on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-400 mb-6">
            Ready to experience the future of personal finance?
          </p>
          <a
            href="#auth"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-400/50 transition-all hover:scale-105 active:scale-95"
          >
            Start Free Trial
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}

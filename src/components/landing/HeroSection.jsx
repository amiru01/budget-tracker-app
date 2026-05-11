import React, { Suspense, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, TrendingUp, PieChart, Zap } from 'lucide-react'

// Lazy load Scene3D to not block initial render of text
const Scene3D = React.lazy(() => import('./Scene3D.jsx'))

// Floating metrics card component
function FloatingCard({ icon: Icon, label, value, delay, top, right }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${top} ${right} hidden lg:block`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, delay, repeat: Infinity }}
        className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-4 shadow-2xl shadow-black/20 hover:shadow-emerald-500/20 transition-shadow duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 p-2 text-emerald-400 group-hover:from-emerald-400/40 transition-colors">
            <Icon size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Scroll indicator animation
function ScrollIndicator() {
  return (
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Scroll</p>
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </motion.div>
  )
}

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-slate-900 pt-20">
      {/* 3D Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-slate-900" />}>
        <motion.div
          animate={{
            transform: `perspective(1200px) rotateX(${mousePosition.y * 0.05}deg) rotateY(${mousePosition.x * 0.05}deg)`,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 30 }}
          className="absolute inset-0"
        >
          <Scene3D />
        </motion.div>
      </Suspense>

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      {/* Content Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto max-w-2xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 backdrop-blur-sm mb-8 hover:bg-emerald-500/15 transition-colors">
                  <ShieldCheck size={16} />
                  <span>The Future of Personal Finance</span>
                </div>
              </motion.div>
              
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight"
              >
                Master your{' '}
                <span className="block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 animate-pulse">
                    wealth in 3D
                  </span>
                </span>
              </motion.h1>
              
              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="mt-8 text-lg text-slate-300 sm:text-xl max-w-xl leading-relaxed"
              >
                Experience a premium, immersive way to track your income and expenses. 
                Smart Finance brings cinematic clarity and intelligent automation to your financial goals.
              </motion.p>
              
              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="mt-12 flex flex-wrap items-center gap-4"
              >
                <Link
                  to="/auth"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/40 transition-all hover:shadow-emerald-400/60 hover:scale-105 active:scale-95"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                
                <Link
                  to="/auth"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
                >
                  <span>Login</span>
                </Link>
              </motion.div>
              
              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="mt-16 flex items-center gap-6 text-sm text-slate-400"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="inline-block h-10 w-10 rounded-full border-2 border-slate-900 object-cover shadow-lg"
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-medium text-white">Trusted by 10,000+ users worldwide</p>
                  <p className="text-slate-500">Join the financial intelligence revolution</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Floating Cards */}
            <div className="relative h-96 hidden lg:block">
              <FloatingCard
                icon={TrendingUp}
                label="Total Income"
                value="$45,230"
                delay={0.7}
                top="top-10"
                right="right-0"
              />
              <FloatingCard
                icon={PieChart}
                label="Savings Rate"
                value="32%"
                delay={0.8}
                top="top-40"
                right="right-20"
              />
              <FloatingCard
                icon={Zap}
                label="Insight Alert"
                value="3 New"
                delay={0.9}
                top="bottom-20"
                right="right-10"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <ScrollIndicator />
      
      {/* Gradient Bottom Fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"
      />
    </section>
  )
}

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 transition-transform group-hover:scale-105">
                <span className="text-xl font-bold text-white">$</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-slate-900">Smart Finance</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Product', 'Testimonials', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/auth"
              className="text-sm font-bold text-slate-700 transition hover:text-emerald-600"
            >
              Log in
            </Link>
            <Link
              to="/auth"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="text-slate-500 hover:text-slate-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 p-4 shadow-2xl"
        >
          <div className="flex flex-col gap-4">
            {['Features', 'Product', 'Testimonials', 'FAQ'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-600 hover:text-slate-900 p-2"
              >
                {item}
              </a>
            ))}
            <hr className="border-slate-200 my-2" />
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-600 hover:text-slate-900 p-2"
            >
              Log in
            </Link>
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl bg-emerald-500 px-4 py-3 text-center text-base font-semibold text-white mt-2"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

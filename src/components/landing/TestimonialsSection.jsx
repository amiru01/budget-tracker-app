import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    content: "Smart Finance completely transformed how I manage my finances. The immersive 3D interface makes financial data feel accessible and even enjoyable.",
    author: "Sarah Jenkins",
    role: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 5,
  },
  {
    content: "The cleanest, most professional dashboard I've used. It doesn't feel like financial software—it feels like a premium product. Exceptional work.",
    author: "Michael Chen",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
  },
  {
    content: "Every animation is purposeful, every interaction feels polished. This is what premium SaaS should look like. Absolutely brilliant execution.",
    author: "Emma Watson",
    role: "Marketing Director",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
  },
  {
    content: "I've been using budgeting apps for years. This is the first one that's actually made me excited to check my finances daily.",
    author: "James Rodriguez",
    role: "Entrepreneur",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
]

function TestimonialCard({ testimonial, index }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glass card background */}
      <motion.div
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-2xl p-8 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300"
      >
        {/* Animated background gradient on hover */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none"
        />

        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Rating stars */}
          <div className="mb-4 flex gap-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
              >
                <Star size={16} className="text-amber-400 fill-amber-400" />
              </motion.div>
            ))}
          </div>

          {/* Quote */}
          <motion.div
            animate={{
              y: isHovered ? -2 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <svg className="h-6 w-6 text-emerald-400/30 mb-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5s-6 3.75-6 5c0 1 0 4-1 5" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-4.5-5-7-5s-6 3.75-6 5c0 1 0 4-1 5" />
            </svg>
            <p className="text-lg text-slate-200 leading-relaxed font-light">
              "{testimonial.content}"
            </p>
          </motion.div>

          {/* Author */}
          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
            <motion.img
              animate={{
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="h-12 w-12 rounded-full border-2 border-white/20 object-cover shadow-lg"
              src={testimonial.avatar}
              alt={testimonial.author}
            />
            <div>
              <h4 className="font-semibold text-white">{testimonial.author}</h4>
              <p className="text-sm text-slate-400">{testimonial.role}</p>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <motion.div
          animate={{
            width: isHovered ? '100%' : '0%',
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400"
        />
      </motion.div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative bg-slate-900 py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
          >
            Trusted by <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              thousands worldwide
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Real users, real results, real testimonials from people who've transformed their financial lives.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-slate-400 mb-4">Trusted by users from:</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {['Google', 'Apple', 'Microsoft', 'Amazon'].map((company, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-slate-500 font-semibold text-sm tracking-wide"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

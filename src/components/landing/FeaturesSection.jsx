import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Wallet,
  Shield,
  Zap,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: <Wallet className="text-emerald-400" size={32} />,
    title: "Smart Budgeting",
    description:
      "Automatically categorize and track your spending in real-time with AI-driven insights.",
    color: "from-emerald-400/20 to-emerald-600/20",
    glow: "shadow-emerald-500/20",
  },
  {
    icon: <LineChart className="text-cyan-400" size={32} />,
    title: "Interactive Analytics",
    description:
      "Dive deep into your financial health with immersive 3D charts and dynamic reports.",
    color: "from-cyan-400/20 to-blue-600/20",
    glow: "shadow-cyan-500/20",
  },
  {
    icon: <Shield className="text-indigo-400" size={32} />,
    title: "Bank-grade Security",
    description:
      "Your data is encrypted and secure. We use industry-standard protocols to protect you.",
    color: "from-indigo-400/20 to-purple-600/20",
    glow: "shadow-indigo-500/20",
  },
  {
    icon: <Zap className="text-amber-400" size={32} />,
    title: "Lightning Fast",
    description:
      "Experience a smooth, lag-free dashboard built on modern edge infrastructure.",
    color: "from-amber-400/20 to-orange-600/20",
    glow: "shadow-amber-500/20",
  },
  {
    icon: <ArrowUpRight className="text-rose-400" size={32} />,
    title: "Goal Tracking",
    description:
      "Set ambitious financial goals and watch your progress update instantly.",
    color: "from-rose-400/20 to-pink-600/20",
    glow: "shadow-rose-500/20",
  },
  {
    icon: <BarChart3 className="text-purple-400" size={32} />,
    title: "Custom Reports",
    description:
      "Export and share beautifully designed PDF reports of your financial journey.",
    color: "from-purple-400/20 to-violet-600/20",
    glow: "shadow-purple-500/20",
  },
];

// Feature Card Component with 3D hover
function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientY - centerY) / 20;
    const y = (e.clientX - centerX) / 20;

    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        transformStyle: "preserve-3d",
      }}
      className="group relative rounded-2xl transition-all duration-300"
    >
      {/* Glass background with gradient */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
      />

      {/* Premium glass card */}
      <div
        className={`relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8 shadow-xl ${feature.glow} group-hover:shadow-2xl group-hover:border-white/20 transition-all duration-300 overflow-hidden`}
      >
        {/* Animated background gradient on hover */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {/* Icon container with glow */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, delay: index * 0.1, repeat: Infinity }}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/20 group-hover:ring-white/40 group-hover:from-white/15 transition-all"
        >
          {feature.icon}
        </motion.div>

        {/* Title */}
        <motion.h3
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-3 text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-300"
        >
          {feature.title}
        </motion.h3>

        {/* Description */}
        <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
          {feature.description}
        </p>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative bg-slate-900 py-24 sm:py-32 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            A new dimension of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              financial mastery.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-slate-400 leading-relaxed"
          >
            We've reimagined personal finance with premium 3D visuals and
            intelligent automation. No more boring spreadsheets—just clean,
            actionable insights.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

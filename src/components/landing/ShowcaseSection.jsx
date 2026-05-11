import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LineChart, PieChart, TrendingUp } from "lucide-react";

export default function ShowcaseSection() {
  const containerRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState("analytics");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8],
  );

  const tabs = [
    { id: "analytics", label: "Analytics", icon: LineChart },
    { id: "budget", label: "Budgeting", icon: PieChart },
    { id: "insights", label: "Insights", icon: TrendingUp },
  ];

  return (
    <section
      id="product"
      ref={containerRef}
      className="relative overflow-hidden bg-slate-900 pt-24 pb-12 sm:pt-32 sm:pb-16"
    >
      {/* Background glow elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <p className="section-kicker mb-4">Product workspace</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="section-title text-balance mb-6"
          >
            A dashboard that keeps the signal
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              {" "}above the noise.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="section-copy mx-auto max-w-2xl text-pretty"
          >
            Review spending, income, and category movement from one focused
            workspace built for quick daily checks and deeper monthly reviews.
          </motion.p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-16 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: tabs.indexOf(tab) * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Showcase Container */}
        <motion.div
          style={{ opacity, scale }}
          className="relative h-[700px] w-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl shadow-black/40"
        >
          {/* Dashboard Mockup */}
          <motion.div
            style={{ y: y1 }}
            className="absolute inset-x-0 z-30 mx-auto w-full max-w-5xl top-1/2 -translate-y-1/2"
          >
            {/* Browser Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-900/50 px-6 py-4 rounded-t-2xl">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500/70" />
                <div className="h-3 w-3 rounded-full bg-amber-500/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex-1 text-center">
                <p className="text-xs font-medium text-slate-400">
                    smartfinance.app/workspace
                </p>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-b-2xl flex gap-6">
              {/* Left Sidebar */}
              <div className="w-56 hidden lg:flex flex-col gap-4">
                <div className="h-8 w-32 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-20" />
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-10 w-full rounded-lg transition-all ${
                        i === 0
                          ? "bg-emerald-500/20 border border-emerald-500/30"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-6">
                {/* Header Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      label: "Income",
                      value: "$45,230",
                      color: "from-emerald-400/20",
                    },
                    {
                      label: "Spending",
                      value: "$12,450",
                      color: "from-rose-400/20",
                    },
                    {
                      label: "Saved",
                      value: "72.5%",
                      color: "from-cyan-400/20",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border border-white/10 bg-gradient-to-br ${stat.color} to-transparent p-4`}
                    >
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-white mt-2">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Charts/Visualizations based on active tab */}
                <div className="h-40 rounded-xl border border-white/10 bg-white/[0.02] p-4 flex items-end gap-2 justify-center">
                  {[65, 78, 45, 92, 67, 85, 72, 88, 55].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{
                        delay: i * 0.05,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-500 to-cyan-400 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Phone Mockup - Floating */}
          <motion.div
            style={{ y: y2 }}
            animate={{ rotate: [0, 2, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-40 hidden md:block"
          >
            <div className="h-96 w-48 rounded-3xl border-8 border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-500/20 overflow-hidden">
              {/* Phone notch */}
              <div className="absolute top-0 inset-x-0 h-7 bg-slate-800 rounded-b-3xl w-32 mx-auto z-50" />

              {/* Phone content */}
              <div className="p-4 pt-10 h-full bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col gap-3">
                <div className="h-12 w-full rounded-lg bg-gradient-to-r from-emerald-400/20 to-cyan-400/20" />
                <div className="h-16 w-full rounded-lg bg-white/5" />
                <div className="flex-1 w-full rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50" />

                {/* Bottom stats */}
                <div className="flex gap-2">
                  <div className="flex-1 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400">
                    $45K
                  </div>
                  <div className="flex-1 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
                    +32%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-900 via-transparent to-transparent rounded-3xl" />
        </motion.div>

      </div>
    </section>
  );
}

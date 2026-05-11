import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PieChart,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1];

const bars = [
  { height: "35%", color: "from-emerald-500 to-teal-300", delay: 0 },
  { height: "52%", color: "from-blue-500 to-sky-300", delay: 0.08 },
  { height: "64%", color: "from-emerald-500 to-teal-300", delay: 0.16 },
  { height: "80%", color: "from-blue-500 to-sky-300", delay: 0.24 },
  { height: "92%", color: "from-emerald-500 to-teal-300", delay: 0.32 },
  { height: "74%", color: "from-emerald-500 to-teal-300", delay: 0.4 },
];

function StatPill({ icon: Icon, label, value, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7, ease: easeOut }}
      className={`absolute hidden rounded-[18px] border border-white/12 bg-slate-800/72 px-5 py-4 shadow-2xl shadow-black/20 backdrop-blur-xl lg:block ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-4"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-400">
          <Icon size={23} strokeWidth={2.2} />
        </span>
        <span>
          <span className="block text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {label}
          </span>
          <span className="mt-1 block text-2xl font-extrabold tracking-tight text-white">
            {value}
          </span>
        </span>
      </motion.div>
    </motion.div>
  );
}

function FinanceScene({ mousePosition }) {
  return (
    <motion.div
      animate={{
        rotateX: mousePosition.y * -0.025,
        rotateY: mousePosition.x * 0.035,
      }}
      transition={{ type: "spring", stiffness: 95, damping: 28 }}
      className="pointer-events-none absolute inset-y-20 right-0 z-0 hidden w-[74%] origin-center transform-gpu lg:block"
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] top-[14%] h-[60%] w-[72%] rounded-[12px] border border-white/25 bg-slate-800/28 shadow-[0_32px_120px_rgba(5,12,28,0.45)] backdrop-blur-[1px]"
      >
        <div className="absolute inset-3 rounded-[9px] border border-emerald-300/25 bg-gradient-to-br from-slate-950/70 via-slate-900/30 to-white/5" />
        <div className="absolute left-[8%] top-[22%] h-[22%] w-[32%] rounded bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_28px_rgba(16,185,129,0.38)]" />
        <div className="absolute left-[53%] top-[20%] h-[23%] w-[20%] rounded bg-gradient-to-r from-blue-600 to-sky-400 shadow-[0_0_28px_rgba(59,130,246,0.38)]" />
        <div className="absolute bottom-[16%] left-[26%] h-[37%] w-[44%] rounded bg-slate-950/72 shadow-inner shadow-black/60" />
        <div className="absolute bottom-[26%] right-[8%] flex h-[36%] items-end gap-5">
          {bars.map((bar) => (
            <motion.span
              key={`${bar.height}-${bar.delay}`}
              animate={{ height: [bar.height, `calc(${bar.height} + 6%)`, bar.height] }}
              transition={{
                duration: 3,
                delay: bar.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-8 rounded-t bg-gradient-to-t ${bar.color} shadow-[0_0_18px_rgba(45,212,191,0.38)]`}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        animate={{ rotate: [0, 360], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute left-[9%] top-[-1%] h-28 w-28 bg-gradient-to-br from-rose-200 via-red-500 to-red-900"
        style={{ clipPath: "polygon(50% 0, 88% 18%, 100% 54%, 61% 100%, 20% 92%, 0 42%)" }}
      />
      <motion.div
        animate={{ rotate: [0, -360], y: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        className="absolute right-[13%] top-[31%] h-24 w-24 bg-gradient-to-br from-emerald-300 to-emerald-700"
        style={{ clipPath: "polygon(50% 0, 100% 38%, 78% 100%, 18% 83%, 0 28%)" }}
      />
      <div className="absolute right-[18%] top-[11%] h-28 w-36 rounded border border-white/20 bg-white/35 shadow-xl backdrop-blur-sm" />
    </motion.div>
  );
}

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const sceneY = useTransform(scrollYProgress, [0, 0.25], [0, 70]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.65]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#071024] pt-20 text-white">
      <motion.div style={{ y: sceneY, opacity: sceneOpacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_28%,rgba(20,184,166,0.12),transparent_28%),linear-gradient(180deg,#071024_0%,#0b1326_56%,#071024_100%)]" />
        <div className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full border-[36px] border-cyan-300/40 shadow-[0_0_40px_rgba(34,211,238,0.18)]" />
        <FinanceScene mousePosition={mousePosition} />
      </motion.div>

      <div className="relative z-30 mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: easeOut }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-5 py-2 text-sm font-bold text-emerald-400 backdrop-blur-md"
          >
            <ShieldCheck size={16} />
            Personal finance, finally in focus
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: easeOut }}
            className="font-display max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            See where your
            <span className="mt-4 block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              money is going
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: easeOut }}
            className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl sm:leading-9"
          >
            Smart Finance turns income, spending, and budgets into a calm
            command center, so you can make better decisions without living in
            spreadsheets.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.44, ease: easeOut }}
            className="mt-12 flex flex-wrap items-center gap-5"
          >
            <Link
              to="/auth"
              className="group inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-9 text-lg font-extrabold text-white shadow-[0_18px_36px_rgba(6,182,212,0.25)] transition hover:scale-[1.03] hover:shadow-[0_20px_44px_rgba(16,185,129,0.32)]"
            >
              Start tracking smarter
              <ArrowRight size={22} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/auth"
              className="inline-flex min-h-16 items-center justify-center rounded-full border border-white/20 bg-white/5 px-10 text-lg font-extrabold text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
            >
              View dashboard
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.56, ease: easeOut }}
            className="mt-20 flex flex-wrap items-center gap-6"
          >
            <div className="flex -space-x-3">
              {[14, 32, 48, 68].map((id) => (
                <img
                  key={id}
                  src={`https://i.pravatar.cc/96?img=${id}`}
                  alt=""
                  className="h-12 w-12 rounded-full border-2 border-[#071024] object-cover"
                />
              ))}
            </div>
            <div>
              <p className="font-bold text-slate-300">
                Built for people who want clarity, not clutter
              </p>
              <p className="text-slate-500">
                Organize cash flow, habits, and goals in one workspace.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <StatPill
        icon={TrendingUp}
        label="Total Income"
        value="$45,230"
        delay={0.75}
        className="right-[10%] top-[31%] z-10 opacity-90"
      />
      <StatPill
        icon={PieChart}
        label="Savings Rate"
        value="32%"
        delay={0.9}
        className="right-[16%] top-[51%] z-10 opacity-85"
      />

    </section>
  );
}

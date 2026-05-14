import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

export default function Footer() {
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const links = [
    {
      title: "Product",
      items: [
        { name: "Features", href: "#features" },
        { name: "Showcase", href: "#product" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      items: [
        { name: "About Us", href: "#" },
        { name: "Blog", href: "#" },
        { name: "Careers", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      items: [
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" },
        { name: "Security", href: "#" },
        { name: "Compliance", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: "𝕏" },
    { name: "GitHub", href: "#", icon: "💻" },
    { name: "LinkedIn", href: "#", icon: "💼" },
    { name: "Discord", href: "#", icon: "💬" },
  ];

  return (
    <footer className="relative bg-gradient-to-t from-slate-100 via-white to-white border-t border-slate-200 pt-20 pb-8">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16"
        >
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 group mb-6">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <span className="text-lg font-bold text-white">$</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                Smart Finance
              </span>
            </Link>
            <p className="text-sm font-medium leading-6 text-slate-500">
              A calmer way to review cash flow, budgets, reports, and spending
              habits from one polished workspace.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {links.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3 className="text-sm font-semibold text-slate-700 mb-6 uppercase tracking-widest">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-emerald-600 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="text-emerald-400/0 group-hover:text-emerald-500 transition-all">
                        →
                      </span>
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-slate-700 mb-6 uppercase tracking-widest">
              Connect
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:support@smartfinance.app"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 transition-all group"
              >
                <Mail
                  size={16}
                  className="text-emerald-500 group-hover:text-emerald-500 transition-colors"
                />
                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                  Support
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-100 hover:bg-cyan-50 hover:border-cyan-300 transition-all group"
              >
                <MessageCircle
                  size={16}
                  className="text-cyan-500 group-hover:text-cyan-500 transition-colors"
                />
                <span className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                  Discord
                </span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-10"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <motion.p variants={itemVariants} className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Smart Finance. All rights
            reserved. &bull; Built with ✨ for modern finance.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-xs text-slate-500"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All systems operational</span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

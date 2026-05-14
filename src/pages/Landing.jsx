import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/landing/Navbar.jsx";
import HeroSection from "../components/landing/HeroSection.jsx";
import FeaturesSection from "../components/landing/FeaturesSection.jsx";
import ModulesSection from "../components/landing/ModulesSection.jsx";
import BenefitsSection from "../components/landing/BenefitsSection.jsx";
import ShowcaseSection from "../components/landing/ShowcaseSection.jsx";
import TestimonialsSection from "../components/landing/TestimonialsSection.jsx";
import FAQSection from "../components/landing/FAQSection.jsx";
import Footer from "../components/landing/Footer.jsx";

export default function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-8 w-8 rounded-full border-2 border-emerald-500 border-t-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-slate-900 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden"
    >
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ModulesSection />
        <BenefitsSection />
        <ShowcaseSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </motion.div>
  );
}

import { motion } from "framer-motion";
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

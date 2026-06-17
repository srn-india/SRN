import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, BadgeCheck, FileText, BookOpen, Heart, Users, User, Star,
  Leaf, Home as HomeIcon, Eye, Target, Phone, Mail, ArrowRight,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useLanguage } from "../context/LanguageContext";
import { useFadeIn } from "../hooks/useFadeIn";

const iconMap = { BookOpen, Heart, Users, Star, Leaf, Home: HomeIcon, Eye, Target };


/* ─── Scroll-reveal section wrapper ──────────────────────────────────── */
function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useFadeIn(0.12);
  return (
    <div
      ref={ref}
      className={`fade-in-section ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────────────── */
const HERO_IMAGES = [
  "/hero-bg.jpg",
  "/hero-bg-1.png",
  "/hero-bg-2.png",
  "/hero-bg-3.png"
];

export default function Home() {
  const { t, lang } = useLanguage();
  const h = t.home;
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sashakt Rashtra Nirman – Home";
  }, []);

  return (
    <div className="bg-[#FDF5EC]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image carousel */}
        {HERO_IMAGES.map((img, index) => (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1500ms] ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        {/* Overlay: subtle dark tint to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E8622A]/8 via-transparent to-[#C04A18]/8" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative text-center px-6 py-16 max-w-4xl mx-auto"
        >
          {/* Logo */}
          <motion.img
            src="/logo.PNG"
            alt="Sashakt Rashtra Nirman Logo"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            className="block mx-auto mb-2 w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-2xl float-badge"
          />

          {/* Trust name — primary language on top, secondary below */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white font-serif leading-tight tracking-tight drop-shadow-lg">
              {lang === "en" ? "Sashakt Rashtra Nirman" : "सशक्त राष्ट्र निर्माण"}
            </h1>



          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className="mt-5 flex flex-col items-center gap-3"
          >
            <span className="inline-block bg-gradient-to-r from-[#E8622A] to-[#D4880C] text-white text-sm sm:text-base md:text-xl font-semibold italic py-1.5 px-4 md:py-2.5 md:px-8 rounded-full shadow-lg shadow-black/30">
              सेवा, शक्ति और संकल्प | हर कदम राष्ट्र निर्माण की ओर।
            </span>
            <span className="text-white/80 text-[11px] sm:text-xs md:text-sm font-medium italic tracking-widest uppercase drop-shadow-md">
              {lang === "en" ? "Working Nationwide" : "देशभर में कार्यरत"}
            </span>
          </motion.div>




          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.92, duration: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Link
              to="/uddeshya"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white font-semibold shadow-lg shadow-black/30 hover:shadow-orange-800/40 hover:-translate-y-0.5 transition-all duration-300 text-sm w-full sm:w-auto"
            >
              {lang === "en" ? h.ctaKnowMore : h.ctaKnowMoreHindi}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/become-member"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border-2 border-white/40 text-white font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-[#F47A3A] hover:-translate-y-0.5 transition-all duration-300 text-sm w-full sm:w-auto"
            >
              {lang === "en" ? h.ctaJoin : h.ctaJoinHindi}
            </Link>
          </motion.div>
        </motion.div>

      </section>


      {/* ── About Us ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FDF5EC]">
        <div className="max-w-5xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi={h.aboutTitleHindi}
              english={h.aboutTitle}
            />
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <FadeSection delay={100}>
              <p className="text-[#1E0F05] text-sm md:text-base leading-relaxed text-justify">{h.aboutText}</p>
            </FadeSection>
            <FadeSection delay={200}>
              <blockquote className="border-l-4 border-[#E8622A] bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC] p-4 md:p-6 rounded-xl md:rounded-l-none md:rounded-r-xl shadow-sm">
                <p className="italic text-base md:text-xl text-[#5C1010] leading-relaxed font-serif text-justify">
                  "{lang === "en" ? h.aboutQuote : h.aboutQuoteHindi}"
                </p>
              </blockquote>
            </FadeSection>
          </div>
        </div>
      </section>
    </div>
  );
}

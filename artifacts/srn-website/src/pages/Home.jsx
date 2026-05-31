import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, BadgeCheck, FileText, BookOpen, Heart, Users, User, Star,
  Leaf, Home as HomeIcon, Eye, Target, Phone, Mail, ArrowRight,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import LegalBadge from "../components/LegalBadge";
import FocusAreasSection from "../components/FocusAreasSection";
import { useLanguage } from "../context/LanguageContext";
import { useFadeIn } from "../hooks/useFadeIn";

const iconMap = { BookOpen, Heart, Users, Star, Leaf, Home: HomeIcon, Eye, Target };


/* ─── Animated counter ────────────────────────────────────────────────── */
function Counter({ target, suffix, label, labelHindi, lang }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:-translate-y-2 hover:border-[#E8622A]/50 transition-all duration-500 shadow-2xl overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8622A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#F47A3A] to-[#FFC5A8] bg-clip-text text-transparent mb-3 drop-shadow-lg filter group-hover:brightness-110 transition-all">
          {count.toLocaleString()}{suffix}
        </p>
        <p className="text-white/80 text-xs font-bold tracking-widest uppercase group-hover:text-white transition-colors">
          {lang === "hi" ? labelHindi : label}
        </p>
      </div>
    </div>
  );
}

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
            className="block mx-auto mb-2 w-44 h-44 object-contain drop-shadow-2xl float-badge"
          />

          {/* Trust name — primary language on top, secondary below */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white font-serif leading-tight tracking-tight drop-shadow-lg">
              {lang === "en" ? "Sashakt Rashtra Nirman" : "सशक्त राष्ट्र निर्माण"}
            </h1>



          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className="mt-5"
          >
            <span className="inline-block bg-gradient-to-r from-[#E8622A] to-[#D4880C] text-white text-xl font-semibold py-2.5 px-8 rounded-full shadow-lg shadow-black/30">
              {h.slogan}
            </span>
          </motion.div>


          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.82 }}
            className="text-white/35 text-xs mt-1"
          >
            {h.npoId}&nbsp;|&nbsp;{h.regNo}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.92, duration: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Link
              to="/uddeshya"
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white font-semibold shadow-lg shadow-black/30 hover:shadow-orange-800/40 hover:-translate-y-0.5 transition-all duration-300 text-sm"
            >
              {lang === "en" ? h.ctaKnowMore : h.ctaKnowMoreHindi}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/become-member"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-2 border-white/40 text-white font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-[#F47A3A] hover:-translate-y-0.5 transition-all duration-300 text-sm"
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
              <p className="text-[#1E0F05] text-base leading-relaxed">{h.aboutText}</p>
            </FadeSection>
            <FadeSection delay={200}>
              <blockquote className="border-l-4 border-[#E8622A] bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC] p-6 rounded-r-xl shadow-sm">
                <p className="italic text-xl text-[#5C1010] leading-relaxed font-serif">
                  "{lang === "en" ? h.aboutQuote : h.aboutQuoteHindi}"
                </p>
              </blockquote>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ─────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-[#FFF9F2]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeSection delay={0}>
            <div className="bg-white border-l-4 border-[#E8622A] rounded-xl shadow-sm p-6 h-full card-shimmer hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#E8622A]/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#E8622A]" />
                </div>
                <h3 className="font-bold text-[#5C1010] text-xl font-serif">
                  {lang === "en" ? h.visionTitle : h.visionTitleHindi}
                </h3>
              </div>
              <p className="text-[#7A5C45] text-base leading-relaxed">{h.visionText}</p>
            </div>
          </FadeSection>
          <FadeSection delay={150}>
            <div className="bg-white border-l-4 border-[#5C1010] rounded-xl shadow-sm p-6 h-full card-shimmer hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#5C1010]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#5C1010]" />
                </div>
                <h3 className="font-bold text-[#5C1010] text-xl font-serif">
                  {lang === "en" ? h.missionTitle : h.missionTitleHindi}
                </h3>
              </div>
              <ul className="space-y-2">
                {h.missionPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-base text-[#7A5C45]">
                    <span className="text-[#E8622A] mt-0.5 shrink-0">▸</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── Legal Legitimacy ─────────────────────────────────────────── */}
      <section className="py-24 px-6 relative bg-[url('/hero-bg-2.png')] bg-fixed bg-cover bg-center overflow-hidden">
        {/* Premium Glass Overlay */}
        <div className="absolute inset-0 bg-[#2C1810]/75 backdrop-blur-md" />
        
        {/* Animated Glowing Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#E8622A] rounded-full blur-[100px] pointer-events-none" 
        />
        
        <div className="relative max-w-5xl mx-auto z-10">
          <FadeSection>
            <SectionHeader
              hindi={h.legalTitleHindi}
              english={h.legalTitle}
              darkBg={true}
            />
          </FadeSection>
          <FadeSection delay={150}>
            <div className="flex flex-wrap gap-4 justify-center mt-12">
              {h.legalBadges.map((badge, i) => (
                <LegalBadge key={i} label={badge} darkBg={true} />
              ))}
            </div>
          </FadeSection>
        </div>
      </section>


      {/* ── Focus Areas ──────────────────────────────────────────────── */}
      <FocusAreasSection titleEn={h.focusTitle} titleHi={h.focusTitleHindi} />

      {/* ── Impact Counter ───────────────────────────────────────────── */}
      <section className="py-24 px-6 relative bg-[url('/hero-bg-2.png')] bg-fixed bg-cover bg-center overflow-hidden">
        {/* Premium Glass Overlay */}
        <div className="absolute inset-0 bg-[#2C1810]/70 backdrop-blur-md" />
        
        {/* Animated Glowing Orbs for ambiance */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#E8622A] rounded-full blur-[100px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-[#D4880C] rounded-full blur-[100px] pointer-events-none" 
        />
        
        {/* Subtle Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
        />

        <div className="relative max-w-6xl mx-auto z-10">
          <FadeSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {h.impactCounters.map((item, i) => (
                <Counter
                  key={i}
                  target={item.value}
                  suffix={item.suffix}
                  label={item.label}
                  labelHindi={item.labelHindi}
                  lang={lang}
                />
              ))}
            </div>
          </FadeSection>

          <FadeSection delay={200}>
            <div className="mt-16 text-center">
              <div className="inline-block relative">
                <span className="absolute -top-6 -left-8 text-6xl text-[#E8622A]/40 font-serif leading-none">"</span>
                <p className="text-xl md:text-2xl italic font-serif text-white/95 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
                  {lang === "en" ? h.impactQuote : h.impactQuoteHindi}
                </p>
                <span className="absolute -bottom-10 -right-8 text-6xl text-[#E8622A]/40 font-serif leading-none rotate-180">"</span>
              </div>
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}

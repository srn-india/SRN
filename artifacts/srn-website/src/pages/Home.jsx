import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, BadgeCheck, FileText, BookOpen, Heart, Users, User, Star,
  Leaf, Home as HomeIcon, Eye, Target, Phone, Mail, ArrowRight,
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import LegalBadge from "../components/LegalBadge";
import { useLanguage } from "../context/LanguageContext";
import { useFadeIn } from "../hooks/useFadeIn";

const iconMap = { BookOpen, Heart, Users, Star, Leaf, Home: HomeIcon, Eye, Target };

const foundingMembers = [
  {
    id: 1,
    nameEn: "Dr. Manoj Kumar Shukla",
    nameHi: "डॉ० मनोज कुमार शुक्ल",
    fatherEn: "S/O Late Vaidyanath Shukla",
    fatherHi: "पुत्र स्व० वैद्यनाथ शुक्ल",
    positionEn: "Founder / Chief Trustee / President",
    positionHi: "संस्थापक / मुख्य ट्रस्टी / अध्यक्ष",
  },
  {
    id: 2,
    nameEn: "Dr. Shravan Kumar Shukla",
    nameHi: "डॉ० श्रवण कुमार शुक्ल",
    fatherEn: "S/O Late Vaidyanath Shukla",
    fatherHi: "पुत्र स्व० वैद्यनाथ शुक्ल",
    positionEn: "Vice President",
    positionHi: "उपाध्यक्ष",
  },
  {
    id: 3,
    nameEn: "Shri Vindeshwar Kumar Shukla",
    nameHi: "श्री विंदेश्वर कुमार शुक्ल",
    fatherEn: "S/O Late Vaidyanath Shukla",
    fatherHi: "पुत्र स्व० वैद्यनाथ शुक्ल",
    positionEn: "General Secretary",
    positionHi: "महासचिव",
  },
  {
    id: 4,
    nameEn: "Shri Krishna Mohan Rai",
    nameHi: "श्री कृष्ण मोहन राय",
    fatherEn: "S/O Late Aniruddh Rai",
    fatherHi: "पुत्र स्व० अनिरुद्ध राय",
    positionEn: "Member",
    positionHi: "सदस्य",
  },
  {
    id: 5,
    nameEn: "Shri Jang Bahadur Patel",
    nameHi: "श्री जंग बहादुर पटेल",
    fatherEn: "S/O Late Chandrabali",
    fatherHi: "पुत्र स्व० चन्द्रबली",
    positionEn: "Member",
    positionHi: "सदस्य",
  }
];

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
    <div ref={ref} className="text-center">
      <p className="text-4xl md:text-5xl font-bold text-[#F47A3A]">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-white/70 mt-2 text-sm">
        {lang === "hi" ? labelHindi : label}
      </p>
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
            <h1 className="text-4xl md:text-6xl font-bold text-white font-serif leading-tight tracking-tight drop-shadow-lg">
              {lang === "en" ? "Sashakt Rashtra Nirman" : "सशक्त राष्ट्र निर्माण"}
            </h1>



          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.45 }}
            className="mt-5"
          >
            <span className="inline-block bg-gradient-to-r from-[#E8622A] to-[#D4880C] text-white text-base font-semibold py-2.5 px-8 rounded-full shadow-lg shadow-black/30">
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
              <p className="text-[#7A5C45] text-sm leading-relaxed">{h.visionText}</p>
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
                  <li key={i} className="flex items-start gap-2 text-sm text-[#7A5C45]">
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
      <section className="py-20 px-6 bg-[#FDF5EC]">
        <div className="max-w-5xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi={h.legalTitleHindi}
              english={h.legalTitle}
            />
          </FadeSection>
          <FadeSection delay={150}>
            <div className="flex flex-wrap gap-3 justify-center mt-8">
              {h.legalBadges.map((badge, i) => (
                <LegalBadge key={i} label={badge} />
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── Founding Members ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FFF9F2] border-t border-[#F0D5B8]/30">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi="संस्थापक सदस्य"
              english="Founding Members"
            />
          </FadeSection>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {foundingMembers.map((member, index) => (
              <FadeSection 
                key={member.id} 
                delay={index * 100} 
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex"
              >
                <div className="w-full group rounded-3xl p-8 bg-white border border-[#F0D5B8] shadow-sm hover:shadow-xl hover:shadow-orange-900/10 hover:border-[#E8622A]/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center h-full relative overflow-hidden">
                  
                  {/* Icon Container */}
                  <div className="w-20 h-20 rounded-2xl bg-[#FDF5EC] text-[#E8622A] group-hover:bg-gradient-to-br group-hover:from-[#E8622A] group-hover:to-[#C04A18] group-hover:text-white transition-all duration-300 flex items-center justify-center mb-6 shadow-inner">
                    <User className="w-10 h-10 opacity-90" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold font-serif mb-2 leading-snug text-xl text-[#1E0F05] group-hover:text-[#E8622A] transition-colors">
                    {lang === "en" ? member.nameEn : member.nameHi}
                  </h3>
                  <p className="text-sm text-[#7A5C45] mb-6 italic">
                    {lang === "en" ? member.fatherEn : member.fatherHi}
                  </p>

                  {/* Badge */}
                  <div className="mt-auto px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-orange-50 text-[#C04A18] border border-orange-200/50">
                    {lang === "en" ? member.positionEn : member.positionHi}
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Focus Areas ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FDF5EC]">
        <div className="max-w-5xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi={h.focusTitleHindi}
              english={h.focusTitle}
            />
          </FadeSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {h.focusAreas.map((area, i) => {
              const Icon = iconMap[area.icon] || BookOpen;
              return (
                <FadeSection key={i} delay={i * 80}>
                  <div className="bg-white rounded-xl p-5 border border-[#F0D5B8] hover:border-[#E8622A] hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 card-shimmer h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8622A]/15 to-[#E8622A]/5 flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-[#E8622A]" />
                    </div>
                    <h3 className="font-bold text-[#1E0F05] text-base mb-1">{lang === "en" ? area.title : area.titleHindi}</h3>
                    <p className="text-sm text-[#7A5C45] mt-1">{area.desc}</p>
                  </div>
                </FadeSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Impact Counter ───────────────────────────────────────────── */}
      <section className="py-20 px-6 relative bg-[#5C2710] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, white, white 1px, transparent 1px, transparent 24px)`,
          }}
        />
        <div className="absolute inset-0 hero-glow pointer-events-none opacity-60" />
        <div className="relative max-w-5xl mx-auto">
          <FadeSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
            <p className="text-center italic text-orange-200/70 mt-12 text-base max-w-xl mx-auto">
              "{lang === "en" ? h.impactQuote : h.impactQuoteHindi}"
            </p>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}

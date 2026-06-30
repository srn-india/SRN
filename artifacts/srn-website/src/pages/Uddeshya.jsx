import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  Sparkles
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useLanguage } from "../context/LanguageContext";
import { useFadeIn } from "../hooks/useFadeIn";
import { detailedObjectives } from "../data/detailedObjectives";

function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Uddeshya() {
  const { t, lang } = useLanguage();
  const u = t.uddeshya;
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sashakt Rashtra Nirman – Objectives";
  }, []);

  return (
    <div className="bg-[#FDF5EC] min-h-screen">

      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6 overflow-hidden">
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight">
            {en ? "Objectives of the Trust" : "न्यास के उद्देश्य"}
          </h1>
          <p className="text-[#7A5C45] text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed font-medium">
            {en 
              ? "Sashakt Rashtra Nirman Trust has been established to drive holistic national development through these 48 core constitutional objectives."
              : "सशक्त राष्ट्र निर्माण न्यास की स्थापना राष्ट्र के समग्र विकास के लिए इन 48 मुख्य संवैधानिक उद्देश्यों को पूरा करने के लिए की गई है।"}
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-6 mx-auto w-24 rounded-full origin-center"
          />
        </motion.div>
      </section>

      {/* ── Objectives List ─────────────────────────────────────────── */}
      <section className="pt-6 pb-4 sm:pb-6 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="space-y-6 sm:space-y-8 bg-white border border-[#F0D5B8] rounded-[2rem] p-4 sm:p-8 md:p-12 shadow-sm">
          {detailedObjectives.map((obj, index) => (
            <div key={obj.id} className="flex gap-2 sm:gap-4 items-start text-[#1E0F05]">
              <span className="text-[#E8622A] text-[0.6em] sm:text-[0.7em] mt-[0.4rem] sm:mt-[0.55rem] shrink-0">
                ●
              </span>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed font-sans text-justify pt-0.5">
                {en ? obj.en : obj.hi}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ────────────────────────────────────────────────── */}
      <section className="pt-6 pb-6 px-6 bg-[#FFF9F2] relative overflow-hidden">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[15rem] font-bold text-[#E8622A]/4 select-none pointer-events-none leading-none font-serif hidden md:block">
          M
        </div>
        <div className="max-w-4xl mx-auto relative">
          <FadeSection>
            <SectionHeader
              hindi={u.missionTitleHindi}
              english={u.missionTitle}
            />
          </FadeSection>
          <div className="mt-8 grid grid-cols-1 gap-4">
            {u.missionPoints.map((point, i) => (
              <div 
                key={point} 
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#F0D5B8] hover:border-[#E8622A]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 card-shimmer"
              >
                <span className="text-[#E8622A] text-[0.8em] mt-[0.35rem] shrink-0 select-none">
                  ●
                </span>
                <p className="text-[#1E0F05] text-base leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Legal Framework ────────────────────────────────────────── */}
      <section className="py-10 px-6 relative bg-[url('/hero-bg-3.png')] bg-fixed bg-cover bg-center overflow-hidden">
        {/* Premium Glass Overlay */}
        <div className="absolute inset-0 bg-[#1E0F05]/80 backdrop-blur-md" />
        
        {/* Animated Glowing Orbs for ambiance */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#E8622A] rounded-full blur-[100px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-[#D4880C] rounded-full blur-[100px] pointer-events-none" 
        />
        
        {/* Subtle Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
        />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <FadeSection>
            <span className="inline-block bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#F47A3A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              {en ? "Registered & Recognized" : "पंजीकृत एवं मान्यता प्राप्त"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
              {en ? u.legalTitle : u.legalTitleHindi}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#E8622A] to-[#D4880C]" />
            <p className="text-white/50 text-sm mt-2 max-w-lg mx-auto">
              {en
                ? "Fully registered and compliant under Indian law."
                : "भारतीय कानून के अंतर्गत पूर्णतः पंजीकृत एवं अनुपालन में।"}
            </p>
          </FadeSection>

          <FadeSection delay={150}>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {u.legalBadges.map((badge, i) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/8 border border-white/15 hover:border-[#E8622A]/60 hover:bg-[#E8622A]/10 text-white/80 hover:text-white rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 cursor-default flex items-center gap-2"
                >
                  <Award className="w-3.5 h-3.5 text-[#E8622A] shrink-0" />
                  {badge}
                </motion.span>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}

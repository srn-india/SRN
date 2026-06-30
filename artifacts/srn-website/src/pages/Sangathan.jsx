import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, CheckCircle, Heart } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import MemberCard from "../components/MemberCard";
import NationalBearersChart from "../components/NationalBearersChart";
import StateBearersMap from "../components/StateBearersMap";
import { useLanguage } from "../context/LanguageContext";
import { useFadeIn } from "../hooks/useFadeIn";

const valueIconMap = { Shield, Eye, CheckCircle, Heart };

function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useFadeIn(0.12);
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Sangathan() {
  const { t, lang } = useLanguage();
  const s = t.sangathan;
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sashakt Rashtra Nirman – Sangathan";
  }, []);

  return (
    <div className="bg-[#FDF5EC] font-sans selection:bg-[#E8622A] selection:text-white">

      {/* ── Banner ───────────────────────────────────────────────────── */}
      <section className="bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6">
        {/* Immersive background glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8622A]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4880C]/10 blur-[150px] rounded-full pointer-events-none" />
        
        
        
        {/* Gradient transition to next section */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#FDF5EC]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-white/60 border border-[#E8622A]/20 text-[#C04A18] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
            Our Organization
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2C1810] font-serif tracking-tight drop-shadow-sm">
            {en ? s.bannerTitle : s.bannerTitleHindi}
          </h1>
          <p className="text-[#5C3A1E] text-lg md:text-xl mt-6 max-w-2xl mx-auto font-medium">
            {s.bannerTagline}
          </p>
        </motion.div>
      </section>

      {/* ── Leadership ───────────────────────────────────────────────── */}
      <section className="pt-6 pb-24 px-6 relative z-20">
        <div className="max-w-5xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi={s.leadershipTitleHindi}
              english={s.leadershipTitle}
            />
          </FadeSection>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch mt-12">
            {/* Patron */}
            <FadeSection delay={100} className="flex-1">
              <div className="h-full bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-10 text-center shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E8622A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 inline-block bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white text-xs font-bold uppercase tracking-wider rounded-full px-5 py-2 mb-6 shadow-lg shadow-orange-900/20">
                  {en ? s.patron.badge : s.patron.badgeHindi}
                </span>
                <h3 className="relative z-10 text-3xl font-bold text-[#2C1810] font-serif leading-tight group-hover:text-[#E8622A] transition-colors duration-300">
                  {en ? s.patron.english : s.patron.nameHindi}
                </h3>
                <p className="relative z-10 text-sm text-[#7A5C45] mt-4 font-medium leading-relaxed">
                  {en ? s.patron.designation : s.patron.designationHindi}
                </p>
              </div>
            </FadeSection>

            {/* President */}
            <FadeSection delay={200} className="flex-1">
              <div className="h-full bg-gradient-to-br from-[#2C1810] to-[#0A0503] border border-[#5C3A1E] rounded-[2.5rem] p-10 text-center shadow-2xl hover:shadow-[0_20px_50px_rgba(232,98,42,0.2)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8622A]/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#E8622A]/30 transition-colors duration-500" />
                <span className="relative z-10 inline-block bg-white text-[#E8622A] text-xs font-bold uppercase tracking-wider rounded-full px-5 py-2 mb-6 shadow-md">
                  {en ? s.president.badge : s.president.badgeHindi}
                </span>
                <h3 className="relative z-10 text-3xl font-bold text-white font-serif leading-tight group-hover:text-[#FFB594] transition-colors duration-300">
                  {en ? s.president.name : s.president.nameHindi}
                </h3>
                <p className="relative z-10 text-white/70 text-sm mt-4 font-medium leading-relaxed">
                  {s.president.credentials}
                </p>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ── Advisory Board ───────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FFF9F2] relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeSection>
            <SectionHeader
              hindi={s.advisoryTitleHindi}
              english={s.advisoryTitle}
            />
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {s.advisors.map((advisor, i) => (
              <FadeSection key={i} delay={i * 70}>
                <MemberCard {...advisor} lang={lang} />
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── National Bearers ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FDF5EC]">
        <div className="max-w-7xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi="राष्ट्रीय पदाधिकारी"
              english="National Bearers"
            />
          </FadeSection>
          
          <FadeSection delay={100}>
            {/* Glassmorphic Chart Container */}
            <div className="mt-12 bg-white/60 backdrop-blur-2xl border border-white rounded-[3rem] p-6 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              <NationalBearersChart lang={lang} />
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ── State Bearers Map ────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#FFF9F2] relative overflow-hidden">
        {/* Light theme background effect */}
        <div className="absolute inset-0 bg-[#E8622A]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeSection>
            {/* Inline header for light background */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-[#2C1810] font-serif tracking-tight mb-2">
                {en ? "State Bearers" : "प्रदेश पदाधिकारी"}
              </h2>
              <div className="h-1 bg-gradient-to-r from-[#E8622A] to-[#C04A18] w-16 mx-auto rounded-full mb-6" />
              <p className="text-[#7A5C45] text-base max-w-xl mx-auto font-medium">
                {en
                  ? "Select a state on the map to view the respective state bearers."
                  : "संबंधित प्रदेश पदाधिकारियों को देखने के लिए मानचित्र पर एक राज्य चुनें।"}
              </p>
            </div>
          </FadeSection>

          <FadeSection delay={100}>
            {/* Glassmorphic Map Container (Light Mode Variant) */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-[3rem] p-6 md:p-12 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
              <StateBearersMap lang={lang} />
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}

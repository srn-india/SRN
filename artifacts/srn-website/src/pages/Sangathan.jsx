import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, CheckCircle, Heart } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import MemberCard from "../components/MemberCard";
import LegalBadge from "../components/LegalBadge";
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
    <div className="bg-[#FDF5EC]">

      {/* ── Banner ───────────────────────────────────────────────────── */}
      <section
        className="relative bg-[#1E0F05] py-28 text-center px-6 overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 mix-blend-screen"
          style={{ backgroundImage: `url('/sangathan-hero.png')` }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, white, white 1px, transparent 1px, transparent 28px)`,
          }}
        />
        <div className="absolute inset-0 hero-glow pointer-events-none opacity-70" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif tracking-tight">
            {en ? s.bannerTitle : s.bannerTitleHindi}
          </h1>
          <p className="text-orange-200/70 text-base mt-3 max-w-lg mx-auto">{s.bannerTagline}</p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-8 mx-auto w-24 rounded-full origin-center"
          />
        </motion.div>
      </section>

      {/* ── Leadership ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FDF5EC]">
        <div className="max-w-4xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi={s.leadershipTitleHindi}
              english={s.leadershipTitle}
            />
          </FadeSection>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch mt-10">
            {/* Patron */}
            <FadeSection delay={100} className="flex-1">
              <div className="h-full max-w-sm border-2 border-[#E8622A] rounded-2xl bg-white p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shimmer mx-auto sm:mx-0">
                <span className="inline-block bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white text-sm rounded-full px-4 py-1 mb-4">
                  {en ? s.patron.badge : s.patron.badgeHindi}
                </span>
                <h3 className="text-xl font-bold text-[#5C1010] font-serif leading-tight">
                  {en ? s.patron.english : s.patron.nameHindi}
                </h3>
                <p className="text-sm text-[#7A5C45] mt-2">
                  {en ? s.patron.designation : s.patron.designationHindi}
                </p>
              </div>
            </FadeSection>

            {/* President */}
            <FadeSection delay={200} className="flex-1">
              <div className="h-full max-w-sm bg-gradient-to-br from-[#1E0F05] to-[#3A1A0A] rounded-2xl p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 card-shimmer mx-auto sm:mx-0">
                <span className="inline-block bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white text-sm rounded-full px-4 py-1 mb-4">
                  {en ? s.president.badge : s.president.badgeHindi}
                </span>
                <h3 className="text-xl font-bold text-white font-serif leading-tight">
                  {en ? s.president.name : s.president.nameHindi}
                </h3>
                <p className="text-white/60 text-sm mt-2">{s.president.credentials}</p>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ── Advisory Board ───────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FFF9F2]">
        <div className="max-w-5xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi={s.advisoryTitleHindi}
              english={s.advisoryTitle}
            />
          </FadeSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {s.advisors.map((advisor, i) => (
              <FadeSection key={i} delay={i * 70}>
                <MemberCard {...advisor} lang={lang} />
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── National Bearers ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FDF5EC]">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <SectionHeader
              hindi="राष्ट्रीय पदाधिकारी"
              english="National Bearers"
            />
          </FadeSection>
          <NationalBearersChart lang={lang} />
        </div>
      </section>

      {/* ── State Bearers Map ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FFF9F2] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 28px)` }} />
        <div className="max-w-5xl mx-auto relative">
          <FadeSection>
            <SectionHeader
              hindi="प्रदेश पदाधिकारी"
              english="State Bearers"
            />
            <p className="text-center text-[#7A5C45] text-sm -mt-6 mb-10 max-w-xl mx-auto">
              {en
                ? "Select a state on the map to view the respective state bearers."
                : "संबंधित प्रदेश पदाधिकारियों को देखने के लिए मानचित्र पर एक राज्य चुनें।"}
            </p>
          </FadeSection>

          <FadeSection delay={100}>
            <StateBearersMap lang={lang} />
          </FadeSection>
        </div>
      </section>
    </div>
  );
}

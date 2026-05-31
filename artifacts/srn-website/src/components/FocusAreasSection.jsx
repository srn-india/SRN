import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownCircle, CheckCircle2, MinusCircle } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLanguage } from "../context/LanguageContext";
import { focusAreasData } from "../data/focusAreas";
import { useFadeIn } from "../hooks/useFadeIn";

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

export default function FocusAreasSection({ titleEn, titleHi }) {
  const { lang } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(10);

  const handleViewMore = () => {
    setVisibleCount(prev => {
      if (prev === 10) return 30;
      return focusAreasData.length;
    });
  };

  const handleViewLess = () => {
    setVisibleCount(10);
  };

  const visibleData = focusAreasData.slice(0, visibleCount);

  return (
    <section className="py-16 px-6 bg-[#FDF5EC] border-t border-[#F0D5B8]/30">
      <div className="max-w-6xl mx-auto">
        <FadeSection>
          <SectionHeader
            hindi={titleHi}
            english={titleEn}
          />
        </FadeSection>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 relative">
          <AnimatePresence>
            {visibleData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index > 9 ? (index % 10) * 0.05 : 0 }}
                className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white hover:bg-white hover:border-[#E8622A]/30 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex gap-3.5 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#E8622A] to-[#D4880C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="shrink-0 mt-0.5 relative z-10">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#E8622A] group-hover:bg-gradient-to-br group-hover:from-[#E8622A] group-hover:to-[#C04A18] group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-inner group-hover:shadow-md">
                    <span className="font-bold text-xs">{item.id}</span>
                  </div>
                </div>
                <p className="text-[#5C4535] text-xs md:text-sm leading-relaxed relative z-10 group-hover:text-[#2C1810] transition-colors">
                  {lang === "en" ? item.en : item.hi}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <FadeSection delay={100}>
          <div className="mt-8 flex justify-center lg:justify-end">
            {visibleCount < focusAreasData.length ? (
              <button
                onClick={handleViewMore}
                className="group flex items-center gap-2 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                {lang === "en" ? "View More" : "और देखें"}
                <ArrowDownCircle className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleViewLess}
                className="group flex items-center gap-2 bg-white border border-[#E8622A] text-[#E8622A] px-6 py-2.5 rounded-full font-bold shadow-sm hover:bg-[#E8622A]/5 hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                {lang === "en" ? "View Less" : "कम देखें"}
                <MinusCircle className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              </button>
            )}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

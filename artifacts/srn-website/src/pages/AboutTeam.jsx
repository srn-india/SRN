import { useEffect } from "react";
import { motion } from "framer-motion";
import { User, Users } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useLanguage } from "../context/LanguageContext";
import { useFadeIn } from "../hooks/useFadeIn";

function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useFadeIn(0.12);
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

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

export default function AboutTeam() {
  const { lang } = useLanguage();
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sashakt Rashtra Nirman – About the Members";
  }, []);

  return (
    <div className="bg-[#FDF5EC] font-sans selection:bg-[#E8622A] selection:text-white min-h-screen">
      {/* ── Banner ───────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#FFF9F2] via-[#FDF5EC] to-[#FDE8D7] pt-40 pb-32 text-center px-6 overflow-hidden">
        {/* Immersive background glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8622A]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4880C]/15 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Photographic Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 mix-blend-multiply"
          style={{ backgroundImage: `url('/team_hero_bg_3d.png')` }}
        />

        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#E8622A_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Gradient transition to next section */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#FDF5EC]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/60 border border-[#E8622A]/20 rounded-2xl flex items-center justify-center text-[#C04A18] backdrop-blur-md shadow-sm">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <span className="inline-block px-5 py-2 rounded-full bg-white/60 border border-[#E8622A]/20 text-[#C04A18] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm">
            {en ? "The Core Team" : "कोर टीम"}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2C1810] font-serif tracking-tight drop-shadow-sm mb-6">
            {en ? "About the Members" : "सदस्य परिचय"}
          </h1>
          <p className="text-[#5C3A1E] text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {en 
              ? "Meet the dedicated individuals who laid the foundation of Sashakt Rashtra Nirman and continue to guide our vision forward."
              : "सशक्त राष्ट्र निर्माण की नींव रखने वाले और हमारे विजन को आगे बढ़ाने वाले समर्पित व्यक्तियों से मिलें।"}
          </p>
        </motion.div>
      </section>

      {/* ── Founding Members Grid ────────────────────────────────────── */}
      <section className="pb-32 px-6 relative z-20 -mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {foundingMembers.map((member, index) => (
              <FadeSection 
                key={member.id} 
                delay={index * 100} 
                className="w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] flex"
              >
                <div className="w-full group rounded-2xl bg-white/95 backdrop-blur-md shadow-sm border border-gray-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                  
                  {/* Premium Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#E8622A] to-[#C04A18] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />
                  
                  <div className="p-8 md:p-10 flex flex-col items-center text-center flex-1">
                    {/* Sleek Icon Container */}
                    <div className="relative w-20 h-20 rounded-full bg-[#FFF9F2] border border-[#F0D5B8]/60 text-[#E8622A] flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md group-hover:bg-[#E8622A] group-hover:text-white transition-all duration-500">
                      <User className="w-8 h-8 opacity-90" strokeWidth={1.25} />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold font-serif mb-2 leading-tight text-xl md:text-2xl text-[#1E0F05] group-hover:text-[#E8622A] transition-colors duration-300">
                      {en ? member.nameEn : member.nameHi}
                    </h3>

                    <p className="text-sm md:text-base text-[#7A5C45] font-medium italic mt-2">
                      {en ? member.fatherEn : member.fatherHi}
                    </p>
                  </div>

                  {/* Structured Footer for Badge */}
                  <div className="w-full border-t border-gray-100 bg-[#FDF5EC]/50 py-4 px-6 flex justify-center group-hover:bg-[#FDF5EC] transition-colors duration-500">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-[#C04A18]">
                      {en ? member.positionEn : member.positionHi}
                    </span>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

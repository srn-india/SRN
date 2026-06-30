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
    positionEn: "Founder / Chief Trustee / President",
    positionHi: "संस्थापक / मुख्य ट्रस्टी / अध्यक्ष",
    image: ""
  },
  {
    id: 2,
    nameEn: "Dr. Shravan Kumar Shukla",
    nameHi: "डॉ० श्रवण कुमार शुक्ल",
    positionEn: "Vice President",
    positionHi: "उपाध्यक्ष",
    image: ""
  },
  {
    id: 3,
    nameEn: "Shri Vindeshwar Kumar Shukla",
    nameHi: "श्री विंदेश्वर कुमार शुक्ल",
    positionEn: "General Secretary",
    positionHi: "महासचिव",
    image: ""
  },
  {
    id: 4,
    nameEn: "Shri Krishna Mohan Rai",
    nameHi: "श्री कृष्ण मोहन राय",
    positionEn: "Member",
    positionHi: "सदस्य",
    image: ""
  },
  {
    id: 5,
    nameEn: "Shri Jang Bahadur Patel",
    nameHi: "श्री जंग बहादुर पटेल",
    positionEn: "Member",
    positionHi: "सदस्य",
    image: ""
  }
];

export default function AboutTeam() {
  const { lang } = useLanguage();
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sashakt Rashtra Nirman – Founding Members";
  }, []);

  return (
    <div className="bg-[#FDF5EC] font-sans selection:bg-[#E8622A] selection:text-white min-h-screen">
      {/* ── Banner ───────────────────────────────────────────────────── */}
      <section className="bg-[#FFF5EB] pt-[100px] pb-8 text-center px-6">
        {/* Immersive background glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8622A]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4880C]/15 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Photographic Background */}
        

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
          <span className="inline-block px-5 py-2 rounded-full bg-white/60 border border-[#E8622A]/20 text-[#C04A18] text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md shadow-sm">
            {en ? "Founding Members" : "संस्थापक सदस्य"}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#2C1810] font-serif tracking-tight drop-shadow-sm mb-4">
            {en ? "Founding Members" : "संस्थापक सदस्य"}
          </h1>
          <p className="text-[#5C3A1E] text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            {en 
              ? "Meet the dedicated individuals who laid the foundation of Sashakt Rashtra Nirman and continue to guide our vision forward."
              : "सशक्त राष्ट्र निर्माण की नींव रखने वाले और हमारे विजन को आगे बढ़ाने वाले समर्पित व्यक्तियों से मिलें।"}
          </p>
        </motion.div>
      </section>

      {/* ── Founding Members Table ────────────────────────────────────── */}
      <section className="pt-6 pb-24 px-6 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#F0D5B8] rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFF9F2] border-b border-[#F0D5B8]">
                    <th className="py-5 px-6 text-sm font-bold uppercase tracking-wider text-[#5C1010] w-24 text-center">
                      क्र.सं.
                    </th>
                    <th className="py-5 px-6 text-sm font-bold uppercase tracking-wider text-[#5C1010]">
                      नाम
                    </th>
                    <th className="py-5 px-6 text-sm font-bold uppercase tracking-wider text-[#5C1010]">
                      पद
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0D5B8]/40">
                  {foundingMembers.map((member, index) => (
                    <tr 
                      key={member.id}
                      className="hover:bg-[#FFF9F2]/30 transition-colors duration-200"
                    >
                      <td className="py-5 px-6 text-sm text-[#7A5C45] font-semibold text-center">
                        {index + 1}
                      </td>
                      <td className="py-5 px-6 text-base font-bold text-[#1E0F05] font-serif">
                        {member.nameHi}
                      </td>
                      <td className="py-5 px-6 text-sm font-medium text-[#C04A18] tracking-wide">
                        {member.positionHi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const bearersData = {
  president: {
    titleHi: "राष्ट्रीय अध्यक्ष",
    members: [
      {
        nameEn: "Dr. Manoj Kumar Shukla",
        nameHi: "डॉ. मनोज कुमार शुक्ला",
        descEn: "National President",
        descHi: "राष्ट्रीय अध्यक्ष",
        image: "/Dr.Manoj Kumar Shukla sir main.jpeg"
      }
    ]
  },
  vicePresidents: {
    titleHi: "राष्ट्रीय उपाध्यक्ष",
    members: [
      {
        nameEn: "Shri Pawan Sharma",
        nameHi: "डॉ. पवन शर्मा",
        descEn: "Himachal Pradesh",
        descHi: "हिमाचल प्रदेश",
        image: "/national_bearers/pawan_sharma.jpeg"
      },
      {
        nameEn: "Shri Mukesh Narwal",
        nameHi: "श्री मुकेश नरवाल",
        descEn: "Haryana",
        descHi: "हरियाणा",
        image: "/national_bearers/mukesh_narwal.jpeg"
      },
      {
        nameEn: "Shri T. Ammi Reddy",
        nameHi: "श्री टी. अम्मी रेड्डी",
        descEn: "Andhra Pradesh",
        descHi: "आंध्र प्रदेश",
        image: "/national_bearers/t-reddy.jpeg"
      },
      {
        nameEn: "Shri Balendra Kumar Verma",
        nameHi: "श्री बालेन्द्र कुमार वर्मा",
        descEn: "Delhi, NCR",
        descHi: "दिल्ली, एनसीआर",
        image: "/national_bearers/balendra-kumar-verma.jpeg"
      },
      {
        nameEn: "Shri Bhola Pahlwan",
        nameHi: "श्री भोला पहलवान",
        descEn: "Uttar Pradesh",
        descHi: "उत्तर प्रदेश",
        image: "/national_bearers/bhola-pahalwan.jpeg"
      }
    ]
  },
  generalSecretaries: {
    titleHi: "राष्ट्रीय महासचिव",
    members: [
      {
        nameEn: "Shri Kirti Shankar Awasthi",
        nameHi: "श्री कीर्ति शंकर अवस्थी",
        descEn: "Uttar Pradesh",
        descHi: "उत्तर प्रदेश",
        image: "/national_bearers/kirti-shankar-awasthi.jpeg"
      },
      {
        nameEn: "Shri Alok Kumar",
        nameHi: "श्री आलोक कुमार",
        descEn: "Bihar",
        descHi: "बिहार",
        image: "/national_bearers/alok-kumar.jpeg"
      },
      {
        nameEn: "Shri B.K. Shukla",
        nameHi: "श्री बी.के. शुक्ला",
        descEn: "मुख्य महासचिव",
        descHi: "मुख्य महासचिव",
        image: "/national_bearers/b-k-shukla.jpeg"
      }
    ]
  },
  secretaries: {
    titleHi: "राष्ट्रीय सचिव",
    members: [
      {
        nameEn: "Advocate Kripa Shankar",
        nameHi: "अधिवक्ता कृपा शंकर",
        descEn: "Delhi",
        descHi: "दिल्ली",
        image: "/national_bearers/adhivakta-kripa-shankar.jpeg"
      },
      {
        nameEn: "Shri Vikash Shankar",
        nameHi: "श्री विकाश शंकर",
        descEn: "Uttarakhand",
        descHi: "उत्तराखंड",
        image: "/national_bearers/vikas-shankar.jpeg"
      },
      {
        nameEn: "Shri Rajesh Mehta",
        nameHi: "श्री राजेश मेहता",
        descEn: "Uttarakhand",
        descHi: "उत्तराखंड",
        image: "/national_bearers/rajesh-mehta.jpeg"
      }
    ]
  },
  jointSecretaries: {
    titleHi: "राष्ट्रीय सह-सचिव",
    members: [
      {
        nameEn: "Shri Krishnadu Dhananjaya",
        nameHi: "श्री कृष्णदु धनंजय",
        descEn: "Andhra Pradesh",
        descHi: "आंध्र प्रदेश",
        image: "/national_bearers/krishnadu-dhananjaya.jpeg"
      }
    ]
  }
};

function MemberCard({ member, lang }) {
  const en = lang === "en";
  const name = en ? member.nameEn : member.nameHi;
  const desc = en ? member.descEn : member.descHi;
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center w-full max-w-[210px] group"
    >
      {/* 3:4 Aspect Ratio Image/Placeholder */}
      <div className="w-full aspect-[3/4] rounded-2xl bg-white border border-[#E8D5B8] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-[#E8622A]/40 group-hover:shadow-md">
        {member.image && !imageError ? (
          <img
            src={member.image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            onError={() => setImageError(true)}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[#FDF5EC]/30 pointer-events-none" />
            <UserRound className="w-12 h-12 text-[#B89070]/30 transition-transform duration-300 group-hover:scale-105" />
            <span className="text-[10px] uppercase tracking-widest text-[#B89070]/40 font-bold mt-2 select-none">
              {en ? "No Image" : "चित्र नहीं है"}
            </span>
          </>
        )}
      </div>

      {/* Name and Designation */}
      <h3 className="mt-4 text-base md:text-lg font-bold font-serif text-[#2C1810] leading-tight transition-colors duration-300 group-hover:text-[#E8622A]">
        {name}
      </h3>
      {desc && (
        <p className="mt-1 text-xs md:text-sm text-[#7A5C45] font-medium leading-normal">
          {desc}
        </p>
      )}
    </motion.div>
  );
}

export default function NationalOfficeBearers() {
  const { lang } = useLanguage();
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en 
      ? "Sashakt Rashtra Nirman – National Office Bearers" 
      : "सशक्त राष्ट्र निर्माण – राष्ट्रीय पदाधिकारी";
  }, [en]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] relative overflow-hidden font-sans selection:bg-[#E8622A] selection:text-white">
      {/* Monochromatic background image watermark style */}
      <div 
        className="absolute inset-0 bg-repeat opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: "url('/national_bearers_monochrome_bg.png')" }}
      />
      
      {/* ── Banner/Hero ────────────────────────────────────────────── */}
      <section className="relative bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6 overflow-hidden border-b border-[#E8D5B8]/30">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.32]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >
          <span className="inline-block bg-[#E8622A]/10 border border-[#E8622A]/20 text-[#E8622A] text-xs md:text-sm font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-sm">
            {en ? "Organization Leadership" : "संगठन नेतृत्व"}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight">
            {en ? "National Office Bearers" : "राष्ट्रीय पदाधिकारी"}
          </h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-5 mx-auto w-20 rounded-full origin-center shadow-sm"
          />
        </motion.div>
      </section>

      {/* ── Sections and grids ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10 space-y-14">
        
        {/* 1. National President */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-6 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {bearersData.president.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <div className="flex justify-center w-full">
            {bearersData.president.members.map((member, i) => (
              <MemberCard key={i} member={member} lang={lang} />
            ))}
          </div>
        </section>

        {/* 2. Vice Presidents */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-6 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {bearersData.vicePresidents.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 w-full justify-items-center justify-center">
            {bearersData.vicePresidents.members.map((member, i) => (
              <MemberCard key={i} member={member} lang={lang} />
            ))}
          </div>
        </section>

        {/* 4. General Secretaries */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-6 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {bearersData.generalSecretaries.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 w-full justify-items-center justify-center max-w-3xl">
            {bearersData.generalSecretaries.members.map((member, i) => (
              <MemberCard key={i} member={member} lang={lang} />
            ))}
          </div>
        </section>

        {/* 5. Secretaries */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-6 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {bearersData.secretaries.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 w-full justify-items-center justify-center max-w-3xl">
            {bearersData.secretaries.members.map((member, i) => (
              <MemberCard key={i} member={member} lang={lang} />
            ))}
          </div>
        </section>

        {/* 6. Joint Secretaries */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-6 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {bearersData.jointSecretaries.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <div className="grid grid-cols-1 gap-8 md:gap-12 w-full justify-items-center justify-center">
            {bearersData.jointSecretaries.members.map((member, i) => (
              <MemberCard key={i} member={member} lang={lang} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

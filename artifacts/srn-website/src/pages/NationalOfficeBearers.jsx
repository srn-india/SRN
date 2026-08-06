import { useEffect } from "react";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const bearersData = {
  president: {
    titleEn: "National President",
    titleHi: "राष्ट्रीय अध्यक्ष",
    members: [
      {
        nameEn: "Dr. Manoj Kumar Shukla",
        nameHi: "डॉ. मनोज कुमार शुक्ला",
        descEn: "National President",
        descHi: "राष्ट्रीय अध्यक्ष"
      }
    ]
  },
  vicePresidents: {
    titleEn: "Vice Presidents",
    titleHi: "राष्ट्रीय उपाध्यक्ष",
    members: [
      {
        nameEn: "Shri Pawan Sharma",
        nameHi: "श्री पवन शर्मा",
        descEn: "Lok Sabha TV - Himachal Pradesh",
        descHi: "लोक सभा टीवी - हिमाचल प्रदेश"
      },
      {
        nameEn: "Shri Mukesh Narwal",
        nameHi: "श्री मुकेश नरवाल",
        descEn: "Ex. Spokesperson, K.M - BJP Haryana",
        descHi: "पूर्व प्रवक्ता, K.M - भाजपा हरियाणा"
      },
      {
        nameEn: "Shri B.K Verma",
        nameHi: "श्री बी.के. वर्मा",
        descEn: "President, Delhi-NCR Jewellers Association (Delhi)",
        descHi: "अध्यक्ष, दिल्ली-एनसीआर ज्वेलर्स एसोसिएशन (दिल्ली)"
      },
      {
        nameEn: "Shri Bhola Pahlwan",
        nameHi: "श्री भोला पहलवान",
        descEn: "General Secretary, Kisan Union (West UP)",
        descHi: "महासचिव, किसान यूनियन (पश्चिम उ.प्र.)"
      }
    ]
  },
  generalSecretaries: {
    titleEn: "General Secretaries",
    titleHi: "राष्ट्रीय महासचिव",
    members: [
      {
        nameEn: "Shri K.S Awasthi",
        nameHi: "श्री के.एस. अवस्थी",
        descEn: "Ex. Bureaucrat & OSD (Uttar Pradesh)",
        descHi: "पूर्व नौकरशाह एवं ओएसडी (उत्तर प्रदेश)"
      },
      {
        nameEn: "Shri Alok Kumar",
        nameHi: "श्री आलोक कुमार",
        descEn: "Renowned News Anchor & Editor, Sayonjit (Bihar)",
        descHi: "प्रख्यात समाचार एंकर एवं संपादक, सायुंज्य (बिहार)"
      }
    ]
  },
  secretaries: {
    titleEn: "Secretaries",
    titleHi: "राष्ट्रीय सचिव",
    members: [
      {
        nameEn: "Shri Kripa Shankar",
        nameHi: "श्री कृपा शंकर",
        descEn: "Ex. Secretary, INC (Uttar Pradesh)",
        descHi: "पूर्व सचिव, कांग्रेस (उत्तर प्रदेश)"
      },
      {
        nameEn: "Shri Vikash Shankar",
        nameHi: "श्री विकास शंकर",
        descEn: "Spokesperson, VHP Delhi & Entrepreneur",
        descHi: "प्रवक्ता, विहिप दिल्ली एवं उद्यमी"
      },
      {
        nameEn: "Shri Rajesh Mehta",
        nameHi: "श्री राजेश मेहता",
        descEn: "President, Badrinath Hotel Association (Uttarakhand)",
        descHi: "अध्यक्ष, बद्रीनाथ होटल एसोसिएशन (उत्तराखंड)"
      },
      {
        nameEn: "Shri Krishnendu Dhananjaya",
        nameHi: "श्री कृष्णेंदु धनंजय",
        descEn: "Social Worker, Tirupati (Andhra Pradesh)",
        descHi: "सामाजिक कार्यकर्ता, तिरुपति (आंध्र प्रदेश)"
      }
    ]
  },
  jointSecretaries: {
    titleEn: "Joint Secretaries",
    titleHi: "राष्ट्रीय सह-सचिव",
    members: [] // Show placeholder
  }
};

function MemberCard({ member, lang }) {
  const en = lang === "en";
  const name = en ? member.nameEn : member.nameHi;
  const desc = en ? member.descEn : member.descHi;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center w-full max-w-[210px] group"
    >
      {/* 3:4 Aspect Ratio Blank Space Placeholder */}
      <div className="w-full aspect-[3/4] rounded-2xl bg-white border border-[#E8D5B8] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-[#E8622A]/40 group-hover:shadow-md">
        <div className="absolute inset-0 bg-[#FDF5EC]/30 pointer-events-none" />
        <UserRound className="w-12 h-12 text-[#B89070]/30 transition-transform duration-300 group-hover:scale-105" />
        <span className="text-[10px] uppercase tracking-widest text-[#B89070]/40 font-bold mt-2 select-none">
          {en ? "No Image" : "चित्र नहीं है"}
        </span>
      </div>

      {/* Name and Designation */}
      <h3 className="mt-4 text-base md:text-lg font-bold font-serif text-[#2C1810] leading-tight transition-colors duration-300 group-hover:text-[#E8622A]">
        {name}
      </h3>
      <p className="mt-1 text-xs md:text-sm text-[#7A5C45] font-medium leading-normal">
        {desc}
      </p>
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
      <div className="max-w-6xl mx-auto px-6 py-16 relative z-10 space-y-20">
        
        {/* 1. National President */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-10 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {en ? bearersData.president.titleEn : bearersData.president.titleHi}
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
          <div className="inline-flex items-center gap-3 mb-10 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {en ? bearersData.vicePresidents.titleEn : bearersData.vicePresidents.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full justify-items-center justify-center">
            {bearersData.vicePresidents.members.map((member, i) => (
              <MemberCard key={i} member={member} lang={lang} />
            ))}
          </div>
        </section>

        {/* 3. General Secretaries */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-10 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {en ? bearersData.generalSecretaries.titleEn : bearersData.generalSecretaries.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 w-full justify-items-center justify-center max-w-xl">
            {bearersData.generalSecretaries.members.map((member, i) => (
              <MemberCard key={i} member={member} lang={lang} />
            ))}
          </div>
        </section>

        {/* 4. Secretaries */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-10 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {en ? bearersData.secretaries.titleEn : bearersData.secretaries.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 w-full justify-items-center justify-center">
            {bearersData.secretaries.members.map((member, i) => (
              <MemberCard key={i} member={member} lang={lang} />
            ))}
          </div>
        </section>

        {/* 5. Joint Secretaries */}
        <section className="flex flex-col items-center">
          <div className="inline-flex items-center gap-3 mb-8 border-b border-[#E8622A]/20 pb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
            <h2 className="text-xl md:text-2xl font-bold font-serif text-[#5C1010] tracking-wide">
              {en ? bearersData.jointSecretaries.titleEn : bearersData.jointSecretaries.titleHi}
            </h2>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A]" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="w-full max-w-md bg-white/40 border border-dashed border-[#E8D5B8] rounded-2xl p-6 text-center shadow-sm"
          >
            <p className="text-sm font-medium text-[#7A5C45]/80 italic">
              {en 
                ? "Nominations are currently underway. Office bearers list will be updated soon." 
                : "मनोनयन प्रक्रिया वर्तमान में गतिमान है। पदाधिकारियों की सूची शीघ्र ही अपडेट की जाएगी।"}
            </p>
          </motion.div>
        </section>

      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const boardMembers = [
  {
    name: "श्री ( डॉ. ) शैलेन्द्र कुमार जोशी",
    highlight: "आईआईएस 1984",
    image: "/national_bearers/shailendra-kumar-joshi.jpeg",
    details: [
      "बी.टेक (आईआईटी रुड़की), एम.टेक (आईआईटी दिल्ली), पी.एच.डी. (टेरी विश्वविद्यालय)",
      "पूर्व मुख्य सचिव, तेलंगाना सरकार"
    ]
  },
  {
    name: (
      <span>
        <span className="font-bold">पद्मश्री</span> डॉ. पी. एल. गौतम जी
      </span>
    ),
    highlight: (
      <span>
        <strong className="font-bold text-[#5C1010]">कुलाधिपति</strong>, डॉ. राजेन्द्र प्रसाद केंद्रीय कृषि विश्वविद्यालय
      </span>
    ),
    image: "/padamshri-dr-p-l-gautam.jpeg",
    isCustomStyled: true,
    details: [
      <span>
        पूर्व <strong className="font-bold text-[#5C1010]">कुलपति</strong>, जी. बी. पंत कृषि एवं प्रौद्योगिकी विश्वविद्यालय
      </span>,
      <strong className="font-bold text-[#5C1010]">पूर्व अध्यक्ष</strong>,
      <span>
        राष्ट्रीय जैव विविधता प्राधिकरण, <strong className="font-bold text-[#5C1010]">भारत सरकार, एवं</strong>
      </span>,
      <span>
        पौधा किस्म एवं कृषक अधिकार संरक्षण प्राधिकरण
      </span>
    ]
  },
  {
    name: "श्री विभूति भूषण प्रधान",
    highlight: "आई.पी.एस. 1985",
    image: "/national_bearers/bibuthi-bhusan-pradhan.jpeg",
    details: [
      "पूर्व महानिदेशक, झारखंड पुलिस",
      "राष्ट्रपति पुलिस पदक से सम्मानित"
    ]
  },
  {
    name: "श्री बजरंग लाल कोटरीवाला",
    highlight: "पूर्व संयुक्त सलाहकार, नीति आयोग, भारत सरकार",
    image: "/national_bearers/b-l-kotriwala.jpeg",
    details: [
      "पूर्व सलाहकार लोकायुक्त राजस्थान",
      "पूर्व क्षेत्रीय नियंत्रक खान- आईबीएम अजमेर"
    ]
  },
  {
    name: "श्री अरुण कुमार शुक्ल",
    highlight: "पूर्व अध्यक्ष एवं प्रबंध निदेशक",
    image: "/national_bearers/arun-kumar-shukla.jpeg",
    details: [
      "हिंदुस्तान कॉपर लिमिटेड - भारत सरकार"
    ]
  },
  {
    name: "श्री विनोद कोहली",
    highlight: "बी.टेक (इलेक्ट्रिकल-आईआईटी दिल्ली) 1972",
    image: "/national_bearers/vinod-kohali.jpeg",
    details: [
      "सदस्य, कार्यकारी परिषद, उत्तराखण्ड प्रौद्योगिकी विश्वविद्यालय",
      "प्रबंध निदेशक, क्यूजीनस इन्फोटेक प्राइवेट लिमिटेड"
    ]
  },
  {
    name: "श्री कुंवर नीरज सिंह",
    highlight: "राष्ट्रीय सह- सचिव",
    image: "/national_bearers/niraj-singh.jpeg",
    details: [
      "लोकभारती"
    ]
  }
];

function AdvisoryMemberCard({ member, idx, lang }) {
  const en = lang === "en";
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: (idx % 4) * 0.1 }}
      className="flex flex-col items-center text-center space-y-2 group w-full"
    >
      {/* 3:4 Aspect Ratio Image/Placeholder */}
      <div className="w-full max-w-[210px] aspect-[3/4] rounded-2xl bg-white border border-[#E8D5B8] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-[#E8622A]/40 group-hover:shadow-md mb-2">
        {member.image && !imageError ? (
          <img
            src={member.image}
            alt={member.name}
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

      {/* Name - Regular font size, light weight */}
      <h3 className="text-xl md:text-2xl font-light text-[#2C1810] font-serif group-hover:text-[#E8622A] transition-colors duration-300">
        {member.name}
      </h3>
      
      {/* Highlight/Designation - Bold text (except for idx === 5 where it is a degree) */}
      <p className={`text-base leading-snug ${
        member.isCustomStyled
          ? ""
          : (idx === 5 ? "text-sm md:text-base text-[#7A5C45] font-medium" : "font-bold text-[#5C1010]")
      }`}>
        {member.highlight}
      </p>
      
      {/* Details - Normal text */}
      <div className="space-y-0.5 pt-0.5">
        {member.details.map((detail, dIdx) => (
          <p 
            key={dIdx} 
            className={`text-sm md:text-base text-[#7A5C45] leading-normal ${
              member.isCustomStyled
                ? ""
                : ((idx === 0 && dIdx === member.details.length - 1) || idx !== 0 ? "font-bold text-[#5C1010]" : "")
            }`}
          >
            {detail}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export default function AdvisoryBoard() {
  const { lang } = useLanguage();
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en 
      ? "Sashakt Rashtra Nirman – Advisory Board" 
      : "सशक्त राष्ट्र निर्माण – सलाहकार मंडल";
  }, [en]);

  return (
    <div className="bg-[#FDF5EC] min-h-screen pb-6">
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6 overflow-hidden">
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.32]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >

          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            {en ? "Advisory Board" : "सलाहकार मंडल"}
          </h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-5 mx-auto w-24 rounded-full origin-center shadow-sm"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-[#7A5C45] text-sm md:text-base mt-6 max-w-xl mx-auto leading-relaxed font-medium"
          >
            {en 
              ? "Distinguished policy experts, administrative leaders, and advisors guiding the nation-building initiatives of Sashakt Rashtra Nirman."
              : "सशक्त राष्ट्र निर्माण की लोक-कल्याणकारी पहलों को दिशा देने वाले प्रख्यात प्रशासनिक अधिकारी, नीति-विशेषज्ञ और मार्गदर्शक।"}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Members Section ────────────────────────────────────────── */}
      <section className="px-6 pt-8 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-x-10 md:gap-y-20 max-w-7xl mx-auto justify-items-center">
            {boardMembers.map((member, idx) => (
              <AdvisoryMemberCard key={idx} member={member} idx={idx} lang={lang} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

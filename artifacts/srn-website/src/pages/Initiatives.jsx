import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const primaryEn = [
  "Civic Issues",
  "Education & Literacy",
  "Health & Family Welfare",
  "Women's Development & Empowerment",
  "Youth Affairs"
];

const primaryHi = [
  "नागरिक मुद्दे",
  "शिक्षा और साक्षरता",
  "स्वास्थ्य और परिवार कल्याण",
  "महिला विकास और सशक्तिकरण",
  "युवा मामले"
];

const secondaryEn = [
  "Agriculture",
  "Animal Husbandry",
  "Dairying & Fisheries",
  "Art & Culture",
  "Biotechnology",
  "Children",
  "Dalit Upliftment",
  "Differently Abled",
  "Disaster Management",
  "Drinking Water",
  "Aged/Elderly",
  "Environment & Forests",
  "Food Processing",
  "HIV/AIDS",
  "Housing",
  "Human Rights",
  "Information & Communication Technology",
  "Labour & Employment",
  "Land Resources",
  "Legal Awareness & Aid",
  "Micro Finance (SHGs)",
  "Micro Small & Medium Enterprises",
  "Minority Issues",
  "New & Renewable Energy",
  "Nutrition",
  "Panchayati Raj",
  "Prisoner's Issues",
  "Right to Information & Advocacy",
  "Rural Development & Poverty Alleviation",
  "Science & Technology",
  "Scientific & Industrial Research",
  "Sports",
  "Tourism",
  "Tribal Affairs",
  "Urban Development & Poverty Alleviation",
  "Vocational Training",
  "Water Resources",
  "Skill Development",
  "Animal Welfare",
  "Religious"
];

const secondaryHi = [
  "कृषि",
  "पशुपालन",
  "डेयरी और मत्स्य पालन",
  "कला और संस्कृति",
  "जैव प्रौद्योगिकी",
  "बाल कल्याण",
  "दलित उत्थान",
  "दिव्यांगजन",
  "आपदा प्रबंधन",
  "पेयजल",
  "वृद्ध/बुजुर्ग",
  "पर्यावरण और वन",
  "खाद्य प्रसंस्करण",
  "एचआईवी/एड्स",
  "आवास",
  "मानवाधिकार",
  "सूचना और संचार प्रौद्योगिकी",
  "श्रम और रोजगार",
  "भूमि संसाधन",
  "कानूनी जागरूकता और सहायता",
  "माइक्रो फाइनेंस (स्वयं सहायता समूह - SHGs)",
  "सूक्ष्म, लघु और मध्यम उद्यम",
  "अल्पसंख्यक मुद्दे",
  "नवीन और नवीकरणीय ऊर्जा",
  "पोषण",
  "पंचायती राज",
  "कैदियों के मुद्दे",
  "सूचना का अधिकार और वकालत",
  "ग्रामीण विकास और गरीबी उन्मूलन",
  "विज्ञान और प्रौद्योगिकी",
  "वैज्ञानिक और औद्योगिक अनुसंधान",
  "खेल",
  "पर्यटन",
  "जनजातीय मामले",
  "शहरी विकास और गरीबी उन्मूलन",
  "व्यावसायिक प्रशिक्षण",
  "जल संसाधन",
  "कौशल विकास",
  "पशु कल्याण",
  "धार्मिक"
];

export default function Initiatives() {
  const { lang } = useLanguage();
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en 
      ? "Our Initiatives | Sashakt Rashtra Nirman"
      : "हमारी पहल | सशक्त राष्ट्र निर्माण";
  }, [en]);

  const primaryList = en ? primaryEn : primaryHi;
  const secondaryList = en ? secondaryEn : secondaryHi;

  return (
    <div className="bg-[#FDF5EC] min-h-screen pb-20 selection:bg-[#E8622A] selection:text-white">
      
      {/* ── Banner Section ─────────────────────────────────────────── */}
      <section className="relative bg-[#1E0F05] py-32 text-center px-6 overflow-hidden flex items-center justify-center min-h-[44vh] border-b border-[#F0D5B8]/20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-multiply"
          style={{ backgroundImage: `url('/init_hero_bg_1779216907662.png')` }}
        />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 28px)` }}
        />

        {/* Glow accents */}
        <div className="absolute top-12 left-16 w-56 h-56 rounded-full bg-[#E8622A]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-12 right-16 w-48 h-48 rounded-full bg-[#D4880C]/10 blur-[80px] pointer-events-none" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F05]/90 via-[#1E0F05]/40 to-[#1E0F05]/10 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10 pt-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif tracking-tight leading-tight drop-shadow-md">
            {en ? (
              <>Our <span className="text-[#E8622A]">Initiatives</span></>
            ) : (
              <>हमारी <span className="text-[#E8622A]">पहल</span></>
            )}
          </h1>
          <p className="text-[#F47A3A] font-bold tracking-[0.15em] uppercase text-xs md:text-sm mt-3 mb-6">
            {en ? "Focus Sectors & Core Areas" : "मुख्य क्षेत्र एवं विकास आयाम"}
          </p>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            {en 
              ? "Driving systemic change through comprehensive programs designed to empower the youth, uplift the marginalized, and integrate the nation through core focus areas."
              : "युवाओं को सशक्त बनाने, वंचितों के उत्थान और व्यापक फोकस क्षेत्रों के माध्यम से राष्ट्र को एकीकृत करने के लिए डिज़ाइन किए गए रचनात्मक कार्यक्रमों द्वारा प्रणालीगत परिवर्तन लाना।"}
          </p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-6 mx-auto w-24 rounded-full origin-center shadow-sm"
          />
        </motion.div>
      </section>

      {/* ── Initiatives Content ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 text-left mt-20">
        
        {/* Primary Initiatives */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#5C1010] mb-6 border-b border-[#F0D5B8] pb-2">
            {en ? "Primary Initiatives" : "प्राथमिक पहल"}
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-base md:text-lg text-[#1E0F05] font-sans">
            {primaryList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary Initiatives */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#5C1010] mb-6 border-b border-[#F0D5B8] pb-2">
            {en ? "Secondary Initiatives" : "द्वितीयक पहल"}
          </h2>
          <ul className="list-disc pl-6 space-y-3 text-base md:text-lg text-[#1E0F05] font-sans">
            {secondaryList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
}

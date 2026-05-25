import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, BookOpen, HeartPulse, Users, Zap, MousePointer2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const ecosystems = [
  {
    id: "civic",
    icon: Landmark,
    titleEn: "Civic Issues",
    titleHi: "नागरिक मुद्दे",
    descEn: "Addressing local infrastructure, governance, and civic amenities to improve the quality of daily life for citizens. We aim to build sustainable and transparent systems for rural and urban development.",
    descHi: "नागरिकों के दैनिक जीवन की गुणवत्ता में सुधार के लिए स्थानीय बुनियादी ढांचे, शासन और नागरिक सुविधाओं को संबोधित करना। हमारा लक्ष्य ग्रामीण और शहरी विकास के लिए टिकाऊ और पारदर्शी सिस्टम बनाना है।",
    tags: [
      { en: "Housing", hi: "आवास" },
      { en: "Drinking Water", hi: "पेयजल" },
      { en: "Environment & Forests", hi: "पर्यावरण और वन" },
      { en: "Disaster Management", hi: "आपदा प्रबंधन" },
      { en: "Rural Development & Poverty Alleviation", hi: "ग्रामीण विकास और गरीबी उन्मूलन" },
      { en: "Urban Development & Poverty Alleviation", hi: "शहरी विकास और गरीबी उन्मूलन" },
      { en: "Panchayati Raj", hi: "पंचायती राज" },
      { en: "Land Resources", hi: "भूमि संसाधन" },
      { en: "Water Resources", hi: "जल संसाधन" },
      { en: "New & Renewable Energy", hi: "नवीन और नवीकरणीय ऊर्जा" },
      { en: "Right to Information & Advocacy", hi: "सूचना का अधिकार और वकालत" },
      { en: "Tourism", hi: "पर्यटन" },
      { en: "Art & Culture", hi: "कला और संस्कृति" },
      { en: "Religious", hi: "धार्मिक" },
    ]
  },
  {
    id: "edu",
    icon: BookOpen,
    titleEn: "Education & Literacy",
    titleHi: "शिक्षा और साक्षरता",
    descEn: "Empowering communities through accessible education, skill building, and promoting lifelong literacy. We bridge the technological divide through robust industrial and scientific research initiatives.",
    descHi: "सुलभ शिक्षा, कौशल निर्माण और आजीवन साक्षरता को बढ़ावा देने के माध्यम से समुदायों को सशक्त बनाना। हम मजबूत औद्योगिक और वैज्ञानिक अनुसंधान पहल के माध्यम से तकनीकी विभाजन को पाटते हैं।",
    tags: [
      { en: "Science & Technology", hi: "विज्ञान और प्रौद्योगिकी" },
      { en: "Scientific & Industrial Research", hi: "वैज्ञानिक और औद्योगिक अनुसंधान" },
      { en: "Information & Communication Technology", hi: "सूचना और संचार प्रौद्योगिकी" },
      { en: "Skill Development", hi: "कौशल विकास" },
      { en: "Vocational Training", hi: "व्यावसायिक प्रशिक्षण" },
    ]
  },
  {
    id: "health",
    icon: HeartPulse,
    titleEn: "Health & Family Welfare",
    titleHi: "स्वास्थ्य और परिवार कल्याण",
    descEn: "Ensuring access to essential healthcare, maternal health, and family welfare programs for all demographics, extending our care to animal welfare and sustainable agriculture.",
    descHi: "सभी जनसांख्यिकी के लिए आवश्यक स्वास्थ्य देखभाल, मातृ स्वास्थ्य और परिवार कल्याण कार्यक्रमों तक पहुंच सुनिश्चित करना, पशु कल्याण और टिकाऊ कृषि तक हमारी देखभाल का विस्तार करना।",
    tags: [
      { en: "Nutrition", hi: "पोषण" },
      { en: "HIV/AIDS", hi: "एचआईवी/एड्स" },
      { en: "Aged/Elderly", hi: "बुजुर्ग/वृद्ध" },
      { en: "Differently Abled", hi: "दिव्यांगजन" },
      { en: "Animal Welfare", hi: "पशु कल्याण" },
      { en: "Animal Husbandry", hi: "पशुपालन" },
      { en: "Dairying & Fisheries", hi: "डेयरी और मत्स्य पालन" },
      { en: "Agriculture", hi: "कृषि" },
      { en: "Food Processing", hi: "खाद्य प्रसंस्करण" },
      { en: "Biotechnology", hi: "जैव प्रौद्योगिकी" },
    ]
  },
  {
    id: "women",
    icon: Users,
    titleEn: "Women's Development & Empowerment",
    titleHi: "महिला विकास और सशक्तिकरण",
    descEn: "Promoting gender equality, financial independence, and safety for women across all sectors of society by supporting micro-finance and small enterprises.",
    descHi: "माइक्रो फाइनेंस और छोटे उद्यमों का समर्थन करके समाज के सभी क्षेत्रों में महिलाओं के लिए लैंगिक समानता, वित्तीय स्वतंत्रता और सुरक्षा को बढ़ावा देना।",
    tags: [
      { en: "Micro Finance (SHGs)", hi: "माइक्रो फाइनेंस (स्वयं सहायता समूह)" },
      { en: "Micro Small & Medium Enterprises", hi: "सूक्ष्म, लघु और मध्यम उद्यम" },
    ]
  },
  {
    id: "youth",
    icon: Zap,
    titleEn: "Youth Affairs",
    titleHi: "युवा मामले",
    descEn: "Guiding the energy of the youth into constructive national development through leadership, sports, and robust employment opportunities while safeguarding fundamental human rights.",
    descHi: "बुनियादी मानवाधिकारों की रक्षा करते हुए नेतृत्व, खेल और मजबूत रोजगार के अवसरों के माध्यम से युवाओं की ऊर्जा को रचनात्मक राष्ट्रीय विकास में मार्गदर्शन करना।",
    tags: [
      { en: "Sports", hi: "खेल" },
      { en: "Labour & Employment", hi: "श्रम और रोजगार" },
      { en: "Children", hi: "बच्चे" },
      { en: "Dalit Upliftment", hi: "दलित उत्थान" },
      { en: "Human Rights", hi: "मानवाधिकार" },
      { en: "Minority Issues", hi: "अल्पसंख्यक मुद्दे" },
      { en: "Tribal Affairs", hi: "जनजातीय मामले" },
      { en: "Prisoner's Issues", hi: "कैदियों के मुद्दे" },
      { en: "Legal Awareness & Aid", hi: "कानूनी जागरूकता और सहायता" },
    ]
  }
];

export default function Initiatives() {
  const { lang } = useLanguage();
  const en = lang === "en";
  const [activeTab, setActiveTab] = useState(ecosystems[0].id);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Our Initiatives | Sashakt Rashtra Nirman";
  }, []);

  const activeEcosystem = ecosystems.find(e => e.id === activeTab);
  const ActiveIcon = activeEcosystem.icon;

  return (
    <div className="bg-[#FDF5EC] min-h-screen">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#1E0F05] py-32 text-center px-6 overflow-hidden flex items-center justify-center min-h-[45vh] border-b-[6px] border-[#E8622A]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url('/init_hero_bg_1779216907662.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F05] via-[#1E0F05]/70 to-[#1E0F05]/30" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10 pt-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif leading-tight drop-shadow-lg mb-4">
            {en ? (
              <>Our <span className="text-[#E8622A]">Initiatives</span></>
            ) : (
              <>हमारी <span className="text-[#E8622A]">पहल</span></>
            )}
          </h1>
          <p className="text-[#F47A3A] font-medium tracking-wide uppercase text-sm md:text-base mb-6 drop-shadow-md">
            {en ? "Ecosystem Map" : "पारिस्थितिकी तंत्र का नक्शा"}
          </p>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            {en 
              ? "Driving systemic change through targeted programs designed to empower the youth, uplift the marginalized, and integrate the nation through comprehensive focus areas."
              : "युवाओं को सशक्त बनाने, हाशिए पर रहने वालों के उत्थान और व्यापक फोकस क्षेत्रों के माध्यम से राष्ट्र को एकीकृत करने के लिए डिज़ाइन किए गए लक्षित कार्यक्रमों के माध्यम से प्रणालीगत परिवर्तन को गति देना।"}
          </p>
        </motion.div>
      </section>

      {/* ── Interactive Ecosystem Viewer ───────────────────────────── */}
      <section className="pt-24 pb-32 px-6 bg-[#FDF5EC] relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 24px)` }} />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 relative z-10">
          
          {/* Left: The Pillars (Tabs) */}
          <div className="lg:w-1/3 flex flex-col gap-4">
            <h2 className="text-2xl font-serif font-bold text-[#5C1010] mb-4 pl-2 opacity-90">
              {en ? "The 5 Pillars" : "5 स्तंभ"}
            </h2>
            {ecosystems.map((eco) => {
              const isActive = activeTab === eco.id;
              const Icon = eco.icon;
              return (
                <button
                  key={eco.id}
                  onClick={() => setActiveTab(eco.id)}
                  className={`flex items-center gap-5 w-full p-5 rounded-2xl border text-left transition-all duration-500 group ${
                    isActive 
                      ? "bg-white border-[#E8622A]/50 shadow-[0_4px_20px_rgba(232,98,42,0.15)]" 
                      : "bg-[#FFF9F2] border-[#F0D5B8] hover:bg-white hover:border-[#E8622A]/30 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                    isActive 
                      ? "bg-gradient-to-br from-[#E8622A] to-[#C04A18] text-white shadow-lg shadow-orange-900/20 scale-110" 
                      : "bg-[#FDF5EC] text-[#E8622A] group-hover:bg-[#F47A3A]/10 group-hover:text-[#C04A18]"
                  }`}>
                    <Icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5} />
                  </div>
                  <div>
                    <div className={`font-bold text-lg md:text-xl font-serif transition-colors duration-500 ${
                      isActive ? "text-[#E8622A]" : "text-[#1E0F05] group-hover:text-[#5C1010]"
                    }`}>
                      {en ? eco.titleEn : eco.titleHi}
                    </div>
                  </div>
                  {/* Active Indicator Arrow */}
                  {isActive && (
                    <motion.div layoutId="activeTabIndicator" className="ml-auto w-2 h-2 rounded-full bg-[#E8622A]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: The Deep Dive */}
          <div className="lg:w-2/3 flex flex-col mt-8 lg:mt-0 min-h-[600px]">
             <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white border border-[#F0D5B8] rounded-3xl p-8 md:p-14 h-full flex flex-col relative overflow-hidden shadow-xl shadow-orange-900/5"
                >
                   {/* Large background icon ghost */}
                   <ActiveIcon className="absolute -bottom-10 -right-10 w-80 h-80 text-[#E8622A]/[0.05] pointer-events-none -rotate-12" strokeWidth={0.5} />
                   
                   <div className="relative z-10">
                     <h3 className="text-3xl md:text-5xl font-bold font-serif text-[#5C1010] mb-6">
                        {en ? activeEcosystem.titleEn : activeEcosystem.titleHi}
                     </h3>
                     <p className="text-[#7A5C45] text-lg md:text-xl leading-relaxed mb-12 max-w-2xl font-light">
                        {en ? activeEcosystem.descEn : activeEcosystem.descHi}
                     </p>

                     <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-[#F0D5B8] flex-1" />
                        <h4 className="text-[#E8622A] font-medium uppercase tracking-[0.2em] text-xs md:text-sm">
                          {en ? "Interconnected Sectors" : "परस्पर जुड़े क्षेत्र"}
                        </h4>
                        <div className="h-px bg-[#F0D5B8] flex-1" />
                     </div>

                     <div className="flex flex-wrap gap-3 md:gap-4">
                       {activeEcosystem.tags.map((tag, i) => (
                         <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: i * 0.04 + 0.2, duration: 0.4 }}
                            className="px-6 py-3 rounded-full bg-white border border-[#F0D5B8] text-[#C04A18] hover:bg-[#E8622A] hover:border-[#E8622A] hover:text-white transition-all duration-300 cursor-default shadow-sm text-sm md:text-base font-medium"
                         >
                            {en ? tag.en : tag.hi}
                         </motion.div>
                       ))}
                     </div>
                   </div>
                </motion.div>
             </AnimatePresence>
          </div>

        </div>
      </section>

    </div>
  );
}

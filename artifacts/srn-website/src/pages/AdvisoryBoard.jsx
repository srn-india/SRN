import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const boardMembers = [
  {
    name: "श्री ( डॉ. ) शैलेन्द्र कुमार जोशी",
    highlight: "आईआईएस 1984",
    details: [
      "बी.टेक (आईआईटी रुड़की), एम.टेक (आईआईटी दिल्ली), पी.एच.डी. (टेरी विश्वविद्यालय)",
      "पूर्व मुख्य सचिव, तेलंगाना सरकार"
    ]
  },
  {
    name: "श्री विभूति भूषण प्रधान",
    highlight: "आई.पी.एस. 1985",
    details: [
      "पूर्व महानिदेशक, झारखंड पुलिस",
      "राष्ट्रपति पुलिस पदक से सम्मानित"
    ]
  },
  {
    name: "श्री बजरंग लाल कोटरीवाला",
    highlight: "पूर्व संयुक्त सलाहकार, नीति आयोग, भारत सरकार",
    details: [
      "पूर्व सलाहकार लोकायुक्त राजस्थान",
      "पूर्व क्षेत्रीय नियंत्रक खान- आईबीएम अजमेर"
    ]
  },
  {
    name: "श्री अरुण कुमार शुक्ल",
    highlight: "पूर्व अध्यक्ष एवं प्रबंध निदेशक",
    details: [
      "हिंदुस्तान कॉपर लिमिटेड - भारत सरकार"
    ]
  },
  {
    name: "श्री विनोद कोहली",
    highlight: "बी.टेक (इलेक्ट्रिकल-आईआईटी दिल्ली) 1972",
    details: [
      "सदस्य, कार्यकारी परिषद, उत्तराखण्ड प्रौद्योगिकी विश्वविद्यालय",
      "प्रबंध निदेशक, क्यूजीनस इन्फोटेक प्राइवेट लिमिटेड"
    ]
  },
  {
    name: "श्री कुंवर नीरज सिंह",
    highlight: "राष्ट्रीय सह- सचिव",
    details: [
      "लोकभारती"
    ]
  }
];

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
      <section className="bg-[#FFF5EB] pt-[96px] pb-5 text-center px-6">
        
        {/* Monochromatic background image */}
        

        
        
        {/* Ambient glow accents */}
        
        
        

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >

          <h1 className="text-4xl md:text-6xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-x-16 md:gap-y-20">
            {boardMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                className="flex flex-col items-center text-center space-y-3 group"
              >
                {/* Name - Regular font size, semibold/medium */}
                <h3 className="text-xl md:text-2xl font-medium text-[#2C1810] font-serif group-hover:text-[#E8622A] transition-colors duration-300">
                  {member.name}
                </h3>
                
                {/* Highlight/Designation - Bold text */}
                <p className="text-base font-bold text-[#5C1010] leading-snug">
                  {member.highlight}
                </p>
                
                {/* Details - Normal text */}
                <div className="space-y-1.5 pt-1">
                  {member.details.map((detail, dIdx) => (
                    <p key={dIdx} className="text-sm md:text-base text-[#7A5C45] leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Users, BookOpen, Shield } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useLanguage } from "../context/LanguageContext";
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

const pillars = [
  {
    id: 1,
    icon: Heart,
    enTitle: "Social Welfare & Antyodaya",
    hiTitle: "समाज कल्याण एवं अंत्योदय",
    enDesc: "Dedicated to the upliftment of the underprivileged and ensuring welfare schemes reach the last person.",
    hiDesc: "वंचितों के उत्थान और यह सुनिश्चित करने के लिए समर्पित कि कल्याणकारी योजनाएं अंतिम व्यक्ति तक पहुंचें।"
  },
  {
    id: 2,
    icon: Users,
    enTitle: "Youth Empowerment",
    hiTitle: "युवा सशक्तिकरण",
    enDesc: "Fostering leadership, physical development, and self-reliance among the youth for nation-building.",
    hiDesc: "राष्ट्र निर्माण के लिए युवाओं में नेतृत्व, शारीरिक विकास और आत्मनिर्भरता को बढ़ावा देना।"
  },
  {
    id: 3,
    icon: BookOpen,
    enTitle: "Education & Policy",
    hiTitle: "शिक्षा एवं नीति",
    enDesc: "Contributing to the formulation and transparent execution of national policies and educational reforms.",
    hiDesc: "राष्ट्रीय नीतियों और शैक्षिक सुधारों के निर्माण और पारदर्शी निष्पादन में योगदान देना।"
  },
  {
    id: 4,
    icon: Shield,
    enTitle: "Cultural Heritage",
    hiTitle: "सांस्कृतिक विरासत",
    enDesc: "Preserving and nurturing Indian cultural values, traditions, and national integrity.",
    hiDesc: "भारतीय सांस्कृतिक मूल्यों, परंपराओं और राष्ट्रीय अखंडता का संरक्षण और संवर्धन।"
  }
];

export default function FocusAreasSection({ titleEn, titleHi }) {
  const { lang } = useLanguage();
  const en = lang === "en";

  return (
    <section className="py-20 px-6 bg-[#FDF5EC] border-t border-[#F0D5B8]/30">
      <div className="max-w-6xl mx-auto">
        <FadeSection>
          <SectionHeader
            hindi={titleHi}
            english={titleEn}
          />
        </FadeSection>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeSection key={item.id} delay={index * 100} className="h-full">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-[#F0D5B8] hover:bg-white hover:border-[#E8622A]/40 shadow-sm hover:shadow-[0_8px_30px_rgb(232,98,42,0.08)] transition-all duration-500 flex flex-col items-center text-center group h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC] border border-[#F0D5B8] flex items-center justify-center text-[#E8622A] group-hover:scale-110 group-hover:bg-[#E8622A]/10 group-hover:border-[#E8622A]/30 transition-all duration-500 mb-5 shadow-inner">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-[#5C1010] font-bold text-lg mb-3 font-serif leading-tight">
                    {en ? item.enTitle : item.hiTitle}
                  </h3>
                  
                  <p className="text-[#7A5C45] text-sm leading-relaxed text-justify mt-auto">
                    {en ? item.enDesc : item.hiDesc}
                  </p>
                </div>
              </FadeSection>
            );
          })}
        </div>

        <FadeSection delay={400}>
          <div className="mt-14 flex justify-center">
            {/* We will wire this link to the new 48-points page later */}
            <Link
              to="/uddeshya"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white font-semibold shadow-lg shadow-black/20 hover:shadow-orange-900/40 hover:-translate-y-1 transition-all duration-300 text-sm"
            >
              {en ? "Explore All 48 Focus Areas" : "सभी 48 कार्यक्षेत्र देखें"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

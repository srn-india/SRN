import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, 
  Search, 
  BookOpen, 
  Briefcase, 
  HeartHandshake, 
  Home, 
  Sprout, 
  Leaf, 
  Activity, 
  Scale, 
  Globe, 
  Sparkles, 
  X,
  FileText
} from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useLanguage } from "../context/LanguageContext";
import { useFadeIn } from "../hooks/useFadeIn";
import { categories, detailedObjectives } from "../data/detailedObjectives";

// Category-to-Icon Mapper
const iconMap = {
  BookOpen: BookOpen,
  Briefcase: Briefcase,
  HeartHandshake: HeartHandshake,
  Home: Home,
  Sprout: Sprout,
  Leaf: Leaf,
  Activity: Activity,
  Scale: Scale,
  Globe: Globe
};

function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Uddeshya() {
  const { t, lang } = useLanguage();
  const u = t.uddeshya;
  const en = lang === "en";

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBilingual, setShowBilingual] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Sashakt Rashtra Nirman – Objectives";
  }, []);

  // Filter and Search Logic
  const filteredObjectives = useMemo(() => {
    return detailedObjectives.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch = 
        item.hi.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.id).includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="bg-[#FDF5EC] min-h-screen pb-20">

      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#1E0F05] py-32 text-center px-6 overflow-hidden min-h-[42vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-screen"
          style={{ backgroundImage: `url('/uddeshya-hero.png')` }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, white, white 1px, transparent 1px, transparent 28px)` }}
        />
        <div className="absolute inset-0 hero-glow pointer-events-none opacity-60" />
        <div className="absolute top-8 left-12 w-40 h-40 rounded-full bg-[#E8622A]/8 blur-3xl" />
        <div className="absolute bottom-8 right-12 w-32 h-32 rounded-full bg-[#D4880C]/8 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1.5 bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#F47A3A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {en ? "Detailed Objectives" : "न्यास के विस्तृत उद्देश्य"}
          </motion.span>

          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif tracking-tight leading-tight">
            {en ? "Objectives of the Trust" : "न्यास के उद्देश्य"}
          </h1>
          <p className="text-orange-200/70 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            {en 
              ? "Sashakt Rashtra Nirman Trust has been established to drive holistic national development through these 48 core constitutional objectives."
              : "सशक्त राष्ट्र निर्माण न्यास की स्थापना राष्ट्र के समग्र विकास के लिए इन 48 मुख्य संवैधानिक उद्देश्यों को पूरा करने के लिए की गई है।"}
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-8 mx-auto w-24 rounded-full origin-center"
          />
        </motion.div>
      </section>

      {/* ── Filter & Search Section ─────────────────────────────────── */}
      <section className="relative -mt-12 z-20 px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-[#F0D5B8] p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-8">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={en ? "Search objectives..." : "उद्देश्यों में खोजें..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-[#FDF5EC]/50 border border-[#F0D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] text-sm text-[#1E0F05] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bilingual Display Toggle */}
            <div className="flex items-center gap-3 bg-[#FDF5EC] border border-[#F0D5B8] p-1.5 rounded-xl">
              <button
                onClick={() => setShowBilingual(false)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  !showBilingual 
                    ? "bg-[#E8622A] text-white shadow-md" 
                    : "text-[#7A5C45] hover:text-[#E8622A]"
                }`}
              >
                {en ? "Single Language" : "एकल भाषा"}
              </button>
              <button
                onClick={() => setShowBilingual(true)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  showBilingual 
                    ? "bg-[#E8622A] text-white shadow-md" 
                    : "text-[#7A5C45] hover:text-[#E8622A]"
                }`}
              >
                {en ? "Bilingual View" : "द्विभाषी दृश्य"}
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start border-t border-[#FDF5EC] pt-6">
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon] || Globe;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#E8622A] to-[#D4880C] text-white shadow-md scale-105"
                      : "bg-[#FDF5EC] border border-[#F0D5B8]/60 text-[#7A5C45] hover:border-[#E8622A]/60 hover:text-[#E8622A] hover:bg-[#FFF9F2]"
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isSelected ? "text-white" : "text-[#E8622A]"}`} />
                  <span>{en ? cat.labelEn : cat.labelHi}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Objectives Grid ─────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center px-2">
          <p className="text-sm text-[#7A5C45]">
            {en 
              ? `Showing ${filteredObjectives.length} of 48 Objectives` 
              : `48 में से ${filteredObjectives.length} उद्देश्य प्रदर्शित`}
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredObjectives.map((obj) => {
              // Find matching category icon
              const catObj = categories.find(c => c.id === obj.category) || {};
              const IconComponent = iconMap[catObj.icon] || Globe;

              return (
                <motion.div
                  layout
                  key={obj.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="group relative bg-white border border-[#F0D5B8] rounded-2xl p-6 hover:border-[#E8622A]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden card-shimmer"
                >
                  {/* Category Accent Stripe */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] opacity-70 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {/* Card Header */}
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-[#FDF5EC] text-[#E8622A] group-hover:bg-[#E8622A]/10 transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-[#7A5C45] font-semibold bg-[#FDF5EC] px-2.5 py-1 rounded-full">
                          {en ? catObj.labelEn : catObj.labelHi}
                        </span>
                      </div>
                      <span className="text-sm font-bold font-serif text-[#E8622A]/50 group-hover:text-[#E8622A] transition-colors">
                        #{String(obj.id).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      {/* Hindi Text */}
                      {(!en || showBilingual) && (
                        <p className="text-[#1E0F05] text-[15px] font-medium leading-relaxed font-sans border-l-2 border-[#F0D5B8] pl-3">
                          {obj.hi}
                        </p>
                      )}

                      {/* English Text */}
                      {(en || showBilingual) && (
                        <p className={`text-sm leading-relaxed ${showBilingual ? "text-gray-500 italic font-sans" : "text-[#1E0F05] font-medium font-sans"}`}>
                          {obj.en}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredObjectives.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#F0D5B8] mt-6"
          >
            <FileText className="w-12 h-12 text-[#E8622A]/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1E0F05] font-serif mb-1">
              {en ? "No Objectives Found" : "कोई उद्देश्य नहीं मिला"}
            </h3>
            <p className="text-sm text-[#7A5C45] max-w-md mx-auto">
              {en 
                ? "Try searching for a different keyword or resetting the category filter." 
                : "कृपया कोई अन्य कीवर्ड खोजें या श्रेणी फ़िल्टर रीसेट करें।"}
            </p>
            <button 
              onClick={() => { setActiveCategory("all"); setSearchQuery(""); }}
              className="mt-5 px-5 py-2 bg-[#E8622A] hover:bg-[#D4880C] text-white text-xs font-semibold rounded-full shadow transition-all"
            >
              {en ? "Reset Filters" : "फ़िल्टर रीसेट करें"}
            </button>
          </motion.div>
        )}
      </section>

      {/* ── Mission ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FFF9F2] relative overflow-hidden">
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[15rem] font-bold text-[#E8622A]/4 select-none pointer-events-none leading-none font-serif hidden md:block">
          M
        </div>
        <div className="max-w-4xl mx-auto relative">
          <FadeSection>
            <SectionHeader
              hindi={u.missionTitleHindi}
              english={u.missionTitle}
            />
          </FadeSection>
          <div className="mt-8 grid grid-cols-1 gap-4">
            {u.missionPoints.map((point, i) => (
              <div 
                key={point} 
                className="flex items-start gap-5 p-5 rounded-2xl bg-white border border-[#F0D5B8] hover:border-[#E8622A]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 card-shimmer"
              >
                <span className="text-4xl font-bold text-[#E8622A]/15 leading-none shrink-0 select-none w-10 text-right font-serif">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[#1E0F05] text-base leading-relaxed pt-1.5">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Legal Framework ────────────────────────────────────────── */}
      <section className="py-24 px-6 relative bg-[url('/hero-bg-3.png')] bg-fixed bg-cover bg-center overflow-hidden">
        {/* Premium Glass Overlay */}
        <div className="absolute inset-0 bg-[#1E0F05]/80 backdrop-blur-md" />
        
        {/* Animated Glowing Orbs for ambiance */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#E8622A] rounded-full blur-[100px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-[#D4880C] rounded-full blur-[100px] pointer-events-none" 
        />
        
        {/* Subtle Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
        />

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <FadeSection>
            <span className="inline-block bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#F47A3A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              {en ? "Registered & Recognized" : "पंजीकृत एवं मान्यता प्राप्त"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
              {en ? u.legalTitle : u.legalTitleHindi}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#E8622A] to-[#D4880C]" />
            <p className="text-white/50 text-sm mt-4 max-w-lg mx-auto">
              {en
                ? "Fully registered and compliant under Indian law."
                : "भारतीय कानून के अंतर्गत पूर्णतः पंजीकृत एवं अनुपालन में।"}
            </p>
          </FadeSection>

          <FadeSection delay={150}>
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              {u.legalBadges.map((badge, i) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/8 border border-white/15 hover:border-[#E8622A]/60 hover:bg-[#E8622A]/10 text-white/80 hover:text-white rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 cursor-default flex items-center gap-2"
                >
                  <Award className="w-3.5 h-3.5 text-[#E8622A] shrink-0" />
                  {badge}
                </motion.span>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>
    </div>
  );
}

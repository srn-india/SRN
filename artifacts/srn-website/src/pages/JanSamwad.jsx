import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Heart, 
  AlertCircle, 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  X,
  FileText,
  Share2
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

// Bilingual mock content database
const samwadData = [
  {
    id: 1,
    category: "articles",
    date: "2026-06-12",
    author: "Dr. Manoj Kumar Shukla",
    titleEn: "Role of Digital Literacy in Grassroots Empowerment",
    titleHi: "ग्रामीण सशक्तिकरण में डिजिटल साक्षरता की भूमिका",
    excerptEn: "An analytical study on how providing computer education and internet access to remote Indian villages accelerates local economies.",
    excerptHi: "सुदूर भारतीय गांवों में कंप्यूटर शिक्षा और इंटरनेट पहुंच प्रदान करने से स्थानीय अर्थव्यवस्था को गति मिलने पर एक विश्लेषणात्मक अध्ययन।",
    contentEn: "Digital literacy is no longer a luxury; it is a fundamental catalyst for democratic and financial growth. By establishing digital hubs and computer centers in villages, we empower youth to access government schemes, learn new skills, and connect with global markets. Our initiatives in this sector focus on building simple, robust training models tailored for rural aspirants. Research shows that self-sufficiency increases by over 40% when local communities leverage online resources for farming, local commerce, and education.",
    contentHi: "डिजिटल साक्षरता अब कोई विलासिता नहीं है; यह लोकतांत्रिक और वित्तीय विकास के लिए एक मौलिक उत्प्रेरक है। गांवों में डिजिटल हब और कंप्यूटर केंद्र स्थापित करके, हम युवाओं को सरकारी योजनाओं तक पहुंचने, नए कौशल सीखने और वैश्विक बाजारों से जुड़ने के लिए सशक्त बनाते हैं। इस क्षेत्र में हमारी पहल ग्रामीण उम्मीदवारों के लिए तैयार किए गए सरल, मजबूत प्रशिक्षण मॉडल बनाने पर केंद्रित है। शोध बताते हैं कि जब स्थानीय समुदाय खेती, स्थानीय वाणिज्य और शिक्षा के लिए ऑनलाइन संसाधनों का लाभ उठाते हैं, तो आत्मनिर्भरता में 40% से अधिक की वृद्धि होती है।",
    image: "/ WhatsApp Image 2026-06-03 at 19.54.52 (1).jpeg" // Fallback to exist, or let it contain standard/default
  },
  {
    id: 2,
    category: "social",
    date: "2026-06-08",
    author: "SRN Editorial Team",
    titleEn: "Annual Health and Sanitation Camp in Haridwar Rural",
    titleHi: "हरिद्वार ग्रामीण में वार्षिक स्वास्थ्य एवं स्वच्छता शिविर",
    excerptEn: "Highlighting our recent medical camp providing free consultations, diagnostic checkups, and hygiene awareness to 800+ families.",
    excerptHi: "800+ परिवारों को मुफ्त चिकित्सा परामर्श, नैदानिक जांच और स्वच्छता जागरूकता प्रदान करने वाले हमारे हालिया चिकित्सा शिविर की झलकियां।",
    contentEn: "Under the guidance of Mahamandaleshwar Swami Yatindranand Giri Maharaj, the health initiative organized a multi-specialty camp in rural Haridwar. Over 15 senior doctors volunteered to provide free consultation across pediatrics, gynecology, and general health. Medicines worth INR 2 Lakhs were distributed free of cost, alongside sanitary kits. Special awareness drives on preventive care and clean drinking water were also conducted to ensure long-term health improvements in local pockets.",
    contentHi: "महामंडलेश्वर स्वामी यतींद्रानंद गिरी महाराज के मार्गदर्शन में, स्वास्थ्य पहल ने ग्रामीण हरिद्वार में एक बहु-विशेषज्ञता शिविर का आयोजन किया। 15 से अधिक वरिष्ठ डॉक्टरों ने बाल रोग, स्त्री रोग और सामान्य स्वास्थ्य में मुफ्त परामर्श प्रदान करने के लिए स्वेच्छा से काम किया। सेनेटरी किट के साथ 2 लाख रुपये की दवाएं मुफ्त वितरित की गईं। स्थानीय क्षेत्रों में दीर्घकालिक स्वास्थ्य सुधार सुनिश्चित करने के लिए निवारक देखभाल और स्वच्छ पेयजल पर विशेष जागरूकता अभियान भी चलाए गए।",
  },
  {
    id: 3,
    category: "issues",
    date: "2026-06-05",
    author: "National Advisory Council",
    titleEn: "Water Conservation Policies: Opportunities for Local Action",
    titleHi: "जल संरक्षण नीतियां: स्थानीय स्तर पर सक्रिय भागीदारी के अवसर",
    excerptEn: "Addressing the urgent need for rainwater harvesting, check-dam maintenance, and community management in the drought-prone regions.",
    excerptHi: "सूखा प्रवण क्षेत्रों में वर्षा जल संचयन, चेक-डैम के रखरखाव और सामुदायिक प्रबंधन की तत्काल आवश्यकता को संबोधित करना।",
    contentEn: "With changing weather patterns, traditional water resources are facing unprecedented stress. This policy brief analyzes how local panchayats and youth circles can collaborate to revive dried stepwells and build low-cost rain catchments. By engaging the community in water budgeting, we can secure agricultural yields and drinking water safety. Ground actions require a unified policy support framework that blends ancient Indian wisdom with modern hydrological techniques.",
    contentHi: "बदलते मौसम के मिजाज के साथ, पारंपरिक जल संसाधन अभूतपूर्व तनाव का सामना कर रहे हैं। यह नीति पत्र विश्लेषण करता है कि सूखे कुओं को पुनर्जीवित करने और कम लागत वाले वर्षा जल संचयन के लिए स्थानीय पंचायतें और युवा संगठन कैसे सहयोग कर सकते हैं। जल बजटिंग में समुदाय को शामिल करके, हम कृषि उपज और पेयजल सुरक्षा सुरक्षित कर सकते हैं। धरातलीय कार्यों के लिए एक एकीकृत नीति समर्थन ढांचे की आवश्यकता है जो आधुनिक जल विज्ञान तकनीकों के साथ प्राचीन भारतीय ज्ञान का मिश्रण करे।",
  }
];

const categoryColors = {
  articles: "from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-700",
  social: "from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700",
  issues: "from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-700"
};

export default function JanSamwad() {
  const { lang } = useLanguage();
  const en = lang === "en";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en 
      ? "Sashakt Rashtra Nirman – Jan Samwad" 
      : "सशक्त राष्ट्र निर्माण – जन संवाद";
  }, [en]);

  // Filtering logic
  const filteredData = samwadData.filter(item => {
    const title = en ? item.titleEn : item.titleHi;
    const excerpt = en ? item.excerptEn : item.excerptHi;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#FDF5EC] min-h-screen">
      
      {/* ── Hero Section with Monochromatic Pattern Background ───────── */}
      <section className="relative bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6 overflow-hidden">
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.32]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            {en ? "Jan Samwad (जन संवाद)" : "जन संवाद (Jan Samwad)"}
          </h1>
          <p className="text-[#7A5C45] text-base md:text-lg mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
            {en 
              ? "SRN Public Discourse: Stay updated with our latest articles, social work reports, and policy briefs on national affairs."
              : "एसआरएन सार्वजनिक विमर्श: राष्ट्रनीति, सामाजिक कार्यों और सामयिक मुद्दों पर हमारे नवीनतम लेखों और विचारों से अवगत रहें।"}
          </p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-6 mx-auto w-24 rounded-full origin-center shadow-sm"
          />
        </motion.div>
      </section>

      {/* ── Filter & Search Section ─────────────────────────────────── */}
      <section className="relative px-6 -mt-8 z-10">
        <div className="max-w-6xl mx-auto bg-white border border-[#F0D5B8] rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A5C45]" />
              <input
                type="text"
                placeholder={en ? "Search articles, news..." : "लेख, समाचार खोजें..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FFF9F2] rounded-xl border border-[#F0D5B8]/60 text-sm focus:outline-none focus:border-[#E8622A] focus:ring-1 focus:ring-[#E8622A]/30 text-[#1E0F05]"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              {[
                { id: "all", labelEn: "All Posts", labelHi: "सभी पोस्ट" },
                { id: "articles", labelEn: "Articles", labelHi: "लेख व विचार" },
                { id: "social", labelEn: "Social Work", labelHi: "सामाजिक कार्य" },
                { id: "issues", labelEn: "Current Affairs", labelHi: "सामयिक मुद्दे" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 border ${
                    activeCategory === tab.id
                      ? "bg-[#E8622A] border-[#E8622A] text-white shadow-md"
                      : "bg-[#FFF9F2] border-[#F0D5B8]/60 text-[#7A5C45] hover:border-[#E8622A]/50 hover:bg-white"
                  }`}
                >
                  {en ? tab.labelEn : tab.labelHi}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Content Grid Section ───────────────────────────────────── */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((item) => {
              const categoryLabel = item.category === "articles" 
                ? (en ? "Article" : "लेख")
                : item.category === "social"
                ? (en ? "Social Initiative" : "सामाजिक कार्य")
                : (en ? "Current Affair" : "सामयिक मुद्दा");
                
              return (
                <motion.div
                  key={item.id}
                  layout
                  className="group bg-white border border-[#F0D5B8]/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="p-6 md:p-8">
                    {/* Header Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${categoryColors[item.category]}`}>
                        {categoryLabel}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-[#7A5C45] font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#5C1010] font-serif mb-3 leading-snug text-left group-hover:text-[#E8622A] transition-colors">
                      {en ? item.titleEn : item.titleHi}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[#7A5C45] leading-relaxed text-left line-clamp-3 mb-6">
                      {en ? item.excerptEn : item.excerptHi}
                    </p>
                  </div>

                  {/* Footer Action Card */}
                  <div className="px-6 pb-6 pt-4 border-t border-[#F0D5B8]/30 flex items-center justify-between bg-[#FFF9F2]/50">
                    <span className="flex items-center gap-1.5 text-xs text-[#7A5C45] font-semibold">
                      <User className="w-3.5 h-3.5 text-[#E8622A]" />
                      {item.author}
                    </span>
                    <button
                      onClick={() => setSelectedArticle(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8622A] hover:text-[#5C1010] group/btn transition-colors"
                    >
                      {en ? "Read Article" : "पूरा पढ़ें"}
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#F0D5B8] max-w-xl mx-auto">
            <FileText className="w-12 h-12 text-[#E8622A]/40 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-[#1E0F05] font-serif">
              {en ? "No Updates Found" : "कोई पोस्ट नहीं मिली"}
            </h4>
            <p className="text-sm text-[#7A5C45] mt-2 max-w-xs mx-auto">
              {en 
                ? "Try searching for a different keyword or updating the active category filter." 
                : "कृपया कोई अन्य कीवर्ड खोजें या श्रेणी फ़िल्टर बदलें।"}
            </p>
          </div>
        )}

      </section>

      {/* ── Article Detail Modal Overlay ───────────────────────────── */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col border border-[#F0D5B8]/60"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 text-[#5C3A1E] hover:text-[#E8622A] bg-[#FFF9F2] p-2 rounded-full transition-colors z-10 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Body Scroll Container */}
              <div className="overflow-y-auto p-6 md:p-10 flex-1">
                
                {/* Meta Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${categoryColors[selectedArticle.category]}`}>
                    {selectedArticle.category === "articles" 
                      ? (en ? "Article" : "लेख")
                      : selectedArticle.category === "social"
                      ? (en ? "Social Work" : "सामाजिक कार्य")
                      : (en ? "Current Affair" : "सामयिक मुद्दा")}
                  </span>
                  <span className="text-xs text-[#7A5C45] font-semibold">{selectedArticle.date}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#5C1010] font-serif leading-tight mb-4 text-left">
                  {en ? selectedArticle.titleEn : selectedArticle.titleHi}
                </h2>

                {/* Author Info */}
                <div className="flex items-center gap-2 mb-6 pb-6 border-b border-[#F0D5B8]/30">
                  <div className="w-8 h-8 rounded-full bg-[#E8622A]/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#E8622A]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#1E0F05]">{selectedArticle.author}</p>
                    <p className="text-[10px] text-[#7A5C45]">{en ? "SRN Contributor" : "SRN विचारक"}</p>
                  </div>
                </div>

                {/* Article Detailed Paragraph */}
                <p className="text-sm md:text-base text-[#1E0F05] leading-relaxed text-justify whitespace-pre-line font-sans">
                  {en ? selectedArticle.contentEn : selectedArticle.contentHi}
                </p>

              </div>

              {/* Modal Footer actions */}
              <div className="px-6 py-4 bg-[#FFF9F2] border-t border-[#F0D5B8]/40 flex items-center justify-between">
                <span className="text-xs text-[#7A5C45] font-medium">
                  {en ? "Sashakt Rashtra Nirman Publications" : "सशक्त राष्ट्र निर्माण प्रकाशन"}
                </span>
                <button 
                  onClick={() => alert(en ? "Link copied to clipboard!" : "लिंक क्लिपबोर्ड पर कॉपी किया गया!")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#F0D5B8]/60 hover:bg-[#FFF9F2] text-xs font-semibold rounded-xl text-[#7A5C45] transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#E8622A]" />
                  {en ? "Share" : "साझा करें"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

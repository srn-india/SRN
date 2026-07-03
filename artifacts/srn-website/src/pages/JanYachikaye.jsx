import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Search, Calendar, CheckCircle, AlertCircle, FileText, ChevronRight, User, MapPin } from "lucide-react";

// Solved complaints mock database
const solvedComplaintsData = [
  {
    id: "SRN-GRI-109241",
    dateSolved: "2026-06-10",
    category: "agriculture",
    state: "Uttar Pradesh",
    titleEn: "Rehabilitation of Canal Irrigation Channels in Haridwar Borders",
    titleHi: "हरिद्वार सीमा पर नहर सिंचाई चैनलों का पुनर्वास",
    issueEn: "Farmers reported blocked secondary channels leading to inadequate irrigation supply during peak sowing season.",
    issueHi: "किसानों ने बुवाई के पीक सीजन के दौरान अपर्याप्त सिंचाई आपूर्ति के कारण बंद पड़े द्वितीयक चैनलों की सूचना दी थी।",
    resolutionEn: "Sashakt Rashtra Nirman coordinators represented the matter to the Irrigation Department, facilitating joint cleaning operations and successfully restoring water flow to 450+ acres of farmland.",
    resolutionHi: "सशक्त राष्ट्र निर्माण के समन्वयकों ने सिंचाई विभाग के समक्ष मामला प्रस्तुत किया, जिससे संयुक्त सफाई अभियान को बढ़ावा मिला और 450+ एकड़ कृषि भूमि के लिए पानी का प्रवाह सफलतापूर्वक बहाल हो गया।"
  },
  {
    id: "SRN-GRI-240182",
    dateSolved: "2026-06-02",
    category: "educational",
    state: "Bihar",
    titleEn: "Restoration of Digital Laboratory Assets in Rural Schools",
    titleHi: "ग्रामीण स्कूलों में डिजिटल प्रयोगशाला संपत्तियों की बहाली",
    issueEn: "Over 5 primary schools lacked functioning computer hardware, disrupting secondary level computer education programs.",
    issueHi: "5 से अधिक प्राथमिक विद्यालयों में कंप्यूटर हार्डवेयर की कमी थी, जिससे माध्यमिक स्तर के कंप्यूटर शिक्षा कार्यक्रम बाधित हो रहे थे।",
    resolutionEn: "Through corporate social responsibility contributions and volunteer hardware engineers, SRN repaired 22 computer terminals, establishing stable internet services for over 350 rural students.",
    resolutionHi: "कॉर्पोरेट सामाजिक उत्तरदायित्व (CSR) योगदान और स्वयंसेवक हार्डवेयर इंजीनियरों के माध्यम से, SRN ने 22 कंप्यूटर टर्मिनलों की मरम्मत की, जिससे 350 से अधिक ग्रामीण छात्रों के लिए स्थिर इंटरनेट सेवाएं स्थापित हुईं।"
  },
  {
    id: "SRN-GRI-339281",
    dateSolved: "2026-05-28",
    category: "infradev",
    state: "Uttarakhand",
    titleEn: "Repair of Community Link Road in Tehri Garhwal Village",
    titleHi: "टिहरी गढ़वाल गाँव में सामुदायिक संपर्क मार्ग की मरम्मत",
    issueEn: "A critical 2-kilometer link road connecting the village to the nearest primary health center was heavily damaged during heavy rains, stopping ambulances.",
    issueHi: "गाँव को निकटतम प्राथमिक स्वास्थ्य केंद्र से जोड़ने वाला एक महत्वपूर्ण 2-किलोमीटर संपर्क मार्ग भारी बारिश के दौरान क्षतिग्रस्त हो गया था, जिससे एम्बुलेंसों का आवागमन बाधित हो गया था।",
    resolutionEn: "By mobilizing local youth groups and coordinating with the Public Works Department, the road was temporarily reinforced and subsequently approved for complete paving under rural link road schemes.",
    resolutionHi: "स्थानीय युवा समूहों को लामबंद करके और लोक निर्माण विभाग के साथ समन्वय करके, सड़क को अस्थायी रूप से मजबूत किया गया और बाद में ग्रामीण संपर्क मार्ग योजनाओं के तहत पूर्ण पक्कीकरण के लिए स्वीकृत कराया गया।"
  },
  {
    id: "SRN-GRI-984021",
    dateSolved: "2026-05-15",
    category: "women",
    state: "Madhya Pradesh",
    titleEn: "Setting up of Skill Training and Craft Centers for Women",
    titleHi: "महिलाओं के लिए कौशल प्रशिक्षण और शिल्प केंद्रों की स्थापना",
    issueEn: "Lack of localized training resources for village women trying to establish self-help groups and cottage enterprises.",
    issueHi: "स्वयं सहायता समूह और कुटीर उद्यम स्थापित करने की कोशिश कर रही ग्रामीण महिलाओं के लिए स्थानीय स्तर पर प्रशिक्षण संसाधनों की कमी।",
    resolutionEn: "Partnered with local textile cooperatives to set up an active craft and handloom training center, enabling 60+ women to acquire certified skills and earn regular income.",
    resolutionHi: "सक्रिय शिल्प और हथकरघा प्रशिक्षण केंद्र स्थापित करने के लिए स्थानीय कपड़ा सहकारी समितियों के साथ भागीदारी की, जिससे 60 से अधिक महिलाओं को प्रमाणित कौशल प्राप्त करने और नियमित आय अर्जित करने में मदद मिली।"
  }
];

const categoryColors = {
  educational: "from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-700",
  social: "from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700",
  corruption: "from-red-500/10 to-orange-500/10 border-red-200 text-red-700",
  women: "from-pink-500/10 to-purple-500/10 border-pink-200 text-pink-700",
  infradev: "from-cyan-500/10 to-blue-500/10 border-cyan-200 text-cyan-700",
  agriculture: "from-amber-500/10 to-yellow-500/10 border-amber-200 text-amber-700",
  civic: "from-purple-500/10 to-indigo-500/10 border-purple-200 text-purple-700",
  other: "from-gray-500/10 to-slate-500/10 border-gray-200 text-gray-700"
};

export default function JanYachikaye() {
  const { lang } = useLanguage();
  const en = lang === "en";

  const [publishedComplaints, setPublishedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en ? "Jan Yachikaye (Solved) – SRN" : "जन याचिकाएं (निस्तारित) – SRN";
  }, [en]);

  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints/published`);
        if (res.ok) {
          const data = await res.json();
          const transformed = data.data.map(comp => ({
            id: comp.ticket,
            dateSolved: new Date(comp.updatedAt).toISOString().split('T')[0],
            category: comp.category,
            state: comp.state,
            titleEn: comp.titleEn || comp.subject,
            titleHi: comp.titleHi || comp.subject,
            issueEn: comp.description,
            issueHi: comp.description,
            resolutionEn: comp.resolutionEn || "",
            resolutionHi: comp.resolutionHi || "",
            isFromDb: true
          }));
          setPublishedComplaints(transformed);
        }
      } catch (err) {
        console.error("Failed to fetch published complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublished();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedYachika, setSelectedYachika] = useState(null);

  const categories = [
    { value: "all", en: "All Grievances", hi: "सभी मामले" },
    { value: "civic", en: "Civic Issues", hi: "नागरिक मुद्दे" },
    { value: "agriculture", en: "Agriculture", hi: "कृषि मुद्दे" },
    { value: "educational", en: "Education", hi: "शिक्षा" },
    { value: "infradev", en: "Infrastructure", hi: "बुनियादी ढांचा" },
    { value: "women", en: "Women Welfare", hi: "महिला कल्याण" }
  ];

  const combinedComplaints = [
    ...publishedComplaints,
    ...solvedComplaintsData.filter(mock => !publishedComplaints.some(db => db.id === mock.id))
  ];

  const filteredData = combinedComplaints.filter(item => {
    const title = en ? item.titleEn : item.titleHi;
    const issue = en ? item.issueEn : item.issueHi;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-[#FDF5EC] min-h-screen">
      
      {/* ── Hero Section ─────────────────────────────────────────── */}
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
          className="relative max-w-4xl mx-auto z-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#E8622A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
          >
            {en ? "Resolution Registry" : "निस्तारण विवरण पंजी"}
          </motion.span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            {en ? "Jan Yachikaye (Solved)" : "जन याचिकाएं (निस्तारित)"}
          </h1>
          <p className="text-[#7A5C45] text-base md:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            {en 
              ? "Showcasing the grievances and public complaints registered by citizens that have been successfully resolved by the Sashakt Rashtra Nirman Trust."
              : "नागरिकों द्वारा दर्ज की गई उन जन शिकायतों और समस्याओं का प्रदर्शन जिनका सशक्त राष्ट्र निर्माण न्यास द्वारा सफलतापूर्वक समाधान किया गया है।"}
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
                placeholder={en ? "Search by Ticket ID or keywords..." : "टिकट आईडी या कीवर्ड द्वारा खोजें..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#FFF9F2] rounded-xl border border-[#F0D5B8]/60 text-sm focus:outline-none focus:border-[#E8622A] focus:ring-1 focus:ring-[#E8622A]/30 text-[#1E0F05]"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              {categories.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveCategory(tab.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 border ${
                    activeCategory === tab.value
                      ? "bg-[#E8622A] border-[#E8622A] text-white shadow-md"
                      : "bg-[#FFF9F2] border-[#F0D5B8]/60 text-[#7A5C45] hover:border-[#E8622A]/50 hover:bg-white"
                  }`}
                >
                  {en ? tab.en : tab.hi}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── Solved Cases Grid ───────────────────────────────────────── */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredData.map((yachika) => (
              <motion.div
                key={yachika.id}
                layout
                className="bg-white border border-[#F0D5B8]/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Meta Tags */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${categoryColors[yachika.category] || "bg-[#FDF5EC]"}`}>
                      {yachika.category === "agriculture" ? (en ? "Agriculture" : "कृषि") :
                       yachika.category === "educational" ? (en ? "Education" : "शिक्षा") :
                       yachika.category === "infradev" ? (en ? "Infrastructure" : "बुनियादी ढांचा") :
                       yachika.category === "women" ? (en ? "Women Welfare" : "महिला कल्याण") :
                       yachika.category === "civic" ? (en ? "Civic Issues" : "नागरिक मुद्दे") : (en ? "General" : "सामान्य")}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#7A5C45] font-semibold bg-[#FDF5EC] border border-[#F0D5B8]/40 px-2.5 py-1 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-[#E8622A]" />
                      {yachika.dateSolved}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#5C1010] font-serif mb-3 leading-snug">
                    {en ? yachika.titleEn : yachika.titleHi}
                  </h3>

                  {/* Complaint Description */}
                  <div className="mb-4 bg-[#FDF5EC]/30 rounded-2xl p-4 border border-[#F0D5B8]/30">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[#7A5C45] mb-1">
                      {en ? "The Grievance" : "शिकायत"}
                    </span>
                    <p className="text-sm text-[#1E0F05] leading-relaxed line-clamp-2">
                      {en ? yachika.issueEn : yachika.issueHi}
                    </p>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="pt-4 border-t border-[#FDF5EC] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A5C45] font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#E8622A]" />
                    {yachika.state}
                  </div>
                  <button
                    onClick={() => setSelectedYachika(yachika)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8622A] hover:text-[#5C1010] group transition-colors"
                  >
                    {en ? "View Resolution Case" : "निस्तारण विवरण देखें"}
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#F0D5B8] max-w-xl mx-auto">
            <FileText className="w-12 h-12 text-[#E8622A]/40 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-[#1E0F05] font-serif">
              {en ? "No Case Found" : "कोई निस्तारित मामला नहीं मिला"}
            </h4>
            <p className="text-sm text-[#7A5C45] mt-2 max-w-xs mx-auto">
              {en 
                ? "Try searching for a different ticket number or changing the category filter." 
                : "कृपया कोई अन्य टिकट संख्या खोजें या श्रेणी फ़िल्टर बदलें।"}
            </p>
          </div>
        )}
      </section>

      {/* ── Case Study Detail Modal Overlay ───────────────────────── */}
      <AnimatePresence>
        {selectedYachika && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedYachika(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col border border-[#F0D5B8]/60"
            >
              
              {/* Top Accent Strip */}
              <div className="h-1.5 bg-gradient-to-r from-[#E8622A] to-[#D4880C] w-full" />

              {/* Modal Body Container */}
              <div className="overflow-y-auto p-6 md:p-10 flex-1">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs font-mono font-bold text-[#E8622A] bg-[#E8622A]/10 border border-[#E8622A]/20 px-3 py-1 rounded-full">
                    {selectedYachika.id}
                  </span>
                  <span className="text-xs text-[#7A5C45] font-semibold">
                    {en ? `Solved on ${selectedYachika.dateSolved}` : `निस्तारण तिथि: ${selectedYachika.dateSolved}`}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-[#5C1010] font-serif leading-tight mb-6 text-left">
                  {en ? selectedYachika.titleEn : selectedYachika.titleHi}
                </h2>

                {/* Complaint Text */}
                <div className="mb-6 p-5 rounded-2xl bg-[#FDF5EC] border border-[#F0D5B8]/40">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-[#7A5C45] mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-[#E8622A]" />
                    {en ? "The Grievance & Issue Registered" : "दर्ज की गई शिकायत एवं समस्या"}
                  </span>
                  <p className="text-sm md:text-base text-[#1E0F05] leading-relaxed text-justify font-sans">
                    {en ? selectedYachika.issueEn : selectedYachika.issueHi}
                  </p>
                </div>

                {/* Resolution Text */}
                <div className="p-5 rounded-2xl bg-green-50/50 border border-green-200/60">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-green-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {en ? "The Resolution Details" : "निवारण का विवरण"}
                  </span>
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed text-justify font-sans font-medium">
                    {en ? selectedYachika.resolutionEn : selectedYachika.resolutionHi}
                  </p>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-[#FFF9F2] border-t border-[#F0D5B8]/40 flex items-center justify-between">
                <span className="text-xs text-[#7A5C45] font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E8622A]" /> {selectedYachika.state}
                </span>
                <button 
                  onClick={() => setSelectedYachika(null)}
                  className="px-5 py-2 bg-[#E8622A] hover:bg-[#D4880C] text-white text-xs font-bold rounded-xl transition-colors shadow"
                >
                  {en ? "Close Details" : "विवरण बंद करें"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

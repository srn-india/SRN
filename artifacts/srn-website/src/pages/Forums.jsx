import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, TrendingUp, Users, Search, ChevronRight, Hash } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useFadeIn } from "../hooks/useFadeIn";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FadeSection({ children, delay = 0, className = "" }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const categories = [
  {
    id: 1,
    title: "Policy Discussions",
    titleHi: "नीतिगत चर्चा",
    image: "/forum_policy_thumb_1779205493919.png",
    description: "Debate and discuss national policies, grassroots implementation, and economic strategies.",
    topics: 1240,
  },
  {
    id: 2,
    title: "Local Chapters",
    titleHi: "स्थानीय अध्याय",
    image: "/event_rally_thumb_1779205461756.png",
    description: "Connect with members in your state/district for local initiatives and meetups.",
    topics: 856,
  }
];

export default function Forums() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const en = lang === "en";
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Forums | Sashakt Rashtra Nirman";

    const fetchThreads = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forum/threads`);
        const data = await res.json();
        if (data.success) {
          // The API returns paginated data: { threads: [...], pagination: {...} }
          setThreads(data.data.threads || []);
        }
      } catch (err) {
        console.error("Failed to fetch threads:", err);
      }
    };
    fetchThreads();
  }, []);

  return (
    <div className="bg-[#FFF9F2] min-h-screen">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6">
        
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9F2] via-[#1E0F05]/80 to-[#1E0F05]/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(232,98,42,0.3)]">
            <MessageSquare className="w-4 h-4 text-[#E8622A]" />
            <span className="text-white/90 text-sm font-medium tracking-wide uppercase">
              {en ? "Community Forums" : "सामुदायिक मंच"}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif leading-tight drop-shadow-lg">
            {en ? (
              <>Raise Your <span className="text-[#E8622A]">Voice</span></>
            ) : (
              <>अपनी आवाज़ <span className="text-[#E8622A]">उठाएं</span></>
            )}
          </h1>
          
          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder={en ? "Search discussions, topics, or members..." : "चर्चाएँ, विषय या सदस्यों को खोजें..."}
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 px-6 py-4 rounded-2xl focus:outline-none focus:border-[#E8622A] focus:ring-1 focus:ring-[#E8622A] transition-all shadow-lg"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#E8622A] rounded-xl hover:bg-[#C04A18] transition-colors">
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Main Content Split Layout ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8 relative z-20">
        
        {/* Left Column: Categories */}
        <div className="lg:col-span-2 space-y-10">
          <FadeSection>
            <SectionHeader hindi="चर्चा श्रेणियाँ" english="Discussion Categories" />
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categories.map((cat, i) => (
                <div key={cat.id} className="group relative rounded-2xl overflow-hidden bg-white border border-[#F0D5B8] shadow-sm hover:shadow-xl hover:shadow-orange-900/10 transition-all duration-300 cursor-pointer">
                  <div className="h-40 relative overflow-hidden">
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-serif text-xl font-bold">{en ? cat.title : cat.titleHi}</h3>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col justify-between h-[120px]">
                    <p className="text-[#7A5C45] text-sm line-clamp-2">{cat.description}</p>
                    <div className="flex items-center justify-between mt-4 text-xs font-semibold text-[#E8622A]">
                      <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {cat.topics} {en ? "Topics" : "विषय"}</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">{en ? "Explore" : "देखें"} <ChevronRight className="w-4 h-4" /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>

          <FadeSection delay={150}>
            <div className="bg-white rounded-2xl border border-[#F0D5B8] shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-[#F0D5B8] bg-gradient-to-r from-[#FFF9F2] to-white flex items-center justify-between">
                <h3 className="font-serif font-bold text-xl text-[#5C1010] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#E8622A]" /> {en ? "Trending Discussions" : "ट्रेंडिंग चर्चाएँ"}
                </h3>
                <button className="text-sm font-semibold text-[#E8622A] hover:text-[#C04A18]">{en ? "View All" : "सभी देखें"}</button>
              </div>
              <div className="divide-y divide-[#F0D5B8]/50">
                {threads.length === 0 ? (
                  <div className="p-8 text-center text-[#7A5C45]">
                    {en ? "No discussions found." : "कोई चर्चा नहीं मिली।"}
                  </div>
                ) : (
                  threads.map((thread) => (
                    <div key={thread.id} className="p-6 hover:bg-[#FFF9F2]/50 transition-colors cursor-pointer group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#E8622A]/80 px-2 py-0.5 rounded-full">{en ? "General" : "सामान्य"}</span>
                            <span className="text-xs text-[#7A5C45] font-medium flex items-center gap-1"><Hash className="w-3 h-3"/> {thread.id.slice(0, 8)}</span>
                          </div>
                          <h4 className="text-[#1E0F05] font-bold text-lg leading-snug group-hover:text-[#E8622A] transition-colors mb-2">
                            {thread.title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-[#7A5C45] font-medium">
                            <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#C04A18]" /> {thread.author?.firstName || 'Admin'}</span>
                            <span>•</span>
                            <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-center justify-center bg-[#FDF5EC] border border-[#F0D5B8] rounded-xl px-4 py-2 group-hover:bg-[#E8622A]/10 group-hover:border-[#E8622A]/30 transition-colors">
                          <span className="font-bold text-[#5C1010] text-lg">{thread._count?.comments || 0}</span>
                          <span className="text-[10px] uppercase text-[#7A5C45] font-semibold">{en ? "Replies" : "जवाब"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </FadeSection>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          <FadeSection delay={200}>
            <div className="bg-gradient-to-br from-[#E8622A] to-[#C04A18] rounded-2xl p-6 text-white shadow-lg shadow-orange-900/20 relative overflow-hidden">
              
              <div className="relative z-10">
                <h3 className="font-serif font-bold text-xl mb-2">
                  {user 
                    ? (en ? "Start a New Discussion" : "नई चर्चा शुरू करें")
                    : (en ? "Join the Conversation" : "चर्चा में शामिल हों")
                  }
                </h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  {user 
                    ? (en ? "You are logged in. Share your thoughts, ask questions, and engage with the community by starting a new thread." : "आप लॉग इन हैं। अपने विचार साझा करें, प्रश्न पूछें और नया थ्रेड शुरू करके समुदाय से जुड़ें।")
                    : (en ? "Sign in to create new topics, reply to discussions, and connect directly with other members." : "नए विषय बनाने, चर्चाओं का जवाब देने और अन्य सदस्यों से सीधे जुड़ने के लिए साइन इन करें।")
                  }
                </p>
                <button 
                  onClick={() => navigate(user ? '/dashboard' : '/login')}
                  className="w-full bg-white text-[#C04A18] font-bold py-3 rounded-xl hover:bg-[#FFF9F2] transition-colors shadow-md"
                >
                  {user 
                    ? (en ? "Create New Topic" : "नया विषय बनाएं")
                    : (en ? "Login to Post" : "पोस्ट करने के लिए लॉगिन करें")
                  }
                </button>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={300}>
            <div className="bg-white rounded-2xl border border-[#F0D5B8] p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#5C1010] mb-4">{en ? "Forum Statistics" : "फोरम सांख्यिकी"}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0D5B8]/50 pb-3">
                  <span className="text-[#7A5C45] text-sm font-medium">{en ? "Total Members" : "कुल सदस्य"}</span>
                  <span className="font-bold text-[#1E0F05]">14,205</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#F0D5B8]/50 pb-3">
                  <span className="text-[#7A5C45] text-sm font-medium">{en ? "Active Threads" : "सक्रिय थ्रेड्स"}</span>
                  <span className="font-bold text-[#1E0F05]">3,492</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A5C45] text-sm font-medium">{en ? "Messages Sent" : "भेजे गए संदेश"}</span>
                  <span className="font-bold text-[#1E0F05]">128,944</span>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
        
      </div>
    </div>
  );
}

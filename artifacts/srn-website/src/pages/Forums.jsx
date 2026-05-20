import { useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, TrendingUp, Users, Search, ChevronRight, Hash } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useFadeIn } from "../hooks/useFadeIn";

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

const trendingThreads = [
  { id: 1, title: "Strategies for youth employment in rural sectors", author: "Rajesh K.", replies: 342, category: "Policy Discussions", time: "2h ago" },
  { id: 2, title: "Organizing the upcoming digital literacy drive", author: "Priya M.", replies: 128, category: "Local Chapters", time: "5h ago" },
  { id: 3, title: "Feedback on the new education reform proposals", author: "Dr. Singh", replies: 512, category: "National Policy", time: "1d ago" },
  { id: 4, title: "Volunteer coordination for Mumbai convention", author: "Amit P.", replies: 89, category: "Events & Meets", time: "1d ago" },
];

export default function Forums() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Forums | Sashakt Rashtra Nirman";
  }, []);

  return (
    <div className="bg-[#FFF9F2] min-h-screen pb-20">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#1E0F05] py-32 text-center px-6 overflow-hidden flex items-center justify-center min-h-[45vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url('/forums_hero_bg_1779205444362.png')` }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, white, white 1px, transparent 1px, transparent 28px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9F2] via-[#1E0F05]/80 to-[#1E0F05]/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(232,98,42,0.3)]">
            <MessageSquare className="w-4 h-4 text-[#E8622A]" />
            <span className="text-white/90 text-sm font-medium tracking-wide uppercase">Community Forums</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif leading-tight drop-shadow-lg">
            Raise Your <span className="text-[#E8622A]">Voice</span>
          </h1>
          <p className="text-xl text-[#F47A3A] mt-3 font-medium tracking-wide drop-shadow">
            सामुदायिक मंच
          </p>
          
          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search discussions, topics, or members..."
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
                      <h3 className="text-white font-serif text-xl font-bold">{cat.title}</h3>
                      <p className="text-[#F47A3A] text-sm font-medium">{cat.titleHi}</p>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col justify-between h-[120px]">
                    <p className="text-[#7A5C45] text-sm line-clamp-2">{cat.description}</p>
                    <div className="flex items-center justify-between mt-4 text-xs font-semibold text-[#E8622A]">
                      <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {cat.topics} Topics</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">Explore <ChevronRight className="w-4 h-4" /></span>
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
                  <TrendingUp className="w-5 h-5 text-[#E8622A]" /> Trending Discussions
                </h3>
                <button className="text-sm font-semibold text-[#E8622A] hover:text-[#C04A18]">View All</button>
              </div>
              <div className="divide-y divide-[#F0D5B8]/50">
                {trendingThreads.map((thread) => (
                  <div key={thread.id} className="p-6 hover:bg-[#FFF9F2]/50 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#E8622A]/80 px-2 py-0.5 rounded-full">{thread.category}</span>
                          <span className="text-xs text-[#7A5C45] font-medium flex items-center gap-1"><Hash className="w-3 h-3"/> {thread.id}842</span>
                        </div>
                        <h4 className="text-[#1E0F05] font-bold text-lg leading-snug group-hover:text-[#E8622A] transition-colors mb-2">
                          {thread.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-[#7A5C45] font-medium">
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#C04A18]" /> {thread.author}</span>
                          <span>•</span>
                          <span>{thread.time}</span>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-center justify-center bg-[#FDF5EC] border border-[#F0D5B8] rounded-xl px-4 py-2 group-hover:bg-[#E8622A]/10 group-hover:border-[#E8622A]/30 transition-colors">
                        <span className="font-bold text-[#5C1010] text-lg">{thread.replies}</span>
                        <span className="text-[10px] uppercase text-[#7A5C45] font-semibold">Replies</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeSection>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          <FadeSection delay={200}>
            <div className="bg-gradient-to-br from-[#E8622A] to-[#C04A18] rounded-2xl p-6 text-white shadow-lg shadow-orange-900/20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 10px)`}}/>
              <div className="relative z-10">
                <h3 className="font-serif font-bold text-xl mb-2">Join the Conversation</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Sign in to create new topics, reply to discussions, and connect directly with other members.
                </p>
                <button className="w-full bg-white text-[#C04A18] font-bold py-3 rounded-xl hover:bg-[#FFF9F2] transition-colors shadow-md">
                  Login to Post
                </button>
              </div>
            </div>
          </FadeSection>

          <FadeSection delay={300}>
            <div className="bg-white rounded-2xl border border-[#F0D5B8] p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#5C1010] mb-4">Forum Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F0D5B8]/50 pb-3">
                  <span className="text-[#7A5C45] text-sm font-medium">Total Members</span>
                  <span className="font-bold text-[#1E0F05]">14,205</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#F0D5B8]/50 pb-3">
                  <span className="text-[#7A5C45] text-sm font-medium">Active Threads</span>
                  <span className="font-bold text-[#1E0F05]">3,492</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7A5C45] text-sm font-medium">Messages Sent</span>
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

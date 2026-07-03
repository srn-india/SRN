import { useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Video, Newspaper, Download, ExternalLink, PlayCircle } from "lucide-react";
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

export default function Media() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Media & Gallery | Sashakt Rashtra Nirman";
  }, []);

  return (
    <div className="bg-[#FDF5EC] min-h-screen">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6 overflow-hidden">
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.32]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif leading-tight drop-shadow-sm">
            Media & <span className="text-[#E8622A]">Gallery</span>
          </h1>
          <p className="text-xl text-[#7A5C45] mt-3 font-medium tracking-wide mb-6">
            मीडिया और गैलरी
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF9F2] hover:bg-[#E8622A] border border-[#F0D5B8]/60 hover:border-[#E8622A] transition-all text-[#7A5C45] hover:text-white font-medium text-sm shadow-sm">
              <Camera className="w-4 h-4" /> Photo Gallery
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF9F2] hover:bg-[#E8622A] border border-[#F0D5B8]/60 hover:border-[#E8622A] transition-all text-[#7A5C45] hover:text-white font-medium text-sm shadow-sm">
              <Video className="w-4 h-4" /> Video Archives
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFF9F2] hover:bg-[#E8622A] border border-[#F0D5B8]/60 hover:border-[#E8622A] transition-all text-[#7A5C45] hover:text-white font-medium text-sm shadow-sm">
              <Newspaper className="w-4 h-4" /> Press Releases
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Bento Grid Gallery ─────────────────────────────────────── */}
      <section className="px-6 relative z-20 pt-8 pb-16">
        <div className="max-w-7xl mx-auto">
          
          <FadeSection>
            {/* 
              Bento Grid Layout using CSS Grid 
              Columns: 4 on desktop, 1 on mobile
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:auto-rows-[250px]">
              
              {/* ITEM 1: Large Video Block (Spans 2 cols, 2 rows) */}
              <div className="lg:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden group shadow-lg">
                <img src="/media_video_1779217028763.png" alt="Video cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#E8622A]/80 backdrop-blur-sm flex items-center justify-center text-white scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                    <PlayCircle className="w-8 h-8" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#E8622A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-3 uppercase tracking-wider">Featured Video</div>
                  <h3 className="text-white text-2xl font-serif font-bold leading-tight">National President's Keynote Address 2026</h3>
                </div>
              </div>

              {/* ITEM 2: Tall Image Block (Spans 1 col, 2 rows) */}
              <div className="lg:row-span-2 relative rounded-3xl overflow-hidden group shadow-lg">
                <img src="/media_gallery_1_1779217045574.png" alt="Crowd" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-3 border border-white/30 uppercase tracking-wider">Gallery</div>
                  <h3 className="text-white text-lg font-serif font-bold leading-tight">Youth Empowerment Rally, Delhi</h3>
                </div>
              </div>

              {/* ITEM 3: Standard Square */}
              <div className="relative rounded-3xl overflow-hidden group shadow-lg bg-[#5C1010] p-6 flex flex-col justify-between">
                <Newspaper className="w-8 h-8 text-[#E8622A]" />
                <div>
                  <h3 className="text-white font-serif font-bold text-lg mb-2">Press Release</h3>
                  <p className="text-white/60 text-sm mb-4 line-clamp-3">The new digital literacy initiative has successfully reached over 500 villages in its first phase...</p>
                  <button className="text-[#F47A3A] flex items-center gap-1 text-sm font-semibold hover:text-white transition-colors">Read Full <ExternalLink className="w-3 h-3"/></button>
                </div>
              </div>

              {/* ITEM 4: Standard Image */}
              <div className="relative rounded-3xl overflow-hidden group shadow-lg">
                <img src="/init_antyodaya_1779216957012.png" alt="Community" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-white font-serif font-bold">Community Outreach</h3>
                </div>
              </div>

              {/* ITEM 5: Wide Image Block (Spans 2 cols, 1 row) */}
              <div className="lg:col-span-2 relative rounded-3xl overflow-hidden group shadow-lg">
                <img src="/media_press_1779217012816.png" alt="Press Conference" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-[#1E0F05]/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-2 border border-white/20 uppercase tracking-wider">Press Conference</div>
                  <h3 className="text-white text-xl font-serif font-bold leading-tight">Discussion of New National Education Policies</h3>
                </div>
              </div>

              {/* ITEM 6: Standard Graphic/Resource Block */}
              <div className="relative rounded-3xl overflow-hidden group shadow-lg bg-gradient-to-br from-[#E8622A] to-[#C04A18] p-6 flex flex-col justify-between text-white">
                
                <div className="relative z-10 flex justify-between items-start">
                  <Download className="w-8 h-8" />
                  <span className="bg-white/20 text-xs px-2 py-1 rounded font-semibold">PDF</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-serif font-bold text-lg mb-1">Annual Report 2025</h3>
                  <p className="text-white/80 text-sm">Download the comprehensive yearly review.</p>
                </div>
              </div>

            </div>
          </FadeSection>

        </div>
      </section>

    </div>
  );
}

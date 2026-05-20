import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Languages, User, Calendar, MessageSquare, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const menuCategories = [
  {
    titleEn: "The Party",
    titleHi: "पार्टी",
    links: [
      { path: "/", hindiName: "मुखपृष्ठ", englishName: "Home" },
      { path: "/about", hindiName: "हमारे बारे में", englishName: "About Us" },
      { path: "/uddeshya", hindiName: "उद्देश्य", englishName: "Objectives" },
      { path: "/initiatives", hindiName: "हमारी पहल", englishName: "Our Initiatives" },
    ],
  },
  {
    titleEn: "Organisation",
    titleHi: "संगठन",
    links: [
      { path: "/sangathan", hindiName: "संगठन", englishName: "Sangathan" },
      { path: "/margdarshak-mandal", hindiName: "मार्गदर्शक मंडल", englishName: "Margdarshak Mandal" },
      { path: "/volunteer", hindiName: "स्वयंसेवक", englishName: "Volunteer" },
    ],
  },
  {
    titleEn: "Media & Resources",
    titleHi: "मीडिया और संसाधन",
    links: [
      { path: "/media", hindiName: "मीडिया और गैलरी", englishName: "Media & Gallery" },
      { path: "/events", hindiName: "कार्यक्रम", englishName: "Events" },
      { path: "/forums", hindiName: "मंच", englishName: "Forums" },
    ],
  },
  {
    titleEn: "Action & Contact",
    titleHi: "कार्रवाई और संपर्क",
    links: [
      { path: "/become-member", hindiName: "सदस्य बनें", englishName: "Become a Member", isButton: true },
      { path: "/donate", hindiName: "दान करें", englishName: "Make a Donation", isButton: true },
      { path: "/contact", hindiName: "संपर्क करें", englishName: "Contact Us" },
    ],
  },
];

export default function Navbar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();
  const { user } = useAuth();
  const en = lang === "en";
  
  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setIsOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleLinkClick = () => setTimeout(() => setIsOpen(false), 200);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35 } },
    exit:   { opacity: 0, transition: { duration: 0.25 } },
  };

  const panelVariants = {
    hidden:   { opacity: 0, y: -24, scale: 0.97 },
    visible:  { opacity: 1, y: 0,   scale: 1, transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1], delay: 0.05 } },
    exit:     { opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.25 } },
  };

  const linkVariants = {
    hidden:  { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut", delay: 0.15 + i * 0.05 } }),
  };

  return (
    <>
      {/* ── Global Header ─────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 pointer-events-none">
        
        {/* Top Left: Logo & Name */}
        <Link to="/" className="flex items-center gap-3 pointer-events-auto group">
          <img src="/logo.PNG" alt="SRN Logo" className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
          <div className="hidden sm:block">
            <h1 className="text-white font-bold text-lg font-serif leading-tight drop-shadow-md">
              {en ? "Sashakt Rashtra Nirman" : "सशक्त राष्ट्र निर्माण"}
            </h1>
            <p className="text-[#F47A3A] text-xs font-serif tracking-wide drop-shadow-md">
              {en ? "सशक्त राष्ट्र निर्माण" : "Sashakt Rashtra Nirman"}
            </p>
          </div>
        </Link>

        {/* Top Right: Buttons & Hamburger */}
        <div className="flex items-center gap-3 pointer-events-auto">


          {user ? (
            !isDashboard && (
              <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white/80 hover:text-white transition-all shadow-sm hover:-translate-y-0.5">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">{en ? "Dashboard" : "डैशबोर्ड"}</span>
              </Link>
            )
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white/80 hover:text-white transition-all shadow-sm hover:-translate-y-0.5">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{en ? "Login" : "लॉगिन"}</span>
            </Link>
          )}

          {/* Hamburger button (Changes to X when open inside overlay) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 shrink-0 relative rounded-[10px] bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all duration-300 shadow-sm hover:-translate-y-0.5 z-50"
            aria-label="Toggle menu"
          >
            <span className={`absolute left-1/2 -translate-x-1/2 w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[14px]"}`} />
            <span className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`absolute left-1/2 -translate-x-1/2 w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[14px]"}`} />
          </button>
        </div>
      </div>

      {/* ── Full-screen Mega Menu Overlay ───────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-white dark:bg-[#0A0402]"
            style={{ background: "rgba(10, 4, 2, 0.95)" }}
          >
            {/* Blurred bg layer */}
            <div className="absolute inset-0 backdrop-blur-3xl" />

            {/* Subtle noise texture */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
              }}
            />

            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full h-full flex flex-col pt-28 pb-10 px-6 md:px-16 overflow-y-auto"
            >
              
              {/* Menu Grid Container */}
              <div className="max-w-7xl mx-auto w-full flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">
                  
                  {menuCategories.map((category, colIdx) => (
                    <div key={category.titleEn} className="flex flex-col">
                      <motion.h2 
                        custom={colIdx}
                        variants={linkVariants}
                        className="text-[#E8622A] font-bold text-xl font-serif mb-6 pb-2 border-b border-white/10"
                      >
                        {en ? category.titleEn : category.titleHi}
                      </motion.h2>
                      
                      <ul className="space-y-4">
                        {category.links.map((link, linkIdx) => {
                          const isActive = location.pathname === link.path;
                          
                          if (link.isButton) {
                            return (
                              <motion.li key={link.path} custom={colIdx + linkIdx} variants={linkVariants}>
                                <Link
                                  to={link.path}
                                  onClick={handleLinkClick}
                                  className="inline-block mt-2 w-full text-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white font-semibold shadow-lg hover:shadow-orange-900/50 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                  {en ? link.englishName : link.hindiName}
                                </Link>
                              </motion.li>
                            );
                          }

                          return (
                            <motion.li key={link.path} custom={colIdx + linkIdx} variants={linkVariants}>
                              <Link
                                to={link.path}
                                onClick={handleLinkClick}
                                className={`block group transition-colors duration-200 ${
                                  isActive ? "text-[#F47A3A]" : "text-white/70 hover:text-white"
                                }`}
                              >
                                <span className="text-[15px] font-medium block">
                                  {en ? link.englishName : link.hindiName}
                                </span>
                                <span className="text-[11px] text-white/30 group-hover:text-[#F47A3A]/50 transition-colors block mt-0.5">
                                  {en ? link.hindiName : link.englishName}
                                </span>
                              </Link>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}

                </div>
              </div>

              {/* Bottom Footer Area within Menu */}
              <motion.div 
                custom={10} 
                variants={linkVariants}
                className="mt-16 max-w-7xl mx-auto w-full border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Language Toggle */}
                <div className="flex items-center gap-4 bg-white/5 p-1.5 rounded-xl border border-white/10">
                  <Languages className="w-4 h-4 text-[#E8622A] ml-2" />
                  <div className="flex bg-black/40 rounded-lg p-0.5">
                    <button
                      onClick={() => !en && toggleLang()}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        en ? "bg-[#E8622A] text-white shadow-md" : "text-white/50 hover:text-white"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => en && toggleLang()}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                        !en ? "bg-[#E8622A] text-white shadow-md" : "text-white/50 hover:text-white"
                      }`}
                    >
                      HI
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-6">
                  <a href="tel:+917652012487" className="flex items-center gap-2 text-white/60 hover:text-[#F47A3A] transition-colors text-sm">
                    <Phone className="w-4 h-4 text-[#E8622A]" />
                    +91 76520 12487
                  </a>
                  <a href="mailto:srnindia@yahoo.com" className="flex items-center gap-2 text-white/60 hover:text-[#F47A3A] transition-colors text-sm">
                    <Mail className="w-4 h-4 text-[#E8622A]" />
                    srnindia@yahoo.com
                  </a>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

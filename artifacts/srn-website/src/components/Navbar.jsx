import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Languages, User, Calendar, MessageSquare, X, Lock, ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const menuCategories = [
  {
    titleEn: "About Us",
    titleHi: "हमारे बारे में",
    links: [
      { path: "/", hindiName: "मुखपृष्ठ", englishName: "Home" },
      { path: "/uddeshya", hindiName: "उद्देश्य", englishName: "Our Aim & Objectives" },
      { path: "/about-team", hindiName: "टीम परिचय", englishName: "About the Team" },
      { path: "/initiatives", hindiName: "हमारी पहल", englishName: "Our Initiatives" },
    ],
  },
  {
    titleEn: "Organisation",
    titleHi: "संगठन",
    links: [
      { path: "/sangathan", hindiName: "संगठन", englishName: "Sangathan" },
      { path: "/organisation/sansrakshak", hindiName: "संरक्षक", englishName: "Sanrakshak" },
      { path: "/organisation/national-president", hindiName: "राष्ट्रीय अध्यक्ष", englishName: "National President" },
      { path: "/organisation/advisory-board", hindiName: "सलाहकार मंडल", englishName: "Salahkar Mandal/Advisory board", isLocked: true },
      { path: "/organisation/national-office-bearers", hindiName: "राष्ट्रीय पदाधिकारी", englishName: "National office bearers", isLocked: true },
      { path: "/organisation/morcha", hindiName: "मोर्चा", englishName: "Morcha", isLocked: true },
      { path: "/organisation/department", hindiName: "विभाग/प्रभारी", englishName: "Department/Prabhari", isLocked: true },
      { path: "/organisation/state-bearers", hindiName: "राज्य पदाधिकारी", englishName: "State bearers", isLocked: true },

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
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguage();
  const { user } = useAuth();
  const en = lang === "en";
  const [showMoreOrg, setShowMoreOrg] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setIsOpen]);

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      // Don't hide navbar if the menu is open
      if (isOpen) {
        setIsVisible(true);
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { 
      document.body.style.overflow = ""; 
    };
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

  const isProfile = location.pathname === "/profile";
  if (isDashboard || isProfile) return null;

  return (
    <>
      {/* ── Global Header ─────────────────────────────────────── */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1E0F05]/80 backdrop-blur-md border-b border-white/10 pointer-events-auto shadow-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        
        {/* Top Left: Logo & Name */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
          <img src="/logo.PNG" alt="SRN Logo" className="w-[56px] h-[56px] md:w-[52px] md:h-[52px] object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
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
        <div className="flex items-center gap-1.5 sm:gap-2">

          {user ? (
            !isDashboard && (
              <Link to="/dashboard" className="flex items-center justify-center sm:justify-start gap-2 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg bg-white/10 sm:bg-transparent hover:bg-white/20 sm:hover:bg-white/10 backdrop-blur-sm sm:backdrop-blur-none border border-white/5 sm:border-transparent text-white sm:text-white/80 hover:text-white transition-all duration-300">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-sm font-medium hidden sm:block">{en ? "Dashboard" : "डैशबोर्ड"}</span>
              </Link>
            )
          ) : (
            <Link to="/login" className="flex items-center justify-center sm:justify-start gap-2 w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-lg bg-white/10 sm:bg-transparent hover:bg-white/20 sm:hover:bg-white/10 backdrop-blur-sm sm:backdrop-blur-none border border-white/5 sm:border-transparent text-white sm:text-white/80 hover:text-white transition-all duration-300">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-sm font-medium hidden sm:block">{en ? "Login" : "लॉगिन"}</span>
            </Link>
          )}

          {/* Phone button */}
          <button
            onClick={() => setShowPhonePopup(true)}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/5 text-white transition-all duration-300"
            aria-label="Contact Phone"
          >
            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Hamburger button (Changes to X when open inside overlay) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 relative rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/5 text-white transition-all duration-300 z-50 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <span className={`absolute left-1/2 -translate-x-1/2 w-4 sm:w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-[12px] sm:top-[14px]"}`} />
            <span className={`absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`absolute left-1/2 -translate-x-1/2 w-4 sm:w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-[12px] sm:bottom-[14px]"}`} />
          </button>
        </div>
      </div>

      {/* ── Phone Popup Overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {showPhonePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-[#1E0F05]/80 backdrop-blur-sm"
            onClick={() => setShowPhonePopup(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FDF5EC] rounded-2xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative border border-[#E8D5B8]"
            >
              <button
                onClick={() => setShowPhonePopup(false)}
                className="absolute top-4 right-4 text-[#5C3A1E] hover:text-[#E8622A] bg-[#FFF9F2] p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-16 h-16 rounded-full bg-[#E8622A]/10 flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-[#E8622A]" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#2C1810] mb-2">
                  {en ? "Call Us" : "हमें कॉल करें"}
                </h3>
                <p className="text-[#7A5C45] text-sm mb-6">
                  {en ? "Reach out to us for any inquiries or support." : "किसी भी पूछताछ या सहायता के लिए हमसे संपर्क करें।"}
                </p>
                
                <a
                  href="tel:+917652012487"
                  className="w-full py-3.5 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-lg flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  +91 76520 12487
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Full-screen Mega Menu Overlay ───────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-[#1E0F05]/75"
          >
            {/* Blurred bg layer */}
            <div className="absolute inset-0 backdrop-blur-md" />

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
              className="relative z-10 w-full h-[100dvh] flex flex-col pt-28 pb-8 px-6 md:px-12 overflow-y-auto overscroll-y-contain touch-pan-y"
              data-lenis-prevent="true"
            >
              
              {/* Menu Grid Container */}
              <div className="max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                  
                  {menuCategories.map((category, colIdx) => {
                    let linksToRender = category.links;
                    // Add Dashboard button to Action & Contact if user is logged in
                    if (category.titleEn === "Action & Contact" && user) {
                      linksToRender = [
                        { path: "/dashboard", hindiName: "डैशबोर्ड", englishName: "Go to Dashboard", isButton: true },
                        ...category.links
                      ];
                    }
                    let baseLinks = linksToRender;
                    let extraLinks = [];
                    if (category.titleEn === "Organisation") {
                      baseLinks = linksToRender.slice(0, 3);
                      extraLinks = linksToRender.slice(3);
                    }

                    const renderLink = (link, linkIdx, isExtra = false) => {
                      const isActive = location.pathname === link.path;
                      const animationProps = isExtra ? {} : { custom: colIdx + linkIdx, variants: linkVariants };
                      
                      if (link.isButton) {
                        return (
                          <motion.li key={link.path} {...animationProps}>
                            <Link
                              to={link.path}
                              onClick={handleLinkClick}
                              className="flex items-center justify-center w-full px-3 py-2.5 md:py-2 mt-1 rounded-xl bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white font-semibold shadow-lg hover:shadow-orange-900/50 hover:scale-[1.02] transition-all duration-300 border border-[#F47A3A]/30 text-base"
                            >
                              {en ? link.englishName : link.hindiName}
                            </Link>
                          </motion.li>
                        );
                      }

                      if (link.isLocked) {
                        return (
                          <motion.li key={link.path} {...animationProps}>
                            <div
                              className="block w-full px-3 py-2 md:py-1.5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md text-white/40 cursor-not-allowed select-none relative group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  <span className="text-base font-semibold leading-snug">
                                    {en ? link.englishName : link.hindiName}
                                  </span>
                                  <span className="text-xs text-white/40 font-medium">
                                    {en ? link.hindiName : link.englishName}
                                  </span>
                                </div>
                                <Lock className="w-3.5 h-3.5 text-[#E8622A]/70" />
                              </div>
                            </div>
                          </motion.li>
                        );
                      }

                      return (
                        <motion.li key={link.path} {...animationProps}>
                          <Link
                            to={link.path}
                            onClick={handleLinkClick}
                            className={`block w-full px-3 py-2 md:py-1.5 rounded-xl border backdrop-blur-md transition-all duration-300 group ${
                              isActive 
                                ? "bg-[#E8622A]/20 border-[#E8622A]/50 shadow-[0_0_15px_rgba(232,98,42,0.15)] text-white" 
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-px text-white/70 hover:text-white"
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-base font-semibold leading-snug">
                                {en ? link.englishName : link.hindiName}
                              </span>
                              <span className={`text-xs font-medium transition-colors ${isActive ? "text-[#F47A3A]" : "text-white/40 group-hover:text-white/60"}`}>
                                {en ? link.hindiName : link.englishName}
                              </span>
                            </div>
                          </Link>
                        </motion.li>
                      );
                    };
                    
                    return (
                    <div key={category.titleEn} className="flex flex-col">
                      <motion.h2 
                        custom={colIdx}
                        variants={linkVariants}
                        className="text-[#E8622A] font-bold text-2xl font-serif mb-5 pb-2 border-b border-white/10"
                      >
                        {en ? category.titleEn : category.titleHi}
                      </motion.h2>
                      
                      <ul className="flex flex-col gap-1.5">
                        {baseLinks.map((link, linkIdx) => renderLink(link, linkIdx))}

                        {extraLinks.length > 0 && (
                          <AnimatePresence>
                            {showMoreOrg && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-1.5 overflow-hidden"
                              >
                                {extraLinks.map((link, linkIdx) => renderLink(link, linkIdx + 3, true))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {extraLinks.length > 0 && !showMoreOrg && (
                          <motion.li variants={linkVariants}>
                            <button
                              onClick={() => setShowMoreOrg(true)}
                              className="block w-full px-3 py-2 mt-2 rounded-xl border border-[#E8622A]/30 bg-[#E8622A]/10 text-[#E8622A] hover:bg-[#E8622A]/20 transition-all font-semibold text-center text-sm"
                            >
                              {en ? "View more ↓" : "और देखें ↓"}
                            </button>
                          </motion.li>
                        )}
                        {extraLinks.length > 0 && showMoreOrg && (
                          <motion.li variants={linkVariants}>
                            <button
                              onClick={() => setShowMoreOrg(false)}
                              className="block w-full px-3 py-2 mt-2 rounded-xl border border-white/20 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all font-semibold text-center text-sm"
                            >
                              {en ? "View less ↑" : "कम देखें ↑"}
                            </button>
                          </motion.li>
                        )}
                      </ul>
                    </div>
                  );
                })}

                </div>
              </div>

              {/* Bottom Footer Area within Menu */}
              <motion.div 
                custom={10} 
                variants={linkVariants}
                className="mt-auto max-w-7xl mx-auto w-full border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-6"
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
                      हिं
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

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, Languages, ArrowUpRight, User, Calendar, MessageSquare, ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const mainLinks = [
  { path: "/",          hindiName: "मुखपृष्ठ", englishName: "Home",       number: "01" },
  { path: "/about",     hindiName: "हमारे बारे में", englishName: "About Us", number: "02" },
  { path: "/sangathan", hindiName: "संगठन",    englishName: "Sangathan",  number: "03" },
  { path: "/uddeshya",  hindiName: "उद्देश्य", englishName: "Objectives", number: "04" },
  { path: "/initiatives", hindiName: "हमारी पहल", englishName: "Our Initiatives", number: "05" },
  { path: "/media",     hindiName: "मीडिया और गैलरी", englishName: "Media & Gallery", number: "06" },
  { path: "/margdarshak-mandal", hindiName: "मार्गदर्शक मंडल", englishName: "Margdarshak Mandal", number: "07" },
  { path: "/volunteer", hindiName: "स्वयंसेवक", englishName: "Volunteer", number: "08" },
  { path: "/contact",   hindiName: "संपर्क करें", englishName: "Contact Us", number: "09" },
];

const actionLinks = [
  { path: "/become-member", hindiName: "सदस्य बनें", englishName: "Become a Member" },
  { path: "/donate",    hindiName: "दान करें", englishName: "Make a Donation" },
];

const leadershipLinks = [
  { path: "/leadership/founding-presidents", hindiName: "संस्थापक अध्यक्ष", englishName: "Founding Presidents" },
];

export default function Navbar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { lang, toggleLang } = useLanguage();
  const { user } = useAuth();
  const en = lang === "en";
  
  const [leadershipOpen, setLeadershipOpen] = useState(false);

  const isDashboard = location.pathname === "/dashboard";

  const navLinksToRender = isDashboard ? [
    ...mainLinks.slice(0, 4),
    { path: "/events", hindiName: "कार्यक्रम", englishName: "Events", number: "EV" },
    { path: "/forums", hindiName: "मंच", englishName: "Forums", number: "FR" },
    ...mainLinks.slice(4)
  ] : mainLinks;

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
    visible: (i) => ({ opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut", delay: 0.15 + i * 0.08 } }),
  };

  return (
    <>
      {/* ── Top Navbar (Fixed Right) ─────────────────────────────────────── */}
      <div className="fixed top-5 right-6 z-50 flex items-center gap-3">
        {/* Events Button */}
        {!isDashboard && (
          <Link to="/events" className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-[10px] bg-black/25 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white transition-all shadow-lg hover:-translate-y-0.5">
            <Calendar className="w-4 h-4 text-[#F47A3A]" />
            <span className="text-sm font-medium">{en ? "Events" : "कार्यक्रम"}</span>
          </Link>
        )}
        
        {/* Forums Button */}
        {!isDashboard && (
          <Link to="/forums" className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-[10px] bg-black/25 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white transition-all shadow-lg hover:-translate-y-0.5">
            <MessageSquare className="w-4 h-4 text-[#F47A3A]" />
            <span className="text-sm font-medium">{en ? "Forums" : "मंच"}</span>
          </Link>
        )}

        {/* User / Login Button */}
        {user ? (
          !isDashboard && (
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-[10px] bg-[#E8622A]/90 hover:bg-[#C04A18] backdrop-blur-md border border-[#F47A3A]/30 text-white transition-all shadow-lg hover:-translate-y-0.5">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:block">{en ? "Dashboard" : "डैशबोर्ड"}</span>
            </Link>
          )
        ) : (
          <Link to="/login" className="flex items-center gap-2 px-4 py-3 rounded-[10px] bg-[#E8622A]/90 hover:bg-[#C04A18] backdrop-blur-md border border-[#F47A3A]/30 text-white transition-all shadow-lg hover:-translate-y-0.5">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{en ? "Login" : "लॉगिन"}</span>
          </Link>
        )}

        {/* Hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 shrink-0 flex flex-col items-center justify-center gap-1.5 rounded-[10px] bg-gradient-to-br from-[#E8622A] to-[#C04A18] shadow-lg shadow-orange-900/40 border border-[#F47A3A]/30 hover:shadow-orange-700/50 transition-all duration-300 hover:-translate-y-0.5"
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </div>

      {/* ── Full-screen overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(10, 4, 2, 0.55)" }}
          >
            {/* Blurred bg layer */}
            <div className="absolute inset-0 backdrop-blur-2xl" />

            {/* Subtle noise texture */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: "128px 128px",
              }}
            />

            {/* Radial orange glow at top */}
            <div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse at center, rgba(232,98,42,0.18) 0%, transparent 70%)" }}
            />

            {/* ── Content container ───────────────────────────────── */}
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10 w-full h-full flex"
            >
              {/* ─── LEFT — Logo panel (desktop) ─────────────────── */}
              <div className="hidden md:flex w-5/12 flex-col items-center justify-center px-12 relative">
                <div className="absolute right-0 top-16 bottom-16 w-px"
                  style={{ background: "linear-gradient(to bottom, transparent, rgba(232,98,42,0.3) 30%, rgba(232,98,42,0.3) 70%, transparent)" }}
                />
                <div className="absolute w-80 h-80 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(232,98,42,0.12) 0%, transparent 70%)" }}
                />

                <motion.div
                  className="relative z-10 flex flex-col items-center"
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.18, duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
                >
                  <motion.img
                    src="/logo.PNG"
                    alt="SRN Logo"
                    className="w-52 h-52 object-contain drop-shadow-2xl"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  />

                  <motion.h1
                    className="text-white font-bold text-2xl font-serif leading-snug text-center mt-5"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.38, duration: 0.5 }}
                  >
                    {en ? "Sashakt Rashtra Nirman" : "सशक्त राष्ट्र निर्माण"}
                  </motion.h1>
                  <motion.div
                    className="mt-3 w-12 h-0.5 rounded-full mx-auto"
                    style={{ background: "linear-gradient(to right, #E8622A, #D4880C)" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.52, duration: 0.45 }}
                  />
                  <motion.p
                    className="text-[#F47A3A]/60 text-sm mt-3 font-serif tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    {en ? "सशक्त राष्ट्र निर्माण" : "Sashakt Rashtra Nirman"}
                  </motion.p>
                </motion.div>
              </div>

              {/* ─── RIGHT — Nav & Controls ──────────────────────── */}
              <div className="w-full md:w-7/12 flex flex-col justify-start px-8 md:px-14 pt-28 pb-12 overflow-y-auto no-scrollbar">

                {/* Mobile logo */}
                <div className="flex md:hidden items-center gap-3 mb-10">
                  <img src="/logo.PNG" alt="logo" className="w-10 h-10 object-contain" />
                  <p className="text-white font-bold font-serif">{en ? "Sashakt Rashtra Nirman" : "सशक्त राष्ट्र निर्माण"}</p>
                </div>

                {/* ── Nav links ── */}
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 mt-12 md:mt-0">
                  {navLinksToRender.map((link, i) => {
                    const isActive = location.pathname === link.path;
                    const primary  = en ? link.englishName : link.hindiName;
                    const secondary = en ? link.hindiName : link.englishName;

                    return (
                      <motion.div
                        key={link.path}
                        custom={i}
                        variants={linkVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          to={link.path}
                          onClick={handleLinkClick}
                          className="group flex items-center gap-4 px-4 py-2.5 rounded-2xl transition-all duration-300"
                          style={{
                            background: isActive
                              ? "rgba(232,98,42,0.15)"
                              : "rgba(255,255,255,0.04)",
                            border: isActive
                              ? "1px solid rgba(232,98,42,0.45)"
                              : "1px solid rgba(255,255,255,0.07)",
                            boxShadow: isActive
                              ? "0 4px 24px rgba(232,98,42,0.12), inset 0 1px 0 rgba(255,255,255,0.06)"
                              : "inset 0 1px 0 rgba(255,255,255,0.04)",
                            backdropFilter: "blur(8px)",
                          }}
                        >
                          {/* Number */}
                          <span className={`text-xs font-mono font-bold transition-colors duration-200 shrink-0 ${
                            isActive ? "text-[#E8622A]" : "text-white/20 group-hover:text-[#E8622A]/60"
                          }`}>
                            {link.number}
                          </span>

                          {/* Divider line */}
                          <div className={`w-px h-6 shrink-0 transition-colors duration-200 ${
                            isActive ? "bg-[#E8622A]/50" : "bg-white/10 group-hover:bg-[#E8622A]/30"
                          }`} />

                          {/* Labels */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-[15px] font-serif font-semibold leading-tight transition-colors duration-200 ${
                              isActive ? "text-[#F47A3A]" : "text-white/90 group-hover:text-[#F47A3A]"
                            }`}>
                              {primary}
                            </p>
                            <p className="text-[10px] text-white/30 group-hover:text-[#F47A3A]/50 transition-colors duration-200 mt-0.5">
                              {secondary}
                            </p>
                          </div>

                          {/* Arrow */}
                          <ArrowUpRight className={`w-3.5 h-3.5 shrink-0 transition-all duration-200 ${
                            isActive ? "text-[#E8622A] opacity-100" : "text-white/20 opacity-0 group-hover:opacity-60 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          }`} />
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Leadership Section (Nested) */}
                  <motion.div
                    custom={navLinksToRender.length}
                    variants={linkVariants}
                    initial="hidden"
                    animate="visible"
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                  >
                    <button
                      onClick={() => setLeadershipOpen(!leadershipOpen)}
                      className="w-full group flex items-center justify-between gap-4 px-4 py-2.5 transition-all duration-300 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono font-bold text-white/20 group-hover:text-[#E8622A]/60">10</span>
                        <div className="w-px h-6 shrink-0 bg-white/10 group-hover:bg-[#E8622A]/30" />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-[15px] font-serif font-semibold leading-tight text-white/90 group-hover:text-[#F47A3A]">
                            {en ? "Leadership" : "नेतृत्व"}
                          </p>
                          <p className="text-[10px] text-white/30 group-hover:text-[#F47A3A]/50 mt-0.5">
                            {en ? "नेतृत्व" : "Leadership"}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-white/30 transition-transform duration-300 ${leadershipOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {leadershipOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5 bg-black/20"
                        >
                          <div className="py-2 flex flex-col">
                            {leadershipLinks.map((link) => {
                              const isActive = location.pathname === link.path;
                              return (
                                <Link
                                  key={link.path}
                                  to={link.path}
                                  onClick={handleLinkClick}
                                  className={`px-16 py-3 text-sm font-medium transition-colors ${
                                    isActive ? "text-[#F47A3A] bg-white/5" : "text-white/60 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  {en ? link.englishName : link.hindiName}
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </nav>

                {/* ── Action Buttons ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {actionLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      custom={navLinksToRender.length + 1 + i}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        to={link.path}
                        onClick={handleLinkClick}
                        className="group relative flex items-center justify-center px-6 py-3 rounded-xl overflow-hidden shadow-lg hover:shadow-orange-900/40 transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          background: "linear-gradient(135deg, #E8622A, #C04A18)",
                          border: "1px solid rgba(232,98,42,0.5)",
                        }}
                      >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 flex flex-col items-center">
                          <span className="text-white font-serif font-bold text-[15px] tracking-wide">
                            {en ? link.englishName : link.hindiName}
                          </span>
                          <span className="text-orange-200/60 text-[10px] mt-0.5">
                            {en ? link.hindiName : link.englishName}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Shimmer divider */}
                <div className="h-px mb-6"
                  style={{ background: "linear-gradient(to right, transparent, rgba(232,98,42,0.25), transparent)" }}
                />

                {/* ── Language toggle ── */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Languages className="w-3 h-3 text-[#E8622A]/60" />
                    <p className="text-white/35 text-[10px] uppercase tracking-[0.2em] font-medium">
                      {en ? "Language / भाषा" : "भाषा / Language"}
                    </p>
                  </div>
                  <button
                    onClick={toggleLang}
                    className="flex items-center w-full rounded-xl overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(232,98,42,0.2)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    {["en", "hi"].map((l) => (
                      <span
                        key={l}
                        className="flex-1 py-2.5 text-sm font-semibold text-center transition-all duration-300"
                        style={lang === l ? {
                          background: "linear-gradient(135deg, #E8622A, #C04A18)",
                          color: "white",
                          boxShadow: "0 2px 12px rgba(232,98,42,0.35)",
                        } : { color: "rgba(255,255,255,0.35)" }}
                      >
                        {l === "en" ? "English" : "हिंदी"}
                      </span>
                    ))}
                  </button>
                </motion.div>

                {/* ── Contact ── */}
                <motion.div
                  className="flex flex-col gap-2.5"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                >
                  {[
                    { href: "tel:+917652012487", Icon: Phone, label: "+91 76520 12487" },
                    { href: "mailto:srnindia@yahoo.com", Icon: Mail, label: "srnindia@yahoo.com" },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={href}
                      href={href}
                      className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "rgba(232,98,42,0.12)", border: "1px solid rgba(232,98,42,0.2)" }}
                      >
                        <Icon className="w-3.5 h-3.5 text-[#E8622A]" />
                      </span>
                      <span className="text-white/50 group-hover:text-[#F47A3A] text-sm transition-colors duration-200">
                        {label}
                      </span>
                    </a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

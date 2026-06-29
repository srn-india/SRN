import { Link } from "react-router-dom";
import { Phone, Mail, ArrowRight, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t, lang } = useLanguage();
  const f = t.footer;
  const en = lang === "en";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <footer className="relative bg-[#F0E1D2] text-[#2C1810] pt-[7px] pb-4 overflow-hidden font-sans border-t-2 border-[#5C3A1E]/30">
      {/* Subtle Immersive Background Effects for Light Theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#E8622A]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D4880C]/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Floating Contact Strip Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E8622A]/30 to-transparent" />
      
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        {/* Contact Banner (Glassmorphic Light) */}
        <motion.div variants={itemVariants} className="mb-8 md:mb-10">
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-5 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#E8622A]/10 blur-[60px] rounded-full" />
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl font-bold font-serif text-[#2C1810] mb-2">
                {en ? "Need Assistance?" : "सहायता की आवश्यकता है?"}
              </h3>
              <p className="text-[#7A5C45]">
                {en ? "Reach out to us for any inquiries." : "किसी भी पूछताछ के लिए हमसे संपर्क करें।"}
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 sm:gap-6 w-full md:w-auto">
              <a
                href="tel:+917652012487"
                className="flex items-center justify-center md:justify-start gap-2 md:gap-3 bg-white hover:bg-[#FDF5EC] border border-[#E8D5B8]/50 px-4 md:px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group w-full sm:w-auto overflow-hidden"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFF9F2] border border-[#E8D5B8]/50 flex items-center justify-center group-hover:bg-[#E8622A] group-hover:border-[#E8622A] transition-colors shrink-0">
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E8622A] group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold tracking-wide text-[#5C3A1E] text-sm md:text-base whitespace-nowrap truncate">+91 76520 12487</span>
              </a>
              <a
                href="mailto:srnindia@yahoo.com"
                className="flex items-center justify-center md:justify-start gap-2 md:gap-3 bg-white hover:bg-[#FDF5EC] border border-[#E8D5B8]/50 px-4 md:px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group w-full sm:w-auto overflow-hidden"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#FFF9F2] border border-[#E8D5B8]/50 flex items-center justify-center group-hover:bg-[#E8622A] group-hover:border-[#E8622A] transition-colors shrink-0">
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#E8622A] group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold tracking-wide text-[#5C3A1E] text-sm md:text-base whitespace-nowrap truncate">srnindia@yahoo.com</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="md:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#E8622A]/10 blur-[10px] rounded-full" />
                <img
                  src="/srn-logo.png"
                  alt="Sashakt Rashtra Nirman Logo"
                  className="w-16 h-16 object-contain relative z-10 drop-shadow-sm"
                />
              </div>
              <div>
                <h2 className="font-bold font-serif text-2xl leading-tight text-[#2C1810]">
                  {en ? "Sashakt Rashtra Nirman" : "सशक्त राष्ट्र निर्माण"}
                </h2>
                <p className="text-[#E8622A] text-sm font-bold tracking-wide">
                  {en ? "सशक्त राष्ट्र निर्माण" : "Sashakt Rashtra Nirman"}
                </p>
              </div>
            </div>
            <p className="text-[#7A5C45] text-base leading-relaxed mb-6 max-w-sm">
              {f.tagline || "Dedicated to building a self-reliant and empowered nation through unity and service."}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#E8D5B8] flex items-center justify-center text-[#B89070] hover:text-white hover:bg-[#E8622A] hover:border-[#E8622A] shadow-sm transition-all duration-300 hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#E8D5B8] flex items-center justify-center text-[#B89070] hover:text-white hover:bg-[#E8622A] hover:border-[#E8622A] shadow-sm transition-all duration-300 hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#E8D5B8] flex items-center justify-center text-[#B89070] hover:text-white hover:bg-[#E8622A] hover:border-[#E8622A] shadow-sm transition-all duration-300 hover:-translate-y-1">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#E8D5B8] flex items-center justify-center text-[#B89070] hover:text-white hover:bg-[#E8622A] hover:border-[#E8622A] shadow-sm transition-all duration-300 hover:-translate-y-1">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={itemVariants} className="md:col-span-3">
            <h3 className="font-bold text-[#5C3A1E] mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8622A]" />
              {f.quickLinks}
            </h3>
            <ul className="space-y-4">
              {[
                { to: "/", label: en ? "Home" : "मुखपृष्ठ" },
                { to: "/sangathan", label: en ? "Sangathan" : "संगठन" },
                { to: "/uddeshya", label: en ? "Objectives" : "उद्देश्य" },
                { to: "/contact", label: en ? "Contact Us" : "संपर्क" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="group flex items-center text-[#7A5C45] hover:text-[#E8622A] font-medium transition-colors duration-300">
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#E8622A] transition-all duration-300 group-hover:w-full" />
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#E8622A]" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Additional Info / Registration */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <h3 className="font-bold text-[#5C3A1E] mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8622A]" />
              {f.contact} {en ? "& Info" : "और जानकारी"}
            </h3>
            <div className="space-y-6">
              <div className="bg-white/60 rounded-2xl p-5 border border-[#E8D5B8]/50 shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300">
                <p className="text-[#B89070] text-sm font-bold mb-2">{en ? "Support Our Cause" : "हमारे उद्देश्य का समर्थन करें"}</p>
                <Link to="/donate" className="inline-flex items-center text-[#2C1810] text-sm font-bold hover:text-[#E8622A] transition-colors">
                  {en ? "Make a Donation" : "दान करें"} <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="bg-gradient-to-r from-[#E8622A]/5 to-transparent rounded-2xl p-5 border border-[#E8622A]/20">
                <p className="text-[#E8622A] text-sm font-bold mb-2">{en ? "Join the Movement" : "आंदोलन में शामिल हों"}</p>
                <Link to="/become-member" className="inline-flex items-center text-[#2C1810] text-sm font-bold hover:text-[#E8622A] transition-colors">
                  {en ? "Become a Member" : "सदस्य बनें"} <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div variants={itemVariants} className="pt-4 border-t border-[#5C3A1E]/30 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[#B89070] text-xs sm:text-sm font-medium px-4">{f.copyright}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-[#B89070]">
            <Link to="#" className="hover:text-[#E8622A] transition-colors">{en ? "Privacy Policy" : "गोपनीयता नीति"}</Link>
            <Link to="#" className="hover:text-[#E8622A] transition-colors">{en ? "Terms of Service" : "सेवा की शर्तें"}</Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}

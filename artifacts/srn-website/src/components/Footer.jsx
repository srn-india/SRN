import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="bg-[#1E0F05] text-white pb-8">
      {/* Integrated Contact Strip at the top of Footer */}
      <div className="bg-gradient-to-r from-[#E8622A] to-[#C04A18] py-8 px-6 mb-12">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="tel:+917652012487"
            className="flex items-center gap-2 text-white hover:text-white/80 font-medium transition-colors duration-200"
          >
            <Phone className="w-5 h-5 shrink-0" />
            +91 76520 12487
          </a>
          <div className="hidden sm:block h-5 w-px bg-white/30" />
          <a
            href="mailto:srnindia@yahoo.com"
            className="flex items-center gap-2 text-white hover:text-white/80 font-medium transition-colors duration-200"
          >
            <Mail className="w-5 h-5 shrink-0" />
            srnindia@yahoo.com
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.PNG"
                alt="Sashakt Rashtra Nirman Logo"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div>
                <p className="font-bold font-serif text-lg leading-tight">सशक्त राष्ट्र निर्माण</p>
                <p className="text-[#F47A3A] text-xs">Sashakt Rashtra Nirman</p>
              </div>
            </div>
            <p className="text-white/50 text-sm">{f.tagline}</p>
            <p className="text-white/35 text-xs mt-2">{f.npoId}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-[#F47A3A] mb-4 text-sm uppercase tracking-wider">{f.quickLinks}</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-white/55 hover:text-[#F47A3A] text-sm transition-colors duration-200">
                  मुखपृष्ठ / Home
                </Link>
              </li>
              <li>
                <Link to="/sangathan" className="text-white/55 hover:text-[#F47A3A] text-sm transition-colors duration-200">
                  संगठन / Sangathan
                </Link>
              </li>
              <li>
                <Link to="/uddeshya" className="text-white/55 hover:text-[#F47A3A] text-sm transition-colors duration-200">
                  उद्देश्य / Objectives
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-[#F47A3A] mb-4 text-sm uppercase tracking-wider">{f.contact}</h3>
            <div className="space-y-3">
              <a
                href="tel:+917652012487"
                className="flex items-center gap-2 text-white/55 hover:text-[#F47A3A] text-sm transition-colors duration-200"
              >
                <Phone className="w-4 h-4 shrink-0 text-[#E8622A]" />
                +91 76520 12487
              </a>
              <a
                href="mailto:srnindia@yahoo.com"
                className="flex items-center gap-2 text-white/55 hover:text-[#F47A3A] text-sm transition-colors duration-200"
              >
                <Mail className="w-4 h-4 shrink-0 text-[#E8622A]" />
                srnindia@yahoo.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.07] text-center">
          <p className="text-white/35 text-sm">{f.copyright}</p>
        </div>
      </div>
    </footer>
  );
}

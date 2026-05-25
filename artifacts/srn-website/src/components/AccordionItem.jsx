import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2 } from "lucide-react";

export default function AccordionItem({ number, titleHindi, title, points, defaultOpen, lang }) {
  const [open, setOpen] = useState(defaultOpen || false);

  // Active language title
  const primaryTitle   = lang === "en" ? title      : titleHindi;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden group ${
        open
          ? "border-[#E8622A] shadow-lg shadow-orange-100"
          : "border-[#F0D5B8] hover:border-[#E8622A]/50 hover:shadow-md"
      }`}
    >
      <button
        className="w-full flex items-center gap-5 px-6 py-5 text-left bg-white"
        onClick={() => setOpen(!open)}
      >
        {/* Number badge */}
        <span
          className={`w-11 h-11 rounded-xl font-bold text-sm flex items-center justify-center shrink-0 transition-all duration-300 ${
            open
              ? "bg-gradient-to-br from-[#E8622A] to-[#C04A18] text-white shadow-md shadow-orange-200"
              : "bg-[#FDF5EC] text-[#E8622A] border border-[#E8622A]/30 group-hover:bg-[#E8622A]/10"
          }`}
        >
          {number}
        </span>

        {/* Titles */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold leading-tight font-serif text-base transition-colors duration-200 ${open ? "text-[#E8622A]" : "text-[#1E0F05]"}`}>
            {primaryTitle}
          </p>
        </div>

        {/* Chevron pill */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${open ? "bg-[#E8622A] text-white" : "bg-[#F0D5B8] text-[#E8622A]"}`}>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <div className="bg-gradient-to-b from-[#FFF9F2] to-[#FDF5EC] px-6 pb-6 pt-2">
              <div className="border-t border-[#F0D5B8] pt-4">
                <ul className="space-y-3">
                  {points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex items-start gap-3 text-sm text-[#5C3D2E] leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#E8622A] mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

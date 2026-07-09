import { useEffect } from "react";
import { motion } from "framer-motion";

const DURATION = 3.2;
const T = [0, 0.20, 0.55, 0.80, 1];

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, (DURATION + 0.15) * 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#FEF0E6" }}
      animate={{ opacity: [1, 1, 1, 1, 0] }}
      transition={{ duration: DURATION, times: T, ease: "easeInOut" }}
    >
      {/* Animated soft background rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#E8622A]/10 pointer-events-none"
          style={{ width: i * 180, height: i * 180 }}
          animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Radial glow — pulses gently */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(232,98,42,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Organization name — fades in below logo */}
      <motion.div
        className="absolute flex flex-col items-center"
        style={{ marginTop: 260 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          y:       [12, 12, 0, 0, -8],
        }}
        transition={{ duration: DURATION, times: T, ease: "easeOut" }}
      >
        <p className="text-[#2C1810] font-serif font-bold text-xl tracking-wide">
          Sashakt Rashtra Nirman
        </p>
        <p className="text-[#E8622A] font-serif text-sm mt-1 tracking-widest">
          सशक्त राष्ट्र निर्माण
        </p>
        <motion.div
          className="mt-3 h-0.5 w-full bg-gradient-to-r from-transparent via-[#E8622A] to-transparent rounded-full origin-left"
          animate={{ scaleX: [0, 0, 1, 1, 0] }}
          transition={{ duration: DURATION, times: T, ease: "easeOut" }}
          style={{ width: 160 }}
        />
      </motion.div>

      {/* Logo */}
      <motion.img
        src="/srn-logo.png"
        alt="Sashakt Rashtra Nirman"
        className="relative z-10 object-contain drop-shadow-2xl"
        style={{ width: 180, height: 180 }}
        animate={{
          opacity: [0,   1,   1,   1,   0 ],
          scale:   [0.4, 1,   1,   22,  22],
          filter: [
            "drop-shadow(0 0 0px rgba(232,98,42,0))",
            "drop-shadow(0 0 24px rgba(232,98,42,0.5))",
            "drop-shadow(0 0 32px rgba(232,98,42,0.7))",
            "drop-shadow(0 0 0px rgba(232,98,42,0))",
            "drop-shadow(0 0 0px rgba(232,98,42,0))",
          ],
        }}
        transition={{ duration: DURATION, times: T, ease: "easeOut" }}
      />

      {/* Loading dots */}
      <motion.div
        className="absolute bottom-16 flex gap-2"
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: DURATION, times: T }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#E8622A]"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
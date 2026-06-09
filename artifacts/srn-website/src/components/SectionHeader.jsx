import { useLanguage } from "../context/LanguageContext";

export default function SectionHeader({ hindi, english, darkBg = false }) {
  const { lang } = useLanguage();
  const primary = lang === "en" ? english || hindi : hindi || english;

  return (
    <div className="text-center mb-6 md:mb-10 relative z-10 px-2">
      <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold font-serif leading-tight ${darkBg ? 'text-white drop-shadow-md' : 'text-[#5C1010]'}`}>
        {primary}
      </h2>
      <div className="mx-auto mt-3 md:mt-4 h-1 w-16 md:w-20 rounded-full bg-gradient-to-r from-[#E8622A] to-[#D4880C]" />
    </div>
  );
}

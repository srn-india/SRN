import { createContext, useContext, useState } from "react";
import { content } from "../data/content";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem("srn_lang") || "en";
  });

  const toggleLang = () => {
    setLangState((prev) => {
      const next = prev === "en" ? "hi" : "en";
      try {
        localStorage.setItem("srn_lang", next);
      } catch (_) {}
      return next;
    });
  };

  const setLang = (newLang) => {
    const next = newLang === "hi" ? "hi" : "en";
    setLangState(next);
    try {
      localStorage.setItem("srn_lang", next);
    } catch (_) {}
  };

  const t = content[lang] || content.en;

  return (
    <LanguageContext.Provider value={{ lang, language: lang, toggleLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function DecorativePanel() {
  return (
    <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-[#1E0A04] relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(232,98,42,0.18) 0%, transparent 65%)" }} />
      <motion.img src="/logo.PNG" alt="Sashakt Rashtra Nirman Logo" className="w-44 h-44 object-contain drop-shadow-2xl relative z-10" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} />
      <h1 className="text-white font-bold text-2xl font-serif mt-6 text-center relative z-10 px-8">Sashakt Rashtra Nirman</h1>
      <div className="mt-3 w-12 h-0.5 rounded-full relative z-10" style={{ background: "linear-gradient(to right, #E8622A, #D4880C)" }} />
      <p className="text-[#F47A3A]/70 font-serif text-lg mt-3 text-center relative z-10 px-8">सशक्त राष्ट्र निर्माण</p>
    </div>
  );
}

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const lc = t.login;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#FEF0E6] border border-[#E8D5B8] focus:outline-none focus:border-[#E8622A] focus:ring-2 focus:ring-[#E8622A]/20 text-[#2C1810] placeholder-[#B89070] transition-colors duration-200 text-sm";
  const labelClass = "block text-sm font-semibold text-[#5C3A1E] mb-1.5";

  return (
    <div className="min-h-screen flex">
      <DecorativePanel />
      <motion.div className="flex-1 md:w-1/2 flex flex-col bg-[#FDF5EC] min-h-screen" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <div className="px-8 pt-8 pb-4">
          <Link to="/" aria-label={lc.backToHome} className="inline-flex items-center gap-2 text-sm font-medium text-[#7A5C45] hover:text-[#E8622A] transition-colors duration-200 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            {lc.backToHome}
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-8 py-8">
          <div className="w-full max-w-md">
            <motion.h2 className="text-3xl font-bold font-serif text-[#2C1810] mb-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {lc.title}
            </motion.h2>
            <motion.p className="text-sm text-[#7A5C45] mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }}>
              Welcome back — please sign in to continue.
            </motion.p>

            {error && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
                <motion.div variants={itemVariants}>
                  <label htmlFor="login-email" className={labelClass}>{lc.emailLabel}</label>
                  <input id="login-email" type="email" placeholder={lc.emailPlaceholder} autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="login-password" className={labelClass + " mb-0"}>{lc.passwordLabel}</label>
                    <Link to="/forgot-password" className="text-xs font-medium text-[#E8622A] hover:text-[#C04A18] transition-colors duration-200">
                      {lc.forgotPassword}
                    </Link>
                  </div>
                  <input id="login-password" type="password" placeholder={lc.passwordPlaceholder} autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </motion.div>

                <motion.div variants={itemVariants} className="pt-2">
                  <button type="submit" disabled={loading} className="w-full py-3.5 px-6 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#E8622A] to-[#C04A18] shadow-md shadow-orange-900/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/30 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                    {loading ? "Signing in..." : lc.submitBtn}
                  </button>
                </motion.div>
              </motion.div>
            </form>

            <motion.p className="mt-6 text-center text-sm text-[#7A5C45]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 }}>
              <Link to="/signup" className="font-semibold text-[#E8622A] hover:text-[#C04A18] transition-colors duration-200">
                {lc.noAccount}
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
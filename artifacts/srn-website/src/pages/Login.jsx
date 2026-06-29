import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Login() {
  const { t } = useLanguage();
  const { login, verifyOtp, verify2FA, API_BASE } = useAuth();
  const navigate = useNavigate();
  const lc = t.login;

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google?redirect_to=${encodeURIComponent(window.location.origin)}`;
  };

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP state — only shown for unverified manual-registered accounts
  const [showOtp, setShowOtp] = useState(false);
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  // 2FA state
  const [show2FA, setShow2FA] = useState(false);
  const [twoFaArray, setTwoFaArray] = useState(["", "", "", "", "", ""]);
  const [tempAuthToken, setTempAuthToken] = useState("");
  
  const inputRefs = useRef([]);
  const twoFaInputRefs = useRef([]);

  async function onSubmit(data) {
    setError("");
    setLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result?.requiresOtp) {
        // Unverified manual account — show OTP screen
        setRegisteredEmail(result.email || data.email);
        setShowOtp(true);
      } else if (result?.requires2FA) {
        setTempAuthToken(result.tempAuthToken);
        setShow2FA(true);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    const otpValue = otpArray.join("");
    if (otpValue.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      await verifyOtp(registeredEmail, otpValue);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify2FA(e) {
    e.preventDefault();
    const totpValue = twoFaArray.join("");
    if (totpValue.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      await verify2FA(tempAuthToken, totpValue);
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChangeOtp = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDownOtp = (index, e) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...otpArray];
    pastedData.forEach((char, i) => {
      if (/^[0-9]$/.test(char) && i < 6) newOtp[i] = char;
    });
    setOtpArray(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleChange2FA = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...twoFaArray];
    newOtp[index] = value;
    setTwoFaArray(newOtp);
    if (value && index < 5) twoFaInputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown2FA = (index, e) => {
    if (e.key === "Backspace" && !twoFaArray[index] && index > 0) {
      twoFaInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste2FA = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newOtp = [...twoFaArray];
    pastedData.forEach((char, i) => {
      if (/^[0-9]$/.test(char) && i < 6) newOtp[i] = char;
    });
    setTwoFaArray(newOtp);
    twoFaInputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 focus:outline-none focus:border-white focus:bg-white/30 focus:ring-2 focus:ring-white/20 text-white placeholder-white/60 transition-all duration-300 text-sm backdrop-blur-md";
  const labelClass = "block text-sm font-medium text-white/90 mb-1.5";

  return (
    <div 
      className="h-screen w-screen relative flex flex-col lg:flex-row justify-center lg:justify-between items-center px-4 sm:px-6 md:px-16 lg:px-24 py-6 gap-8 lg:gap-16 overflow-y-auto lg:overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
    >
      {/* Dark gradient overlay for extreme contrast and premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#1E0A04]/70 to-[#E8622A]/20 pointer-events-none" />

      {/* Left floating branding (hidden on mobile/tablet) */}
      <div className="flex-1 hidden lg:flex flex-col items-center justify-center text-center z-10 pointer-events-none">
        <motion.img 
          src="/srn-logo.png" 
          alt="Sashakt Rashtra Nirman Logo" 
          className="w-48 h-48 drop-shadow-[0_0_30px_rgba(232,98,42,0.6)] mb-8" 
          animate={{ y: [0, -12, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
        />
        <h1 className="text-white font-bold text-5xl font-serif leading-tight drop-shadow-md">
          Sashakt Rashtra <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8622A] to-[#FF9D72]">
            Nirman
          </span>
        </h1>
        <p className="text-[#FF9D72] font-serif text-2xl mt-4 drop-shadow-sm">सशक्त राष्ट्र निर्माण</p>
        <div className="mt-8 w-16 h-1 rounded-full bg-gradient-to-r from-[#E8622A] to-[#D4880C] shadow-[0_0_15px_#E8622A]" />
        <p className="text-white/70 text-lg mt-6 max-w-md font-light leading-relaxed">
          Join millions building a stronger India — one citizen at a time.
        </p>
      </div>

      {/* Glassmorphic Form Card */}
      <motion.div 
        className="w-full max-w-md bg-black/40 backdrop-blur-2xl border border-white/10 p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link 
          to="/" 
          aria-label={lc.backToHome} 
          className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          {lc.backToHome}
        </Link>

        <motion.h2 className="text-3xl font-bold font-serif text-white mb-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {showOtp ? "Verify Your Email" : show2FA ? "Two-Factor Auth" : lc.title}
        </motion.h2>
        <motion.p className="text-sm text-white/60 mb-8 font-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 }}>
          {showOtp
            ? `Enter the 6-digit code sent to ${registeredEmail}`
            : show2FA 
              ? "Enter the 6-digit code from your authenticator app"
              : "Welcome back — please sign in to continue."}
        </motion.p>

        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm backdrop-blur-md">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            {error}
          </div>
        )}

        {showOtp ? (
          /* ── OTP screen ─────────────────────────────────────────── */
          <form onSubmit={handleVerifyOtp} noValidate>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-white/90 mb-3">6-Digit OTP</label>
                <div className="flex gap-2 justify-between">
                  {otpArray.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChangeOtp(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDownOtp(idx, e)}
                      onPaste={handlePasteOtp}
                      className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:ring-2 focus:ring-[#E8622A]/50 focus:border-[#E8622A] outline-none transition-all shadow-sm backdrop-blur-md"
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || otpArray.join("").length !== 6}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#E8622A] to-[#C04A18] hover:from-[#F47A3A] hover:to-[#D45A28] shadow-[0_0_20px_rgba(232,98,42,0.4)] hover:shadow-[0_0_30px_rgba(232,98,42,0.6)] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>
            </div>
          </form>
        ) : show2FA ? (
          /* ── 2FA screen ─────────────────────────────────────────── */
          <form onSubmit={handleVerify2FA} noValidate>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-white/90 mb-3">6-Digit Authenticator Code</label>
                <div className="flex gap-2 justify-between">
                  {twoFaArray.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (twoFaInputRefs.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange2FA(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown2FA(idx, e)}
                      onPaste={handlePaste2FA}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-white/10 border border-white/20 rounded-xl text-white focus:bg-white/20 focus:ring-2 focus:ring-[#E8622A]/50 focus:border-[#E8622A] outline-none transition-all shadow-sm backdrop-blur-md"
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || twoFaArray.join("").length !== 6}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#E8622A] to-[#C04A18] hover:from-[#F47A3A] hover:to-[#D45A28] shadow-[0_0_20px_rgba(232,98,42,0.4)] hover:shadow-[0_0_30px_rgba(232,98,42,0.6)] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify 2FA & Sign In"}
              </button>
            </div>
          </form>
        ) : (
          /* ── Login form ─────────────────────────────────────────── */
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
              <motion.div variants={itemVariants}>
                <label htmlFor="login-email" className={labelClass}>{lc.emailLabel}</label>
                <input id="email" type="email" placeholder={lc.emailPlaceholder} autoComplete="email" className={inputClass} {...formRegister("email")} />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className={labelClass + " mb-0"}>{lc.passwordLabel}</label>
                  <Link to="/forgot-password" className="text-xs font-medium text-[#FF9D72] hover:text-white transition-colors duration-200">
                    {lc.forgotPassword}
                  </Link>
                </div>
                <input id="password" type="password" placeholder={lc.passwordPlaceholder} autoComplete="current-password" className={inputClass} {...formRegister("password")} />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#E8622A] to-[#C04A18] hover:from-[#F47A3A] hover:to-[#D45A28] shadow-[0_0_20px_rgba(232,98,42,0.4)] hover:shadow-[0_0_30px_rgba(232,98,42,0.6)] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : lc.submitBtn}
                </button>
              </motion.div>
            </motion.div>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#1a1411] px-3 text-white/50 font-medium tracking-wider rounded-full py-1 border border-white/10 backdrop-blur-md">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <motion.button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 sm:py-3.5 px-6 rounded-xl font-semibold border border-white/20 bg-white/10 text-white text-xs sm:text-sm hover:bg-white/20 active:bg-white/30 flex items-center justify-center gap-2 sm:gap-3 shadow-lg backdrop-blur-md transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z" />
            <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.86c2.16-1.99 3.74-4.91 3.74-8.54z" />
            <path fill="#FBBC05" d="M5.24 14.55c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.39 7.16C.5 8.93 0 10.91 0 13s.5 4.07 1.39 5.84l3.85-2.99z" />
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.86c-1.12.75-2.55 1.2-4.27 1.2-3.34 0-5.86-1.81-6.76-4.51L1.39 16.92C3.37 20.81 7.35 23 12 23z" />
          </svg>
          {lc.googleBtn}
        </motion.button>

        <motion.p className="mt-8 text-center text-xs sm:text-sm text-white/60 font-light relative z-20 pointer-events-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.45 }}>
          <Link to="/signup" className="font-semibold text-[#FF9D72] hover:text-[#FFB594] transition-colors duration-200 cursor-pointer pointer-events-auto">
            {lc.noAccount}
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
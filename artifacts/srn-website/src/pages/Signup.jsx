import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const phoneRegex = new RegExp(/^[6-9]\d{9}$/);

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").regex(/^[A-Za-z]+$/, "Only alphabetic characters allowed"),
  lastName: z.string().min(2, "Last name must be at least 2 characters").regex(/^[A-Za-z]+$/, "Only alphabetic characters allowed"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Must be a valid 10-digit Indian phone number"),
  state: z.string().min(1, "Please select a state"),
  district: z.string().min(2, "District is required"),
  gender: z.string().min(1, "Please select a gender"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

// ── Indian states and Union Territories ──────────────────────────────────────
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi (NCT)", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function Signup() {
  const { t } = useLanguage();
  const sc = t.signup;
  const { register, verifyOtp, API_BASE } = useAuth();
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false);
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      state: "",
      district: "",
      gender: "",
      password: "",
      confirm: ""
    }
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google?redirect_to=${encodeURIComponent(window.location.origin)}`;
  };

  async function onSubmit(data) {
    setError("");
    setLoading(true);
    try {
      const result = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        state: data.state,
        district: data.district,
        gender: data.gender,
        password: data.password
      });

      if (result?.requiresOtp) {
        setRegisteredEmail(result.email || data.email);
        setShowOtp(true);
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

  const handleChangeOtp = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    // Auto focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDownOtp = (index, e) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.length === 0) return;

    const newOtp = [...otpArray];
    pastedData.forEach((char, i) => {
      if (/^[0-9]$/.test(char) && i < 6) {
        newOtp[i] = char;
      }
    });
    setOtpArray(newOtp);
    // Focus last filled
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl bg-white/20 border border-white/30 " +
    "focus:outline-none focus:border-white focus:bg-white/30 focus:ring-2 focus:ring-white/20 " +
    "text-white placeholder-white/60 transition-all duration-300 text-sm backdrop-blur-md";

  const selectClass = inputClass + " cursor-pointer appearance-none";

  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23ffffff' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    paddingRight: "2.25rem",
  };

  const labelClass = "block text-xs font-medium text-white/90 mb-1";

  return (
    <div 
      className="min-h-screen relative flex flex-col lg:flex-row justify-center lg:justify-between items-center px-4 sm:px-6 md:px-16 lg:px-24 pt-24 pb-12 gap-8 lg:gap-16 overflow-y-auto overflow-x-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
    >
      {/* Dark gradient overlay for extreme contrast and premium feel */}
      <div className="fixed inset-0 bg-gradient-to-tr from-black/80 via-[#1E0A04]/70 to-[#E8622A]/20 pointer-events-none" />

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
        className="w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10 my-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link 
          to="/" 
          aria-label={sc.backToHome} 
          className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 group mb-6"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          {sc.backToHome || "Back to Home"}
        </Link>

        <div>
          <motion.h2
            className="text-3xl font-bold font-serif text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {showOtp ? "Verify Email" : sc.title}
          </motion.h2>
          <motion.p
            className="text-sm text-white/60 mb-6 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            {showOtp ? `Enter the 6-digit code sent to ${registeredEmail}` : "Join us in building a stronger nation."}
          </motion.p>

          {!showOtp && (
            <>
              {/* Google Button (top) */}
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-semibold border border-white/20 bg-white/10 text-white text-xs sm:text-sm hover:bg-white/20 active:bg-white/30 flex items-center justify-center gap-2 sm:gap-3 shadow-lg backdrop-blur-md transition-all duration-300 mb-6"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.45h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.86c2.16-1.99 3.74-4.91 3.74-8.54z" />
                  <path fill="#FBBC05" d="M5.24 14.55c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.39 7.16C.5 8.93 0 10.91 0 13s.5 4.07 1.39 5.84l3.85-2.99z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.86c-1.12.75-2.55 1.2-4.27 1.2-3.34 0-5.86-1.81-6.76-4.51L1.39 16.92C3.37 20.81 7.35 23 12 23z" />
                </svg>
                {sc.googleBtn ?? "Continue with Google"}
              </motion.button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#1a1411] px-3 text-white/50 font-medium tracking-wider rounded-full py-1 border border-white/10 backdrop-blur-md">Or sign up with email</span>
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm backdrop-blur-md">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              {error}
            </div>
          )}

          {/* Form */}
          {showOtp ? (
            <form onSubmit={handleVerifyOtp} noValidate>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>6-Digit OTP</label>
                  <div className="flex gap-2 justify-between mt-3">
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
                </motion.div>

                <motion.div variants={itemVariants} className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || otpArray.join("").length !== 6}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#E8622A] to-[#C04A18] hover:from-[#F47A3A] hover:to-[#D45A28] shadow-[0_0_20px_rgba(232,98,42,0.4)] hover:shadow-[0_0_30px_rgba(232,98,42,0.6)] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                </motion.div>
              </motion.div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                    <input id="firstName" type="text" placeholder="First Name" className={inputClass} {...formRegister("firstName")} />
                    {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                    <input id="lastName" type="text" placeholder="Last Name" className={inputClass} {...formRegister("lastName")} />
                    {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="signup-email" className={labelClass}>{sc.emailLabel}</label>
                  <input id="signup-email" type="email" placeholder={sc.emailPlaceholder} autoComplete="email" className={inputClass} {...formRegister("email")} />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="signup-phone" className={labelClass}>{sc.phoneLabel}</label>
                    <input id="signup-phone" type="tel" placeholder={sc.phonePlaceholder} autoComplete="tel" className={inputClass} {...formRegister("phone")} />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="gender" className={labelClass}>Gender</label>
                    <select id="gender" className={selectClass} {...formRegister("gender")} style={selectStyle}>
                      <option value="" disabled className="text-black">Select Gender</option>
                      <option value="Male" className="text-black">Male</option>
                      <option value="Female" className="text-black">Female</option>
                      <option value="Other" className="text-black">Other</option>
                    </select>
                    {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender.message}</p>}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="signup-state" className={labelClass}>{sc.stateLabel}</label>
                    <select id="signup-state" {...formRegister("state")} className={selectClass} style={selectStyle}>
                      <option value="" disabled className="text-black">{sc.stateDefault}</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state} className="text-black">{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="district" className={labelClass}>District</label>
                    <input id="district" type="text" placeholder="District" className={inputClass} {...formRegister("district")} />
                    {errors.district && <p className="text-red-400 text-xs mt-1">{errors.district.message}</p>}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="signup-password" className={labelClass}>{sc.passwordLabel}</label>
                    <input id="signup-password" type="password" placeholder={sc.passwordPlaceholder} autoComplete="new-password" className={inputClass} {...formRegister("password")} />
                    {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="signup-confirm" className={labelClass}>{sc.confirmLabel}</label>
                    <input id="signup-confirm" type="password" placeholder={sc.confirmPlaceholder} autoComplete="new-password" className={inputClass} {...formRegister("confirm")} />
                    {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#E8622A] to-[#C04A18] hover:from-[#F47A3A] hover:to-[#D45A28] shadow-[0_0_20px_rgba(232,98,42,0.4)] hover:shadow-[0_0_30px_rgba(232,98,42,0.6)] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing up..." : sc.submitBtn}
                  </button>
                </motion.div>
              </motion.div>
            </form>
          )}

          {/* Switch to login */}
          <motion.p
            className="mt-6 text-center text-xs sm:text-sm text-white/60 font-light relative z-20 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link to="/login" className="font-semibold text-[#FF9D72] hover:text-[#FFB594] transition-colors duration-200 cursor-pointer pointer-events-auto">
              {sc.haveAccount}
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

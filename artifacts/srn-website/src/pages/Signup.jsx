import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

// ── Indian states and Union Territories ──────────────────────────────────────

export const INDIAN_STATES = [
  // 28 States
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // 8 Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// ── Framer Motion variants ────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// ── Decorative left panel ─────────────────────────────────────────────────────

function DecorativePanel() {
  return (
    <div className="hidden md:flex w-5/12 flex-col items-center justify-center bg-[#1E0A04] relative overflow-hidden min-h-screen">
      {/* Radial orange glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(232,98,42,0.18) 0%, transparent 65%)",
        }}
      />

      {/* Floating logo */}
      <motion.img
        src="/logo.PNG"
        alt="Sashakt Rashtra Nirman Logo"
        className="w-40 h-40 object-contain drop-shadow-2xl relative z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />

      <h1 className="text-white font-bold text-2xl font-serif mt-6 text-center relative z-10 px-8">
        Sashakt Rashtra Nirman
      </h1>

      <div
        className="mt-3 w-12 h-0.5 rounded-full relative z-10"
        style={{ background: "linear-gradient(to right, #E8622A, #D4880C)" }}
      />

      <p className="text-[#F47A3A]/70 font-serif text-lg mt-3 text-center relative z-10 px-8">
        सशक्त राष्ट्र निर्माण
      </p>

      {/* Tagline */}
      <p className="text-[#E8D5B8]/50 text-xs mt-8 text-center relative z-10 px-10 leading-relaxed">
        Join millions building a stronger India — one citizen at a time.
      </p>
    </div>
  );
}

// ── Signup page ───────────────────────────────────────────────────────────────

export default function Signup() {
  const { t } = useLanguage();
  const sc = t.signup;
  const { register, API_BASE } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    gender: "",
    password: "",
    confirm: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        district: formData.district,
        gender: formData.gender,
        password: formData.password
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl bg-[#FEF0E6] border border-[#E8D5B8] " +
    "focus:outline-none focus:border-[#E8622A] focus:ring-2 focus:ring-[#E8622A]/20 " +
    "text-[#2C1810] placeholder-[#B89070] transition-colors duration-200 text-sm";

  const selectClass =
    inputClass +
    " cursor-pointer appearance-none";

  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23B89070' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    paddingRight: "2.25rem",
  };

  const labelClass = "block text-xs font-semibold text-[#5C3A1E] mb-1";

  return (
    <div className="min-h-screen flex">
      {/* Left — decorative panel */}
      <DecorativePanel />

      {/* Right — form panel */}
      <motion.div
        className="flex-1 flex flex-col bg-[#FDF5EC] min-h-screen overflow-y-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Top bar — back link */}
        <div className="px-8 pt-6 pb-2 shrink-0">
          <Link
            to="/"
            aria-label={sc.backToHome}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7A5C45] hover:text-[#E8622A] transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            {sc.backToHome}
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-8 py-4">
          <div className="w-full max-w-lg">
            {/* Page title */}
            <motion.h2
              className="text-2xl font-bold font-serif text-[#2C1810] mb-0.5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {sc.title}
            </motion.h2>
            <motion.p
              className="text-xs text-[#7A5C45] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              Join us in building a stronger nation.
            </motion.p>

            {/* ── Google Button (top) ── */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-6 rounded-xl font-semibold border border-[#E8D5B8] bg-white text-[#2C1810] text-sm hover:bg-[#FEF0E6] hover:border-[#E8622A]/40 active:bg-white flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mb-4"
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
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8D5B8]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FDF5EC] px-3 text-[#7A5C45] font-medium">Or sign up with email</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {/* Row 1: First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First Name"
                      className={inputClass}
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last Name"
                      className={inputClass}
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </motion.div>
                </div>

                {/* Row 2: Email */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="signup-email" className={labelClass}>
                    {sc.emailLabel}
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder={sc.emailPlaceholder}
                    autoComplete="email"
                    className={inputClass}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </motion.div>

                {/* Row 3: Phone & Gender */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="signup-phone" className={labelClass}>
                      {sc.phoneLabel}
                    </label>
                    <input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder={sc.phonePlaceholder}
                      autoComplete="tel"
                      className={inputClass}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="gender" className={labelClass}>Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      className={selectClass}
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      style={selectStyle}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </motion.div>
                </div>

                {/* Row 4: State & District */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="signup-state" className={labelClass}>
                      {sc.stateLabel}
                    </label>
                    <select
                      id="signup-state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={selectClass}
                      style={selectStyle}
                      required
                    >
                      <option value="" disabled>
                        {sc.stateDefault}
                      </option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="district" className={labelClass}>District</label>
                    <input
                      id="district"
                      name="district"
                      type="text"
                      placeholder="District"
                      className={inputClass}
                      value={formData.district}
                      onChange={handleChange}
                      required
                    />
                  </motion.div>
                </div>

                {/* Row 5: Password & Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="signup-password" className={labelClass}>
                      {sc.passwordLabel}
                    </label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder={sc.passwordPlaceholder}
                      autoComplete="new-password"
                      className={inputClass}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="signup-confirm" className={labelClass}>
                      {sc.confirmLabel}
                    </label>
                    <input
                      id="signup-confirm"
                      name="confirm"
                      type="password"
                      placeholder={sc.confirmPlaceholder}
                      autoComplete="new-password"
                      className={inputClass}
                      value={formData.confirm}
                      onChange={handleChange}
                      required
                    />
                  </motion.div>
                </div>

                {/* Submit */}
                <motion.div variants={itemVariants} className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-white text-sm
                               bg-gradient-to-r from-[#E8622A] to-[#C04A18]
                               shadow-md shadow-orange-900/25
                               hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/30
                               active:translate-y-0
                               transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing up..." : sc.submitBtn}
                  </button>
                </motion.div>
              </motion.div>
            </form>

            {/* Switch to login */}
            <motion.p
              className="mt-4 text-center text-xs text-[#7A5C45]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#E8622A] hover:text-[#C04A18] transition-colors duration-200"
              >
                {sc.haveAccount}
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { FileText, Send, CheckCircle, Upload, AlertCircle, Phone, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Complaints() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const en = lang === "en";
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const handleFormInteraction = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 5000);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en ? "Register Complaint – SRN" : "जन याचिका दर्ज करें – SRN";
  }, [en]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "",
    email: user?.email || "",
    phone: user?.phone || "",
    state: user?.state || "",
    category: "",
    subject: "",
    description: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // States of India for selection
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh"
  ];

  const categories = [
    { value: "educational", en: "Educational Grievances", hi: "शैक्षिक शिकायतें" },
    { value: "social", en: "Social Welfare & Rights", hi: "सामाजिक कल्याण एवं अधिकार" },
    { value: "corruption", en: "Eradication of Social Evils", hi: "सामाजिक बुराइयों का उन्मूलन" },
    { value: "women", en: "Women Oppression & Safety", hi: "महिला उत्पीड़न एवं सुरक्षा" },
    { value: "infradev", en: "Rural/Urban Infrastructure", hi: "ग्रामीण/शहरी बुनियादी ढांचा" },
    { value: "agriculture", en: "Farmers & Agriculture Issue", hi: "किसान एवं कृषि मुद्दे" },
    { value: "other", en: "Other Institutional Matters", hi: "अन्य संस्थागत मामले" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          file: en ? "File size must be less than 5MB" : "फ़ाइल का आकार 5MB से कम होना चाहिए"
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) {
      tempErrors.fullName = en ? "Full name is required" : "पूर्ण नाम आवश्यक है";
    }
    if (!formData.email.trim()) {
      tempErrors.email = en ? "Email address is required" : "ईमेल पता आवश्यक है";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = en ? "Please enter a valid email address" : "कृपया एक मान्य ईमेल दर्ज करें";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = en ? "Phone number is required" : "फ़ोन नंबर आवश्यक है";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      tempErrors.phone = en ? "Please enter a valid 10-digit mobile number" : "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें";
    }
    if (!formData.state) {
      tempErrors.state = en ? "Please select your State" : "कृपया अपना राज्य चुनें";
    }
    if (!formData.category) {
      tempErrors.category = en ? "Please select a category" : "कृपया श्रेणी का चयन करें";
    }
    if (!formData.subject.trim()) {
      tempErrors.subject = en ? "Subject is required" : "विषय आवश्यक है";
    }
    if (!formData.description.trim()) {
      tempErrors.description = en ? "Description is required" : "विवरण आवश्यक है";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'file' && formData[key]) {
          data.append('file', formData[key]);
        } else if (key !== 'file') {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(`${API_BASE}/api/complaints`, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setTicketNumber(result.data.ticket);
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        setErrors({ subject: result.message || 'Submission failed' });
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrors({ subject: 'An error occurred. Please try again later.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FDF5EC] min-h-screen relative">
      
      {/* Login Prompt Toast */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-6 z-50 bg-white border-l-4 border-[#E8622A] shadow-2xl rounded-lg p-5 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-[#E8622A] shrink-0" />
              <div>
                <h4 className="font-bold text-[#1E0F05] text-sm mb-1">
                  {en ? "Login Required" : "लॉगिन आवश्यक है"}
                </h4>
                <p className="text-xs text-[#7A5C45] mb-4">
                  {en ? "Please login or sign up first to submit a grievance." : "शिकायत दर्ज करने के लिए कृपया पहले लॉगिन या साइन अप करें।"}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate('/login?redirect=/complaints')}
                    className="px-4 py-2 bg-[#E8622A] text-white text-xs font-bold rounded-md hover:bg-[#D4880C] shadow-sm transition-colors"
                  >
                    {en ? "Login Now" : "अभी लॉगिन करें"}
                  </button>
                  <button 
                    onClick={() => setShowLoginPrompt(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-200 transition-colors"
                  >
                    {en ? "Dismiss" : "खारिज करें"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative bg-[#FFF5EB] pt-[110px] pb-8 text-center px-6 overflow-hidden">
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#F47A3A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
          >
            {en ? "Public Grievance Portal" : "जन शिकायत निवारण पोर्टल"}
          </motion.span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            {en ? "Register Your Complaint" : "जन शिकायत दर्ज करें"}
          </h1>
          <p className="text-[#7A5C45] text-base md:text-lg mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
            {en 
              ? "Submit your grievances, social problems or community concerns directly to the Sashakt Rashtra Nirman Trust administration."
              : "अपनी समस्याओं, सामाजिक चिंताओं या सामुदायिक मुद्दों को सीधे सशक्त राष्ट्र निर्माण न्यास के प्रशासन के समक्ष प्रस्तुत करें।"}
          </p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-6 mx-auto w-24 rounded-full origin-center shadow-sm"
          />
        </motion.div>
      </section>

      {/* ── Form & Content Section with Grid Stripes ───────────── */}
      <section className="relative pt-6 pb-16 px-4 md:px-8 z-10">
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%232C1810' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
        />

        <div className="max-w-4xl mx-auto relative z-10">
          <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="complaint-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-[#F0D5B8] p-6 md:p-10 relative overflow-hidden"
            >
              {/* Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E8622A] to-[#D4880C]" />

              <form 
                onSubmit={handleSubmit} 
                onClick={handleFormInteraction}
                onFocusCapture={handleFormInteraction}
                className="space-y-6"
              >
                
                {/* Section Title */}
                <h3 className="text-lg font-bold font-serif text-[#1E0F05] border-b border-[#FDF5EC] pb-3 mb-2 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#E8622A]" />
                  {en ? "Complaint Application Details" : "शिकायत आवेदन विवरण"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Applicant Full Name *" : "आवेदक का पूरा नाम *"}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={en ? "Enter full name" : "अपना पूरा नाम लिखें"}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.fullName 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Mobile Number *" : "मोबाइल नंबर *"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={en ? "10-digit mobile number" : "10 अंकों का मोबाइल नंबर"}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.phone 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Email Address *" : "ईमेल पता *"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@domain.com"
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.email 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "State *" : "राज्य *"}
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.state 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    >
                      <option value="">{en ? "-- Select State --" : "-- राज्य चुनें --"}</option>
                      {indianStates.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category & Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Grievance Category *" : "शिकायत की श्रेणी *"}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.category 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    >
                      <option value="">{en ? "-- Select Category --" : "-- श्रेणी चुनें --"}</option>
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {en ? c.en : c.hi}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Subject/Topic *" : "विषय / मुद्दा *"}
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder={en ? "Brief summary of issue" : "मुद्दे का संक्षिप्त विवरण"}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.subject 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    />
                    {errors.subject && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                    {en ? "Detailed Complaint Description *" : "शिकायत का विस्तृत विवरण *"}
                  </label>
                  <textarea
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={en ? "Describe the issue and desired solution in detail..." : "मुद्दे और वांछित समाधान का विस्तार से वर्णन करें..."}
                    className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                      errors.description 
                        ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                        : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.description}
                    </p>
                  )}
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                    {en ? "Attach Supporting Documents (Optional)" : "सहायक दस्तावेज संलग्न करें (वैकल्पिक)"}
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#F0D5B8] rounded-xl cursor-pointer bg-[#FDF5EC]/20 hover:bg-[#FDF5EC]/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-[#E8622A] mb-2" />
                        <p className="text-xs md:text-sm text-gray-500">
                          <span className="font-semibold">{en ? "Click to upload" : "अपलोड करने के लिए क्लिक करें"}</span>
                          {en ? " or drag and drop" : " या ड्रैग एंड ड्रॉप करें"}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          PDF, JPG, PNG {en ? "(Max 5MB)" : "(अधिकतम 5MB)"}
                        </p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    </label>
                  </div>
                  {formData.file && (
                    <p className="text-xs text-[#E8622A] mt-2 font-medium flex items-center gap-1">
                      <FileText className="w-4 h-4" /> {formData.file.name} ({(formData.file.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                  {errors.file && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.file}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-[#E8622A] to-[#D4880C] hover:from-[#D4880C] hover:to-[#E8622A] text-white font-bold rounded-xl shadow-lg hover:shadow-orange-950/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{en ? "Submitting Request..." : "याचिका सबमिट की जा रही है..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{en ? "Submit Complaint" : "याचिका दर्ज करें"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="complaint-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-[#F0D5B8] p-10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-green-500" />
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#1E0F05] mb-2">
                {en ? "Complaint Registered Successfully!" : "याचिका सफलतापूर्वक दर्ज की गई!"}
              </h2>
              <p className="text-[#7A5C45] text-sm md:text-base max-w-md mx-auto mb-8">
                {en 
                  ? "Thank you for bringing this concern to our attention. Our team will review the details and get back to you shortly." 
                  : "हमारी संस्था के प्रति आपका विश्वास सराहनीय है। हमारी टीम जल्द ही याचिका की समीक्षा करेगी और आपसे संपर्क करेगी।"}
              </p>

              {/* Ticket details */}
              <div className="bg-[#FDF5EC] border border-[#F0D5B8] rounded-xl p-5 max-w-xs mx-auto mb-8">
                <span className="block text-xs uppercase tracking-wider text-[#7A5C45] font-semibold mb-1">
                  {en ? "Your Tracking Number" : "आपकी ट्रैकिंग संख्या"}
                </span>
                <span className="text-lg font-mono font-bold text-[#E8622A]">{ticketNumber}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 border border-[#E8622A] text-[#E8622A] hover:bg-[#E8622A]/10 font-semibold rounded-xl transition-all"
                >
                  {en ? "Submit Another Complaint" : "एक और याचिका दर्ज करें"}
                </button>
                <a
                  href="/"
                  className="px-6 py-3 bg-[#E8622A] text-white hover:bg-[#D4880C] font-semibold rounded-xl shadow transition-all"
                >
                  {en ? "Go Back Home" : "मुख्य पृष्ठ पर जाएं"}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        </div>
      </section>
    </div>
  );
}

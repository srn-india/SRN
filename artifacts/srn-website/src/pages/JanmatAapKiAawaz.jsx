import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, Send, CheckCircle, Upload, AlertCircle, FileText, User, Mail, Tag, X } from "lucide-react";

export default function JanmatAapKiAawaz() {
  const { lang } = useLanguage();
  const { user, API_BASE } = useAuth();
  const navigate = useNavigate();
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en ? "Janmat Aap Ki Aawaz – SRN" : "जनमत आपकी आवाज़ – SRN";
  }, [en]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        authorName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : prev.authorName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Form State
  const [formData, setFormData] = useState({
    authorName: "",
    email: "",
    phone: "",
    articleCategory: "",
    title: "",
    summary: "",
    content: "",
    coverImage: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const categories = [
    { value: "articles", en: "Articles & Opinions", hi: "लेख एवं विचार" },
    { value: "social", en: "Social Work Reports", hi: "सामाजिक कार्य विवरण" },
    { value: "issues", en: "Current Affairs & Policies", hi: "सामयिक मुद्दे एवं नीतियां" }
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
          coverImage: en ? "File size must be less than 5MB" : "फ़ाइल का आकार 5MB से कम होना चाहिए"
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setErrors((prev) => ({ ...prev, coverImage: "" }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.authorName.trim()) {
      tempErrors.authorName = en ? "Author name is required" : "लेखक का नाम आवश्यक है";
    }
    if (!formData.email.trim()) {
      tempErrors.email = en ? "Email address is required" : "ईमेल पता आवश्यक है";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      tempErrors.email = en ? "Please enter a valid email address" : "कृपया एक मान्य ईमेल दर्ज करें";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = en ? "Phone number is required" : "फ़ोन नंबर आवश्यक है";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      tempErrors.phone = en ? "Please enter a valid 10-digit mobile number" : "कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें";
    }
    if (!formData.articleCategory) {
      tempErrors.articleCategory = en ? "Please select a category" : "कृपया एक श्रेणी चुनें";
    }
    if (!formData.title.trim()) {
      tempErrors.title = en ? "Article title is required" : "लेख का शीर्षक आवश्यक है";
    }
    if (!formData.summary.trim()) {
      tempErrors.summary = en ? "Summary is required" : "लेख का सारांश आवश्यक है";
    }
    if (!formData.content.trim()) {
      tempErrors.content = en ? "Article content is required" : "लेख की सामग्री आवश्यक है";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'coverImage' && formData[key]) {
          data.append('file', formData[key]);
        } else if (key !== 'coverImage') {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(`${API_BASE}/api/articles`, {
        method: "POST",
        credentials: "include",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        setErrors({ authorName: result.message || 'Submission failed' });
        setIsSubmitting(false);
      }
    } catch (error) {
      setErrors({ authorName: 'An error occurred. Please try again later.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FDF5EC] min-h-screen">
      
      {/* ── Hero Section with Monochromatic Pattern Background ───────── */}
      <section className="relative bg-[#FFF5EB] pt-[110px] pb-8 text-center px-6 overflow-hidden">
        
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.32]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />
        
        {/* Glow accents */}
        
        

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
            {en ? "Public Journalism Portal" : "सार्वजनिक पत्रकारिता पोर्टल"}
          </motion.span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            {en ? "Janmat: Aap Ki Aawaz" : "जनमत: आपकी आवाज़"}
          </h1>
          <p className="text-[#7A5C45] text-base md:text-lg mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
            {en 
              ? "Share your articles, essays, reports, or opinions on national issues. Once reviewed by our editorial team, your submission will be featured on the Jan Samwad portal."
              : "राष्ट्रीय मुद्दों पर अपने लेख, निबंध, रिपोर्ट या विचार साझा करें। हमारी संपादकीय टीम द्वारा समीक्षा किए जाने के बाद, आपका लेख जन संवाद पोर्टल पर प्रदर्शित किया जाएगा।"}
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
              key="article-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-[#F0D5B8] p-6 md:p-10 relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E8622A] to-[#D4880C]" />

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section Title */}
                <h3 className="text-lg font-bold font-serif text-[#1E0F05] border-b border-[#FDF5EC] pb-3 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#E8622A]" />
                  {en ? "Article Submission Form" : "लेख प्रविष्टि फ़ॉर्म"}
                </h3>

                {/* Author Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Author Name */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Author Full Name *" : "लेखक का पूरा नाम *"}
                    </label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.authorName}
                      onChange={handleInputChange}
                      placeholder={en ? "Enter author name" : "लेखक का नाम लिखें"}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.authorName 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    />
                    {errors.authorName && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.authorName}
                      </p>
                    )}
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Article Category *" : "लेख की श्रेणी *"}
                    </label>
                    <select
                      name="articleCategory"
                      value={formData.articleCategory}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.articleCategory 
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
                    {errors.articleCategory && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.articleCategory}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
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
                      placeholder="author@domain.com"
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
                      placeholder="10-digit mobile number"
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
                </div>

                {/* Article Header */}
                <div className="space-y-6 pt-2 border-t border-[#FDF5EC]">
                  
                  {/* Article Title */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Article Title *" : "लेख का शीर्षक *"}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder={en ? "Enter title of the article" : "लेख का शीर्षक दर्ज करें"}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.title 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Summary/Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Brief Summary/Excerpt *" : "संक्षिप्त सारांश/भूमिका *"}
                    </label>
                    <input
                      type="text"
                      name="summary"
                      value={formData.summary}
                      onChange={handleInputChange}
                      placeholder={en ? "A short outline of the article (1-2 sentences)" : "लेख की संक्षिप्त रूपरेखा (१-२ वाक्य)"}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.summary 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    />
                    {errors.summary && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.summary}
                      </p>
                    )}
                  </div>

                  {/* Main Content */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                      {en ? "Full Article Content *" : "लेख की पूरी सामग्री *"}
                    </label>
                    <textarea
                      name="content"
                      rows="8"
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder={en ? "Write or paste your article content here..." : "अपने लेख की सामग्री यहाँ लिखें या पेस्ट करें..."}
                      className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                        errors.content 
                          ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
                          : "border-[#F0D5B8] focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                      }`}
                    />
                    {errors.content && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.content}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                    {en ? "Attach Cover Image or PDF (Optional)" : "कवर छवि या पीडीएफ संलग्न करें (वैकल्पिक)"}
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
                          JPG, PNG, PDF {en ? "(Max 5MB)" : "(अधिकतम 5MB)"}
                        </p>
                      </div>
                      <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />
                    </label>
                  </div>
                  {formData.coverImage && (
                    <p className="text-xs text-[#E8622A] mt-2 font-medium flex items-center gap-1">
                      <FileText className="w-4 h-4" /> {formData.coverImage.name} ({(formData.coverImage.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                  {errors.coverImage && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.coverImage}
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
                        <span>{en ? "Submitting Article..." : "लेख सबमिट किया जा रहा है..."}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>{en ? "Submit Article" : "लेख सबमिट करें"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="article-success"
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
                {en ? "Article Submitted Successfully!" : "लेख सफलतापूर्वक प्राप्त हुआ!"}
              </h2>
              <p className="text-[#7A5C45] text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
                {en 
                  ? "Thank you for sharing your thoughts. Our editorial committee will review your submission, and once approved, it will be published in the Jan Samwad section." 
                  : "विचार साझा करने के लिए आपका धन्यवाद। हमारी संपादकीय समिति आपके लेख की समीक्षा करेगी, और स्वीकृति के बाद इसे जन संवाद अनुभाग में प्रकाशित किया जाएगा।"}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 border border-[#E8622A] text-[#E8622A] hover:bg-[#E8622A]/10 font-semibold rounded-xl transition-all"
                >
                  {en ? "Submit Another Article" : "एक और लेख सबमिट करें"}
                </button>
                <a
                  href="/jan-samwad"
                  className="px-6 py-3 bg-[#E8622A] text-white hover:bg-[#D4880C] font-semibold rounded-xl shadow transition-all"
                >
                  {en ? "Go to Jan Samwad" : "जन संवाद पर जाएं"}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        </div>
      </section>

      {/* LOGIN PROMPT MODAL */}
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
                  {en 
                    ? "You need to be logged in to submit an article. Please log in or create an account to proceed."
                    : "लेख सबमिट करने के लिए आपको लॉग इन होना चाहिए। कृपया आगे बढ़ने के लिए लॉग इन करें या एक खाता बनाएं।"}
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate('/login')}
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
    </div>
  );
}

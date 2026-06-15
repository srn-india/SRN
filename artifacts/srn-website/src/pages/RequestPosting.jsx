import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { FileText, Send, CheckCircle, Upload, ArrowLeft, ArrowRight, User, GraduationCap, Heart } from "lucide-react";

export default function RequestPosting() {
  const { lang } = useLanguage();
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en ? "Pad ke liye Awedan Kare – SRN" : "पद के लिए आवेदन करें – SRN";
  }, [en]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    qualification: "",
    appliedPosition: "",
    currentOccupation: "",
    socialContribution: "",
    whyJoin: "",
    resume: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          resume: en ? "File size must be less than 5MB" : "फ़ाइल का आकार 5MB से कम होना चाहिए"
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, resume: file }));
      setErrors((prev) => ({ ...prev, resume: "" }));
    }
  };

  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.fullName.trim()) stepErrors.fullName = en ? "Full name is required" : "पूर्ण नाम आवश्यक है";
      if (!formData.dob) stepErrors.dob = en ? "Date of birth is required" : "जन्म तिथि आवश्यक है";
      if (!formData.gender) stepErrors.gender = en ? "Gender is required" : "लिंग आवश्यक है";
      if (!formData.email.trim()) {
        stepErrors.email = en ? "Email is required" : "ईमेल आवश्यक है";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = en ? "Enter a valid email" : "मान्य ईमेल दर्ज करें";
      }
      if (!formData.phone.trim()) {
        stepErrors.phone = en ? "Phone is required" : "फ़ोन नंबर आवश्यक है";
      } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
        stepErrors.phone = en ? "Enter a valid 10-digit number" : "10 अंकों का मान्य नंबर दर्ज करें";
      }
    } else if (step === 2) {
      if (!formData.qualification.trim()) stepErrors.qualification = en ? "Qualification is required" : "योग्यता आवश्यक है";
      if (!formData.appliedPosition.trim()) stepErrors.appliedPosition = en ? "Target position is required" : "लक्षित पद आवश्यक है";
      if (!formData.address.trim()) stepErrors.address = en ? "Address is required" : "पता आवश्यक है";
    } else if (step === 3) {
      if (!formData.socialContribution.trim()) stepErrors.socialContribution = en ? "Social contribution description is required" : "सामाजिक योगदान का विवरण आवश्यक है";
      if (!formData.whyJoin.trim()) stepErrors.whyJoin = en ? "Motivation description is required" : "प्रेरणा का विवरण आवश्यक है";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1800);
  };

  // Step names & icons
  const steps = [
    { number: 1, labelEn: "Personal", labelHi: "व्यक्तिगत", icon: User },
    { number: 2, labelEn: "Academic", labelHi: "अकादमिक", icon: GraduationCap },
    { number: 3, labelEn: "Social Work", labelHi: "सामाजिक कार्य", icon: Heart },
  ];

  return (
    <div className="bg-[#FDF5EC] min-h-screen pb-20">
      
      {/* ── Hero Section with Monochromatic Pattern Background ───────── */}
      <section className="relative bg-gradient-to-br from-[#FFF9F2] via-[#FDF5EC] to-[#FFF5EB] py-36 text-center px-6 overflow-hidden min-h-[44vh] flex items-center justify-center border-b border-[#F0D5B8]/40">
        
        {/* Monochromatic styled background pattern */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-multiply opacity-35"
          style={{ backgroundImage: "url('/jan_samwad_monochrome_bg.png')" }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 28px)` }}
        />
        
        {/* Glow accents */}
        <div className="absolute top-8 left-12 w-48 h-48 rounded-full bg-[#E8622A]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-8 right-12 w-40 h-40 rounded-full bg-[#D4880C]/10 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#F47A3A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
          >
            {en ? "Join the Executive Committee" : "कार्यकारिणी में शामिल हों"}
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            {en ? "Pad ke liye Awedan Kare" : "पद के लिए आवेदन करें"}
          </h1>
          <p className="text-[#7A5C45] text-base md:text-lg mt-4 max-w-2xl mx-auto font-medium leading-relaxed">
            {en 
              ? "Submit your application request for volunteer executive positions or state/district roles in Sashakt Rashtra Nirman Trust."
              : "सशक्त राष्ट्र निर्माण न्यास में स्वयंसेवक कार्यकारी पदों या राज्य/जिला भूमिकाओं के लिए अपना आवेदन अनुरोध सबमिट करें।"}
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
      <section className="relative py-16 px-4 md:px-8 z-10">
        
        {/* Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%232C1810' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
        />

        <div className="max-w-3xl mx-auto relative z-10">
          
          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#F0D5B8] overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E8622A] to-[#D4880C]" />
          
            {/* Steps Progress Indicator */}
            {!isSubmitted && (
              <div className="bg-[#FDF5EC]/50 border-b border-[#F0D5B8] px-6 py-6 md:px-10 flex justify-between items-center relative">
                {steps.map((s, idx) => {
                  const StepIcon = s.icon;
                  const isCompleted = currentStep > s.number;
                  const isActive = currentStep === s.number;
                  return (
                    <div key={s.number} className="flex flex-col items-center flex-1 relative z-10">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                          isCompleted 
                            ? "bg-green-500 border-green-500 text-white" 
                            : isActive 
                              ? "bg-[#E8622A] border-[#E8622A] text-white shadow-md scale-110" 
                              : "bg-white border-[#F0D5B8] text-[#7A5C45]"
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                      </div>
                      <span className={`text-[10px] md:text-xs font-semibold mt-2 transition-colors ${
                        isActive ? "text-[#E8622A]" : "text-[#7A5C45]"
                      }`}>
                        {en ? s.labelEn : s.labelHi}
                      </span>

                      {/* Connector line */}
                      {idx < steps.length - 1 && (
                        <div className="absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-[#F0D5B8] -z-10" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="p-6 md:p-10">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* STEP 1: Personal Details */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-lg font-bold font-serif text-[#1E0F05] flex items-center gap-2 mb-4">
                          <User className="w-5 h-5 text-[#E8622A]" />
                          {en ? "Personal Particulars" : "व्यक्तिगत विवरण"}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Name */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Full Name *" : "पूरा नाम *"}</label>
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder={en ? "John Doe" : "अपना नाम लिखें"}
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.fullName ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                          </div>

                          {/* DOB */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Date of Birth *" : "जन्म तिथि *"}</label>
                            <input
                              type="date"
                              name="dob"
                              value={formData.dob}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.dob ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                          </div>

                          {/* Gender */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Gender *" : "लिंग *"}</label>
                            <select
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.gender ? "border-red-500" : "border-[#F0D5B8]"}`}
                            >
                              <option value="">{en ? "-- Select --" : "-- चुनें --"}</option>
                              <option value="male">{en ? "Male" : "पुरुष"}</option>
                              <option value="female">{en ? "Female" : "महिला"}</option>
                              <option value="other">{en ? "Other" : "अन्य"}</option>
                            </select>
                            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                          </div>

                          {/* Phone */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Phone Number *" : "फ़ोन नंबर *"}</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="10-digit number"
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.phone ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                          </div>

                          {/* Email */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Email Address *" : "ईमेल पता *"}</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="name@domain.com"
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.email ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Academic & Professional Details */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-lg font-bold font-serif text-[#1E0F05] flex items-center gap-2 mb-4">
                          <GraduationCap className="w-5 h-5 text-[#E8622A]" />
                          {en ? "Academic & Professional Background" : "शैक्षणिक एवं व्यावसायिक पृष्ठभूमि"}
                        </h3>

                        <div className="space-y-6">
                          {/* Qualification */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Highest Academic Qualification *" : "उच्चतम शैक्षणिक योग्यता *"}</label>
                            <input
                              type="text"
                              name="qualification"
                              value={formData.qualification}
                              onChange={handleInputChange}
                              placeholder={en ? "e.g. Master of Arts, B.Tech" : "जैसे: स्नातक, परास्नातक"}
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.qualification ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.qualification && <p className="text-xs text-red-500 mt-1">{errors.qualification}</p>}
                          </div>

                          {/* Applied Position */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Position / Post Applied For *" : "आवेदन के लिए लक्षित पद *"}</label>
                            <input
                              type="text"
                              name="appliedPosition"
                              value={formData.appliedPosition}
                              onChange={handleInputChange}
                              placeholder={en ? "e.g. District Coordinator, Youth Leader" : "जैसे: जिला समन्वयक, युवा मोर्चा अध्यक्ष"}
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.appliedPosition ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.appliedPosition && <p className="text-xs text-red-500 mt-1">{errors.appliedPosition}</p>}
                          </div>

                          {/* Current Designation */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Current Occupation / Profession" : "वर्तमान व्यवसाय / पेशा"}</label>
                            <input
                              type="text"
                              name="currentOccupation"
                              value={formData.currentOccupation}
                              onChange={handleInputChange}
                              placeholder={en ? "e.g. Student, Social Worker, Teacher" : "जैसे: छात्र, सामाजिक कार्यकर्ता, शिक्षक"}
                              className="w-full px-4 py-3 bg-[#FDF5EC]/30 border border-[#F0D5B8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A]"
                            />
                          </div>

                          {/* Address */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">{en ? "Permanent Address *" : "स्थायी पता *"}</label>
                            <textarea
                              name="address"
                              rows="3"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder={en ? "Enter full address" : "अपना पूरा पता लिखें"}
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.address ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Social & Motivation Details */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-lg font-bold font-serif text-[#1E0F05] flex items-center gap-2 mb-4">
                          <Heart className="w-5 h-5 text-[#E8622A]" />
                          {en ? "Social Contribution & Motivation" : "सामाजिक योगदान एवं प्रेरणा"}
                        </h3>

                        <div className="space-y-6">
                          {/* Contributions */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                              {en ? "Your Contributions to Society *" : "समाज के प्रति आपका योगदान *"}
                            </label>
                            <textarea
                              name="socialContribution"
                              rows="4"
                              value={formData.socialContribution}
                              onChange={handleInputChange}
                              placeholder={en ? "Detail your past social service work, events organized, or community contributions..." : "अपने पिछले सामाजिक सेवा कार्यों, आयोजित कार्यक्रमों, या सामुदायिक योगदान का विवरण दें..."}
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.socialContribution ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.socialContribution && <p className="text-xs text-red-500 mt-1">{errors.socialContribution}</p>}
                          </div>

                          {/* Why Join */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                              {en ? "Why do you want to join Sashakt Rashtra Nirman Trust? *" : "आप सशक्त राष्ट्र निर्माण न्यास में क्यों शामिल होना चाहते हैं? *"}
                            </label>
                            <textarea
                              name="whyJoin"
                              rows="4"
                              value={formData.whyJoin}
                              onChange={handleInputChange}
                              placeholder={en ? "State your motivation and how you can add value to the organization..." : "अपनी प्रेरणा और आप संगठन में क्या मूल्य जोड़ सकते हैं, इसका विवरण दें..."}
                              className={`w-full px-4 py-3 bg-[#FDF5EC]/30 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8622A]/20 focus:border-[#E8622A] ${errors.whyJoin ? "border-red-500" : "border-[#F0D5B8]"}`}
                            />
                            {errors.whyJoin && <p className="text-xs text-red-500 mt-1">{errors.whyJoin}</p>}
                          </div>

                          {/* Resume / ID */}
                          <div>
                            <label className="block text-sm font-semibold text-[#1E0F05] mb-2">
                              {en ? "Upload Brief Resume/CV or ID Proof (Optional)" : "संक्षिप्त बायोडाटा/सीवी या आईडी प्रूफ अपलोड करें (वैकल्पिक)"}
                            </label>
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#F0D5B8] rounded-xl cursor-pointer bg-[#FDF5EC]/20 hover:bg-[#FDF5EC]/50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 text-[#E8622A] mb-2" />
                                  <p className="text-xs text-gray-500">
                                    <span className="font-semibold">{en ? "Click to upload" : "अपलोड करने के लिए क्लिक करें"}</span>
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    PDF, DOCX, JPG {en ? "(Max 5MB)" : "(अधिकतम 5MB)"}
                                  </p>
                                </div>
                                <input type="file" className="hidden" accept=".pdf,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} />
                              </label>
                            </div>
                            {formData.resume && (
                              <p className="text-xs text-[#E8622A] mt-2 font-medium flex items-center gap-1">
                                <FileText className="w-4 h-4" /> {formData.resume.name}
                              </p>
                            )}
                            {errors.resume && <p className="text-xs text-red-500 mt-1">{errors.resume}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-8 border-t border-[#FDF5EC] mt-8">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrev}
                          className="px-6 py-3 border border-[#E8622A] text-[#E8622A] hover:bg-[#E8622A]/10 font-bold rounded-xl transition-all flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>{en ? "Previous" : "पिछला"}</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="px-6 py-3 bg-[#E8622A] hover:bg-[#D4880C] text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
                        >
                          <span>{en ? "Next Step" : "अगला कदम"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-3 bg-gradient-to-r from-[#E8622A] to-[#D4880C] hover:from-[#D4880C] hover:to-[#E8622A] text-white font-bold rounded-xl shadow-lg hover:shadow-orange-950/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>{en ? "Submitting..." : "सबमिट किया जा रहा है..."}</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              <span>{en ? "Submit Application" : "आवेदन सबमिट करें"}</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                  </form>
                ) : (
                  <motion.div
                    key="request-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#1E0F05] mb-2">
                      {en ? "Application Submitted Successfully!" : "आवेदन सफलतापूर्वक सबमिट किया गया!"}
                    </h2>
                    <p className="text-[#7A5C45] text-sm md:text-base max-w-md mx-auto mb-8">
                      {en 
                        ? "Thank you for expressing your interest to hold a position in Sashakt Rashtra Nirman Trust. We will verify your contributions and credentials before getting back to you." 
                        : "सशक्त राष्ट्र निर्माण न्यास में पद धारण करने की इच्छा के लिए धन्यवाद। हम आपके क्रेडेंशियल और सामाजिक कार्यों की पुष्टि करने के बाद आपसे संपर्क करेंगे।"}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => { setCurrentStep(1); setIsSubmitted(false); }}
                        className="px-6 py-3 border border-[#E8622A] text-[#E8622A] hover:bg-[#E8622A]/10 font-semibold rounded-xl transition-all"
                      >
                        {en ? "Submit Another Request" : "एक और आवेदन सबमिट करें"}
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
          </div>
        </div>
      </section>
    </div>
  );
}

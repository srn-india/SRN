import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, CreditCard, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const steps = [
  { id: 1, title: "Personal Details", titleHi: "व्यक्तिगत विवरण", icon: User },
  { id: 2, title: "Address & Role", titleHi: "पता और भूमिका", icon: MapPin },
  { id: 3, title: "Confirmation", titleHi: "पुष्टिकरण", icon: CreditCard },
];

export default function BecomeMember() {
  const { lang } = useLanguage();
  const en = lang === "en";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", dob: "",
    state: "", city: "", profession: "", interest: "volunteer",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDF5EC] py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#E8622A]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#5C1010] mb-4">
            {en ? "Join Our Mission" : "हमारे मिशन से जुड़ें"}
          </h1>
          <p className="text-[#7A5C45] text-lg max-w-xl mx-auto">
            {en 
              ? "Become a member of Sashakt Rashtra Nirman and play a vital role in building a self-reliant nation." 
              : "सशक्त राष्ट्र निर्माण के सदस्य बनें और आत्मनिर्भर राष्ट्र के निर्माण में महत्वपूर्ण भूमिका निभाएं।"}
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center shadow-xl border border-[#E8622A]/20"
          >
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold font-serif text-[#5C1010] mb-4">
              {en ? "Welcome to the Family!" : "परिवार में आपका स्वागत है!"}
            </h2>
            <p className="text-[#7A5C45] text-lg mb-8">
              {en 
                ? "Your membership registration is complete. Check your email for further details." 
                : "आपका सदस्यता पंजीकरण पूरा हो गया है। अधिक जानकारी के लिए अपना ईमेल जांचें।"}
            </p>
            <button
              onClick={() => window.location.href = "/"}
              className="px-8 py-3 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-xl font-bold shadow-md transition-colors"
            >
              {en ? "Return Home" : "होम पर लौटें"}
            </button>
          </motion.div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Stepper Header */}
            <div className="bg-gray-50/80 border-b border-gray-100 p-6 md:p-8">
              <div className="flex justify-between items-center relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#E8622A] rounded-full z-0 transition-all duration-500 ease-in-out" 
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = step.id <= currentStep;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-colors duration-300 ${
                        isActive ? "bg-[#E8622A] text-white shadow-md shadow-orange-900/20" : "bg-gray-200 text-gray-400"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`mt-2 text-xs font-semibold hidden md:block ${isActive ? "text-[#E8622A]" : "text-gray-400"}`}>
                        {en ? step.title : step.titleHi}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* STEP 1: Personal Details */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <h2 className="text-2xl font-bold text-[#1E0F05] mb-6 font-serif">
                        {en ? "Personal Details" : "व्यक्तिगत विवरण"}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "First Name" : "पहला नाम"} *</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Last Name" : "अंतिम नाम"} *</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Email Address" : "ईमेल"} *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Phone Number" : "फ़ोन नंबर"} *</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Address & Role */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <h2 className="text-2xl font-bold text-[#1E0F05] mb-6 font-serif">
                        {en ? "Address & Role" : "पता और भूमिका"}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "State" : "राज्य"} *</label>
                          <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "City" : "शहर"} *</label>
                          <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Profession" : "पेशा"}</label>
                          <input type="text" name="profession" value={formData.profession} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Area of Interest" : "रुचि का क्षेत्र"}</label>
                          <select name="interest" value={formData.interest} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none">
                            <option value="volunteer">{en ? "Active Volunteer" : "सक्रिय स्वयंसेवक"}</option>
                            <option value="leadership">{en ? "Leadership & Strategy" : "नेतृत्व और रणनीति"}</option>
                            <option value="donor">{en ? "Donor / Supporter" : "दानकर्ता / समर्थक"}</option>
                            <option value="advisor">{en ? "Subject Matter Expert" : "विषय विशेषज्ञ"}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Confirmation */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <h2 className="text-2xl font-bold text-[#1E0F05] mb-6 font-serif">
                        {en ? "Membership Confirmation" : "सदस्यता पुष्टिकरण"}
                      </h2>
                      <div className="bg-[#FFF9F2] p-6 rounded-xl border border-[#E8622A]/20 mb-6">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E8622A]/10">
                          <span className="text-[#7A5C45]">{en ? "Membership Type" : "सदस्यता प्रकार"}</span>
                          <span className="font-bold text-[#5C1010]">{en ? "Lifetime Member" : "आजीवन सदस्य"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#7A5C45]">{en ? "Registration Fee" : "पंजीकरण शुल्क"}</span>
                          <span className="text-xl font-bold text-[#E8622A]">₹100</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="terms" className="mt-1" required />
                        <label htmlFor="terms" className="text-sm text-[#7A5C45]">
                          {en 
                            ? "I pledge my commitment to the ideals of Sashakt Rashtra Nirman and agree to the terms and conditions of membership." 
                            : "मैं सशक्त राष्ट्र निर्माण के आदर्शों के प्रति अपनी प्रतिबद्धता की प्रतिज्ञा करता हूं और सदस्यता के नियमों और शर्तों से सहमत हूं।"}
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Form Controls */}
              <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrev}
                    className="px-6 py-2.5 rounded-xl text-[#7A5C45] font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "पीछे"}
                  </button>
                ) : <div />}

                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {en ? "Next Step" : "अगला कदम"} <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-[#1A5A35] to-[#0D3B20] hover:from-[#114024] hover:to-[#092B16] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    {en ? "Pay & Register" : "भुगतान करें और रजिस्टर करें"} <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

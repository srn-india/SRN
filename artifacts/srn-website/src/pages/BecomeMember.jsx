import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Mail, Phone, Lock, QrCode, CreditCard, Upload, X, Clock, IndianRupee } from "lucide-react";
import QRCode from "react-qr-code";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import ProfileCompletionModal from "../components/ProfileCompletionModal";
import { loadRazorpayScript } from "../utils/razorpay";

const UPI_ID = "sashaktrashtranirman@cbin";
const QR_IMAGE = "/srn-upi-qr.png";
const MEMBER_AMOUNT_QR = 101;

const steps = [
  { id: 1, title: "Personal Details", titleHi: "व्यक्तिगत विवरण", icon: User },
  { id: 2, title: "Address & Role", titleHi: "पता और भूमिका", icon: MapPin },
  { id: 3, title: "Confirmation", titleHi: "पुष्टिकरण", icon: ShieldCheck },
];

export default function BecomeMember() {
  const { lang } = useLanguage();
  const { user, API_BASE, checkAuth } = useAuth();
  const en = lang === "en";
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // QR / UPI state
  const [paymentTab, setPaymentTab] = useState("upi");
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [qrSubmitting, setQrSubmitting] = useState(false);
  const [qrSubmitted, setQrSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "", 
    lastName: user?.lastName || "", 
    email: user?.email || "", 
    phone: user?.phone || "", 
    dob: "",
    state: user?.state || "", 
    city: user?.district || "", 
    profession: "", 
    interest: "volunteer",
  });

  useEffect(() => {
    if (user?.isMember) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.firstName || "",
        lastName: prev.lastName || user.lastName || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        state: prev.state || user.state || "",
        city: prev.city || user.district || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const handleNext = () => {
    let newErrors = {};
    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = true;
      if (!formData.lastName) newErrors.lastName = true;
      if (!formData.email) newErrors.email = true;
      if (!formData.phone) newErrors.phone = true;
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.state) newErrors.state = true;
      if (!formData.city) newErrors.city = true;
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.profilePicture) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      // 1. Update user profile
      const headers = { 
        "Content-Type": "application/json"
      };

      await fetch(`${API_BASE}/api/users/profile`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          state: formData.state,
          district: formData.city
        })
      });

      // Refresh user state
      await checkAuth();

      // 2. Create Order for 999 INR
      const orderRes = await fetch(`${API_BASE}/api/payments/order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include",
        body: JSON.stringify({ amount: 999, currency: "INR", type: "MEMBERSHIP" })
      });
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

      // 3. Get Razorpay Key
      const keyRes = await fetch(`${API_BASE}/api/payments/key`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include"
      });
      const keyData = await keyRes.json();
      
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }
      
      const options = {
        key: keyData.data.keyId,
        amount: orderData.data.amount,
        currency: orderData.data.currency || "INR",
        name: "Sashakt Rashtra Nirman",
        description: "Membership Registration",
        order_id: orderData.data.razorpayOrderId,
        handler: async function (response) {
          setIsProcessingPayment(true);
          try {
            // 4. Verify Payment
            const verifyRes = await fetch(`${API_BASE}/api/payments/verify`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
              },
              credentials: "include",
              body: JSON.stringify({ 
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature 
              })
            });
            
            if (!verifyRes.ok) throw new Error("Payment verification failed");
            
            // Complete
            setSubmitted(true);
            setIsProcessingPayment(false);
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: "#E8622A"
        }
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      // Stop loading spinner (modal is open)
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong during payment/registration.");
      setLoading(false);
    }
  };

  const handleQRMemberSubmit = async () => {
    if (!user || (!user.profilePicture && !user.avatar)) { setIsModalOpen(true); return; }
    if (!utrNumber.trim()) { alert("Please enter your UTR / Transaction ID."); return; }
    if (!screenshotFile) { alert("Please upload your payment screenshot."); return; }
    setQrSubmitting(true);
    try {
      let screenshotUrl = "";
      if (screenshotFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", screenshotFile);
        const uploadRes = await fetch(`${API_BASE}/api/manual-payments/upload-screenshot`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          credentials: "include",
          body: uploadForm,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          screenshotUrl = uploadData.data?.url || "";
        }
      }
      const res = await fetch(`${API_BASE}/api/manual-payments/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        credentials: "include",
        body: JSON.stringify({ amount: MEMBER_AMOUNT_QR, type: "MEMBERSHIP", utrNumber: utrNumber.trim(), screenshot: screenshotUrl }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setQrSubmitted(true);
    } catch (err) {
      alert("Submission failed: " + err.message);
    } finally {
      setQrSubmitting(false);
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const getInputClass = (fieldName) => `w-full px-5 py-4 rounded-xl bg-white/60 text-[#2C1810] placeholder-[#B89070] focus:outline-none focus:ring-2 shadow-sm backdrop-blur-sm transition-all ${
    errors[fieldName] 
      ? "border-2 border-red-500 focus:ring-red-500/50" 
      : "border border-[#E8D5B8]/80 focus:ring-[#E8622A]/50 focus:border-[#E8622A]"
  }`;
  const labelClass = "block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-2 ml-1";


  return (
    <div className="min-h-screen bg-[#FDF5EC] py-24 px-6 relative overflow-hidden font-sans selection:bg-[#E8622A] selection:text-white">
      {/* Animated Background Decorators */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8622A]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D4880C]/10 rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" 
      />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%232C1810' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white text-[#E8622A] font-bold text-sm mb-6 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              SRN Membership Portal
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#2C1810] mb-6 tracking-tight">
              {en ? "Join Our Mission" : "हमारे मिशन से जुड़ें"}
            </h1>
            <p className="text-[#7A5C45] text-lg md:text-xl max-w-2xl mx-auto font-medium">
              {en 
                ? "Become a member of Sashakt Rashtra Nirman and play a vital role in building a self-reliant nation." 
                : "सशक्त राष्ट्र निर्माण के सदस्य बनें और आत्मनिर्भर राष्ट्र के निर्माण में महत्वपूर्ण भूमिका निभाएं।"}
            </p>
          </motion.div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-12 text-center shadow-2xl border border-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-900/20 rotate-3"
              >
                <CheckCircle2 className="w-14 h-14" />
              </motion.div>
              <h2 className="text-4xl font-bold font-serif text-[#2C1810] mb-4">
                {en ? "Welcome to the Family!" : "परिवार में आपका स्वागत है!"}
              </h2>
              <p className="text-[#7A5C45] text-xl mb-10 max-w-md mx-auto">
                {en 
                  ? "Your membership registration is complete. Check your email for your digital ID card." 
                  : "आपका सदस्यता पंजीकरण पूरा हो गया है। अधिक जानकारी के लिए अपना ईमेल जांचें।"}
              </p>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="px-10 py-4 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-1"
              >
                {en ? "Go to Dashboard" : "डैशबोर्ड पर जाएं"}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden">
            {/* Stepper Header */}
            <div className="bg-white/50 border-b border-[#E8D5B8]/50 p-8 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E8622A]/5 to-transparent" />
              <div className="flex justify-between items-center relative z-10 max-w-2xl mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-[#E8D5B8]/30 rounded-full z-0" />
                  <motion.div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-gradient-to-r from-[#E8622A] to-[#C04A18] rounded-full z-0 shadow-sm origin-left" 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: ((currentStep - 1) / (steps.length - 1)) }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                
                {steps.map((step) => {
                  const Icon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <motion.div 
                        initial={false}
                        animate={{ 
                          scale: isActive ? 1.1 : 1,
                          backgroundColor: isActive || isCompleted ? "#E8622A" : "#FFFFFF",
                          color: isActive || isCompleted ? "#FFFFFF" : "#B89070",
                          borderColor: isActive || isCompleted ? "#FFFFFF" : "#E8D5B8"
                        }}
                        className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center border-4 shadow-lg transition-colors duration-300 ${isActive ? 'shadow-orange-900/20' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </motion.div>
                      <span className={`mt-3 text-xs font-bold uppercase tracking-wider hidden md:block transition-colors duration-300 ${isActive || isCompleted ? "text-[#E8622A]" : "text-[#B89070]"}`}>
                        {en ? step.title : step.titleHi}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 md:p-12 bg-white/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {/* STEP 1: Personal Details */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-bold text-[#2C1810] font-serif mb-2">
                          {en ? "Personal Details" : "व्यक्तिगत विवरण"}
                        </h2>
                        <p className="text-[#7A5C45] font-medium">Tell us a bit about yourself.</p>
                      </div>
                      
                      <div className="bg-[#FDF5EC]/50 p-8 rounded-[2rem] border border-[#E8D5B8]/50 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelClass}>{en ? "First Name" : "पहला नाम"} *</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={getInputClass("firstName")} placeholder="John" />
                          </div>
                          <div>
                            <label className={labelClass}>{en ? "Last Name" : "अंतिम नाम"} *</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={getInputClass("lastName")} placeholder="Doe" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelClass}>
                              <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {en ? "Email Address" : "ईमेल"} *</span>
                            </label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className={getInputClass("email")} placeholder="john@example.com" />
                          </div>
                          <div>
                            <label className={labelClass}>
                              <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {en ? "Phone Number" : "फ़ोन नंबर"} *</span>
                            </label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={getInputClass("phone")} placeholder="+91 98765 43210" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Address & Role */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-bold text-[#2C1810] font-serif mb-2">
                          {en ? "Address & Role" : "पता और भूमिका"}
                        </h2>
                        <p className="text-[#7A5C45] font-medium">Where are you from and how do you want to help?</p>
                      </div>

                      <div className="bg-[#FDF5EC]/50 p-8 rounded-[2rem] border border-[#E8D5B8]/50 shadow-sm space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelClass}>{en ? "State" : "राज्य"} *</label>
                            <input type="text" name="state" value={formData.state} onChange={handleChange} className={getInputClass("state")} placeholder="Maharashtra" />
                          </div>
                          <div>
                            <label className={labelClass}>{en ? "City / District" : "शहर / जिला"} *</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className={getInputClass("city")} placeholder="Mumbai" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className={labelClass}>{en ? "Profession" : "पेशा"}</label>
                            <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={getInputClass("profession")} placeholder="Software Engineer" />
                          </div>
                          <div>
                            <label className={labelClass}>{en ? "Area of Interest" : "रुचि का क्षेत्र"}</label>
                            <select name="interest" value={formData.interest} onChange={handleChange} className={getInputClass("interest")}>
                              <option value="volunteer">{en ? "Active Volunteer" : "सक्रिय स्वयंसेवक"}</option>
                              <option value="leadership">{en ? "Leadership & Strategy" : "नेतृत्व और रणनीति"}</option>
                              <option value="donor">{en ? "Donor / Supporter" : "दानकर्ता / समर्थक"}</option>
                              <option value="advisor">{en ? "Subject Matter Expert" : "विषय विशेषज्ञ"}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Confirmation */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-bold text-[#2C1810] font-serif mb-2">
                          {en ? "Membership Confirmation" : "सदस्यता पुष्टिकरण"}
                        </h2>
                        <p className="text-[#7A5C45] font-medium">Review your details and choose your payment method.</p>
                      </div>

                      {/* Payment Method Tabs */}
                      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                        <button type="button" disabled={true}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all opacity-50 cursor-not-allowed bg-gray-200 text-gray-500">
                          <Lock className="w-4 h-4" />
                          {en ? "Pay Online (₹999)" : "ऑनलाइन भुगतान (₹999)"}
                        </button>
                        <button type="button" onClick={() => setPaymentTab("upi")}
                          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                            paymentTab === "upi" ? "bg-white shadow text-[#E8622A]" : "text-gray-500 hover:text-gray-700"
                          }`}>
                          <QrCode className="w-4 h-4" />
                          {en ? `Pay via UPI (₹${MEMBER_AMOUNT_QR})` : `UPI से भुगतान (₹${MEMBER_AMOUNT_QR})`}
                        </button>
                      </div>

                      {paymentTab === "razorpay" ? (
                        <>
                          <div className="bg-gradient-to-br from-[#2C1810] to-[#4A281A] p-8 rounded-[2rem] border border-[#5C3A1E] text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[40px] pointer-events-none" />
                            <div className="relative z-10 space-y-6">
                              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                <span className="text-white/60 font-bold uppercase tracking-wider text-sm">{en ? "Membership Type" : "सदस्यता प्रकार"}</span>
                                <span className="font-bold text-xl text-[#E8D5B8] flex items-center gap-2">
                                  <ShieldCheck className="w-5 h-5" />
                                  {en ? "Lifetime Member" : "आजीवन सदस्य"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between pb-2">
                                <span className="text-white/60 font-bold uppercase tracking-wider text-sm">{en ? "Registration Fee" : "पंजीकरण शुल्क"}</span>
                                <span className="text-4xl font-bold text-white">₹999</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 p-6 bg-white/50 rounded-2xl border border-[#E8D5B8]/50">
                            <input type="checkbox" id="terms" className="mt-1.5 w-5 h-5 rounded text-[#E8622A] focus:ring-[#E8622A]" required />
                            <label htmlFor="terms" className="text-sm md:text-base text-[#5C3A1E] font-medium leading-relaxed">
                              {en ? "I pledge my commitment to the ideals of Sashakt Rashtra Nirman and agree to the terms and conditions of membership." : "मैं सशक्त राष्ट्र निर्माण के आदर्शों के प्रति अपनी प्रतिबद्धता की प्रतिज्ञा करता हूं और सदस्यता के नियमों और शर्तों से सहमत हूं।"}
                            </label>
                          </div>
                        </>
                      ) : qrSubmitted ? (
                        <div className="flex flex-col items-center text-center py-10">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-5">
                            <Clock className="w-10 h-10" />
                          </motion.div>
                          <h3 className="text-xl font-bold text-[#5C1010] font-serif mb-2">{en ? "Verification Pending" : "सत्यापन लंबित"}</h3>
                          <p className="text-[#7A5C45] max-w-xs text-sm">
                            {en ? "Your payment of ₹101 has been submitted. Once verified, your SRN membership will be activated and your ID card will be sent via email." : "आपका ₹101 भुगतान जमा कर दिया गया है। सत्यापन के बाद आपकी SRN सदस्यता सक्रिय हो जाएगी।"}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* QR + UPI ID */}
                          <div className="flex flex-col items-center bg-gradient-to-b from-orange-50 to-white border border-orange-100 rounded-2xl p-5">
                            <p className="text-sm text-[#7A5C45] font-semibold mb-3">{en ? `Scan & Pay ₹${MEMBER_AMOUNT_QR}` : `₹${MEMBER_AMOUNT_QR} स्कैन करें और भुगतान करें`}</p>
                            <div className="w-56 h-56 sm:w-64 sm:h-64 overflow-hidden rounded-xl border border-orange-200 shadow flex items-center justify-center bg-white p-4">
                              <QRCode value={`upi://pay?pa=${UPI_ID}&pn=SASHAKT%20RASHTRA%20NIRMAN&am=${MEMBER_AMOUNT_QR}&cu=INR`} size={256} className="w-full h-full" />
                            </div>
                            <p className="mt-3 text-xs text-gray-500 font-mono tracking-wider">{UPI_ID}</p>
                            <p className="text-xs text-gray-400 mt-1">{en ? "Open any UPI app and scan" : "कोई भी UPI ऐप खोलें और स्कैन करें"}</p>
                          </div>
                          {/* UTR */}
                          <div>
                            <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "UTR / Transaction ID *" : "UTR / लेन-देन ID *"}</label>
                            <input type="text" value={utrNumber} onChange={e => setUtrNumber(e.target.value)} required
                              placeholder={en ? "e.g. 426812345678" : "जैसे. 426812345678"}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none font-mono" />
                          </div>
                          {/* Screenshot */}
                          <div>
                            <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Payment Screenshot *" : "भुगतान स्क्रीनशॉट *"}</label>
                            {screenshotPreview ? (
                              <div className="relative">
                                <img src={screenshotPreview} alt="preview" className="w-full h-28 object-cover rounded-xl border border-gray-200" />
                                <button type="button" onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); }}
                                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"><X className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <button type="button" onClick={() => fileInputRef.current?.click()}
                                className="w-full h-20 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#E8622A] hover:bg-orange-50 transition-all">
                                <Upload className="w-5 h-5 text-[#E8622A]" />
                                <span className="text-sm text-gray-500">{en ? "Click to upload screenshot" : "स्क्रीनशॉट अपलोड करें"}</span>
                              </button>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Form Controls */}
              <div className="mt-12 pt-8 border-t border-[#E8D5B8]/50 flex justify-between items-center">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrev}
                    className="px-6 py-3.5 rounded-xl text-[#7A5C45] font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-sm border border-transparent hover:border-[#E8D5B8]/50"
                  >
                    <ArrowLeft className="w-5 h-5" /> {en ? "Back" : "पीछे"}
                  </button>
                ) : <div />}

                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-xl font-bold shadow-md shadow-orange-900/20 transition-all flex items-center gap-3 hover:-translate-y-0.5"
                  >
                    {en ? "Next Step" : "अगला कदम"} <ArrowRight className="w-5 h-5" />
                  </button>
                ) : paymentTab === "upi" && !qrSubmitted ? (
                  <button
                    onClick={handleQRMemberSubmit}
                    disabled={qrSubmitting}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#E8622A] to-[#C04A18] hover:from-[#C04A18] hover:to-[#E8622A] text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-3 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {qrSubmitting ? "Submitting..." : (en ? "I Have Paid — Submit for Verification" : "मैंने भुगतान किया — सत्यापन के लिए सबमिट करें")} <ArrowRight className="w-5 h-5" />
                  </button>
                ) : paymentTab === "upi" && qrSubmitted ? (
                  <span className="text-amber-600 font-semibold text-sm">✅ {en ? "Submitted! Awaiting admin verification." : "सबमिट हो गया! व्यवस्थापक सत्यापन की प्रतीक्षा है।"}</span>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all flex items-center gap-3 hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {loading ? "Processing..." : (en ? "Pay & Register" : "भुगतान करें और रजिस्टर करें")} <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ProfileCompletionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onComplete={() => {
          setIsModalOpen(false);
          // Wait briefly for AuthContext to sync before they click 'Pay' again
        }} 
      />

      {isProcessingPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-sm w-full mx-4 border border-[#E8622A]/20">
             <div className="w-16 h-16 border-4 border-[#E8622A]/20 border-t-[#E8622A] rounded-full animate-spin mb-6"></div>
             <h3 className="text-xl font-bold text-[#2C1810] mb-2 text-center">
                {en ? "Setting up your Membership..." : "आपकी सदस्यता सेट की जा रही है..."}
             </h3>
             <p className="text-center text-[#5C3A1E] text-sm">
                {en ? "Please wait while we verify your payment and generate your SRN ID Card. Do not close this window." : "कृपया प्रतीक्षा करें जब तक हम आपके भुगतान को सत्यापित करते हैं और आपका SRN ID कार्ड जनरेट करते हैं। कृपया इस विंडो को बंद न करें।"}
             </p>
          </div>
        </div>
      )}
    </div>
  );
}

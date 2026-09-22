import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, ShieldCheck, IndianRupee, ArrowRight, CheckCircle2, ChevronDown, 
  Lock, QrCode, CreditCard, Upload, X, Copy, Check, FileText, 
  MapPin, User, Mail, Phone, Building2, Award, Sparkles, BookOpen, 
  Stethoscope, Landmark, Users, Trees
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import ProfileCompletionModal from "../components/ProfileCompletionModal";
import imageCompression from 'browser-image-compression';
import { loadRazorpayScript } from "../utils/razorpay";
import { INDIAN_STATES } from "./Signup";

const UPI_ID = "sashaktrashtranirman@cbin";
const QR_IMAGE = "/srn-upi-qr.png";

const BANK_ACCOUNT_NAME = "SASHAKT RASHTRA NIRMAN";
const BANK_ACCOUNT_NUMBER = "4120309580";
const BANK_IFSC = "CBIN0280301";
const BANK_NAME = "Central Bank of India";

const QUICK_AMOUNTS = [5100, 11000, 21000, 51000];

export default function Donate() {
  const { lang } = useLanguage();
  const { user, API_BASE } = useAuth();
  const navigate = useNavigate();
  const en = lang === "en";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(5100);
  const [customAmount, setCustomAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedField, setCopiedField] = useState("");

  // Payment method tab state
  const [activeTab, setActiveTab] = useState("upi"); // "upi" | "bank" | "razorpay"
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [qrSubmitting, setQrSubmitting] = useState(false);
  const [qrSubmitted, setQrSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const campaigns = [
    { 
      value: "General Fund", 
      icon: Heart,
      label: en ? "General Welfare" : "सामान्य कल्याण", 
      desc: en ? "Nation building & rapid relief" : "राष्ट्र निर्माण एवं त्वरित सहायता" 
    },
    { 
      value: "Education", 
      icon: BookOpen,
      label: en ? "Education & Literacy" : "शिक्षा और साक्षरता", 
      desc: en ? "Youth schooling & study kits" : "छात्रवृत्ति एवं अध्ययन किट" 
    },
    { 
      value: "Healthcare", 
      icon: Stethoscope,
      label: en ? "Healthcare Relief" : "स्वास्थ्य सहायता", 
      desc: en ? "Free medical checkup camps" : "निःशुल्क चिकित्सा शिविर" 
    },
    { 
      value: "Culture", 
      icon: Landmark,
      label: en ? "Cultural Heritage" : "सांस्कृतिक विरासत", 
      desc: en ? "National pride & arts preservation" : "ऐतिहासिक धरोहर संरक्षण" 
    },
    { 
      value: "Youth & Women", 
      icon: Users,
      label: en ? "Youth & Women" : "युवा व महिला", 
      desc: en ? "Vocational skills & livelihood" : "कौशल विकास व आजीविका" 
    },
    { 
      value: "Environment", 
      icon: Trees,
      label: en ? "Nature & Greenery" : "पर्यावरण संरक्षण", 
      desc: en ? "Tree plantation & clean water" : "वृक्षारोपण व जल संरक्षण" 
    }
  ];

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    panNumber: "",
    address: "",
    state: user?.state || "",
    city: user?.district || "",
    campaign: "General Fund"
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.firstName || "",
        lastName: prev.lastName || user.lastName || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        state: prev.state || user.state || "",
        city: prev.city || user.district || ""
      }));
    }
  }, [user]);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleQuickSelect = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(Number(val));
  };

  const validateDonorDetails = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert(en ? "Please enter both first and last name." : "कृपया पहला और अंतिम दोनों नाम दर्ज करें।");
      return false;
    }
    if (!formData.phone.trim()) {
      alert(en ? "Please enter your mobile number." : "कृपया अपना मोबाइल नंबर दर्ज करें।");
      return false;
    }
    if (!formData.email.trim()) {
      alert(en ? "Please enter your email address." : "कृपया अपना ईमेल पता दर्ज करें।");
      return false;
    }
    if (formData.panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.trim())) {
      alert(en ? "Invalid PAN format. Please enter a valid 10-character PAN (e.g. ABCDE1234F)." : "अमान्य पैन प्रारूप। कृपया एक वैध 10-अक्षरीय पैन दर्ज करें (उदा. ABCDE1234F)।");
      return false;
    }
    if (!formData.state.trim() || !formData.city.trim()) {
      alert(en ? "Please select your state and city." : "कृपया अपना राज्य और शहर चुनें।");
      return false;
    }
    if (amount < 1000) {
      alert(en ? "Minimum donation amount is ₹1000" : "न्यूनतम दान राशि ₹1000 है");
      return false;
    }
    return true;
  };

  const handleSubmitRazorpay = async (e) => {
    e.preventDefault();
    if (!validateDonorDetails()) return;

    if (!user || (!user.profilePicture && !user.avatar)) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const detailedPurpose = `[RAZORPAY] Campaign: ${formData.campaign} | Donor: ${formData.firstName} ${formData.lastName} | PAN: ${formData.panNumber.toUpperCase() || 'N/A'} | City: ${formData.city}, ${formData.state} | Address: ${formData.address}`;
      
      const orderRes = await fetch(`${API_BASE}/api/payments/order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include",
        body: JSON.stringify({ 
          amount: amount || 5100, 
          currency: "INR", 
          type: "DONATION", 
          purpose: detailedPurpose 
        })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

      const keyRes = await fetch(`${API_BASE}/api/payments/key`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        credentials: 'include'
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
        description: `Donation: ${formData.campaign}`,
        order_id: orderData.data.razorpayOrderId,
        handler: async function (response) {
          setIsProcessingPayment(true);
          try {
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

            if (!verifyRes.ok) {
              const errorData = await verifyRes.json();
              throw new Error(errorData.message || "Payment verification failed");
            }

            setSubmitted(true);
            setTimeout(() => {
              setSubmitted(false);
              setAmount(5100);
              setCustomAmount("");
            }, 4000);
            setIsProcessingPayment(false);
          } catch (err) {
            console.error("Donation verification failed:", err);
            alert(`Payment verification failed: ${err.message}`);
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#E8622A"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);

    } catch (err) {
      console.error("Donation creation failed:", err);
      alert(`Payment failed: ${err.message}`);
      setLoading(false);
    }
  };

  const handleQRSubmit = async (e) => {
    e.preventDefault();
    if (!validateDonorDetails()) return;

    if (!user || (!user.profilePicture && !user.avatar)) {
      setIsModalOpen(true);
      return;
    }

    if (!utrNumber.trim()) {
      alert(en ? "Please enter your UTR / Transaction ID." : "कृपया अपना UTR / लेन-देन ID दर्ज करें।");
      return;
    }
    if (!screenshotFile) {
      alert(en ? "Please upload your payment screenshot." : "कृपया अपना भुगतान स्क्रीनशॉट अपलोड करें।");
      return;
    }

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

      const detailedPurpose = `[${activeTab === 'bank' ? 'BANK TRANSFER' : 'UPI'}] Campaign: ${formData.campaign} | Donor: ${formData.firstName} ${formData.lastName} | PAN: ${formData.panNumber.toUpperCase() || 'N/A'} | City: ${formData.city}, ${formData.state} | Address: ${formData.address}`;

      const res = await fetch(`${API_BASE}/api/manual-payments/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          amount: amount || 5100,
          type: "DONATION",
          utrNumber: utrNumber.trim(),
          screenshot: screenshotUrl,
          purpose: detailedPurpose,
          email: formData.email,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setQrSubmitted(true);
    } catch (err) {
      alert("Submission failed: " + err.message);
    } finally {
      setQrSubmitting(false);
    }
  };

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setScreenshotFile(compressedFile);
      setScreenshotPreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error('Error compressing image:', error);
      setScreenshotFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const selectedCampaignObj = campaigns.find(c => c.value === formData.campaign) || campaigns[0];

  return (
    <div className="min-h-screen bg-[#FDF5EC] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[350px] bg-gradient-to-b from-[#E8622A]/10 via-[#D4880C]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── COMPACT, ELEGANT HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/90 border border-[#E8622A]/30 text-[#C04A18] text-xs font-semibold mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E8622A]" />
            <span>{en ? "Sashakt Rashtra Nirman · Official Contribution Portal" : "सशक्त राष्ट्र निर्माण · आधिकारिक योगदान पोर्टल"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-[#5C1010] leading-tight mb-2">
            {en ? "Empower the Future of the Nation" : "राष्ट्र के भविष्य को सशक्त बनाएं"}
          </h1>

          <p className="text-[#7A5C45] text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {en 
              ? "Your contributions directly support grassroots social initiatives across India. Transparent, 100% accountable, and 80G tax benefit compliant." 
              : "आपका योगदान पूरे भारत में आत्मनिर्भरता, शिक्षा और सामाजिक उत्थान को गति प्रदान करता है। पारदर्शी, जवाबदेह और 80G कर लाभ अनुरूप।"}
          </p>
        </motion.div>

        {/* ── UNIFIED MASTER CARD (2 BALANCED COLUMNS) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl border border-orange-100/90 overflow-hidden"
        >
          {/* Top Brand Gradient Ribbon */}
          <div className="h-2 w-full bg-gradient-to-r from-[#E8622A] via-[#F48F42] to-[#C04A18]" />

          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

            {/* ══════════════════════════════════════════════════════════════
                LEFT COLUMN (lg:col-span-7): 
                Step 1: Amount | Step 2: Campaign | Step 3: Donor Details
               ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-orange-100 flex flex-col justify-between space-y-8">
              
              {/* ── STEP 1: DONATION AMOUNT ── */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5C1010] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8622A] text-white flex items-center justify-center text-xs font-bold">1</span>
                    {en ? "Contribution Amount (INR)" : "योगदान राशि चुनें (INR)"}
                  </label>
                  <span className="text-xs text-gray-400 font-medium">{en ? "Min ₹1,000" : "न्यूनतम ₹1,000"}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3.5">
                  {QUICK_AMOUNTS.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickSelect(val)}
                      className={`py-3.5 px-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-150 border-2 flex items-center justify-center cursor-pointer ${
                        amount === val && !customAmount
                          ? "bg-[#E8622A] border-[#E8622A] text-white shadow-md shadow-orange-900/20 scale-[1.01]"
                          : "bg-orange-50/30 border-orange-100 text-[#5C1010] hover:bg-orange-100/50 hover:border-orange-300"
                      }`}
                    >
                      ₹{val.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <IndianRupee className="h-4 w-4 text-[#E8622A]" />
                  </div>
                  <input
                    type="number"
                    min="1000"
                    placeholder={en ? "Or enter custom amount (Min ₹1,000)" : "या अन्य राशि दर्ज करें (न्यूनतम ₹1,000)"}
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="block w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-[#1E0F05] font-semibold placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition-all outline-none"
                  />
                </div>
              </div>

              {/* ── STEP 2: SELECT CAMPAIGN (CLEAN CHIP GRID) ── */}
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5C1010] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8622A] text-white flex items-center justify-center text-xs font-bold">2</span>
                    {en ? "Select Cause / Initiative" : "अभियान / उद्देश्य चुनें"}
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {campaigns.map((c) => {
                    const Icon = c.icon;
                    const isSelected = formData.campaign === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, campaign: c.value })}
                        className={`p-3 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-[#E8622A] bg-orange-50/90 text-[#5C1010] shadow-sm ring-1 ring-[#E8622A]"
                            : "border-gray-200 bg-gray-50/50 hover:bg-orange-50/30 hover:border-orange-200 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#E8622A]" : "text-gray-500"}`} />
                          <p className="font-bold text-xs truncate">{c.label}</p>
                        </div>
                        <p className="text-[11px] text-[#7A5C45] line-clamp-1">{c.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── STEP 3: DONOR DETAILS (FOR 80G RECEIPT) ── */}
              <div className="bg-orange-50/30 border border-orange-100/90 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4 pb-1">
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5C1010] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8622A] text-white flex items-center justify-center text-xs font-bold">3</span>
                    {en ? "Donor Details (For 80G Tax Exemption)" : "दाता विवरण (80G कर छूट रसीद)"}
                  </label>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8622A] bg-white px-3 py-1 rounded-full border border-orange-200 shadow-2xs">
                    <FileText className="w-3.5 h-3.5" />
                    {en ? "80G Compliant" : "धारा 80G वैध"}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* First & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#E8622A]" />
                        {en ? "First Name" : "पहला नाम"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={en ? "Rajesh" : "राजेश"}
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-sm text-[#1E0F05]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#E8622A]" />
                        {en ? "Last Name" : "अंतिम नाम"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={en ? "Sharma" : "शर्मा"}
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-sm text-[#1E0F05]"
                      />
                    </div>
                  </div>

                  {/* Mobile & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#E8622A]" />
                        {en ? "Mobile Number" : "मोबाइल नंबर"} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-gray-500 pointer-events-none">+91</span>
                        <input
                          required
                          type="tel"
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                          className="w-full pl-11 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-sm text-[#1E0F05]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#E8622A]" />
                        {en ? "Email ID" : "ईमेल आईडी"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="rajesh@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-sm text-[#1E0F05]"
                      />
                    </div>
                  </div>

                  {/* PAN & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#E8622A]" />
                          {en ? "PAN Number" : "पैन कार्ड"}
                        </span>
                        <span className="text-[10px] text-[#E8622A] font-semibold lowercase">({en ? "for 80G" : "80G रसीद"})</span>
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="ABCDE1234F"
                        value={formData.panNumber}
                        onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-sm text-[#1E0F05] font-mono uppercase tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E8622A]" />
                        {en ? "Street Address" : "पता / मोहल्ला"}
                      </label>
                      <input
                        type="text"
                        placeholder={en ? "Street / Colony" : "सड़क / कॉलोनी"}
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-sm text-[#1E0F05]"
                      />
                    </div>
                  </div>

                  {/* State & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#E8622A]" />
                        {en ? "State / UT" : "राज्य / केंद्र शासित प्रदेश"} <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-sm text-[#1E0F05] cursor-pointer"
                      >
                        <option value="">{en ? "-- Select State --" : "-- राज्य चुनें --"}</option>
                        {INDIAN_STATES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#E8622A]" />
                        {en ? "City / District" : "शहर / ज़िला"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={en ? "New Delhi" : "नई दिल्ली"}
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-sm text-[#1E0F05]"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>


            {/* ══════════════════════════════════════════════════════════════
                RIGHT COLUMN (lg:col-span-5): 
                Step 4: Choose Payment Method + QR/Bank/Card + Verification
               ══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-[#FFFDF9] via-[#FAF4EE] to-[#F7EFE4] flex flex-col justify-between">
              
              <div>
                {/* Header with Amount Badge */}
                <div className="flex items-center justify-between mb-5">
                  <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5C1010] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E8622A] text-white flex items-center justify-center text-xs font-bold">4</span>
                    {en ? "Choose Payment Method" : "भुगतान विधि चुनें"}
                  </label>
                  <span className="text-xs font-extrabold text-[#E8622A] bg-white px-3 py-1 rounded-lg border border-orange-200 shadow-2xs">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-200/60 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upi")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                      activeTab === "upi"
                        ? "bg-white shadow-xs text-[#E8622A]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5 shrink-0" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("bank")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                      activeTab === "bank"
                        ? "bg-white shadow-xs text-[#E8622A]"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{en ? "Bank" : "बैंक"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={true}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold opacity-50 cursor-not-allowed bg-transparent text-gray-400"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>{en ? "Online" : "ऑनलाइन"}</span>
                  </button>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">

                  {/* ── UPI / QR CODE TAB ── */}
                  {activeTab === "upi" && (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      {qrSubmitted ? (
                        <div className="flex flex-col items-center justify-center text-center py-12 bg-green-50 rounded-2xl border border-green-200 p-5">
                          <CheckCircle2 className="w-12 h-12 text-green-600 mb-3" />
                          <h3 className="text-lg font-bold text-[#5C1010] font-serif mb-1">{en ? "Donation Received!" : "दान प्राप्त हुआ!"}</h3>
                          <p className="text-[#7A5C45] text-xs leading-relaxed">
                            {en 
                              ? "Thank you! Your payment details have been submitted. Our team will verify and dispatch your 80G tax receipt within 24 hours." 
                              : "धन्यवाद! आपका भुगतान सबमिट हो गया है। हमारी टीम 24 घंटों में 80G रसीद ईमेल करेगी।"}
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleQRSubmit} className="space-y-4">
                          
                          {/* QR Box */}
                          <div className="flex flex-col items-center bg-white border border-orange-200/80 rounded-2xl p-5 shadow-xs text-center">
                            <p className="text-xs font-bold text-[#5C1010] mb-3">
                              {en ? `Scan & Pay ₹${amount >= 1000 ? amount.toLocaleString("en-IN") : 0}` : `₹${amount >= 1000 ? amount.toLocaleString("en-IN") : 0} स्कैन करें और भुगतान करें`}
                            </p>

                            <div className="w-44 h-44 rounded-xl border border-orange-200 shadow-2xs flex items-center justify-center bg-white p-3">
                              <QRCode
                                value={`upi://pay?pa=${UPI_ID}&pn=SASHAKT%20RASHTRA%20NIRMAN&am=${amount >= 1000 ? amount : 5100}&cu=INR`}
                                size={155}
                                className="w-full h-full"
                              />
                            </div>

                            {/* UPI ID Pill */}
                            <div className="mt-3.5 flex items-center gap-2 bg-orange-50/70 px-3.5 py-1.5 rounded-full border border-orange-200/80">
                              <span className="text-xs font-mono font-bold text-[#5C1010]">{UPI_ID}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(UPI_ID, "upi")}
                                className="p-0.5 text-[#E8622A] hover:text-[#C04A18] cursor-pointer"
                                title="Copy UPI ID"
                              >
                                {copiedField === "upi" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-2">{en ? "Supported on GPay, PhonePe, Paytm, BHIM & all UPI apps" : "सभी प्रमुख UPI ऐप्स समर्थित"}</p>
                          </div>

                          {/* UTR Input */}
                          <div>
                            <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#E8622A]" />
                              {en ? "UTR / Transaction ID" : "UTR / लेन-देन ID"} <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              type="text"
                              value={utrNumber}
                              onChange={e => setUtrNumber(e.target.value)}
                              placeholder={en ? "12-digit UTR (e.g. 426812345678)" : "12-अंकीय UTR (जैसे 426812345678)"}
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none font-mono text-xs"
                            />
                          </div>

                          {/* Screenshot Upload */}
                          <div>
                            <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5 text-[#E8622A]" />
                              {en ? "Payment Screenshot" : "भुगतान स्क्रीनशॉट"} <span className="text-red-500">*</span>
                            </label>
                            {screenshotPreview ? (
                              <div className="relative rounded-xl overflow-hidden border border-orange-200 h-22 bg-black/5">
                                <img src={screenshotPreview} alt="Screenshot preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); }}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-20 border border-dashed border-orange-200 hover:border-[#E8622A] rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50/40 transition-all bg-white cursor-pointer px-4 text-center"
                              >
                                <Upload className="w-4 h-4 text-[#E8622A] shrink-0" />
                                <span className="text-xs font-semibold text-gray-600">{en ? "Upload screenshot (JPG, PNG)" : "स्क्रीनशॉट अपलोड करें"}</span>
                              </button>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={qrSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-[#E8622A] via-[#F48F42] to-[#C04A18] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-orange-900/15 hover:shadow-orange-900/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                          >
                            {qrSubmitting ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>{en ? "Submitting..." : "सबमिट हो रहा है..."}</span>
                              </div>
                            ) : (
                              <>
                                <span>{en ? `I Have Paid ₹${amount.toLocaleString("en-IN")} — Submit for 80G` : `मैंने ₹${amount.toLocaleString("en-IN")} भुगतान किया — 80G सबमिट करें`}</span>
                                <ArrowRight className="w-4 h-4 shrink-0" />
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {/* ── BANK TRANSFER TAB ── */}
                  {activeTab === "bank" && (
                    <motion.div
                      key="bank"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      {qrSubmitted ? (
                        <div className="flex flex-col items-center justify-center text-center py-12 bg-green-50 rounded-2xl border border-green-200 p-5">
                          <CheckCircle2 className="w-12 h-12 text-green-600 mb-3" />
                          <h3 className="text-lg font-bold text-[#5C1010] font-serif mb-1">{en ? "Transfer Received!" : "ट्रांसफर प्राप्त हुआ!"}</h3>
                          <p className="text-[#7A5C45] text-xs leading-relaxed">
                            {en 
                              ? "Thank you! Your bank transfer donation has been submitted for verification. We will issue your 80G certificate within 24 hours." 
                              : "धन्यवाद! आपका बैंक ट्रांसफर सबमिट हो गया है। 80G प्रमाणपत्र 24 घंटों में जारी किया जाएगा।"}
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleQRSubmit} className="space-y-4">
                          
                          {/* Bank Card */}
                          <div className="bg-white border border-orange-200 rounded-2xl p-4.5 shadow-xs space-y-2.5 text-xs">
                            <div className="flex justify-between items-center pb-2 border-b border-orange-100">
                              <span className="text-gray-500">{en ? "Account Name" : "खाता नाम"}:</span>
                              <span className="font-bold text-[#1E0F05] text-right">{BANK_ACCOUNT_NAME}</span>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b border-orange-100">
                              <span className="text-gray-500">{en ? "Account No" : "खाता संख्या"}:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#1E0F05]">{BANK_ACCOUNT_NUMBER}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(BANK_ACCOUNT_NUMBER, "acc")}
                                  className="p-0.5 text-[#E8622A] hover:text-[#C04A18] cursor-pointer"
                                >
                                  {copiedField === "acc" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pb-2 border-b border-orange-100">
                              <span className="text-gray-500">{en ? "IFSC Code" : "IFSC कोड"}:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#1E0F05]">{BANK_IFSC}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(BANK_IFSC, "ifsc")}
                                  className="p-0.5 text-[#E8622A] hover:text-[#C04A18] cursor-pointer"
                                >
                                  {copiedField === "ifsc" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-gray-500">{en ? "Bank & Branch" : "बैंक"}:</span>
                              <span className="font-bold text-[#1E0F05] text-right">{BANK_NAME}</span>
                            </div>
                          </div>

                          {/* UTR Input */}
                          <div>
                            <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-[#E8622A]" />
                              {en ? "Bank UTR / Reference No" : "बैंक UTR / संदर्भ संख्या"} <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              type="text"
                              value={utrNumber}
                              onChange={e => setUtrNumber(e.target.value)}
                              placeholder={en ? "e.g. CBINR52024123456" : "उदा. CBINR52024123456"}
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none font-mono text-xs"
                            />
                          </div>

                          {/* Screenshot Upload */}
                          <div>
                            <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                              <Upload className="w-3.5 h-3.5 text-[#E8622A]" />
                              {en ? "Transfer Receipt Screenshot" : "ट्रांसफर रसीद"} <span className="text-red-500">*</span>
                            </label>
                            {screenshotPreview ? (
                              <div className="relative rounded-xl overflow-hidden border border-orange-200 h-22 bg-black/5">
                                <img src={screenshotPreview} alt="Screenshot preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); }}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-20 border border-dashed border-orange-200 hover:border-[#E8622A] rounded-xl flex items-center justify-center gap-2 hover:bg-orange-50/40 transition-all bg-white cursor-pointer px-4 text-center"
                              >
                                <Upload className="w-4 h-4 text-[#E8622A] shrink-0" />
                                <span className="text-xs font-semibold text-gray-600">{en ? "Upload transfer receipt" : "ट्रांसफर रसीद अपलोड करें"}</span>
                              </button>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={qrSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-[#E8622A] via-[#F48F42] to-[#C04A18] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-orange-900/15 hover:shadow-orange-900/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                          >
                            {qrSubmitting ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>{en ? "Submitting..." : "सबमिट हो रहा है..."}</span>
                              </div>
                            ) : (
                              <>
                                <span>{en ? `I Have Transferred ₹${amount.toLocaleString("en-IN")} — Submit` : `मैंने ₹${amount.toLocaleString("en-IN")} ट्रांसफर किया — सबमिट करें`}</span>
                                <ArrowRight className="w-4 h-4 shrink-0" />
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {/* ── CARD / NETBANKING TAB ── */}
                  {activeTab === "razorpay" && (
                    <motion.div
                      key="razorpay"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      <div className="p-5 bg-white rounded-2xl border border-orange-200 text-center">
                        <p className="text-xs text-gray-500 mb-1">{en ? "Total Payable Amount" : "कुल देय राशि"}</p>
                        <p className="text-2xl font-extrabold text-[#5C1010] font-serif">₹{amount.toLocaleString("en-IN")}</p>
                        <p className="text-xs text-[#E8622A] font-semibold mt-1.5">{selectedCampaignObj.label}</p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSubmitRazorpay}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-[#E8622A] via-[#F48F42] to-[#C04A18] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-orange-900/15 hover:shadow-orange-900/25 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>{en ? "Opening Gateway..." : "गेटवे खुल रहा है..."}</span>
                          </div>
                        ) : (
                          <>
                            <span>{en ? `Proceed to Pay ₹${amount.toLocaleString("en-IN")}` : `₹${amount.toLocaleString("en-IN")} का ऑनलाइन भुगतान करें`}</span>
                            <ArrowRight className="w-4 h-4 shrink-0" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* ── EMBEDDED TRUST ASSURANCE PILLS ── */}
              <div className="mt-7 pt-5 border-t border-orange-200/60 space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-[#5C1010]">
                  <ShieldCheck className="w-4 h-4 text-[#E8622A] shrink-0" />
                  <span className="font-semibold">{en ? "80G Tax Exemption (Income Tax Act)" : "धारा 80G के तहत 100% कर छूट"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#5C1010]">
                  <Award className="w-4 h-4 text-[#E8622A] shrink-0" />
                  <span className="font-semibold">{en ? "Strict Statutory Audit & Transparency" : "कड़े वैधानिक ऑडिट एवं पूर्ण वित्तीय पारदर्शिता"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#5C1010]">
                  <CheckCircle2 className="w-4 h-4 text-[#E8622A] shrink-0" />
                  <span className="font-semibold">{en ? "Instant Digital 80G Certificate Dispatch" : "डिजिटल 80G प्रमाण पत्र सीधे ईमेल पर"}</span>
                </div>
              </div>

            </div>

          </div>
        </motion.div>

      </div>

      <ProfileCompletionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onComplete={() => {
          setIsModalOpen(false);
        }} 
      />

      {isProcessingPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-sm w-full mx-4 border border-[#E8622A]/20">
             <div className="w-16 h-16 border-4 border-[#E8622A]/20 border-t-[#E8622A] rounded-full animate-spin mb-6"></div>
             <h3 className="text-xl font-bold text-[#2C1810] mb-2 text-center">
                {en ? "Processing Donation..." : "दान संसाधित हो रहा है..."}
             </h3>
             <p className="text-center text-[#5C3A1E] text-sm">
                {en ? "Please wait while we securely verify your transaction. This may take a moment." : "कृपया प्रतीक्षा करें जब तक हम आपके लेनदेन को सुरक्षित रूप से सत्यापित करते हैं। इसमें कुछ समय लग सकता है।"}
             </p>
          </div>
        </div>
      )}
    </div>
  );
}

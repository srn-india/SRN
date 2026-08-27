import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShieldCheck, IndianRupee, ArrowRight, CheckCircle2, ChevronDown, Lock, ArrowLeft, QrCode, CreditCard, Upload, X, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import ProfileCompletionModal from "../components/ProfileCompletionModal";
import imageCompression from 'browser-image-compression';
import { loadRazorpayScript } from "../utils/razorpay";

const UPI_ID = "sashaktrashtranirman@cbin";
const QR_IMAGE = "/srn-upi-qr.png";

const BANK_ACCOUNT_NAME = "SASHAKT RASHTRA NIRMAN";
const BANK_ACCOUNT_NUMBER = "4120309580";
const BANK_IFSC = "CBIN0280301";
const BANK_NAME = "Central Bank of India";

const QUICK_AMOUNTS = [1100, 2100, 5100, 11000];

export default function Donate() {
  const { lang } = useLanguage();
  const { user, API_BASE } = useAuth();
  const navigate = useNavigate();
  const en = lang === "en";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);

  // QR / UPI / Bank tab state
  const [activeTab, setActiveTab] = useState("upi"); // "razorpay" | "upi" | "bank"
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [qrSubmitting, setQrSubmitting] = useState(false);
  const [qrSubmitted, setQrSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const donationPurposes = [
    { value: "General Fund", label: en ? "General Fund" : "सामान्य कोष" },
    { value: "Education", label: en ? "Education & Literacy" : "शिक्षा और साक्षरता" },
    { value: "Healthcare", label: en ? "Healthcare Support" : "स्वास्थ्य सहायता" },
    { value: "Culture", label: en ? "Cultural Preservation" : "सांस्कृतिक संरक्षण" }
  ];

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
    email: user?.email || "",
    phone: user?.phone || "",
    purpose: "General Fund"
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || ""
      }));
    }
  }, [user]);

  const handleQuickSelect = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(Number(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || (!user.profilePicture && !user.avatar)) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order
      const orderRes = await fetch(`${API_BASE}/api/payments/order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include",
        body: JSON.stringify({ amount: amount || 1000, currency: "INR", type: "DONATION", purpose: formData.purpose })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "Failed to create order");

      // 2. Get Razorpay Key
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
        description: "Donation",
        order_id: orderData.data.razorpayOrderId,
        handler: async function (response) {
          setIsProcessingPayment(true);
          try {
            // 3. Verify Payment
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
                razorpay_signature: response.razorpay_signature,
                purpose: formData.purpose
              })
            });
            
            if (!verifyRes.ok) {
              const errorData = await verifyRes.json();
              throw new Error(errorData.message || "Payment verification failed");
            }

            setSubmitted(true);
            setTimeout(() => {
              setSubmitted(false);
              setAmount(1000);
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
          name: formData.fullName,
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
      console.error("Donation failed:", err);
      alert("Something went wrong processing your donation.");
      setLoading(false);
    }
  };

  const handleQRSubmit = async (e) => {
    e.preventDefault();
    if (!user || (!user.profilePicture && !user.avatar)) {
      setIsModalOpen(true);
      return;
    }
    if (!utrNumber.trim()) {
      alert("Please enter your UTR / Transaction ID.");
      return;
    }
    if (!screenshotFile) {
      alert("Please upload your payment screenshot.");
      return;
    }
    setQrSubmitting(true);
    try {
      // Upload screenshot to backend storage
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        body: JSON.stringify({
          amount: amount || 1000,
          type: "DONATION",
          utrNumber: utrNumber.trim(),
          screenshot: screenshotUrl,
          purpose: `[${activeTab === 'bank' ? 'BANK TRANSFER' : 'UPI'}] ${formData.purpose}`,
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
      setScreenshotFile(file); // fallback to original
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF5EC] py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      
      

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* ── LEFT: Impact & Context ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8622A] to-[#C04A18] flex items-center justify-center mb-6 shadow-lg shadow-orange-900/20">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#5C1010] leading-tight mb-6">
              {en ? "Empower the Future of the Nation" : "राष्ट्र के भविष्य को सशक्त बनाएं"}
            </h1>
            <p className="text-[#7A5C45] text-lg leading-relaxed mb-10">
              {en 
                ? "Your contribution directly fuels initiatives that promote self-reliance, cultural pride, and holistic community development across India." 
                : "आपका योगदान सीधे तौर पर उन पहलों को बढ़ावा देता है जो पूरे भारत में आत्मनिर्भरता, सांस्कृतिक गौरव और समग्र सामुदायिक विकास को बढ़ावा देते हैं।"}
            </p>

            <div className="space-y-6">
              {[
                { title: en ? "Transparent Use of Funds" : "निधियों का पारदर्शी उपयोग", desc: en ? "We maintain strict auditing and regular reporting." : "हम सख्त ऑडिटिंग और नियमित रिपोर्टिंग बनाए रखते हैं।" },
                { title: en ? "Direct Impact" : "सीधा प्रभाव", desc: en ? "90% of your donation goes directly to field programs." : "आपके दान का 90% सीधे क्षेत्रीय कार्यक्रमों में जाता है।" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8622A]/30 flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-[#E8622A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E0F05]">{item.title}</h3>
                    <p className="text-sm text-[#7A5C45] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Donation Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-[#E8622A]/10 relative overflow-visible"
          >
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E8622A] to-[#D4880C] rounded-t-3xl" />

            {/* ── Payment Method Tabs ── */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                disabled={true}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
              >
                <Lock className="w-4 h-4" />
                {en ? "Pay Online" : "ऑनलाइन भुगतान"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upi")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "upi" ? "bg-white shadow text-[#E8622A]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <QrCode className="w-4 h-4" />
                {en ? "Pay via UPI/QR" : "UPI/QR से भुगतान"}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bank")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "bank" ? "bg-white shadow text-[#E8622A]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                {en ? "Bank Transfer" : "बैंक ट्रांसफर"}
              </button>
            </div>

            <AnimatePresence mode="wait">

              {/* ── RAZORPAY TAB ── */}
              {activeTab === "razorpay" && (
                <motion.div key="razorpay" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  {submitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-20">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[#5C1010] font-serif mb-2">{en ? "Thank You!" : "धन्यवाद!"}</h3>
                      <p className="text-[#7A5C45]">{en ? "Your generous contribution has been received." : "आपका उदार योगदान प्राप्त हो गया है।"}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                      <h2 className="text-2xl font-bold font-serif text-[#1E0F05] mb-6">{en ? "Make a Secure Donation" : "सुरक्षित दान करें"}</h2>
                      <div className="mb-8">
                        <label className="block text-sm font-semibold text-[#7A5C45] mb-3 uppercase tracking-wider">{en ? "Select Amount (INR)" : "राशि चुनें (INR)"}</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {QUICK_AMOUNTS.map((val) => (
                            <button key={val} type="button" onClick={() => handleQuickSelect(val)}
                              className={`py-3 rounded-xl font-bold text-lg transition-all duration-200 border-2 ${amount === val && !customAmount ? "bg-[#E8622A]/10 border-[#E8622A] text-[#E8622A]" : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"}`}>
                              ₹{val}
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><IndianRupee className="h-5 w-5 text-gray-400" /></div>
                          <input type="number" placeholder={en ? "Custom Amount" : "अन्य राशि"} value={customAmount} onChange={handleCustomChange}
                            className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1E0F05] focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition-colors" />
                        </div>
                      </div>
                      <div className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Full Name" : "पूरा नाम"} *</label>
                            <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Phone Number" : "फ़ोन नंबर"} *</label>
                            <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Email Address" : "ईमेल"} *</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                          </div>
                          <div className="relative">
                            <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Purpose of Donation" : "दान का उद्देश्य"}</label>
                            <button type="button" onClick={() => setShowPurposeDropdown(!showPurposeDropdown)}
                              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none text-left flex justify-between items-center text-[#1E0F05] text-sm shadow-sm">
                              <span className="font-medium">{donationPurposes.find(p => p.value === formData.purpose)?.label || formData.purpose}</span>
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showPurposeDropdown ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                              {showPurposeDropdown && (
                                <><div className="fixed inset-0 z-10" onClick={() => setShowPurposeDropdown(false)} />
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                  className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                  {donationPurposes.map((p) => (
                                    <button key={p.value} type="button" onClick={() => { setFormData({ ...formData, purpose: p.value }); setShowPurposeDropdown(false); }}
                                      className={`w-full px-4 py-3 text-left text-sm hover:bg-orange-50 hover:text-[#E8622A] transition-colors ${formData.purpose === p.value ? "bg-orange-50 text-[#E8622A] font-semibold" : "text-gray-700"}`}>
                                      {p.label}
                                    </button>
                                  ))}
                                </motion.div></>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                      <button type="submit" disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                        {loading ? "Processing..." : (en ? "Proceed to Pay" : "भुगतान करें")} ₹{amount || 0}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-4">{en ? "Secured via industry-standard encryption." : "उद्योग-मानक एन्क्रिप्शन के माध्यम से सुरक्षित।"}</p>
                    </form>
                  )}
                </motion.div>
              )}

              {/* ── UPI / QR TAB ── */}
              {activeTab === "upi" && (
                <motion.div key="upi" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  {qrSubmitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[#5C1010] font-serif mb-2">{en ? "Donation Received" : "दान प्राप्त हुआ"}</h3>
                      <p className="text-[#7A5C45] max-w-xs">
                        {en ? "Thank you! Your donation details have been submitted and a receipt has been sent to your email." : "धन्यवाद! आपका दान सफलतापूर्वक प्राप्त हो गया है और आपकी ईमेल पर एक रसीद भेज दी गई है।"}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleQRSubmit}>
                      <h2 className="text-xl font-bold font-serif text-[#1E0F05] mb-5">{en ? "Pay via UPI / QR Code" : "UPI / QR कोड से भुगतान करें"}</h2>

                      {/* Amount selector */}
                      <div className="mb-5">
                        <label className="block text-sm font-semibold text-[#7A5C45] mb-2 uppercase tracking-wider">{en ? "Donation Amount" : "दान राशि"}</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          {QUICK_AMOUNTS.map((val) => (
                            <button key={val} type="button" onClick={() => handleQuickSelect(val)}
                              className={`py-3 rounded-xl font-bold text-lg transition-all border-2 ${amount === val && !customAmount ? "bg-[#E8622A]/10 border-[#E8622A] text-[#E8622A]" : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"}`}>
                              ₹{val}
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><IndianRupee className="h-5 w-5 text-gray-400" /></div>
                          <input type="number" placeholder={en ? "Custom Amount" : "अन्य राशि"} value={customAmount} onChange={handleCustomChange}
                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1E0F05] focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition-colors" />
                        </div>
                      </div>

                      {/* QR Code display */}
                      <div className="flex flex-col items-center bg-gradient-to-b from-orange-50 to-white border border-orange-100 rounded-2xl p-5 mb-5">
                        <p className="text-sm text-[#7A5C45] font-semibold mb-3">
                          {en ? `Scan & Pay ₹${amount || 0}` : `₹${amount || 0} स्कैन करें और भुगतान करें`}
                        </p>
                        <div className="w-56 h-56 sm:w-64 sm:h-64 overflow-hidden rounded-xl border border-orange-200 shadow flex items-center justify-center bg-white p-4">
                          <QRCode value={`upi://pay?pa=${UPI_ID}&pn=SASHAKT%20RASHTRA%20NIRMAN&am=${amount || 0}&cu=INR`} size={256} className="w-full h-full" />
                        </div>
                        <p className="mt-3 text-xs text-gray-500 font-mono tracking-wider">{UPI_ID}</p>
                        <p className="text-xs text-gray-400 mt-1">{en ? "Open any UPI app and scan" : "कोई भी UPI ऐप खोलें और स्कैन करें"}</p>
                      </div>

                      {/* UTR Input */}
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "UTR / Transaction ID *" : "UTR / लेन-देन ID *"}</label>
                        <input required type="text" value={utrNumber} onChange={e => setUtrNumber(e.target.value)}
                          placeholder={en ? "e.g. 426812345678" : "जैसे. 426812345678"}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none font-mono" />
                        <p className="text-xs text-gray-400 mt-1">{en ? "Found in your UPI app under payment history." : "आपके UPI ऐप में भुगतान इतिहास में मिलेगा।"}</p>
                      </div>

                      {/* Screenshot Upload */}
                      <div className="mb-5">
                        <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Payment Screenshot *" : "भुगतान स्क्रीनशॉट *"}</label>
                        {screenshotPreview ? (
                          <div className="relative">
                            <img src={screenshotPreview} alt="Screenshot preview" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                            <button type="button" onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); }}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="w-full h-24 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#E8622A] hover:bg-orange-50 transition-all">
                            <Upload className="w-6 h-6 text-[#E8622A]" />
                            <span className="text-sm text-gray-500">{en ? "Click to upload screenshot" : "स्क्रीनशॉट अपलोड करें"}</span>
                          </button>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
                      </div>

                      <button type="submit" disabled={qrSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                        {qrSubmitting ? (en ? "Submitting..." : "सबमिट हो रहा है...") : (en ? "I Have Paid — Submit for Verification" : "मैंने भुगतान किया — सत्यापन के लिए सबमिट करें")}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-3">
                        {en ? "Your payment will be verified by our team within 24 hours." : "आपका भुगतान 24 घंटों के भीतर हमारी टीम द्वारा सत्यापित किया जाएगा।"}
                      </p>
                    </form>
                  )}
                </motion.div>
              )}

              {/* ── BANK TRANSFER TAB ── */}
              {activeTab === "bank" && (
                <motion.div key="bank" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  {qrSubmitted ? (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[#5C1010] font-serif mb-2">{en ? "Donation Received" : "दान प्राप्त हुआ"}</h3>
                      <p className="text-[#7A5C45] max-w-xs">
                        {en ? "Thank you! Your donation details have been submitted and a receipt has been sent to your email." : "धन्यवाद! आपका दान सफलतापूर्वक प्राप्त हो गया है और आपकी ईमेल पर एक रसीद भेज दी गई है।"}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleQRSubmit}>
                      <h2 className="text-xl font-bold font-serif text-[#1E0F05] mb-5">{en ? "Pay via Bank Transfer" : "बैंक ट्रांसफर से भुगतान करें"}</h2>

                      {/* Amount selector */}
                      <div className="mb-5">
                        <label className="block text-sm font-semibold text-[#7A5C45] mb-2 uppercase tracking-wider">{en ? "Donation Amount" : "दान राशि"}</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          {QUICK_AMOUNTS.map((val) => (
                            <button key={val} type="button" onClick={() => handleQuickSelect(val)}
                              className={`py-3 rounded-xl font-bold text-lg transition-all border-2 ${amount === val && !customAmount ? "bg-[#E8622A]/10 border-[#E8622A] text-[#E8622A]" : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"}`}>
                              ₹{val}
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><IndianRupee className="h-5 w-5 text-gray-400" /></div>
                          <input type="number" placeholder={en ? "Custom Amount" : "अन्य राशि"} value={customAmount} onChange={handleCustomChange}
                            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#1E0F05] focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition-colors" />
                        </div>
                      </div>

                      {/* Bank Details display */}
                      <div className="flex flex-col items-center bg-gradient-to-b from-orange-50 to-white border border-orange-100 rounded-2xl p-5 mb-5 w-full">
                        <p className="text-sm text-[#7A5C45] font-semibold mb-3">
                          {en ? `Transfer ₹${amount || 0} to:` : `₹${amount || 0} यहाँ ट्रांसफर करें:`}
                        </p>
                        <div className="w-full text-left space-y-2 text-sm text-[#1E0F05]">
                          <div className="flex justify-between border-b border-orange-100 pb-2"><span className="text-gray-500">{en ? "Account Name:" : "खाता नाम:"}</span> <strong className="text-right">{BANK_ACCOUNT_NAME}</strong></div>
                          <div className="flex justify-between border-b border-orange-100 pb-2 pt-1"><span className="text-gray-500">{en ? "Account No:" : "खाता संख्या:"}</span> <strong className="font-mono text-right">{BANK_ACCOUNT_NUMBER}</strong></div>
                          <div className="flex justify-between border-b border-orange-100 pb-2 pt-1"><span className="text-gray-500">{en ? "IFSC Code:" : "IFSC कोड:"}</span> <strong className="font-mono text-right">{BANK_IFSC}</strong></div>
                          <div className="flex justify-between pt-1"><span className="text-gray-500">{en ? "Bank Name:" : "बैंक का नाम:"}</span> <strong className="text-right">{BANK_NAME}</strong></div>
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-4">{en ? "Please use NEFT/RTGS/IMPS to transfer the amount." : "कृपया राशि ट्रांसफर करने के लिए NEFT/RTGS/IMPS का उपयोग करें।"}</p>
                      </div>

                      {/* UTR Input */}
                      <div className="mb-4">
                        <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Transaction ID / UTR *" : "लेन-देन ID / UTR *"}</label>
                        <input required type="text" value={utrNumber} onChange={e => setUtrNumber(e.target.value)}
                          placeholder={en ? "e.g. 426812345678" : "जैसे. 426812345678"}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none font-mono" />
                        <p className="text-xs text-gray-400 mt-1">{en ? "Found in your bank app under payment history." : "आपके बैंक ऐप में भुगतान इतिहास में मिलेगा।"}</p>
                      </div>

                      {/* Screenshot Upload */}
                      <div className="mb-5">
                        <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Payment Screenshot *" : "भुगतान स्क्रीनशॉट *"}</label>
                        {screenshotPreview ? (
                          <div className="relative">
                            <img src={screenshotPreview} alt="Screenshot preview" className="w-full h-32 object-cover rounded-xl border border-gray-200" />
                            <button type="button" onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); }}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => fileInputRef.current?.click()}
                            className="w-full h-24 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#E8622A] hover:bg-orange-50 transition-all">
                            <Upload className="w-6 h-6 text-[#E8622A]" />
                            <span className="text-sm text-gray-500">{en ? "Click to upload screenshot" : "स्क्रीनशॉट अपलोड करें"}</span>
                          </button>
                        )}
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
                      </div>

                      <button type="submit" disabled={qrSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                        {qrSubmitting ? (en ? "Submitting..." : "सबमिट हो रहा है...") : (en ? "I Have Paid — Submit for Verification" : "मैंने भुगतान किया — सत्यापन के लिए सबमिट करें")}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-3">
                        {en ? "Your payment will be verified by our team within 24 hours." : "आपका भुगतान 24 घंटों के भीतर हमारी टीम द्वारा सत्यापित किया जाएगा।"}
                      </p>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <ProfileCompletionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onComplete={() => {
          setIsModalOpen(false);
          // Allow user to click 'Make a Secure Donation' again manually
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

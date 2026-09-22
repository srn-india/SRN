import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, MapPin, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, 
  Mail, Phone, Lock, QrCode, CreditCard, Upload, X, Clock, 
  IndianRupee, Award, Sparkles, Check, Users, FileText, ChevronRight,
  BadgeCheck, Compass, BookOpen, Layers, Camera, Calendar,
  ChevronDown, Search, KeyRound, Send, RefreshCw, AlertCircle
} from "lucide-react";
import QRCode from "react-qr-code";
import imageCompression from "browser-image-compression";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import ProfileCompletionModal from "../components/ProfileCompletionModal";
import { loadRazorpayScript } from "../utils/razorpay";

const UPI_ID = "sashaktrashtranirman@cbin";
const MEMBER_AMOUNT_QR = 101;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];

const steps = [
  { id: 1, title: "Membership Tier", titleHi: "सदस्यता श्रेणी", icon: Award },
  { id: 2, title: "Details & Role", titleHi: "विवरण व भूमिका", icon: User },
  { id: 3, title: "Confirmation", titleHi: "पुष्टिकरण", icon: ShieldCheck },
];

/**
 * CustomSelect - High-end styled dropdown menu with optional live search,
 * rich subtitle descriptions, checkmark indicators, and click-outside dismissal.
 */
function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  hasError,
  searchable = false,
  searchPlaceholder = "Search...",
  noResultsText = "No options found",
  icon: IconComponent,
  dropUp = false,
  en
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find((opt) => 
    typeof opt === "object" ? opt.value === value : opt === value
  );

  const displayLabel = selectedOption 
    ? (typeof selectedOption === "object" ? selectedOption.label : selectedOption)
    : "";

  const filteredOptions = searchable && searchTerm.trim()
    ? options.filter((opt) => {
        const text = typeof opt === "object" 
          ? `${opt.label} ${opt.value} ${opt.sub || ""}` 
          : opt;
        return text.toLowerCase().includes(searchTerm.toLowerCase().trim());
      })
    : options;

  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: isOpen ? 60 : "auto" }}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchTerm("");
        }}
        className={`w-full px-5 py-3.5 sm:py-4 rounded-2xl bg-white/90 text-[#2C1810] flex items-center justify-between gap-3 text-left shadow-xs backdrop-blur-sm transition-all text-sm sm:text-base cursor-pointer ${
          hasError 
            ? "border-2 border-red-500 ring-2 ring-red-500/20 bg-red-50/50" 
            : isOpen 
              ? "border-2 border-[#E8622A] ring-3 ring-[#E8622A]/15 bg-white shadow-md" 
              : "border border-[#E8D5B8] hover:border-[#E8622A]/60 focus:border-[#E8622A] focus:ring-2 focus:ring-[#E8622A]/20"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {IconComponent && <IconComponent className="w-4 h-4 text-[#E8622A] shrink-0" />}
          {displayLabel ? (
            <span className="font-semibold text-[#2C1810] truncate">
              {displayLabel}
            </span>
          ) : (
            <span className="text-[#B89070] font-normal truncate">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {typeof selectedOption === "object" && selectedOption?.badge && (
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-orange-100 text-[#E8622A]">
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown 
            className={`w-4 h-4 text-[#7A5C45] transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#E8622A]" : ""
            }`} 
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: dropUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            data-lenis-prevent="true"
            className={`absolute z-[100] left-0 right-0 ${
              dropUp ? "bottom-full mb-2 origin-bottom" : "top-full mt-1.5 origin-top"
            } bg-white rounded-2xl shadow-2xl shadow-orange-950/25 border border-[#E8D5B8] overflow-hidden`}
          >
            {searchable && (
              <div className="p-2.5 border-b border-[#E8D5B8]/60 bg-[#FFFDF9] sticky top-0 z-10">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#B89070] absolute left-3 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#E8D5B8] text-xs sm:text-sm text-[#2C1810] placeholder-[#B89070] focus:outline-none focus:border-[#E8622A] focus:ring-1 focus:ring-[#E8622A]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div 
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="max-h-64 overflow-y-auto overscroll-contain p-1.5 space-y-1 divide-y-0 srn-dropdown-scroll"
              style={{
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "contain",
                touchAction: "pan-y"
              }}
            >
              {filteredOptions.length === 0 ? (
                <div className="py-6 px-4 text-center text-xs sm:text-sm text-[#7A5C45] italic">
                  {noResultsText}
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const optValue = typeof opt === "object" ? opt.value : opt;
                  const optLabel = typeof opt === "object" ? opt.label : opt;
                  const optSub = typeof opt === "object" ? opt.sub : null;
                  const optBadge = typeof opt === "object" ? opt.badge : null;
                  const isSelected = optValue === value;

                  return (
                    <div
                      key={optValue}
                      onClick={() => {
                        onChange(optValue);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-gradient-to-r from-orange-100/90 to-amber-50 text-[#E8622A] font-bold shadow-xs" 
                          : "text-[#2C1810] hover:bg-orange-50/70 hover:text-[#E8622A]"
                      }`}
                    >
                      <div className="flex flex-col text-left truncate">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{optLabel}</span>
                          {optBadge && (
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-orange-100 text-[#E8622A] font-bold">
                              {optBadge}
                            </span>
                          )}
                        </div>
                        {optSub && (
                          <span className={`text-[11px] leading-tight mt-0.5 truncate ${
                            isSelected ? "text-[#E8622A]/80 font-normal" : "text-gray-500 font-normal"
                          }`}>
                            {optSub}
                          </span>
                        )}
                      </div>

                      <div className="shrink-0 ml-2">
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#E8622A] text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BecomeMember() {
  const { lang, language } = useLanguage();
  const en = (lang || language || "en") === "en";
  const { user, API_BASE, checkAuth, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Tier selection: "active" (Rashtra Nirman Karta ₹101) or "normal" (Rashtra Mitra ₹0)
  const [membershipTier, setMembershipTier] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ID Card photo upload state
  const [idPhoto, setIdPhoto] = useState(user?.profilePicture || user?.avatar || null);
  const [idPhotoPreview, setIdPhotoPreview] = useState(user?.profilePicture || user?.avatar || "");
  const [idPhotoUploading, setIdPhotoUploading] = useState(false);
  const idPhotoRef = useRef(null);

  // QR / UPI state for Active Membership
  const [paymentTab, setPaymentTab] = useState("upi");
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [qrSubmitting, setQrSubmitting] = useState(false);
  const [qrSubmitted, setQrSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Email OTP verification state
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpMessage, setOtpMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "", 
    lastName: user?.lastName || "", 
    email: user?.email || "", 
    phone: user?.phone || "", 
    gender: user?.gender || "",
    dob: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
    panNumber: user?.panNumber || "",
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
      if (!idPhotoPreview && (user.profilePicture || user.avatar)) {
        setIdPhoto(user.profilePicture || user.avatar);
        setIdPhotoPreview(user.profilePicture || user.avatar);
      }
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || user.firstName || "",
        lastName: prev.lastName || user.lastName || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        gender: prev.gender || user.gender || "",
        dob: prev.dob || (user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ""),
        panNumber: prev.panNumber || user.panNumber || "",
        state: prev.state || user.state || "",
        city: prev.city || user.district || "",
      }));
    }
  }, [user]);

  const handleIdPhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert(en ? "Image is too large! Please upload a file smaller than 5MB." : "छवि बहुत बड़ी है! कृपया 5MB से छोटी फ़ाइल अपलोड करें।");
      return;
    }
    setIdPhotoUploading(true);
    if (errors.idPhoto) {
      setErrors(prev => ({ ...prev, idPhoto: false }));
    }
    try {
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 600, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        setIdPhoto(base64);
        setIdPhotoPreview(base64);
        if (updateProfile) {
          await updateProfile({ profilePicture: base64 });
        }
        setIdPhotoUploading(false);
      };
      reader.readAsDataURL(compressedFile);
    } catch (err) {
      console.error("Error compressing image:", err);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        setIdPhoto(base64);
        setIdPhotoPreview(base64);
        if (updateProfile) {
          await updateProfile({ profilePicture: base64 });
        }
        setIdPhotoUploading(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, email: val }));
    if (isEmailVerified) {
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtpInput("");
      setOtpMessage({ type: "", text: "" });
    }
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: false }));
    }
  };

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      setOtpMessage({
        type: "error",
        text: en ? "Please enter a valid email address first." : "कृपया पहले एक वैध ईमेल पता दर्ज करें।"
      });
      return;
    }

    setOtpSending(true);
    setOtpMessage({ type: "", text: "" });
    try {
      const applicantName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
      const res = await fetch(`${API_BASE}/api/memberships/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          tier: membershipTier,
          name: applicantName || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send verification code");
      }

      setOtpSent(true);
      setOtpTimer(60);
      setOtpMessage({
        type: "success",
        text: en 
          ? `Verification code sent to ${formData.email.trim()} for ${membershipTier === 'active' ? 'Rashtra Nirman Karta' : 'Rashtra Mitra'}` 
          : `${formData.email.trim()} पर ${membershipTier === 'active' ? 'राष्ट्र निर्माण कर्ता' : 'राष्ट्र मित्र'} सत्यापन कोड भेज दिया गया है।`
      });
    } catch (err) {
      setOtpMessage({
        type: "error",
        text: err.message || (en ? "Failed to send OTP. Please try again." : "OTP भेजने में विफल। कृपया पुनः प्रयास करें।")
      });
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setOtpMessage({
        type: "error",
        text: en ? "Please enter the 6-digit OTP code." : "कृपया 6-अंकों का सत्यापन कोड दर्ज करें।"
      });
      return;
    }

    setOtpVerifying(true);
    setOtpMessage({ type: "", text: "" });
    try {
      const res = await fetch(`${API_BASE}/api/memberships/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: otpInput.trim(),
          tier: membershipTier
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid or expired OTP");
      }

      setIsEmailVerified(true);
      setErrors((prev) => ({ ...prev, email: false }));
      setOtpMessage({
        type: "success",
        text: en ? "Email verified successfully!" : "ईमेल सफलतापूर्वक सत्यापित हो गया!"
      });
    } catch (err) {
      setOtpMessage({
        type: "error",
        text: err.message || (en ? "Verification failed. Please check your code." : "सत्यापन विफल। कृपया अपना कोड जांचें।")
      });
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleNext = () => {
    let newErrors = {};
    if (currentStep === 2) {
      if (!formData.firstName) newErrors.firstName = true;
      if (!formData.lastName) newErrors.lastName = true;
      if (!formData.phone) newErrors.phone = true;
      if (!formData.gender) newErrors.gender = true;
      if (!formData.dob) newErrors.dob = true;
      if (!formData.state) newErrors.state = true;
      if (!formData.city) newErrors.city = true;
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        newErrors.email = true;
        setOtpMessage({
          type: "error",
          text: en ? "Please provide a valid email address." : "कृपया एक वैध ईमेल पता दर्ज करें।"
        });
      } else if (!isEmailVerified) {
        newErrors.email = true;
        setOtpMessage({
          type: "error",
          text: en 
            ? "Please verify your email address via OTP before proceeding." 
            : "कृपया आगे बढ़ने से पहले ईमेल पर प्राप्त OTP सत्यापित करें।"
        });
      }

      if (membershipTier === "active" && !idPhoto && !idPhotoPreview && !user?.profilePicture && !user?.avatar) {
        newErrors.idPhoto = true;
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // ── Normal Membership (Free / Info Collection Only) ───────────────────────────
  const handleNormalMemberSubmit = async () => {
    setLoading(true);
    try {
      // 1. Update user profile
      await fetch(`${API_BASE}/api/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || undefined,
          phone: formData.phone,
          gender: formData.gender || undefined,
          dateOfBirth: formData.dob || undefined,
          panNumber: formData.panNumber ? formData.panNumber.toUpperCase().trim() : undefined,
          state: formData.state,
          district: formData.city
        })
      });

      // 2. Activate Normal Membership
      const res = await fetch(`${API_BASE}/api/memberships/register-normal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include",
        body: JSON.stringify({
          state: formData.state,
          district: formData.city,
          profession: formData.profession
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to activate normal membership");
      }

      await checkAuth();
      setSubmitted(true);
    } catch (err) {
      alert("Registration failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Active Membership (Razorpay Online Flow) ─────────────────────────────────
  const handleSubmitRazorpay = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsModalOpen(true);
      return;
    }
    if (!user.profilePicture && !user.avatar && !idPhoto) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/users/profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          state: formData.state,
          district: formData.city,
          ...(idPhoto ? { profilePicture: idPhoto } : {})
        })
      });

      await checkAuth();

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
        description: "Active Membership Registration",
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
            
            if (!verifyRes.ok) throw new Error("Payment verification failed");
            
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
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong during payment/registration.");
      setLoading(false);
    }
  };

  // ── Active Membership (UPI / QR Flow) ─────────────────────────────────────────
  const handleQRMemberSubmit = async () => {
    if (!user) { setIsModalOpen(true); return; }
    if (!user.profilePicture && !user.avatar && !idPhoto) { setIsModalOpen(true); return; }
    if (!utrNumber.trim()) { alert("Please enter your UTR / Transaction ID."); return; }
    if (!screenshotFile) { alert("Please upload your payment screenshot."); return; }
    setQrSubmitting(true);
    try {
      // Sync and persist all user details and ID photo to profile
      await fetch(`${API_BASE}/api/users/profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        credentials: "include",
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || undefined,
          phone: formData.phone,
          gender: formData.gender || undefined,
          dateOfBirth: formData.dob || undefined,
          panNumber: formData.panNumber ? formData.panNumber.toUpperCase().trim() : undefined,
          state: formData.state,
          district: formData.city,
          ...(idPhoto ? { profilePicture: idPhoto } : {})
        })
      });
      if (checkAuth) await checkAuth();

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
        body: JSON.stringify({ 
          amount: MEMBER_AMOUNT_QR, 
          type: "MEMBERSHIP", 
          utrNumber: utrNumber.trim(), 
          screenshot: screenshotUrl,
          purpose: `[ACTIVE MEMBERSHIP] ${formData.firstName} ${formData.lastName} | Phone: ${formData.phone}${formData.panNumber ? ` | PAN: ${formData.panNumber.toUpperCase()}` : ''}${formData.gender ? ` | Gender: ${formData.gender}` : ''} | State: ${formData.state} | District: ${formData.city} | Role: ${formData.interest}`
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

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const getInputClass = (fieldName) => `w-full px-5 py-3.5 sm:py-4 rounded-2xl bg-white/80 text-[#2C1810] placeholder-[#B89070] focus:outline-none focus:ring-2 shadow-xs backdrop-blur-sm transition-all text-sm sm:text-base ${
    errors[fieldName] 
      ? "border-2 border-red-500 focus:ring-red-500/50" 
      : "border border-[#E8D5B8]/90 focus:ring-[#E8622A]/40 focus:border-[#E8622A]"
  }`;
  const labelClass = "block text-xs sm:text-sm font-bold text-[#5C3A1E] uppercase tracking-wider mb-2.5 ml-1";

  return (
    <div className="min-h-screen bg-[#FDF5EC] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 relative overflow-hidden font-sans selection:bg-[#E8622A] selection:text-white">
      {/* Background Glows */}
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
      
      <div className="max-w-5xl xl:max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur-md rounded-full border border-orange-200/80 text-[#E8622A] font-bold text-xs sm:text-sm mb-3 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-[#E8622A]" />
              {en ? "SRN Official Membership Portal" : "सशक्त राष्ट्र निर्माण · आधिकारिक सदस्यता पोर्टल"}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-[#2C1810] mb-2.5 tracking-tight">
              {en ? "Join Our Nation-Building Mission" : "राष्ट्र निर्माण के महाअभियान से जुड़ें"}
            </h1>
            <p className="text-[#7A5C45] text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
              {en 
                ? "Choose your role in nation-building. Lead grassroots change as a Rashtra Nirman Karta or join as a Rashtra Mitra to support our causes." 
                : "राष्ट्र निर्माण में अपनी भूमिका चुनें। राष्ट्र निर्माणकर्ता (सक्रिय सदस्य) के रूप में नेतृत्व करें अथवा राष्ट्र मित्र बनकर अभियानों से जुड़ें।"}
            </p>
          </motion.div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 text-center shadow-2xl border border-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-900/20 rotate-3"
              >
                <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14" />
              </motion.div>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#2C1810] mb-3">
                {en ? "Welcome to the Family!" : "परिवार में आपका स्वागत है!"}
              </h2>
              <p className="text-[#7A5C45] text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                {membershipTier === "normal"
                  ? (en 
                      ? "Your Rashtra Mitra registration is complete! You are now an officially registered member in the SRN movement." 
                      : "आपका राष्ट्र मित्र पंजीकरण सफलतापूर्वक पूरा हो गया है! अब आप SRN आंदोलन के पंजीकृत सदस्य हैं।")
                  : (en 
                      ? "Your Rashtra Nirman Karta membership request has been submitted. Check your dashboard for official status and ID card dispatch." 
                      : "आपकी राष्ट्र निर्माणकर्ता (सक्रिय सदस्यता) का अनुरोध सबमिट हो गया है। आधिकारिक पहचान पत्र व स्टेटस के लिए डैशबोर्ड देखें।")}
              </p>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="px-8 py-3.5 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-xl font-bold text-base shadow-lg shadow-orange-900/20 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                {en ? "Go to Dashboard" : "डैशबोर्ड पर जाएं"}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white relative">
            
            {/* Stepper Header */}
            <div className="bg-white/50 border-b border-[#E8D5B8]/50 py-4 px-6 sm:px-8 relative rounded-t-[2.5rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E8622A]/5 to-transparent" />
              <div className="flex justify-between items-center relative z-10 max-w-2xl mx-auto">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-[#E8D5B8]/30 rounded-full z-0" />
                <motion.div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gradient-to-r from-[#E8622A] to-[#C04A18] rounded-full z-0 shadow-sm origin-left" 
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
                          scale: isActive ? 1.08 : 1,
                          backgroundColor: isActive || isCompleted ? "#E8622A" : "#FFFFFF",
                          color: isActive || isCompleted ? "#FFFFFF" : "#B89070",
                          borderColor: isActive || isCompleted ? "#FFFFFF" : "#E8D5B8"
                        }}
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border-3 shadow-sm transition-colors duration-300 ${isActive ? 'shadow-orange-900/20 ring-2 ring-[#E8622A]/30' : ''}`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </motion.div>
                      <span className={`mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:block transition-colors duration-300 ${isActive || isCompleted ? "text-[#E8622A]" : "text-[#B89070]"}`}>
                        {en ? step.title : step.titleHi}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Body */}
            <div className="p-5 sm:p-7 lg:p-8 bg-white/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="min-h-[600px] lg:min-h-[660px] flex flex-col justify-between"
                >
                  
                  {/* ══════════════════════════════════════════════════════════════
                      STEP 1: MEMBERSHIP TIER (RASHTRA NIRMAN KARTA VS RASHTRA MITRA)
                     ══════════════════════════════════════════════════════════════ */}
                  {currentStep === 1 && (
                    <div className="space-y-5">
                      <div className="text-center sm:text-left mb-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100/90 rounded-full text-[#E8622A] text-xs font-bold mb-2">
                          <Compass className="w-3.5 h-3.5" />
                          {en ? "Step 1 of 3 · Select Your Category" : "कदम 1 · अपनी सदस्यता श्रेणी चुनें"}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#2C1810] font-serif mb-1">
                          {en ? "Choose Your Membership Tier" : "अपनी सदस्यता श्रेणी चुनें"}
                        </h2>
                        <p className="text-[#7A5C45] text-xs sm:text-sm font-medium">
                          {en 
                            ? "Compare privileges below and select how you would like to contribute to the SRN movement." 
                            : "नीचे दोनों श्रेणियों के अधिकारों की तुलना करें और चुनें कि आप संगठन में किस रूप में जुड़ना चाहते हैं।"}
                        </p>
                      </div>

                      {/* Tier Cards Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
                        
                        {/* ── ACTIVE / RASHTRA NIRMAN KARTA CARD ── */}
                        <div 
                          onClick={() => setMembershipTier("active")}
                          className={`relative rounded-3xl p-5 sm:p-6 lg:p-7 transition-all duration-200 cursor-pointer flex flex-col justify-between border-2 ${
                            membershipTier === "active"
                              ? "bg-gradient-to-b from-orange-50/90 via-white to-orange-50/40 border-[#E8622A] shadow-xl shadow-orange-900/10 ring-2 ring-[#E8622A]/20 scale-[1.01]"
                              : "bg-white/80 border-gray-200/90 hover:border-orange-200 hover:shadow-md"
                          }`}
                        >
                          {/* Recommended Ribbon */}
                          <div className="flex items-center justify-between gap-2 mb-3.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider shadow-xs">
                              <Sparkles className="w-3 h-3" />
                              {en ? "Recommended · Leadership Tier" : "सर्वश्रेष्ठ · नेतृत्व स्तर"}
                            </span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              membershipTier === "active" ? "border-[#E8622A] bg-[#E8622A] text-white" : "border-gray-300"
                            }`}>
                              {membershipTier === "active" && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-baseline justify-between mb-1.5">
                              <div>
                                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2C1810]">
                                  {en ? "Rashtra Nirman Karta" : "राष्ट्र निर्माणकर्ता"}
                                </h3>
                                <span className="text-[11px] font-semibold text-[#E8622A] block mt-0.5">
                                  {en ? "Active Leadership Tier" : "सक्रिय नेतृत्व सदस्यता"}
                                </span>
                              </div>
                              <span className="text-lg sm:text-xl font-extrabold text-[#E8622A] font-serif shrink-0 ml-2">
                                ₹{MEMBER_AMOUNT_QR} <span className="text-xs font-normal text-gray-400 line-through">/ ₹999</span>
                              </span>
                            </div>

                            <p className="text-xs text-[#7A5C45] mb-4 leading-relaxed min-h-[34px]">
                              {en 
                                ? "For dedicated members committed to grassroots governance, committee leadership, and executive voting rights." 
                                : "जमीनी सांगठनिक कार्यों, समिति नेतृत्व, निर्णयों में सहभागिता और कार्यकारी अधिकारों हेतु सक्रिय सदस्यता।"}
                            </p>

                            {/* Benefits Checklist */}
                            <div className="space-y-2.5 pt-3.5 border-t border-orange-100/90 text-xs">
                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-[#E8622A] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Post Participation" : "पद एवं दायित्व सहभागिता"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Eligible to apply for and hold organizational posts & committees" : "संगठन के विभिन्न पदों और दायित्वों के लिए पूर्ण पात्रता"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-[#E8622A] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Bridge the Gap" : "प्रशासन व जनता के बीच सेतु"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Direct liaison connecting public issues with administration & ministers" : "जनता की समस्याओं को मंत्रियों व अधिकारियों तक सीधे पहुंचाने का अधिकार"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-[#E8622A] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Direct Engagement" : "शीर्ष नेतृत्व से सीधा संवाद"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Direct strategy meets with national & state leadership" : "राष्ट्रीय एवं प्रांतीय पदाधिकारियों के साथ रणनीतिक बैठकों में उपस्थिति"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-[#E8622A] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Right to Take Decisions" : "निर्णय लेने का अधिकार"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Voting privileges and active participation in regional policy decisions" : "क्षेत्रीय सांगठनिक नीतियों व अभियानों के निर्णयों में मताधिकार"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-[#E8622A] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Official Verified ID Card" : "आधिकारिक पहचान पत्र (ID Card)"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Verified physical & digital SRN ID card with secure QR code" : "QR कोड सत्यापित आधिकारिक डिजिटल व भौतिक पहचान पत्र"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-[#E8622A] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Block to District Level Elevation" : "प्रखंड से जिला व राज्य स्तर पदोन्नति"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Clear advancement from Block (प्रखंड) to District (ज़िला) & State tiers" : "प्रखंड स्तर से जिला एवं प्रदेश स्तर तक नेतृत्व पदोन्नति"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-[#E8622A] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Access Publication & Data" : "सांगठनिक शोध व डेटा तक पहुंच"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Full access to Janmant internal research, field data & policy papers" : "जनमत आंतरिक सर्वेक्षण, नीति पत्र व गोपनीय ग्राउंड रिपोर्ट तक पहुंच"}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 pt-3.5 border-t border-orange-100/90 flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                              membershipTier === "active" 
                                ? "bg-[#E8622A] text-white shadow-xs" 
                                : "text-[#E8622A] bg-orange-100/70 hover:bg-orange-100"
                            }`}>
                              {membershipTier === "active" ? (en ? "✓ Selected Tier" : "✓ चयनित श्रेणी") : (en ? "Select Rashtra Nirman Karta" : "राष्ट्र निर्माणकर्ता चुनें")}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">{en ? "Requires Verification" : "सत्यापन आवश्यक"}</span>
                          </div>
                        </div>

                        {/* ── NORMAL / RASHTRA MITRA CARD ── */}
                        <div 
                          onClick={() => setMembershipTier("normal")}
                          className={`relative rounded-3xl p-5 sm:p-6 lg:p-7 transition-all duration-200 cursor-pointer flex flex-col justify-between border-2 ${
                            membershipTier === "normal"
                              ? "bg-gradient-to-b from-amber-50/70 via-white to-amber-50/30 border-[#D4880C] shadow-xl shadow-amber-900/10 ring-2 ring-[#D4880C]/20 scale-[1.01]"
                              : "bg-white/80 border-gray-200/90 hover:border-amber-200 hover:shadow-md"
                          }`}
                        >
                          {/* Supporter Badge */}
                          <div className="flex items-center justify-between gap-2 mb-3.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 text-amber-800 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider">
                              <Users className="w-3 h-3 text-amber-700" />
                              {en ? "Free · Supporter Tier" : "निःशुल्क · सामान्य समर्थक"}
                            </span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              membershipTier === "normal" ? "border-[#D4880C] bg-[#D4880C] text-white" : "border-gray-300"
                            }`}>
                              {membershipTier === "normal" && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-baseline justify-between mb-1.5">
                              <div>
                                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2C1810]">
                                  {en ? "Rashtra Mitra" : "राष्ट्र मित्र"}
                                </h3>
                                <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">
                                  {en ? "General Supporter Tier" : "सामान्य समर्थक सदस्यता"}
                                </span>
                              </div>
                              <span className="text-lg sm:text-xl font-extrabold text-emerald-700 font-serif shrink-0 ml-2">
                                ₹0 <span className="text-xs font-semibold text-emerald-600">({en ? "Free" : "निःशुल्क"})</span>
                              </span>
                            </div>

                            <p className="text-xs text-[#7A5C45] mb-4 leading-relaxed min-h-[34px]">
                              {en 
                                ? "We only collect basic information. Free community registration to stay connected with nation-building social causes." 
                                : "केवल सामान्य सूचना पंजीकरण। बिना किसी शुल्क के संगठन से जुड़ें और सामाजिक अभियानों की जानकारी प्राप्त करें।"}
                            </p>

                            {/* Benefits Checklist */}
                            <div className="space-y-2.5 pt-3.5 border-t border-amber-100/90 text-xs">
                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "100% Free Registration" : "100% मुफ्त पंजीकरण"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "No fee — simply enter your details to join" : "कोई शुल्क नहीं — बस अपनी जानकारी देकर जुड़ें"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Member Dashboard Access" : "सदस्य डैशबोर्ड पहुंच"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Access your online member account and track initiatives" : "ऑनलाइन सदस्य पोर्टल तक पहुंच और गतिविधियों की जानकारी"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Monthly Newsletter & Circulars" : "मासिक बुलेटिन व नियमित सूचनाएं"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Monthly digest and priority circulars directly on Email & WhatsApp" : "व्हाट्सएप व ईमेल पर संगठन के कार्यों की नियमित जानकारी"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Volunteer in Local Drives" : "स्थानीय सेवा अभियानों में भागीदारी"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Invitations to participate in tree plantation, blood donation & youth camps" : "रक्तदान, वृक्षारोपण व आपदा राहत अभियानों में सहभागिता"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Janmant Reader Access" : "जनमत पत्रिका व लेख पढ़ने की सुविधा"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Free access to read citizen articles, complaints, and public discussions" : "नागरिक पत्रकारिता व जनसमस्याओं के लेख पढ़ने की पूर्ण सुविधा"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Upgrade Anytime" : "कभी भी सक्रिय सदस्यता में अपग्रेड"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Option to upgrade to Rashtra Nirman Karta with official ID Card anytime" : "जब चाहें तब ID कार्ड व नेतृत्व के लिए राष्ट्र निर्माणकर्ता में अपग्रेड करें"}</span>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="text-[#2C1810] block text-xs sm:text-[13px] font-bold leading-snug">{en ? "Dedicated Community Support" : "सदस्य सहायता व संपर्क"}</strong>
                                  <span className="text-gray-500 text-[11px] leading-snug block">{en ? "Direct assistance from the SRN helpdesk for guidance and queries" : "किसी भी जानकारी अथवा मार्गदर्शन हेतु राष्ट्रीय हेल्पडेस्क से सहायता"}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 pt-3.5 border-t border-amber-100/90 flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                              membershipTier === "normal" 
                                ? "bg-[#D4880C] text-white shadow-xs" 
                                : "text-[#D4880C] bg-amber-100/70 hover:bg-amber-100"
                            }`}>
                              {membershipTier === "normal" ? (en ? "✓ Selected Tier" : "✓ चयनित श्रेणी") : (en ? "Select Rashtra Mitra" : "राष्ट्र मित्र चुनें")}
                            </span>
                            <span className="text-[11px] text-emerald-600 font-semibold">{en ? "Instant 1-Click Activation" : "तुरंत 1-क्लिक सक्रियण"}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════════════════════════════════════
                      STEP 2: MEMBER DETAILS & ROLE (PERSONAL + LOCATION + ROLE COMBINED)
                     ══════════════════════════════════════════════════════════════ */}
                  {currentStep === 2 && (
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-100/90 rounded-full text-[#E8622A] text-xs font-bold mb-2.5">
                          <User className="w-4 h-4" />
                          {en ? "Step 2 of 3 · Member Details & Role" : "कदम 2 · व्यक्तिगत विवरण एवं भूमिका"}
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1810] font-serif mb-1.5">
                          {en ? "Member Information & Organizational Role" : "सदस्य विवरण एवं सांगठनिक भूमिका"}
                        </h2>
                        <p className="text-[#7A5C45] text-xs sm:text-sm md:text-base font-medium">
                          {en ? "Please enter your contact details, location, and organizational preferences." : "कृपया आधिकारिक अभिलेखों हेतु अपना संपर्क विवरण, क्षेत्र एवं सांगठनिक रुचि दर्ज करें।"}
                        </p>
                      </div>

                      {/* Form Fields Box */}
                      <div className="bg-[#FDF5EC]/60 p-6 sm:p-8 lg:p-10 rounded-[2.5rem] border border-[#E8D5B8]/70 shadow-xs space-y-6 sm:space-y-7 my-auto">
                        
                        {/* Sub-section 0: Photograph for Official ID Card */}
                        <div className={`p-4 sm:p-5 rounded-2xl bg-white/80 border transition-all shadow-xs flex flex-col sm:flex-row items-center gap-4 sm:gap-6 ${
                          errors.idPhoto ? "border-red-500 ring-2 ring-red-500/20" : "border-[#E8D5B8]/80"
                        }`}>
                          <div className="relative group shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-[#E8622A]/40 bg-orange-50/60 shadow-sm flex items-center justify-center">
                              {idPhotoPreview ? (
                                <img src={idPhotoPreview} alt="ID Card Photo Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                  <User className="w-8 h-8 text-[#E8622A]/60 mb-0.5" />
                                  <span className="text-[10px] font-bold text-[#7A5C45]">{en ? "Passport Photo" : "पासपोर्ट फोटो"}</span>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => idPhotoRef.current?.click()}
                              className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-full shadow-md transition-all cursor-pointer"
                              title={en ? "Upload Photo" : "फोटो अपलोड करें"}
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex-1 text-center sm:text-left space-y-1">
                            <div className="flex items-center justify-center sm:justify-start gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-[#2C1810]">
                                {en ? "Photograph for Official ID Card" : "आधिकारिक पहचान पत्र (ID Card) हेतु फोटो"}
                              </h4>
                              {membershipTier === "active" ? (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-orange-100 text-[#E8622A] rounded-md">
                                  {en ? "Required for ID Card" : "ID कार्ड हेतु आवश्यक"}
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-gray-400">
                                  {en ? "(Optional for Rashtra Mitra)" : "(राष्ट्र मित्र हेतु वैकल्पिक)"}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs text-[#7A5C45] leading-relaxed">
                              {en 
                                ? "Upload a clear passport-style face photo. This will be printed on your verified digital & physical SRN Membership Card." 
                                : "कृपया एक स्पष्ट पासपोर्ट आकार का चेहरा फोटो अपलोड करें। यह आपके अधिकृत SRN ID कार्ड पर मुद्रित होगा।"}
                            </p>
                            {errors.idPhoto && (
                              <p className="text-xs text-red-500 font-semibold">
                                {en ? "⚠️ Please upload a photograph for your official ID card." : "⚠️ कृपया अपने आधिकारिक पहचान पत्र हेतु फोटो अपलोड करें।"}
                              </p>
                            )}
                            <div className="pt-1 flex items-center justify-center sm:justify-start gap-3">
                              <button
                                type="button"
                                onClick={() => idPhotoRef.current?.click()}
                                disabled={idPhotoUploading}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-[#E8622A] font-bold text-xs transition-colors cursor-pointer"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                {idPhotoUploading 
                                  ? (en ? "Processing..." : "प्रोसेसिंग...") 
                                  : idPhotoPreview 
                                    ? (en ? "Change Photo" : "फोटो बदलें") 
                                    : (en ? "Upload Passport Photo" : "पासपोर्ट फोटो अपलोड करें")}
                              </button>
                              {idPhotoPreview && (
                                <button
                                  type="button"
                                  onClick={() => { setIdPhoto(null); setIdPhotoPreview(""); }}
                                  className="text-[11px] text-red-500 hover:underline font-semibold cursor-pointer"
                                >
                                  {en ? "Remove" : "हटाएं"}
                                </button>
                              )}
                            </div>
                          </div>
                          <input 
                            ref={idPhotoRef} 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleIdPhotoChange} 
                          />
                        </div>

                        {/* Sub-section 1: Personal Contact */}
                        <div className="space-y-3.5 pt-2 border-t border-[#E8D5B8]/60">
                          <h3 className="text-xs sm:text-sm font-extrabold text-[#7A5C45] uppercase tracking-wider flex items-center gap-2">
                            <User className="w-4 h-4 text-[#E8622A]" />
                            {en ? "Personal Contact Information" : "व्यक्तिगत संपर्क विवरण"}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <label className={labelClass}>{en ? "First Name" : "पहला नाम"} *</label>
                              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={getInputClass("firstName")} placeholder="Rajesh" />
                            </div>
                            <div>
                              <label className={labelClass}>{en ? "Last Name" : "अंतिम नाम"} *</label>
                              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={getInputClass("lastName")} placeholder="Sharma" />
                            </div>
                            <div>
                              <label className={labelClass}>
                                <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#E8622A]" /> {en ? "Phone Number" : "फ़ोन नंबर"} *</span>
                              </label>
                              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={getInputClass("phone")} placeholder="+91 98765 43210" />
                            </div>
                            {/* Email Address with integrated OTP verification */}
                            <div className="sm:col-span-2 space-y-3 p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#E8D5B8]/80 shadow-xs transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <label className="text-xs sm:text-sm font-bold text-[#2C1810] flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-[#E8622A]" />
                                  <span>{en ? "Email Address (Gmail / Official)" : "ईमेल पता (Gmail / आधिकारिक)"} *</span>
                                </label>
                                {isEmailVerified ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    {en ? "Verified via OTP" : "OTP द्वारा सत्यापित"}
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold text-[#E8622A] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                                    {en ? "OTP Verification Required" : "OTP सत्यापन आवश्यक है"}
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2.5">
                                <div className="relative flex-1">
                                  <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    disabled={isEmailVerified}
                                    onChange={handleEmailChange} 
                                    className={`w-full px-4 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base transition-all ${
                                      isEmailVerified 
                                        ? "bg-emerald-50/60 border-2 border-emerald-400 text-emerald-900 font-semibold" 
                                        : errors.email
                                          ? "border-2 border-red-500 ring-2 ring-red-500/20 bg-red-50/50"
                                          : getInputClass("email")
                                    }`}
                                    placeholder="yourname@gmail.com" 
                                  />
                                </div>

                                {!isEmailVerified ? (
                                  <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={otpSending || otpTimer > 0 || !formData.email}
                                    className={`px-5 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer shrink-0 ${
                                      otpTimer > 0 
                                        ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed" 
                                        : !formData.email 
                                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                          : "bg-[#E8622A] hover:bg-[#C04A18] text-white active:scale-95"
                                    }`}
                                  >
                                    {otpSending ? (
                                      <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{en ? "Sending Code..." : "कोड भेज रहे हैं..."}</span>
                                      </>
                                    ) : otpTimer > 0 ? (
                                      <>
                                        <Clock className="w-4 h-4 text-[#E8622A]" />
                                        <span>{en ? `Resend in ${otpTimer}s` : `${otpTimer}s में पुनः भेजें`}</span>
                                      </>
                                    ) : otpSent ? (
                                      <>
                                        <RefreshCw className="w-4 h-4" />
                                        <span>{en ? "Resend OTP" : "पुनः OTP भेजें"}</span>
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-4 h-4" />
                                        <span>{en ? "Send Verification Code" : "सत्यापन कोड भेजें"}</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsEmailVerified(false);
                                      setOtpSent(false);
                                      setOtpInput("");
                                      setOtpMessage({ type: "", text: "" });
                                    }}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#E8622A] hover:bg-orange-50 border border-orange-200 transition-colors cursor-pointer shrink-0"
                                  >
                                    {en ? "Change Email" : "ईमेल बदलें"}
                                  </button>
                                )}
                              </div>

                              {/* OTP Verification Box */}
                              <AnimatePresence>
                                {otpSent && !isEmailVerified && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-3 border-t border-dashed border-[#E8D5B8] space-y-3"
                                  >
                                    {/* Tier Email Notification Pill */}
                                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/80 text-xs text-[#2C1810]">
                                      {membershipTier === "active" ? (
                                        <>
                                          <Award className="w-4 h-4 text-[#E8622A] shrink-0" />
                                          <span className="font-semibold">
                                            {en 
                                              ? "Sent Rashtra Nirman Karta (Active Member) verification email with official role guidance." 
                                              : "राष्ट्र निर्माण कर्ता (सक्रिय सदस्य) विशेष सत्यापन मेल प्रेषित किया गया है।"}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                                          <span className="font-semibold">
                                            {en 
                                              ? "Sent Rashtra Mitra (Supporter Member) verification email with community welfare details." 
                                              : "राष्ट्र मित्र (सामान्य समर्थक सदस्य) विशेष सत्यापन मेल प्रेषित किया गया है।"}
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                      <div className="relative w-full sm:w-64">
                                        <input
                                          type="text"
                                          maxLength={6}
                                          value={otpInput}
                                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                                          placeholder="123456"
                                          className="w-full text-center tracking-[0.4em] font-mono text-lg font-black py-2.5 px-4 rounded-xl border-2 border-[#E8622A] bg-white focus:outline-none focus:ring-4 focus:ring-[#E8622A]/20"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono">
                                          6-DIGIT
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={otpVerifying || otpInput.length !== 6}
                                        className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                          otpInput.length === 6 && !otpVerifying
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95"
                                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                      >
                                        {otpVerifying ? (
                                          <>
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>{en ? "Verifying..." : "सत्यापित कर रहे हैं..."}</span>
                                          </>
                                        ) : (
                                          <>
                                            <KeyRound className="w-4 h-4" />
                                            <span>{en ? "Verify OTP" : "OTP सत्यापित करें"}</span>
                                          </>
                                        )}
                                      </button>
                                    </div>

                                    <p className="text-[11px] text-[#7A5C45] flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                      {en 
                                        ? "Check your Gmail inbox (including Updates or Spam tab) for the 6-digit code. Valid for 10 minutes." 
                                        : "कृपया 6-अंकों के कोड हेतु अपना Gmail इनबॉक्स (एवं स्पैम फ़ोल्डर) जांचें। कोड 10 मिनट के लिए मान्य है।"}
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Alert / Feedback message */}
                              {otpMessage.text && (
                                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                                  otpMessage.type === "success" 
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                                    : "bg-red-50 text-red-700 border border-red-200"
                                }`}>
                                  {otpMessage.type === "success" ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                  )}
                                  <span>{otpMessage.text}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <label className={labelClass}>{en ? "Gender" : "लिंग"} *</label>
                              <CustomSelect
                                value={formData.gender}
                                onChange={(val) => handleSelectChange("gender", val)}
                                placeholder={en ? "-- Select Gender --" : "-- लिंग चुनें --"}
                                hasError={!!errors.gender}
                                en={en}
                                options={[
                                  { value: "Male", label: en ? "Male" : "पुरुष", badge: en ? "पुरुष" : "Male" },
                                  { value: "Female", label: en ? "Female" : "महिला", badge: en ? "महिला" : "Female" },
                                  { value: "Other", label: en ? "Other" : "अन्य", badge: en ? "अन्य" : "Other" },
                                ]}
                              />
                              {errors.gender && (
                                <span className="text-xs text-red-500 font-semibold mt-1 block">
                                  {en ? "Please select your gender" : "कृपया अपना लिंग चुनें"}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className={labelClass}>
                                <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#E8622A]" /> {en ? "Date of Birth (DOB)" : "जन्म तिथि (DOB)"} *</span>
                              </label>
                              <input 
                                type="date" 
                                name="dob" 
                                value={formData.dob} 
                                max={new Date().toISOString().split('T')[0]} 
                                onChange={handleChange} 
                                className={getInputClass("dob")} 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Sub-section 2: Location & Role */}
                        <div className="border-t border-[#E8D5B8]/60 pt-5 space-y-3.5">
                          <h3 className="text-xs sm:text-sm font-extrabold text-[#7A5C45] uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#E8622A]" />
                            {en ? "Location & Organizational Role" : "स्थान एवं सांगठनिक सहभागिता"}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <label className={labelClass}>{en ? "State / UT" : "राज्य / केंद्र शासित प्रदेश"} *</label>
                              <CustomSelect
                                value={formData.state}
                                onChange={(val) => handleSelectChange("state", val)}
                                placeholder={en ? "-- Select State / UT --" : "-- राज्य / केंद्र शासित प्रदेश चुनें --"}
                                searchable={true}
                                searchPlaceholder={en ? "Type to search state or UT..." : "राज्य या केंद्र शासित प्रदेश खोजें..."}
                                noResultsText={en ? "No state or UT found" : "कोई राज्य या केंद्र शासित प्रदेश नहीं मिला"}
                                hasError={!!errors.state}
                                en={en}
                                options={INDIAN_STATES}
                              />
                              {errors.state && (
                                <span className="text-xs text-red-500 font-semibold mt-1 block">
                                  {en ? "Please select your state or UT" : "कृपया अपना राज्य या केंद्र शासित प्रदेश चुनें"}
                                </span>
                              )}
                            </div>
                            <div>
                              <label className={labelClass}>{en ? "City / District" : "शहर / जिला"} *</label>
                              <input type="text" name="city" value={formData.city} onChange={handleChange} className={getInputClass("city")} placeholder="New Delhi" />
                            </div>
                            <div>
                              <label className={labelClass}>
                                <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-[#E8622A]" /> {en ? "PAN Card Number" : "पैन कार्ड नंबर"}</span>
                              </label>
                              <input 
                                type="text" 
                                name="panNumber" 
                                value={formData.panNumber} 
                                maxLength={10} 
                                onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })} 
                                className={`${getInputClass("panNumber")} font-mono uppercase tracking-wider`} 
                                placeholder="ABCDE1234F" 
                              />
                            </div>
                            <div>
                              <label className={labelClass}>{en ? "Profession / Occupation" : "पेशा / व्यवसाय"}</label>
                              <input type="text" name="profession" value={formData.profession} onChange={handleChange} className={getInputClass("profession")} placeholder={en ? "Teacher, Lawyer, Student, etc." : "अध्यापक, अधिवक्ता, छात्र, आदि"} />
                            </div>
                            <div className="sm:col-span-2">
                              <label className={labelClass}>{en ? "Primary Area of Interest" : "रुचि का मुख्य क्षेत्र"}</label>
                              <CustomSelect
                                value={formData.interest}
                                onChange={(val) => handleSelectChange("interest", val)}
                                placeholder={en ? "-- Select Area of Interest --" : "-- रुचि का क्षेत्र चुनें --"}
                                hasError={false}
                                dropUp={true}
                                en={en}
                                options={[
                                  { 
                                    value: "volunteer", 
                                    label: en ? "Active Grassroots Volunteer" : "सक्रिय जमीनी कार्यकर्ता", 
                                    sub: en ? "On-ground initiatives, relief operations & social welfare drives" : "जमीनी सेवा कार्य, राहत अभियान व सामाजिक कल्याण",
                                    badge: en ? "Grassroots" : "जमीनी"
                                  },
                                  { 
                                    value: "leadership", 
                                    label: en ? "Leadership & Public Policy" : "नेतृत्व व नीति निर्माण", 
                                    sub: en ? "Organizational governance, executive posts & administrative coordination" : "सांगठनिक दायित्व, सुशासन व जनसमस्याओं का समाधान",
                                    badge: en ? "Leadership" : "नेतृत्व"
                                  },
                                  { 
                                    value: "youth", 
                                    label: en ? "Youth Empowerment & Skills" : "युवा सशक्तिकरण व कौशल", 
                                    sub: en ? "Student wing activities, career guidance & digital literacy" : "छात्र विंग, रोजगार मार्गदर्शन व डिजिटल साक्षरता",
                                    badge: en ? "Youth" : "युवा"
                                  },
                                  { 
                                    value: "legal", 
                                    label: en ? "Legal Aid & Citizen Rights" : "विधिक सहायता व नागरिक अधिकार", 
                                    sub: en ? "Public interest advocacy, PIL assistance & constitutional justice" : "जनहित याचिकाएं, निःशुल्क कानूनी सलाह व नागरिक अधिकार",
                                    badge: en ? "Legal" : "विधिक"
                                  },
                                  { 
                                    value: "donor", 
                                    label: en ? "Supporter & Philanthropy" : "समर्थक व परोपकार", 
                                    sub: en ? "Strategic patron, institutional alliances & charitable contributions" : "आर्थिक सहयोग, परोपकारी कार्य व संसाधन प्रबंधन",
                                    badge: en ? "Patron" : "संरक्षक"
                                  },
                                ]}
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* ══════════════════════════════════════════════════════════════
                      STEP 3: CONFIRMATION & ACTIVATION
                     ══════════════════════════════════════════════════════════════ */}
                  {currentStep === 3 && (
                    <div className="space-y-8 flex-1 flex flex-col justify-between">
                      
                      {/* RASHTRA MITRA (NORMAL) CONFIRMATION */}
                      {membershipTier === "normal" ? (
                        <div className="space-y-8 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-3">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              {en ? "Step 3 of 3 · Zero Payment Required" : "कदम 3 · निःशुल्क राष्ट्र मित्र सदस्यता"}
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1810] font-serif mb-2">
                              {en ? "Confirm Free Rashtra Mitra Membership" : "राष्ट्र मित्र सदस्यता पुष्टि"}
                            </h2>
                            <p className="text-[#7A5C45] text-xs sm:text-sm md:text-base font-medium">
                              {en 
                                ? "Review your information. No payment is required — click activate to join immediately." 
                                : "अपने विवरण की समीक्षा करें। कोई शुल्क नहीं है — तुरंत जुड़ने के लिए सक्रिय करें पर क्लिक करें।"}
                            </p>
                          </div>

                          {/* Summary Box */}
                          <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FAF4EE] p-7 sm:p-10 lg:p-12 rounded-[2.5rem] border border-orange-200/80 shadow-xs space-y-7 my-auto">
                            <div className="flex items-center justify-between pb-4 border-b border-orange-100">
                              <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">{en ? "Selected Tier" : "चयनित श्रेणी"}</span>
                              <span className="text-sm sm:text-base font-bold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                                {en ? "Rashtra Mitra (Free Supporter)" : "राष्ट्र मित्र (निःशुल्क)"}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7 text-xs sm:text-sm">
                              <div className="p-4 sm:p-5 bg-white/80 rounded-2xl border border-orange-100/60">
                                <span className="text-gray-400 block mb-1 font-semibold">{en ? "Member Name" : "सदस्य नाम"}:</span>
                                <span className="font-bold text-[#2C1810] text-base">{formData.firstName} {formData.lastName}</span>
                              </div>
                              <div className="p-4 sm:p-5 bg-white/80 rounded-2xl border border-orange-100/60">
                                <span className="text-gray-400 block mb-1 font-semibold">{en ? "Phone Number" : "फ़ोन नंबर"}:</span>
                                <span className="font-bold text-[#2C1810] text-base">{formData.phone}</span>
                              </div>
                              <div className="p-4 sm:p-5 bg-white/80 rounded-2xl border border-orange-100/60">
                                <span className="text-gray-400 block mb-1 font-semibold">{en ? "Email Address" : "ईमेल"}:</span>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-[#2C1810] text-base">{formData.email || (en ? "Not provided" : "उपलब्ध नहीं")}</span>
                                  {isEmailVerified && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      {en ? "OTP Verified" : "OTP सत्यापित"}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="p-4 sm:p-5 bg-white/80 rounded-2xl border border-orange-100/60">
                                <span className="text-gray-400 block mb-1 font-semibold">{en ? "Location & Chapter" : "स्थान व क्षेत्र"}:</span>
                                <span className="font-bold text-[#2C1810] text-base">{formData.city}, {formData.state}</span>
                              </div>
                              <div className="p-4 sm:p-5 bg-white/80 rounded-2xl border border-orange-100/60">
                                <span className="text-gray-400 block mb-1 font-semibold">{en ? "Gender & Date of Birth" : "लिंग व जन्म तिथि"}:</span>
                                <span className="font-bold text-[#2C1810] text-base">{formData.gender || "—"}{formData.dob ? ` · ${formData.dob}` : ""}</span>
                              </div>
                              <div className="p-4 sm:p-5 bg-white/80 rounded-2xl border border-orange-100/60">
                                <span className="text-gray-400 block mb-1 font-semibold">{en ? "PAN Card" : "पैन कार्ड"}:</span>
                                <span className="font-mono font-bold text-[#2C1810] text-base uppercase">{formData.panNumber || (en ? "Not provided" : "उपलब्ध नहीं")}</span>
                              </div>

                              {idPhotoPreview && (
                                <div className="p-4 sm:p-5 bg-white/80 rounded-2xl border border-orange-100/60 flex items-center gap-3.5 sm:col-span-2">
                                  <img src={idPhotoPreview} alt="Member Photo" className="w-12 h-14 object-cover rounded-xl border border-orange-200 shadow-xs shrink-0" />
                                  <div>
                                    <span className="text-gray-400 block mb-0.5 text-xs font-semibold">{en ? "Uploaded Photograph" : "अपलोड की गई फ़ोटो"}:</span>
                                    <span className="font-bold text-[#2C1810] text-xs sm:text-sm">{en ? "Attached for your member record" : "आपके सदस्य रिकॉर्ड में संलग्न"}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Benefits reminder badges */}
                            <div className="pt-2 flex flex-wrap gap-2.5 text-xs sm:text-sm text-emerald-800 font-medium">
                              <span className="px-3.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">✓ Free Member Portal</span>
                              <span className="px-3.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">✓ Janmant Publication Access</span>
                              <span className="px-3.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">✓ Local Drive Invitations</span>
                              <span className="px-3.5 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200">✓ Upgrade Anytime</span>
                            </div>
                          </div>

                          {/* Terms pledge */}
                          <div className="flex items-start gap-3.5 p-5 sm:p-6 bg-white/70 rounded-2xl border border-[#E8D5B8]/70 text-xs sm:text-sm">
                            <input type="checkbox" id="terms-normal" defaultChecked className="mt-1 w-4 h-4 rounded text-[#E8622A] focus:ring-[#E8622A] cursor-pointer" />
                            <label htmlFor="terms-normal" className="text-[#5C3A1E] font-medium leading-relaxed cursor-pointer">
                              {en 
                                ? "I support the vision and constructive goals of Sashakt Rashtra Nirman for national integrity and social welfare." 
                                : "मैं राष्ट्रीय एकता और सामाजिक कल्याण के लिए सशक्त राष्ट्र निर्माण के दृष्टिकोण व लक्ष्यों का पूर्ण समर्थन करता हूं।"}
                            </label>
                          </div>
                        </div>
                      ) : (
                        
                        /* RASHTRA NIRMAN KARTA (ACTIVE) CONFIRMATION & PAYMENT */
                        <div className="space-y-8 flex-1 flex flex-col justify-between">
                          <div className="space-y-5">
                            <div>
                              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-orange-100/90 rounded-full text-[#E8622A] text-xs font-bold mb-3">
                                <Sparkles className="w-4 h-4" />
                                {en ? "Step 3 of 3 · Rashtra Nirman Karta Onboarding" : "कदम 3 · राष्ट्र निर्माणकर्ता सत्यापन व अंशदान"}
                              </div>
                              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C1810] font-serif mb-2">
                                {en ? "Rashtra Nirman Karta Confirmation" : "राष्ट्र निर्माणकर्ता सदस्यता पुष्टिकरण"}
                              </h2>
                              <p className="text-[#7A5C45] text-xs sm:text-sm md:text-base font-medium">
                                {en ? "Complete contribution to issue your official SRN ID Card and leadership credentials." : "आधिकारिक SRN ID कार्ड एवं सांगठनिक अधिकार प्राप्त करने हेतु अंशदान जमा करें।"}
                              </p>
                            </div>

                            {/* Member Summary Card with Official ID Photo */}
                            <div className="flex items-center gap-4 p-4 sm:p-5 bg-gradient-to-r from-orange-50/90 to-[#FFFDF9] rounded-2xl border border-orange-200/90 shadow-xs">
                              {idPhotoPreview ? (
                                <img src={idPhotoPreview} alt="ID Card Candidate" className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-xl border border-orange-300 shadow-xs shrink-0" />
                              ) : (
                                <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-xl bg-orange-100 flex items-center justify-center text-orange-400 font-bold border border-orange-200 text-xs shrink-0">
                                  No Photo
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] sm:text-xs font-extrabold text-[#E8622A] uppercase tracking-wider bg-orange-100/80 px-2.5 py-0.5 rounded-md">
                                    {en ? "Official ID Card Candidate" : "आधिकारिक पहचान पत्र"}
                                  </span>
                                </div>
                                <h4 className="text-sm sm:text-base font-bold text-[#2C1810] truncate">{formData.firstName} {formData.lastName}</h4>
                                <p className="text-xs text-[#7A5C45] truncate">{formData.city ? `${formData.city}, ${formData.state}` : formData.state} · {formData.phone}</p>
                                <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                  {formData.gender ? `${formData.gender}` : ""}{formData.dob ? ` · DOB: ${formData.dob}` : ""}{formData.panNumber ? ` · PAN: ${formData.panNumber.toUpperCase()}` : ""}
                                </p>
                              </div>
                            </div>

                            {/* Payment Method Tabs */}
                            <div className="flex gap-2 bg-gray-100/80 p-1.5 rounded-2xl">
                              <button 
                                type="button" 
                                onClick={() => setPaymentTab("upi")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                  paymentTab === "upi" ? "bg-white shadow-xs text-[#E8622A]" : "text-gray-500 hover:text-gray-800"
                                }`}
                              >
                                <QrCode className="w-4 h-4" />
                                <span>{en ? `Pay via UPI (₹${MEMBER_AMOUNT_QR})` : `UPI / QR (₹${MEMBER_AMOUNT_QR})`}</span>
                              </button>

                              <button 
                                type="button" 
                                disabled={true}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all opacity-50 cursor-not-allowed bg-transparent text-gray-400"
                              >
                                <Lock className="w-4 h-4" />
                                <span>{en ? "Online Gateway (₹999)" : "ऑनलाइन गेटवे (₹999)"}</span>
                              </button>
                            </div>

                            {qrSubmitted ? (
                              <div className="flex flex-col items-center text-center py-10 bg-green-50/70 border border-green-200 rounded-3xl p-6">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                  <Clock className="w-8 h-8" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-[#5C1010] font-serif mb-2">{en ? "Verification Pending" : "सत्यापन लंबित"}</h3>
                                <p className="text-[#7A5C45] max-w-sm text-xs leading-relaxed">
                                  {en 
                                    ? "Your Rashtra Nirman Karta contribution has been submitted! Our verification desk will review your UTR and dispatch your official ID Card to your dashboard & email within 24 hours." 
                                    : "आपका राष्ट्र निर्माणकर्ता अंशदान जमा हो गया है। हमारा सत्यापन डेस्क 24 घंटों में आपका आधिकारिक ID कार्ड जारी करेगा।"}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {/* QR Code Container */}
                                <div className="flex flex-col items-center bg-gradient-to-b from-orange-50/60 to-white border border-orange-200/80 rounded-3xl p-5 text-center">
                                  <p className="text-xs font-bold text-[#5C1010] mb-3">
                                    {en ? `Scan & Pay ₹${MEMBER_AMOUNT_QR} (Nirman Karta Contribution)` : `₹${MEMBER_AMOUNT_QR} स्कैन करें और भुगतान करें (राष्ट्र निर्माणकर्ता अंशदान)`}
                                  </p>
                                  <div className="w-44 h-44 overflow-hidden rounded-2xl border border-orange-200 shadow-xs flex items-center justify-center bg-white p-3">
                                    <QRCode value={`upi://pay?pa=${UPI_ID}&pn=SASHAKT%20RASHTRA%20NIRMAN&am=${MEMBER_AMOUNT_QR}&cu=INR`} size={155} className="w-full h-full" />
                                  </div>
                                  <p className="mt-3 text-xs font-mono font-bold text-[#5C1010]">{UPI_ID}</p>
                                  <p className="text-[11px] text-gray-400 mt-1">{en ? "Supported on Google Pay, PhonePe, Paytm & all UPI apps" : "सभी प्रमुख UPI ऐप्स समर्थित"}</p>
                                </div>

                                {/* UTR Input */}
                                <div>
                                  <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-[#E8622A]" />
                                    {en ? "12-Digit UTR / Transaction ID" : "12-अंकीय UTR / लेन-देन ID"} <span className="text-red-500">*</span>
                                  </label>
                                  <input 
                                    type="text" 
                                    value={utrNumber} 
                                    onChange={e => setUtrNumber(e.target.value)} 
                                    required
                                    placeholder={en ? "e.g. 426812345678" : "जैसे 426812345678"}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none font-mono text-xs" 
                                  />
                                </div>

                                {/* Screenshot Upload */}
                                <div>
                                  <label className="block text-xs font-bold text-[#7A5C45] mb-1.5 uppercase flex items-center gap-1.5">
                                    <Upload className="w-3.5 h-3.5 text-[#E8622A]" />
                                    {en ? "Payment Receipt Screenshot" : "भुगतान रसीद स्क्रीनशॉट"} <span className="text-red-500">*</span>
                                  </label>
                                  {screenshotPreview ? (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200 h-24 bg-black/5">
                                      <img src={screenshotPreview} alt="preview" className="w-full h-full object-cover" />
                                      <button 
                                        type="button" 
                                        onClick={() => { setScreenshotFile(null); setScreenshotPreview(""); }}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow cursor-pointer"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button 
                                      type="button" 
                                      onClick={() => fileInputRef.current?.click()}
                                      className="w-full h-20 border-2 border-dashed border-orange-200 rounded-xl flex items-center justify-center gap-2 hover:border-[#E8622A] hover:bg-orange-50/50 transition-all bg-white cursor-pointer px-4 text-center"
                                    >
                                      <Upload className="w-4 h-4 text-[#E8622A]" />
                                      <span className="text-xs font-semibold text-gray-600">{en ? "Click to upload payment screenshot" : "स्क्रीनशॉट अपलोड करें"}</span>
                                    </button>
                                  )}
                                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshotChange} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Form Navigation Controls */}
              <div className="mt-7 pt-5 border-t border-[#E8D5B8]/60 flex justify-between items-center">
                {currentStep > 1 ? (
                  <button
                    onClick={handlePrev}
                    className="px-5 sm:px-6 py-3 rounded-xl text-[#7A5C45] font-bold hover:bg-white transition-colors flex items-center gap-2 text-sm shadow-xs border border-transparent hover:border-[#E8D5B8]/60 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> {en ? "Back" : "पीछे"}
                  </button>
                ) : <div />}

                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    className="px-6 sm:px-8 py-3.5 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-xl font-bold text-sm shadow-md shadow-orange-900/15 transition-all flex items-center gap-2.5 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>{en ? "Next Step" : "अगला कदम"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : membershipTier === "normal" ? (
                  
                  /* Free Rashtra Mitra Submit Button */
                  <button
                    onClick={handleNormalMemberSubmit}
                    disabled={loading}
                    className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 transition-all flex items-center gap-2.5 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{en ? "Activating Membership..." : "सक्रिय किया जा रहा है..."}</span>
                      </div>
                    ) : (
                      <>
                        <span>{en ? "Activate Free Rashtra Mitra Membership" : "निःशुल्क राष्ट्र मित्र सदस्यता सक्रिय करें"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : paymentTab === "upi" && !qrSubmitted ? (
                  
                  /* Rashtra Nirman Karta QR Submit Button */
                  <button
                    onClick={handleQRMemberSubmit}
                    disabled={qrSubmitting}
                    className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#E8622A] via-[#F48F42] to-[#C04A18] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20 transition-all flex items-center gap-2.5 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  >
                    {qrSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{en ? "Submitting..." : "सबमिट हो रहा है..."}</span>
                      </div>
                    ) : (
                      <>
                        <span>{en ? "I Have Paid — Submit for Verification" : "मैंने भुगतान किया — सत्यापन के लिए सबमिट करें"}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : paymentTab === "upi" && qrSubmitted ? (
                  <span className="text-amber-700 font-semibold text-xs sm:text-sm bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    ✅ {en ? "Submitted! Awaiting admin verification." : "सबमिट हो गया! व्यवस्थापक सत्यापन की प्रतीक्षा है।"}
                  </span>
                ) : (
                  <button
                    onClick={handleSubmitRazorpay}
                    disabled={loading}
                    className="px-6 sm:px-8 py-3.5 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20 transition-all flex items-center gap-2.5 hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (en ? "Opening Gateway..." : "गेटवे खुल रहा है...") : (en ? "Pay & Register" : "भुगतान करें और रजिस्टर करें")}
                    <ArrowRight className="w-4 h-4" />
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
                {en ? "Please wait while we verify your payment and generate your SRN ID Card. Do not close this window." : "कृपया प्रतीक्षा करें जब तक हम आपके भुगतान को सत्यापित करते हैं और आपका SRN ID कार्ड जनरेट करते हैं।"}
             </p>
          </div>
        </div>
      )}
    </div>
  );
}

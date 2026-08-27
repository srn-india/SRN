import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Camera, Mail, Lock, User as UserIcon, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { useAuth } from "../context/AuthContext";

export default function ProfileCompletionModal({ isOpen, onClose, onComplete }) {
  const { user, updateProfile, register, login, verifyOtp } = useAuth();
  const navigate = useNavigate();
  
  // Modes: 'otp', 'profile' (photo upload)
  const [mode, setMode] = useState('profile');
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    otp: ""
  });
  const [error, setError] = useState("");
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (!user) {
        onClose(); // Shouldn't happen with protected routes, but fallback
      } else if (!user.profilePicture && !user.avatar) {
        setMode('profile');
      } else {
        // Already logged in and has photo
        if (onComplete) onComplete();
      }
    }
  }, [isOpen, user, onClose, onComplete]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
      }

      if (result?.requiresOtp) {
        setMode('otp');
      } else if (result?.requires2FA) {
        setError("2FA is not supported in this quick modal. Please use the main login page.");
      } else {
        // Success
        setMode('profile');
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      await verifyOtp(formData.email, formData.otp);
      setMode('profile');
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image is too large! Please upload a file smaller than 5MB.");
        e.target.value = '';
        return;
      }
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 512, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onload = (event) => setProfilePicture(event.target.result);
        reader.readAsDataURL(compressedFile);
        setError("");
      } catch (error) {
        console.error("Error compressing image:", error);
        setError("Failed to process image.");
      }
    }
    e.target.value = '';
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      // If they already have an avatar, they can just continue. Otherwise required.
      if (user?.profilePicture || user?.avatar) {
        if (onComplete) onComplete();
        return;
      }
      setError("Please upload a profile picture.");
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ profilePicture });
      if (onComplete) onComplete();
    } catch (err) {
      setError("Failed to save profile picture.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none transition-colors";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden relative z-10 p-8 border border-gray-100"
        >
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 z-20">
            <X className="w-5 h-5" />
          </button>


          {mode === 'otp' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-[#2C1810]">Verify Email</h2>
                <p className="text-[#7A5C45] text-sm mt-1">Enter the 6-digit OTP sent to {formData.email}</p>
              </div>
              
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <input required type="text" name="otp" maxLength="6" placeholder="Enter OTP" onChange={handleChange} className="w-full text-center tracking-[0.5em] font-mono text-xl py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 outline-none" />
                <button type="submit" disabled={isSaving} className="w-full py-3.5 bg-[#E8622A] text-white rounded-xl font-bold shadow-md hover:bg-[#C04A18] disabled:opacity-70 transition-all">
                  {isSaving ? "Verifying..." : "Verify & Continue"}
                </button>
              </form>
            </div>
          )}

          {mode === 'profile' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-serif text-[#2C1810]">Profile Photo</h2>
                <p className="text-[#7A5C45] text-sm mt-1">Please upload a photo for your ID card.</p>
              </div>
              
              {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">{error}</div>}
              
              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="flex flex-col items-center mb-4">
                  <div 
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-[#E8622A] to-[#C04A18] flex items-center justify-center text-white shadow-lg overflow-hidden border-4 border-white cursor-pointer relative group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {profilePicture || user?.profilePicture || user?.avatar ? (
                      <img src={profilePicture || user?.profilePicture || user?.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold font-serif">{user?.firstName?.charAt(0) || formData.firstName.charAt(0) || 'U'}</span>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
                  <p className="text-xs text-[#7A5C45] mt-3 font-medium">Click to upload photo *</p>
                </div>

                <button type="submit" disabled={isSaving} className="w-full py-3.5 mt-2 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-xl font-bold shadow-md shadow-orange-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {isSaving ? "Saving..." : "Save & Continue"} 
                  {!isSaving && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

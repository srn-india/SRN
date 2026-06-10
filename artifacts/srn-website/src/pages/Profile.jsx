import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, ShieldCheck, Mail, Phone, MapPin, CheckCircle2, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import imageCompression from "browser-image-compression";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Profile() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    state: "",
    district: "",
    profilePicture: "",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        state: user.state || "",
        district: user.district || "",
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF5EC] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8622A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Hard limit check (5MB) before compression
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large! Please upload a file smaller than 5MB.");
        e.target.value = '';
        return;
      }

      try {
        const options = {
          maxSizeMB: 1, // Compress down to 1MB max
          maxWidthOrHeight: 512, // Best size for avatars
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(file, options);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({ ...prev, profilePicture: event.target.result }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to process image.");
      }
    }
    // Clear input so same file can be selected again
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Clean up empty strings to pass backend validation
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );
    
    await updateProfile(cleanedData);
    setIsSaving(false);
    navigate("/dashboard");
  };

  const inputClass = "w-full px-5 py-3.5 rounded-xl bg-white/50 border border-[#E8D5B8]/80 text-[#2C1810] placeholder-[#B89070] focus:outline-none focus:ring-2 focus:ring-[#E8622A]/50 focus:border-[#E8622A] shadow-sm backdrop-blur-sm transition-all";
  const labelClass = "block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="h-[calc(100vh-80px)] min-h-[600px] bg-[#FDF5EC] relative overflow-hidden font-sans selection:bg-[#E8622A] selection:text-white flex items-center justify-center">
      {/* Static Background Decorators */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#E8622A]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-[#D4880C]/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%232C1810' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col h-full py-4 sm:py-6">
        <motion.div className="mb-4 flex-shrink-0" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A5C45] hover:text-[#E8622A] transition-all duration-300 group bg-white/40 px-5 py-2.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md hover:bg-white/80 hover:shadow-md w-max">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div 
          className="flex-grow flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Profile Picture & Info (Independent Components) */}
          <div className="lg:w-[35%] flex flex-col items-center justify-center gap-6 z-10 w-full">
            <motion.div variants={itemVariants} className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#E8622A] to-[#C04A18] flex items-center justify-center text-white shadow-2xl overflow-hidden border-[6px] border-white/90 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 relative">
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-7xl font-bold font-serif">{formData.firstName?.charAt(0) || 'U'}</span>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <div className="absolute bottom-2 right-2 bg-[#E8622A] rounded-full p-3 shadow-xl border-4 border-white text-white hover:bg-[#C04A18] transition-colors z-20">
                <Camera className="w-6 h-6" />
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white/70 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-lg border border-white w-full text-center mt-2">
              <h1 className="text-3xl font-bold font-serif text-[#2C1810] tracking-tight">
                {formData.firstName || "Update"} {formData.lastName || "Profile"}
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full">
              <div className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2C1810] to-[#4A281A] text-white px-5 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-wide shadow-lg border border-[#4A281A]">
                <ShieldCheck className="w-5 h-5 text-[#E8D5B8]" />
                {user.role || 'Member'}
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md border-2 border-[#E8D5B8]/80 text-[#7A5C45] px-5 py-3.5 rounded-2xl text-sm font-bold shadow-lg">
                <MapPin className="w-5 h-5 text-[#E8622A]" />
                {formData.state || 'India'}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form Card */}
          <motion.div variants={itemVariants} className="lg:w-[65%] w-full p-8 sm:p-10 flex flex-col justify-center bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-xl border border-white">
            <h2 className="text-2xl font-bold text-[#2C1810] font-serif mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-[#E8622A]" />
              Account Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="First name" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Last name" />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>
                    <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Address</span>
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="Email" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>
                    <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone Number</span>
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Phone number" />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} placeholder="State" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>District / City</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClass} placeholder="District" />
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="pt-6 mt-4 border-t border-[#E8D5B8]/40 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-10 py-3.5 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#E8622A] to-[#D4880C] hover:from-[#D4880C] hover:to-[#E8622A] disabled:opacity-50 shadow-lg shadow-orange-900/20 transition-all w-full sm:w-auto"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, ShieldCheck, Mail, Phone, MapPin, CheckCircle2, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, profilePicture: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
    // Clear input so same file can be selected again
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(formData);
    setSuccessMsg("Profile updated successfully!");
    setIsSaving(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const inputClass = "w-full px-5 py-3.5 rounded-xl bg-white/50 border border-[#E8D5B8]/80 text-[#2C1810] placeholder-[#B89070] focus:outline-none focus:ring-2 focus:ring-[#E8622A]/50 focus:border-[#E8622A] shadow-sm backdrop-blur-sm transition-all";
  const labelClass = "block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#FDF5EC] relative overflow-x-clip font-sans selection:bg-[#E8622A] selection:text-white pb-12">
      {/* Static Background Decorators (Removed heavy blur animation for smooth scroll performance) */}
      <div 
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#E8622A]/15 rounded-full blur-[100px] pointer-events-none" 
      />
      <div 
        className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-[#D4880C]/15 rounded-full blur-[80px] pointer-events-none" 
      />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%232C1810' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-4xl mx-auto px-6 py-10 relative z-10">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A5C45] hover:text-[#E8622A] transition-all duration-300 group bg-white/40 px-5 py-2.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md hover:bg-white/80 hover:shadow-md w-max"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div 
          className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/80 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Banner */}
          <div className="relative h-48 sm:h-64 bg-gradient-to-br from-[#2C1810] via-[#4A281A] to-[#E8622A] overflow-hidden">
            <div className="absolute inset-0 bg-[url('/logo.PNG')] bg-center bg-no-repeat opacity-5 blur-sm" style={{ backgroundSize: '150%' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          {/* Profile Picture & Name */}
          <div className="px-8 sm:px-12 relative pb-8 border-b border-[#E8D5B8]/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20 sm:-mt-16 mb-4 relative z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-[#E8622A] to-[#C04A18] flex items-center justify-center text-white shadow-2xl overflow-hidden border-[6px] border-white/90 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 relative">
                    {formData.profilePicture ? (
                      <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl font-bold font-serif">{formData.firstName?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                  
                  {/* Single Camera Upload Badge with Orange Background */}
                  <div className="absolute bottom-2 right-2 bg-[#E8622A] rounded-full p-2.5 shadow-lg border-[3px] border-white text-white hover:bg-[#C04A18] transition-colors z-20">
                    <Camera className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="text-center sm:text-left pb-2">
                <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#2C1810] tracking-tight">
                  {formData.firstName || "Update"} {formData.lastName || "Profile"}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2C1810] text-white text-xs font-bold rounded-lg uppercase tracking-wide shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E8D5B8]" />
                    {user.role || 'Member'}
                  </span>
                  <span className="text-sm font-medium text-[#7A5C45] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {formData.state || 'India'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12 bg-white/30">
            <h2 className="text-xl font-bold text-[#2C1810] font-serif mb-8 flex items-center gap-3">
              <User className="w-5 h-5 text-[#E8622A]" />
              Account Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="bg-[#FDF5EC]/50 p-6 rounded-[2rem] border border-[#E8D5B8]/50 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className={labelClass}>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="Enter your first name" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className={labelClass}>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Enter your last name" />
                  </motion.div>
                </div>
              </div>

              <div className="bg-[#FDF5EC]/50 p-6 rounded-[2rem] border border-[#E8D5B8]/50 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Address</span>
                    </label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="Enter your email" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone Number</span>
                    </label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Enter your phone number" />
                  </motion.div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} placeholder="E.g. Maharashtra" />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className={labelClass}>District / City</label>
                    <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClass} placeholder="E.g. Mumbai" />
                  </motion.div>
                </div>
              </div>

              <motion.div variants={itemVariants} className="pt-6 border-t border-[#E8D5B8]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-green-600 font-bold max-w-sm text-center sm:text-left h-5">
                  {successMsg}
                </p>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white text-sm bg-[#E8622A] hover:bg-[#C04A18] disabled:opacity-50 shadow-md shadow-orange-900/20 transition-all"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </motion.div>

            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

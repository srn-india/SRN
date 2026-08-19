import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Camera } from "lucide-react";
import imageCompression from "browser-image-compression";
import { useAuth } from "../context/AuthContext";

export default function ProfileCompletionModal({ isOpen, onClose, onComplete }) {
  const { user, updateProfile } = useAuth();
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large! Please upload a file smaller than 5MB.");
        e.target.value = '';
        return;
      }

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 512,
          useWebWorker: true,
        };
        
        const compressedFile = await imageCompression(file, options);
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfilePicture(event.target.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to process image.");
      }
    }
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profilePicture) {
      alert("Please upload a profile picture.");
      return;
    }

    setIsSaving(true);
    await updateProfile({ profilePicture });
    setIsSaving(false);
    
    if (onComplete) {
      onComplete();
    }
  };

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

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-serif text-[#2C1810]">Profile Photo</h2>
            <p className="text-[#7A5C45] text-sm mt-1">Please upload a photo for your ID card.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center mb-4">
              <div 
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[#E8622A] to-[#C04A18] flex items-center justify-center text-white shadow-lg overflow-hidden border-4 border-white cursor-pointer relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePicture || user?.profilePicture ? (
                  <img src={profilePicture || user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold font-serif">{user?.firstName?.charAt(0) || 'U'}</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-10 h-10 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
              <p className="text-xs text-[#7A5C45] mt-3 font-medium">Click to upload photo *</p>
            </div>

            <button 
              type="submit"
              disabled={isSaving || !profilePicture}
              className="w-full py-3.5 mt-2 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-xl font-bold shadow-md shadow-orange-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save & Continue"} 
              {!isSaving && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileCompletionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-[100] p-4 pointer-events-none flex items-end justify-end">
        
        <motion.div
          initial={{ opacity: 0, x: 50, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden relative z-10 p-6 border border-gray-100 pointer-events-auto"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 shrink-0 bg-orange-50 rounded-full flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-[#E8622A]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-[#2C1810]">Action Required</h2>
              <p className="text-[#7A5C45] text-xs">Profile completion needed.</p>
            </div>
          </div>
          
          <p className="text-[#7A5C45] text-sm mb-6 leading-relaxed">
            Please complete your profile and upload a profile picture before proceeding.
          </p>

          <Link 
            to="/profile"
            className="w-full py-3 bg-[#E8622A] hover:bg-[#C04A18] text-white rounded-xl font-bold text-sm shadow-md shadow-orange-900/20 transition-all flex items-center justify-center gap-2"
          >
            Go to Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

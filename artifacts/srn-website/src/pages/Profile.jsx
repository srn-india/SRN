import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF5EC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E8622A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#FEF0E6] border border-[#E8D5B8] focus:outline-none text-[#2C1810] placeholder-[#B89070] opacity-80 cursor-not-allowed";
  const labelClass = "block text-sm font-semibold text-[#5C3A1E] mb-1.5";

  return (
    <div className="min-h-screen bg-[#FDF5EC] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-medium text-[#7A5C45] hover:text-[#E8622A] transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to Dashboard
          </Link>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl shadow-sm border border-[#E8D5B8] overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-8 border-b border-[#E8D5B8] bg-gradient-to-r from-orange-50 to-white flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#E8622A] flex items-center justify-center text-white shadow-lg">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-[#2C1810]">
                {user.firstName} {user.lastName}
              </h1>
              <span className="inline-block mt-2 px-3 py-1 bg-[#2C1810] text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                {user.role || 'Member'}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-lg font-bold text-[#2C1810] mb-6">Personal Information</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>First Name</label>
                  <input type="text" className={inputClass} value={user.firstName || ''} readOnly />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" className={inputClass} value={user.lastName || ''} readOnly />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className={labelClass}>Email Address</label>
                <input type="email" className={inputClass} value={user.email || ''} readOnly />
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4 border-t border-[#E8D5B8]">
                <p className="text-sm text-[#7A5C45]">
                  Profile updating will be available soon. For now, you can view your details above.
                </p>
                <button 
                  type="button" 
                  disabled
                  className="mt-4 px-6 py-3 rounded-xl font-semibold text-white text-sm bg-[#E8D5B8] cursor-not-allowed"
                >
                  Save Changes
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

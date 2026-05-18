import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User, Activity, Bell, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
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

  if (!user) return null; // Let the useEffect redirect

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FDF5EC] p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#2C1810]">
              Welcome back, {user.firstName}
            </h1>
            <p className="text-[#7A5C45] mt-2">Here's an overview of your account.</p>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8D5B8] text-[#2C1810] rounded-xl hover:bg-[#FEF0E6] transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-[#E8622A] text-white rounded-xl hover:bg-[#C04A18] transition-colors shadow-sm shadow-orange-900/20"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Membership Status */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5B8]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#E8622A]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#2C1810]">Membership</h2>
            </div>
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <p className="text-[#7A5C45] mb-4">No active membership</p>
              <button className="text-sm font-medium text-[#E8622A] hover:text-[#C04A18]">
                Upgrade now &rarr;
              </button>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5B8] md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#E8622A]">
                <Activity className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#2C1810]">Recent Activity</h2>
            </div>
            <div className="py-12 flex flex-col items-center justify-center text-center bg-[#FDF5EC]/50 rounded-xl border border-dashed border-[#E8D5B8]">
              <p className="text-[#7A5C45] text-sm">No recent activity to display.</p>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D5B8] md:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#E8622A]">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-[#2C1810]">Notifications</h2>
            </div>
            <div className="py-8 flex flex-col items-center justify-center text-center bg-[#FDF5EC]/50 rounded-xl border border-dashed border-[#E8D5B8]">
              <p className="text-[#7A5C45] text-sm">You have no new notifications.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

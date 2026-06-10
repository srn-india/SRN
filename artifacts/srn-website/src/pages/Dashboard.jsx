import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { LogOut, User, Activity, Bell, CreditCard, ArrowLeft, Heart, Calendar, MessageSquare, ChevronRight, Settings, Star, TrendingUp, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Dashboard() {
  const { user, loading, logout, API_BASE } = useAuth();
  const navigate = useNavigate();
  const [membership, setMembership] = useState(null);

  const fetchMembership = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/membership`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data?.data) setMembership(data.data);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (user && API_BASE) {
      fetchMembership();
    }
  }, [user, API_BASE]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FDF5EC] relative overflow-x-clip font-sans selection:bg-[#E8622A] selection:text-white">
      {/* Static Background Decorators (Removed heavy blur animation for smooth scroll performance) */}
      <div 
        className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#E8622A]/15 rounded-full blur-[100px] pointer-events-none" 
      />
      <div 
        className="absolute top-64 -left-32 w-[400px] h-[400px] bg-[#D4880C]/15 rounded-full blur-[80px] pointer-events-none" 
      />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%232C1810' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-10">
        
        {/* Top Header & Back */}
        <motion.div 
          className="flex justify-between items-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A5C45] hover:text-[#E8622A] transition-all duration-300 group bg-white/40 px-5 py-2.5 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md hover:bg-white/80 hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/40 border border-white/60 text-[#2C1810] rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm backdrop-blur-md font-semibold text-sm group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </motion.div>

        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          
          {/* Main Content Area (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero / Greeting Card */}
            <motion.div variants={itemVariants} className="relative overflow-hidden bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-white/80 shadow-sm group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E8622A]/10 to-transparent rounded-bl-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 relative z-10">
                <Link to="/profile" className="relative group/avatar cursor-pointer block">
                  <div className="absolute inset-0 bg-[#E8622A] rounded-full blur-md opacity-20 group-hover/avatar:opacity-40 group-hover/avatar:scale-110 transition-all duration-300" />
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#E8622A] to-[#C04A18] flex items-center justify-center text-white shadow-xl overflow-hidden border-[4px] border-white relative z-10">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
                    ) : (
                      <span className="text-4xl sm:text-5xl font-bold font-serif">{user.firstName?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-[#E8D5B8] text-[#E8622A] group-hover/avatar:bg-[#E8622A] group-hover/avatar:text-white transition-colors z-20">
                    <Settings className="w-4 h-4" />
                  </div>
                </Link>
                
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Active Account
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-bold font-serif text-[#2C1810] tracking-tight">
                    Hello, {user.firstName}
                  </h1>
                  <p className="text-[#7A5C45] mt-2 text-base sm:text-lg max-w-md">
                    Here's what's happening with your contributions and community engagement today.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Impact & Stats Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8622A]/10 flex items-center justify-center text-[#E8622A]">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2C1810] font-serif">Impact Score</h3>
                </div>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-bold text-[#E8622A]">120</span>
                  <span className="text-[#7A5C45] font-medium pb-1">points</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#E8622A] to-[#C04A18]" 
                    initial={{ width: 0 }}
                    animate={{ width: "40%" }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-[#7A5C45] mt-3 font-medium">80 points until next tier (Silver)</p>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-8 border border-white/80 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2C1810] font-serif">Contributions</h3>
                </div>
                <div className="flex justify-between items-center bg-[#FDF5EC]/50 p-4 rounded-xl border border-dashed border-[#E8D5B8] mb-3">
                  <span className="text-sm font-semibold text-[#5C3A1E]">Events Attended</span>
                  <span className="text-lg font-bold text-[#2C1810]">0</span>
                </div>
                <div className="flex justify-between items-center bg-[#FDF5EC]/50 p-4 rounded-xl border border-dashed border-[#E8D5B8]">
                  <span className="text-sm font-semibold text-[#5C3A1E]">Total Donations</span>
                  <span className="text-lg font-bold text-[#2C1810]">₹0</span>
                </div>
              </div>

            </motion.div>

            {/* Premium Quick Actions */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-[#2C1810] font-serif mb-6 pl-2">Quick Access</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Heart, label: "Donate", desc: "Support cause", to: "/donate", gradient: "from-rose-400 to-rose-600" },
                  { icon: Calendar, label: "Events", desc: "Join rallies", to: "/events", gradient: "from-blue-400 to-blue-600" },
                  { icon: MessageSquare, label: "Forums", desc: "Discussions", to: "/forums", gradient: "from-emerald-400 to-emerald-600" },
                  { icon: Activity, label: "Initiatives", desc: "Our work", to: "/initiatives", gradient: "from-amber-400 to-orange-500" },
                ].map((action) => (
                  <Link key={action.to} to={action.to} className="group relative bg-white/60 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <action.icon className="w-16 h-16 text-gray-900" />
                    </div>
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-[#2C1810]">{action.label}</h3>
                    <p className="text-xs text-[#7A5C45] font-medium mt-1">{action.desc}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
            
          </div>

          {/* Right Sidebar (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Digital ID Card (Membership) */}
            <motion.div variants={itemVariants} className="group relative perspective-1000">
              <div className="relative w-full rounded-[2rem] bg-gradient-to-br from-[#2C1810] via-[#3A2015] to-[#1E0F05] p-8 shadow-2xl overflow-hidden border border-[#5C3A1E] transition-transform duration-500 group-hover:rotate-x-2 group-hover:rotate-y-[-2deg]">
                {/* Holographic reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 ease-in-out pointer-events-none" />
                
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <img src="/logo.PNG" alt="Logo" className="w-12 h-12 object-contain opacity-80" />
                  <ShieldCheck className="w-8 h-8 text-[#E8D5B8]" />
                </div>
                
                <div className="relative z-10">
                  <h4 className="text-[#E8D5B8]/60 text-xs font-bold uppercase tracking-widest mb-1">SRN Member ID</h4>
                  <p className="text-2xl font-bold font-serif text-white tracking-widest mb-8">
                    {membership ? (
                      membership.id.split('-')[0].length >= 6 
                        ? membership.id.split('-')[0].toUpperCase().slice(0, 2) + '****' + membership.id.split('-')[0].toUpperCase().slice(-2)
                        : membership.id.split('-')[0].toUpperCase()
                    ) : '**** **** ----'}
                  </p>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-[#E8D5B8]/60 text-[10px] font-bold uppercase tracking-wider mb-1">Card Holder</h4>
                      <p className="text-white font-medium text-sm">{user.firstName} {user.lastName}</p>
                      {membership?.endDate && (
                        <p className="text-[#E8D5B8]/50 text-[10px] mt-1">
                          Valid till {new Date(membership.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                    <div>
                      {membership?.status === 'ACTIVE' ? (
                        <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold">
                          INACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {membership?.status === 'ACTIVE' ? (
                <div className="mt-4 flex items-center justify-center w-full px-5 py-3.5 bg-green-50 border border-green-200 rounded-[1.25rem] text-green-700 font-bold gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Active Member
                </div>
              ) : (
                <Link to="/become-member" className="mt-4 flex items-center justify-center w-full px-5 py-3.5 bg-white border border-[#E8D5B8] rounded-[1.25rem] text-[#E8622A] font-bold hover:bg-[#FEF0E6] transition-colors shadow-sm gap-2">
                  Activate Membership
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </motion.div>

            {/* Notifications / News */}
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-md rounded-[2rem] p-7 border border-white/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2C1810] font-serif flex items-center gap-3">
                  <Bell className="w-5 h-5 text-[#E8622A]" />
                  Latest News
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#E8622A] animate-ping" />
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "National Rally Announced", date: "Today, 10:00 AM", isNew: true },
                  { title: "Membership Drive 2026", date: "Yesterday, 2:30 PM", isNew: false },
                  { title: "New Initiative: Clean India", date: "May 25, 2026", isNew: false },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-white/50 border border-white hover:bg-white transition-colors cursor-pointer group">
                    <div className="flex-1">
                      <h4 className={`text-sm font-bold ${item.isNew ? 'text-[#2C1810]' : 'text-[#5C3A1E]'} group-hover:text-[#E8622A] transition-colors`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#7A5C45] mt-1">{item.date}</p>
                    </div>
                    {item.isNew && (
                      <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md text-[10px] font-bold h-fit">NEW</span>
                    )}
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 text-sm font-semibold text-[#E8622A] hover:text-[#C04A18]">
                View All Updates &rarr;
              </button>
            </motion.div>
            
          </div>

        </motion.div>
      </div>
    </div>
  );
}

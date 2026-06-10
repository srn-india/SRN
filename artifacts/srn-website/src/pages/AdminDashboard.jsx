import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, LogOut, UserCircle, Calendar, MessageSquare, 
  ShieldCheck, CheckCircle2, XCircle, Plus, Trash2, ShieldAlert,
  Settings, Sliders, Bell, LayoutDashboard, Key, TrendingUp, Download, MapPin
} from "lucide-react";
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const fadeVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

export default function AdminDashboard() {
  const { user, logout, API_BASE, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // 2FA Setup State
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [setupSuccess, setSetupSuccess] = useState("");

  const handleSetup2FA = async () => {
    setSetupLoading(true);
    setSetupError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/2fa/setup`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to initiate 2FA setup");
      setQrCodeUrl(data.data.qrCodeUrl);
    } catch (err) {
      setSetupError(err.message);
    } finally {
      setSetupLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (tokenInput.length !== 6) return;
    setSetupLoading(true);
    setSetupError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/2fa/enable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: tokenInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid token");
      setSetupSuccess("2FA enabled successfully!");
      setQrCodeUrl(null);
      await checkAuth(); // Refresh user data to update `isTwoFactorEnabled`
    } catch (err) {
      setSetupError(err.message);
    } finally {
      setSetupLoading(false);
    }
  };

  // --- MOCK DATA ---
  const [events, setEvents] = useState([
    { id: 1, title: "National Peace Rally 2026", date: "May 25, 2026", location: "New Delhi" },
    { id: 2, title: "Youth Empowerment Summit", date: "June 10, 2026", location: "Mumbai" },
    { id: 3, title: "Clean India Drive", date: "June 15, 2026", location: "Bangalore" },
  ]);

  const [forums, setForums] = useState([
    { id: 1, title: "Strategies for Rural Development", posts: 142 },
    { id: 2, title: "Educational Reforms Discussion", posts: 89 },
    { id: 3, title: "Youth Participation in Politics", posts: 215 },
  ]);

  const [pendingUsers, setPendingUsers] = useState([
    { id: 101, name: "Rahul Sharma", email: "rahul.s@example.com", date: "2026-05-27" },
    { id: 102, name: "Priya Patel", email: "priya.p@example.com", date: "2026-05-28" },
    { id: 103, name: "Amit Kumar", email: "amit.k@example.com", date: "2026-05-29" },
  ]);

  // --- HANDLERS ---
  const handleDeleteEvent = (id) => setEvents(events.filter(e => e.id !== id));
  const handleDeleteForum = (id) => setForums(forums.filter(f => f.id !== id));
  const handleApproveUser = (id) => setPendingUsers(pendingUsers.filter(u => u.id !== id));
  const handleDeclineUser = (id) => setPendingUsers(pendingUsers.filter(u => u.id !== id));

  const TABS = [
    { id: "profile", label: "Admin Profile", icon: UserCircle },
    { id: "events", label: "Manage Events", icon: Calendar },
    { id: "forums", label: "Manage Forums", icon: MessageSquare },
    { id: "approvals", label: "Approve IDs", icon: ShieldCheck },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FDF5EC] relative overflow-x-clip font-sans selection:bg-[#E8622A] selection:text-white pb-20">
      {/* Static Background Decorators */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#E8622A]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-64 -left-32 w-[400px] h-[400px] bg-[#D4880C]/15 rounded-full blur-[80px] pointer-events-none" />
      
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
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/40 border border-white/60 text-[#2C1810] rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm backdrop-blur-md font-semibold text-sm group"
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <motion.div 
            className="lg:col-span-3 space-y-2"
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            <div className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] border border-white/80 shadow-sm flex flex-col gap-2">
              <div className="px-4 py-3 mb-2 border-b border-gray-100 flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#E8622A]" />
                <h2 className="font-serif font-bold text-lg text-[#2C1810]">Admin Panel</h2>
              </div>
              
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-sm w-full ${
                      isActive 
                        ? "bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white shadow-md shadow-orange-900/20 translate-x-1" 
                        : "text-[#7A5C45] hover:bg-white hover:text-[#2C1810] hover:shadow-sm"
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#E8622A]"}`} />
                    {tab.label}
                    {tab.id === "approvals" && pendingUsers.length > 0 && (
                      <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? "bg-white text-[#E8622A]" : "bg-[#E8622A] text-white"
                      }`}>
                        {pendingUsers.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              
              {/* ADMIN PROFILE TAB */}
              {activeTab === "profile" && (
                <motion.div key="profile" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-white/80 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E8622A]/10 to-transparent rounded-bl-full pointer-events-none opacity-50" />
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E8622A] to-[#C04A18] flex items-center justify-center text-white shadow-xl overflow-hidden border-[4px] border-white">
                        <span className="text-4xl font-bold font-serif">A</span>
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8622A]/10 border border-[#E8622A]/20 text-[#E8622A] rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                          <ShieldCheck className="w-3 h-3" />
                          System Administrator
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#2C1810]">
                          Admin Portal
                        </h1>
                        <p className="text-[#7A5C45] mt-1 text-base">
                          Manage platform content, oversee forums, and approve new member registrations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/80 shadow-sm">
                      <Calendar className="w-8 h-8 text-blue-500 mb-4" />
                      <h3 className="text-2xl font-bold text-[#2C1810]">{events.length}</h3>
                      <p className="text-sm text-[#7A5C45] font-semibold">Active Events</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/80 shadow-sm">
                      <MessageSquare className="w-8 h-8 text-emerald-500 mb-4" />
                      <h3 className="text-2xl font-bold text-[#2C1810]">{forums.length}</h3>
                      <p className="text-sm text-[#7A5C45] font-semibold">Active Forums</p>
                    </div>
                    <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/80 shadow-sm">
                      <UserCircle className="w-8 h-8 text-rose-500 mb-4" />
                      <h3 className="text-2xl font-bold text-[#2C1810]">{pendingUsers.length}</h3>
                      <p className="text-sm text-[#7A5C45] font-semibold">Pending Approvals</p>
                    </div>
                  </div>

                  <div className="mt-8 bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                      <LayoutDashboard className="w-32 h-32 text-gray-900" />
                    </div>
                    <h3 className="text-xl font-bold font-serif text-[#2C1810] mb-6 flex items-center gap-2 relative z-10">
                      <Sliders className="w-5 h-5 text-[#E8622A]" />
                      Quick Admin Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                      {[
                        { label: "New Event", icon: Plus, bg: "bg-blue-50/80", border: "border-blue-100", text: "text-blue-600" },
                        { label: "Analytics", icon: TrendingUp, bg: "bg-emerald-50/80", border: "border-emerald-100", text: "text-emerald-600" },
                        { label: "User Roles", icon: ShieldAlert, bg: "bg-purple-50/80", border: "border-purple-100", text: "text-purple-600" },
                        { label: "Export Data", icon: Download, bg: "bg-amber-50/80", border: "border-amber-100", text: "text-amber-600" },
                      ].map((action, i) => (
                        <div key={i} className={`p-5 rounded-[1.5rem] border ${action.border} ${action.bg} shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 backdrop-blur-sm`}>
                          <div className={`p-3 rounded-full bg-white shadow-sm ${action.text}`}>
                            <action.icon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-sm text-[#2C1810]">{action.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MANAGE EVENTS TAB */}
              {activeTab === "events" && (
                <motion.div key="events" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2C1810] font-serif">Manage Events</h2>
                      <p className="text-sm text-[#7A5C45] mt-1">Add or remove upcoming rallies and events.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all">
                      <Plus className="w-4 h-4" /> Add Event
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-white/60 to-white/30 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E8622A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex flex-col items-center justify-center border border-orange-200 text-[#E8622A] shadow-inner">
                            <span className="text-[10px] font-bold uppercase leading-none mt-1">{event.date.split(" ")[0]}</span>
                            <span className="text-lg font-black leading-none mt-0.5">{event.date.split(" ")[1].replace(',', '')}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C1810] text-lg group-hover:text-[#E8622A] transition-colors">{event.title}</h4>
                            <div className="flex gap-4 text-xs text-[#7A5C45] font-medium mt-1">
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#E8622A]" /> {event.location}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm font-bold border border-red-100 hover:border-red-500 shadow-sm relative z-10"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    ))}
                    {events.length === 0 && (
                      <div className="text-center py-10 text-[#7A5C45]">No active events. Add one above!</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* MANAGE FORUMS TAB */}
              {activeTab === "forums" && (
                <motion.div key="forums" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2C1810] font-serif">Manage Forums</h2>
                      <p className="text-sm text-[#7A5C45] mt-1">Add or remove discussion topics.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all">
                      <Plus className="w-4 h-4" /> Add Forum
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {forums.map((forum) => (
                      <div key={forum.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-white/60 to-white/30 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E8622A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex flex-col items-center justify-center border border-blue-200 text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C1810] text-lg group-hover:text-[#E8622A] transition-colors">{forum.title}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold tracking-wide uppercase">Active</span>
                              <span className="text-xs text-[#7A5C45] font-medium flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {forum.posts} discussions</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteForum(forum.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm font-bold border border-red-100 hover:border-red-500 shadow-sm relative z-10"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    ))}
                    {forums.length === 0 && (
                      <div className="text-center py-10 text-[#7A5C45]">No active forums.</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* APPROVE IDS TAB */}
              {activeTab === "approvals" && (
                <motion.div key="approvals" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
                  <div className="mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-[#2C1810] font-serif flex items-center gap-2">
                      Approve IDs
                      <span className="bg-[#E8622A] text-white text-sm px-2 py-0.5 rounded-full">{pendingUsers.length}</span>
                    </h2>
                    <p className="text-sm text-[#7A5C45] mt-1">Review pending member registrations to generate their digital IDs.</p>
                  </div>
                  
                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <div key={user.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gradient-to-r from-white/60 to-white/30 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">
                          <ShieldCheck className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="relative">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-[#E8622A] font-bold text-xl border-2 border-white shadow-sm group-hover:shadow-md transition-shadow">
                              {user.name.charAt(0)}
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 border-2 border-white rounded-full shadow-sm animate-pulse" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C1810] text-lg">{user.name}</h4>
                            <p className="text-xs text-[#7A5C45] font-medium">{user.email}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-wider">Applied: {user.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                          <button 
                            onClick={() => handleApproveUser(user.id)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl transition-all hover:scale-105 hover:shadow-emerald-500/30 hover:shadow-lg text-sm font-bold border border-emerald-400"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </button>
                          <button 
                            onClick={() => handleDeclineUser(user.id)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl transition-all text-sm font-bold shadow-sm"
                          >
                            <XCircle className="w-4 h-4" /> Decline
                          </button>
                        </div>
                      </div>
                    ))}
                    {pendingUsers.length === 0 && (
                      <div className="text-center py-16 flex flex-col items-center">
                        <ShieldCheck className="w-16 h-16 text-green-400 mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-[#2C1810]">All caught up!</h3>
                        <p className="text-[#7A5C45]">There are no pending ID approvals.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === "settings" && (
                <motion.div key="settings" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
                  <div className="mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-[#2C1810] font-serif flex items-center gap-3">
                      <div className="p-2 bg-[#E8622A]/10 rounded-xl">
                        <Settings className="w-6 h-6 text-[#E8622A]" />
                      </div>
                      Platform Settings
                    </h2>
                    <p className="text-sm text-[#7A5C45] mt-2">Configure global platform preferences, security, and administrative access.</p>
                  </div>
                  
                  <div className="space-y-8">
                    {/* Security Section */}
                    <div>
                      <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2 mb-4">
                        <Key className="w-5 h-5 text-gray-400" /> Security & Access
                      </h3>
                      <div className="bg-white/50 p-6 rounded-2xl border border-white space-y-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 group">
                          <div>
                            <h4 className="font-semibold text-[#2C1810] group-hover:text-[#E8622A] transition-colors">Two-Factor Authentication</h4>
                            <p className="text-xs text-[#7A5C45] mt-0.5">Protect your admin account with an authenticator app</p>
                          </div>
                          
                          {user?.isTwoFactorEnabled ? (
                            <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Enabled
                            </div>
                          ) : (
                            <button 
                              onClick={handleSetup2FA}
                              disabled={setupLoading}
                              className="px-4 py-2 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
                            >
                              Setup 2FA
                            </button>
                          )}
                        </div>

                        {/* 2FA Setup Flow */}
                        {qrCodeUrl && !user?.isTwoFactorEnabled && (
                          <div className="mt-4 p-5 bg-orange-50 border border-orange-100 rounded-xl">
                            <h5 className="font-bold text-[#2C1810] mb-2">Scan QR Code</h5>
                            <p className="text-xs text-[#7A5C45] mb-4">Open Google Authenticator or Authy and scan this code:</p>
                            <img src={qrCodeUrl} alt="2FA QR Code" className="w-32 h-32 rounded-lg border border-gray-200 mb-4" />
                            
                            <label className="block text-xs font-bold text-[#2C1810] mb-1">Enter 6-digit code</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={tokenInput} 
                                onChange={e => setTokenInput(e.target.value)}
                                maxLength={6}
                                className="w-32 px-3 py-2 rounded-lg border border-gray-300 focus:border-[#E8622A] outline-none"
                                placeholder="123456"
                              />
                              <button 
                                onClick={handleEnable2FA}
                                disabled={setupLoading || tokenInput.length !== 6}
                                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold disabled:opacity-50"
                              >
                                {setupLoading ? "Verifying..." : "Verify & Enable"}
                              </button>
                            </div>
                            {setupError && <p className="text-xs text-red-500 mt-2 font-bold">{setupError}</p>}
                          </div>
                        )}
                        {setupSuccess && <p className="text-sm text-emerald-600 font-bold mt-2">{setupSuccess}</p>}
                        
                        <div className="w-full h-px bg-gray-100" />
                        <div className="flex justify-between items-center group">
                          <div>
                            <h4 className="font-semibold text-[#2C1810] group-hover:text-[#E8622A] transition-colors">Maintenance Mode</h4>
                            <p className="text-xs text-[#7A5C45] mt-0.5">Temporarily disable public access</p>
                          </div>
                          <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer shadow-inner transition-transform hover:scale-105">
                            <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-md" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notifications Section */}
                    <div>
                      <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-gray-400" /> Notification Preferences
                      </h3>
                      <div className="bg-white/50 p-6 rounded-2xl border border-white space-y-6 shadow-sm">
                        <div className="flex justify-between items-center group">
                          <div>
                            <h4 className="font-semibold text-[#2C1810] group-hover:text-[#E8622A] transition-colors">New Registration Alerts</h4>
                            <p className="text-xs text-[#7A5C45] mt-0.5">Receive an email when a new ID is pending</p>
                          </div>
                          <div className="w-12 h-6 bg-gradient-to-r from-[#E8622A] to-[#C04A18] rounded-full relative cursor-pointer shadow-inner transition-transform hover:scale-105">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md" />
                          </div>
                        </div>
                        <div className="w-full h-px bg-gray-100" />
                        <div className="flex justify-between items-center group">
                          <div>
                            <h4 className="font-semibold text-[#2C1810] group-hover:text-[#E8622A] transition-colors">Weekly Digest</h4>
                            <p className="text-xs text-[#7A5C45] mt-0.5">Summary of platform activities</p>
                          </div>
                          <div className="w-12 h-6 bg-gradient-to-r from-[#E8622A] to-[#C04A18] rounded-full relative cursor-pointer shadow-inner transition-transform hover:scale-105">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
}

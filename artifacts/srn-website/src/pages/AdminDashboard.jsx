import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import { 
  ArrowLeft, LogOut, UserCircle, Calendar, MessageSquare, 
  ShieldCheck, CheckCircle2, XCircle, Plus, Trash2, ShieldAlert,
  Settings, Sliders, Bell, LayoutDashboard, Key, TrendingUp, Download, MapPin,
  BookOpen, AlertCircle, Briefcase, FileText, X, Eye, GraduationCap, Heart, CalendarDays, User, Users, RotateCw
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
  const navigate = useNavigate();
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

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', location: '', date: '', image: null });

  const [forums, setForums] = useState([]);
  const [loadingForums, setLoadingForums] = useState(true);
  const [showForumModal, setShowForumModal] = useState(false);
  const [newForum, setNewForum] = useState({ title: '', content: '', image: null });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ events, forums, adminComplaints, applications }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `srn_platform_data_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const [pendingUsers, setPendingUsers] = useState([
    { id: 101, name: "Rahul Sharma", email: "rahul.s@example.com", date: "2026-05-27" },
    { id: 102, name: "Priya Patel", email: "priya.p@example.com", date: "2026-05-28" },
    { id: 103, name: "Amit Kumar", email: "amit.k@example.com", date: "2026-05-29" },
  ]);

  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const [adminComplaints, setAdminComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  const [memberships, setMemberships] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(true);
  const [membershipPage, setMembershipPage] = useState(1);
  const [membershipTotalPages, setMembershipTotalPages] = useState(1);

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    if (activeTab === "complaints") fetchComplaints();
    if (activeTab === "articles") fetchArticles();
    if (activeTab === "events") fetchEvents();
    if (activeTab === "forums") fetchForums();
    if (activeTab === "memberships") fetchMemberships(membershipPage);
  }, [activeTab]);

  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const res = await fetch(`${API_BASE}/api/complaints`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setAdminComplaints(data.data.map(c => ({
          id: c.id,
          ticket: c.ticket,
          subject: c.subject,
          description: c.description,
          phone: c.phone,
          email: c.email,
          state: c.state,
          fileUrl: c.fileUrl,
          applicant: c.user ? `${c.user.firstName || ''} ${c.user.lastName || ''}`.trim() : c.fullName,
          date: new Date(c.createdAt).toLocaleDateString(),
          category: c.category,
          status: c.status
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const res = await fetch(`${API_BASE}/api/articles`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setArticles(data.data.map(art => ({
          id: art.id,
          title: art.title,
          author: art.authorName,
          date: new Date(art.createdAt).toLocaleDateString(),
          category: art.articleCategory,
          status: art.status
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchComplaints();
    fetchArticles();
    fetchApplications();
    fetchEvents();
    fetchForums();
    fetchMemberships();
  }, [API_BASE]);

  const fetchApplications = async () => {
    setLoadingApplications(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setApplications(data.data.map(app => ({
          ...app,
          date: new Date(app.createdAt).toLocaleDateString()
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApplications(false);
    }
  };

  // --- HANDLERS ---
  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch(`${API_BASE}/api/events`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setEvents(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchForums = async () => {
    setLoadingForums(true);
    try {
      const res = await fetch(`${API_BASE}/api/forum/threads`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) setForums(data.data.threads || data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForums(false);
    }
  };

  const fetchMemberships = async (page = 1) => {
    setLoadingMemberships(true);
    try {
      const res = await fetch(`${API_BASE}/api/memberships?page=${page}&limit=10`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setMemberships(data.data.memberships || []);
        setMembershipPage(data.data.pagination.page);
        setMembershipTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMemberships(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/analytics`, { credentials: 'include' });
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleExportMemberships = () => {
    if (memberships.length === 0) return;

    // Calculate total revenue (999 per membership)
    const activeCount = memberships.filter(m => m.status === 'ACTIVE').length;
    const totalCount = memberships.length;
    const totalRevenue = totalCount * 999;

    // Build CSV content
    const headers = ["Member Name", "Email", "Plan", "Start Date", "End Date", "Status", "Revenue (INR)"];
    const rows = memberships.map(m => [
      m.user ? `"${m.user.firstName || ''} ${m.user.lastName || ''}"`.trim() : "Unknown User",
      m.user?.email || "N/A",
      m.plan,
      new Date(m.startDate).toLocaleDateString(),
      new Date(m.endDate).toLocaleDateString(),
      m.status,
      "999"
    ]);

    // Append summary rows
    rows.push([]);
    rows.push(["Summary Details"]);
    rows.push(["Total Registered Members", totalCount]);
    rows.push(["Active Members", activeCount]);
    rows.push(["Total Revenue Generated (INR)", totalRevenue]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `srn_membership_revenue_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', newEvent.title);
      formData.append('description', newEvent.description);
      formData.append('location', newEvent.location);
      formData.append('date', newEvent.date);
      if (newEvent.image) formData.append('image', newEvent.image);

      const res = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (res.ok) {
        setShowEventModal(false);
        setNewEvent({ title: '', description: '', location: '', date: '', image: null });
        fetchEvents();
      } else {
        const errorData = await res.json();
        alert(`Failed to create event: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert(`Exception: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/events/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        fetchEvents();
      } else {
        const errorData = await res.json();
        alert(`Failed to delete event: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', newForum.title);
      formData.append('content', newForum.content);
      if (newForum.image) formData.append('image', newForum.image);

      const res = await fetch(`${API_BASE}/api/forum/threads`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      if (res.ok) {
        setShowForumModal(false);
        setNewForum({ title: '', content: '', image: null });
        fetchForums();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteForum = async (id) => {
    if (!window.confirm("Are you sure you want to delete this forum thread?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/forum/threads/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        fetchForums();
      } else {
        const errorData = await res.json();
        alert(`Failed to delete forum: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete forum.");
    }
  };
  const handleApproveUser = (id) => setPendingUsers(pendingUsers.filter(u => u.id !== id));
  const handleDeclineUser = (id) => setPendingUsers(pendingUsers.filter(u => u.id !== id));

  const handleApproveArticle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}/approve`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (res.ok) {
        setArticles(articles.map(art => art.id === id ? { ...art, status: "Approved" } : art));
      }
    } catch (error) {
      console.error('Error approving article:', error);
    }
  };
  
  const handleDeleteArticle = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setArticles(articles.filter(art => art.id !== id));
      }
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleSolveComplaint = async (id) => {
    try {
      await fetch(`${API_BASE}/api/complaints/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Solved' })
      });
      setAdminComplaints(adminComplaints.map(comp => comp.id === id ? { ...comp, status: "Solved" } : comp));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComplaint = async (id) => {
    try {
      await fetch(`${API_BASE}/api/complaints/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setAdminComplaints(adminComplaints.filter(comp => comp.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveApplication = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        setApplications(applications.map(app => app.id === id ? { ...app, status: "Approved" } : app));
      }
    } catch (err) { console.error(err); }
  };

  const handleRejectApplication = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        setApplications(applications.map(app => app.id === id ? { ...app, status: "Rejected" } : app));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteApplication = async (id) => {
    if (!window.confirm("Delete this application forever?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setApplications(applications.filter(app => app.id !== id));
      }
    } catch (err) { console.error(err); }
  };

  const TABS = [
    { id: "profile", label: "Admin Profile", icon: UserCircle },
    { id: "events", label: "Manage Events", icon: Calendar },
    { id: "forums", label: "Manage Forums", icon: MessageSquare },
    { id: "articles", label: "Manage Articles", icon: BookOpen },
    { id: "complaints", label: "Manage Complaints", icon: AlertCircle },
    { id: "applications", label: "Post Applications", icon: Briefcase },
    { id: "approvals", label: "Approve IDs", icon: ShieldCheck },
    { id: "memberships", label: "Manage Memberships", icon: Users },
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
                      <h3 className="text-2xl font-bold text-[#2C1810]">
                        {adminComplaints.filter(c => c.status === "PENDING").length}
                      </h3>
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
                        { label: "New Event", icon: Plus, bg: "bg-blue-50/80", border: "border-blue-100", text: "text-blue-600", onClick: () => { setActiveTab("events"); setShowEventModal(true); } },
                        { label: "Analytics", icon: TrendingUp, bg: "bg-emerald-50/80", border: "border-emerald-100", text: "text-emerald-600", onClick: () => setShowAnalyticsModal(true) },
                        { label: "User Roles", icon: ShieldAlert, bg: "bg-purple-50/80", border: "border-purple-100", text: "text-purple-600", onClick: () => setActiveTab("approvals") },
                        { label: "Grievances", icon: AlertCircle, bg: "bg-amber-50/80", border: "border-amber-100", text: "text-amber-600", onClick: () => setActiveTab("complaints") },
                      ].map((action, i) => (
                        <div key={i} onClick={action.onClick} className={`p-5 rounded-[1.5rem] border ${action.border} ${action.bg} shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all flex flex-col items-center justify-center gap-3 backdrop-blur-sm`}>
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
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={fetchEvents}
                        disabled={loadingEvents}
                        className="flex items-center justify-center p-2.5 bg-white text-[#7A5C45] hover:text-[#E8622A] rounded-xl border border-gray-200 hover:border-orange-200 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                        title="Reload Events"
                      >
                        <RotateCw className={`w-4 h-4 ${loadingEvents ? "animate-spin" : ""}`} />
                      </button>
                      <button onClick={() => setShowEventModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all">
                        <Plus className="w-4 h-4" /> Add Event
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-white/60 to-white/30 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E8622A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-5 relative z-10">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex flex-col items-center justify-center border border-orange-200 text-[#E8622A] shadow-inner">
                            <span className="text-[10px] font-bold uppercase leading-none mt-1">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-lg font-black leading-none mt-0.5">{new Date(event.date).getDate()}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C1810] text-lg group-hover:text-[#E8622A] transition-colors">{event.title}</h4>
                            <div className="flex gap-4 text-xs text-[#7A5C45] font-medium mt-1">
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#E8622A]" /> {event.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                          <button 
                            onClick={() => navigate(`/admin/events/${event.id}`)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#E8622A] rounded-xl hover:bg-[#E8622A] hover:text-white transition-all text-sm font-bold border border-orange-100 hover:border-[#E8622A] shadow-sm"
                          >
                            <Users className="w-4 h-4" /> Attendees
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm font-bold border border-red-100 hover:border-red-500 shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
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
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={fetchForums}
                        disabled={loadingForums}
                        className="flex items-center justify-center p-2.5 bg-white text-[#7A5C45] hover:text-[#E8622A] rounded-xl border border-gray-200 hover:border-orange-200 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                        title="Reload Forums"
                      >
                        <RotateCw className={`w-4 h-4 ${loadingForums ? "animate-spin" : ""}`} />
                      </button>
                      <button onClick={() => setShowForumModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all">
                        <Plus className="w-4 h-4" /> Add Forum
                      </button>
                    </div>
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

              {/* MANAGE ARTICLES TAB */}
              {activeTab === "articles" && (
                <motion.div key="articles" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
                  <div className="mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2C1810] font-serif flex items-center gap-2">
                        Manage Submitted Articles
                        <span className="bg-[#E8622A] text-white text-sm px-2 py-0.5 rounded-full">{articles.length}</span>
                      </h2>
                      <p className="text-sm text-[#7A5C45] mt-1">Review articles submitted via the "Janmant: Aap Ki Aawaz" portal.</p>
                    </div>
                    <button 
                      onClick={fetchArticles}
                      disabled={loadingArticles}
                      className="flex items-center justify-center p-2.5 bg-white text-[#7A5C45] hover:text-[#E8622A] rounded-xl border border-gray-200 hover:border-orange-200 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                      title="Reload Articles"
                    >
                      <RotateCw className={`w-4 h-4 ${loadingArticles ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {articles.map((art) => (
                      <div key={art.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gradient-to-r from-white/60 to-white/30 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden text-left">
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-[#E8622A] shrink-0 mt-1">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C1810] text-base group-hover:text-[#E8622A] transition-colors">{art.title}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#7A5C45] mt-1">
                              <span className="font-semibold text-xs text-[#1E0F05]">Author: {art.author}</span>
                              <span>Category: {art.category}</span>
                              <span>Date: {art.date}</span>
                            </div>
                            <div className="mt-2.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                art.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              }`}>
                                {art.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
                          <button 
                            onClick={() => navigate(`/admin-dashboard/article/${art.id}`)}
                            className="px-4 py-2 bg-white text-[#2C1810] rounded-xl text-xs font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                          >
                            View Details
                          </button>
                          {art.status === "PENDING" && (
                            <button 
                              onClick={() => handleApproveArticle(art.id)}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-xs font-bold border border-emerald-400 hover:scale-105 transition-all shadow"
                            >
                              Approve
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteArticle(art.id)}
                            className="px-4 py-2 bg-white text-red-500 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-50 transition-all shadow-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {articles.length === 0 && (
                      <div className="text-center py-10 text-[#7A5C45]">No articles submitted.</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* MANAGE COMPLAINTS TAB */}
              {activeTab === "complaints" && (
                <motion.div key="complaints" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
                  <div className="mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2C1810] font-serif flex items-center gap-2">
                        Manage Complaints
                        <span className="bg-[#E8622A] text-white text-sm px-2 py-0.5 rounded-full">{adminComplaints.length}</span>
                      </h2>
                      <p className="text-sm text-[#7A5C45] mt-1">Review public complaints registered via the "Jan Shikayat" portal.</p>
                    </div>
                    <button 
                      onClick={fetchComplaints}
                      disabled={loadingComplaints}
                      className="flex items-center justify-center p-2.5 bg-white text-[#7A5C45] hover:text-[#E8622A] rounded-xl border border-gray-200 hover:border-orange-200 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                      title="Reload Complaints"
                    >
                      <RotateCw className={`w-4 h-4 ${loadingComplaints ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {adminComplaints.map((comp) => (
                      <div key={comp.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gradient-to-r from-white/60 to-white/30 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden text-left">
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0 mt-1">
                            <AlertCircle className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold bg-[#E8622A]/10 text-[#E8622A] px-2 py-0.5 rounded-md border border-[#E8622A]/20">
                                {comp.ticket}
                              </span>
                              <span className="text-xs text-[#7A5C45] font-semibold">{comp.date}</span>
                            </div>
                            <h4 className="font-bold text-[#2C1810] text-base mt-2">{comp.subject}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#7A5C45] mt-1">
                              <span className="font-semibold text-xs text-[#1E0F05]">Applicant: {comp.applicant}</span>
                              <span>Category: {comp.category}</span>
                            </div>
                            <div className="mt-2.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                comp.status === "RESOLVED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                              }`}>
                                {comp.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
                          <button 
                            onClick={() => navigate(`/admin-dashboard/complaint/${comp.id}`)}
                            className="px-4 py-2 bg-white text-[#2C1810] rounded-xl text-xs font-bold border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
                          >
                            View Details
                          </button>
                          {comp.status === "PENDING" && (
                            <button 
                              onClick={() => handleSolveComplaint(comp.id)}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-xs font-bold border border-emerald-400 hover:scale-105 transition-all shadow"
                            >
                              Mark Solved
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteComplaint(comp.id)}
                            className="px-4 py-2 bg-white text-red-500 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-50 transition-all shadow-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {adminComplaints.length === 0 && (
                      <div className="text-center py-10 text-[#7A5C45]">No complaints registered.</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* POST APPLICATIONS TAB */}
              {activeTab === "applications" && (
                <motion.div key="applications" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
                  <div className="mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2C1810] font-serif flex items-center gap-2">
                        Manage Post Applications
                        <span className="bg-[#E8622A] text-white text-sm px-2 py-0.5 rounded-full">{applications.length}</span>
                      </h2>
                      <p className="text-sm text-[#7A5C45] mt-1">Review applicant submissions for organizational roles.</p>
                    </div>
                    <button 
                      onClick={fetchApplications}
                      disabled={loadingApplications}
                      className="flex items-center justify-center p-2.5 bg-white text-[#7A5C45] hover:text-[#E8622A] rounded-xl border border-gray-200 hover:border-orange-200 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                      title="Reload Applications"
                    >
                      <RotateCw className={`w-4 h-4 ${loadingApplications ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-gradient-to-r from-white/60 to-white/30 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group relative overflow-hidden text-left">
                        <div className="flex items-start gap-4 relative z-10">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0 mt-1">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[#2C1810] text-base">{app.fullName}</h4>
                            <p className="text-xs text-[#E8622A] font-bold mt-0.5">{app.appliedPosition}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#7A5C45] mt-1.5">
                              <span>Mobile: {app.phone}</span>
                              <span>Applied: {app.date}</span>
                              {app.resumeUrl && (
                                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                  View Resume
                                </a>
                              )}
                            </div>
                            <div className="mt-2.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                app.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
                                app.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 relative z-10 shrink-0">
                          <button 
                            onClick={() => navigate(`/admin-dashboard/application/${app.id}`)}
                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-all shadow-sm flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </button>
                          {app.status === "PENDING" && (
                            <button 
                              onClick={() => handleApproveApplication(app.id)}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-xs font-bold border border-emerald-400 hover:scale-105 transition-all shadow"
                            >
                              Approve
                            </button>
                          )}
                          {app.status !== "REJECTED" && (
                            <button 
                              onClick={() => handleRejectApplication(app.id)}
                              className="px-4 py-2 bg-white text-[#7A5C45] rounded-xl text-xs font-bold border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                            >
                              Reject
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteApplication(app.id)}
                            className="px-4 py-2 bg-white text-red-500 rounded-xl text-xs font-bold border border-red-100 hover:bg-red-50 transition-all shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <div className="text-center py-10 text-[#7A5C45]">No applications found.</div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* MANAGE MEMBERSHIPS TAB */}
              {activeTab === "memberships" && (
                <motion.div key="memberships" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm text-left">
                  <div className="mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2C1810] font-serif flex items-center gap-2">
                        Manage Memberships
                        <span className="bg-[#E8622A] text-white text-sm px-2 py-0.5 rounded-full">{memberships.length}</span>
                      </h2>
                      <p className="text-sm text-[#7A5C45] mt-1">View and manage user membership subscriptions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleExportMemberships}
                        disabled={loadingMemberships || memberships.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                        title="Export Memberships Report"
                      >
                        <Download className="w-4 h-4" /> Export Report
                      </button>
                      <button 
                        onClick={() => { fetchMemberships(membershipPage); fetchAnalytics(); }}
                        disabled={loadingMemberships}
                        className="flex items-center justify-center p-2.5 bg-white text-[#7A5C45] hover:text-[#E8622A] rounded-xl border border-gray-200 hover:border-orange-200 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                        title="Reload Memberships"
                      >
                        <RotateCw className={`w-4 h-4 ${loadingMemberships ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>
                  
                  {loadingMemberships ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#E8622A]" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Revenue & Member Metrics Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/60 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/80 shadow-sm">
                          <span className="text-xs text-[#7A5C45] font-semibold uppercase tracking-wider block mb-1">Active Subscriptions</span>
                          <span className="text-2xl font-bold text-emerald-600">{analytics?.totalMembers || 0}</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/80 shadow-sm">
                          <span className="text-xs text-[#7A5C45] font-semibold uppercase tracking-wider block mb-1">Membership Revenue</span>
                          <span className="text-2xl font-bold text-[#E8622A]">₹{analytics?.membershipRevenue || 0}</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/80 shadow-sm">
                          <span className="text-xs text-[#7A5C45] font-semibold uppercase tracking-wider block mb-1">Donation Revenue</span>
                          <span className="text-2xl font-bold text-[#E8622A]">₹{analytics?.donationRevenue || 0}</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/80 shadow-sm">
                          <span className="text-xs text-[#7A5C45] font-semibold uppercase tracking-wider block mb-1">Total Revenue</span>
                          <span className="text-2xl font-bold text-blue-600">₹{analytics?.totalRevenue || 0}</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded-2xl border border-white/80 shadow-sm bg-white/30">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-orange-50 to-orange-100/50 text-[#7A5C45] font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                              <th className="px-6 py-4">Member Name</th>
                              <th className="px-6 py-4">Email</th>
                              <th className="px-6 py-4">Plan</th>
                              <th className="px-6 py-4">Duration</th>
                              <th className="px-6 py-4">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                            {memberships.map((m) => (
                              <tr key={m.id} className="hover:bg-white/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-[#2C1810]">
                                  {m.user ? `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() : "Unknown User"}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {m.user?.email || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2.5 py-1 bg-orange-50 text-[#E8622A] rounded-lg text-xs font-bold border border-orange-100">
                                    {m.plan}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                                  <div>Start: {new Date(m.startDate).toLocaleDateString()}</div>
                                  <div>End: {new Date(m.endDate).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    m.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                                    m.status === "EXPIRED" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-700"
                                  }`}>
                                    {m.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {memberships.length === 0 && (
                              <tr>
                                <td colSpan={5} className="text-center py-10 text-[#7A5C45] bg-white/10">
                                  No membership records found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      {membershipTotalPages > 1 && (
                        <div className="flex justify-between items-center px-2">
                          <span className="text-xs text-[#7A5C45] font-semibold">
                            Page {membershipPage} of {membershipTotalPages}
                          </span>
                          <div className="flex gap-2">
                            <button
                              disabled={membershipPage <= 1}
                              onClick={() => fetchMemberships(membershipPage - 1)}
                              className="px-4 py-2 bg-white text-sm font-bold text-[#7A5C45] border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm cursor-pointer"
                            >
                              Previous
                            </button>
                            <button
                              disabled={membershipPage >= membershipTotalPages}
                              onClick={() => fetchMemberships(membershipPage + 1)}
                              className="px-4 py-2 bg-white text-sm font-bold text-[#7A5C45] border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm cursor-pointer"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

        {/* EVENT MODAL */}
        <AnimatePresence>
          {showEventModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
              >
                <div className="bg-[#E8622A] p-4 text-white flex justify-between items-center">
                  <h3 className="font-bold font-serif text-xl">Create New Event</h3>
                  <button onClick={() => setShowEventModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#2C1810] mb-1">Event Title *</label>
                    <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full px-4 py-2 border border-[#F0D5B8] rounded-xl focus:ring-2 focus:ring-[#E8622A] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2C1810] mb-1">Description *</label>
                    <textarea required value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full px-4 py-2 border border-[#F0D5B8] rounded-xl focus:ring-2 focus:ring-[#E8622A] focus:border-transparent h-24 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#2C1810] mb-1">Date *</label>
                      <input required type="datetime-local" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full px-4 py-2 border border-[#F0D5B8] rounded-xl focus:ring-2 focus:ring-[#E8622A] focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#2C1810] mb-1">Location *</label>
                      <input required type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full px-4 py-2 border border-[#F0D5B8] rounded-xl focus:ring-2 focus:ring-[#E8622A] focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2C1810] mb-1">Event Image (Optional)</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer bg-[#FDF5EC] border border-dashed border-[#E8622A] rounded-xl p-3 flex flex-col items-center justify-center hover:bg-[#F0D5B8]/30 transition-colors">
                        <Upload className="w-5 h-5 text-[#E8622A] mb-1" />
                        <span className="text-xs font-semibold text-[#7A5C45]">{newEvent.image ? newEvent.image.name : "Upload Image"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => setNewEvent({...newEvent, image: e.target.files[0]})} />
                      </label>
                    </div>
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-[#E8622A] text-white font-bold rounded-xl shadow hover:bg-[#D4880C] transition-colors disabled:opacity-50">
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FORUM MODAL */}
        <AnimatePresence>
          {showForumModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
              >
                <div className="bg-[#E8622A] p-4 text-white flex justify-between items-center">
                  <h3 className="font-bold font-serif text-xl">Create New Forum Thread</h3>
                  <button onClick={() => setShowForumModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleCreateForum} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-[#2C1810] mb-1">Thread Title *</label>
                    <input required type="text" value={newForum.title} onChange={e => setNewForum({...newForum, title: e.target.value})} className="w-full px-4 py-2 border border-[#F0D5B8] rounded-xl focus:ring-2 focus:ring-[#E8622A] focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2C1810] mb-1">Content / Question *</label>
                    <textarea required value={newForum.content} onChange={e => setNewForum({...newForum, content: e.target.value})} className="w-full px-4 py-2 border border-[#F0D5B8] rounded-xl focus:ring-2 focus:ring-[#E8622A] focus:border-transparent h-32 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#2C1810] mb-1">Attached Image (Optional)</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer bg-[#FDF5EC] border border-dashed border-[#E8622A] rounded-xl p-3 flex flex-col items-center justify-center hover:bg-[#F0D5B8]/30 transition-colors">
                        <Upload className="w-5 h-5 text-[#E8622A] mb-1" />
                        <span className="text-xs font-semibold text-[#7A5C45]">{newForum.image ? newForum.image.name : "Upload Image"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => setNewForum({...newForum, image: e.target.files[0]})} />
                      </label>
                    </div>
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full py-3 bg-[#E8622A] text-white font-bold rounded-xl shadow hover:bg-[#D4880C] transition-colors disabled:opacity-50">
                    {isSubmitting ? "Creating..." : "Create Forum Thread"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ANALYTICS MODAL */}
        <AnimatePresence>
          {showAnalyticsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
              >
                <div className="bg-[#E8622A] p-5 text-white flex justify-between items-center">
                  <h3 className="font-bold font-serif text-xl flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Platform Analytics
                  </h3>
                  <button onClick={() => setShowAnalyticsModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X className="w-5 h-5"/></button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FDF5EC] p-4 rounded-xl border border-[#F0D5B8]">
                      <span className="text-xs text-[#7A5C45] font-semibold uppercase tracking-wider block mb-1">Total Events</span>
                      <span className="text-2xl font-bold text-[#2C1810]">{events.length}</span>
                    </div>
                    <div className="bg-[#FDF5EC] p-4 rounded-xl border border-[#F0D5B8]">
                      <span className="text-xs text-[#7A5C45] font-semibold uppercase tracking-wider block mb-1">Forum Threads</span>
                      <span className="text-2xl font-bold text-[#2C1810]">{forums.length}</span>
                    </div>
                    <div className="bg-[#FDF5EC] p-4 rounded-xl border border-[#F0D5B8]">
                      <span className="text-xs text-[#7A5C45] font-semibold uppercase tracking-wider block mb-1">Total Grievances</span>
                      <span className="text-2xl font-bold text-[#2C1810]">{adminComplaints.length}</span>
                    </div>
                    <div className="bg-[#FDF5EC] p-4 rounded-xl border border-[#F0D5B8]">
                      <span className="text-xs text-[#7A5C45] font-semibold uppercase tracking-wider block mb-1">Pending Grievances</span>
                      <span className="text-2xl font-bold text-red-600">{adminComplaints.filter(c => c.status === "PENDING").length}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold text-[#2C1810]">
                      <span>Grievance Resolution Rate</span>
                      <span>
                        {adminComplaints.length > 0 
                          ? Math.round(((adminComplaints.filter(c => c.status !== "PENDING").length) / adminComplaints.length) * 100)
                          : 100}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${adminComplaints.length > 0 
                            ? ((adminComplaints.filter(c => c.status !== "PENDING").length) / adminComplaints.length) * 100 
                            : 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/80">
                    <h4 className="font-bold text-[#2C1810] text-sm mb-2">Member Applications Status</h4>
                    <div className="flex justify-between items-center text-xs font-semibold text-[#7A5C45]">
                      <span>Total Submitted: {applications.length}</span>
                      <span className="text-[#E8622A]">Pending Review: {applications.filter(a => a.status === "PENDING").length}</span>
                    </div>
                  </div>

                  <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/80 space-y-2">
                    <h4 className="font-bold text-[#2C1810] text-sm">Platform Financials</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2 rounded-lg border border-gray-100">
                        <span className="text-[10px] text-[#7A5C45] font-semibold block">Memberships</span>
                        <span className="text-sm font-bold text-[#E8622A]">₹{analytics?.membershipRevenue || 0}</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-100">
                        <span className="text-[10px] text-[#7A5C45] font-semibold block">Donations</span>
                        <span className="text-sm font-bold text-[#E8622A]">₹{analytics?.donationRevenue || 0}</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-gray-100">
                        <span className="text-[10px] text-[#7A5C45] font-semibold block">Total Revenue</span>
                        <span className="text-sm font-bold text-blue-600">₹{analytics?.totalRevenue || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

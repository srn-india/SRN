import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import { 
  ArrowLeft, LogOut, UserCircle, Calendar, MessageSquare, 
  ShieldCheck, CheckCircle2, XCircle, Plus, Trash2, ShieldAlert,
  Settings, Sliders, Bell, LayoutDashboard, Key, TrendingUp, Download, MapPin,
  BookOpen, AlertCircle, Briefcase, FileText, X, Eye, GraduationCap, Heart, CalendarDays, User, Users, RotateCw, RotateCcw, QrCode, Send, Pencil,
  Phone, Mail, Copy, Check, ExternalLink, Camera, Sparkles, UserCheck, Shield, Loader2
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

const GOV_ID_DISPLAY_NAMES = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  VOTER_ID: "Voter ID (EPIC)",
  DRIVING_LICENSE: "Driving Licence",
};

export default function AdminDashboard() {
  const { user, logout, API_BASE, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  // Manual payments state
  const [manualPayments, setManualPayments] = useState([]);
  const [manualLoading, setManualLoading] = useState(false);
  const [rejectModal, setRejectModal] = useState(null); // { id, userId }
  const [rejectReason, setRejectReason] = useState("");
  const [mpFilter, setMpFilter] = useState("PENDING");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("ALL");
  const [imageLightbox, setImageLightbox] = useState(null);
  const [copiedField, setCopiedField] = useState("");
  const [sendingIdCardId, setSendingIdCardId] = useState(null);

  const copyToClipboard = (text, fieldId) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(""), 2000);
  };
  
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

  // Rename user modal state
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renamingUser, setRenamingUser] = useState(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);
  const [renameError, setRenameError] = useState("");



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

  const handleDeleteMembership = async (id, memberName = 'this member') => {
    if (!window.confirm(`Are you sure you want to permanently delete the membership record for ${memberName}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/memberships/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setMemberships(prev => prev.filter(m => m.id !== id));
        alert('✅ Membership record deleted successfully.');
        fetchAnalytics();
      } else {
        alert('Failed to delete membership: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error deleting membership: ' + err.message);
    }
  };

  const handleUpdateUserName = async (e) => {
    e.preventDefault();
    if (!renamingUser || !editFirstName.trim()) {
      setRenameError("First name is required.");
      return;
    }
    setRenameLoading(true);
    setRenameError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${renamingUser.id}/name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update user name");
      }

      // Update in memberships state
      setMemberships(prev => prev.map(m => {
        if ((m.userId && m.userId === renamingUser.id) || (m.user && m.user.id === renamingUser.id)) {
          return {
            ...m,
            user: {
              ...m.user,
              firstName: editFirstName.trim(),
              lastName: editLastName.trim(),
            }
          };
        }
        return m;
      }));

      // Update in manual payments state
      setManualPayments(prev => prev.map(p => {
        if ((p.userId && p.userId === renamingUser.id) || (p.user && p.user.id === renamingUser.id)) {
          return {
            ...p,
            user: {
              ...p.user,
              firstName: editFirstName.trim(),
              lastName: editLastName.trim(),
            }
          };
        }
        return p;
      }));

      setRenameModalOpen(false);
      setRenamingUser(null);
    } catch (err) {
      setRenameError(err.message || "Failed to update name");
    } finally {
      setRenameLoading(false);
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

  const handleResetCollections = async () => {
    if (!window.confirm("Are you sure you want to reset all collected amounts and payment records to ₹0? This will clear test payments and zero out the collections overview.")) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/analytics/reset`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Collections data reset to ₹0 successfully.");
        await fetchAnalytics();
        if (activeTab === "manual-payments") {
          fetchManualPayments();
        }
      } else {
        alert("Reset failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchManualPayments = async (status) => {
    const s = status || mpFilter;
    setManualLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/manual-payments/admin/all?status=${s}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setManualPayments(data.data || []);
    } catch (err) {
      console.error("fetchManualPayments:", err);
    } finally {
      setManualLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "profile") {
      fetchAnalytics();
    } else if (activeTab === "memberships") {
      fetchMemberships(membershipPage);
    } else if (activeTab === "manual-payments") {
      fetchManualPayments(mpFilter);
    } else if (activeTab === "complaints") {
      fetchComplaints();
    } else if (activeTab === "articles") {
      fetchArticles();
    } else if (activeTab === "events") {
      fetchEvents();
    } else if (activeTab === "forums") {
      fetchForums();
    } else if (activeTab === "applications") {
      fetchApplications();
    }
  }, [activeTab]);

  const approveManualPayment = async (id, type) => {
    const msg = type === "MEMBERSHIP" 
      ? "Approve this payment? This will grant membership access to the user." 
      : "Approve this payment? This will verify the user's donation.";
    if (!window.confirm(msg)) return;
    try {
      const res = await fetch(`${API_BASE}/api/manual-payments/admin/${id}/approve`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ adminNote: "" })
      });
      if (res.ok) { alert("✅ Payment approved! User notified via email."); fetchManualPayments(); }
      else alert("Failed: " + (await res.json()).message);
    } catch (err) { alert("Error: " + err.message); }
  };

  const rejectManualPayment = async (id) => {
    if (!rejectReason.trim()) { alert("Please enter a rejection reason first."); return; }
    try {
      const res = await fetch(`${API_BASE}/api/manual-payments/admin/${id}/reject`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}`, "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ adminNote: rejectReason }),
      });
      if (res.ok) {
        alert("❌ Payment rejected. User notified via email.");
        setRejectModal(null); setRejectReason(""); fetchManualPayments();
      } else alert("Failed: " + (await res.json()).message);
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleDeleteManualPayment = async (id, memberName = 'this entry') => {
    if (!window.confirm(`Are you sure you want to remove the submission record and details for ${memberName}? This will delete the entry from this list.`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/manual-payments/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setManualPayments(prev => prev.filter(p => p.id !== id));
        alert("✅ Manual payment record removed successfully.");
      } else {
        alert("Failed to delete record: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleCleanupApprovedPayments = async () => {
    if (!window.confirm("Remove all APPROVED manual payment records from the dashboard? This cleans up processed submissions while keeping member profiles and memberships intact.")) return;
    try {
      setManualLoading(true);
      const res = await fetch(`${API_BASE}/api/manual-payments/admin/cleanup?status=APPROVED`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✅ Cleaned up ${data.data?.count || 0} approved payment record(s).`);
        fetchManualPayments(mpFilter);
      } else {
        alert("Cleanup failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setManualLoading(false);
    }
  };

  const handleSendMemberIdCard = async (identifier, memberName = 'Member') => {
    if (!window.confirm(`Generate and dispatch official ID card & receipt email to ${memberName}? (You can resend this multiple times if the user did not receive it).`)) return;
    setSendingIdCardId(identifier);
    try {
      const res = await fetch(`${API_BASE}/api/memberships/admin/${identifier}/send-idcard`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json"
        },
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✅ Official ID card and receipt email sent successfully to ${data.data?.sentTo || memberName}!`);
      } else {
        alert("Failed to send ID card: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      alert("Error sending ID card: " + err.message);
    } finally {
      setSendingIdCardId(null);
    }
  };

  const sendMemberIdCard = (userId, memberName = 'Member') => handleSendMemberIdCard(userId, memberName);

  const handleDownloadMemberIdCard = async (payment) => {
    let memId = payment.membershipId;
    if (!memId) {
      try {
        const res = await fetch(`${API_BASE}/api/memberships?page=1&limit=500`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const mem = data.data?.memberships?.find(m => (m.userId && m.userId === payment.userId) || (m.user && m.user.id === payment.userId));
          if (mem) memId = mem.id;
        }
      } catch (err) {
        console.error("Failed to find membership for user:", err);
      }
    }

    if (!memId) {
      alert("No active membership found for this user to download ID card.");
      return;
    }

    const downloadFileName = `SRN_ID_Card_${payment.user?.firstName || 'Member'}.png`;
    const cardUrl = `https://cgmlrhewmemptyklkbrq.supabase.co/storage/v1/object/public/id-cards/${memId}.png?download=${downloadFileName}&t=${Date.now()}`;
    
    // Trigger download in new tab / download attribute
    const link = document.createElement('a');
    link.href = cardUrl;
    link.download = downloadFileName;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportMemberships = async () => {
    // 1. Try Native Binary .xlsx from Backend (Multi-sheet, auto-column-width, native Excel)
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/api/memberships/export/excel`, {
        headers: { 
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SRN_Memberships_Master_Register_${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      }
    } catch (err) {
      console.warn("Backend excel export failed, falling back to client-side formatted export:", err);
    }

    // 2. High-Fidelity Client-side CSV Fallback (with UTF-8 BOM, comprehensive columns, and clean headers)
    let dataToExport = memberships;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/api/memberships?page=1&limit=5000`, { 
        headers: { 
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include' 
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.memberships && json.data.memberships.length > 0) {
          dataToExport = json.data.memberships;
        }
      }
    } catch (err) {
      console.warn("Could not fetch full membership list for export, falling back to loaded records:", err);
    }

    if (dataToExport.length === 0) {
      alert("No membership records to export.");
      return;
    }

    const headers = [
      "S.No.",
      "Membership ID",
      "Member Name",
      "Membership Tier",
      "Status",
      "Fee (INR)",
      "Phone Number",
      "Email Address",
      "Gender",
      "Date of Birth",
      "Govt ID Type",
      "Govt ID Number",
      "PAN Card Number",
      "State",
      "District / City",
      "Occupation",
      "Plan Code",
      "Start Date",
      "End Date",
      "Registration Date"
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined || val === '') return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = dataToExport.map((m, idx) => {
      const isMitra = m.plan === 'BASIC';
      const tierName = isMitra ? 'Rashtra Mitra (Supporter Tier)' : 'Rashtra Nirman Karta (Active Leadership)';
      const fee = isMitra ? 0 : 101;
      return [
        idx + 1,
        escapeCsv(m.id || "N/A"),
        escapeCsv(m.user ? `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() : "Unknown User"),
        escapeCsv(tierName),
        escapeCsv(m.status || "ACTIVE"),
        escapeCsv(fee),
        escapeCsv(m.user?.phone || "N/A"),
        escapeCsv(m.user?.email || "N/A"),
        escapeCsv(m.user?.gender || "N/A"),
        escapeCsv(m.user?.dateOfBirth ? new Date(m.user.dateOfBirth).toLocaleDateString("en-IN") : "N/A"),
        escapeCsv(m.user?.govIdType || "N/A"),
        escapeCsv(m.user?.govIdNumber || "N/A"),
        escapeCsv(m.user?.panNumber || "N/A"),
        escapeCsv(m.user?.state || "N/A"),
        escapeCsv(m.user?.district || "N/A"),
        escapeCsv(m.user?.occupation || "N/A"),
        escapeCsv(m.plan || "PREMIUM"),
        escapeCsv(m.startDate ? new Date(m.startDate).toLocaleDateString("en-IN") : "N/A"),
        escapeCsv(m.endDate ? new Date(m.endDate).toLocaleDateString("en-IN") : "N/A"),
        escapeCsv(m.createdAt ? new Date(m.createdAt).toLocaleDateString("en-IN") : "N/A")
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `SRN_Memberships_Master_Register_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportManualPayments = () => {
    if (!manualPayments || manualPayments.length === 0) {
      alert("No manual payment records to export.");
      return;
    }

    const headers = [
      "S.No.",
      "Transaction ID",
      "Contributor Name",
      "Email Address",
      "Phone Number",
      "Amount (INR)",
      "Payment Type",
      "12-Digit UTR / Ref No",
      "Verification Status",
      "Submission Date",
      "Screenshot URL",
      "Rejection Note"
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined || val === '') return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = manualPayments.map((p, idx) => [
      idx + 1,
      escapeCsv(p.id),
      escapeCsv(p.user ? `${p.user.firstName || ''} ${p.user.lastName || ''}`.trim() : (p.email || 'N/A')),
      escapeCsv(p.user?.email || p.email || 'N/A'),
      escapeCsv(p.user?.phone || 'N/A'),
      escapeCsv(p.amount),
      escapeCsv(p.type),
      escapeCsv(p.utrNumber || 'N/A'),
      escapeCsv(p.status),
      escapeCsv(p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-IN") : 'N/A'),
      escapeCsv(p.screenshot || 'N/A'),
      escapeCsv(p.rejectionReason || 'N/A')
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `SRN_Manual_Payments_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
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
    { id: "memberships", label: "Manage Memberships", icon: Users },
    { id: "manual-payments", label: "Manual Payments", icon: QrCode },
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
            className="lg:col-span-3"
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            <div className="bg-white/70 backdrop-blur-xl p-3 lg:p-4 rounded-2xl lg:rounded-[2rem] border border-white/80 shadow-sm flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar whitespace-nowrap">
              <div className="hidden lg:flex px-4 py-3 mb-2 border-b border-gray-100 items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-[#E8622A]" />
                <h2 className="font-serif font-bold text-lg text-[#2C1810]">Admin Panel</h2>
              </div>
              
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 lg:gap-3 px-3.5 py-2.5 lg:px-4 lg:py-3 rounded-xl lg:rounded-2xl transition-all duration-300 font-semibold text-xs lg:text-sm shrink-0 w-auto lg:w-full ${
                      isActive 
                        ? "bg-[#E8622A] text-white shadow-md shadow-orange-900/20 lg:translate-x-1" 
                        : "text-[#7A5C45] hover:bg-white hover:text-[#2C1810] hover:shadow-sm"
                    }`}
                  >
                    <tab.icon className={`w-4 h-4 lg:w-5 lg:h-5 ${isActive ? "text-white" : "text-[#E8622A]"}`} />
                    {tab.label}
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
                      <QrCode className="w-8 h-8 text-rose-500 mb-4" />
                      <h3 className="text-2xl font-bold text-[#2C1810]">
                        {manualPayments.filter(c => c.status === "PENDING").length}
                      </h3>
                      <p className="text-sm text-[#7A5C45] font-semibold">Pending Payments</p>
                    </div>
                  </div>

                  {/* Total Received Amount Overview */}
                  <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                      <div>
                        <h3 className="text-xl font-bold font-serif text-[#2C1810] flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-[#E8622A]" />
                          Total Amount Received (Collections)
                        </h3>
                        <p className="text-xs text-[#7A5C45] mt-0.5">Verified collections from memberships and donations across UPI, QR, Bank Transfer & Online.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleResetCollections}
                          disabled={loadingAnalytics}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-xl cursor-pointer transition-colors border border-rose-200 shadow-2xs"
                          title="Reset All Collections to ₹0"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reset Collections
                        </button>
                        <button
                          onClick={fetchAnalytics}
                          disabled={loadingAnalytics}
                          className="text-xs font-bold text-[#E8622A] hover:text-[#C04A18] flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 rounded-xl cursor-pointer transition-colors border border-orange-100 shadow-2xs"
                          title="Refresh Collections"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${loadingAnalytics ? "animate-spin" : ""}`} /> Refresh
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-6 rounded-2xl border border-orange-200/60 bg-white/50">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7A5C45] block mb-1">Total Received Amount</span>
                        <div className="text-3xl font-black text-[#E8622A] font-serif">₹{analytics?.totalRevenue?.toLocaleString('en-IN') || 0}</div>
                        <span className="text-[11px] text-gray-500 mt-1 block">Combined Memberships & Donations</span>
                      </div>

                      <div className="bg-gradient-to-br from-purple-500/10 to-transparent p-6 rounded-2xl border border-purple-200/60 bg-white/50">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7A5C45] block mb-1">Membership Amount Received</span>
                        <div className="text-3xl font-black text-purple-700 font-serif">₹{analytics?.membershipRevenue?.toLocaleString('en-IN') || 0}</div>
                        <span className="text-[11px] text-gray-500 mt-1 block">{analytics?.totalMembers || 0} Active Member subscriptions</span>
                      </div>

                      <div className="bg-gradient-to-br from-blue-500/10 to-transparent p-6 rounded-2xl border border-blue-200/60 bg-white/50">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7A5C45] block mb-1">Donation Amount Received</span>
                        <div className="text-3xl font-black text-blue-700 font-serif">₹{analytics?.donationRevenue?.toLocaleString('en-IN') || 0}</div>
                        <span className="text-[11px] text-gray-500 mt-1 block">Total Verified Donations</span>
                      </div>
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
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                      {[
                        { label: "Review Payments", icon: QrCode, bg: "bg-rose-50/80", border: "border-rose-100", text: "text-rose-600", onClick: () => setActiveTab("manual-payments") },
                        { label: "New Event", icon: Plus, bg: "bg-blue-50/80", border: "border-blue-100", text: "text-blue-600", onClick: () => { setActiveTab("events"); setShowEventModal(true); } },
                        { label: "Analytics", icon: TrendingUp, bg: "bg-emerald-50/80", border: "border-emerald-100", text: "text-emerald-600", onClick: () => setShowAnalyticsModal(true) },
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
                      <button onClick={() => setShowEventModal(true)} className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D4551E] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer">
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
                      <button onClick={() => setShowForumModal(true)} className="flex items-center gap-2 bg-[#E8622A] hover:bg-[#D4551E] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer">
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
                      <p className="text-sm text-[#7A5C45] mt-1">Review articles submitted via the "Janmat: Aap Ki Aawaz" portal.</p>
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
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
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
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
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
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
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
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
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
                              <th className="px-6 py-4">Member Name & Gender</th>
                              <th className="px-6 py-4">Contact (Phone / Email)</th>
                              <th className="px-6 py-4">Location & Occupation</th>
                              <th className="px-6 py-4">Plan & Duration</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                            {memberships.map((m) => (
                              <tr key={m.id} className="hover:bg-white/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-[#2C1810]">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span>{m.user ? `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() : "Unknown User"}</span>
                                    {m.user?.gender && (
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {m.user.gender}
                                      </span>
                                    )}
                                    {m.user && (
                                      <button
                                        onClick={() => {
                                          setRenamingUser({ id: m.userId || m.user.id, firstName: m.user.firstName || '', lastName: m.user.lastName || '', email: m.user.email });
                                          setEditFirstName(m.user.firstName || '');
                                          setEditLastName(m.user.lastName || '');
                                          setRenameError('');
                                          setRenameModalOpen(true);
                                        }}
                                        className="p-1 hover:bg-orange-50 text-gray-400 hover:text-[#E8622A] rounded-lg transition-colors cursor-pointer"
                                        title="Rename Member"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  <div className="font-medium text-sm text-[#2C1810]">{m.user?.phone || "No phone"}</div>
                                  <div className="text-xs text-gray-500">{m.user?.email || "N/A"}</div>
                                </td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                  <div className="text-gray-800 font-semibold">{[m.user?.district, m.user?.state].filter(Boolean).join(", ") || "N/A"}</div>
                                  <div className="text-[#7A5C45]">{m.user?.occupation && m.user.occupation !== 'N/A' ? m.user.occupation : "No occupation listed"}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2.5 py-1 bg-orange-50 text-[#E8622A] rounded-lg text-xs font-bold border border-orange-100">
                                    {m.plan}
                                  </span>
                                  <div className="text-[11px] text-gray-400 mt-1">
                                    {new Date(m.startDate).toLocaleDateString("en-IN")} - {new Date(m.endDate).toLocaleDateString("en-IN")}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    m.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" :
                                    m.status === "EXPIRED" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-700"
                                  }`}>
                                    {m.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2 flex-wrap">
                                    {m.status === "ACTIVE" && (
                                      <>
                                        <button
                                          onClick={() => handleSendMemberIdCard(m.id || m.userId, m.user ? `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() : 'Member')}
                                          disabled={sendingIdCardId === (m.id || m.userId)}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                          title="Send official ID card and receipt to member email (can be sent multiple times)"
                                        >
                                          {sendingIdCardId === (m.id || m.userId) ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                                          ) : (
                                            <Send className="w-3.5 h-3.5" />
                                          )}
                                          <span>{sendingIdCardId === (m.id || m.userId) ? "Sending..." : "Send ID Card"}</span>
                                        </button>

                                        <a
                                          href={`https://cgmlrhewmemptyklkbrq.supabase.co/storage/v1/object/public/id-cards/${m.id}.png?download=SRN_ID_Card_${m.user?.firstName || 'Member'}.png&t=${Date.now()}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-[#E8622A] rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                          title="Download ID Card PNG directly"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                          <span>Download</span>
                                        </a>
                                      </>
                                    )}

                                    {m.user && (
                                      <button
                                        onClick={() => {
                                          setRenamingUser({ id: m.userId || m.user.id, firstName: m.user.firstName || '', lastName: m.user.lastName || '', email: m.user.email });
                                          setEditFirstName(m.user.firstName || '');
                                          setEditLastName(m.user.lastName || '');
                                          setRenameError('');
                                          setRenameModalOpen(true);
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-[#7A5C45] hover:text-[#E8622A] rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                        title="Rename Member"
                                      >
                                        <Pencil className="w-3.5 h-3.5" /> Rename
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteMembership(m.id, m.user ? `${m.user.firstName || ''} ${m.user.lastName || ''}`.trim() : 'this member')}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                                      title="Permanently Delete Membership Record"
                                    >
                                      <Trash2 className="w-3.5 h-3.5 text-red-500" /> Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {memberships.length === 0 && (
                              <tr>
                                <td colSpan={6} className="text-center py-10 text-[#7A5C45] bg-white/10">
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

              {/* MANUAL PAYMENTS TAB */}
              {activeTab === "manual-payments" && (
                <motion.div key="manual-payments" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="bg-white/70 backdrop-blur-xl p-8 rounded-[2rem] border border-white/80 shadow-sm">
                  <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#2C1810] font-serif flex items-center gap-3">
                        <div className="p-2 bg-[#E8622A]/10 rounded-xl"><QrCode className="w-6 h-6 text-[#E8622A]" /></div>
                        Manual Payments (UPI & Bank Transfer)
                      </h2>
                      <p className="text-sm text-[#7A5C45] mt-1">Review and verify UPI and Bank Transfer payment submissions from members and donors.</p>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button 
                        onClick={handleCleanupApprovedPayments} 
                        disabled={manualLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-semibold text-sm transition-all shadow-xs cursor-pointer"
                        title="Remove all approved & processed payment records from the dashboard"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" /> Clear Approved Records
                      </button>
                      <button 
                        onClick={handleExportManualPayments} 
                        disabled={manualLoading || manualPayments.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                        title="Export Manual Payments Report (.csv)"
                      >
                        <Download className="w-4 h-4" /> Export Excel / CSV
                      </button>
                      <button onClick={() => fetchManualPayments()} className="flex items-center gap-2 px-4 py-2 bg-[#E8622A]/10 hover:bg-[#E8622A]/20 text-[#E8622A] rounded-xl font-semibold text-sm transition-colors cursor-pointer">
                        <RotateCw className="w-4 h-4" /> Refresh
                      </button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-col xl:flex-row justify-between gap-4 mb-8 bg-white/60 p-2 rounded-2xl border border-white/80 shadow-sm backdrop-blur-md">
                    <div className="flex bg-gray-100/80 p-1 rounded-xl w-full xl:w-auto overflow-x-auto">
                      {["PENDING", "APPROVED", "REJECTED"].map(s => (
                        <button key={s} onClick={() => { setMpFilter(s); fetchManualPayments(s); }}
                          className={`flex-1 xl:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${mpFilter === s ? "bg-white shadow-sm text-[#E8622A] scale-[1.02]" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                    <div className="flex bg-gray-100/80 p-1 rounded-xl w-full xl:w-auto overflow-x-auto">
                      {["ALL", "MEMBERSHIP", "DONATION"].map(s => (
                        <button key={s} onClick={() => setPaymentTypeFilter(s)}
                          className={`flex-1 xl:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${paymentTypeFilter === s ? "bg-white shadow-sm text-blue-600 scale-[1.02]" : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}`}>
                          {s === "ALL" ? "All Types" : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {manualLoading ? (
                    <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-[#E8622A]/20 border-t-[#E8622A] rounded-full animate-spin" /></div>
                  ) : manualPayments.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <QrCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No {mpFilter.toLowerCase()} manual payments.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {manualPayments.filter(p => paymentTypeFilter === "ALL" || p.type === paymentTypeFilter).length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No {paymentTypeFilter !== "ALL" ? paymentTypeFilter.toLowerCase() : ""} payments found in this category.</div>
                      ) : (
                        manualPayments.filter(p => paymentTypeFilter === "ALL" || p.type === paymentTypeFilter).map(p => (
                          <div key={p.id} className="bg-white border border-gray-100 rounded-[2.5rem] p-6 sm:p-8 shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
                            {/* Decorative Background */}
                            <div className={`absolute top-0 right-0 w-36 h-36 rounded-bl-full pointer-events-none opacity-20 transition-transform group-hover:scale-110 ${
                              p.status === "PENDING" ? "bg-gradient-to-br from-amber-400 to-transparent" :
                              p.status === "APPROVED" ? "bg-gradient-to-br from-emerald-400 to-transparent" :
                              "bg-gradient-to-br from-red-400 to-transparent"
                            }`} />
                            
                            {/* Top Meta Bar */}
                            <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-gray-100 mb-6 relative z-10">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className={`px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  p.status === "PENDING" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                                  p.status === "APPROVED" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                                  "bg-red-100 text-red-700 border border-red-200"
                                }`}>
                                  <div className="flex items-center gap-1.5">
                                    {p.status === "PENDING" && <RotateCw className="w-3 h-3 animate-spin-slow" />}
                                    {p.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                                    {p.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                                    {p.status}
                                  </div>
                                </span>
                                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                  {new Date(p.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                </span>
                                <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${p.type === "MEMBERSHIP" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                                  {p.type}
                                </span>
                                {(() => {
                                  let methodTag = "Manual";
                                  let cleanPurpose = p.purpose || "";
                                  if (cleanPurpose.includes("[BANK TRANSFER]")) {
                                    methodTag = "Bank Transfer";
                                    cleanPurpose = cleanPurpose.replace("[BANK TRANSFER]", "").trim();
                                  } else if (cleanPurpose.includes("[UPI]")) {
                                    methodTag = "UPI";
                                    cleanPurpose = cleanPurpose.replace("[UPI]", "").trim();
                                  }
                                  p.cleanPurpose = cleanPurpose;
                                  
                                  return (
                                    <span className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border ${methodTag === "Bank Transfer" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-teal-50 text-teal-600 border-teal-100"}`}>
                                      {methodTag}
                                    </span>
                                  );
                                })()}
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amount:</span>
                                  <h3 className="text-3xl font-extrabold font-serif text-[#2C1810]">₹{p.amount}</h3>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteManualPayment(p.id, `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim() || p.utrNumber)}
                                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                                  title="Remove this payment record and submission details"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Main Content: Full User Profile & Proof Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start relative z-10">
                              
                              {/* Left & Middle (2 Cols): Comprehensive User Details */}
                              <div className="lg:col-span-2 space-y-5">
                                
                                {/* User Identity Header Box */}
                                <div className="bg-[#FAF6F0]/70 p-5 sm:p-6 rounded-3xl border border-orange-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                  
                                  {/* Official ID Card Photo */}
                                  <div className="relative group shrink-0">
                                    <div 
                                      onClick={() => p.user?.avatar && setImageLightbox({ url: p.user.avatar, title: `${p.user.firstName} ${p.user.lastName} — Official ID Card Photo` })}
                                      className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 bg-white shadow-xs flex items-center justify-center transition-all ${
                                        p.user?.avatar ? "border-[#E8622A]/50 cursor-pointer hover:border-[#E8622A] hover:shadow-md" : "border-gray-200"
                                      }`}
                                    >
                                      {p.user?.avatar ? (
                                        <img src={p.user.avatar} alt="User ID Card Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                      ) : (
                                        <div className="flex flex-col items-center text-center p-2 text-gray-400">
                                          <User className="w-8 h-8 text-gray-300 mb-1" />
                                          <span className="text-[10px] font-bold leading-tight text-gray-400">No Photo</span>
                                        </div>
                                      )}
                                      {p.user?.avatar && (
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                          <div className="bg-white/95 p-2 rounded-full shadow-md">
                                            <Eye className="w-4 h-4 text-[#E8622A]" />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <span className={`block text-center mt-1.5 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${
                                      p.user?.avatar ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                                    }`}>
                                      {p.user?.avatar ? "ID Photo Attached" : "Photo Missing"}
                                    </span>
                                  </div>

                                  {/* User Summary Info */}
                                  <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-lg sm:text-xl font-bold text-[#2C1810]">
                                          {p.user?.firstName} {p.user?.lastName}
                                        </h4>
                                        {p.user && (
                                          <button
                                            onClick={() => {
                                              setRenamingUser({ id: p.userId || p.user.id, firstName: p.user.firstName || '', lastName: p.user.lastName || '', email: p.user.email });
                                              setEditFirstName(p.user.firstName || '');
                                              setEditLastName(p.user.lastName || '');
                                              setRenameError('');
                                              setRenameModalOpen(true);
                                            }}
                                            className="p-1 text-gray-400 hover:text-[#E8622A] rounded-md hover:bg-orange-100/50 transition-colors"
                                            title="Edit user name"
                                          >
                                            <Pencil className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-1.5">
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                                          p.user?.role === "ADMIN" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-gray-100 text-gray-600 border border-gray-200"
                                        }`}>
                                          {p.user?.role || "USER"}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                                          p.user?.isVerified ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-100 text-amber-700 border border-amber-200"
                                        }`}>
                                          {p.user?.isVerified ? "Email Verified" : "Unverified"}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                      <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-gray-200 text-gray-600 inline-flex items-center gap-1 text-[11px]">
                                        <span>User ID: {p.user?.id ? `${p.user.id.slice(0, 10)}...` : (p.userId ? `${p.userId.slice(0, 10)}...` : 'N/A')}</span>
                                        <button 
                                          type="button"
                                          onClick={() => copyToClipboard(p.user?.id || p.userId, `id-${p.id}`)}
                                          className="hover:text-[#E8622A] cursor-pointer"
                                          title="Copy User ID"
                                        >
                                          {copiedField === `id-${p.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                      </span>
                                      <span>·</span>
                                      <span>Registered: {p.user?.createdAt ? new Date(p.user.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "N/A"}</span>
                                    </div>

                                    {p.user?.memberships?.[0] && (
                                      <div className="pt-1 flex items-center gap-2 text-xs">
                                        <span className="text-gray-500 font-medium">Membership Record:</span>
                                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                                          {p.user.memberships[0].plan} · {p.user.memberships[0].status}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Full Contact & Demographics Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                                  
                                  {/* Phone */}
                                  <div className="flex items-start gap-3 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                                    <div className="p-2 bg-white rounded-xl shadow-xs text-orange-600"><Phone className="w-4 h-4" /></div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Phone Number</p>
                                        {p.user?.phone && (
                                          <button
                                            type="button"
                                            onClick={() => copyToClipboard(p.user.phone, `phone-${p.id}`)}
                                            className="text-gray-400 hover:text-[#E8622A] cursor-pointer"
                                            title="Copy Phone"
                                          >
                                            {copiedField === `phone-${p.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                          </button>
                                        )}
                                      </div>
                                      {p.user?.phone ? (
                                        <a href={`tel:${p.user.phone}`} className="text-sm font-bold text-[#2C1810] hover:text-[#E8622A] transition-colors block truncate">
                                          {p.user.phone}
                                        </a>
                                      ) : (
                                        <p className="text-xs text-gray-400 italic">Not provided</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Email */}
                                  <div className="flex items-start gap-3 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                                    <div className="p-2 bg-white rounded-xl shadow-xs text-blue-600"><Mail className="w-4 h-4" /></div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                                        {p.user?.email && (
                                          <button
                                            type="button"
                                            onClick={() => copyToClipboard(p.user.email, `email-${p.id}`)}
                                            className="text-gray-400 hover:text-[#E8622A] cursor-pointer"
                                            title="Copy Email"
                                          >
                                            {copiedField === `email-${p.id}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                          </button>
                                        )}
                                      </div>
                                      <a href={`mailto:${p.user?.email}`} className="text-sm font-semibold text-[#7A5C45] hover:text-[#E8622A] transition-colors block truncate">
                                        {p.user?.email}
                                      </a>
                                    </div>
                                  </div>

                                  {/* State & District */}
                                  <div className="flex items-start gap-3 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                                    <div className="p-2 bg-white rounded-xl shadow-xs text-emerald-600"><MapPin className="w-4 h-4" /></div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Location / Chapter</p>
                                      <p className="text-sm font-bold text-[#2C1810] truncate">
                                        {p.user?.district ? `${p.user.district}, ` : ""}{p.user?.state || "Not specified"}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Gender & DOB */}
                                  <div className="flex items-start gap-3 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                                    <div className="p-2 bg-white rounded-xl shadow-xs text-purple-600"><UserCircle className="w-4 h-4" /></div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gender & Birth Date</p>
                                      <p className="text-sm font-medium text-[#7A5C45] truncate">
                                        {p.user?.gender || "Not specified"}
                                        {p.user?.dateOfBirth ? ` · DOB: ${new Date(p.user.dateOfBirth).toLocaleDateString("en-IN")}` : ""}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Government ID / PAN Card */}
                                  {(p.user?.govIdNumber || p.user?.panNumber) && (
                                    <div className="flex items-start gap-3 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 sm:col-span-2">
                                      <div className="p-2 bg-white rounded-xl shadow-xs text-amber-600"><ShieldCheck className="w-4 h-4" /></div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-1.5">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                              {p.user?.govIdType ? (GOV_ID_DISPLAY_NAMES[p.user.govIdType] || p.user.govIdType) : "Government ID"}
                                            </p>
                                            {p.user?.govIdType && (
                                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                                {p.user.govIdType}
                                              </span>
                                            )}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => copyToClipboard(p.user.govIdNumber || p.user.panNumber, `govid-${p.id}`)}
                                            className="text-gray-400 hover:text-[#E8622A] cursor-pointer inline-flex items-center gap-1 text-[11px]"
                                            title="Copy ID"
                                          >
                                            {copiedField === `govid-${p.id}` ? (
                                              <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Copied</span>
                                            ) : (
                                              <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</span>
                                            )}
                                          </button>
                                        </div>
                                        <p className="text-sm font-mono font-bold text-[#2C1810] tracking-wider uppercase select-all">{p.user.govIdNumber || p.user.panNumber}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* UTR / Transaction ID */}
                                  <div className="flex items-start gap-3 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 sm:col-span-2">
                                    <div className="p-2 bg-white rounded-xl shadow-xs text-indigo-600"><FileText className="w-4 h-4" /></div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">UTR / Transaction ID</p>
                                        <button
                                          type="button"
                                          onClick={() => copyToClipboard(p.utrNumber, `utr-${p.id}`)}
                                          className="text-gray-400 hover:text-[#E8622A] cursor-pointer inline-flex items-center gap-1 text-[11px]"
                                          title="Copy UTR"
                                        >
                                          {copiedField === `utr-${p.id}` ? (
                                            <span className="text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Copied</span>
                                          ) : (
                                            <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</span>
                                          )}
                                        </button>
                                      </div>
                                      <p className="text-sm font-mono font-bold text-blue-700 tracking-wide select-all">{p.utrNumber}</p>
                                    </div>
                                  </div>

                                  {/* Stated Purpose / Application Details */}
                                  {p.cleanPurpose && (
                                    <div className="flex items-start gap-3 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70 sm:col-span-2">
                                      <div className="p-2 bg-white rounded-xl shadow-xs text-[#E8622A]"><MessageSquare className="w-4 h-4" /></div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Stated Purpose & Application Details</p>
                                        <p className="text-xs sm:text-sm font-semibold text-[#5C3A1E] leading-relaxed mt-0.5">{p.cleanPurpose}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {p.adminNote && (
                                  <div className="p-4 bg-red-50/80 border border-red-200 rounded-2xl flex items-start gap-3">
                                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-0.5">Admin Rejection Note</p>
                                      <p className="text-sm text-red-700 font-medium">{p.adminNote}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Right (1 Col): Payment Screenshot / Receipt Proof */}
                              <div className="w-full flex flex-col gap-2.5">
                                <p className="text-xs font-bold text-[#7A5C45] uppercase tracking-wider flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-[#E8622A]" />
                                  Payment Proof (Screenshot)
                                </p>
                                {p.screenshot ? (
                                  <div 
                                    onClick={() => setImageLightbox({ url: p.screenshot, title: `Payment Receipt Proof — UTR: ${p.utrNumber}` })}
                                    className="relative aspect-[3/4] max-h-80 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-xs hover:shadow-md transition-all group/img cursor-pointer bg-black/5"
                                  >
                                    <img src={p.screenshot} alt="Payment proof" className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity transform group-hover/img:scale-100 scale-90 shadow-md flex items-center gap-2 text-xs font-bold text-[#2C1810]">
                                        <Eye className="w-4 h-4 text-[#E8622A]" /> Click to Zoom
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="aspect-[3/4] max-h-80 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-6 text-center text-gray-400">
                                    <QrCode className="w-10 h-10 mb-2 opacity-30" />
                                    <p className="text-xs font-medium">No screenshot attached</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 relative z-10">
                              <div className="flex flex-wrap items-center gap-3">
                                {p.status === "PENDING" && (
                                  <>
                                    <button onClick={() => approveManualPayment(p.id, p.type)}
                                      className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer">
                                      <CheckCircle2 className="w-5 h-5" /> Approve Payment
                                    </button>
                                    <button onClick={() => setRejectModal(p)}
                                      className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-2.5 bg-white border-2 border-red-100 hover:border-red-500 hover:bg-red-50 text-red-500 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 shadow-sm cursor-pointer">
                                      <XCircle className="w-5 h-5" /> Reject
                                    </button>
                                  </>
                                )}
                                {p.status === "APPROVED" && p.type === "MEMBERSHIP" && (
                                  <>
                                    <button 
                                      onClick={() => handleDownloadMemberIdCard(p)}
                                      className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-[#E8622A] hover:bg-[#D4551E] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
                                      title="Download Official ID Card PNG"
                                    >
                                      <Download className="w-4 h-4" /> Download ID Card
                                    </button>
                                    <button 
                                      onClick={() => handleSendMemberIdCard(p.userId, p.user?.firstName || 'Member')}
                                      disabled={sendingIdCardId === p.userId}
                                      className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer"
                                      title="Send ID Card & Receipt to User Email (Can be sent multiple times)"
                                    >
                                      {sendingIdCardId === p.userId ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin text-white" /> Sending...
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4" /> Send Digital ID Card
                                        </>
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>

                              <button 
                                onClick={() => handleDeleteManualPayment(p.id, `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim() || p.utrNumber)}
                                className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ml-auto"
                                title="Permanently remove this submission record and user details from dashboard"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove Details
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Reject Modal */}
                  <AnimatePresence>
                    {rejectModal && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                          className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                          <h3 className="text-xl font-bold text-[#2C1810] mb-2">Reject Payment</h3>
                          <p className="text-sm text-gray-500 mb-4">User: <strong>{rejectModal.user?.firstName} {rejectModal.user?.lastName}</strong> — ₹{rejectModal.amount}</p>
                          <textarea
                            rows={3}
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (will be sent to user via email)..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
                          />
                          <div className="flex gap-3">
                            <button onClick={() => rejectManualPayment(rejectModal.id)}
                              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors">Confirm Reject</button>
                            <button onClick={() => { setRejectModal(null); setRejectReason(""); }}
                              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">Cancel</button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Image Lightbox Modal for ID Photos & Receipts */}
                  <AnimatePresence>
                    {imageLightbox && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setImageLightbox(null)}
                        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
                      >
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }} 
                          exit={{ scale: 0.9, opacity: 0 }}
                          onClick={e => e.stopPropagation()}
                          className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-2xl shadow-2xl space-y-4"
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h4 className="text-sm sm:text-base font-bold text-[#2C1810] truncate pr-4">{imageLightbox.title}</h4>
                            <button 
                              onClick={() => setImageLightbox(null)} 
                              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-gray-50 rounded-2xl p-2 sm:p-4 border border-gray-100">
                            <img src={imageLightbox.url} alt="Lightbox Preview" className="max-h-[65vh] w-auto object-contain rounded-xl shadow-xs" />
                          </div>

                          <div className="flex justify-end pt-1">
                            <a 
                              href={imageLightbox.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8622A]/10 hover:bg-[#E8622A]/20 text-[#E8622A] font-bold text-xs rounded-xl transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" /> Open Full Resolution
                            </a>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                              className="px-4 py-2 bg-[#E8622A] hover:bg-[#D4551E] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
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
                          <div className="w-12 h-6 bg-[#E8622A] rounded-full relative cursor-pointer shadow-inner transition-transform hover:scale-105">
                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md" />
                          </div>
                        </div>
                        <div className="w-full h-px bg-gray-100" />
                        <div className="flex justify-between items-center group">
                          <div>
                            <h4 className="font-semibold text-[#2C1810] group-hover:text-[#E8622A] transition-colors">Weekly Digest</h4>
                            <p className="text-xs text-[#7A5C45] mt-0.5">Summary of platform activities</p>
                          </div>
                          <div className="w-12 h-6 bg-[#E8622A] rounded-full relative cursor-pointer shadow-inner transition-transform hover:scale-105">
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
        {/* RENAME USER MODAL */}
        <AnimatePresence>
          {renameModalOpen && renamingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
              >
                <div className="bg-[#E8622A] p-4 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-5 h-5" />
                    <h3 className="font-bold font-serif text-xl">Edit User Name</h3>
                  </div>
                  <button 
                    onClick={() => { setRenameModalOpen(false); setRenamingUser(null); }} 
                    className="hover:bg-white/20 p-1 rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateUserName} className="p-6 space-y-4">
                  <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100/80">
                    <p className="text-xs text-gray-500 font-medium">User Email</p>
                    <p className="text-sm font-bold text-[#2C1810] break-all">{renamingUser.email}</p>
                  </div>

                  {renameError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
                      {renameError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-[#2C1810] mb-1">First Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={editFirstName} 
                      onChange={e => setEditFirstName(e.target.value)} 
                      placeholder="e.g. Rahul"
                      className="w-full px-4 py-2.5 border border-[#F0D5B8] rounded-xl focus:ring-2 focus:ring-[#E8622A] focus:border-transparent text-sm font-medium" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#2C1810] mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={editLastName} 
                      onChange={e => setEditLastName(e.target.value)} 
                      placeholder="e.g. Sharma"
                      className="w-full px-4 py-2.5 border border-[#F0D5B8] rounded-xl focus:ring-2 focus:ring-[#E8622A] focus:border-transparent text-sm font-medium" 
                    />
                  </div>

                  <p className="text-xs text-gray-400 italic">
                    Note: If this user is an active member, their official ID card will be automatically re-rendered with the new name.
                  </p>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setRenameModalOpen(false); setRenamingUser(null); }}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={renameLoading} 
                      type="submit" 
                      className="flex-1 py-2.5 bg-[#E8622A] text-white font-bold rounded-xl shadow hover:bg-[#D4880C] transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {renameLoading ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : "Save Name"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

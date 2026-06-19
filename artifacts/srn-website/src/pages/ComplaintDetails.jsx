import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, FileText, AlertCircle, Trash2, User, Calendar, MapPin, Tag, Globe, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API_BASE } = useAuth();
  
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Publishing State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [resolutionEn, setResolutionEn] = useState("");
  const [resolutionHi, setResolutionHi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/complaints/${id}`, {
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        setComplaint(data.data);
      } else {
        setError(data.message || "Failed to fetch complaint details");
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSolve = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/complaints/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      if (res.ok) {
        setComplaint(prev => ({ ...prev, status: 'RESOLVED' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/complaints/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        navigate("/admin-dashboard", { state: { activeTab: 'complaints' } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPublishModal = () => {
    setTitleEn(complaint.titleEn || complaint.subject);
    setTitleHi(complaint.titleHi || complaint.subject);
    setResolutionEn(complaint.resolutionEn || "");
    setResolutionHi(complaint.resolutionHi || "");
    setIsPublishModalOpen(true);
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/complaints/${id}/publish`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isPublished: true,
          titleEn,
          titleHi,
          resolutionEn,
          resolutionHi
        })
      });
      if (res.ok) {
        const data = await res.json();
        setComplaint(data.data);
        setIsPublishModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnpublish = async () => {
    if (!window.confirm("Are you sure you want to unpublish this complaint from Jan Yachikaye?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/complaints/${id}/publish`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: false })
      });
      if (res.ok) {
        const data = await res.json();
        setComplaint(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF5EC]">
        <div className="w-12 h-12 border-4 border-[#E8622A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5EC] p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-[#2C1810] mb-2 font-serif">Complaint Not Found</h2>
        <p className="text-[#7A5C45] mb-6">{error || "The complaint you are looking for does not exist or you don't have access."}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-[#E8622A] text-white rounded-xl font-bold shadow hover:bg-[#D4880C] transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const applicantName = complaint.user 
    ? `${complaint.user.firstName || ''} ${complaint.user.lastName || ''}`.trim() 
    : complaint.fullName;

  return (
    <div className="min-h-screen bg-[#FDF5EC] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#7A5C45] hover:text-[#E8622A] transition-colors mb-6 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#F0D5B8]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E8622A] to-[#D4880C] p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z\' fill=\'%23ffffff\' fill-rule=\'evenodd\' fill-opacity=\'0.05\'/%3E%3C/svg%3E')]"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold tracking-wide mb-3 font-mono">
                  {complaint.ticket}
                </span>
                <h1 className="text-3xl font-bold font-serif mb-2">{complaint.subject}</h1>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {applicantName}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                  complaint.status === 'RESOLVED' ? 'bg-white text-green-600' : 
                  complaint.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-white text-amber-600'
                }`}>
                  Status: {complaint.status}
                </span>
                {complaint.isPublished && (
                  <span className="px-3 py-1 bg-white/25 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-white border border-white/20">
                    <Globe className="w-3.5 h-3.5" /> Published
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-[#2C1810] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#E8622A]" /> Description
                  </h3>
                  <div className="text-[#2C1810] leading-loose whitespace-pre-wrap text-justify bg-[#FDF5EC] p-5 rounded-xl border border-[#F0D5B8]">
                    {complaint.description}
                  </div>
                </section>
                
                {complaint.fileUrl && (
                  <section>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                      <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#E8622A]" /> Attached File
                      </h3>
                      <a 
                        href={complaint.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#E8622A] hover:underline flex items-center gap-1"
                      >
                        Open in new tab
                      </a>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-gray-200">
                      {complaint.fileUrl.toLowerCase().endsWith('.pdf') ? (
                        <embed src={complaint.fileUrl} type="application/pdf" className="w-full h-[600px] bg-gray-50" />
                      ) : (
                        <img src={complaint.fileUrl} alt="Attachment" className="w-full h-auto max-h-[500px] object-contain bg-gray-50" />
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-[#2C1810] mb-4">Applicant Details</h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Email</p>
                      <p className="font-medium text-[#2C1810]">{complaint.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Phone</p>
                      <p className="font-medium text-[#2C1810]">{complaint.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">State/Region</p>
                      <p className="font-medium text-[#2C1810] flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#E8622A]"/> {complaint.state}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Category</p>
                      <p className="font-medium text-[#2C1810] flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-[#E8622A]"/> {complaint.category}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-3">
                  <h4 className="font-bold text-[#2C1810] mb-2">Actions</h4>
                  {complaint.status === 'PENDING' && (
                    <button 
                      onClick={handleSolve}
                      className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-600 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Mark Solved
                    </button>
                  )}
                  
                  {complaint.isPublished ? (
                    <button 
                      onClick={handleUnpublish}
                      className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-amber-600 text-white font-bold rounded-xl shadow-sm hover:bg-amber-700 transition-colors"
                    >
                      <Globe className="w-5 h-5" /> Unpublish Case
                    </button>
                  ) : (
                    <button 
                      onClick={openPublishModal}
                      className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#E8622A] text-white font-bold rounded-xl shadow-sm hover:bg-[#C04A18] transition-colors"
                    >
                      <Globe className="w-5 h-5" /> Publish to Jan Yachikaye
                    </button>
                  )}

                  <button 
                    onClick={handleDelete}
                    className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-white border-2 border-red-100 text-red-500 font-bold rounded-xl shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" /> Delete Complaint
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isPublishModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsPublishModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative border border-[#F0D5B8] flex flex-col"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#E8622A] to-[#D4880C] w-full" />
              
              <form onSubmit={handlePublish} className="p-6 md:p-8 space-y-5 flex-1 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[#5C1010] font-serif flex items-center gap-2">
                    <Globe className="w-6 h-6 text-[#E8622A]" /> Publish Resolved Case
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsPublishModalOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#7A5C45] uppercase mb-1">English Title</label>
                    <input
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FFF9F2] rounded-xl border border-[#F0D5B8]/60 text-sm focus:outline-none focus:border-[#E8622A] text-[#1E0F05]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7A5C45] uppercase mb-1">Hindi Title</label>
                    <input
                      type="text"
                      required
                      value={titleHi}
                      onChange={(e) => setTitleHi(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FFF9F2] rounded-xl border border-[#F0D5B8]/60 text-sm focus:outline-none focus:border-[#E8622A] text-[#1E0F05]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7A5C45] uppercase mb-1">English Resolution Description</label>
                    <textarea
                      required
                      rows={3}
                      value={resolutionEn}
                      onChange={(e) => setResolutionEn(e.target.value)}
                      placeholder="Detail how the grievance was resolved in English..."
                      className="w-full px-4 py-2.5 bg-[#FFF9F2] rounded-xl border border-[#F0D5B8]/60 text-sm focus:outline-none focus:border-[#E8622A] text-[#1E0F05]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#7A5C45] uppercase mb-1">Hindi Resolution Description (हिंदी निवारण विवरण)</label>
                    <textarea
                      required
                      rows={3}
                      value={resolutionHi}
                      onChange={(e) => setResolutionHi(e.target.value)}
                      placeholder="शिकायत के निस्तारण का विवरण हिंदी में दर्ज करें..."
                      className="w-full px-4 py-2.5 bg-[#FFF9F2] rounded-xl border border-[#F0D5B8]/60 text-sm focus:outline-none focus:border-[#E8622A] text-[#1E0F05]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setIsPublishModalOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#E8622A] hover:bg-[#C04A18] text-white text-sm font-bold rounded-xl transition-colors shadow flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish to Jan Yachikaye'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

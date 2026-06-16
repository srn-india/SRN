import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, FileText, AlertCircle, Trash2, User, Calendar, MapPin, Briefcase, Mail, Phone, GraduationCap, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API_BASE } = useAuth();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}`, {
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        setApplication(data.data);
      } else {
        setError(data.message || "Failed to fetch application details");
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' })
      });
      if (res.ok) {
        setApplication(prev => ({ ...prev, status: 'Approved' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        setApplication(prev => ({ ...prev, status: 'Rejected' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application forever?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        navigate("/admin-dashboard", { state: { activeTab: 'applications' } });
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

  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5EC] p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-[#2C1810] mb-2 font-serif">Application Not Found</h2>
        <p className="text-[#7A5C45] mb-6">{error || "The application you are looking for does not exist or you don't have access."}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-[#E8622A] text-white rounded-xl font-bold shadow hover:bg-[#D4880C] transition-colors">
          Go Back
        </button>
      </div>
    );
  }

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
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold tracking-wide mb-3 uppercase tracking-wider">
                  Post Application
                </span>
                <h1 className="text-3xl font-bold font-serif mb-2">{application.fullName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {application.appliedPosition}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-end">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                  application.status === 'Approved' ? 'bg-white text-emerald-600' : 
                  application.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-white text-amber-600'
                }`}>
                  Status: {application.status}
                </span>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="md:col-span-2 space-y-8">
                
                <section>
                  <h3 className="text-lg font-bold text-[#2C1810] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#E8622A]" /> Personal Details
                  </h3>
                  <div className="bg-[#FDF5EC] p-5 rounded-xl border border-[#F0D5B8] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#2C1810]">
                    <div>
                      <span className="block text-[#7A5C45] font-semibold text-xs uppercase tracking-wider mb-1">Gender</span>
                      <span className="font-medium">{application.gender || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[#7A5C45] font-semibold text-xs uppercase tracking-wider mb-1">Date of Birth</span>
                      <span className="font-medium">{application.dob || "N/A"}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-[#7A5C45] font-semibold text-xs uppercase tracking-wider mb-1">Address</span>
                      <span className="font-medium leading-relaxed">{application.address || "N/A"}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-[#2C1810] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#E8622A]" /> Academic & Professional Background
                  </h3>
                  <div className="bg-[#FDF5EC] p-5 rounded-xl border border-[#F0D5B8] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#2C1810]">
                    <div className="sm:col-span-2">
                      <span className="block text-[#7A5C45] font-semibold text-xs uppercase tracking-wider mb-1">Highest Qualification</span>
                      <span className="font-medium">{application.qualification || "No qualification provided."}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-[#7A5C45] font-semibold text-xs uppercase tracking-wider mb-1">Current Occupation / Profession</span>
                      <span className="font-medium">{application.currentOccupation || "No occupation provided."}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-[#2C1810] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#E8622A]" /> Social Work
                  </h3>
                  <div className="text-[#2C1810] leading-loose whitespace-pre-wrap text-justify bg-[#FDF5EC] p-5 rounded-xl border border-[#F0D5B8]">
                    {application.socialContribution || "No prior contribution."}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-[#2C1810] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#E8622A]" /> Why Join SRN?
                  </h3>
                  <div className="text-[#2C1810] leading-loose whitespace-pre-wrap text-justify bg-[#FDF5EC] p-5 rounded-xl border border-[#F0D5B8]">
                    {application.whyJoin || "No reason provided."}
                  </div>
                </section>

                {application.resumeUrl && (
                  <section>
                    <h3 className="text-lg font-bold text-[#2C1810] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#E8622A]" /> Uploaded Document
                    </h3>
                    <div className="bg-[#FDF5EC] p-2 rounded-xl border border-[#F0D5B8] overflow-hidden flex justify-center">
                      {application.resumeUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                        <img src={application.resumeUrl} alt="Resume/Document" className="max-w-full h-auto rounded-lg" />
                      ) : application.resumeUrl.match(/\.(pdf)$/i) ? (
                        <iframe src={application.resumeUrl} className="w-full h-[600px] rounded-lg border-0" title="Resume/Document" />
                      ) : (
                        <div className="p-8 text-center text-[#7A5C45]">
                          <p className="mb-4 font-medium">Document preview is not available for this file type.</p>
                          <a href={application.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#E8622A] text-white font-bold rounded-xl shadow hover:bg-[#D4880C] transition-colors">
                            Download Document
                          </a>
                        </div>
                      )}
                    </div>
                  </section>
                )}

              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-[#2C1810] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-gray-500" /> Contact Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="truncate" title={application.email}>{application.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{application.phone || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {application.resumeUrl && (
                  <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-bold text-[#2C1810] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-blue-500" /> Attachments
                    </h3>
                    <a 
                      href={application.resumeUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-white text-blue-600 font-bold text-sm rounded-xl border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      Open in New Tab
                    </a>
                  </div>
                )}

                <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
                  <h3 className="font-bold text-[#2C1810] mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-amber-500" /> Actions
                  </h3>
                  
                  <div className="space-y-3">
                    {application.status === 'Pending' && (
                      <button 
                        onClick={handleApprove}
                        className="w-full py-2.5 flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Application
                      </button>
                    )}
                    
                    {application.status !== 'Rejected' && (
                      <button 
                        onClick={handleReject}
                        className="w-full py-2.5 flex justify-center items-center gap-2 bg-white text-[#7A5C45] hover:text-red-600 border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-xl font-bold shadow-sm transition-all"
                      >
                        Reject Application
                      </button>
                    )}
                    
                    <button 
                      onClick={handleDelete}
                      className="w-full py-2.5 flex justify-center items-center gap-2 bg-white text-red-500 hover:bg-red-50 border border-red-100 rounded-xl font-bold shadow-sm transition-all mt-6"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Permanently
                    </button>
                  </div>
                </div>

              </div>
              
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

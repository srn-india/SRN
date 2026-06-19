import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, AlertCircle, Calendar, CheckCircle2, FileText, User, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, API_BASE } = useAuth();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticleDetails();
  }, [id]);

  const fetchArticleDetails = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setArticle(data.data);
      } else {
        setError(data.message || 'Failed to fetch article details');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}/approve`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (res.ok) {
        fetchArticleDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        navigate('/admin-dashboard', { state: { activeTab: 'articles' } });
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

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5EC] p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-[#2C1810] mb-2 font-serif">Article Not Found</h2>
        <p className="text-[#7A5C45] mb-6">{error}</p>
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
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold tracking-wide mb-3">
                  {article.articleCategory}
                </span>
                <h1 className="text-3xl font-bold font-serif mb-2">{article.title}</h1>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {article.authorName}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-end">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                  article.status === 'APPROVED' ? 'bg-white text-green-600' : 
                  article.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-white text-amber-600'
                }`}>
                  Status: {article.status}
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
                    <BookOpen className="w-5 h-5 text-[#E8622A]" /> Summary
                  </h3>
                  <p className="text-[#7A5C45] leading-relaxed bg-[#FDF5EC] p-4 rounded-xl border border-[#F0D5B8]">
                    {article.summary}
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-bold text-[#2C1810] border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#E8622A]" /> Full Content
                  </h3>
                  <div className="text-[#2C1810] leading-loose whitespace-pre-wrap text-justify">
                    {article.content}
                  </div>
                </section>
                
                {article.coverImageUrl && (
                  <section>
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                      <h3 className="text-lg font-bold text-[#2C1810] flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#E8622A]" /> Attached File
                      </h3>
                      <a 
                        href={article.coverImageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-[#E8622A] hover:underline flex items-center gap-1"
                      >
                        Open in new tab
                      </a>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-gray-200">
                      {article.coverImageUrl.toLowerCase().endsWith('.pdf') ? (
                        <embed src={article.coverImageUrl} type="application/pdf" className="w-full h-[600px] bg-gray-50" />
                      ) : (
                        <img src={article.coverImageUrl} alt="Attachment" className="w-full h-auto max-h-[500px] object-contain bg-gray-50" />
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="font-bold text-[#2C1810] mb-4">Author Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Email</p>
                      <p className="font-medium text-[#2C1810]">{article.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase">Phone</p>
                      <p className="font-medium text-[#2C1810]">{article.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-3">
                  <h4 className="font-bold text-[#2C1810] mb-2">Actions</h4>
                  {article.status === 'PENDING' && (
                    <button 
                      onClick={handleApprove}
                      className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-sm hover:bg-emerald-600 transition-colors"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Approve Article
                    </button>
                  )}
                  <button 
                    onClick={handleDelete}
                    className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-white border-2 border-red-100 text-red-500 font-bold rounded-xl shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" /> Delete Article
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

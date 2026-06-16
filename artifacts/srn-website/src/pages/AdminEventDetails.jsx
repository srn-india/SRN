import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Users, Mail, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";


const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminEventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events/${id}/attendees`, {
          credentials: "include",
        });
        
        let text = "";
        try {
          text = await res.text();
        } catch (err) {
          console.error("Failed to read response body:", err);
        }

        if (res.ok) {
          let data = { data: [] };
          try {
            data = JSON.parse(text);
          } catch (_) {
            console.error("Failed to parse successful response as JSON:", text);
          }
          setAttendees(data.data || []);
        } else {
          let errMsg = "";
          try {
            const errData = JSON.parse(text);
            errMsg = errData.message || JSON.stringify(errData);
          } catch (_) {
            errMsg = text;
          }
          toast({
            variant: "destructive",
            title: "Failed to fetch attendees",
            description: errMsg || "Could not retrieve the attendee list.",
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred while fetching attendees.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [id]);

  const handleDownloadCSV = () => {
    if (attendees.length === 0) return;
    
    // Header
    const csvRows = ["First Name,Last Name,Email"];
    
    // Rows
    attendees.forEach(attendee => {
      const row = `"${attendee.firstName}","${attendee.lastName}","${attendee.email}"`;
      csvRows.push(row);
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `event_attendees_${id}.csv`);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#FDF5EC] min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        
        <button 
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-[#7A5C45] hover:text-[#E8622A] transition-colors font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#2C1810] mb-2 flex items-center gap-3">
                <Users className="w-8 h-8 text-[#E8622A]" />
                Event Attendees
              </h1>
              <p className="text-[#7A5C45] font-medium">
                {attendees.length} users registered for this event
              </p>
            </div>
            <button 
              onClick={handleDownloadCSV}
              disabled={attendees.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E8622A] text-white rounded-xl hover:bg-[#C04A18] transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#7A5C45] font-medium">Loading attendees...</div>
          ) : attendees.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-orange-100 rounded-2xl bg-orange-50/50">
              <Users className="w-12 h-12 text-orange-200 mx-auto mb-3" />
              <p className="text-[#7A5C45] font-bold text-lg">No attendees yet</p>
              <p className="text-[#7A5C45] text-sm mt-1">Users who register for this event will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-orange-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-orange-50 border-b border-orange-100">
                    <th className="p-4 font-bold text-[#5C1010]">User</th>
                    <th className="p-4 font-bold text-[#5C1010]">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {attendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {attendee.avatar ? (
                            <img src={attendee.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-orange-100" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#E8622A]">
                              <UserCircle className="w-6 h-6" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#2C1810]">{attendee.firstName} {attendee.lastName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-[#7A5C45] text-sm">
                          <Mail className="w-4 h-4 text-[#E8622A]" />
                          {attendee.email}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

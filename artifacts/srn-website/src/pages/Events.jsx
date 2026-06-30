import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Users, Clock } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useFadeIn } from "../hooks/useFadeIn";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";


function FadeSection({ children, delay = 0, className = "" }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Events() {
  const { lang } = useLanguage();
  const en = lang === "en";
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Events | Sashakt Rashtra Nirman";
    
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
        const data = await res.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: en ? "Login Required" : "लॉगिन आवश्यक",
        description: en ? "Please login to register for this event." : "कृपया इस कार्यक्रम के लिए पंजीकरण करने हेतु लॉगिन करें।",
      });
      navigate("/login");
      return;
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}/register`, {
        method: "POST",
        credentials: "include"
      });
      
      let errMsg = "";
      let isJson = false;
      let data = {};
      
      try {
        const text = await res.text();
        try {
          data = JSON.parse(text);
          isJson = true;
          errMsg = data.message;
        } catch (_) {
          errMsg = text;
        }
      } catch (err) {
        console.error("Failed to read response body:", err);
      }

      if (res.ok) {
        toast({
          title: en ? "Registration Success!" : "पंजीकरण सफल!",
          description: en ? "Successfully registered for this event." : "सफलतापूर्वक इस कार्यक्रम के लिए पंजीकृत।",
        });
      } else {
        toast({
          variant: "destructive",
          title: en ? "Registration Failed" : "पंजीकरण विफल",
          description: errMsg || (en ? "Failed to register" : "पंजीकरण विफल"),
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: en ? "Error" : "त्रुटि",
        description: en ? "An error occurred" : "एक त्रुटि हुई",
      });
    }
  };

  return (
    <div className="bg-[#FDF5EC] min-h-screen">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6 overflow-hidden">
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8622A]/15 border border-[#E8622A]/30 mb-6">
            <Calendar className="w-4 h-4 text-[#E8622A]" />
            <span className="text-[#E8622A] text-sm font-medium tracking-wide uppercase">
              {en ? "Upcoming Events" : "आगामी कार्यक्रम"}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif leading-tight drop-shadow-sm">
            {en ? (
              <>Connect, Engage & <span className="text-[#E8622A]">Inspire</span></>
            ) : (
              <>जुड़ें, भाग लें और <span className="text-[#E8622A]">प्रेरित करें</span></>
            )}
          </h1>
          <p className="text-[#7A5C45] mt-6 text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            {en ? "Join our nationwide movement. Participate in rallies, summits, and community discussions to shape the future of our nation." : "हमारे राष्ट्रव्यापी आंदोलन से जुड़ें। हमारे राष्ट्र के भविष्य को आकार देने के लिए रैलियों, शिखर सम्मेलनों और सामुदायिक चर्चाओं में भाग लें।"}
          </p>
        </motion.div>
      </section>

      {/* ── Events Grid ────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeSection>
            <SectionHeader hindi="आगामी कार्यक्रम" english="Upcoming Events" />
          </FadeSection>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length === 0 ? (
              <div className="col-span-full text-center py-10 text-[#7A5C45]">
                {en ? "No upcoming events found." : "कोई आगामी कार्यक्रम नहीं मिला।"}
              </div>
            ) : (
              events.map((event, i) => (
                <FadeSection key={event.id} delay={i * 150} className="h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-orange-900/10 border border-[#F0D5B8] transition-all duration-300 group h-full flex flex-col">
                    
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={event.imageUrl || "/event_rally_thumb_1779205461756.png"} 
                        alt={event.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-white flex flex-col items-center">
                        <span className="text-[#E8622A] font-bold text-lg leading-none">{new Date(event.date).getDate()}</span>
                        <span className="text-[#5C1010] text-xs font-semibold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 mb-3 text-xs font-semibold text-[#7A5C45]">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#E8622A]" /> {event.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#E8622A]" /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#1E0F05] font-serif mb-1 group-hover:text-[#E8622A] transition-colors">
                        {event.title}
                      </h3>
                      
                      <p className="text-[#7A5C45] text-sm leading-relaxed mb-6 flex-1">
                        {event.description}
                      </p>

                      <div className="mt-auto pt-4 border-t border-[#F0D5B8] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[#5C1010]">
                          <Users className="w-4 h-4 text-[#E8622A]" />
                          {event.capacity || "Unlimited"} {en ? "Expected" : "अपेक्षित"}
                        </div>
                        <button 
                          onClick={() => handleRegister(event.id)}
                          className="flex items-center gap-1 text-[#E8622A] font-semibold text-sm hover:text-[#C04A18] transition-colors"
                        >
                          {en ? "Register" : "पंजीकरण करें"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </FadeSection>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Call to Action ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FFF9F2] border-t border-[#E8622A]/20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeSection>
            <h2 className="text-3xl font-bold text-[#5C1010] font-serif mb-4">
              {en ? "Want to Host a Local Event?" : "क्या आप स्थानीय कार्यक्रम आयोजित करना चाहते हैं?"}
            </h2>
            <p className="text-[#7A5C45] mb-8 max-w-2xl mx-auto">
              {en ? "Empower your local community by organizing a town hall, rally, or discussion group under the Sashakt Rashtra Nirman banner. We provide the resources, you provide the passion." : "सशक्त राष्ट्र निर्माण के बैनर तले टाउन हॉल, रैली या चर्चा समूह का आयोजन करके अपने स्थानीय समुदाय को सशक्त बनाएं। हम संसाधन प्रदान करते हैं, आप जुनून प्रदान करें।"}
            </p>
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white font-semibold shadow-lg shadow-orange-900/20 hover:-translate-y-1 transition-transform">
              {en ? "Become an Organizer" : "आयोजक बनें"}
            </button>
          </FadeSection>
        </div>
      </section>

    </div>
  );
}

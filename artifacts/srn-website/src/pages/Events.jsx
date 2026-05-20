import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Users, Clock } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { useFadeIn } from "../hooks/useFadeIn";

function FadeSection({ children, delay = 0, className = "" }) {
  const ref = useFadeIn(0.1);
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const eventsList = [
  {
    id: 1,
    title: "National Youth Empowerment Rally",
    titleHi: "राष्ट्रीय युवा सशक्तिकरण रैली",
    date: "August 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "New Delhi, India",
    image: "/event_rally_thumb_1779205461756.png",
    description: "Join thousands of youth leaders across the country to discuss the future of our nation, youth empowerment, and grassroots leadership.",
    attendees: "10,000+",
  },
  {
    id: 2,
    title: "Leadership Summit 2026",
    titleHi: "नेतृत्व शिखर सम्मेलन 2026",
    date: "September 2, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Mumbai Convention Centre",
    image: "/event_summit_thumb_1779205477141.png",
    description: "An exclusive summit for state bearers and national leaders to strategize our roadmap for the upcoming year and strengthen party foundations.",
    attendees: "5,000+",
  },
  {
    id: 3,
    title: "Grassroots Policy Discussion",
    titleHi: "जमीनी स्तर पर नीतिगत चर्चा",
    date: "September 18, 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Virtual & Local Chapters",
    image: "/forum_policy_thumb_1779205493919.png",
    description: "A hybrid event connecting local community leaders to draft policy recommendations for the national committee.",
    attendees: "Virtual",
  },
];

export default function Events() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Events | Sashakt Rashtra Nirman";
  }, []);

  return (
    <div className="bg-[#FDF5EC] min-h-screen">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#1E0F05] py-32 text-center px-6 overflow-hidden flex items-center justify-center min-h-[45vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-screen"
          style={{ backgroundImage: `url('/events_hero_bg_1779205425710.png')` }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, white, white 1px, transparent 1px, transparent 28px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F05] via-transparent to-transparent opacity-90" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <Calendar className="w-4 h-4 text-[#E8622A]" />
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Upcoming Events</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif leading-tight drop-shadow-lg">
            Connect, Engage & <span className="text-[#E8622A]">Inspire</span>
          </h1>
          <p className="text-xl text-[#F47A3A] mt-3 font-medium tracking-wide drop-shadow">
            कार्यक्रम और आयोजन
          </p>
          <p className="text-white/70 mt-6 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Join our nationwide movement. Participate in rallies, summits, and community discussions to shape the future of our nation.
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
            {eventsList.map((event, i) => (
              <FadeSection key={event.id} delay={i * 150} className="h-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-orange-900/10 border border-[#F0D5B8] transition-all duration-300 group h-full flex flex-col">
                  
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-white flex flex-col items-center">
                      <span className="text-[#E8622A] font-bold text-lg leading-none">{event.date.split(" ")[1].replace(",", "")}</span>
                      <span className="text-[#5C1010] text-xs font-semibold uppercase">{event.date.split(" ")[0].slice(0, 3)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 mb-3 text-xs font-semibold text-[#7A5C45]">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#E8622A]" /> {event.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#E8622A]" /> {event.time}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1E0F05] font-serif mb-1 group-hover:text-[#E8622A] transition-colors">{event.title}</h3>
                    <p className="text-sm text-[#F47A3A] mb-3 font-medium">{event.titleHi}</p>
                    
                    <p className="text-[#7A5C45] text-sm leading-relaxed mb-6 flex-1">
                      {event.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-[#F0D5B8] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#5C1010]">
                        <Users className="w-4 h-4 text-[#E8622A]" />
                        {event.attendees} Expected
                      </div>
                      <button className="flex items-center gap-1 text-[#E8622A] font-semibold text-sm hover:text-[#C04A18] transition-colors">
                        Register <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#FFF9F2] border-t border-[#E8622A]/20">
        <div className="max-w-4xl mx-auto text-center">
          <FadeSection>
            <h2 className="text-3xl font-bold text-[#5C1010] font-serif mb-4">Want to Host a Local Event?</h2>
            <p className="text-[#7A5C45] mb-8 max-w-2xl mx-auto">
              Empower your local community by organizing a town hall, rally, or discussion group under the Sashakt Rashtra Nirman banner. We provide the resources, you provide the passion.
            </p>
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white font-semibold shadow-lg shadow-orange-900/20 hover:-translate-y-1 transition-transform">
              Become an Organizer
            </button>
          </FadeSection>
        </div>
      </section>

    </div>
  );
}

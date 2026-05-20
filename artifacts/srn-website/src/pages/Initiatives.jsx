import { useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, HeartHandshake, Laptop, Globe } from "lucide-react";
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

const initiatives = [
  {
    id: 1,
    title: "Youth Empowerment",
    titleHi: "युवा सशक्तिकरण",
    description: "Equipping the next generation with the skills, leadership training, and opportunities they need to steer the nation towards progress and global prominence.",
    icon: Zap,
    image: "/init_youth_1779216923142.png",
    color: "from-[#E8622A]/20 to-transparent",
  },
  {
    id: 2,
    title: "Antyodaya & Grassroots Welfare",
    titleHi: "अंत्योदय और जमीनी कल्याण",
    description: "Working tirelessly to ensure that the benefits of national growth reach the absolute last person in the queue. Uplifting marginalized communities through targeted interventions.",
    icon: HeartHandshake,
    image: "/init_antyodaya_1779216957012.png",
    color: "from-[#C04A18]/20 to-transparent",
  },
  {
    id: 3,
    title: "Digital Innovation",
    titleHi: "तकनीकी नवाचार",
    description: "Bridging the digital divide by promoting digital literacy and leveraging technology for better governance, transparency, and public service delivery.",
    icon: Laptop,
    image: "/init_digital_1779216971453.png",
    color: "from-[#F47A3A]/20 to-transparent",
  },
  {
    id: 4,
    title: "National Integration Forums",
    titleHi: "राष्ट्रीय एकीकरण मंच",
    description: "Fostering unity in diversity by bringing together policymakers, intellectuals, and citizens to dialogue on critical issues shaping our country's future.",
    icon: Globe,
    image: "/events_hero_bg_1779205425710.png",
    color: "from-[#5C1010]/20 to-transparent",
  }
];

export default function Initiatives() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Our Initiatives | Sashakt Rashtra Nirman";
  }, []);

  return (
    <div className="bg-[#FDF5EC] min-h-screen pb-20">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#1E0F05] py-32 text-center px-6 overflow-hidden flex items-center justify-center min-h-[50vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url('/init_hero_bg_1779216907662.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF5EC] via-[#1E0F05]/80 to-[#1E0F05]/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif leading-tight drop-shadow-lg">
            Our <span className="text-[#E8622A]">Initiatives</span>
          </h1>
          <p className="text-xl text-[#F47A3A] mt-3 font-medium tracking-wide drop-shadow mb-6">
            हमारी पहल
          </p>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Driving systemic change through targeted programs designed to empower the youth, uplift the marginalized, and integrate the nation through technology and dialogue.
          </p>
        </motion.div>
      </section>

      {/* ── Initiatives List ───────────────────────────────────────── */}
      <section className="px-6 relative z-20 -mt-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="space-y-16">
            {initiatives.map((init, i) => {
              const isEven = i % 2 !== 0;
              const Icon = init.icon;
              return (
                <FadeSection key={init.id} delay={i * 100}>
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16 bg-white rounded-3xl p-6 lg:p-10 border border-[#F0D5B8] shadow-lg hover:shadow-xl transition-shadow`}>
                    
                    {/* Image Area */}
                    <div className="w-full lg:w-1/2 relative h-[300px] lg:h-[400px] rounded-2xl overflow-hidden group">
                      <img src={init.image} alt={init.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${init.color}`} />
                    </div>

                    {/* Content Area */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#FFF9F2] flex items-center justify-center border border-[#F0D5B8] mb-6 shadow-sm">
                        <Icon className="w-8 h-8 text-[#E8622A]" />
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-[#1E0F05] font-serif mb-2">
                        {init.title}
                      </h2>
                      <h3 className="text-lg font-medium text-[#F47A3A] mb-6">
                        {init.titleHi}
                      </h3>
                      <p className="text-[#7A5C45] text-lg leading-relaxed mb-8">
                        {init.description}
                      </p>
                      
                      <div>
                        <button className="px-6 py-2.5 rounded-full border border-[#E8622A] text-[#E8622A] font-semibold hover:bg-[#E8622A] hover:text-white transition-colors duration-300">
                          Learn More
                        </button>
                      </div>
                    </div>

                  </div>
                </FadeSection>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}

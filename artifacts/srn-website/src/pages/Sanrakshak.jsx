import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Building2, 
  Atom, 
  Globe, 
  Mic2, 
  Award, 
  GraduationCap, 
  BookOpen, 
  Users, 
  ChevronRight, 
  Calendar,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Flame,
  Sun
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFadeIn } from "../hooks/useFadeIn";

// Reusable animated section wrapper
function FadeSection({ children, className = "", delay = 0 }) {
  const ref = useFadeIn(0.12);
  return (
    <div ref={ref} className={`fade-in-section ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// Custom styled card for sleek photo gallery
function GalleryImageFrame({ src, alt, className = "", onClick, ratio }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className={`relative group overflow-hidden rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 bg-[#FDF5EC]/50 border border-[#F0D5B8]/80 cursor-zoom-in w-full ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {!hasError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04] block"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC] rounded-3xl border border-[#F0D5B8]/40">
          <Camera className="w-8 h-8 text-[#E8622A]/40 mb-2" />
          <span className="text-xs font-bold text-[#E8622A]/60">Image Error</span>
        </div>
      )}

      {/* Elegant Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F05]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Sleek inner glowing border */}
      <div className="absolute inset-0 border border-transparent group-hover:border-white/30 rounded-3xl transition-all duration-500 pointer-events-none" />
    </div>
  );
}

const bioData = {
  en: {
    name: "Mahamandaleshwar Swami Yatindranand Giri Maharaj",
    titleBadge: "Sanrakshak / Patron",
    degrees: "Senior Spiritual Leader of Juna Akhara",
    subtitles: [
      "Revered Senior Spiritual Leader",
      "Prominent Figure of Juna Akhara",
      "Guardian of Dharma",
      "Distinguished Orator & Philanthropist"
    ],
    aboutText: "Mahamandaleshwar Swami Yatindranand Giri Maharaj, a revered senior spiritual leader of Juna Akhara, is renowned for his profound wisdom and spiritual insights. As a prominent senior figure within Juna Akhara, he embodies ancient wisdom and devotion, captivating hearts with his teachings and dedication to the spiritual path. Residing in the sacred land of Uttarakhand, Swami Yatindranand Giri Maharaj’s life exemplifies devotion, service, and spiritual enlightenment, making him a beacon of spiritual wisdom.",
    
    sections: [
      {
        id: "education",
        title: "Education & National Service",
        shortTitle: "Education & RSS",
        subtitle: "A foundation of scientific logic and 14 years of dedicated RSS service",
        icon: GraduationCap,
        colorClass: "from-blue-500/10 to-indigo-500/10 border-blue-200/50 text-blue-600",
        items: [
          {
            title: "Bachelor of Science (B.Sc)",
            desc: "Completed higher education with a Bachelor of Science degree, forming a strong analytical and logical framework before stepping fully into public service."
          },
          {
            title: "14 Years of Dedicated RSS Service",
            desc: "Dedicated himself to the Rashtriya Swayamsevak Sangh (RSS) for 14 years, serving as a committed volunteer and pracharak (propagator). This rigorous tenure instilled deep values of discipline, selflessness, and nation-first service."
          },
          {
            title: "Humanitarian Vision",
            desc: "Committed to alleviating suffering in all forms. He drives multiple philanthropic endeavors supporting the underprivileged, offering comfort, solace, and spiritual guidance."
          }
        ]
      },
      {
        id: "sadhana",
        title: "Spiritual Awakening & Rigorous Sadhana",
        shortTitle: "Sadhana & Caves",
        subtitle: "From Sannyasa initiation in 1994 to solitary Himalayan cave meditations",
        icon: Flame,
        colorClass: "from-amber-500/10 to-orange-500/10 border-amber-200/50 text-amber-600",
        items: [
          {
            title: "Sannyasa Initiation (1994)",
            desc: "Initiated into Sannyasa on the sacred night of Mahashivratri by Shankaracharya Pujya Swami Satyamitranand Giri Ji Maharaj, the revered founder of Bharat Mata Mandir."
          },
          {
            title: "Mussoorie Deep-Cave Sadhana",
            desc: "Immersed in intense, rigorous cave sadhana in Mussoorie’s Mahatma Yogeshwar Sadhana Sadan. He spent six months in absolute isolation and darkness under dense forests, emerging back to the golden rays of the sun in spiritual enlightenment."
          },
          {
            title: "Himalayan Nilkanth Meditation",
            desc: "Ventured deeper into Nilkanth mountain caves alongside a Japanese Mahatma. Surrounded by Shri Badrinath Dham, Narayan, and Urvasi peaks, he pursued advanced meditation."
          },
          {
            title: "Sacred Ganges & Forest Sadhana",
            desc: "Performed special sadhana reciting 108 verses of Shrimad Ram Charit Manas on the banks of Sukritaal Ganges and under Lucknow's Kukarel forest area, followed by deep contemplation by the Yamuna River in Vikasnagar, Dehradun."
          }
        ]
      },
      {
        id: "mahamandaleshwar",
        title: "Elevation to Mahamandaleshwar",
        shortTitle: "Mahamandaleshwar",
        subtitle: "Crowned in 2007 by the Shri Panchdashnam Juna Akhara",
        icon: Award,
        colorClass: "from-rose-500/10 to-pink-500/10 border-rose-200/50 text-rose-600",
        items: [
          {
            title: "Titular Elevation (2007)",
            desc: "Bestowed the highly prestigious title of Mahamandaleshwar by the Shri Panchdashnam Juna Akhara in recognition of his deep sadhana, character, and spiritual leadership."
          },
          {
            title: "Preserving Sanatana Dharma",
            desc: "Plays a pivotal role in preserving and propagating the ancient spiritual traditions and philosophy of Sanatana Dharma globally."
          },
          {
            title: "Akhara Integrity and Unity",
            desc: "Upholds the values of integrity, spiritual evolution, and unity within the Akhara, fostering a large community dedicated to divine realization and selfless service."
          }
        ]
      },
      {
        id: "outreach",
        title: "Global Outreach & Spiritual Discourses",
        shortTitle: "Global Outreach",
        subtitle: "Spreading Vedic wisdom and scriptures across the globe",
        icon: Globe,
        colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-200/50 text-emerald-600",
        items: [
          {
            title: "Disseminating Scriptures Globally",
            desc: "Travelled extensively across Nepal, Tibet, Sri Lanka, Thailand, Mauritius, Cambodia, Indonesia, Malaysia, Ukraine, and beyond, delivering profound discourses on the Ramayana, Shrimad Bhagavat, and Hanuman Katha."
          },
          {
            title: "Essence of Vedanta & Yoga",
            desc: "His discourses delve deep into the absolute truths of Vedanta, Yoga, and pure Bhakti, empowering seekers to awaken their inner divinity and embrace peace."
          }
        ]
      },
      {
        id: "foundations",
        title: "Foundations, Educational Institutes & Chairman Roles",
        shortTitle: "Foundations",
        subtitle: "Creating sanctuaries for seekers and structured hubs for holistic learning",
        icon: Building2,
        colorClass: "from-purple-500/10 to-fuchsia-500/10 border-purple-200/50 text-purple-600",
        items: [
          {
            title: "Jeevandeep Seva Nyas & Gurukulam",
            desc: "Founded 'Jeevandeep Seva Nyas' and 'Jeevandeep Academy Gurukulam' to impart spiritual education, promote Vedic values, and execute welfare activities."
          },
          {
            title: "Jeevandeep Ashram Networks",
            desc: "Established sacred ashram sanctuaries in Haridwar, Roorkee, Vrindavan, Lucknow, and Hardoi for meditation, spiritual retreats, and self-realization."
          },
          {
            title: "Guardian & Chairman of Top Bodies",
            desc: "Serves as Guardian of Goshala Roorkee, All India Saints Committee, Himalaya Family, and Sindhu Darshan Yatra. Presides as Chairman over R.R. Inter College (Hardoi), Bal Vidya Bhavan (Hardoi), and Jeevandeep Seva Nyas."
          }
        ]
      }
    ]
  },
  hi: {
    name: "महामंडलेश्वर स्वामी यतीन्द्रानन्द गिरि महाराज",
    titleBadge: "संरक्षक / Sanrakshak",
    degrees: "विज्ञान स्नातक (B.Sc) | श्री पंचदशनाम जूना अखाड़ा के वरिष्ठ आध्यात्मिक संत",
    subtitles: [
      "परम आदरणीय वरिष्ठ आध्यात्मिक संत",
      "जूना अखाड़े की प्रखर विभूति",
      "धर्म एवं संस्कृति के संरक्षक",
      "अद्भुत वक्ता एवं परोपकारी मार्गदर्शक"
    ],
    aboutText: "श्री पंचदशनाम जूना अखाड़े के परम आदरणीय वरिष्ठ आध्यात्मिक संत, महामंडलेश्वर स्वामी यतीन्द्रानन्द गिरि महाराज अपनी गहन आध्यात्मिक प्रज्ञा और विवेक के लिए संपूर्ण विश्व में विख्यात हैं। जूना अखाड़े के एक शीर्ष स्तंभ के रूप में, वे प्राचीन सनातन ज्ञान और विशुद्ध भक्ति का जीवंत उदाहरण हैं। उत्तर प्रदेश के शेखपुर गाँव में एक पारंपरिक सनातन सरयूपारीण ब्राह्मण परिवार में जन्मे स्वामी जी के बाल्यकाल के संस्कारों ने उनके दिव्य जीवन की आधारशिला रखी। वर्तमान में देवभूमि उत्तराखंड में निवास करते हुए, महाराज जी का संपूर्ण जीवन सेवा, तप और लोक-कल्याण के प्रति समर्पित है।",
    
    sections: [
      {
        id: "education",
        title: "शिक्षा एवं राष्ट्रीय स्वयंसेवक संघ (RSS) सेवा",
        shortTitle: "शिक्षा एवं संघ सेवा",
        subtitle: "तार्किक विज्ञान स्नातक की शिक्षा और १४ वर्षों का अखंड राष्ट्रीय सेवा काल",
        icon: GraduationCap,
        colorClass: "from-blue-500/10 to-indigo-500/10 border-blue-200/50 text-blue-600",
        items: [
          {
            title: "विज्ञान स्नातक (B.Sc) उपाधि",
            desc: "विज्ञान स्नातक की डिग्री के साथ अपनी उच्च शिक्षा पूर्ण की, जिसने लोक सेवा और समाज कल्याण के पथ पर आगे बढ़ने से पूर्व एक मजबूत तार्किक और वैज्ञानिक दृष्टिकोण प्रदान किया।"
          },
          {
            title: "१४ वर्षों की अखंड राष्ट्रीय सेवा (RSS)",
            desc: "राष्ट्रीय स्वयंसेवक संघ (RSS) में लगातार १४ वर्षों तक स्वयंसेवक एवं पूर्णकालिक प्रचारक के रूप में अपनी सेवाएँ अर्पित कीं। इस कठोर साधना काल ने उनके भीतर अटूट अनुशासन, निस्वार्थता और देश-प्रथम के संस्कारों को रोपित किया।"
          },
          {
            title: "मानवीय करुणा एवं जनकल्याण",
            desc: "मानवता की सेवा और हर प्रकार के कष्टों के निवारण के लिए सदैव तत्पर। वे विभिन्न जनकल्याणकारी और स्वास्थ्य शिविरों के माध्यम से समाज के वंचित व निर्धन वर्गों को संबल, चिकित्सा और अध्यात्म का प्रकाश प्रदान करते हैं।"
          }
        ]
      },
      {
        id: "sadhana",
        title: "आध्यात्मिक जागरण एवं सघन साधना",
        shortTitle: "साधना एवं दीक्षा",
        subtitle: "१९९४ की संन्यास दीक्षा से लेकर हिमालय की अगम्य कंदराओं में मौन साधना",
        icon: Flame,
        colorClass: "from-amber-500/10 to-orange-500/10 border-amber-200/50 text-amber-600",
        items: [
          {
            title: "संन्यास दीक्षा (वर्ष १९९४)",
            desc: "महाशिवरात्रि के पावन पर्व पर भारत माता मंदिर के सम्मानित संस्थापक परम पूज्य स्वामी सत्यमित्रानंद गिरि जी महाराज (पूर्व शंकराचार्य) से संन्यास की दीक्षा प्राप्त की।"
          },
          {
            title: "मसूरी की कंदरा में ६ माह का मौन तप",
            desc: "मसूरी के 'महात्मा योगेश्वर साधना सदन' के घने जंगलों में जहाँ सूर्य की किरणें भी धरती को नहीं छू पाती थीं, स्वामी जी ने ६ माह तक अत्यंत कठिन एकांत मौन साधना की, जो उनके दिव्य आध्यात्मिक जागरण का आधार बनी।"
          },
          {
            title: "नीलकंठ पर्वत पर जापानी महात्मा संग ध्यान",
            desc: "हिमालय के नीलकंठ पर्वत की कंदराओं में एक जापानी महात्मा के सान्निध्य में गहन ध्यान साधना की, जहाँ श्री बद्रीनाथ धाम और नारायण पर्वत इस समाधि के मूक साक्षी बने।"
          },
          {
            title: "गंगा तट, कुकरैल वन एवं यमुना किनारे साधना",
            desc: "सुकृतताल गंगा के पावन तट पर रामचरितमानस के १०८ अखंड पाठ तथा लखनऊ के कुकरैल वन में हनुमान जी की आराधना की। अंत में विकासनगर देहरादून में यमुना किनारे दिव्य साधनाओं को गहरा किया।"
          }
        ]
      },
      {
        id: "mahamandaleshwar",
        title: "महामंडलेश्वर पद पर अभिषेक",
        shortTitle: "महामंडलेश्वर पद",
        subtitle: "वर्ष २००७ में श्री पंचदशनाम जूना अखाड़ा द्वारा सर्वोच्च अभिषेक",
        icon: Award,
        colorClass: "from-rose-500/10 to-pink-500/10 border-rose-200/50 text-rose-600",
        items: [
          {
            title: "महामंडलेश्वर अभिषेक (२००७)",
            desc: "उनकी कठोर तपस्या, सेवा और प्रखर वक्तृत्व क्षमता को देखते हुए वर्ष २००७ में श्री पंचदशनाम जूना अखाड़े द्वारा उन्हें 'महामंडलेश्वर' की सर्वोच्च और गरिमामयी उपाधि से विभूषित किया गया।"
          },
          {
            title: "सनातन परंपराओं का संरक्षण",
            desc: "महामंडलेश्वर के रूप में स्वामी जी सनातन धर्म की प्राचीन परंपराओं, वेदों के दिव्य संदेश और संस्कृति के संरक्षण में वैश्विक स्तर पर अग्रणी भूमिका निभा रहे हैं।"
          },
          {
            title: "अखाड़े की गरिमा एवं शुचिता",
            desc: "जूना अखाड़े की शुचिता, संगठन और चेतना को जागृत रखते हुए संन्यासियों के कल्याण और समाज के आध्यात्मिक उत्थान का मार्गदर्शन कर रहे हैं।"
          }
        ]
      },
      {
        id: "outreach",
        title: "वैश्विक धर्म-प्रचार एवं आध्यात्मिक प्रवचन",
        shortTitle: "वैश्विक धर्म-प्रचार",
        subtitle: "भौगोलिक सीमाओं से परे वेदों, रामायण और श्रीमद्भागवत का अमर संदेश",
        icon: Globe,
        colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-200/50 text-emerald-600",
        items: [
          {
            title: "वैश्विक सनातन जागृति",
            desc: "नेपाल, तिब्बत, श्रीलंका, थाईलैंड, मॉरीशस, कंबोडिया, इंडोनेशिया, मलेशिया और यूक्रेन आदि देशों की यात्राएं कर वहां के लोगों को रामायण, श्रीमद्भागवत कथा और हनुमान कथा के माध्यम से सनातन संस्कृति की दिव्य प्रज्ञा से अवगत कराया।"
          },
          {
            title: "वेदांत और भक्ति का मर्म",
            desc: "उनके प्रवचन वेदांत, योग और शुद्ध भक्ति के मर्म पर केंद्रित होते हैं, जो वैश्विक स्तर पर अशांत मानव मन को शांति, आत्म-साक्षात्कार और ईश्वर-प्रेम का मार्ग दिखाते हैं।"
          }
        ]
      },
      {
        id: "foundations",
        title: "संस्थागत नींव, गुरुकुल एवं शैक्षणिक संस्थान",
        shortTitle: "संस्थाएँ व आश्रम",
        subtitle: "साधकों के लिए आश्रमों और युवाओं के लिए गुरुकुलों का राष्ट्रव्यापी निर्माण",
        icon: Building2,
        colorClass: "from-purple-500/10 to-fuchsia-500/10 border-purple-200/50 text-purple-600",
        items: [
          {
            title: "जीवनदीप सेवा न्यास एवं गुरुकुल",
            desc: "युवाओं को प्राचीन वैदिक मूल्यों के साथ आधुनिक शिक्षा प्रदान करने हेतु 'जीवनदीप सेवा न्यास' और 'जीवनदीप गुरुकुल अकादमी' की स्थापना की।"
          },
          {
            title: "जीवनदीप आश्रम श्रृंखला",
            desc: "हरिद्वार, रुड़की, वृंदावन, लखनऊ और हरदोई में दिव्य 'जीवनदीप आश्रमों' की स्थापना की, जो साधकों के लिए ध्यान, एकांत चिंतन और समाधि के पावन केंद्र हैं।"
          },
          {
            title: "संरक्षक एवं अध्यक्ष के रूप में प्रशासनिक योगदान",
            desc: "अखिल भारतीय संत समिति, गौशाला रुड़की, हिमालय परिवार, और सिंधु दर्शन यात्रा के संरक्षक हैं। जीवनदीप न्यास, बाल विद्या भवन (हरदोई) और आर.आर. इंटर कॉलेज के अध्यक्ष के रूप में शिक्षा क्षेत्र में अग्रणी हैं।"
          }
        ]
      }
    ]
  }
};

export default function Sansrakshak() {
  const { lang } = useLanguage();
  const en = lang === "en";
  const data = en ? bioData.en : bioData.hi;

  const [activeTab, setActiveTab] = useState("education");
  const [profileImageError, setProfileImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en 
      ? "Sashakt Rashtra Nirman – Patron (Sanrakshak)" 
      : "सशक्त राष्ट्र निर्माण – संरक्षक (Sanrakshak)";
  }, [en]);

  const activeSectionData = data.sections.find(s => s.id === activeTab);
  const ActiveIcon = activeSectionData?.icon || Heart;

  return (
    <div className="bg-[#FDF5EC] min-h-screen pb-20">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#FFF9F2] via-[#FDF5EC] to-[#FFF5EB] py-36 text-center px-6 overflow-hidden min-h-[44vh] flex items-center justify-center border-b border-[#F0D5B8]/40">
        
        {/* Static background hero */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-multiply opacity-30"
          style={{ backgroundImage: "url('/sansrakshak_monochrome_bg.png')" }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 28px)` }}
        />
        
        {/* Colorful Light-Theme Glow accents */}
        <div className="absolute inset-0 hero-glow pointer-events-none opacity-40 mix-blend-multiply" />
        <div className="absolute top-8 left-12 w-48 h-48 rounded-full bg-[#E8622A]/15 blur-3xl" />
        <div className="absolute bottom-8 right-12 w-40 h-40 rounded-full bg-[#D4880C]/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-[#5C1010]/5 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            {en ? "Sanrakshak (Patron)" : "संरक्षक (Sanrakshak)"}
          </h1>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-6 mx-auto w-24 rounded-full origin-center shadow-sm"
          />
        </motion.div>
      </section>

      {/* ── Profile & Intro Section ─────────────────────────────────── */}
      <section className="relative px-6 -mt-16 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-[#F0D5B8] rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden card-shimmer">
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#FDF5EC]/50 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
              
              {/* Profile Image Frame with Robust Placeholder handling */}
              <div className="w-full max-w-sm lg:w-[350px] h-[350px] lg:h-[420px] rounded-3xl overflow-hidden shrink-0 border-4 border-[#E8622A] shadow-lg relative bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC] flex items-center justify-center group">
                {!profileImageError ? (
                  <img 
                    src="/Swami yatindranand giri maharaj.jpeg" 
                    alt={data.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    onError={() => setProfileImageError(true)}
                  />
                ) : null}

                {profileImageError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-[#E8622A]/30 m-2.5 rounded-xl bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC]">
                    <div className="w-14 h-14 rounded-full bg-[#E8622A]/10 flex items-center justify-center text-[#E8622A] mb-3 relative animate-pulse">
                      <Sun className="w-7 h-7 text-[#E8622A]" />
                      <Flame className="w-4 h-4 text-[#E8622A] absolute bottom-1 right-1" />
                    </div>
                    <span className="text-[10px] font-bold text-[#E8622A] tracking-widest uppercase bg-[#E8622A]/10 px-2 py-0.5 rounded-full mb-1">
                      Upload Portrait
                    </span>
                    <span className="text-[9px] text-[#7A5C45] font-mono leading-none bg-white border border-[#F0D5B8] px-1 py-0.5 rounded">
                      sanrakshak_portrait.png
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight">
                  {data.name}
                </h2>
                
                <p className="text-sm font-semibold text-[#E8622A] mt-2 inline-flex items-center bg-[#E8622A]/10 px-3 py-1 rounded-full border border-[#E8622A]/20">
                  {data.degrees}
                </p>

                {/* Subtitles badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                  {data.subtitles.map((title, idx) => (
                    <span 
                      key={idx}
                      className="bg-[#FFF9F2] border border-[#F0D5B8] text-[#7A5C45] text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:border-[#E8622A]/30 transition-all duration-300"
                    >
                      {title}
                    </span>
                  ))}
                </div>

                <div className="w-full h-px bg-[#F0D5B8] my-6" />

                {/* Opening blockquote description */}
                <p className="text-[#1E0F05] text-base md:text-lg leading-relaxed italic text-left relative pl-6 border-l-4 border-[#E8622A]">
                  "{data.aboutText}"
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Accomplishments Tabbed Viewer ───────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#5C1010] font-serif">
              {en ? "Spiritual Legacy & Achievements" : "आध्यात्मिक यात्रा एवं प्रखर सेवा"}
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#E8622A] to-transparent mt-3 mx-auto w-48 rounded-full" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Sidebar Navigation (Tabs) */}
            <div className="w-full lg:w-1/4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none shrink-0 sticky top-24 z-20">
              {data.sections.map((sec) => {
                const TabIcon = sec.icon;
                const isSelected = activeTab === sec.id;
                
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border text-[13px] font-semibold transition-all duration-300 whitespace-nowrap lg:whitespace-normal text-left shrink-0 lg:shrink w-auto lg:w-full group ${
                      isSelected 
                        ? "bg-[#E8622A] border-[#E8622A] text-white shadow-lg shadow-orange-700/15 -translate-y-0.5 lg:translate-x-1" 
                        : "bg-white border-[#F0D5B8] text-[#7A5C45] hover:border-[#E8622A]/50 hover:bg-[#FFF9F2] hover:-translate-y-px"
                    }`}
                  >
                    <TabIcon className={`w-4.5 h-4.5 shrink-0 transition-colors ${isSelected ? "text-white" : "text-[#E8622A] group-hover:scale-110 duration-300"}`} />
                    <span className="truncate lg:normal-case">{sec.shortTitle}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Display Area */}
            <div className="w-full lg:w-3/4 min-h-[440px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="bg-white border border-[#F0D5B8] rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden"
                >
                  <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-20 bg-current ${activeSectionData?.colorClass.split(' ')[2]}`} />

                  {/* Section Title details */}
                  <div className="flex items-start gap-4 mb-6 pb-4 border-b border-[#F0D5B8]/60">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${activeSectionData?.colorClass.split(' ')[0]} ${activeSectionData?.colorClass.split(' ')[1]} border border-white/40 shadow-sm shrink-0`}>
                      <ActiveIcon className={`w-6 h-6 ${activeSectionData?.colorClass.split(' ')[3]}`} />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-bold text-[#5C1010] font-serif leading-tight">
                        {activeSectionData?.title}
                      </h4>
                      <p className="text-sm text-[#7A5C45] mt-1 font-medium leading-relaxed text-left">
                        {activeSectionData?.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Accomplishment Bullet Cards Grid */}
                  <div className="grid grid-cols-1 gap-5">
                    {activeSectionData?.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.07 }}
                        className="flex gap-4 p-5 rounded-2xl bg-[#FFF9F2] border border-[#F0D5B8]/40 hover:border-[#E8622A]/30 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="mt-1 shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-[#E8622A] group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="text-left">
                          <h5 className="font-bold text-[#1E0F05] text-base leading-snug group-hover:text-[#5C1010] transition-colors">
                            {item.title}
                          </h5>
                          <p className="text-[#7A5C45] text-sm leading-relaxed mt-2.5">
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* ── Photo Highlights Section (User-Managed Empty Frame Gallery) ────────────────── */}
      <section className="py-16 px-6 bg-[#FFF9F2] relative overflow-hidden border-t border-b border-[#F0D5B8]/50">
        <div className="absolute left-0 top-0 w-64 h-64 bg-[#E8622A]/3 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          
          <div className="text-center mb-12">
            <span className="inline-block bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#F47A3A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              {en ? "Divine Moments" : "दिव्य क्षण एवं संस्मरण"}
            </span>
            <h3 className="text-3xl font-bold text-[#5C1010] font-serif">
              {en ? "Historical Milestones & Gallery" : "ऐतिहासिक संस्मरण एवं चित्र दीर्घा"}
            </h3>
            <p className="text-[#7A5C45] text-sm mt-3 max-w-xl mx-auto leading-relaxed">
              {en
                ? "A glimpse into the life of Swami Yatindranand Giri Maharaj, featuring key moments of national service, spiritual rituals, and meetings with distinguished leaders."
                : "स्वामी यतीन्द्रानन्द गिरि महाराज की राष्ट्र सेवा, सघन साधना और देश के शीर्ष नेतृत्व के साथ ऐतिहासिक मुलाकातों की कुछ झलकियाँ।"}
            </p>
            <div className="h-1 bg-gradient-to-r from-transparent via-[#E8622A] to-transparent mt-4 mx-auto w-32 rounded-full" />
          </div>

          {/* Refined Photographic Gallery: Mathematically-Balanced Bento Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
            {[
              // Column 1
              [
                { src: "/WhatsApp Image 2026-06-01 at 22.34.10 (2).jpeg", ratio: 784/1280 },
                { src: "/Mahamandaleshwar-Swami-Yatindranand-Giri-Maharaj-with-cm-of-Uttrakhaand-Pushkar-Dhami-1024x934.jpg", ratio: 1024/934 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.12 (1).jpeg", ratio: 1170/909 },
                { src: "/Mahamandaleshwar-Swami-Yatindranand-Giri-Maharaj-with-indias-prime-minister-narendra-modi.jpg", ratio: 1280/885 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.09 (1).jpeg", ratio: 1280/853 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.08.jpeg", ratio: 1002/576 }
              ],
              // Column 2
              [
                { src: "/WhatsApp Image 2026-06-01 at 22.34.10.jpeg", ratio: 788/1280 },
                { src: "/Mahamandaleshwar-Swami-Yatindranand-Giri-Maharaj-with-uttar-pradesh-cheif-minister-manik-yogi-adityanath.-jpg.jpg", ratio: 909/899 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.09.jpeg", ratio: 1280/960 },
                { src: "/Mahamandaleshwar-Swami-Yatindranand-Giri-Maharaj-with-tripura-cheif-minister-manik-shah.jpg", ratio: 1600/1067 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.11 (1).jpeg", ratio: 1280/853 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.09 (2).jpeg", ratio: 1280/591 }
              ],
              // Column 3
              [
                { src: "/WhatsApp Image 2026-06-01 at 22.34.08 (1).jpeg", ratio: 768/1024 },
                { src: "/Mahamandaleshwar-Swami-Yatindranand-Giri-Maharaj-doing-rituals-at-holy-haridwar.jpg", ratio: 1042/1250 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.11.jpeg", ratio: 876/752 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.08 (3).jpeg", ratio: 960/640 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.10 (1).jpeg", ratio: 1280/824 }
              ],
              // Column 4
              [
                { src: "/Mahamandaleshwar-Swami-Yatindranand-Giri-Maharaj-with-Acharya-Mahamandaleshwar-Swami-Avdheshanand-Giri-of-Juna-Akhara.jpg", ratio: 1208/1600 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.07.jpeg", ratio: 720/934 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.11 (2).jpeg", ratio: 960/720 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.08 (2).jpeg", ratio: 960/640 },
                { src: "/WhatsApp Image 2026-06-01 at 22.34.12.jpeg", ratio: 1280/853 }
              ]
            ].map((column, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-5">
                {column.map((item, imgIdx) => (
                  <GalleryImageFrame 
                    key={imgIdx}
                    src={item.src} 
                    ratio={item.ratio}
                    alt={`Gallery Moment ${colIdx + 1}-${imgIdx + 1}`} 
                    onClick={() => setSelectedImage(item.src)}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-8 backdrop-blur-md cursor-zoom-out"
                onClick={() => setSelectedImage(null)}
              >
                <motion.button 
                  className="absolute top-6 right-6 text-white/75 hover:text-white bg-white/10 hover:bg-white/20 p-3.5 rounded-full transition-all duration-300 z-50 shadow-lg hover:scale-105"
                  onClick={() => setSelectedImage(null)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="relative max-w-5xl max-h-[85vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={selectedImage} 
                    alt="Enlarged gallery view" 
                    className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-white/10"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* ── Dynamic Antyodaya Footer Callout ─────────────────────────── */}
      <section className="px-6 py-12 bg-[#FFF9F2]">
        <div className="max-w-4xl mx-auto">
          <FadeSection>
            <div className="relative rounded-3xl bg-white border border-[#F0D5B8] p-8 md:p-12 text-center overflow-hidden shadow-lg">
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#E8622A]/10 blur-3xl" />
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#D4880C]/10 blur-3xl" />
              <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 28px)` }} />
              
              <span className="inline-block bg-[#E8622A]/10 border border-[#E8622A]/30 text-[#E8622A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                {en ? "Legacy of Devotion" : "सनातन संस्कृति एवं अखंड सेवा"}
              </span>

              <h4 className="text-2xl md:text-3xl font-serif font-bold text-[#5C1010] leading-tight">
                {en ? "Preserving Sanatana & Serving Humanity" : "सनातन का संरक्षण और मानवता की निस्वार्थ सेवा"}
              </h4>
              
              <p className="text-[#7A5C45] text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
                {en 
                  ? "Mahamandaleshwar Swami Yatindranand Giri Maharaj stands as a beacon of light and inspiration, guiding countless souls on their spiritual journeys and igniting the flame of divine love and national duty."
                  : "महामंडलेश्वर स्वामी यतीन्द्रानन्द गिरि महाराज का संपूर्ण जीवन साधना, राष्ट्र-भक्ति और लोक-कल्याण का एक अनुपम संगम है। वे निरंतर समाज में निस्वार्थ सेवा का प्रचार कर हर हृदय में दिव्य प्रेम एवं राष्ट्रधर्म की ज्योति प्रज्वलित कर रहे हैं।"}
              </p>
              
              <div className="mt-8 flex justify-center">
                <div className="w-16 h-0.5 rounded-full bg-gradient-to-r from-[#E8622A] to-[#D4880C]" />
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

    </div>
  );
}

// Reusable micro-component for accomplishment bullet list checkmarks
function CheckCircle2({ className }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

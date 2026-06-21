import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera,
  Flame,
  Sun,
  Heart,
  Building2,
  Atom,
  Globe,
  Mic2
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
      style={{ aspectRatio: 1 }}
    >
      {!hasError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04] block"
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
    name: "Dr. Manoj Kumar Shukla",
    degrees: "B.Tech (CSE), M.Tech (CSE), & Ph.D (CSE) from IIT (ISM) Dhanbad",
    subtitles: [
      "Popular Social Activist",
      "Strong Nationalist Thinker",
      "Eminent Educationist",
      "Computer Scientist",
      "Adapt Policy Expert"
    ],
    aboutText: "Dr. Manoj Kumar Shukla is a versatile and eminent personality who simultaneously embodies academic excellence, strategic thinking, cutting-edge technological innovation, and grassroots social service. Inspired by the development vision of India's illustrious Prime Minister, Shri Narendra Modi—which integrates Good Governance, Nation Building, and Antyodaya (upliftment of the last person)—Dr. Shukla has materialized this philosophy in every field of his work. His working style reflects the strategic clarity of a true think-tank, where analysis is deep, decisions are resolute, and direction is assured.",

    sections: [
      {
        id: "responsibility",
        title: "Social Responsibility",
        shortTitle: "Social Work",
        subtitle: "Unwavering commitment to serving the last person in society and preserving Indian cultural heritage",
        icon: Heart,
        colorClass: "from-rose-500/10 to-pink-500/10 border-rose-200/50 text-rose-600",
        items: [
          {
            title: "COVID-19 Pandemic Service",
            desc: "Exhibiting deep compassion during the crisis, he actively organized food distribution for over 1,000 people daily, provided relief to the underprivileged, and facilitated safe travel."
          },
          {
            title: "Free Pilgrimages",
            desc: "To preserve and nurture Indian cultural values and traditions, he organized free pilgrimages for thousands of senior citizens, facilitating sacred visits."
          },
          {
            title: "Grassroots Involvement",
            desc: "Involved in social service since childhood, playing a leading role in local disaster relief, health camps, and blood donation drives."
          },
          {
            title: "Youth Leadership Building",
            desc: "Conducting inspiring workshops for youth and students to promote physical development, leadership skills, personality building, and Indian cultural values."
          }
        ]
      },
      {
        id: "policy",
        title: "Policy & Administration",
        shortTitle: "Policy & Admin",
        subtitle: "Eminent administrative and policy roles entrusted by top national bodies",
        icon: Building2,
        colorClass: "from-amber-500/10 to-orange-500/10 border-amber-200/50 text-amber-600",
        items: [
          {
            title: "Ministry of Civil Aviation (Govt. of India)",
            desc: "Nominated member of the Advisory Committee for Gorakhpur Airport under the Airports Authority of India (AAI)."
          },
          {
            title: "DRDO (Ministry of Defence, Govt. of India)",
            desc: "Distinguished service as a member of the peer-reviewed expert committee on highly sensitive matters concerning national security, defence, and advanced military technology."
          },
          {
            title: "Union Ministry of Skill Development (DGET)",
            desc: "Active role in the Moderation Board constituted for youth self-reliance, vocational training, and the grassroots implementation of the National Education Policy (NEP)."
          },
          {
            title: "Institutional Integrity & Transparent Governance",
            desc: "Successfully implemented strict discipline, transparency, and a zero-corruption policy as Centre Superintendent for highly sensitive and prestigious national examinations, including AIIMS, Allahabad High Court, GATE, UPPCL, RBI, SEBI, and IBPS."
          },
          {
            title: "Academic Leadership",
            desc: "Served in prestigious positions as Professor and former Dean, efficiently managing policy formulation and large administrative setups in higher education institutions."
          }
        ]
      },
      {
        id: "research",
        title: "Research & Innovation",
        shortTitle: "Research & Tech",
        subtitle: "Global footprint in computer science, scientific research, and academic mentorship",
        icon: Atom,
        colorClass: "from-blue-500/10 to-indigo-500/10 border-blue-200/50 text-blue-600",
        items: [
          {
            title: "Research Mentorship",
            desc: "As a dedicated mentor, he has successfully guided and supervised more than 10 Ph.D. scholars and a large number of B.Tech and M.Tech students in their research projects."
          },
          {
            title: "Publications & Authorship",
            desc: "Published over 150 high-quality research papers in prestigious international journals and conferences. Additionally, authored several technical volumes that are widely accepted as standard reference books."
          },
          {
            title: "COSMIC Outstanding Researcher Award",
            desc: "Honored in Bangkok, Thailand (January 2016) with this prestigious international award for distinguished and unique contributions to Computer Science and Engineering."
          },
          {
            title: "Best Teacher Award",
            desc: "Honored by the then Vice-Chancellor of Uttar Pradesh Technical University (UPTU) in September 2014 for unique and outstanding contributions to teaching and research."
          }
        ]
      },
      {
        id: "global",
        title: "Global Editorial & Professional Roles",
        shortTitle: "Global Presence",
        subtitle: "Academic and technology presence across major global panels and professional networks",
        icon: Globe,
        colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-200/50 text-emerald-600",
        items: [
          {
            title: "Editorial Board Memberships",
            desc: "Honored member of the editorial boards of several premier journals such as the American Journal of Database Theory and Application, IJSER, IJACT, IJAIS, IJCIIS, IJCST, IJETTCS, etc."
          },
          {
            title: "Technical Reviewer",
            desc: "Serves as an active reviewer for IEEE-sponsored international conferences, the CSI Journal of Computing, and high-impact journals like IJSCE."
          },
          {
            title: "Global Professional Memberships",
            desc: "Esteemed member of leading global bodies in computing and engineering, including ACM (Association for Computing Machinery), CSI (Computer Society of India), ISTE, IETE, IAENG, WSEAS, etc."
          }
        ]
      },
      {
        id: "public",
        title: "Public Voice & Antyodaya",
        shortTitle: "Public Dialogue",
        subtitle: "Fostering national dialogue and advocating for the last individual in society",
        icon: Mic2,
        colorClass: "from-purple-500/10 to-fuchsia-500/10 border-purple-200/50 text-purple-600",
        items: [
          {
            title: "Media & Publications",
            desc: "His deep analytical articles on national policy, technology, development, and social issues are regularly published in print media, digital media, and national newspapers."
          },
          {
            title: "National Debates",
            desc: "Established as a trusted, eloquent, and nationalistic ideological speaker on various leading national news channels."
          },
          {
            title: "Keynote Speaker",
            desc: "Invited as a keynote speaker and chairperson at numerous national and international universities and public forums. His speeches are a remarkable blend of facts, logic, patriotism, and social sensitivity."
          },
          {
            title: "Commitment to the Last Individual (Antyodaya)",
            desc: "Resolving the issues of the underprivileged, backward, and exploited segments is his core calling. He is a strong advocate for ensuring that the benefits of every government welfare scheme reach the person at the very end of the line with absolute integrity."
          }
        ]
      }
    ]
  },
  hi: {
    name: "डॉ. मनोज कुमार शुक्ला",
    degrees: "B.Tech (CSE), M.Tech (CSE) , & Ph.D (CSE) from IIT (ISM) Dhanbad",
    subtitles: [
      "लोकप्रिय जन-सेवक",
      "प्रखर राष्ट्रवादी विचारक",
      "प्रख्यात शिक्षाविद्",
      "कंप्यूटर वैज्ञानिक",
      "कुशल नीति-विशेषज्ञ"
    ],
    aboutText: "डॉ. मनोज कुमार शुक्ला एक ऐसी बहुमुखी और प्रखर विभूति हैं जो अकादमिक उत्कृष्टता, रणनीतिक सोच, अत्याधुनिक तकनीकी नवाचार और जमीनी जन-सेवा को एकसाथ जीते हैं। देश के यशस्वी प्रधानमंत्री नरेन्द्र मोदी जी की उस विकास-दृष्टि से प्रेरित—जो सुशासन (Governance), राष्ट्रनिर्माण और अंत्योदय को एकसूत्र में पिरोती है—डॉ. शुक्ला ने अपने हर कार्यक्षेत्र में इसी सोच को मूर्त रूप दिया है। उनकी कार्यशैली में एक सच्चे थिंकटैंक की रणनीतिक स्पष्टता झलकती है—जहाँ विश्लेषण गहरा, निर्णय दृढ़ और दिशा सुनिश्चित होती है।",

    sections: [
      {
        id: "responsibility",
        title: "सामाजिक सेवा (Social Responsibility)",
        shortTitle: "सामाजिक सेवा",
        subtitle: "समाज के अंतिम पायदान पर खड़े व्यक्ति की सेवा और भारतीय सांस्कृतिक संवर्धन के प्रति अतूट प्रतिबद्धता",
        icon: Heart,
        colorClass: "from-rose-500/10 to-pink-500/10 border-rose-200/50 text-rose-600",
        items: [
          {
            title: "कोविड-19 महामारी सेवा",
            desc: "संकट की कठिन घड़ी में संवेदनशीलता का परिचय देते हुए प्रतिदिन 1000 से अधिक लोगों तक भोजन पहुँचाने की सक्रिय व्यवस्था की, वंचितों को राहत दी तथा उनके आवागमन का समुचित प्रबंध किया।"
          },
          {
            title: "निःशुल्क तीर्थ यात्रा",
            desc: "भारतीय सांस्कृतिक मूल्यों एवं परंपराओं के संरक्षण हेतु हजारों वरिष्ठ नागरिकों के लिए निःशुल्क तीर्थ यात्राओं का आयोजन करवाकर पवित्र दर्शन कराए।"
          },
          {
            title: "जमीनी सहभागिता",
            desc: "बाल्यकाल से ही सामाजिक सेवा से जुड़ाव। स्थानीय स्तर पर आपदा राहत कार्यों, स्वास्थ्य शिविरों एवं रक्तदान अभियानों के सफल संचालन में अग्रणी भूमिका।"
          },
          {
            title: "युवा नेतृत्व निर्माण",
            desc: "युवाओं और विद्यार्थियों के मध्य शारीरिक विकास, नेतृत्व क्षमता (Leadership), व्यक्तित्व निर्माण और भारतीय सांस्कृतिक मूल्यों के संवर्धन हेतु प्रेरक कार्यशालाओं का संचालन।"
          }
        ]
      },
      {
        id: "policy",
        title: "नीति, प्रशासन एवं राष्ट्रीय स्तर पर महत्वपूर्ण भूमिकाएँ",
        shortTitle: "नीति एवं प्रशासन",
        subtitle: "भारत सरकार और देश के शीर्ष नीति-नियामक एवं प्रशासनिक निकायों द्वारा सौंपी गई महत्वपूर्ण जिम्मेदारियाँ",
        icon: Building2,
        colorClass: "from-amber-500/10 to-orange-500/10 border-amber-200/50 text-amber-600",
        items: [
          {
            title: "नागरिक उड्डयन मंत्रालय (भारत सरकार)",
            desc: "भारतीय विमानपत्तन प्राधिकरण (AAI) के अंतर्गत गोरखपुर हवाई अड्डे की सलाहकार समिति में मनोनीत सदस्य।"
          },
          {
            title: "DRDO (रक्षा मंत्रालय, भारत सरकार)",
            desc: "देश की रक्षा, अत्याधुनिक सैन्य प्रौद्योगिकी और राष्ट्रीय सुरक्षा जैसे अति-संवेदनशील विषयों पर गठित peer-reviewed विशेषज्ञ समिति में बतौर सदस्य विशिष्ट सेवाएँ।"
          },
          {
            title: "केन्द्रीय कौशल विकास मंत्रालय (DGET)",
            desc: "युवाओं के स्वावलंबन, व्यावसायिक प्रशिक्षण और राष्ट्रीय शिक्षा-नीति के जमीनी क्रियान्वयन के लिए गठित मॉडरेशन बोर्ड में सक्रिय भूमिका।"
          },
          {
            title: "संस्थागत शुचिता और पारदर्शी प्रशासन",
            desc: "AIIMS, इलाहाबाद उच्च न्यायालय, GATE, UPPCL, RBI, SEBI एवं IBPS सहित देश की अत्यंत संवेदनशील और प्रतिष्ठित राष्ट्रीय परीक्षाओं में केन्द्र अधीक्षक (Centre Superintendent) के रूप में कठोर अनुशासन, पारदर्शिता और जीरो-करप्शन की नीति को सफलतापूर्वक लागू किया।"
          },
          {
            title: "अकादमिक नेतृत्व",
            desc: "प्रोफेसर एवं पूर्व डीन के गरिमामयी पदों पर रहते हुए उच्च शिक्षण संस्थानों में नीति-निर्माण और बड़े प्रशासनिक ढांचे को कुशलतापूर्वक संभाला।"
          }
        ]
      },
      {
        id: "research",
        title: "शोध, तकनीकी नवाचार एवं वैश्विक पहचान",
        shortTitle: "शोध एवं नवाचार",
        subtitle: "एक कंप्यूटर वैज्ञानिक और शोधकर्ता के रूप में डॉ. शुक्ला का अंतर्राष्ट्रीय स्तर पर योगदान",
        icon: Atom,
        colorClass: "from-blue-500/10 to-indigo-500/10 border-blue-200/50 text-blue-600",
        items: [
          {
            title: "शोध मार्गदर्शन (Mentorship)",
            desc: "एक समर्पित मार्गदर्शक के रूप में अब तक 10 से अधिक Ph.D. शोधार्थियों तथा बड़ी संख्या में B.Tech और M.Tech के विद्यार्थियों के शोध-प्रकल्पों को सफलतापूर्वक निर्देशित कर सफल परिणति दी है।"
          },
          {
            title: "शोध पत्र एवं ग्रन्थ रचना",
            desc: "अंतर्राष्ट्रीय स्तर की प्रतिष्ठित पत्रिकाओं (Journals) और सम्मेलनों में 150 से अधिक उच्च-गुणवत्ता वाले शोध-पत्र प्रकाशित। इसके साथ ही अनेक तकनीकी ग्रन्थों की रचना की, जो आज सन्दर्भ-ग्रन्थ (Reference Books) के रूप में स्वीकृत हैं।"
          },
          {
            title: "COSMIC Outstanding Researcher Award",
            desc: "🏆 अंतर्राष्ट्रीय स्तर, जनवरी 2016: कंप्यूटर विज्ञान और इंजीनियरिंग के क्षेत्र में विशिष्ट एवं अद्वितीय योगदान के लिए बैंकॉक, थाईलैंड में इस प्रतिष्ठित पुरस्कार से सम्मानित।"
          },
          {
            title: "बेस्ट Teacher अवार्ड",
            desc: "🏆 सर्वश्रेष्ठ शिक्षक पुरस्कार, सितंबर 2014: शिक्षण और अनुसंधान के क्षेत्र में अद्वितीय योगदान के लिए डॉ. आर. के. खांडल (तत्कालीन कुलपति, उत्तर प्रदेश तकनीकी विश्वविद्यालय - UPTU) द्वारा सम्मानित।"
          }
        ]
      },
      {
        id: "global",
        title: "वैश्विक संपादकीय भूमिकाएँ एवं व्यावसायिक सदस्यता",
        shortTitle: "वैश्विक भूमिका",
        subtitle: "अमेरिका, ब्रिटेन, पोलैंड, मलेशिया, बहरीन आदि विभिन्न देशों के प्रमुख अंतर्राष्ट्रीय सम्मेलनों में शैक्षणिक और तकनीकी जगत में योगदान",
        icon: Globe,
        colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-200/50 text-emerald-600",
        items: [
          {
            title: "संपादकीय बोर्ड की सदस्यता (Editorial Board)",
            desc: "American Journal of Database Theory and Application, IJSER, IJACT, IJAIS, IJCIIS, IJCST, IJETTCS जैसी कई प्रीमियर पत्रिकाओं के सम्मानित संपादकीय बोर्ड सदस्य हैं।"
          },
          {
            title: "तकनीकी समीक्षक (Reviewer)",
            desc: "IEEE द्वारा प्रायोजित अंतर्राष्ट्रीय सम्मेलनों, CSI Journal of Computing, और IJSCE जैसी उच्च-प्रभाव वाली पत्रिकाओं के लिए एक सक्रिय समीक्षक के रूप में कार्यरत।"
          },
          {
            title: "प्रतिष्ठित व्यावसायिक सदस्यता (Professional Memberships)",
            desc: "वे कंप्यूटर जगत के शीर्ष वैश्विक निकायों जैसे ACM (एसोसिएशन फॉर कंप्यूटिंग मशीनरी), CSI (कंप्यूटर सोसाइटी ऑफ इंडिया), ISTE, IETE, IANG, WSEAS आदि के सम्मानित सदस्य हैं।"
          }
        ]
      },
      {
        id: "public",
        title: "प्रखर सार्वजनिक बौद्धिक, वक्ता एवं अंत्योदय",
        shortTitle: "सार्वजनिक विमर्श",
        subtitle: "देश के ज्वलंत और नीतिगत मुद्दों पर एक विश्वसनीय, प्रखर और तार्किक आवाज तथा अंत्योदय के प्रति अटूट प्रतिबद्धता",
        icon: Mic2,
        colorClass: "from-purple-500/10 to-fuchsia-500/10 border-purple-200/50 text-purple-600",
        items: [
          {
            title: "मीडिया एवं लेखन",
            desc: "राष्ट्रनीति, तकनीक, विकास और सामाजिक विषयों पर उनके गहरे वैचारिक आलेख प्रिंट मीडिया, डिजिटल मीडिया and राष्ट्रीय समाचार-पत्रों में नियमित रूप से प्रकाशित होते हैं।"
          },
          {
            title: "राष्ट्रीय विमर्श",
            desc: "विभिन्न प्रमुख राष्ट्रीय समाचार चैनलों (National News Channels) पर एक विश्वसनीय, प्रखर और राष्ट्र-वैचारिक वक्ता के रूप में स्थापित।"
          },
          {
            title: "मुख्य वक्ता (Keynote Speaker)",
            desc: "देश-विदेश के अनेक विश्वविद्यालयों और सार्वजनिक मंचों पर मुख्य वक्ता एवं अध्यक्ष के रूप में आमंत्रित। उनके वक्तव्य हमेशा तथ्य, तर्क, राष्ट्रनिष्ठा और संवेदनशीलता का बेजोड़ सम्मिश्रण होते हैं।"
          },
          {
            title: "अंत्योदय और जन-सेवा के प्रति अटूट प्रतिबद्धता",
            desc: "वंचितों, पिछड़ों और शोषितों की समस्याओं का समाधान करना उनका मूल स्वभाव है। वे इस विचार के प्रबल पक्षधर हैं कि सरकार की हर कल्याणकारी योजना का लाभ समाज की अंतिम पंक्ति में खड़े व्यक्ति तक पूरी ईमानदारी से पहुँचना चाहिए।"
          }
        ]
      }
    ]
  }
};

export default function NationalPresident() {
  const { lang } = useLanguage();
  const en = lang === "en";
  const data = en ? bioData.en : bioData.hi;

  const [profileImageError, setProfileImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en
      ? "Sashakt Rashtra Nirman – National President"
      : "सशक्त राष्ट्र निर्माण – राष्ट्रीय अध्यक्ष";
  }, [en]);

  return (
    <div className="bg-[#FDF5EC] min-h-screen pb-20">

      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#FFF9F2] via-[#FDF5EC] to-[#FFF5EB] py-36 text-center px-6 overflow-hidden min-h-[44vh] flex items-center justify-center border-b border-[#F0D5B8]/40">

        {/* Static background hero */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat mix-blend-multiply opacity-30"
          style={{ backgroundImage: "url('/president_monochrome_bg.png')" }}
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
          <h1 className="text-4xl md:text-6xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            {en ? "National President" : "राष्ट्रीय अध्यक्ष"}
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
            {/* Background elements */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-[#FDF5EC]/50 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">

              {/* Profile Image container (Enlarged to take up prominent left-hand side block space) */}
              <div className="w-full max-w-sm lg:w-[350px] h-[350px] lg:h-[420px] rounded-3xl overflow-hidden shrink-0 border-4 border-[#E8622A] shadow-lg relative bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC] flex items-center justify-center group">
                {!profileImageError ? (
                  <img
                    src="/Dr.Manoj Kumar Shukla sir main.jpeg"
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
                      Dr.Manoj Kumar Shukla sir main.jpeg
                    </span>
                  </div>
                )}
              </div>

              {/* Profile details */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight">
                  {data.name}
                </h2>

                <p className="text-sm font-semibold text-[#E8622A] mt-2 inline-flex items-center bg-[#E8622A]/10 px-3 py-1 rounded-full border border-[#E8622A]/20">
                  {data.degrees}
                </p>

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
              {en ? "Key Responsibilities & Accomplishments" : "प्रमुख उत्तरदायित्व एवं उपलब्धियां"}
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-[#E8622A] to-transparent mt-3 mx-auto w-48 rounded-full" />
          </div>

          <div className="space-y-10">
            {data.sections.map((sec) => {
              return (
                <div key={sec.id} className="text-left">
                  <h4 className="text-xl md:text-2xl font-bold text-[#5C1010] font-serif mb-1">
                    {sec.title}
                  </h4>
                  <p className="text-sm text-[#E8622A] mb-4 font-semibold">
                    {sec.subtitle}
                  </p>

                  <div className="space-y-3 pl-4 border-l-2 border-[#F0D5B8]">
                    {sec.items.map((item, idx) => (
                      <p key={idx} className="text-[#1E0F05] text-sm md:text-base leading-relaxed">
                        <strong className="font-semibold">{item.title}:</strong> {item.desc}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Photo Highlights Section (Gallery with Uploaded JPEGs) ────────────────── */}
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
                ? "A glimpse into the diverse contributions, public outreach, and high-level spiritual collaborations of Dr. Manoj Kumar Shukla sir."
                : "डॉ. मनोज कुमार शुक्ला जी के विविध सामाजिक योगदानों, प्रखर वक्तव्यों और देश के श्रेष्ठ आध्यात्मिक संतों के साथ ऐतिहासिक मुलाकातों की कुछ झलकियाँ।"}
            </p>
            <div className="h-1 bg-gradient-to-r from-transparent via-[#E8622A] to-transparent mt-4 mx-auto w-32 rounded-full" />
          </div>

          {/* Refined Photographic Gallery: Aligned Row & Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              "/Dr. Manoj Kumar Shukla with swami yatindranand ji maharaj.jpeg",
              "/WhatsApp Image 2026-06-03 at 19.54.52 (2).jpeg",
              "/dr. manoj kumar shukla performing hindu rituals .jpeg",
              "/Dr.-Manoj-Kumar-Shukla-at-kedarrnath.jpeg",
              "/Dr.-Manoj-Kumar-Shukla-giving-speech.jpeg",
              "/WhatsApp Image 2026-06-03 at 19.54.51.jpeg",
              "/Dr.-Manoj-Kumar-Shukla-constitution.jpeg",
              "/WhatsApp Image 2026-06-03 at 19.54.54 (1).jpeg",
              "/WhatsApp Image 2026-06-03 at 19.54.53 (3).jpeg",
              "/Dr.-Manoj-Kumar-Shukla-in-devotion.jpeg",
              "/WhatsApp Image 2026-06-03 at 19.54.53.jpeg",
              "/WhatsApp Image 2026-06-03 at 19.54.52.jpeg",
              "/2.jpeg",
              "/WhatsApp Image 2026-06-03 at 19.54.53 (1).jpeg",
              "/4.jpeg",
              "/5.jpeg",
              "/6.jpeg",
              "/7.jpeg",
              "/8.jpeg",
              "/9.jpeg",
              "/10.jpeg",
              "/11.jpeg",
              "/12.jpeg",
              "/14.jpeg",
              "/15.jpeg",
              "/16.jpeg",
              "/17.jpeg",
              "/18.jpeg"
            ].map((src, idx) => (
              <GalleryImageFrame 
                key={idx}
                src={src} 
                alt={`President Gallery Moment ${idx + 1}`} 
                onClick={() => setSelectedImage(src)}
              />
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
              {/* Subtle glows */}
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#E8622A]/10 blur-3xl" />
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#D4880C]/10 blur-3xl" />
              <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 28px)` }} />

              <span className="inline-block bg-[#E8622A]/10 border border-[#E8622A]/30 text-[#E8622A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                {en ? "Core Philosophy" : "मूल दर्शन"}
              </span>

              <h4 className="text-2xl md:text-3xl font-serif font-bold text-[#5C1010] leading-tight">
                {en ? "Antyodaya & Grassroots Service" : "अंत्योदय और जमीनी जन-सेवा"}
              </h4>

              <p className="text-[#7A5C45] text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
                {en
                  ? "Dr. Manoj Kumar Shukla is a strong advocate for ensuring that the benefits of every government welfare scheme reach the person at the very end of the line with absolute integrity, aligning completely with our vision of nation-building."
                  : "डॉ. शुक्ला इस विचार के प्रबल पक्षधर हैं कि देश के विकास और सुशासन की हर कल्याणकारी योजना का लाभ समाज की अंतिम पंक्ति में खड़े व्यक्ति तक पूरी ईमानदारी से पहुँचना चाहिए।"}
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




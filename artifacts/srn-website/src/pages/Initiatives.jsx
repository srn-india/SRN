import { useEffect } from "react";
import { motion } from "framer-motion";
import { Landmark, BookOpen, HeartPulse, Users, Zap } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const pillarsData = [
  {
    id: "civic",
    number: "01",
    hindiNumber: "०१",
    icon: Landmark,
    titleEn: "Civic Issues",
    titleHi: "नागरिक मुद्दे",
    descEn: "Addressing local infrastructure, governance, and civic amenities to improve the quality of daily life for citizens. We aim to build sustainable and transparent systems for rural and urban development. To materialize this vision, our initiatives focus on essential sectors including housing development, clean drinking water access, environmental conservation, forest protection, and disaster management. Furthermore, we actively support rural and urban development projects aimed at poverty alleviation, strengthening Panchayati Raj institutions, optimizing land and water resources, promoting new and renewable energy, championing the Right to Information, advocating citizen rights, and boosting sustainable tourism alongside art, culture, and religious heritage preservation.",
    descHi: "नागरिकों के दैनिक जीवन की गुणवत्ता में सुधार के लिए स्थानीय बुनियादी ढांचे, शासन और नागरिक सुविधाओं को संबोधित करना। हमारा लक्ष्य ग्रामीण और शहरी विकास के लिए टिकाऊ और पारदर्शी प्रणालियों का निर्माण करना है। इस दृष्टिकोण को साकार करने के लिए, हमारी पहल आवास विकास, स्वच्छ पेयजल पहुंच, पर्यावरण संरक्षण, वन सुरक्षा और आपदा प्रबंधन सहित आवश्यक क्षेत्रों पर ध्यान केंद्रित करती है। इसके अलावा, हम गरीबी उन्मूलन, पंचायती राज संस्थाओं को मजबूत करने, भूमि और जल संसाधनों के सदुपयोग, नवीन और नवीकरणीय ऊर्जा को बढ़ावा देने, सूचना के अधिकार और नागरिक अधिकारों की वकालत करने, तथा कला, संस्कृति और धार्मिक विरासत के संरक्षण के साथ-साथ सतत पर्यटन को बढ़ावा देने के उद्देश्य से ग्रामीण और शहरी विकास परियोजनाओं का सक्रिय रूप से समर्थन करते हैं।"
  },
  {
    id: "edu",
    number: "02",
    hindiNumber: "०२",
    icon: BookOpen,
    titleEn: "Education & Literacy",
    titleHi: "शिक्षा और साक्षरता",
    descEn: "Empowering communities through accessible education, skill building, and promoting lifelong literacy. We bridge the technological divide through robust industrial and scientific research initiatives. Our programs are designed to advance scientific knowledge and technological capability, encourage pioneering scientific and industrial research, and leverage information and communication technology to create digital learning tools. Additionally, we place a strong emphasis on practical skill development and vocational training, equipping youth and adult learners with the job-ready capabilities required in today's rapidly changing economy.",
    descHi: "सुलभ शिक्षा, कौशल निर्माण और आजीवन साक्षरता को बढ़ावा देने के माध्यम से समुदायों को सशक्त बनाना। हम मजबूत औद्योगिक और वैज्ञानिक अनुसंधान पहल के माध्यम से तकनीकी अंतर को पाटते हैं। हमारे कार्यक्रमों को वैज्ञानिक ज्ञान और तकनीकी क्षमता को आगे बढ़ाने, अग्रणी वैज्ञानिक और औद्योगिक अनुसंधान को प्रोत्साहित करने, और डिजिटल शिक्षण उपकरण बनाने के लिए सूचना और संचार प्रौद्योगिकी का लाभ उठाने के लिए डिज़ाइन किया गया है। इसके अतिरिक्त, हम व्यावहारिक कौशल विकास और व्यावसायिक प्रशिक्षण पर विशेष जोर देते हैं, जिससे युवाओं और वयस्कों को आज की तेजी से बदलती अर्थव्यवस्था में आवश्यक रोजगार-योग्य क्षमताओं से लैस किया जा सके।"
  },
  {
    id: "health",
    number: "03",
    hindiNumber: "०३",
    icon: HeartPulse,
    titleEn: "Health & Family Welfare",
    titleHi: "स्वास्थ्य और परिवार कल्याण",
    descEn: "Ensuring access to essential healthcare, maternal health, and family welfare programs for all demographics, extending our care to animal welfare and sustainable agriculture. This comprehensive welfare umbrella addresses nutrition programs to fight malnutrition, HIV/AIDS awareness and prevention, and support services for the aged, elderly, and differently-abled members of our society. Our compassion extends beyond human health to encompass dedicated animal welfare, veterinary care, and animal husbandry. We also champion dairying and fisheries development alongside sustainable agriculture, food processing innovations, and biotechnology research to build a healthier, food-secure future.",
    descHi: "सभी जनसांख्यिकी के लिए आवश्यक स्वास्थ्य देखभाल, मातृ स्वास्थ्य और परिवार कल्याण कार्यक्रमों तक पहुंच सुनिश्चित करना, साथ ही पशु कल्याण और टिकाऊ कृषि तक हमारी देखभाल का विस्तार करना। यह व्यापक कल्याण छत्र कुपोषण से लड़ने के लिए पोषण कार्यक्रमों, एचआईवी/एड्स जागरूकता और रोकथाम, तथा हमारे समाज के बुजुर्गों और दिव्यांग सदस्यों के लिए सहायता सेवाओं को संबोधित करता है। हमारी करुणा मानव स्वास्थ्य से आगे बढ़कर समर्पित पशु कल्याण, पशु चिकित्सा देखभाल और पशुपालन तक फैली हुई है। हम एक स्वस्थ और खाद्य-सुरक्षित भविष्य के निर्माण के लिए डेयरी और मत्स्य पालन विकास के साथ-साथ टिकाऊ कृषि, खाद्य प्रसंस्करण नवाचारों और जैव प्रौद्योगिकी अनुसंधान का भी समर्थन करते हैं।"
  },
  {
    id: "women",
    number: "04",
    hindiNumber: "०४",
    icon: Users,
    titleEn: "Women's Development & Empowerment",
    titleHi: "महिला विकास और सशक्तिकरण",
    descEn: "Promoting gender equality, financial independence, and safety for women across all sectors of society by supporting micro-finance and small enterprises. We work toward creating self-reliant ecosystems for women by fostering Micro Finance initiatives, including Self-Help Groups (SHGs) that cultivate local leadership and savings habits. By assisting micro, small, and medium enterprises (MSMEs) run by women, we help open up new avenues of credit, skill acquisition, entrepreneurship, and market access, enabling women to become equal decision-makers and economic leaders in their families and communities.",
    descHi: "माइक्रो फाइनेंस और छोटे उद्यमों का समर्थन करके समाज के सभी क्षेत्रों में महिलाओं के लिए लैंगिक समानता, वित्तीय स्वतंत्रता और सुरक्षा को बढ़ावा देना। हम स्थानीय नेतृत्व और बचत की आदतों को विकसित करने वाले स्वयं सहायता समूहों (SHGs) सहित माइक्रो फाइनेंस पहलों को बढ़ावा देकर महिलाओं के लिए आत्मनिर्भर पारिस्थितिकी तंत्र बनाने की दिशा में काम करते हैं। महिलाओं द्वारा संचालित सूक्ष्म, लघु और मध्यम उद्यमों (MSMEs) की सहायता करके, हम ऋण, कौशल प्राप्ति, उद्यमिता और बाजार तक पहुंच के नए रास्ते खोलने में मदद करते हैं, जिससे महिलाएं अपने परिवारों और समुदायों में समान निर्णय-निर्माता और आर्थिक नेता बन सकें।"
  },
  {
    id: "youth",
    number: "05",
    hindiNumber: "०५",
    icon: Zap,
    titleEn: "Youth Affairs & Human Rights",
    titleHi: "युवा मामले और मानवाधिकार",
    descEn: "Guiding the energy of the youth into constructive national development through leadership, sports, and robust employment opportunities while safeguarding fundamental human rights. Our initiatives involve active sports training and infrastructure to build discipline and physical health, alongside labor welfare programs and employment generation schemes. We place special emphasis on protecting children, uplifting Dalits and marginalized communities, resolving minority issues, and supporting tribal welfare programs. Our framework also addresses prisoner rehabilitation and welfare, while promoting legal awareness and providing aid to ensure justice is accessible to all, upholding the dignity of every individual.",
    descHi: "बुनियादी मानवाधिकारों की रक्षा करते हुए नेतृत्व, खेल और रोजगार के मजबूत अवसरों के माध्यम से युवाओं की ऊर्जा को रचनात्मक राष्ट्रीय विकास में मार्गदर्शन करना। हमारी पहलों में अनुशासन और शारीरिक स्वास्थ्य के निर्माण के लिए सक्रिय खेल प्रशिक्षण और बुनियादी ढांचा शामिल है, साथ ही श्रम कल्याण कार्यक्रम और रोजगार सृजन योजनाएं भी शामिल हैं। हम बच्चों की सुरक्षा, दलितों और वंचित समुदायों के उत्थान, अल्पसंख्यक मुद्दों को सुलझाने और जनजातीय कल्याण कार्यक्रमों का समर्थन करने पर विशेष जोर देते हैं। हमारा ढांचा कैदियों के पुनर्वास और कल्याण को भी संबोधित करता है, साथ ही कानूनी जागरूकता को बढ़ावा देने और सहायता प्रदान करने का काम करता है ताकि यह सुनिश्चित हो सके कि न्याय सभी के लिए सुलभ हो और हर व्यक्ति की गरिमा बनी रहे।"
  }
];

export default function Initiatives() {
  const { lang } = useLanguage();
  const en = lang === "en";

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = en 
      ? "Our Initiatives | Sashakt Rashtra Nirman"
      : "हमारी पहल | सशक्त राष्ट्र निर्माण";
  }, [en]);

  return (
    <div className="bg-[#FDF5EC] min-h-screen selection:bg-[#E8622A] selection:text-white">
      
      {/* ── Banner Section ─────────────────────────────────────────── */}
      <section className="relative bg-[#1E0F05] py-32 text-center px-6 overflow-hidden flex items-center justify-center min-h-[44vh] border-b border-[#F0D5B8]/20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 mix-blend-multiply"
          style={{ backgroundImage: `url('/init_hero_bg_1779216907662.png')` }}
        />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 28px)` }}
        />

        {/* Glow accents */}
        <div className="absolute top-12 left-16 w-56 h-56 rounded-full bg-[#E8622A]/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-12 right-16 w-48 h-48 rounded-full bg-[#D4880C]/10 blur-[80px] pointer-events-none" />

        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F05]/90 via-[#1E0F05]/40 to-[#1E0F05]/10 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10 pt-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif tracking-tight leading-tight drop-shadow-md">
            {en ? (
              <>Our <span className="text-[#E8622A]">Initiatives</span></>
            ) : (
              <>हमारी <span className="text-[#E8622A]">पहल</span></>
            )}
          </h1>
          <p className="text-[#F47A3A] font-bold tracking-[0.15em] uppercase text-xs md:text-sm mt-3 mb-6">
            {en ? "Focus Sectors & Core Areas" : "मुख्य क्षेत्र एवं विकास आयाम"}
          </p>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            {en 
              ? "Driving systemic change through comprehensive programs designed to empower the youth, uplift the marginalized, and integrate the nation through core focus areas."
              : "युवाओं को सशक्त बनाने, वंचितों के उत्थान और व्यापक फोकस क्षेत्रों के माध्यम से राष्ट्र को एकीकृत करने के लिए डिज़ाइन किए गए रचनात्मक कार्यक्रमों द्वारा प्रणालीगत परिवर्तन लाना।"}
          </p>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-6 mx-auto w-24 rounded-full origin-center shadow-sm"
          />
        </motion.div>
      </section>

      {/* ── Running Text Pillars Section ───────────────────────────── */}
      <section className="py-20 px-6 max-w-5xl mx-auto relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #E8622A, #E8622A 1px, transparent 1px, transparent 24px)` }} />
        
        <div className="flex flex-col gap-16 md:gap-24 relative z-10">
          {pillarsData.map((pillar, index) => {
            const IconComponent = pillar.icon;
            
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col md:flex-row gap-6 md:gap-12 items-start"
              >
                {/* Pillar Number & Icon Column */}
                <div className="flex items-center md:flex-col gap-4 md:gap-3 shrink-0">
                  <span className="text-4xl md:text-6xl font-serif font-extrabold text-[#E8622A]/20 leading-none select-none">
                    {en ? pillar.number : pillar.hindiNumber}
                  </span>
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-[#E8622A] to-[#C04A18] text-white flex items-center justify-center shadow-md shadow-orange-900/10">
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.75} />
                  </div>
                </div>

                {/* Content prose column */}
                <div className="flex-1 text-left">
                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#5C1010] mb-4 tracking-tight leading-snug">
                    {en ? pillar.titleEn : pillar.titleHi}
                  </h2>
                  <p className="text-[#1E0F05] text-base md:text-lg leading-relaxed font-sans font-normal text-justify whitespace-pre-line">
                    {en ? pillar.descEn : pillar.descHi}
                  </p>
                  
                  {/* Subtle Separator line except the last item */}
                  {index < pillarsData.length - 1 && (
                    <div className="h-px bg-[#F0D5B8]/40 mt-12 md:mt-16 w-full" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

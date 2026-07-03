import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera,
  Flame,
  Sun
} from "lucide-react";
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
function GalleryImageFrame({ src, alt, className = "", onClick }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      onClick={onClick}
      className={`relative group overflow-hidden hover:z-10 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-zoom-in w-full ${className}`}
      style={{ aspectRatio: 1 }}
    >
      {!hasError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05] block"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC]">
          <Camera className="w-8 h-8 text-[#E8622A]/40 mb-2" />
          <span className="text-xs font-bold text-[#E8622A]/60">Image Error</span>
        </div>
      )}

      {/* Elegant Hover Overlay */}
      
    </div>
  );
}

export default function NationalPresident() {
  const [profileImageError, setProfileImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "सशक्त राष्ट्र निर्माण – डॉ. मनोज कुमार शुक्ला";
  }, []);

  return (
    <div className="bg-[#FDF5EC] min-h-screen">

      <section className="relative overflow-hidden bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6">
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.32]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />

        

        {/* Colorful Light-Theme Glow accents */}
        
        
        
        

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >
          <span className="inline-block bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#E8622A] text-sm md:text-base font-bold uppercase tracking-widest px-5 py-1.5 rounded-full mb-4 shadow-sm">
            ॥ राष्ट्रीय अध्यक्ष ॥
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight drop-shadow-sm">
            डॉ. मनोज कुमार शुक्ला
          </h1>
          <p className="text-lg md:text-xl italic text-[#7A5C45] font-medium mt-4 max-w-3xl mx-auto leading-relaxed">
            "सुशासन (Governance), राष्ट्रनिर्माण और अंत्योदय को एकसूत्र में पिरोती विकास-दृष्टि के प्रति समर्पित।"
          </p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-[#E8622A] to-[#D4880C] mt-6 mx-auto w-24 rounded-full origin-center shadow-sm"
          />
        </motion.div>
      </section>

      {/* ── All Details in One Single Div ───────────────────────────── */}
      <section className="relative px-6 -mt-16 z-10 mb-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-[#F0D5B8] rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden card-shimmer space-y-12">
            
            {/* Background element */}
            

            {/* Top Block: Profile Photo & Personal Profile Details */}
            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 pb-10 border-b border-[#F0D5B8]">

              {/* Profile Image container */}
              <div className="w-full max-w-[280px] lg:w-[280px] h-[320px] lg:h-[340px] rounded-3xl overflow-hidden shrink-0 border-4 border-[#E8622A] shadow-lg relative bg-gradient-to-br from-[#FFF9F2] to-[#FDF5EC] flex items-center justify-center group">
                {!profileImageError ? (
                  <img
                    src="/Dr.Manoj Kumar Shukla sir main.jpeg"
                    alt="डॉ. मनोज कुमार शुक्ला"
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

              {/* Personal & Organizational Profile */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-[#5C1010] font-serif tracking-tight leading-tight mb-6">
                  <u>व्यक्तिगत एवं संगठनात्मक विवरण (Personal & Organizational Profile)</u>
                </h2>

                <div className="space-y-4 text-[#1E0F05] text-base md:text-lg leading-relaxed text-justify">
                  <div className="flex items-start gap-3">
                    <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                    <div>
                      <strong className="font-bold">शैक्षणिक योग्यता: </strong>बी.टेक (CSE), एम.टेक (CSE) & पीएच.डी (CSE) आई.आई.टी (आईएसएम) धनबाद
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                    <div>
                      <strong className="font-bold">लोकप्रिय जन-सेवक , प्रखर राष्ट्रवादी विचारक, प्रख्यात शिक्षाविद्, कंप्यूटर वैज्ञानिक, एवं कुशल नीति-विशेषज्ञ</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                    <div>
                      <strong className="font-bold">कार्यशैली: </strong>एक सच्चे थिंकटैंक की रणनीतिक स्पष्टता — जहाँ विश्लेषण गहरा, निर्णय दृढ़ और दिशा सुनिश्चित होती है
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                    <div>
                      <strong className="font-bold">ईमेल आईडी: </strong>
                      <a href="mailto:president@srnindia.org" className="text-[#0056b3] underline hover:text-[#E8622A]">president@srnindia.org</a>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Policy & Governance */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#5C1010] font-serif mb-3">
                <u>नीति, प्रशासन एवं शासकीय निकायों में भूमिकाएँ (Policy & Governance)</u>
              </h3>
              <p className="text-base text-[#7A5C45] italic font-medium mb-6">
                भारत सरकार और देश के शीर्ष नीति-नियामक एवं प्रशासनिक निकायों द्वारा सौंपी गई महत्वपूर्ण जिम्मेदारियाँ:
              </p>

              <ul className="space-y-4 text-[#1E0F05] text-base md:text-lg leading-relaxed text-justify pl-2">
                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">नागरिक उड्डयन मंत्रालय (भारत सरकार): </strong>
                    भारतीय विमानपत्तन प्राधिकरण (AAI) के अंतर्गत <strong className="font-bold">गोरखपुर हवाई अड्डे की सलाहकार समिति में मनोनीत सदस्य ।</strong>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">DRDO (रक्षा मंत्रालय, भारत सरकार): </strong>
                    देश की रक्षा, अत्याधुनिक सैन्य प्रौद्योगिकी और राष्ट्रीय सुरक्षा जैसे अति-संवेदनशील विषयों पर गठित peer-reviewed <strong className="font-bold">विशेषज्ञ समिति</strong> में बतौर सदस्य विशिष्ट सेवाएँ ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">केन्द्रीय कौशल विकास मंत्रालय (DGET): </strong>
                    युवाओं के स्वावलंबन, व्यावसायिक प्रशिक्षण और <strong className="font-bold">राष्ट्रीय शिक्षा-नीति के जमीनी क्रियान्वयन</strong> के लिए गठित मॉडरेशन बोर्ड में सक्रिय भूमिका ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">संस्थागत शुचिता और पारदर्शी प्रशासन: </strong>
                    AIIMS, इलाहाबाद उच्च न्यायालय, GATE, UPPCL, RBI, SEBI एवं IBPS सहित देश की अत्यंत संवेदनशील राष्ट्रीय परीक्षाओं में <strong className="font-bold">केन्द्र अधीक्षक (Centre Superintendent)</strong> के रूप में कठोर अनुशासन, पारदर्शिता और <strong className="font-bold">जीरो-करप्शन की नीति को सफलतापूर्वक लागू किया ।</strong>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">अकादमिक नेतृत्व: </strong>
                    प्रोफेसर एवं पूर्व डीन के गरिमामयी पदों पर रहते हुए उच्च शिक्षण संस्थानों में नीति-निर्माण और बड़े प्रशासनिक ढांचे को कुशलतापूर्वक संभाला ।
                  </div>
                </li>
              </ul>
            </div>

            {/* Social Responsibility & Antyodaya */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#5C1010] font-serif mb-6">
                <u>अंत्योदय एवं सामाजिक सेवा (Social Responsibility & Antyodaya)</u>
              </h3>

              <ul className="space-y-4 text-[#1E0F05] text-base md:text-lg leading-relaxed text-justify pl-2">
                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">कोविड-19 महामारी सेवा: </strong>
                    संकट की कठिन घड़ी में संवेदनशीलता का परिचय देते हुए प्रतिदिन 1000 से अधिक लोगों तक भोजन पहुँचाने की सक्रिय व्यवस्था की, वंचितों को राहत दी तथा उनके आवागमन का समुचित प्रबंध किया ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">निःशुल्क तीर्थ यात्रा: </strong>
                    भारतीय सांस्कृतिक मूल्यों एवं परंपराओं के संरक्षण हेतु <strong className="font-bold">हजारों वरिष्ठ नागरिकों के लिए निःशुल्क तीर्थ यात्राओं</strong> का आयोजन करवाकर पवित्र दर्शन कराए ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">जमीनी सहभागिता: </strong>
                    बाल्यकाल से ही सामाजिक सेवा से जुड़ाव । स्थानीय स्तर पर आपदा राहत कार्यों, स्वास्थ्य शिविरों एवं रक्तदान अभियानों के सफल संचालन में अग्रणी भूमिका ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">युवा नेतृत्व निर्माण: </strong>
                    युवाओं और विद्यार्थियों के मध्य शारीरिक विकास, नेतृत्व क्षमता (Leadership), व्यक्तित्व निर्माण और भारतीय सांस्कृतिक मूल्यों के संवर्धन हेतु प्रेरक कार्यशालाओं का संचालन ।
                  </div>
                </li>
              </ul>
            </div>

            {/* Research & Global Recognition */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#5C1010] font-serif mb-3">
                <u>शोध, तकनीकी नवाचार एवं वैश्विक पहचान (Research & Global Recognition)</u>
              </h3>
              <p className="text-base text-[#7A5C45] italic font-medium mb-6">
                एक कंप्यूटर वैज्ञानिक और शोधकर्ता के रूप में अंतर्राष्ट्रीय स्तर पर सुस्थापित पहचान:
              </p>

              <ul className="space-y-4 text-[#1E0F05] text-base md:text-lg leading-relaxed text-justify pl-2">
                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">अंतर्राष्ट्रीय सम्मान: </strong>
                    कंप्यूटर विज्ञान और इंजीनियरिंग के क्षेत्र में विशिष्ट योगदान के लिए बैंकॉक, थाईलैंड में प्रतिष्ठित <strong className="font-bold">"COSMIC Outstanding Researcher Award" (जनवरी 2016)</strong> से सम्मानित ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">सर्वश्रेष्ठ शिक्षक पुरस्कार: </strong>
                    शिक्षण और अनुसंधान के क्षेत्र में अद्वितीय योगदान के लिए उत्तर प्रदेश तकनीकी विश्वविद्यालय (UPTU) के तत्कालीन कुलपति डॉ. आर. के. खांडल द्वारा <strong className="font-bold">"बेस्ट Teacher अवार्ड" (सितंबर 2014)</strong> से सम्मानित ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">शोध मार्गदर्शक (Mentorship): </strong>
                    एक समर्पित मार्गदर्शक के रूप में अब तक 10 से अधिक Ph.D. शोधार्थियों तथा बड़ी संख्या में B.Tech व M.Tech विद्यार्थियों के शोध-प्रकल्पों का सफल निर्देशन ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">ग्रन्थ रचना एवं शोध पत्र: </strong>
                    अंतर्राष्ट्रीय स्तर की प्रतिष्ठित पत्रिकाओं (Journals) और सम्मेलनों में <strong className="font-bold">150 से अधिक उच्च-गुणवत्ता वाले शोध-पत्र</strong> प्रकाशित तथा अनेक तकनीकी ग्रन्थों (Reference Books) की रचना ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">वैश्विक उपस्थिति व संपादन: </strong>
                    अमेरिका, ब्रिटेन, पोलैंड, मलेशिया, बहरीन, चेक गणराज्य, थाईलैंड, दुबई आदि देशों के सम्मेलनों में सेवाएँ । <em className="italic">American Journal of Database Theory and Application</em>, IJSER आदि प्रीमियर पत्रिकाओं के सम्मानित संपादकीय बोर्ड सदस्य (Editorial Board) तथा IEEE सम्मेलनों के सक्रिय समीक्षक (Reviewer) ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">व्यावसायिक सदस्यता: </strong>
                    कंप्यूटर जगत के शीर्ष वैश्विक निकायों जैसे <strong className="font-bold">ACM, CSI, ISTE, IETE, IANG, WSEAS</strong> आदि के सम्मानित सदस्य ।
                  </div>
                </li>
              </ul>
            </div>

            {/* Public Intellectual */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#5C1010] font-serif mb-6">
                <u>प्रखर सार्वजनिक बौद्धिक एवं राष्ट्र-वैचारिक वक्ता (Public Intellectual)</u>
              </h3>

              <ul className="space-y-4 text-[#1E0F05] text-base md:text-lg leading-relaxed text-justify pl-2">
                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">राष्ट्रीय विमर्श (Media): </strong>
                    विभिन्न प्रमुख <strong className="font-bold">राष्ट्रीय समाचार चैनलों (National News Channels)</strong> पर एक विश्वसनीय, प्रखर और राष्ट्र-वैचारिक वक्ता के रूप में स्थापित ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">लेखन: </strong>
                    राष्ट्रनीति, आधुनिक तकनीक, सुशासन और सामाजिक विषयों पर गहरे वैचारिक आलेख राष्ट्रीय समाचार-पत्रों, प्रिंट और डिजिटल मीडिया में नियमित रूप से प्रकाशित ।
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-[#E8622A] font-bold text-xl leading-none mt-1">•</span>
                  <div>
                    <strong className="font-bold">मुख्य वक्ता (Keynote Speaker): </strong>
                    देश-विदेश के अनेक विश्वविद्यालयों और सार्वजनिक मंचों पर आमंत्रित; वक्तव्य हमेशा तथ्य, तर्क, राष्ट्रनिष्ठा और संवेदनशीलता का बेजोड़ सम्मिश्रण होते हैं ।
                  </div>
                </li>
              </ul>
            </div>

            {/* Footer Quote */}
            <div className="pt-6 border-t border-[#F0D5B8] text-center">
              <span className="inline-block bg-[#E8622A]/10 border border-[#E8622A]/30 text-[#E8622A] text-xs font-semibold uppercase tracking-widest px-4 py-1 rounded-full mb-4">
                वैचारिक ध्येय
              </span>
              <h4 className="text-xl md:text-2xl font-serif font-bold text-[#5C1010] leading-tight italic max-w-3xl mx-auto">
                "एक वैज्ञानिक की विश्लेषणात्मक सोच, एक शिक्षाविद की दूरदर्शिता और एक समर्पित राष्ट्रवादी कार्यकर्ता की कर्मठता के साथ 'अंत्योदय' और 'विकसित भारत' के संकल्प को सिद्ध करने के लिए पूर्णतः तत्पर।"
              </h4>
            </div>

          </div>
        </div>
      </section>

      {/* ── Photo Highlights Section (Gallery) ────────────────── */}
      <section className="pt-6 pb-6 px-6 bg-[#FFF9F2] relative overflow-hidden border-t border-b border-[#F0D5B8]/50">
        

        <div className="max-w-6xl mx-auto relative">

          <div className="text-center mb-12">
            <span className="inline-block bg-[#E8622A]/15 border border-[#E8622A]/30 text-[#F47A3A] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
              दिव्य क्षण एवं संस्मरण
            </span>
            <h3 className="text-3xl font-bold text-[#5C1010] font-serif">
              ऐतिहासिक संस्मरण एवं चित्र दीर्घा
            </h3>
            <p className="text-[#7A5C45] text-sm mt-3 max-w-xl mx-auto leading-relaxed">
              डॉ. मनोज कुमार शुक्ला जी के विविध सामाजिक योगदानों, प्रखर वक्तव्यों और देश के श्रेष्ठ आध्यात्मिक संतों के साथ ऐतिहासिक मुलाकातों की कुछ झलकियाँ।
            </p>
            <div className="h-1 bg-gradient-to-r from-transparent via-[#E8622A] to-transparent mt-4 mx-auto w-32 rounded-full" />
          </div>

          {/* Refined Photographic Gallery: Seamless 6-Column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 overflow-hidden rounded-2xl shadow-lg">
            {[
          "/National President/WhatsApp Image 2026-06-29 at 12.41.17 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.41.17.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.41.17 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.42.31.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.42.33 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.41.14.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.42.32 (3).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.42.32 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.41.17 (3).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.42.32.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.42.32 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.41.16.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.41.16 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.41.16 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.42.33 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.42.33 (3).jpeg",
          "/National President/WhatsApp Image 2026-07-03 at 11.00.55 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.43.27.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.53.51.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.50.16.jpeg",
          "/National President/WhatsApp Image 2026-07-01 at 11.00.12(3).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.50.17 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.50.17.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.50.18.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.01 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.53.49.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.53.50 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.53.50 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.53.50 (3).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.53.50.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.44.11.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.50.17 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 12.53.49 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.01 (3).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.01.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.02 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.02 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.02 (3).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.02.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.03 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.03 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.03 (3).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.03.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.04 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.04 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.04.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.05 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.05 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.05.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.06 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.06 (2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.06 (3).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.06.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.07 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.07 (2).jpeg",
          "/National President/WhatsApp Image 2026-07-01 at 11.00.12.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.07.jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.08 (1).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.08 (2).jpeg",
          "/National President/WhatsApp Image 2026-07-01 at 11.00.12(1).jpeg",
          "/National President/WhatsApp Image 2026-07-01 at 11.00.12(2).jpeg",
          "/National President/WhatsApp Image 2026-06-29 at 13.01.01 (1).jpeg",
          "/National President/WhatsApp Image 2026-07-01 at 11.00.12(4).jpeg",
          "/National President/WhatsApp Image 2026-07-01 at 11.00.12(5).jpeg",
          "/National President/WhatsApp Image 2026-07-01 at 11.00.12(6).jpeg",
          "/National President/WhatsApp Image 2026-07-03 at 11.01.24.jpeg"

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

    </div>
  );
}

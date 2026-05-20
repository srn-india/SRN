import { useEffect } from "react";
import { motion } from "framer-motion";
import { Award, BookOpen, Globe, Mic, Heart, Landmark, GraduationCap, Users } from "lucide-react";
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

export default function MargdarshakMandal() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Margdarshak Mandal | Sashakt Rashtra Nirman";
  }, []);

  return (
    <div className="bg-[#FDF5EC] min-h-screen pb-20">
      
      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section className="relative bg-[#1E0F05] py-32 text-center px-6 overflow-hidden flex items-center justify-center min-h-[45vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url('/margdarshak_hero_bg_1779207077810.png')` }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: `repeating-linear-gradient(-45deg, white, white 1px, transparent 1px, transparent 28px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF5EC] via-[#1E0F05]/80 to-[#1E0F05]/40" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(232,98,42,0.3)]">
            <Landmark className="w-4 h-4 text-[#E8622A]" />
            <span className="text-white/90 text-sm font-medium tracking-wide uppercase">National Leadership</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white font-serif leading-tight drop-shadow-lg">
            Margdarshak <span className="text-[#E8622A]">Mandal</span>
          </h1>
          <p className="text-xl text-[#F47A3A] mt-3 font-medium tracking-wide drop-shadow">
            मार्गदर्शक मंडल
          </p>
        </motion.div>
      </section>

      {/* ── Main Profile Section ───────────────────────────────────── */}
      <section className="px-6 relative z-20 -mt-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#F0D5B8]">
          <div className="p-8 md:p-12 lg:p-16">
            
            {/* Header / Intro */}
            <FadeSection>
              <div className="flex flex-col items-center text-center mb-12">
                <span className="text-[#E8622A] font-bold text-sm tracking-widest uppercase mb-3">राष्ट्रीय अध्यक्ष (National President)</span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1E0F05] font-serif mb-4">डॉ. मनोज कुमार शुक्ला</h2>
                <h3 className="text-xl text-[#7A5C45] font-medium mb-6">Dr. Manoj Kumar Shukla</h3>
                
                <div className="flex items-center justify-center gap-2 text-[#5C1010] font-semibold bg-[#FDF5EC] px-6 py-3 rounded-xl border border-[#F0D5B8] mb-6">
                  <GraduationCap className="w-5 h-5 text-[#E8622A]" />
                  <span>B.Tech (CSE), M.Tech (CSE) & Ph.D. (CSE) from IIT (ISM) Dhanbad</span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
                  {["लोकप्रिय जन-सेवक", "प्रखर राष्ट्रवादी विचारक", "प्रख्यात शिक्षाविद्", "कंप्यूटर वैज्ञानिक", "कुशल नीति-विशेषज्ञ"].map((tag, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#E8622A]/10 to-[#C04A18]/10 text-[#C04A18] border border-[#E8622A]/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="w-24 h-1 bg-gradient-to-r from-[#E8622A] to-[#C04A18] rounded-full mx-auto mt-10 mb-8" />
                
                <p className="text-[#7A5C45] text-lg leading-relaxed max-w-4xl text-justify md:text-center">
                  डॉ. मनोज कुमार शुक्ला एक ऐसी बहुमुखी और प्रखर विभूति हैं जो अकादमिक उत्कृष्टता, रणनीतिक सोच, अत्याधुनिक तकनीकी नवाचार और जमीनी जन-सेवा को एकसाथ जीते हैं। देश के यशस्वी प्रधानमंत्री नरेन्द्र मोदी जी की उस विकास-दृष्टि से प्रेरित—जो सुशासन (Governance), राष्ट्रनिर्माण और अंत्योदय को एकसूत्र में पिरोती है—डॉ. शुक्ला ने अपने हर कार्यक्षेत्र में इसी सोच को मूर्त रूप दिया है। उनकी कार्यशैली में एक सच्चे थिंकटैंक की रणनीतिक स्पष्टता झलकती है—जहाँ विश्लेषण गहरा, निर्णय दृढ़ और दिशा सुनिश्चित होती है।
                </p>
              </div>
            </FadeSection>

            {/* Grid of Attributes */}
            <div className="space-y-12">
              
              <FadeSection delay={100}>
                <div className="bg-[#FFF9F2] p-8 rounded-2xl border border-[#F0D5B8]/60 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#E8622A]/10 flex items-center justify-center border border-[#E8622A]/20">
                      <Landmark className="w-6 h-6 text-[#E8622A]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#5C1010] font-serif">नीति, प्रशासन एवं राष्ट्रीय स्तर पर महत्वपूर्ण भूमिकाएँ</h3>
                  </div>
                  <p className="text-[#7A5C45] mb-4">भारत सरकार और देश के शीर्ष नीति-नियामक एवं प्रशासनिक निकायों ने डॉ. शुक्ला के अनुभव और दूरदर्शिता पर भरोसा जताते हुए उन्हें कई संवेदनशील और महत्वपूर्ण जिम्मेदारियाँ सौंपी हैं:</p>
                  <ul className="space-y-3 text-[#1E0F05] list-disc list-inside ml-2">
                    <li><strong className="text-[#C04A18]">नागरिक उड्डयन मंत्रालय (भारत सरकार):</strong> भारतीय विमानपत्तन प्राधिकरण (AAI) के अंतर्गत गोरखपुर हवाई अड्डे की सलाहकार समिति में मनोनीत सदस्य।</li>
                    <li><strong className="text-[#C04A18]">DRDO (रक्षा मंत्रालय, भारत सरकार):</strong> देश की रक्षा, अत्याधुनिक सैन्य प्रौद्योगिकी और राष्ट्रीय सुरक्षा जैसे अति-संवेदनशील विषयों पर गठित peer-reviewed विशेषज्ञ समिति में बतौर सदस्य विशिष्ट सेवाएँ।</li>
                    <li><strong className="text-[#C04A18]">केन्द्रीय कौशल विकास मंत्रालय (DGET):</strong> युवाओं के स्वावलंबन, व्यावसायिक प्रशिक्षण और राष्ट्रीय शिक्षा-नीति के जमीनी क्रियान्वयन के लिए गठित मॉडरेशन बोर्ड में सक्रिय भूमिका।</li>
                    <li><strong className="text-[#C04A18]">संस्थागत शुचिता और पारदर्शी प्रशासन:</strong> AIIMS, इलाहाबाद उच्च न्यायालय, GATE, UPPCL, RBI, SEBI एवं IBPS सहित देश की अत्यंत संवेदनशील और प्रतिष्ठित राष्ट्रीय परीक्षाओं में केन्द्र अधीक्षक (Centre Superintendent) के रूप में कठोर अनुशासन, पारदर्शिता और जीरो-करप्शन की नीति को सफलतापूर्वक लागू किया।</li>
                    <li><strong className="text-[#C04A18]">अकादमिक नेतृत्व:</strong> प्रोफेसर एवं पूर्व डीन के गरिमामयी पदों पर रहते हुए उच्च शिक्षण संस्थानों में नीति-निर्माण और बड़े प्रशासनिक ढांचे को कुशलतापूर्वक संभाला।</li>
                  </ul>
                </div>
              </FadeSection>

              <FadeSection delay={200}>
                <div className="bg-[#FFF9F2] p-8 rounded-2xl border border-[#F0D5B8]/60 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#E8622A]/10 flex items-center justify-center border border-[#E8622A]/20">
                      <BookOpen className="w-6 h-6 text-[#E8622A]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#5C1010] font-serif">शोध, तकनीकी नवाचार एवं वैश्विक पहचान</h3>
                  </div>
                  <p className="text-[#7A5C45] mb-4">एक कंप्यूटर वैज्ञानिक और शोधकर्ता के रूप में डॉ. शुक्ला का योगदान अंतर्राष्ट्रीय स्तर पर सुस्थापित है। उनकी शोध-दृष्टि केवल उपाधि दिलाने तक सीमित नहीं रही, बल्कि उन्होंने हर शोधार्थी में एक स्वतंत्र वैज्ञानिक सोच विकसित की है:</p>
                  <ul className="space-y-3 text-[#1E0F05] list-disc list-inside ml-2 mb-6">
                    <li><strong className="text-[#C04A18]">शोध मार्गदर्शन (Mentorship):</strong> एक समर्पित मार्गदर्शक के रूप में अब तक 10 से अधिक Ph.D. शोधार्थियों तथा बड़ी संख्या में B.Tech और M.Tech के विद्यार्थियों के शोध-प्रकल्पों को सफलतापूर्वक निर्देशित कर सफल परिणति दी है।</li>
                    <li><strong className="text-[#C04A18]">शोध पत्र एवं ग्रन्थ रचना:</strong> अंतर्राष्ट्रीय स्तर की प्रतिष्ठित पत्रिकाओं (Journals) और सम्मेलनों में 150 से अधिक उच्च-गुणवत्ता वाले शोध-पत्र प्रकाशित। इसके साथ ही अनेक तकनीकी ग्रन्थों की रचना की, जो आज सन्दर्भ-ग्रन्थ (Reference Books) के रूप में स्वीकृत हैं।</li>
                  </ul>
                  
                  <div className="bg-white p-5 rounded-xl border border-[#F0D5B8]">
                    <h4 className="font-bold text-[#5C1010] mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-[#E8622A]"/> अंतर्राष्ट्रीय सम्मान (Awards):</h4>
                    <ul className="space-y-2 text-[#7A5C45] list-inside">
                      <li>🏆 <strong className="text-[#1E0F05]">COSMIC Outstanding Researcher Award (जनवरी 2016):</strong> कंप्यूटर विज्ञान और इंजीनियरिंग के क्षेत्र में विशिष्ट एवं अद्वितीय योगदान के लिए बैंकॉक, थाईलैंड में सम्मानित।</li>
                      <li>🏆 <strong className="text-[#1E0F05]">बेस्ट Teacher अवार्ड (सितंबर 2014):</strong> शिक्षण और अनुसंधान के क्षेत्र में अद्वितीय योगदान के लिए डॉ. आर. के. खांडल (तत्कालीन कुलपति, UPTU) द्वारा सम्मानित।</li>
                    </ul>
                  </div>
                </div>
              </FadeSection>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <FadeSection delay={300} className="h-full">
                  <div className="bg-[#FFF9F2] p-8 rounded-2xl border border-[#F0D5B8]/60 hover:shadow-lg transition-shadow h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#E8622A]/10 flex items-center justify-center border border-[#E8622A]/20">
                        <Globe className="w-6 h-6 text-[#E8622A]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#5C1010] font-serif">वैश्विक संपादकीय भूमिकाएँ एवं व्यावसायिक सदस्यता</h3>
                    </div>
                    <p className="text-[#7A5C45] mb-4 text-sm">उन्होंने अमेरिका, ब्रिटेन, पोलैंड, मलेशिया, बहरीन, चेक गणराज्य, थाईलैंड, दुबई आदि विभिन्न देशों के प्रमुख अंतर्राष्ट्रीय सम्मेलनों और अकादमिक आयोजनों में अपनी महत्वपूर्ण सेवाएँ दी हैं।</p>
                    <ul className="space-y-3 text-[#1E0F05] list-disc list-inside ml-2 text-sm">
                      <li><strong className="text-[#C04A18]">संपादकीय बोर्ड की सदस्यता:</strong> American Journal of Database Theory and Application, IJSER, IJACT, IJAIS, IJCIIS, IJCST, IJETTCS आदि पत्रिकाओं के सम्मानित सदस्य।</li>
                      <li><strong className="text-[#C04A18]">तकनीकी समीक्षक:</strong> IEEE द्वारा प्रायोजित सम्मेलनों, CSI Journal of Computing, और IJSCE जैसी उच्च-प्रभाव वाली पत्रिकाओं के लिए सक्रिय समीक्षक।</li>
                      <li><strong className="text-[#C04A18]">व्यावसायिक सदस्यता:</strong> ACM, CSI, ISTE, IETE, IANG, WSEAS आदि के सम्मानित सदस्य।</li>
                    </ul>
                  </div>
                </FadeSection>

                <FadeSection delay={400} className="h-full">
                  <div className="bg-[#FFF9F2] p-8 rounded-2xl border border-[#F0D5B8]/60 hover:shadow-lg transition-shadow h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#E8622A]/10 flex items-center justify-center border border-[#E8622A]/20">
                        <Mic className="w-6 h-6 text-[#E8622A]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#5C1010] font-serif">प्रखर सार्वजनिक बौद्धिक एवं वक्ता</h3>
                    </div>
                    <p className="text-[#7A5C45] mb-4 text-sm">डॉ. शुक्ला देश के ज्वलंत और नीतिगत मुद्दों पर एक विश्वसनीय, प्रखर और तार्किक आवाज बनकर उभरे हैं:</p>
                    <ul className="space-y-3 text-[#1E0F05] list-disc list-inside ml-2 text-sm">
                      <li><strong className="text-[#C04A18]">मीडिया एवं लेखन:</strong> राष्ट्रनीति, तकनीक, विकास और सामाजिक विषयों पर उनके आलेख प्रिंट और डिजिटल मीडिया में नियमित प्रकाशित होते हैं।</li>
                      <li><strong className="text-[#C04A18]">राष्ट्रीय विमर्श:</strong> विभिन्न प्रमुख राष्ट्रीय समाचार चैनलों पर एक विश्वसनीय, प्रखर और राष्ट्र-वैचारिक वक्ता के रूप में स्थापित।</li>
                      <li><strong className="text-[#C04A18]">मुख्य वक्ता:</strong> देश-विदेश के अनेक विश्वविद्यालयों और सार्वजनिक मंचों पर आमंत्रित। उनके वक्तव्य तथ्य, तर्क, राष्ट्रनिष्ठा और संवेदनशीलता का बेजोड़ सम्मिश्रण होते हैं।</li>
                    </ul>
                  </div>
                </FadeSection>
              </div>

              <FadeSection delay={500}>
                <div className="bg-gradient-to-br from-[#E8622A] to-[#C04A18] p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, white, white 1px, transparent 1px, transparent 10px)`}}/>
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-center font-serif mb-6 drop-shadow-md">अंत्योदय और जन-सेवा के प्रति अटूट प्रतिबद्धता</h3>
                    <div className="max-w-3xl mx-auto space-y-4 text-white/90 text-center text-lg leading-relaxed">
                      <p>डॉ. शुक्ला की सबसे बड़ी ताकत जनता के बीच उनकी गहरी पैठ और सामाजिक संवेदनशीलता है। विभिन्न लोकप्रिय सामाजिक और आध्यात्मिक संगठनों के माध्यम से वे वर्षों से क्षेत्र में सक्रिय हैं।</p>
                      <p className="font-semibold text-white">अंतिम व्यक्ति का उदय (अंत्योदय):</p>
                      <p>वंचितों, पिछड़ों और शोषितों की समस्याओं का समाधान करना उनका मूल स्वभाव है। वे इस विचार के प्रबल पक्षधर हैं कि सरकार की हर कल्याणकारी योजना का लाभ समाज की अंतिम पंक्ति में खड़े व्यक्ति तक पूरी ईमानदारी से पहुँचना चाहिए।</p>
                    </div>
                  </div>
                </div>
              </FadeSection>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

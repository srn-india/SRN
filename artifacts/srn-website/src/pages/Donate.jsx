import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, IndianRupee, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

export default function Donate() {
  const { lang } = useLanguage();
  const en = lang === "en";

  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleQuickSelect = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(Number(val));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate payment process
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAmount(1000);
      setCustomAmount("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#FDF5EC] py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E8622A]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#D4880C]/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* ── LEFT: Impact & Context ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8622A] to-[#C04A18] flex items-center justify-center mb-6 shadow-lg shadow-orange-900/20">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#5C1010] leading-tight mb-6">
              {en ? "Empower the Future of the Nation" : "राष्ट्र के भविष्य को सशक्त बनाएं"}
            </h1>
            <p className="text-[#7A5C45] text-lg leading-relaxed mb-10">
              {en 
                ? "Your contribution directly fuels initiatives that promote self-reliance, cultural pride, and holistic community development across India." 
                : "आपका योगदान सीधे तौर पर उन पहलों को बढ़ावा देता है जो पूरे भारत में आत्मनिर्भरता, सांस्कृतिक गौरव और समग्र सामुदायिक विकास को बढ़ावा देते हैं।"}
            </p>

            <div className="space-y-6">
              {[
                { title: en ? "80G Tax Exemption" : "80G कर छूट", desc: en ? "All donations are 50% tax-exempt under section 80G of IT Act." : "सभी दान आयकर अधिनियम की धारा 80G के तहत 50% कर-मुक्त हैं।" },
                { title: en ? "Transparent Use of Funds" : "निधियों का पारदर्शी उपयोग", desc: en ? "We maintain strict auditing and regular reporting." : "हम सख्त ऑडिटिंग और नियमित रिपोर्टिंग बनाए रखते हैं।" },
                { title: en ? "Direct Impact" : "सीधा प्रभाव", desc: en ? "90% of your donation goes directly to field programs." : "आपके दान का 90% सीधे क्षेत्रीय कार्यक्रमों में जाता है।" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E8622A]/30 flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-5 h-5 text-[#E8622A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E0F05]">{item.title}</h3>
                    <p className="text-sm text-[#7A5C45] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Donation Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-[#E8622A]/10 relative overflow-hidden"
          >
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E8622A] to-[#D4880C]" />

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#5C1010] font-serif mb-2">
                  {en ? "Thank You!" : "धन्यवाद!"}
                </h3>
                <p className="text-[#7A5C45]">
                  {en ? "Your generous contribution has been received." : "आपका उदार योगदान प्राप्त हो गया है।"}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <h2 className="text-2xl font-bold font-serif text-[#1E0F05] mb-6">
                  {en ? "Make a Secure Donation" : "सुरक्षित दान करें"}
                </h2>

                {/* Amount Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-[#7A5C45] mb-3 uppercase tracking-wider">
                    {en ? "Select Amount (INR)" : "राशि चुनें (INR)"}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {QUICK_AMOUNTS.map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleQuickSelect(val)}
                        className={`py-3 rounded-xl font-bold text-lg transition-all duration-200 border-2 ${
                          amount === val && !customAmount
                            ? "bg-[#E8622A]/10 border-[#E8622A] text-[#E8622A]"
                            : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      placeholder={en ? "Custom Amount" : "अन्य राशि"}
                      value={customAmount}
                      onChange={handleCustomChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-[#1E0F05] focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] transition-colors"
                    />
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-4 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Full Name" : "पूरा नाम"} *</label>
                      <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Phone Number" : "फ़ोन नंबर"} *</label>
                      <input required type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "Email Address" : "ईमेल"} *</label>
                      <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#7A5C45] mb-1.5 uppercase">{en ? "PAN Number (For 80G)" : "पैन नंबर (80G के लिए)"}</label>
                      <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#E8622A]/30 focus:border-[#E8622A] outline-none uppercase" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-900/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {en ? "Proceed to Pay" : "भुगतान करें"} ₹{amount || 0}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  {en ? "Secured via industry-standard encryption." : "उद्योग-मानक एन्क्रिप्शन के माध्यम से सुरक्षित।"}
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

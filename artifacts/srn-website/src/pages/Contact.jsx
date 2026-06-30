import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { lang } = useLanguage();
  const en = lang === "en";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const inputClass = "w-full px-5 py-3.5 rounded-xl bg-white/60 border border-[#E8D5B8] focus:outline-none focus:ring-2 focus:ring-[#E8622A]/40 focus:border-[#E8622A] text-[#2C1810] placeholder-[#B89070] shadow-sm backdrop-blur-md transition-all";
  const labelClass = "block text-xs font-bold text-[#5C3A1E] uppercase tracking-wider mb-2 ml-1";

  const contactCards = [
    {
      icon: MapPin,
      title: en ? "Headquarters" : "मुख्यालय",
      content: en ? "Sashakt Rashtra Nirman Bhawan\nSector 18, New Delhi, India 110001" : "सशक्त राष्ट्र निर्माण भवन\nसेक्टर 18, नई दिल्ली, भारत 110001"
    },
    {
      icon: Phone,
      title: en ? "Phone Support" : "फ़ोन समर्थन",
      content: "+91 98765 43210\n+91 11 2345 6789"
    },
    {
      icon: Mail,
      title: en ? "Email Address" : "ईमेल पता",
      content: "contact@srnindia.org\nsupport@srnindia.org"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF5EC] font-sans selection:bg-[#E8622A] selection:text-white pb-24">
      {/* Hero Section */}
      <section className="relative bg-[#FFF5EB] pt-[120px] pb-10 text-center px-6 overflow-hidden">
        {/* Background Image (Soft Orange Gradient) */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.22]"
          style={{ backgroundImage: "url('/plain-hero-bg.svg')" }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold font-serif text-[#5C1010] mb-6 drop-shadow-sm"
          >
            {en ? "Get in Touch" : "संपर्क करें"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base md:text-lg text-[#7A5C45] font-medium max-w-2xl mx-auto"
          >
            {en 
              ? "Have questions about our initiatives or want to partner with us? We'd love to hear from you." 
              : "क्या हमारी पहलों के बारे में कोई प्रश्न हैं या हमारे साथ साझेदारी करना चाहते हैं? हमें आपसे सुनना अच्छा लगेगा।"}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 relative z-20 mt-8">
        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-xl text-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-[#FEF0E6] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#E8622A] transition-all duration-300">
                  <Icon className="w-7 h-7 text-[#E8622A] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold font-serif text-[#2C1810] mb-3">{card.title}</h3>
                <p className="text-[#7A5C45] whitespace-pre-line font-medium leading-relaxed">
                  {card.content}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Area: Form & Map */}
        <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Form Side */}
          <div className="p-10 lg:p-14 lg:w-1/2 flex flex-col justify-center">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold font-serif text-[#2C1810] mb-4">
                  {en ? "Message Sent!" : "संदेश भेजा गया!"}
                </h2>
                <p className="text-[#7A5C45] text-lg mb-8">
                  {en ? "Thank you for reaching out. Our team will get back to you shortly." : "संपर्क करने के लिए धन्यवाद। हमारी टीम जल्द ही आपसे संपर्क करेगी।"}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-[#E8622A] text-white rounded-xl font-bold shadow-md hover:bg-[#C04A18] transition-colors"
                >
                  {en ? "Send Another Message" : "एक और संदेश भेजें"}
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-10">
                  <h2 className="text-3xl font-bold font-serif text-[#2C1810] mb-3">
                    {en ? "Send a Message" : "एक संदेश भेजें"}
                  </h2>
                  <p className="text-[#7A5C45] font-medium">
                    {en ? "Fill out the form below and we'll reply as soon as possible." : "नीचे दिया गया फॉर्म भरें और हम जल्द से जल्द जवाब देंगे।"}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelClass}>{en ? "Your Name" : "आपका नाम"}</label>
                      <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="John Doe" />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>{en ? "Email Address" : "ईमेल"}</label>
                      <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className={labelClass}>{en ? "Subject" : "विषय"}</label>
                    <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required className={inputClass} placeholder={en ? "How can we help?" : "हम कैसे मदद कर सकते हैं?"} />
                  </div>
                  <div>
                    <label htmlFor="message" className={labelClass}>{en ? "Message" : "संदेश"}</label>
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required className={`${inputClass} resize-none`} placeholder={en ? "Write your message here..." : "अपना संदेश यहाँ लिखें..."} />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-[#E8622A] to-[#C04A18] hover:from-[#F47A3A] hover:to-[#D45A28] text-white rounded-xl font-bold shadow-xl shadow-orange-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (en ? "Sending..." : "भेजा जा रहा है...") : (
                      <>
                        <Send className="w-5 h-5" />
                        {en ? "Send Message" : "संदेश भेजें"}
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Map Side */}
          <div className="lg:w-1/2 min-h-[400px] lg:min-h-full bg-gray-200 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112061.09262729906!2d77.1582209!3d28.63243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1716910241029!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="SRN Headquarters Map"
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}

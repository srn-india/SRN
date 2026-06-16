import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function AuthSuccess() {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // Extract token from query params and save it to localStorage
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (token) {
        localStorage.setItem("accessToken", token);
      }

      // Verify auth status
      const user = await checkAuth();
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    };
    
    // Slight delay of 1s for high-end micro-animation transition feel
    const timer = setTimeout(handleAuth, 1000);
    return () => clearTimeout(timer);
  }, [checkAuth, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF5EC] px-4">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(232,98,42,0.08) 0%, transparent 65%)" }} />
      
      <div className="w-full max-w-sm text-center relative z-10">
        {/* Animated Badge Indicator */}
        <div className="flex justify-center mb-6">
          <motion.div 
            className="w-16 h-16 rounded-full bg-[#E8622A]/10 border border-[#E8622A]/30 flex items-center justify-center text-[#E8622A]"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              ease: "easeInOut" 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2 animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          </motion.div>
        </div>

        {/* Text */}
        <motion.h2 
          className="text-2xl font-bold font-serif text-[#2C1A0E] mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Connecting Account...
        </motion.h2>
        <motion.p 
          className="text-sm text-[#7A5C45]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Verifying your secure session, please wait.
        </motion.p>
      </div>
    </div>
  );
}

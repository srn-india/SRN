import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function PageTransition({ children }) {
  const location = useLocation();
  const transitionRef = useRef(null);

  useGSAP(() => {
    // Smooth fade & slide in when navigating between routes
    gsap.fromTo(
      transitionRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [location.pathname]);

  return (
    <div ref={transitionRef} className="w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}

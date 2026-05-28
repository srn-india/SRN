import { useRef, useState, cloneElement } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const transitionRef = useRef(null);

  useGSAP(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Simple fade out content
      gsap.to(transitionRef.current, {
        opacity: 0,
        y: 15, // Subtle slight upward movement
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => {
          // Change route
          setDisplayLocation(location);
          
          // Reset position before fading back in
          gsap.set(transitionRef.current, { y: 15 });
          
          // Fade content back in
          gsap.to(transitionRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          });
        }
      });
    }
  }, [location, displayLocation]);

  return (
    <div ref={transitionRef} className="w-full flex-1 flex flex-col">
      {cloneElement(children, { location: displayLocation })}
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, MapPin } from "lucide-react";
import India from "@react-map/india";

export default function StateBearersMap({ lang }) {
  const [hoveredState, setHoveredState] = useState(null);
  const [mapSize, setMapSize] = useState(576);

  useEffect(() => {
    const updateSize = () => {
      const newSize = Math.min(window.innerWidth - 32, 576);
      setMapSize(newSize);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleSelect = (stateName) => {
    // No action on click
  };

  // Directly attach native listeners to SVG paths after map renders
  useEffect(() => {
    // Small delay to ensure the @react-map/india SVG has mounted in the DOM
    const timer = setTimeout(() => {
      const paths = document.querySelectorAll(".state-map-wrapper svg path");

      const handlers = [];
      paths.forEach((path) => {
        // Add class for CSS-based hover highlighting
        path.classList.add("state-path");

        const onOver = () => {
          const raw =
            path.getAttribute("title") ||
            path.getAttribute("aria-label") ||
            path.getAttribute("id") ||
            path.getAttribute("name") ||
            null;
          const name = raw ? raw.split("«")[0].replace(/-$/, "").trim() : null;
          if (name) setHoveredState(name);
        };
        const onOut = () => {
          setHoveredState(null);
        };
        path.addEventListener("mouseover", onOver);
        path.addEventListener("mouseout", onOut);
        handlers.push({ path, onOver, onOut });
      });

      // Cleanup
      return () => {
        handlers.forEach(({ path, onOver, onOut }) => {
          path.removeEventListener("mouseover", onOver);
          path.removeEventListener("mouseout", onOut);
        });
      };
    }, 500);

    return () => clearTimeout(timer);
  }, [mapSize]);

  const en = lang === "en";

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* CSS for hover highlighting — survives library re-renders */}
      <style>{`
        .state-path:hover {
          fill: #E8622A !important;
          cursor: pointer;
        }
      `}</style>
      <div 
        className="state-map-wrapper relative flex justify-center py-8 cursor-pointer"
      >
        <India
          type="select-single"
          size={mapSize}
          mapColor="#FFF9F2"
          strokeColor="#E8622A"
          strokeWidth={1}
          hoverColor="#E8622A"
          selectColor="#C04A18"
          hints={false}
          onSelect={handleSelect}
        />

        {/* Fixed Legend Display — top-right corner */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-[#FDF5EC] rounded-xl shadow-lg border border-[#F0D5B8] border-l-4 border-l-[#E8622A] p-3 md:p-4 min-w-[140px] md:min-w-[180px] pointer-events-none z-10 transition-all duration-300">
          <p className="text-[#7A5C45] text-[10px] md:text-xs uppercase tracking-wider font-semibold mb-1">
            {en ? "Selected Region" : "चयनित क्षेत्र"}
          </p>
          <h3 className={`font-bold text-[#2C1810] font-serif ${hoveredState ? 'text-base md:text-lg' : 'text-sm md:text-base italic text-[#7A5C45]/70'}`}>
            {hoveredState || (en ? "Hover over a state" : "राज्य पर होवर करें")}
          </h3>
        </div>
      </div>

    </div>
  );
}
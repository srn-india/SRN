import { Link } from "react-router-dom";
import { Hammer } from "lucide-react";

export default function Placeholder({ title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF5EC] px-6">
      <div className="bg-white border border-[#E8622A]/20 shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#E8622A]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Hammer className="w-8 h-8 text-[#E8622A]" />
        </div>
        <h1 className="text-3xl font-bold font-serif text-[#5C1010] mb-3">{title}</h1>
        <p className="text-[#7A5C45] mb-8">This page is currently under construction. Please check back later.</p>
        <Link to="/" className="inline-block px-8 py-3 bg-gradient-to-r from-[#E8622A] to-[#C04A18] text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
          Go Home
        </Link>
      </div>
    </div>
  );
}

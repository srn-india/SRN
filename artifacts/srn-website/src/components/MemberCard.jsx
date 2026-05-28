export default function MemberCard({ initials, nameHindi, name, batch, qualification, role, lang }) {
  const en = lang === "en";
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_48px_rgba(232,98,42,0.15)] hover:border-[#E8622A]/30 hover:-translate-y-2 transition-all duration-500 h-full group relative overflow-hidden">
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8622A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-start gap-5 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E8622A] to-[#C04A18] text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-orange-900/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          {initials}
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="font-bold text-[#2C1810] text-xl leading-tight font-serif group-hover:text-[#E8622A] transition-colors duration-300">
            {en ? name : nameHindi}
          </h3>
          <span className="inline-block mt-2.5 bg-gradient-to-r from-[#FDF5EC] to-white border border-[#E8D5B8]/60 rounded-full text-xs font-bold text-[#5C3A1E] px-3.5 py-1 shadow-sm">
            {batch}
          </span>
          <p className="text-[#E8622A] font-bold text-sm mt-3 tracking-wide">{role}</p>
          <p className="text-[#7A5C45] text-sm mt-1.5 font-medium leading-relaxed">{qualification}</p>
        </div>
      </div>
    </div>
  );
}

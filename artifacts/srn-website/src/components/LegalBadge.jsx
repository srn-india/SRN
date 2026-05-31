export default function LegalBadge({ label, darkBg = false }) {
  if (darkBg) {
    return (
      <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:border-[#E8622A]/60 hover:shadow-[0_0_15px_rgba(232,98,42,0.3)] rounded-full px-5 py-2.5 text-white font-medium text-sm hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 cursor-default">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E8622A] shadow-[0_0_5px_rgba(232,98,42,0.8)]" />
        {label}
      </span>
    );
  }

  return (
    <span className="bg-[#FFF9F2] border border-[#E8622A]/40 hover:border-[#E8622A] rounded-full px-5 py-2 text-[#5C1010] font-medium text-sm hover:bg-[#FFF0E6] hover:shadow-sm transition-all duration-200 cursor-default">
      {label}
    </span>
  );
}

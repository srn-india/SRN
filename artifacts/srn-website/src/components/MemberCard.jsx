export default function MemberCard({ initials, nameHindi, name, batch, qualification, role, lang }) {
  const en = lang === "en";
  return (
    <div className="bg-white rounded-xl p-6 border border-[#F0D5B8] shadow-sm hover:shadow-lg hover:border-[#E8622A] hover:-translate-y-1 transition-all duration-300 card-shimmer h-full">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8622A] to-[#C04A18] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-md shadow-orange-200">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#1E0F05] text-lg leading-tight font-serif">
            {en ? name : nameHindi}
          </h3>
          <span className="inline-block mt-2 bg-[#FDF5EC] border border-[#E8622A]/30 rounded-full text-xs text-[#5C1010] px-3 py-1">
            {batch}
          </span>
          <p className="text-[#E8622A] font-semibold text-sm mt-2">{role}</p>
          <p className="text-[#7A5C45] text-sm mt-1">{qualification}</p>
        </div>
      </div>
    </div>
  );
}

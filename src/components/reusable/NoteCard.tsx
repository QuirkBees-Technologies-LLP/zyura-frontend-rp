import { Calendar, Pin } from "lucide-react";
import React from "react";

interface NoteCardProps {
  title: string;
  description: string;
  date?: string;
  isFirstRow?: boolean;
  onClick?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  title,
  description,
  date,
  isFirstRow = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200"
    >
      {/* Yellow Corner Triangle Ribbon */}
      {isFirstRow && (
        <div
          className="absolute top-0 left-0 z-10"
          style={{
            width: 0,
            height: 0,
            borderStyle: "solid",
            borderWidth: "44px 44px 0 0",
            borderColor: "#FBBF24 transparent transparent transparent",
          }}
        />
      )}

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Date + Pin Row */}
        <div className="flex justify-between items-center text-gray-400 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={15} strokeWidth={1.5} />
            <span>{date ?? "—"}</span>
          </div>
          <Pin size={16} strokeWidth={1.5} className="rotate-45" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-800 mb-3 leading-snug">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {description.length > 250
            ? description.slice(0, 250) + "..."
            : description}
        </p>
      </div>

      {/* Dashed Bottom Line */}
      <div className="border-t border-dashed border-gray-200 mt-2" />
    </div>
  );
};

export default NoteCard;
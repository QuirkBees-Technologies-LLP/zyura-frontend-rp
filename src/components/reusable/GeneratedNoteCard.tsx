import { Calendar, Trash2, Loader2 } from "lucide-react";
import React from "react";
import ReactMarkdown from "react-markdown";

interface GeneratedNoteCardProps {
  title: string;
  description: string;
  date: string;
  isFirstRow?: boolean;
  onViewNodes: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

const GeneratedNoteCard: React.FC<GeneratedNoteCardProps> = ({
  title,
  description,
  date,
  isFirstRow = false,
  onViewNodes,
  onDelete,
  isDeleting = false,
}) => {
  return (
    <div
      onClick={onViewNodes}
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

      <div className="p-6 flex flex-col flex-1">
        {/* Date + Delete Row */}
        <div className="flex justify-between items-center text-gray-400 mb-5">
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={15} strokeWidth={1.5} />
            <span>{date ?? "—"}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent card click when deleting
              onDelete();
            }}
            disabled={isDeleting}
            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Title */}
        <div className="text-2xl font-bold text-slate-800 mb-3 leading-snug prose prose-sm max-w-none">
          <ReactMarkdown>{title}</ReactMarkdown>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-500 leading-relaxed line-clamp-5 prose prose-sm prose-slate max-w-none">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
      </div>

      {/* Dashed Bottom Line */}
      <div className="border-t border-dashed border-gray-200 mt-2" />
    </div>
  );
};

export default GeneratedNoteCard;
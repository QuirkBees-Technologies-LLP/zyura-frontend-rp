import { IFlashcardBank } from "@/types";
import { Play, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FlashCard({
  source,
  onDelete,
  isDeleting,
  ...flashcard
}: IFlashcardBank & {
  source?: "all" | "generated";
  onDelete?: () => void;
  isDeleting?: boolean;
}) {
  const navigate = useNavigate();
  const handleQuiz = (id: string) => {
    navigate(`/dashboard/solve-flash-card/${id}`, {
      state: { source: source, totalFlashCards: flashcard?.totalFlashCards },
    });
  };

  return (
    <div
      className={`group relative border rounded-xl p-4 transition-all duration-300 flex flex-col justify-between h-full min-h-40
    ${
      flashcard?.isComplete
        ? "border-green-300"
        : "bg-white border-slate-300 hover:border-blue-300"
    }`}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-3">
        {/* Left Content */}
        <div className="flex gap-4 items-start w-full">
          {/* Icon Box */}
          <div
            className={`grid min-w-16 h-16 w-16 place-items-center rounded-2xl
          ${
            flashcard?.isComplete
              ? "bg-green-500 text-white"
              : "bg-brand text-white border border-slate-100"
          }`}
          >
            <Play className="w-7 h-7" />
          </div>

          {/* Title + Meta */}
          <div className="flex-1">
            <h4 className="font-medium text-slate-900 leading-tight transition-colors mb-2">
              {flashcard?.title}
              {flashcard?.subject && ` → ${flashcard?.subject}`}
            </h4>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {/* Profile Badge */}
              <span className="px-2 py-0.5 bg-white text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-tight border border-slate-200 whitespace-nowrap">
                FLASH CARD
              </span>

              {/* Flashcard Count + Topic */}
              {/* Flashcard Count + Topic */}
              <div className="flex items-center gap-2 flex-wrap text-sm text-slate-500">
                {/* Only show count if available */}
                {flashcard?.totalFlashCards ? (
                  <span>{flashcard.totalFlashCards} flashcards</span>
                ) : null}

                {/* Topic */}
                {flashcard?.topic && (
                  <span>
                    {flashcard?.totalFlashCards ? "• " : ""}
                    {flashcard.topic}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Button */}
        {source === "generated" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-3 mt-6">
        {/* Action Button */}
        <button
          onClick={() => handleQuiz(flashcard?._id)}
          className={`w-full flex items-center justify-center gap-1.5 text-sm font-medium rounded-xl text-white transition-all cursor-pointer px-4 py-3
    ${
      flashcard?.isComplete
        ? "bg-green-500 hover:bg-green-600"
        : "bg-brand hover:bg-brand/90"
    }`}
        >
          <Play className="w-4 h-4 fill-current shrink-0" />

          <span className="whitespace-nowrap">
            {flashcard?.isComplete ? "View Again" : "View Card"}
          </span>
        </button>

        {/* Status Badge */}
        {flashcard?.totalFlashCards !== undefined &&
          flashcard?.totalFlashCards !== null && (
            <span
              className={`px-4 py-2 rounded-full text-[12px] font-normal border flex items-center justify-center whitespace-nowrap
      ${
        flashcard?.isComplete
          ? "bg-green-600/10 text-green-600 border-green-600"
          : "bg-white text-black border-slate-200"
      }`}
            >
              {flashcard?.isComplete
                ? `Completed ${flashcard?.totalFlashCards}/${flashcard?.totalFlashCards}`
                : flashcard?.totalFlashCards}
            </span>
          )}
      </div>
    </div>
  );
}

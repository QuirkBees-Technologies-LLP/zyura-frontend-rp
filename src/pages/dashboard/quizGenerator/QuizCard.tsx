import { Play, EllipsisVertical, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface QuizCardProps {
  id: string;
  title: string;
  questionCount?: number;
  duration?: number;
  sourceFile?: string;
  isCompleted?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
  // Tracking fields from API
  tracking?: {
    totalMcqCount?: number;
    totalAttemptCount?: number;  
    correctMcqCount?: number;   
    wrongMcqCount?: number;     
    correctPercentage?: number;
    wrongPercentage?: number;    
    unattemptedPercentage?: number; 
    timeTaken?: string;
    progress?: number;           
    lastAttemptAnswers?: Array<{ 
      mcqId: string;
      userSelectedOption: string;
    }>;
  };
  updatedAt?: string;
}


/** Converts seconds (as string or number) to MM:SS format */
function formatTimeToMMSS(timeTaken?: string | number): string {
  if (timeTaken === undefined || timeTaken === "" || timeTaken === "0" || timeTaken === 0) return "00:00";

  // Already in mm:ss format — return as-is
  if (typeof timeTaken === "string" && timeTaken.includes(":")) {
    return timeTaken;
  }

  // Numeric seconds — convert to mm:ss
  const totalSeconds = Number(timeTaken);
  if (isNaN(totalSeconds)) return "00:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * True only when the quiz has a full submitted run: every MCQ counted in the
 * quiz has a persisted attempt count (tracking is updated on successful submit).
 * Falls back to `isCompleted` from the API when we cannot infer totals.
 */
function isQuizFullyComplete(
  isCompleted: boolean | undefined,
  tracking: QuizCardProps["tracking"],
  questionCount: number | undefined,
): boolean {
  const totalMcq =
    (typeof tracking?.totalMcqCount === "number" && tracking.totalMcqCount > 0
      ? tracking.totalMcqCount
      : typeof questionCount === "number" && questionCount > 0
        ? questionCount
        : 0) || 0;
  const attempts = tracking?.totalAttemptCount ?? 0;

  if (totalMcq > 0) {
    return attempts >= totalMcq;
  }
  return Boolean(isCompleted);
}

/** Returns a human-readable relative time string, e.g. "2 hours ago". */
function timeAgo(dateStr?: string): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function QuizCard({
  id,
  title,
  questionCount,
  duration,
  sourceFile,
  isCompleted,
  onDelete,
  isDeleting,
  tracking,
  updatedAt,
}: QuizCardProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const quizComplete = isQuizFullyComplete(isCompleted, tracking, questionCount);

  const handleQuiz = (id: string) => {
    if (quizComplete) {
      navigate(`/dashboard/quiz-analysis/${id}`, {
        state: { activeTab: "myQuiz" },
      });
    } else {
      navigate(
        `/dashboard/quiz/${id}?duration=${
          (duration || 10) * 60
        }&limit=${tracking?.totalMcqCount || questionCount || 10}`,
      );
    }
  };

  const totalForProgress =
    (typeof tracking?.totalMcqCount === "number" && tracking.totalMcqCount > 0
      ? tracking.totalMcqCount
      : typeof questionCount === "number" && questionCount > 0
        ? questionCount
        : 0) || 0;
  const attemptCount = tracking?.totalAttemptCount ?? 0;
  const hasProgress =
    attemptCount > 0 &&
    (totalForProgress === 0 || attemptCount < totalForProgress);

  // Derive display values dynamically
  const accuracy =
    tracking?.correctPercentage !== undefined
      ? `${tracking.correctPercentage}%`
      : "—";

  const totalQuestions = tracking?.totalMcqCount ?? questionCount ?? "—";

  // const timeTakenDisplay = formatTimeToMMSS((duration || 10) * 60);
  const timeTakenDisplay = formatTimeToMMSS(tracking?.timeTaken);
  const lastAttempt = timeAgo(updatedAt);

  return (
    <div>
      <div className="p-5 bg-white border border-gray-100 rounded-[12px] h-full flex flex-col justify-between">
        <div className="mb-5 flex justify-between items-start gap-2">
          <div className="w-full">
            <div className="flex items-start gap-2">
              <h3 className="text-[#0A0A0A] font-semibold leading-tight">
                {title || "Untitled Quiz"}
              </h3>
            </div>

            {(questionCount !== undefined || sourceFile) && (
              <p className="text-sm text-slate-500 mt-3">
                {questionCount !== undefined && `${questionCount} questions`}
                {questionCount !== undefined && sourceFile && " • "}
                {sourceFile && `From ${sourceFile}`}
              </p>
            )}
          </div>

          {onDelete && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                disabled={isDeleting}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                <EllipsisVertical className="w-5 h-5" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      handleQuiz(id);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete?.();
                    }}
                    disabled={isDeleting}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Delete
                      </div>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic stats from API tracking data */}
        <div className="w-full max-w-sm bg-white mb-5">
          <div className="divide-y divide-gray-200 text-sm text-gray-600">
            <div className="flex items-center justify-between px-4 py-3">
              <span>Accuracy:</span>
              <span className="font-medium text-gray-800">{accuracy}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span>Questions:</span>
              <span className="font-medium text-gray-800">
                {totalQuestions}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span>Time:</span>
              <span className="font-medium text-gray-800">
                {timeTakenDisplay}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span>Last Attempt:</span>
              <span className="font-medium text-gray-800">{lastAttempt}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleQuiz(id)}
          className={`w-full rounded-sm py-3 flex justify-center gap-1 items-center transition-colors text-white cursor-pointer mt-auto ${
            quizComplete
              ? "bg-[#0A5BB8] hover:bg-[#0A5BB8]/90"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {quizComplete ? (
            <>View Analysis</>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> {hasProgress ? "Continue Quiz" : "Start Quiz"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

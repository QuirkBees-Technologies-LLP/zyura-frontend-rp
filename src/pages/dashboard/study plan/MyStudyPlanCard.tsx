/* eslint-disable @typescript-eslint/no-explicit-any */
import PrimaryButton from "@/components/reusable/PrimaryButton";
import { CalendarRange, MessageSquare, Pencil, Target, Trash2, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

/** Matches backend TASK_RATES_SECONDS for listing stats */
const RATE_SEC_BY_TASK: Record<string, number> = {
  mcq: 40,
  mcqs: 40,
  flashcard: 180,
  flashcards: 180,
  "clinical case": 300,
  clinical_case: 300,
  note: 900,
  notes: 900,
};

const parseLocalDate = (dateStr: string): Date => {
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [y, m, d] = clean.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfLocalDay = (d: Date): Date => {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  return t;
};

/** e.g. 39h 34m -> "39:34" (for display next to "hrs") */
function secToHmm(totalSec: number): string {
  if (!Number.isFinite(totalSec) || totalSec <= 0) return "0:00";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}

function computePlanStats(plan: any) {
  const today = startOfLocalDay(new Date());

  const goalName =
    String(plan?.title ?? "").trim() ||
    String(plan?.exam_name ?? "").trim() ||
    String(plan?.plan_summary ?? "").trim() ||
    "Study plan";

  const examDateStr = plan?.exam_date as string | undefined;
  const examDate = examDateStr ? parseLocalDate(examDateStr.split("T")[0]) : null;
  const daysLeft = examDate
    ? Math.max(
        0,
        Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      )
    : 0;

  let remainingSec = 0;
  for (const d of plan?.daily_plan ?? []) {
    const dDate = parseLocalDate(String(d?.date ?? ""));
    if (dDate.getTime() < today.getTime()) continue;
    for (const t of d?.hourly_breakdown ?? []) {
      if (t?.isCompleted) continue;
      const dh = Number(t?.duration_hours ?? 0) || 0;
      const dm = Number(t?.duration_minutes ?? 0) || 0;
      remainingSec += dh * 3600 + dm * 60;
    }
  }

  const todayDay = (plan?.daily_plan ?? []).find(
    (d: any) => parseLocalDate(String(d?.date ?? "")).getTime() === today.getTime(),
  );

  let todaySec = 0;
  if (todayDay) {
    for (const t of todayDay?.hourly_breakdown ?? []) {
      const tt = String(t?.task_type ?? "").toLowerCase();
      const rate = RATE_SEC_BY_TASK[tt] ?? 0;
      const attempted = Number(t?.attempted_count ?? 0) || 0;
      todaySec += attempted * rate;
    }
  }

  const dailyBudgetHrs = Number(plan?.daily_study_time ?? 0) || 0;
  const todayHours = todaySec / 3600;

  let correct = 0;
  let attempted = 0;
  for (const d of plan?.daily_plan ?? []) {
    for (const t of d?.hourly_breakdown ?? []) {
      const tt = String(t?.task_type ?? "").toLowerCase();
      if (tt !== "mcq" && tt !== "mcqs") continue;
      for (const a of t?.attempts ?? []) {
        attempted++;
        if (a?.isCorrect === true) correct++;
      }
    }
  }
  const accuracyPct = attempted > 0 ? (correct / attempted) * 100 : 0;

  let totalTasks = 0;
  let doneTasks = 0;
  for (const d of plan?.daily_plan ?? []) {
    for (const t of d?.hourly_breakdown ?? []) {
      totalTasks++;
      if (t?.isCompleted === true) doneTasks++;
    }
  }
  const completedPct = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

  return {
    goalName,
    daysLeft,
    remainingHmm: secToHmm(remainingSec),
    todayHmm: secToHmm(todaySec),
    todayHours,
    dailyBudgetHrs,
    accuracyPct,
    completedPct,
  };
}

interface MyStudyPlanCardProps {
  plan: any;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function MyStudyPlanCard({
  plan,
  onDelete,
  isDeleting = false,
}: MyStudyPlanCardProps) {
  const navigate = useNavigate();

  const stats = useMemo(() => computePlanStats(plan), [plan]);

  const allTopics = useMemo(
    () => [...new Set((plan?.daily_plan ?? []).flatMap((day: any) => day?.topics ?? []))],
    [plan?.daily_plan],
  );

  const handleViewPlan = () => {
    navigate(`/dashboard/weekly-plan/${plan._id}`, { state: { plan } });
  };

  const handleChat = () => {
    navigate(`/dashboard/weekly-plan/${plan._id}?chat=1`, { state: { plan } });
  };

  const handleEditPlan = () => {
    navigate("/dashboard/smart-study/create", { state: { mode: "edit" as const, plan } });
  };

  const heading = plan.title?.trim() || plan.plan_summary;
  const showPlannerChat =
    plan.created_from === "smart_study_planner" && Boolean(plan.thread_id);
  const showEditPlan = plan.created_from === "smart_study_planner";

  const acc = stats.accuracyPct;
  const comp = stats.completedPct;

  return (
    <div className="flex flex-col justify-between p-5 bg-indigo-50 border border-indigo-300 rounded-[8px]">
      <div>
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">{heading}</h3>
          <div className="flex items-start gap-0.5 shrink-0">
            {showEditPlan && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditPlan();
                }}
                className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors cursor-pointer"
                title="Edit plan"
                aria-label="Edit plan"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                disabled={isDeleting}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 mb-4">
          <div className="flex items-start gap-2 min-w-0">
            <Target className="w-7 h-7 text-gray-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="font-medium text-gray-500 text-sm">Your goal</div>
              <div className="font-medium text-slate-800 text-sm break-words">{stats.goalName}</div>
            </div>
          </div>

          <div className="flex items-start gap-2 min-w-0">
            <CalendarRange className="w-7 h-7 text-gray-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="font-medium text-gray-500 text-sm">Time Left</div>
              <div className="font-medium text-slate-800 text-sm">
                {stats.daysLeft} {stats.daysLeft === 1 ? "day" : "days"} ({stats.remainingHmm}{" "}
                hrs) remaining
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 min-w-0">
            <CardCircularProgress value={stats.todayHours} max={stats.dailyBudgetHrs || 1} />
            <div className="min-w-0">
              <div className="font-medium text-gray-500 text-sm">Daily Target</div>
              <div className="font-medium text-slate-800 text-sm">
                {stats.todayHmm} hrs / {stats.dailyBudgetHrs} hrs
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-zinc-700 text-sm">Progress %</span>
            <div className="flex gap-3 text-xs sm:text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full shrink-0" />
                <span className="font-medium text-zinc-700">
                  Accuracy {(acc || 0).toFixed(2)}%
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-400 rounded-full shrink-0" />
                <span className="font-medium text-zinc-700">
                  Completed {(comp || 0).toFixed(2)}%
                </span>
              </span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
            <div className="h-full flex transition-all duration-500">
              {(acc || 0) < (comp || 0) ? (
                <>
                  <div
                    className="bg-blue-600 h-full transition-all duration-500"
                    style={{ width: `${acc || 0}%` }}
                    title={`Accuracy: ${(acc || 0).toFixed(2)}%`}
                  />
                  <div
                    className="bg-blue-400 h-full transition-all duration-500"
                    style={{ width: `${(comp || 0) - (acc || 0)}%` }}
                    title={`Extra completion: ${((comp || 0) - (acc || 0)).toFixed(2)}%`}
                  />
                </>
              ) : (
                <>
                  <div
                    className="bg-blue-400 h-full transition-all duration-500"
                    style={{ width: `${comp || 0}%` }}
                    title={`Completed: ${(comp || 0).toFixed(2)}%`}
                  />
                  <div
                    className="bg-blue-600 h-full transition-all duration-500"
                    style={{ width: `${(acc || 0) - (comp || 0)}%` }}
                    title={`Extra accuracy: ${((acc || 0) - (comp || 0)).toFixed(2)}%`}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {allTopics.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
                {(allTopics as string[]).slice(0, 3).map((topic: string, index: number) => (              <p
                key={index}
                className="border border-slate-300 rounded-full text-xs text-slate-700 py-0.5 px-2"
              >
                {topic}
              </p>
            ))}
            {allTopics.length > 3 && (
              <p className="border border-slate-300 rounded-full text-xs text-slate-700 py-0.5 px-2">
                +{allTopics.length - 3} more
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <PrimaryButton className="w-full bg-indigo-500 hover:bg-indigo-600" onClick={handleViewPlan}>
          View Plan
        </PrimaryButton>
        {showPlannerChat && (
          <button
            type="button"
            onClick={handleChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-indigo-400 bg-white text-indigo-700 font-medium hover:bg-indigo-50 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
        )}
      </div>
    </div>
  );
}

interface CardCircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
}

function CardCircularProgress({
  value,
  max,
  size = 40,
  strokeWidth = 5,
}: CardCircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeMax = max > 0 ? max : 1;
  const progress = Math.min(value / safeMax, 1);
  const offset = circumference - progress * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg] shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#22c55e"
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

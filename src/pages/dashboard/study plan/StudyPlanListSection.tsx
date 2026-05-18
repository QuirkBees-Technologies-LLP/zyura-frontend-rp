// import DashboardHeading from "@/components/reusable/DashboardHeading";
import PrimaryButton from "@/components/reusable/PrimaryButton";
import {
  AlertCircle,
  Clock3,
  Eye,
  FileText,
  Loader2,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Target,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Pagination from "@/common/custom/Pagination";
import GlobalLoader2 from "@/common/GlobalLoader2";
import {
  useDeleteStudyPlanMutation,
  useGetStudyPlanQuery,
} from "@/store/features/studyPlan/studyPlan.api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  title?: string;
  description?: string;
  showCreateButton?: boolean;
  createPath?: string;
  createLabel?: string;
  wrapperClassName?: string;
  queryParams?: Record<string, any>;
};

function parseLocalDate(dateStr: string): Date {
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [y, m, d] = clean.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfLocalDay(d: Date): Date {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  return t;
}

function getPlanHeading(plan: any): string {
  return (
    String(plan?.title ?? "").trim() ||
    String(plan?.plan_summary ?? "").trim() ||
    String(plan?.exam_name ?? "").trim() ||
    "Study plan"
  );
}

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

/** e.g. 39h 34m -> "39:34" (for display next to "hrs") */
function secToHmm(totalSec: number): string {
  if (!Number.isFinite(totalSec) || totalSec <= 0) return "0:00";
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  return `${h}:${String(m).padStart(2, "0")}`;
}

function formatDateLong(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = parseLocalDate(dateStr.split("T")[0]);
  if (!Number.isFinite(d.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function computePlanStats(plan: any) {
  const today = startOfLocalDay(new Date());

  const goalName =
    String(plan?.title ?? "").trim() ||
    String(plan?.exam_name ?? "").trim() ||
    String(plan?.plan_summary ?? "").trim() ||
    "Study plan";

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
    (d: any) =>
      parseLocalDate(String(d?.date ?? "")).getTime() === today.getTime(),
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

  const allTopics = [
    ...new Set(
      (plan?.daily_plan ?? []).flatMap((day: any) => day?.topics ?? []),
    ),
  ];

  return {
    goalName,
    remainingHmm: secToHmm(remainingSec),
    todayHmm: secToHmm(todaySec),
    todayHours,
    dailyBudgetHrs,
    accuracyPct,
    completedPct,
    topics: allTopics as string[],
  };
}

type PlanBucket = "all" | "started" | "on_hold" | "completed";

function getPlanBucketFromStatus(status: unknown): Exclude<PlanBucket, "all"> {
  const s = String(status ?? "")
    .toLowerCase()
    .trim();
  if (s === "completed" || s === "complete" || s === "done") return "completed";
  if (s === "on_hold" || s === "on hold" || s === "paused") return "on_hold";
  if (s === "cancelled" || s === "canceled") return "on_hold";
  return "started";
}

export default function StudyPlanListSection({
   title = "Smart Study Planner",
  description = "A structured path to smarter learning and better results.",
  showCreateButton = true,
  createPath = "/dashboard/create-study-plan",
  // createLabel = "Create new plan",
  wrapperClassName = "px-1 md:px-2",
  queryParams,
}: Props) {
  const [page, setPage] = useState(1);
  const [activeBucket, setActiveBucket] = useState<PlanBucket>("all");
  const limit = 12;
  const { data, isLoading } = useGetStudyPlanQuery({
    ...(queryParams ?? {}),
    page,
    limit,
  });
  const [deleteStudyPlan, { isLoading: isDeleting }] =
    useDeleteStudyPlanMutation();
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  const allStudyPlans = data?.data ?? [];

  const filteredPlans = allStudyPlans.filter((plan: any) => {
    if (activeBucket === "all") return true;
    return getPlanBucketFromStatus(plan?.status) === activeBucket;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPlans.length / limit));
  const paginatedPlans = filteredPlans.slice((page - 1) * limit, page * limit);

  const bucketCounts = allStudyPlans.reduce(
    (acc: Record<PlanBucket, number>, plan: any) => {
      acc.all += 1;
      const b = getPlanBucketFromStatus(plan?.status);
      acc[b] += 1;
      return acc;
    },
    { all: 0, started: 0, on_hold: 0, completed: 0 },
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    try {
      await deleteStudyPlan(planToDelete).unwrap();
      setPlanToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className={wrapperClassName}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* <DashboardHeading
            title={title}
            titleSize="text-xl"
            description={description}
            className="mt-12 mb-12 space-y-1"
          />  */}
        </div>

        {/* Create button is shown in the new design header below */}
      </div>

      {isLoading ? (
        <GlobalLoader2 />
      ) : (
        <>
          {/* Old design (commented out) */}
          {/*
            <div className="mb-10">
              {paginatedPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mb-3 transition-all duration-300">
                  {paginatedPlans.map((plan: any) => (
                    <MyStudyPlanCard
                      key={plan._id}
                      plan={plan}
                      onDelete={() => setPlanToDelete(plan._id)}
                      isDeleting={isDeleting && planToDelete === plan._id}
                    />
                  ))}
                </div>
              ) : (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold text-lg">
                    No Study Plans found
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    You haven't created any study plans yet. Create one to get
                    started!
                  </p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          */}
          <div className="mb-16">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
              <h2 className="text-xl font-semibold text-slate-800">
                {" "}
                {title}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {description}
              </p>
              </div>
              {showCreateButton && (
                <Link to={createPath}>
                  <PrimaryButton
                    bgType="solid"
                    bgColor="bg-brand"
                    iconPosition="left"
                    icon={<Plus className="h-4 w-4" />}
                    className="h-10 min-w-fit px-4 text-sm hover:bg-brand hover:opacity-80"
                  >
                    Create new plan
                  </PrimaryButton>
                </Link>
              )}
            </div>

            <div className="mb-6 overflow-x-auto">
              <div className="flex min-w-max items-center gap-6 border-b border-slate-200 pb-2">
                {" "}
                {(
                  [
                    ["all", "All"],
                    ["started", "Started"],
                    ["on_hold", "On Hold"],
                    ["completed", "Completed"],
                  ] as const
                ).map(([key, label]) => {
                  const isActive = activeBucket === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActiveBucket(key);
                        setPage(1);
                      }}
                      className={`relative flex items-center gap-2 pb-2 text-sm transition-colors ${
                        isActive
                          ? "text-slate-900"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <span>{label}</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                        {" "}
                        {bucketCounts[key]}
                      </span>
                      {isActive && (
                        <span className="absolute -bottom-[9px] left-0 h-[2px] w-full rounded bg-brand" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredPlans.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">
                  No Study Plans found
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  You haven't created any study plans yet. Create one to get
                  started!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 mb-3 transition-all duration-300">
                  {" "}
                  {paginatedPlans.map((plan: any) => (
                    <NewStudyPlanCard
                      key={`${plan._id}-new`}
                      plan={plan}
                      onDelete={() => setPlanToDelete(plan._id)}
                      isDeleting={isDeleting && planToDelete === plan._id}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!planToDelete}
        onOpenChange={(open) => !open && setPlanToDelete(null)}
      >
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <AlertCircle className="w-6 h-6" />
              <DialogTitle>Delete Study Plan</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete this study plan? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPlanToDelete(null)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="cursor-pointer flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Plan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewStudyPlanCard({
  plan,
  onDelete,
  isDeleting = false,
}: {
  plan: any;
  onDelete?: () => void;
  isDeleting?: boolean;
}) {
  const heading = getPlanHeading(plan);
  const stats = computePlanStats(plan);
  const showPlannerChat =
    plan?.created_from === "smart_study_planner" && Boolean(plan?.thread_id);
  const examDateText = formatDateLong(plan?.exam_date);
  const acc = stats.accuracyPct;
  const comp = stats.completedPct;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 rounded-lg border border-slate-200 p-2 h-16 w-16 flex items-center justify-center">
            <FileText className="h-8 w-8 text-slate-700" />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-medium text-slate-800">
              {heading}
            </h3>

            <p className="truncate text-xs text-slate-400">
              {examDateText} | Accuracy {acc.toFixed(2)}%
            </p>
          </div>
        </div>

        {onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="text-slate-400">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                variant="destructive"
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Details
      </p>

      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-1.5 w-12 h-12 flex items-center justify-center">
            <Timer className="h-6 w-6 text-brand" />
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-400">Your goal</p>

            <p className="truncate text-xs font-medium text-slate-700">
              {stats.goalName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-1.5 w-12 h-12 flex items-center justify-center">
            <Clock3 className="h-6 w-6 text-brand" />{" "}
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-400">Time Left</p>

            <p className="truncate text-xs font-medium text-slate-700">
              {stats.remainingHmm} hrs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-1.5 w-12 h-12 flex items-center justify-center">
            <Target className="h-6 w-6 text-brand" />{" "}
          </div>

          <div className="min-w-0">
            <p className="text-xs text-slate-400">Daily Target</p>

            <p className="truncate text-xs font-medium text-slate-700">
              {stats.todayHmm} hrs / {stats.dailyBudgetHrs} hrs
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Progress ({comp.toFixed(0)}%)
        </p>

        <div className="h-1.5 w-full rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-brand transition-all duration-500"
            style={{
              width: `${Math.max(0, Math.min(100, comp))}%`,
            }}
          />
        </div>
      </div>

      {stats.topics.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {stats.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-md bg-blue-50 px-2.5 py-1 text-xs text-brand"
            >
              {t}
            </span>
          ))}

          {stats.topics.length > 4 && (
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
              +{stats.topics.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link
          to={`/dashboard/weekly-plan/${plan._id}`}
          state={{ plan }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand cursor-pointer px-3 py-1.5 text-sm font-medium text-white"
        >
          <Eye className="h-4 w-4" /> View Plan
        </Link>

        {showPlannerChat && (
          <Link
            to={`/dashboard/weekly-plan/${plan._id}?chat=1`}
            state={{ plan }}
            className="inline-flex items-center gap-1.5 rounded-lg border cursor-pointer border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600"
          >
            <MessageSquareText className="h-4 w-4" /> Chat
          </Link>
        )}
      </div>
    </article>
  );
}

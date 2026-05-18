import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  MinusCircle,
  MessageSquare,
  // ChevronLeft,
  // ChevronRight,
  ClipboardCheck,
  CalendarDays,
  Flame,
  Timer,
  ClipboardList,
  Files,
  NotebookPen,
  Stethoscope,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import DashboardHeading from "@/components/reusable/DashboardHeading";
import {
  useGetSingleStudyPlanQuery,
  useCancelStudyPlanMutation,
  useDeleteStudyPlanMutation,
} from "@/store/features/studyPlan/studyPlan.api";
import GlobalLoader2 from "@/common/GlobalLoader2";
import { toast } from "sonner";
import StudyPlanChatPanel from "./StudyPlanChatPanel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

interface HourlyBreakdown {
  task_type: string;
  duration_hours: number;
  duration_minutes: number;
  suggest_content: {
    contentId: string;
    limit: number;
    contentRepository?: "bank" | "my_content";
    filterSnapshot?: {
      contentFor?: string;
      profileType?: string;
      subject?: string;
      system?: string;
      topic?: string;
      subtopic?: string;
    };
  };
  isCompleted: boolean;
  description: string;
  attempted_count?: number;
  total_count?: number;
  attempts?: {
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
  }[];
}

interface DailyPlan {
  day_number: number;
  date: string;
  total_hours: number;
  topics: string[];
  hourly_breakdown: HourlyBreakdown[];
  isCompleted?: boolean;
}

interface StudyPlanData {
  _id: string;
  title?: string;
  thread_id?: string;
  created_from?: "smart_study" | "smart_study_planner";
  plan_summary: string;
  total_days: number;
  daily_plan: DailyPlan[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

const parseLocalDate = (dateStr: string): Date => {
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [y, m, d] = clean.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getTodayLocal = (): Date => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

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

const TASK_TYPE_META: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    iconBg: string;
    iconText: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  mcq: {
    label: "MCQ Practice",
    icon: <ClipboardList className="w-10 h-10" />,
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
  },
  mcqs: {
    label: "MCQ Practice",
    icon: <ClipboardList className="w-10 h-10" />,
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
  },
  flashcard: {
    label: "Flashcard Review",
    icon: <Files className="w-10 h-10" />,
    iconBg: "bg-orange-100",
    iconText: "text-orange-500",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
  },
  flashcards: {
    label: "Flashcard Review",
    icon: <Files className="w-10 h-10" />,
    iconBg: "bg-orange-100",
    iconText: "text-orange-500",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
  },
  note: {
    label: "Notes Review",
    icon: <NotebookPen className="w-10 h-10" />,
    iconBg: "bg-orange-100",
    iconText: "text-orange-500",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
  },
  notes: {
    label: "Notes Review",
    icon: <NotebookPen className="w-10 h-10" />,
    iconBg: "bg-orange-100",
    iconText: "text-orange-500",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
  },
  "clinical case": {
    label: "Clinical Case",
    icon: <Stethoscope className="w-10 h-10" />,
    iconBg: "bg-blue-100",
    iconText: "text-brand",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
  },
  clinical_case: {
    label: "Clinical Case",
    icon: <Stethoscope className="w-10 h-10" />,
    iconBg: "bg-blue-100",
    iconText: "text-brand",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
  },
  "clinical cases": {
    label: "Clinical Case",
    icon: <Stethoscope className="w-10 h-10" />,
    iconBg: "bg-blue-100",
    iconText: "text-brand",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
  },
};

// ── Stat Card ────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 flex-1 min-w-[140px]">
      <div>
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
        {icon}
      </div>
    </div>
  );
}

// ── Day Pill ─────────────────────────────────────────────────
function DayPill({
  dayPlan,
  isActive,
  onClick,
}: {
  dayPlan: DailyPlan;
  isActive: boolean;
  onClick: () => void;
}) {
  const today = getTodayLocal();
  const planDate = parseLocalDate(dayPlan.date);

  const isToday = planDate.getTime() === today.getTime();
  const isPast = planDate.getTime() < today.getTime();

  let statusIcon;
  let colorClass = "";

  if (dayPlan.isCompleted) {
    statusIcon = <CheckCircle className="w-4 h-4" />;
    colorClass = "text-green-600 border-green-500 bg-green-50";
  } else if (isToday) {
    statusIcon = <Clock className="w-4 h-4" />;
    colorClass = "text-yellow-500 border-yellow-400 bg-yellow-50";
  } else if (isPast) {
    statusIcon = <XCircle className="w-4 h-4" />;
    colorClass = "text-red-500 border-red-400 bg-red-50";
  } else {
    statusIcon = <MinusCircle className="w-4 h-4" />;
    colorClass = "text-gray-400 border-gray-300 bg-gray-50";
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center text-sm font-medium 
  border p-3 rounded-2xl gap-2 bg-white
  shadow-sm hover:shadow-md transition-all duration-300
  w-[110px] cursor-pointer
  ${isActive ? "border-brand bg-blue-50 scale-[1.02]" : "border-gray-200"}`}
    >
      <span className="text-xs text-gray-500">Day {dayPlan.day_number}</span>

      <div
        className={`w-9 h-9 flex items-center justify-center rounded-full border ${colorClass}`}
      >
        {statusIcon}
      </div>

      <span className="text-[11px] text-gray-400">
        {planDate.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })}
      </span>
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function WeeklyPlan() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useGetSingleStudyPlanQuery(id as string, {
    skip: !id,
  });
  const [cancelPlan] = useCancelStudyPlanMutation();
  const [deletePlan] = useDeleteStudyPlanMutation();

  const planFromState = location.state?.plan as StudyPlanData | undefined;
  const studyPlan: StudyPlanData | undefined = data?.data || planFromState;
  const backPath =
    studyPlan?.created_from === "smart_study_planner"
      ? "/dashboard/smart-study-plan"
      : "/dashboard/smart-study";

  const showChat = searchParams.get("chat") === "1";
  const hasPlanChat =
    studyPlan?.created_from === "smart_study_planner" &&
    Boolean(studyPlan?.thread_id);

  const planHeading = useMemo(
    () => studyPlan?.title?.trim() || studyPlan?.plan_summary || "Study plan",
    [studyPlan?.title, studyPlan?.plan_summary],
  );

  const toggleChat = () => {
    const next = new URLSearchParams(searchParams);
    if (showChat) next.delete("chat");
    else next.set("chat", "1");
    setSearchParams(next, { replace: true });
  };

  const today = getTodayLocal();

  // ── Active day index state ──
  const todayIndex = useMemo(() => {
    if (!studyPlan) return 0;
    const idx = studyPlan.daily_plan.findIndex(
      (d) => parseLocalDate(d.date).getTime() === today.getTime(),
    );
    return idx >= 0 ? idx : 0;
  }, [studyPlan]);

  const [activeDayIdx, setActiveDayIdx] = useState<number>(todayIndex);

  const handleStart = async (
    taskType: string,
    contentId: string,
    dayNumber: number,
    limit?: number,
    filterSnapshot?: HourlyBreakdown["suggest_content"]["filterSnapshot"],
    contentRepository?: HourlyBreakdown["suggest_content"]["contentRepository"],
  ) => {
    if (!contentId) {
      toast.warning("Content is not yet assigned to this task.");
      return;
    }
    const type = taskType.toLowerCase();
    const state = {
      planId: studyPlan?._id,
      day: dayNumber,
      suggest_content: contentId,
      from: "weekly-plan",
      planLimit: limit,
      filterSnapshot,
      contentRepository:
        contentRepository ??
        ("bank" as HourlyBreakdown["suggest_content"]["contentRepository"]),
    };

    if (type === "mcqs" || type === "mcq") {
      navigate(`/dashboard/practice-mcq/${contentId}`, { state });
    } else if (type === "flashcards" || type === "flashcard") {
      navigate(`/dashboard/solve-flash-card/${contentId}`, {
        state: {
          ...state,
          planLimit: limit,
          source: contentRepository === "my_content" ? "generated" : undefined,
        },
      });
    } else if (type === "clinical case" || type === "clinical_case") {
      navigate(`/dashboard/clinical-case/${contentId}`, { state });
    } else if (type === "notes" || type === "note") {
      navigate(`/dashboard/notes/${contentId}`, { state });
    } else {
      toast.warning("Unknown task type: " + taskType);
    }
  };

  const handleCancel = async () => {
    if (!studyPlan?._id) return;
    try {
      await cancelPlan(studyPlan._id).unwrap();
      toast.success("Plan cancelled.");
      navigate(backPath);
    } catch {
      toast.error("Failed to cancel plan.");
    }
  };

  const handleDelete = async () => {
    if (!studyPlan?._id) return;
    try {
      await deletePlan(studyPlan._id).unwrap();
      toast.success("Plan deleted.");
      navigate(backPath);
    } catch {
      toast.error("Failed to delete plan.");
    }
  };

  if ((isLoading || !id) && !planFromState) return <GlobalLoader2 />;

  if (!studyPlan) {
    return (
      <div className="mb-10 bg-slate-50">
        <div className="flex items-center gap-3">
          <Link to={backPath} className="mb-7">
            <ArrowLeft />
          </Link>
          <DashboardHeading
            title="Study Plan Not Found"
            titleSize="text-xl"
            description="The requested study plan could not be found."
            className="mt-12 mb-12 space-y-1"
          />
        </div>
      </div>
    );
  }

  // ── Computed stats ──
  const totalTasks = studyPlan.daily_plan.reduce(
    (sum, d) => sum + d.hourly_breakdown.length,
    0,
  );
  const completedTasks = studyPlan.daily_plan.reduce(
    (sum, d) => sum + d.hourly_breakdown.filter((t) => t.isCompleted).length,
    0,
  );

  // Days remaining (future days from today inclusive of today if not done)
  const daysRemaining = studyPlan.daily_plan.filter((d) => {
    const planDate = parseLocalDate(d.date);
    return planDate.getTime() >= today.getTime() && !d.isCompleted;
  }).length;

  // Current streak: consecutive completed days going backwards from yesterday
  let currentStreak = 0;
  const sortedDays = [...studyPlan.daily_plan].sort(
    (a, b) =>
      parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime(),
  );
  for (let i = sortedDays.length - 1; i >= 0; i--) {
    const planDate = parseLocalDate(sortedDays[i].date);
    if (planDate.getTime() >= today.getTime()) continue; // skip today & future
    if (sortedDays[i].isCompleted) currentStreak++;
    else break;
  }
  // Also count today if completed
  const todayPlan = studyPlan.daily_plan.find(
    (d) => parseLocalDate(d.date).getTime() === today.getTime(),
  );
  if (todayPlan?.isCompleted) currentStreak++;

  // Time spent (estimated from attempted * rate)
  let totalSecSpent = 0;
  studyPlan.daily_plan.forEach((d) => {
    d.hourly_breakdown.forEach((s) => {
      const t = (s.task_type ?? "").toLowerCase();
      const rate = RATE_SEC_BY_TASK[t] ?? 0;
      const att = s.attempted_count ?? 0;
      totalSecSpent += att * rate;
    });
  });
  const timeSpentH = Math.floor(totalSecSpent / 3600);
  const timeSpentM = Math.floor((totalSecSpent % 3600) / 60);
  const timeSpentStr =
    timeSpentH > 0 ? `${timeSpentH}h ${timeSpentM}min` : `${timeSpentM}min`;

  // Active day data
  const activeDayPlan = studyPlan.daily_plan[activeDayIdx];
  const activePlanDate = activeDayPlan
    ? parseLocalDate(activeDayPlan.date)
    : null;
  const isActiveToday = activePlanDate?.getTime() === today.getTime();
  // const isActivePast = activePlanDate
  //   ? activePlanDate.getTime() < today.getTime()
  //   : false;
  const isActiveFuture = activePlanDate
    ? activePlanDate.getTime() > today.getTime()
    : false;

  // let activeSectionBg = "bg-white border-slate-300";
  // if (activeDayPlan?.isCompleted)
  //   activeSectionBg = "bg-green-50 border-green-200";
  // else if (isActiveToday) activeSectionBg = "bg-yellow-50 border-yellow-200";
  // else if (isActivePast) activeSectionBg = "bg-red-50 border-red-200";

  return (
    <div className="mb-10 bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={backPath} className="mb-7">
            <ArrowLeft />
          </Link>
          <DashboardHeading
            title={planHeading}
            titleSize="text-xl"
            description={`${studyPlan.total_days} days · ${completedTasks}/${totalTasks} tasks done`}
            className="mt-12 mb-12 space-y-1"
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {hasPlanChat && (
            <Button
              variant={showChat ? "default" : "outline"}
              size="sm"
              onClick={toggleChat}
              className="gap-1"
            >
              <MessageSquare className="w-4 h-4" />
              {showChat ? "Hide chat" : "Plan chat"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          >
            Cancel Plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Delete Plan
          </Button>
        </div>
      </div>

      <div
        className={
          showChat && hasPlanChat
            ? "grid grid-cols-1 lg:grid-cols-[1fr_min(360px,100%)] gap-6 items-start"
            : ""
        }
      >
        <div className="min-w-0">
          {/* ── Stats Cards (replaces overall bar) ── */}
          <div className="flex flex-wrap gap-3 mb-6">
            <StatCard
              label="Task Completed"
              value={`${completedTasks}/${totalTasks}`}
              icon={<ClipboardCheck className="w-5 h-5" />}
            />
            <StatCard
              label="Day Remaining"
              value={String(daysRemaining)}
              icon={<CalendarDays className="w-5 h-5" />}
            />
            <StatCard
              label="Current Streak"
              value={`${currentStreak} Day${currentStreak !== 1 ? "s" : ""}`}
              icon={<Flame className="w-5 h-5" />}
            />
            <StatCard
              label="Time Spent"
              value={timeSpentStr || "0min"}
              icon={<Timer className="w-5 h-5" />}
            />
          </div>

          {/* ── Your Plan section ── */}
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="flex items-center justify-between mb-3 pb-0">
                <h2 className="text-xl text-[#0A0A0A] font-semibold">
                  Your Plan
                </h2>
              </CardHeader>

              <CardContent>
                {/* ── Day scroll strip with left/right arrows ──
                <div className="relative flex items-center gap-2 mb-6">
                  {/* Left arrow */}
                {/* <button
                    onClick={() => setActiveDayIdx((i) => Math.max(0, i - 1))}
                    disabled={activeDayIdx === 0}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button> */}

                {/* Scrollable day pills */}
                {/* ── Day scroll strip with swiper ── */}
                <div className="relative mb-6 day-card">
                  <Swiper
                    modules={[Navigation]}
                    navigation
                    spaceBetween={14}
                    slidesPerView="auto"
                    className="!px-12 !py-5"
                  >
                    {studyPlan.daily_plan.map((dayPlan, idx) => (
                      <SwiperSlide key={dayPlan.day_number} className="!w-auto">
                        <DayPill
                          dayPlan={dayPlan}
                          isActive={idx === activeDayIdx}
                          onClick={() => setActiveDayIdx(idx)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Right arrow */}
                {/* <button
                    onClick={() =>
                      setActiveDayIdx((i) =>
                        Math.min(studyPlan.daily_plan.length - 1, i + 1),
                      )
                    }
                    disabled={activeDayIdx === studyPlan.daily_plan.length - 1}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:shadow-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div> */}

                {/* ── Plan overview box — shows only the selected day ── */}
                <div className="rounded-xl border border-[#e7e8ee] bg-white p-4 md:p-5">
                  {" "}
                  <div className="flex justify-between items-center mb-7">
                    <p>Plan Overview</p>
                    <p
                      className={`text-white px-3 py-1 text-sm rounded capitalize
                      ${
                        studyPlan.status === "completed"
                          ? "bg-blue-600"
                          : studyPlan.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-green-600"
                      }`}
                    >
                      {studyPlan.status.replace("_", " ")}
                    </p>
                  </div>
                  {/* Selected day detail */}
                  {activeDayPlan && activePlanDate ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Day {activeDayPlan.day_number} –{" "}
                        {activePlanDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        {isActiveToday && (
                          <span className="ml-2 text-xs  px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        )}
                        {activeDayPlan.isCompleted && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </h3>

                      {/* {activeDayPlan.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {activeDayPlan.topics.map((topic, i) => (
                            <span
                              key={i}
                              className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )} */}

                      {activeDayPlan.hourly_breakdown.length > 0 ? (
                        <div className="space-y-3">
                          {activeDayPlan.hourly_breakdown.map(
                            (session, idx) => {
                              const typeKey = String(session.task_type ?? "")
                                .toLowerCase()
                                .trim();
                              const typeMeta = TASK_TYPE_META[typeKey] ?? {
                                label: session.task_type || "Task",
                                icon: <ClipboardList className="w-5 h-5" />,
                                iconBg: "bg-slate-100",
                                iconText: "text-slate-700",
                                badgeBg: "bg-slate-100",
                                badgeText: "text-slate-700",
                              };
                              const attempted = Number(
                                session.attempted_count ?? 0,
                              );
                              const total = Number(session.total_count ?? 0);
                              const durationMinutes =
                                Number(session.duration_hours ?? 0) * 60 +
                                Number(session.duration_minutes ?? 0);
                              const correct =
                                session.attempts?.filter(
                                  (a) => a?.isCorrect === true,
                                ).length ?? 0;
                              const attemptsByData =
                                Number(session.attempts?.length ?? 0) ||
                                attempted;
                              const accuracyPct =
                                attemptsByData > 0
                                  ? Math.round((correct / attemptsByData) * 100)
                                  : null;

                              const attemptInfo = (() => {
                                if (total > 0) {
                                  if (typeKey.includes("flashcard")) {
                                    return `${total} card${total === 1 ? "" : "s"}`;
                                  }
                                  if (typeKey.includes("note")) {
                                    return `${total} note${total === 1 ? "" : "s"}`;
                                  }
                                  return `${attempted}/${total} attempted`;
                                }
                                return attempted > 0
                                  ? `${attempted} attempted`
                                  : null;
                              })();

                              const progressPct =
                                total > 0
                                  ? Math.min(
                                      100,
                                      Math.round((attempted / total) * 100),
                                    )
                                  : durationMinutes > 0
                                    ? session.isCompleted
                                      ? 100
                                      : 0
                                    : 0;
                              const progressLabel =
                                durationMinutes > 0
                                  ? `${session.isCompleted ? durationMinutes : Math.round((progressPct / 100) * durationMinutes)} / ${durationMinutes} mins`
                                  : total > 0
                                    ? `${attempted}/${total}`
                                    : "0 mins";

                              const buttonLabel = isActiveFuture
                                ? "Locked"
                                : session.isCompleted
                                  ? "Review"
                                  : typeKey.includes("clinical")
                                    ? "Review"
                                    : "Resume";

                              return (
                                <div
                                  key={idx}
                                  className="border border-gray-200 rounded-2xl p-5 flex items-center justify-between hover:shadow-md transition-all duration-300 bg-white"
                                >
                                  <div className="flex items-center gap-5 w-full">
                                    {/* ICON */}
                                    <div
                                      className={`w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 ${typeMeta.iconBg}`}
                                    >
                                      <div className={`${typeMeta.iconText}`}>
                                        {typeKey.includes("mcq") && (
                                          <ClipboardList className="w-10 h-10" />
                                        )}

                                        {(typeKey.includes("flashcard") ||
                                          typeKey.includes("note")) && (
                                          <Files className="w-10 h-10" />
                                        )}

                                        {typeKey.includes("clinical") && (
                                          <Stethoscope className="w-10 h-10" />
                                        )}
                                      </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-xl font-semibold text-gray-800">
                                        {typeMeta.label}
                                      </h3>

                                      <p className="text-gray-700 mt-1 text-md truncate">
                                        {(session.description || "").replace(
                                          /^[\w\s]+ —\s*/i,
                                          "",
                                        )}
                                      </p>

                                      {/* META */}
                                      <div className="flex flex-wrap items-center gap-3 mt-3 text-gray-400 text-sm">
                                        <span>⊙ {typeMeta.label}</span>

                                        {durationMinutes > 0 && (
                                          <span>• {durationMinutes} mins</span>
                                        )}

                                        {attemptInfo && (
                                          <span>• {attemptInfo}</span>
                                        )}

                                        {accuracyPct != null && (
                                          <span>• {accuracyPct}% Accuracy</span>
                                        )}
                                      </div>
                                    </div>

                                    {/* PROGRESS */}
                                    <div className="hidden lg:flex items-center gap-4 min-w-[280px]">
                                      <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                          className={`h-full rounded-full ${
                                            typeKey.includes("flashcard") ||
                                            typeKey.includes("note")
                                              ? "bg-orange-400"
                                              : typeKey.includes("mcq")
                                                ? "bg-green-500"
                                                : "bg-brand"
                                          }`}
                                          style={{
                                            width: `${progressPct}%`,
                                          }}
                                        />
                                      </div>

                                      <span className="text-sm text-gray-500 whitespace-nowrap">
                                        {progressLabel}
                                      </span>
                                    </div>

                                    {/* BUTTON */}
                                    <Button
                                      size="lg"
                                      disabled={isActiveFuture}
                                      onClick={() =>
                                        handleStart(
                                          session.task_type,
                                          session.suggest_content?.contentId,
                                          activeDayPlan.day_number,
                                          session.suggest_content?.limit,
                                          session.suggest_content
                                            ?.filterSnapshot,
                                          session.suggest_content
                                            ?.contentRepository,
                                        )
                                      }
                                      className={`px-6 py-3 rounded-xl font-medium transition shadow-none min-w-[120px]
        ${
          isActiveFuture
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : session.isCompleted
              ? "border border-brand bg-white text-brand hover:bg-blue-50"
              : typeKey.includes("mcq")
                ? "bg-green-500 hover:bg-green-600 text-white"
                : typeKey.includes("flashcard") || typeKey.includes("note")
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "border border-brand bg-white text-brand hover:bg-blue-50"
        }
      `}
                                    >
                                      {buttonLabel}
                                    </Button>
                                  </div>
                                </div>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No tasks for this day
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No day selected.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showChat && hasPlanChat && studyPlan.thread_id && (
          <StudyPlanChatPanel
            threadId={studyPlan.thread_id}
            onClose={() => {
              const next = new URLSearchParams(searchParams);
              next.delete("chat");
              setSearchParams(next, { replace: true });
            }}
          />
        )}
      </div>
    </div>
  );
}

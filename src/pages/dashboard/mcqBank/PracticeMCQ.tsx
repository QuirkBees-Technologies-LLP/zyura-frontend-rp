/* eslint-disable @typescript-eslint/no-explicit-any */
import GlobalLoader from "@/common/GlobalLoader";
import { BreadcrumbItem } from "@/components/dashboard/gamified-learning/types";
import Breadcrumb from "@/components/reusable/CommonBreadcrumb";
import DashboardHeading from "@/components/reusable/DashboardHeading";
import { useGetSingleMCQQuery, useGetGeneratedMCQQuery } from "@/store/features/MCQBank/MCQBank.api";
import { useUpdateProgressMcqFlashcardClinicalCaseMutation } from "@/store/features/goal/goal.api";
import { McqQuestion } from "@/types";
import { ArrowLeft, CircleAlert, Copy, Plus } from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useParams, useNavigate, useBlocker, useSearchParams, useLocation } from "react-router-dom";
import QuizReportModal from "../quizGenerator/QuizReportModal";
import {
  useGetSingleStudyPlanQuery,
  useSaveMcqAttemptsMutation,
} from "@/store/features/studyPlan/studyPlan.api";
import { toast } from "sonner";
import PrimaryButton from "@/components/reusable/PrimaryButton";
import { PracticeQuizModal } from "./PracticeQuizModal";
import CircularProgress from "@/components/quizOverview/CircularProgress";
import { shouldUseClientMcqPagination } from "@/utils/studyPlanNavigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type McqNavState = {
  planId?: string;
  day?: number;
  suggest_content?: string;
  from?: string;
  planLimit?: number;
  contentRepository?: "bank" | "my_content";
} | null | undefined;

export default function PracticeMCQ() {
  const [openQuizModal, setOpenQuizModal] = useState(false);
  const [openUnansweredModal, setOpenUnansweredModal] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationState] = useState(location.state);
  const { id } = useParams();
  const [showResult, setShowResult] = useState(false);

  // console.log("PracticeMCQ Navigation State (Saved):", navigationState);

  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Practice MCQ", link: `/dashboard/practice-mcq/${id}` },
  ];

  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 1;

  const planNav = navigationState as McqNavState | undefined;
  const planIdForQuery = planNav?.planId;
  /** Plan session: any study-plan MCQ entry that passes planId + day + bank id (no reliance on `from`). */
  const isPlanFlow = useMemo(() => {
    const sid = planNav?.suggest_content;
    const hasBankId = sid != null && String(sid).trim() !== "";
    return (
      !!planNav?.planId &&
      planNav.day != null &&
      hasBankId
    );
  }, [planNav?.planId, planNav?.day, planNav?.suggest_content]);

  const isBankMode = useMemo(() => !isPlanFlow, [isPlanFlow]);

  const isPlanMyContentMcq = useMemo(
    () => isPlanFlow && shouldUseClientMcqPagination(planNav?.contentRepository),
    [isPlanFlow, planNav?.contentRepository],
  );

  const lastPageKey = useMemo(() => {
    if (
      isPlanFlow &&
      planNav?.planId &&
      planNav.day != null &&
      planNav.suggest_content
    ) {
      return `lastPage_${id}_${planNav.planId}_${planNav.day}_${planNav.suggest_content}`;
    }
    return `lastPage_${id}`;
  }, [
    id,
    isPlanFlow,
    planNav?.planId,
    planNav?.day,
    planNav?.suggest_content,
  ]);

  const storageKey = useMemo(() => {
    if (
      isPlanFlow &&
      planNav?.planId &&
      planNav.day != null &&
      planNav.suggest_content
    ) {
      return `mcq_practice_data_${id}_${planNav.planId}_${planNav.day}_${planNav.suggest_content}`;
    }
    return `mcq_practice_data_${id}`;
  }, [
    id,
    isPlanFlow,
    planNav?.planId,
    planNav?.day,
    planNav?.suggest_content,
  ]);

  // Deriving currentPage directly from URL search params or localStorage
  const currentPage = (() => {
    const page = searchParams.get("page");
    if (page) return parseInt(page);
    const saved = localStorage.getItem(lastPageKey);
    return saved ? parseInt(saved) : 1;
  })();

  // Ensure URL is in sync with the derived page on initial load
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: currentPage.toString(), limit: limit.toString() }, { replace: true });
    }
  }, []);

  // Sync last viewed page to localStorage whenever it changes in URL
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      localStorage.setItem(lastPageKey, page);
    }
  }, [searchParams, lastPageKey]);

  const [skip, setSkip] = useState<number | undefined>(undefined);
  const [jumpQuestion, setJumpQuestion] = useState("");

  // Track correctness of each question: { [qId]: boolean } (true=correct, false=incorrect)
  const [results] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).results : {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: planApiData } = useGetSingleStudyPlanQuery(planIdForQuery as string, {
    skip: !planIdForQuery,
  });

  const planTask = useMemo(() => {
    const plan = (planApiData as { data?: any } | undefined)?.data;
    if (!plan?.daily_plan || planNav?.day == null || planNav?.suggest_content == null)
      return undefined;
    const dayEntry = plan.daily_plan.find((d: any) => d.day_number === planNav.day);
    return dayEntry?.hourly_breakdown?.find(
      (t: any) => t.suggest_content?.contentId === planNav.suggest_content,
    );
  }, [planApiData, planNav?.day, planNav?.suggest_content]);

  const { data: bankMcqData, isLoading: bankMcqLoading } = useGetSingleMCQQuery({
    id: id as string,
    page: currentPage,
    limit,
    skip: isPlanMyContentMcq ? undefined : skip,
  });

  const genMcqLimit =
    planNav?.planLimit != null && Number(planNav.planLimit) > 0
      ? Number(planNav.planLimit)
      : undefined;

  const { data: genMcqData, isLoading: genMcqLoading } = useGetGeneratedMCQQuery(
    {
      id: id as string,
      limit: genMcqLimit,
    },
    { skip: !isPlanMyContentMcq },
  );

  const data = isPlanMyContentMcq ? genMcqData : bankMcqData;
  const isLoading = isPlanMyContentMcq ? genMcqLoading : bankMcqLoading;

  // Keep a local copy of data to prevent UI from disappearing during pagination fetches
  const [displayData, setDisplayData] = useState<any>(null);

  useEffect(() => {
    if (data) {
      setDisplayData(data);
    }
  }, [data]);

  // Reset display data when switching to a different MCQ bank
  useEffect(() => {
    setDisplayData(null);
  }, [id]);

  const [updateProgress] = useUpdateProgressMcqFlashcardClinicalCaseMutation();
  const [saveMcqAttempts] = useSaveMcqAttemptsMutation();

  const meta = data?.meta || displayData?.meta;
  const mcqData = data?.data || displayData?.data;
  const allMcqsFromApi = mcqData?.mcqs || [];

  const questions = useMemo(() => {
    if (!Array.isArray(allMcqsFromApi)) return [];
    if (isPlanMyContentMcq && allMcqsFromApi.length > 1) {
      const idx = Math.max(0, currentPage - 1);
      const q = allMcqsFromApi[idx];
      return q ? [q] : [];
    }
    return allMcqsFromApi;
  }, [allMcqsFromApi, isPlanMyContentMcq, currentPage]);

  const questionsByIdRef = useRef<Record<string, any>>({});
  useEffect(() => {
    (mcqData?.mcqs || []).forEach((q: any) => {
      if (q?.mcqId) questionsByIdRef.current[q.mcqId] = q;
    });
  }, [mcqData]);

  const isReviewMode = useMemo(
    () => planTask?.isCompleted === true,
    [planTask?.isCompleted],
  );

  const isPerQuestionFeedback = useMemo(
    () => isBankMode || isPlanFlow,
    [isBankMode, isPlanFlow],
  );

  /** Plan flow: min(plan limit, bank size). Bank flow: meta.total. */
  const sessionTotal = useMemo(() => {
    if (!isPlanFlow) {
      return Number(meta?.total ?? 0) || 0;
    }
    const planLimit = Number(planTask?.suggest_content?.limit ?? 0) || 0;
    const bank = Number(meta?.total ?? 0) || 0;
    if (isPlanMyContentMcq) {
      const n = Array.isArray(mcqData?.mcqs) ? mcqData.mcqs.length : 0;
      if (planLimit > 0 && n > 0) return Math.min(planLimit, n);
      if (planLimit > 0) return planLimit;
      return n;
    }
    if (planLimit > 0 && bank > 0) return Math.min(planLimit, bank);
    if (planLimit > 0) return planLimit;
    return bank;
  }, [
    isPlanFlow,
    isPlanMyContentMcq,
    meta?.total,
    planTask?.suggest_content?.limit,
    mcqData?.mcqs,
  ]);

  const isInitialLoading = isLoading && !displayData;

  const [selected, setSelected] = useState<{ [key: string]: number | null }>(
    () => {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved).selected : {};
    }
  );
  const [showAnswer] = useState<{ [key: string]: boolean }>(
    () => {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved).showAnswer : {};
    }
  );
  const [lockedQuestions, setLockedQuestions] = useState<{
    [key: string]: boolean;
  }>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved).lockedQuestions : {};
  });

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        selected,
        showAnswer,
        lockedQuestions,
        results,
      })
    );
  }, [selected, showAnswer, lockedQuestions, results, storageKey]);

  const [openReportModal, setOpenReportModal] = useState(false);
  const [mcqId, setMcqId] = useState("");

  const didHydrateFromPlan = useRef(false);
  useEffect(() => {
    didHydrateFromPlan.current = false;
  }, [planNav?.planId, planNav?.day, planNav?.suggest_content]);

  useEffect(() => {
    if (didHydrateFromPlan.current) return;
    const atts = planTask?.attempts as
      | { questionId: string; selectedOption: string }[]
      | undefined;
    if (!atts?.length) return;
    const next: Record<string, number | null> = {};
    const locks: Record<string, boolean> = {};
    atts.forEach((a) => {
      const code = a.selectedOption?.trim().toUpperCase().charCodeAt(0);
      if (!code) return;
      const idx = code - 65;
      if (idx >= 0 && idx < 26) {
        next[a.questionId] = idx;
        locks[a.questionId] = true;
      }
    });
    if (Object.keys(next).length > 0) {
      setSelected(next);
      setLockedQuestions((prev) => ({ ...prev, ...locks }));
      didHydrateFromPlan.current = true;
    }
  }, [planTask?.attempts]);

  const hasStarted =
    Object.keys(selected).length > 0 && !isReviewMode && !isSubmitting;

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasStarted &&
      !isSubmitting &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  const buildAttemptsPayload = useCallback(() => {
    const map = questionsByIdRef.current;
    const attempts: {
      questionId: string;
      selectedOption: string;
      isCorrect: boolean;
    }[] = [];
    for (const qId of Object.keys(selected)) {
      const idx = selected[qId];
      if (idx === null || idx === undefined) continue;
      const q = map[qId];
      if (!q) continue;
      const selectedOptionChar = String.fromCharCode(65 + idx);
      attempts.push({
        questionId: qId,
        selectedOption: selectedOptionChar,
        isCorrect: selectedOptionChar === q.correctOption,
      });
    }
    return attempts;
  }, [selected]);

  const saveMcqToPlanIfNeeded = useCallback(async () => {
    if (
      !isPlanFlow ||
      !planNav?.planId ||
      planNav.day == null ||
      planNav.suggest_content == null
    ) {
      return;
    }
    const total = isPlanFlow
      ? sessionTotal
      : meta?.total ?? planTask?.total_count ?? 0;
    if (!total) return;
    const attempts = buildAttemptsPayload();
    await saveMcqAttempts({
      planId: planNav.planId,
      day: planNav.day,
      suggest_content: planNav.suggest_content,
      total_count: total,
      attempts,
    }).unwrap();
  }, [
    planNav,
    isPlanFlow,
    sessionTotal,
    meta?.total,
    planTask?.total_count,
    buildAttemptsPayload,
    saveMcqAttempts,
    isPlanFlow,
  ]);

  const handleSelect = (qId: string, index: number) => {
    if (isReviewMode) return;
    if (isPerQuestionFeedback && lockedQuestions[qId]) return;
    setSelected((prev) => ({ ...prev, [qId]: index }));
    if (isPerQuestionFeedback) {
      setLockedQuestions((prev) => ({ ...prev, [qId]: true }));
    }
  };

  // Strict mode: no per-question answer reveal during attempt.

  const pageSize = Number(meta?.limit) || 1;
  const totalPages =
    sessionTotal > 0 ? Math.ceil(sessionTotal / pageSize) : 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setSearchParams({ page: page.toString(), limit: limit.toString() }, { replace: true });
      setSkip(undefined);
    }
  };

  const handleJump = () => {
    if (!jumpQuestion.trim()) {
      toast.warning("Please enter a question number");
      return;
    }
    const questionNum = parseInt(jumpQuestion);
    const total = sessionTotal || 0;
    if (isNaN(questionNum) || questionNum < 1) {
      toast.warning("Please enter a valid question number");
    } else if (questionNum > total) {
      toast.warning(`Question number exceeds total questions (${total})`);
    } else {
      setSearchParams({ page: questionNum.toString(), limit: limit.toString() }, { replace: true });
      setSkip(undefined);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Question copied to clipboard");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const navigateAwayFromMcq = () => {
    if (isPlanFlow) {
      navigate(-1);
    } else {
      navigate("/dashboard/mcq-bank");
    }
  };

  const handleSaveExitWithPlan = async () => {
    try {
      await saveMcqToPlanIfNeeded();
    } catch (error) {
      console.error("Failed to save study plan MCQ attempts:", error);
      toast.error("Failed to save progress to your study plan");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isReviewMode) return;
    if (!mcqData?._id) return;

    const totalAttempted = Object.keys(selected).length;
    const totalQuestions = sessionTotal || 0;

    if (totalAttempted < totalQuestions) {
      setUnansweredCount(Math.max(totalQuestions - totalAttempted, 0));
      setOpenUnansweredModal(true);
      return;
    }

    setIsSubmitting(true);

    let totalCorrect = 0;
    let totalIncorrect = 0;
    const map = questionsByIdRef.current;
    for (const qId of Object.keys(selected)) {
      const selectedIdx = selected[qId];
      if (selectedIdx === undefined || selectedIdx === null) continue;
      const q = map[qId];
      if (!q) continue;
      const selectedOptionChar = String.fromCharCode(65 + selectedIdx);
      if (selectedOptionChar === q.correctOption) totalCorrect++;
      else totalIncorrect++;
    }

    try {
      await updateProgress({
        totalCorrect,
        totalIncorrect,
        totalAttempted,
        key: "mcq",
        bankId: mcqData?._id,
      }).unwrap();

      await saveMcqToPlanIfNeeded();

      // localStorage.removeItem(storageKey);
      // localStorage.removeItem(`lastPage_${id}`);
      setShowResult(true);
      setIsSubmitting(false);
      // if (navigationState?.from === "weekly-plan" || navigationState?.from === "home") {
      //   navigate(-1);
      // } else {
      //   navigate("/dashboard/mcq-bank");
      // }
    } catch (error) {
      console.error("Failed to save progress:", error);
      toast.error("Failed to save progress");
      setIsSubmitting(false); // Enable blocker again if failed
    }
  };

  const handleSubmitAnyway = async () => {
    if (isReviewMode) return;
    setOpenUnansweredModal(false);
    setIsSubmitting(true);

    let totalCorrect = 0;
    let totalIncorrect = 0;
    const mapSubmit = questionsByIdRef.current;
    for (const qId of Object.keys(selected)) {
      const selectedIdx = selected[qId];
      if (selectedIdx === undefined || selectedIdx === null) continue;
      const q = mapSubmit[qId];
      if (!q) continue;
      const selectedOptionChar = String.fromCharCode(65 + selectedIdx);
      if (selectedOptionChar === q.correctOption) totalCorrect++;
      else totalIncorrect++;
    }

    const totalAttempted = Object.keys(selected).length;

    try {
      await updateProgress({
        totalCorrect,
        totalIncorrect,
        totalAttempted,
        key: "mcq",
        bankId: mcqData?._id,
      }).unwrap();

      await saveMcqToPlanIfNeeded();

      setShowResult(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Failed to save progress:", error);
      toast.error("Failed to save progress");
      setIsSubmitting(false);
    }
  };

  const progressStats = useMemo(() => {
    const map = questionsByIdRef.current;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalAttempted = 0;
    for (const qId of Object.keys(selected)) {
      const idx = selected[qId];
      if (idx === null || idx === undefined) continue;
      totalAttempted++;
      const q = map[qId];
      if (!q) continue;
      const selectedOptionChar = String.fromCharCode(65 + idx);
      if (selectedOptionChar === q.correctOption) totalCorrect++;
      else totalIncorrect++;
    }
    const bankTotal = sessionTotal;
    const totalNoResponse = Math.max(0, bankTotal - totalAttempted);
    return { totalAttempted, totalCorrect, totalIncorrect, totalNoResponse };
  }, [selected, sessionTotal, mcqData]);

  const { totalAttempted, totalCorrect, totalIncorrect, totalNoResponse } =
    progressStats;
  const correctPercentage =
    totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0;
  const incorrectPercentage =
    totalAttempted > 0 ? (totalIncorrect / totalAttempted) * 100 : 0;

  const currentQuestion = questions[0];
  const currentQId = currentQuestion
    ? currentQuestion.mcqId || `question-${(currentPage - 1) * limit}`
    : null;
  const isCurrentQuestionAnswered = currentQId
    ? selected[currentQId] !== undefined && selected[currentQId] !== null
    : false;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="hidden">{/* Invisible blocker for navigation */}</div>
      <AlertDialog open={blocker.state === "blocked"}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save your progress?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered some questions. Would you like to submit your
              progress before leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 justify-center w-full">
            <AlertDialogCancel
              className="mt-0"
              onClick={() => blocker.state === "blocked" && blocker.reset()}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white border-none"
              onClick={() => {
                if (blocker.state === "blocked") {
                  localStorage.removeItem(storageKey);
                  localStorage.removeItem(lastPageKey);
                  blocker.proceed();
                }
              }}
            >
              Discard & Leave
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-brand hover:bg-brand/90"
              onClick={async () => {
                if (blocker.state === "blocked") {
                  const ok = await handleSaveExitWithPlan();
                  if (!ok) return;
                  blocker.proceed();
                }
              }}
            >
              Save & Exit
            </AlertDialogAction>
            {/* <AlertDialogAction
              className="bg-[#059669] hover:bg-[#059669]/90 text-white"
              onClick={async () => {
                if (blocker.state === "blocked") {
                  const totalAttempted = Object.keys(results).length;
                  const totalQuestions = meta?.total || 0;

                  if (totalAttempted < totalQuestions) {
                    toast.warning("Please complete all questions before submitting final results.");
                    return;
                  }
                  await handleSubmit();
                }
              }}
            >
              Submit Final Result
            </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {showResult ? (
        <div className="p-6 space-y-8">
          <Breadcrumb breadcrumbs={breadcrumbs} />

          <div className="flex items-start gap-1">
            <div
              onClick={() => {
                if (isPlanFlow) {
                  navigate(-1);
                } else {
                  navigate("/dashboard/mcq-bank");
                }
              }}
              className="cursor-pointer sm:mb-0"
            >
              <ArrowLeft className="mt-0.5" />
            </div>

            <DashboardHeading
              title="Performance Analysis"
              titleSize="text-xl"
              titleColor="text-[#0A0A0A]"
              description="Analyze quiz performance, track user progress from detailed results"
              descColor="text-[#4A5565]"
              descFont="text-sm"
              className="mb-5"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full">
            <div className="bg-purple-100 p-4 rounded-lg shadow text-center border border-purple-300 px-2 py-3">
              <p className="text-purple-600 font-semibold">{totalAttempted}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow text-center border border-green-300 px-2 py-3">
              <p className="text-green-600 font-semibold">{totalCorrect}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow text-center border border-red-300 px-2 py-3">
              <p className="text-red-600 font-semibold">{totalIncorrect}</p>
              <p className="text-sm text-gray-600">Wrong</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow text-center border border-yellow-300 px-2 py-3">
              <p className="text-yellow-700 font-semibold">{totalNoResponse}</p>
              <p className="text-sm text-gray-600">No response</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-8 text-[#1A1C1E] font-inter text-center">
              {mcqData?.title}
            </h2>

            <div className="mb-10 flex justify-center">
              <CircularProgress
                correctPercentage={correctPercentage}
                incorrectPercentage={incorrectPercentage}
                label="Session Performance"
              />
            </div>

            <div className="text-center mt-4">
              <p className="text-lg">
                You completed {totalAttempted}/{sessionTotal || 0} questions. You
                answered:
              </p>
              <div className="mt-4 flex flex-col items-center space-y-2">
                <span className="flex items-center bg-green-50 px-4 py-2 rounded-lg">
                  <div className="w-4 h-4 rounded-sm bg-green-500 mr-2"></div>
                  <span className="font-medium text-green-700">
                    {Math.round(correctPercentage)}% correctly ({totalCorrect}{" "}
                    questions)
                  </span>
                </span>
                <span className="flex items-center bg-red-50 px-4 py-2 rounded-lg">
                  <div className="w-4 h-4 rounded-sm bg-red-500 mr-2"></div>
                  <span className="font-medium text-red-700">
                    {Math.round(100 - correctPercentage)}% incorrectly (
                    {totalIncorrect} questions)
                  </span>
                </span>
              </div>
              <div className="flex justify-center mt-8">
                <PrimaryButton
                  onClick={() => {
                    if (isPlanFlow) {
                      navigate(-1);
                    } else {
                      navigate("/dashboard/mcq-bank");
                    }
                  }}
                  className="bg-blue-main hover:bg-blue-main/90"
                >
                  Back to MCQ Bank
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      ) : isInitialLoading ? (
        <GlobalLoader />
      ) : !mcqData ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <CircleAlert className="w-16 h-16 text-red-500" />
          <h2 className="text-xl font-semibold text-slate-700">
            No MCQ Found
          </h2>
          <p className="text-slate-500">
            The MCQ you are looking for does not exist or has been removed.
          </p>
          <Link to="/dashboard/mcq-bank">
            <PrimaryButton className="bg-blue-main hover:bg-blue-main/90">
              Back to MCQ Bank
            </PrimaryButton>
          </Link>
        </div>
      ) : (
        <>
          <div className="p-1 md:p-6 space-y-8">
            <Breadcrumb breadcrumbs={breadcrumbs} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                <div
                  onClick={async () => {
                    if (isReviewMode) {
                      navigateAwayFromMcq();
                      return;
                    }
                    const ok = await handleSaveExitWithPlan();
                    if (!ok) return;
                    navigateAwayFromMcq();
                  }}
                  className="cursor-pointer sm:mb-0"
                >
                  <ArrowLeft className="mb-7" />
                </div>
                <DashboardHeading
                  title={mcqData?.title}
                  titleSize="text-xl"
                  // description={`${meta?.total || 0} Questions `}
                  description={`${Math.ceil(((sessionTotal || 0) * 40) / 60)} Min est.`}
                  className="space-y-1"
                />
              </div>

              {/* Right Section */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <PrimaryButton
                  className="h-10 w-full sm:w-auto cursor-pointer bg-slate-600 hover:bg-slate-700"
                  onClick={async () => {
                    if (isReviewMode) {
                      navigateAwayFromMcq();
                      return;
                    }
                    const ok = await handleSaveExitWithPlan();
                    if (!ok) return;
                    navigateAwayFromMcq();
                  }}
                >
                  {isReviewMode && isPlanFlow ? "Back to plan" : "Save & Exit"}
                </PrimaryButton>
                <PrimaryButton
                  style={{
                    background:
                      "linear-gradient(103deg, #0076F5 6.94%, #0058B8 99.01%)",
                  }}
                  bgType="solid"
                  iconPosition="left"
                  icon={<Plus />}
                  className="h-10 w-full sm:w-auto hover:bg-brand/90 hover:opacity-80 cursor-pointer"
                  onClick={() => setOpenQuizModal(true)}
                >
                  Start Quiz
                </PrimaryButton>
              </div>
            </div>

            {/* Render questions */}
            {questions.map((q: McqQuestion, idx: number) => {
              // Use unique mcqId from backend as the key
              const qId = q?.mcqId || `question-${idx}`;

              // Calculate global question number across all pages
              const globalQuestionNumber = (currentPage - 1) * limit + idx + 1;

              const selectedIndex = selected[qId];
              const isLocked = !!lockedQuestions[qId];
              const isUnansweredInReview =
                isReviewMode &&
                (selectedIndex === undefined || selectedIndex === null);
              const revealForThisQ =
                showResult ||
                isReviewMode ||
                (isPerQuestionFeedback && isLocked);

              return (
                <div
                  key={qId}
                  className="border border-slate-300 rounded-lg p-5 md:p-8 space-y-6 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => handleCopy(qId)}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <Copy className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                      <p className="text-slate-500 text-sm font-normal">{qId}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-500 text-sm">
                        Question {globalQuestionNumber} of {sessionTotal || 0}
                      </span>
                      {mcqData?.subtopic && (
                        <span className="bg-[#D97706] text-[10px] font-bold px-3 py-1 text-white rounded-full uppercase tracking-wider">
                          {mcqData?.subtopic}
                        </span>
                      )}
                      {q.difficulty && (
                        <span className="text-[10px] font-bold px-3 py-1 bg-white rounded-full border border-slate-200 uppercase tracking-wider text-slate-500">
                          {q.difficulty}
                        </span>
                      )}
                      {isUnansweredInReview && (
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 uppercase tracking-wider">
                          No response
                        </span>
                      )}
                      <div
                        className="flex items-center gap-1.5 text-[#F61F1F] cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setMcqId(q?.mcqId);
                          setOpenReportModal(true);
                        }}
                      >
                        <p className="text-sm font-semibold uppercase tracking-wider text-[10px]">Report</p>
                        <CircleAlert className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-900 text-lg font-medium leading-relaxed">
                    {q.question}
                  </p>
                  {q.imageDescription && (
                    <img
                      src={q.imageDescription}
                      alt="Question Image"
                      className="mt-4 max-w-full h-auto rounded-xl border border-slate-200 shadow-sm max-h-96 object-contain"
                    />
                  )}

                  <div className="space-y-3">
                    {q.options.map((opt: any, optionIdx: number) => {
                      const isSelected = selectedIndex === optionIdx;
                      const isCorrect = opt.option === q.correctOption;

                      let borderClass = "border-slate-200 hover:border-blue-300";
                      let bgClass = "bg-white";
                      let textClass = "text-slate-800";

                      if (revealForThisQ) {
                        if (isCorrect) {
                          borderClass = "border-green-500";
                          bgClass = "bg-green-50";
                          textClass = "text-green-700 font-semibold";
                        } else if (isSelected) {
                          borderClass = "border-red-500";
                          bgClass = "bg-red-50";
                          textClass = "text-red-700 font-semibold";
                        } else {
                          borderClass = "border-slate-100 opacity-60";
                        }
                      } else if (isSelected) {
                        borderClass = "border-blue-500";
                        bgClass = "bg-blue-50";
                      }

                      return (
                        <button
                          key={optionIdx}
                          type="button"
                          onClick={() => handleSelect(qId, optionIdx)}
                          disabled={isReviewMode || (isPerQuestionFeedback && isLocked)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                            isReviewMode || (isPerQuestionFeedback && isLocked)
                              ? "cursor-default"
                              : "cursor-pointer"
                          } ${borderClass} ${bgClass}`}
                        >
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border 
                            ${isSelected && !revealForThisQ ? 'bg-brand text-white border-brand' : 'bg-gray-50 text-gray-500 border-gray-200'}
                            ${revealForThisQ && isCorrect ? 'bg-green-500 text-white border-green-500' : ''}
                            ${revealForThisQ && isSelected && !isCorrect ? 'bg-red-500 text-white border-red-500' : ''}
                          `}>
                            {opt.option}
                          </span>
                          <span className={textClass}>{opt.optionText}</span>
                        </button>
                      );
                    })}
                  </div>

                  {revealForThisQ && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed">
                      <p className="font-semibold text-slate-700 mb-1">
                        Explanation
                      </p>
                      <p>
                        {(() => {
                          const correctOpt = q.options?.find(
                            (o: any) => o.option === q.correctOption,
                          );
                          const ex = String(correctOpt?.explanation ?? "").trim();
                          return ex || "No explanation provided.";
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            <QuizReportModal
              open={openReportModal}
              setOpen={setOpenReportModal}
              mcqId={mcqId}
              questionBankId={mcqData?._id}
            />
          </div>
          {/* Pagination */}
          <div className="mt-16 mb-32 flex justify-center flex-wrap gap-4 space-x-5 ">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-6 py-2 rounded border font-medium cursor-pointer ${currentPage === 1
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
            >
              Previous
            </button>

            {currentPage === totalPages ? (
              isReviewMode ? (
                <button
                  type="button"
                  onClick={() => navigateAwayFromMcq()}
                  className="px-6 py-2 rounded border font-medium cursor-pointer bg-slate-600 text-white hover:bg-slate-700"
                >
                  {isPlanFlow ? "Back to plan" : "Close review"}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isCurrentQuestionAnswered}
                  className={`px-6 py-2 rounded border font-medium cursor-pointer ${isSubmitting || !isCurrentQuestionAnswered
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-brand text-white hover:bg-brand/90"
                    }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Final Result"}
                </button>
              )
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={
                    currentPage === totalPages ||
                    (!isReviewMode && !isCurrentQuestionAnswered)
                  }
                  className={`px-6 py-2 rounded border font-medium cursor-pointer ${currentPage === totalPages || (!isReviewMode && !isCurrentQuestionAnswered)
                    ? "cursor-not-allowed bg-gray-200 text-gray-400"
                    : "bg-brand text-white hover:bg-brand/90"
                    }`}
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (isReviewMode) {
                      navigateAwayFromMcq();
                      return;
                    }
                    const ok = await handleSaveExitWithPlan();
                    if (!ok) return;
                    navigateAwayFromMcq();
                  }}
                  className="px-6 py-2 rounded border font-medium cursor-pointer bg-white text-gray-700 hover:bg-gray-50"
                >
                  {isReviewMode && isPlanFlow ? "Back to plan" : "Save & Exit"}
                </button>
              </div>
            )}

            {!isPlanFlow && (
              <div className="flex items-center gap-2 ml-4">
                <input
                  type="number"
                  min="1"
                  max={sessionTotal || 1}
                  value={jumpQuestion}
                  onChange={(e) => setJumpQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleJump();
                    }
                  }}
                  placeholder="Go to question"
                  className="w-32 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand"
                />
                <button
                  onClick={handleJump}
                  className="px-4 py-2 bg-brand text-white rounded text-sm font-medium hover:bg-brand/90 cursor-pointer"
                >
                  Jump
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <PracticeQuizModal
        open={openQuizModal}
        setOpen={setOpenQuizModal}
        mcqBankId={mcqData?._id || ""}
        mcqBankTitle={mcqData?.title || ""}
        subject={mcqData?.subject || ""}
        system={mcqData?.system || ""}
        topic={mcqData?.topic || ""}
        subTopic={mcqData?.subtopic || ""}
      />

      <AlertDialog open={openUnansweredModal} onOpenChange={setOpenUnansweredModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unanswered questions</AlertDialogTitle>
            <AlertDialogDescription>
              You have <span className="font-semibold">{unansweredCount}</span> unanswered questions.
              They will be counted as <span className="font-semibold">unattempted</span>. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitAnyway}>
              Submit anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

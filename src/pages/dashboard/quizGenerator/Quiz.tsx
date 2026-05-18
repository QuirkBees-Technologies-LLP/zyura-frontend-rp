/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useQuizTimer } from "@/hooks/useQuizTimer";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetGeneratedMCQQuery,
  useUpdateQuizTrackingMutation,
  useGenerateRecommendationMutation,
  useGetSingleExamForStudentQuery,
  useGetSingleExamForProfessionalQuery,
} from "@/store/features/MCQBank/MCQBank.api";
import { selectUser } from "@/store/features/auth/auth.slice";
import GlobalLoader from "@/common/GlobalLoader";

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isReviewMode = queryParams.get("mode") === "review";
  const isExamMode = queryParams.get("source") === "exam";

  // const dispatch = useDispatch();
  const { currentQuiz: reduxQuiz } = useSelector(
    (state: RootState) => state.quiz,
  );

  const user = useSelector(selectUser);
  const isProfessional = user?.account?.role === "PROFESSIONAL";
  const limit = queryParams.get("limit")
    ? Number(queryParams.get("limit"))
    : 10;

  const { data: apiQuizData, isLoading: isQuizLoading } =
    useGetGeneratedMCQQuery(
      { id: id as string, limit },
      {
        skip: !id || isExamMode, // Removed static ID "3"
      },
    );

  const { data: studentExamData, isLoading: isStudentExamLoading } =
    useGetSingleExamForStudentQuery(
      { id: id as string, limit },
      { skip: !id || !isExamMode || isProfessional },
    );

  const { data: professionalExamData, isLoading: isProfessionalExamLoading } =
    useGetSingleExamForProfessionalQuery(
      { id: id as string, limit },
      { skip: !id || !isExamMode || !isProfessional },
    );

  const examData = isProfessional ? professionalExamData : studentExamData;
  const isLoading =
    isQuizLoading ||
    (isExamMode && (isStudentExamLoading || isProfessionalExamLoading));

  // Use API data, then redux quiz, then sample
  const fetchedQuiz = apiQuizData?.data || apiQuizData;

  const normalizeOptions = (options: any[]) =>
    (options || [])
      .map((opt: any, i: number) => {
        if (typeof opt === "string") {
          return {
            value: String.fromCharCode(65 + i),
            label: opt?.trim() ?? "",
            explanation: "",
          };
        }

        const label = opt?.label || opt?.optionText || opt?.text || "";
        return {
          value:
            opt?.value || opt?.option || String.fromCharCode(65 + i),
          label: typeof label === "string" ? label.trim() : "",
          explanation: opt?.explanation || "",
        };
      })
      .filter((opt: any) => opt.label);

  // Normalize quiz data structure
  const normalizeQuizData = (data: any) => {
    if (!data) return null;

    const normalizeQuestion = (q: any) => ({
      ...q,
      options: normalizeOptions(q?.options || []),
      correctAnswer: q?.correctAnswer || q?.correctOption || q?.answer || "",
    });

    // If it's an array, it's just questions
    if (Array.isArray(data)) {
      return {
        title: "Generated Quiz",
        description: "AI generated quiz based on your content.",
        questions: data.map(normalizeQuestion),
      };
    }

    // If it doesn't have questions but looks like a session object
    if (data && !data.questions && data.mcqs) {
      return {
        ...data,
        questions: data.mcqs.map(normalizeQuestion),
      };
    }

    return {
      ...data,
      questions: data.questions?.map(normalizeQuestion) || data.questions,
    };
  };

  const normalizeExamData = (data: any) => {
    if (!data) return null;
    // According to provided structure: response.data.data is the exam object
    const exam = data?.data?.data;
    if (!exam) return null;

    return {
      title: exam?.examName,
      description: exam?.subject,
      questions:
        exam?.mcqs?.map((q: any) => ({
          mcqId: q?.mcqId,
          question: q?.question,
          imageDescription: q?.imageDescription,
          options: normalizeOptions(q?.options || []),
          correctOption: q?.correctAnswer || q?.correctOption,
        })) || [],
    };
  };

  const normalizedFetchedQuiz = isExamMode
    ? normalizeExamData(examData)
    : normalizeQuizData(fetchedQuiz);
  const quizData = normalizedFetchedQuiz || reduxQuiz; //|| sampleQuizData;

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  // Store answers by stable question id (mcqId/id), not by array index.
  // Index-based storage breaks review when question order/data differs.
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [openUnansweredModal, setOpenUnansweredModal] = useState(false);
  const [unansweredIndices, setUnansweredIndices] = useState<number[]>([]);
  const [timeExpired, setTimeExpired] = useState(false);
  const [autoSubmittingDueToTimeout, setAutoSubmittingDueToTimeout] =
    useState(false);

  // Show time up notification and auto-submit when timer expires
  useEffect(() => {
    if (!timeExpired) return;
    toast.error("⏰ Time is up! Submitting your quiz now...");
  }, [timeExpired]);

  // Extract duration from URL params (in seconds)
  const durationSeconds = queryParams.get("duration")
    ? Number(queryParams.get("duration"))
    : null;

  const timer = useQuizTimer({
    durationSeconds,
    isReviewMode,
    isExamMode,
    onTimeUp: () => setTimeExpired(true),
  });

  // Load answers from sessionStorage in review mode (supports refresh + returning from analysis)
  useEffect(() => {
    if (isReviewMode && id) {
      const savedAnswers = sessionStorage.getItem(`quiz_answers_${id}`);
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
        } catch (e) {
          console.error("Failed to parse saved answers", e);
        }
      }
    }
  }, [isReviewMode, id]);

  // Review fallback: if sessionStorage is empty (or answers missing), load persisted last attempt from API.
  useEffect(() => {
    if (!isReviewMode) return;
    if (Object.keys(answers).length > 0) return;

    const payload: any = apiQuizData?.data || apiQuizData;
    const fromApi = payload?.tracking?.lastAttemptAnswers;
    if (!Array.isArray(fromApi) || fromApi.length === 0) return;

    const mapped: Record<string, string> = {};
    for (const a of fromApi) {
      const qid = String(a?.mcqId ?? "").trim();
      const val = String(a?.userSelectedOption ?? "").trim();
      if (qid && val) mapped[qid] = val;
    }
    if (Object.keys(mapped).length === 0) return;

    setAnswers(mapped);
    if (id) {
      sessionStorage.setItem(`quiz_answers_${id}`, JSON.stringify(mapped));
    }
  }, [isReviewMode, apiQuizData, id, answers]);

  // Normalize questions format inside the data
  const rawQuestions = quizData?.questions || [];
  const questions = rawQuestions?.map((q: any, index: number) => ({
    id: String(q?.mcqId || q?.id || index + 1),
    text: q?.question || q?.text || "Question " + (index + 1),
    options: (q?.options || [])
      .map((opt: any, i: number) => {
        if (typeof opt === "string") {
          return { value: String.fromCharCode(65 + i), label: opt };
        }
        return {
          value: opt?.value || opt?.option || String.fromCharCode(65 + i),
          label: opt?.label || opt?.optionText || opt?.text || "",
          explanation: opt?.explanation || "",
        };
      })
      .filter((opt: any) => opt.label && opt.label.trim() !== ""),
    imageDescription: q?.imageDescription || "",
    correctAnswer: q?.correctOption || q?.correctAnswer || q?.answer || "",
    explanation: q?.explanation || "",
  }));

  useEffect(() => {
    if (apiQuizData) {
      console.log("Quiz Data Loaded from API:", apiQuizData);
    }
  }, [apiQuizData]);

  // Timer handled by useQuizTimer hook

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Handle answer selection
  const handleAnswerChange = (value: string) => {
    if (isReviewMode) return;

    setAnswers((prev) => {
      const qid = String(
        questions?.[currentQuestion]?.mcqId ||
          questions?.[currentQuestion]?.id ||
          currentQuestion,
      );
      const newAnswers = {
        ...prev,
        [qid]: value,
      };

      // Save to sessionStorage
      if (id) {
        sessionStorage.setItem(
          `quiz_answers_${id}`,
          JSON.stringify(newAnswers),
        );
      }

      return newAnswers;
    });
  };

  // Navigation
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    const qid = String(questions?.[currentQuestion]?.id ?? currentQuestion);
    if (!isReviewMode && !answers[qid]) return;

    if (currentQuestion < (questions?.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (isReviewMode) {
        // Clear sessionStorage on finish review
        if (id) {
          sessionStorage.removeItem(`quiz_answers_${id}`);
        }
        navigate(
          `/dashboard/quiz-analysis/${id}${isExamMode ? "?source=exam" : ""}`,
          {
            // state: { activeTab: "myQuiz" },
          },
        );
      } else {
        handleSubmit();
      }
    }
  };

  const [updateTracking] = useUpdateQuizTrackingMutation();
  const [generateRecommendation] = useGenerateRecommendationMutation();

  const getUnansweredIndices = () => {
    const indices: number[] = [];
    questions?.forEach((q: any, idx: number) => {
      const qid = String(q?.id ?? idx);
      if (!answers[qid]) indices.push(idx + 1); // 1-based for display
    });
    return indices;
  };

  const handleEndQuizClick = () => {
    if (isReviewMode) {
      if (id) sessionStorage.removeItem(`quiz_answers_${id}`);
      navigate(
        `/dashboard/quiz-analysis/${id}${isExamMode ? "?source=exam" : ""}`,
      );
      return;
    }

    const missing = getUnansweredIndices();
    if (missing.length > 0) {
      setUnansweredIndices(missing);
      setOpenUnansweredModal(true);
      return;
    }
    handleSubmit();
  };

  // Submit answers
  const handleSubmit = async () => {
    const totalQuestions = questions?.length || 0;
    const answeredCount = Object.keys(answers)?.length || 0;
    let correctCount = 0;

    questions?.forEach((q: any, index: number) => {
      const qid = String(q?.mcqId || q?.id || index);

      const correctAnswer = q?.correctAnswer || q?.correctOption;

      console.log("CHECKING:", {
        qid,
        userAnswer: answers[qid],
        correctAnswer,
      });

      if (answers[qid] === correctAnswer) {
        correctCount++;
      }
    });

    const attemptAnswers = questions
      ?.map((q: any, index: number) => {
        const qid = String(q?.mcqId || q?.id || index);
        const userSelectedOption = answers[qid];
        if (!userSelectedOption) return null;
        return { mcqId: qid, userSelectedOption };
      })
      .filter(Boolean);

    const trackingData = {
      totalMcqCount: totalQuestions,
      totalAttemptCount: answeredCount,
      correctMcqCount: correctCount,
      wrongMcqCount: answeredCount - correctCount,
      timeTaken: formatTime(timer.timeElapsed),
      answers: attemptAnswers,
    };

    const wrongAnswers = questions
      ?.map((q: any, index: number) => {
        const qid = String(q?.mcqId || q?.id || index);
        const correctAnswer = q?.correctAnswer || q?.correctOption;

        if (answers[qid] === correctAnswer) return null;

        const originalQ = rawQuestions[index];

        return {
          mcqId: originalQ?.mcqId || q?.id,
          difficulty: originalQ?.difficulty || "Basic",
          question: q?.text,
          options: q?.options?.map((opt: any) => ({
            option: opt?.value,
            optionText: opt?.label,
            explanation: opt?.explanation,
          })),
          correctOption:
            q?.correctAnswer || q?.correct_option || q?.correctOption,
          userSelectedOption: answers[qid],
        };
      })
      .filter(Boolean);

    try {
      if (isExamMode) {
        // For exam mode, skip tracking and recommendation APIs
        if (id) {
          sessionStorage.setItem(`quiz_answers_${id}`, JSON.stringify(answers));
        }

        navigate(`/dashboard/quiz-analysis/${id}?source=exam`, {
          state: {
            trackingData,
            isExamMode: true,
          },
        });
        return;
      }

      if (id && id !== "generated") {
        await updateTracking({ id, data: trackingData }).unwrap();

        // Call recommendation API for wrong answers
        if (wrongAnswers.length > 0) {
          generateRecommendation({ contentId: id, wrongAnswers });
        }
      }

      // Save final answers to sessionStorage for review
      if (id) {
        sessionStorage.setItem(`quiz_answers_${id}`, JSON.stringify(answers));
      }

      navigate(`/dashboard/quiz-analysis/${id}`, {
        state: {
          isGeneratingRecommendation: wrongAnswers.length > 0,
          trackingData,
          justSubmitted: true,
        },
      });
    } catch (error) {
      console.error("Failed to update tracking:", error);
      navigate(`/dashboard/quiz-analysis/${id}`, {
        state: {
          isGeneratingRecommendation: wrongAnswers.length > 0,
          trackingData,
          justSubmitted: true,
        },
      });
    }
  };

  useEffect(() => {
    if (!timeExpired || autoSubmittingDueToTimeout || isReviewMode) return;

    setAutoSubmittingDueToTimeout(true);
    handleSubmit();
  }, [timeExpired, autoSubmittingDueToTimeout, isReviewMode]);

  if (isLoading) return <GlobalLoader />;

  const currentQuestionData = questions?.[currentQuestion];

  // const handleBack = () => {
  //   if (isReviewMode) {
  //     navigate(-1); // Go one step back
  //   } else if (isExamMode) {
  //     navigate("/dashboard/mcq-bank");
  //   } else {
  //     navigate("/dashboard/quiz-page");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="mx-auto bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center border border-gray-100">
        <h1 className="text-lg md:text-xl font-semibold text-gray-700">
          {quizData?.title || "Assessment"}
        </h1>

        <button
          onClick={handleEndQuizClick}
          disabled={!isReviewMode && Object.keys(answers).length === 0}
          className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-6 py-2 rounded-md transition-colors text-sm font-medium"
        >
          {isReviewMode ? "Finish Review" : "Leave"}
        </button>
      </header>

      {/* Unanswered Modal */}
      <Dialog open={openUnansweredModal} onOpenChange={setOpenUnansweredModal}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Unanswered questions</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              You have{" "}
              <span className="font-semibold">{unansweredIndices.length}</span>{" "}
              unanswered questions.
            </p>

            {unansweredIndices.length > 0 && (
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-700">
                  Unanswered:
                </span>{" "}
                {unansweredIndices.slice(0, 20).join(", ")}
                {unansweredIndices.length > 20
                  ? ` +${unansweredIndices.length - 20} more`
                  : ""}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const first = unansweredIndices[0];

                if (first) {
                  setCurrentQuestion(Math.max(0, first - 1));
                }

                setOpenUnansweredModal(false);
              }}
            >
              Go to first unanswered
            </Button>

            <Button
              onClick={() => {
                setOpenUnansweredModal(false);
                handleSubmit();
              }}
            >
              Submit anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          {currentQuestionData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
              {/* Question Header */}
              <div className="p-6 md:p-10 border-b border-gray-50 bg-gray-50/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold bg-brand/10 text-brand px-3 py-1 rounded-full">
                    Question {currentQuestion + 1} of {questions?.length}
                  </span>

                  {isReviewMode && (
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        answers[
                          String(currentQuestionData?.id ?? currentQuestion)
                        ] === currentQuestionData?.correctAnswer
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {answers[
                        String(currentQuestionData?.id ?? currentQuestion)
                      ] === currentQuestionData?.correctAnswer
                        ? "Correct"
                        : "Incorrect"}
                    </span>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                  {currentQuestionData?.text}
                </h2>
              </div>

              {/* Image */}
              {currentQuestionData?.imageDescription && (
                <div className="p-6">
                  <img
                    src={currentQuestionData?.imageDescription}
                    alt=""
                    className="w-full rounded-xl border"
                  />
                </div>
              )}

              {/* OPTIONS */}
              <RadioGroup
                value={
                  answers[String(currentQuestionData?.id ?? currentQuestion)] ||
                  ""
                }
                onValueChange={handleAnswerChange}
                disabled={isReviewMode}
                className="p-6 md:p-10 space-y-4 "
              >
                {currentQuestionData?.options?.map((option: any) => {
                  const isCorrect =
                    option?.value === currentQuestionData?.correctAnswer;

                  const isUserSelection =
                    answers[
                      String(currentQuestionData?.id ?? currentQuestion)
                    ] === option?.value;

                  const showResult = isReviewMode;

                  return (
                    <div
                      key={option?.value}
                      onClick={() =>
                        !isReviewMode && handleAnswerChange(option?.value)
                      }
                      className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer group h-fit
                  
                  ${
                    showResult
                      ? isCorrect
                        ? "bg-green-50 border-green-500 text-green-800"
                        : isUserSelection
                          ? "bg-red-50 border-red-500 text-red-800"
                          : "bg-white border-gray-100 text-gray-500 opacity-70"
                      : isUserSelection
                        ? "bg-[#063C79] border-[#063C79] text-white"
                        : "bg-white border-gray-100 hover:border-gray-200 text-gray-600"
                  }
                  `}
                    >
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold mr-4
                    ${
                      isUserSelection && !showResult
                        ? "bg-white text-[#063C79]"
                        : showResult && isCorrect
                          ? "bg-green-600 text-white"
                          : showResult && isUserSelection && !isCorrect
                            ? "bg-red-600 text-white"
                            : "bg-gray-50 text-gray-700"
                    }
                    `}
                      >
                        {option?.value}
                      </div>

                      <Label
                        className="flex-1 cursor-pointer text-sm md:text-base leading-relaxed"
                        onClick={(e) => e.preventDefault()}
                      >
                        {option?.label}
                      </Label>

                      {showResult && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}

                      {showResult && isUserSelection && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  );
                })}
              </RadioGroup>

              {/* REVIEW */}
              {isReviewMode && (
                <div className="px-6 md:px-10 pb-8">
                  <div className="bg-slate-50 rounded-xl border p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Review & Explanation
                    </h4>

                    {(() => {
                      const correct = currentQuestionData?.correctAnswer;

                      const correctOpt = currentQuestionData?.options?.find(
                        (o: any) => o?.value === correct,
                      );

                      const explanation =
                        correctOpt?.explanation || "No explanation provided.";

                      return (
                        <p className="text-sm leading-7 text-gray-700">
                          {explanation}
                        </p>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* NAVIGATION */}
              <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-400 disabled:opacity-50 text-white rounded-md hover:bg-slate-500 transition-colors text-sm"
                >
                  <ChevronLeft size={18} />
                  Previous Question
                </button>

                <button
                  onClick={handleNext}
                  disabled={
                    !isReviewMode &&
                    !answers[String(currentQuestionData?.id ?? currentQuestion)]
                  }
                  className="flex items-center gap-2 px-8 py-2 bg-[#063C79] disabled:opacity-40 text-white rounded-md hover:opacity-90 transition-opacity text-sm"
                >
                  {currentQuestion === (questions?.length || 0) - 1
                    ? isReviewMode
                      ? "Finish Review"
                      : "Submit Quiz"
                    : "Next"}

                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center">
            {/* TIMER */}
            <div className="text-center mb-8">
              <h3 className="text-gray-700 font-semibold mb-4">
                {isReviewMode ? "Review Mode" : "Remaining Time"}
              </h3>

              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-gray-100"
                  />

                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="440"
                    strokeDashoffset={
                      440 -
                      (timer.timeRemaining / (durationSeconds || 300)) * 440
                    }
                    className={`${
                      timer.timeRemaining <= 60
                        ? "text-red-500"
                        : "text-[#063C79]"
                    }`}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-700 leading-none">
                    {isReviewMode ? "Review" : formatTime(timer.timeRemaining)}
                  </span>

                  <span className="text-xs text-gray-400 mt-1">Time</span>
                </div>
              </div>
            </div>

            {/* QUESTION GRID */}
            <div className="w-full">
              <h3 className="text-gray-700 font-semibold text-center mb-6">
                Number of Questions
              </h3>

              <div className="grid grid-cols-4 gap-3 justify-items-center h-[35vh] overflow-auto">
                {questions?.map((q: any, index: number) => {
                  const isCurrent = index === currentQuestion;

                  const isAnswered =
                    answers[String(q?.id ?? index)] !== undefined;

                  return (
                    <div
                      key={q?.id}
                      onClick={() => {
                        if (
                          isReviewMode ||
                          index <= currentQuestion ||
                          answers[String(questions[index - 1]?.id ?? index - 1)]
                        ) {
                          setCurrentQuestion(index);
                        }
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border shadow-sm cursor-pointer hover:scale-105 transition-transform
                  
                  ${
                    isCurrent
                      ? "bg-green-500 text-white"
                      : isAnswered
                        ? "bg-[#063C79] text-white"
                        : "bg-white border-gray-100 text-gray-700"
                  }
                  `}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LEGEND */}
            <div className="flex justify-center gap-6 mt-10 w-full text-xs font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#063C79]"></div>
                <span>Completed</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Current</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Quiz;

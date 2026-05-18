import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DecisionPoint from "./DecisionPoint";
import EvidenceReview from "./EvidenceReview";
import { Progress } from "@/components/ui/progress";
import { ClinicalCaseData } from "@/types/clinicalCase";
import ClinicalCaseMCQ from "./ClinicalCaseMCQ";
import { useUpdateProgressMcqFlashcardClinicalCaseMutation } from "@/store/features/goal/goal.api";
import {
  useSaveClinicalCaseAttemptMutation,
  useSaveStudyPlanProgressMutation,
} from "@/store/features/studyPlan/studyPlan.api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import PrimaryButton from "@/components/reusable/PrimaryButton";

type Props = {
  clinicalCase: ClinicalCaseData;
};

const ClinicalCaseFlow: React.FC<Props> = ({ clinicalCase }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedOptionName, setSelectedOptionName] = useState<string | null>(
    null
  );
  // MCQ State
  const [mcqIndex, setMcqIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  // Strict exam behavior: allow changes, do not reveal correctness while attempting.
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [isAnswered, setIsAnswered] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // API
  const [updateProgress, { isLoading: isUpdating }] =
    useUpdateProgressMcqFlashcardClinicalCaseMutation();
  const [saveStudyPlanProgress] = useSaveStudyPlanProgressMutation();
  const [saveClinicalCaseAttempt] = useSaveClinicalCaseAttemptMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const mcqs = clinicalCase?.mcqs || [];
  const totalMCQs = mcqs.length;

  const handleConfirmDiagnosis = () => {
    setCurrentStep(2);
  };

  const handleStartQuiz = () => {
    setCurrentStep(3);
  };

  const handleAnswerShown = (isShown: boolean) => {
    // In strict exam mode we only need to know if the user answered,
    // correctness is computed on final submit.
    setIsAnswered(isShown);
  };

  const handleNextMCQ = () => {
    if (mcqIndex < totalMCQs - 1) {
      setMcqIndex((prev) => prev + 1);
      setIsAnswered(Boolean(mcqAnswers[mcqIndex + 1]));
    }
  };

  const fromAnalysis = location.state?.fromAnalysis;
  const quizId = location.state?.quizId;

  const handleBack = () => {
    if (fromAnalysis && quizId) {
      navigate(`/dashboard/quiz-analysis/${quizId}`);
    } else if (
      location.state?.from === "weekly-plan" ||
      location.state?.from === "home"
    ) {
      navigate(-1);
    } else {
      navigate("/dashboard/clinical-case-generator");
    }
  };

  const handleFinishQuiz = async () => {
    // Compute score at submission time (strict exam mode)
    const computedCorrect = mcqs.reduce((acc, q, idx) => {
      const selected = mcqAnswers[idx];
      if (selected && selected === q.correctOption) return acc + 1;
      return acc;
    }, 0);
    setCorrectAnswers(computedCorrect);

    // API Call
    try {
      if (!fromAnalysis && clinicalCase._id) {
        await updateProgress({
          totalCorrect: computedCorrect,
          totalIncorrect: totalMCQs - computedCorrect,
          totalAttempted: totalMCQs,
          key: "clinicalcase",
          bankId: clinicalCase._id,
        }).unwrap();
      }

      // Check if we came from WeeklyPlan or Home and update study plan progress
      const fromPlan =
        location.state?.from === "weekly-plan" || location.state?.from === "home";
      if (fromPlan && location.state?.planId) {
        try {
          const attemptResponse = await saveClinicalCaseAttempt({
            planId: location.state.planId,
            day: location.state.day,
            suggest_content: location.state.suggest_content,
            caseId: clinicalCase._id,
          }).unwrap();

          const clinicalAttemptData = attemptResponse?.data;
          const nextCaseId = clinicalAttemptData?.next_case_id as string | null | undefined;
          const taskCompleted = Boolean(clinicalAttemptData?.task_completed);
          const contentExhausted = Boolean(clinicalAttemptData?.content_exhausted);

          if (!taskCompleted && nextCaseId) {
            toast.success("Opening your next clinical case...");
            navigate(`/dashboard/clinical-case/${nextCaseId}`, {
              state: {
                ...location.state,
              },
            });
            return;
          }

          if (!taskCompleted && contentExhausted) {
            toast.info("No more matching clinical cases found for this topic.");
          }

          if (taskCompleted) {
            await saveStudyPlanProgress({
              planId: location.state.planId,
              day: location.state.day,
              suggest_content: location.state.suggest_content,
            }).unwrap();
          }
        } catch (error) {
          console.error("Failed to save study plan progress:", error);
        }
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to update progress", err);
      toast.error("Failed to save progress");
      setShowSuccessModal(true);
    }
  };

  const getButtonConfig = () => {
    if (currentStep === 1) {
      return {
        label: "Next",
        disabled: true,
        onClick: () => { },
      };
    }
    if (currentStep === 2) {
      // If there are no MCQs, we finish the case directly from here
      if (totalMCQs === 0) {
        return {
          label: isUpdating ? "Finishing..." : "Finish Case",
          disabled: isUpdating,
          onClick: handleFinishQuiz,
        };
      }
      return {
        label: "Start Quiz",
        disabled: false,
        onClick: handleStartQuiz,
      };
    }
    // Step 3: MCQ
    const isLastQuestion = mcqIndex === totalMCQs - 1;
    return {
      label: isLastQuestion
        ? isUpdating
          ? "Finishing..."
          : "Finish Quiz"
        : "Next Question",
      disabled: !isAnswered || isUpdating,
      onClick: isLastQuestion ? handleFinishQuiz : handleNextMCQ,
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-8 my-9">
      <div className="col-span-3">
        {currentStep === 1 && (
          <DecisionPoint
            clinicalCase={clinicalCase}
            selectedOptionName={selectedOptionName}
            setSelectedOptionName={setSelectedOptionName}
            onConfirm={handleConfirmDiagnosis}
          />
        )}

        {currentStep === 2 && selectedOptionName && (
          <EvidenceReview
            clinicalCase={clinicalCase}
            selectedOptionName={selectedOptionName}
          />
        )}

        {currentStep === 3 && (
          <ClinicalCaseMCQ
            clinicalCase={clinicalCase}
            currentQuestionIndex={mcqIndex}
            examMode
            selectedOption={mcqAnswers[mcqIndex] ?? null}
            onSelectOption={(opt) => {
              setMcqAnswers((prev) => ({ ...prev, [mcqIndex]: opt }));
              setIsAnswered(true);
            }}
            onAnswerShown={(shown) => handleAnswerShown(shown)}
          />
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="border border-gray-300 rounded-2xl p-6 space-y-4 bg-white">
          <p className="text-xl font-semibold">Decision Point</p>
          <Progress value={(currentStep * 100) / 3} />
          <p className="">
            {currentStep === 1
              ? "Select a diagnosis to continue"
              : currentStep === 2
                ? "Review evidence to unlock quiz"
                : "Complete the practice questions"}
          </p>
          <div className="mt-6 flex justify-end">
            <button
              onClick={buttonConfig.onClick}
              disabled={buttonConfig.disabled}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-blue-700"
            >
              {buttonConfig.label}
            </button>
          </div>
        </div>

        {/* <div className="border border-gray-300 rounded-2xl p-6 space-y-4 bg-white">
          <p className="text-xl font-semibold">Quick Actions</p>
          <Button className="w-full bg-[#F9FAFB] text-slate-900 hover:text-white px-6 py-2 border border-gray-300 items-center rounded disabled:opacity-50 cursor-pointer">
            <Bookmark />
            Bookmark Case
          </Button>
          <Button className="w-full bg-[#F9FAFB] text-slate-900 hover:text-white px-6 py-2 border border-gray-300 items-center rounded disabled:opacity-50 cursor-pointer">
            <Printer />
            Print Case
          </Button>
          <Button className="w-full bg-[#F9FAFB] text-slate-900 hover:text-white px-6 py-2 border border-gray-300 items-center rounded disabled:opacity-50 cursor-pointer">
            <Share />
            Share Case
          </Button>
        </div> */}
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-600">
              Case Completed!
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              You have successfully completed this clinical case.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            {totalMCQs > 0 ? (
              <>
                <p className="text-lg font-medium">Your Score</p>
                <div className="text-4xl font-bold text-blue-600">
                  {correctAnswers} / {totalMCQs}
                </div>
                <button
                  type="button"
                  onClick={() => setShowReview((v) => !v)}
                  className="mt-3 text-sm font-medium text-blue-700 hover:underline cursor-pointer"
                >
                  {showReview ? "Hide Review" : "Review Answers"}
                </button>
              </>
            ) : (
              <p className="text-lg text-slate-600">
                You have reviewed the case successfully.
              </p>
            )}
          </div>
          {showReview && totalMCQs > 0 && (
            <div className="max-h-[50vh] overflow-y-auto border rounded-lg p-3 bg-slate-50">
              <div className="space-y-4">
                {mcqs.map((q: any, idx) => {
                  const selected = mcqAnswers[idx];
                  const correct = q.correctOption;
                  return (
                    <div key={idx} className="bg-white border rounded-lg p-3">
                      <p className="text-sm font-semibold text-slate-800 mb-2">
                        Q{idx + 1}. {q.question}
                      </p>
                      <div className="space-y-1">
                        {q.options?.map((opt: any) => {
                          const isSelected = selected === opt.option;
                          const isCorrect = correct === opt.option;
                          const border =
                            isCorrect ? "border-green-500" : isSelected ? "border-red-500" : "border-slate-200";
                          const bg =
                            isCorrect ? "bg-green-50" : isSelected ? "bg-red-50" : "bg-white";
                          return (
                            <div key={opt.option} className={`p-2 border rounded ${border} ${bg}`}>
                              <span className="text-sm text-slate-800">
                                {opt.option}. {opt.optionText}
                              </span>
                              {isCorrect && (
                                <span className="ml-2 text-xs font-bold text-green-700">Correct</span>
                              )}
                              {isSelected && !isCorrect && (
                                <span className="ml-2 text-xs font-bold text-red-700">Your choice</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-center">
            <PrimaryButton
              onClick={handleBack}
              className="w-full sm:w-auto"
            >
              {fromAnalysis ? "Back to Analysis" : "Back to Cases"}
            </PrimaryButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicalCaseFlow;

import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Brain } from "lucide-react";
import PrimaryButton from "@/components/reusable/PrimaryButton";
import type { ClinicalCaseData } from "@/types/clinicalCase";

const storageKey = (quizId: string) => `recommended_clinical_bundle_${quizId}`;

export default function RecommendedClinicalBundle() {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const fromState = location.state?.clinicalCases as
    | ClinicalCaseData[]
    | undefined;

  const fromStorage = useMemo(() => {
    if (!quizId) return [];
    try {
      const s = sessionStorage.getItem(storageKey(quizId));
      if (!s) return [];
      const p = JSON.parse(s);
      return Array.isArray(p) ? (p as ClinicalCaseData[]) : [];
    } catch {
      return [];
    }
  }, [quizId]);

  const cases: ClinicalCaseData[] =
    fromState && fromState.length > 0 ? fromState : fromStorage;

  useEffect(() => {
    if (quizId && fromState?.length) {
      sessionStorage.setItem(storageKey(quizId), JSON.stringify(fromState));
    }
  }, [quizId, fromState]);

  const analysisQuizId = (location.state?.quizId as string) || quizId || "";

  const handleBack = () => {
    if (analysisQuizId) {
      navigate(`/dashboard/quiz-analysis/${analysisQuizId}`);
    } else {
      navigate(-1);
    }
  };

  const openCase = (idx: number, c: ClinicalCaseData) => {
    navigate(`/dashboard/clinical-case/recommended-${quizId}-case-${idx}`, {
      state: {
        clinicalCaseData: c,
        fromAnalysis: true,
        quizId: analysisQuizId,
        fromRecommendedBundle: true,
      },
    });
  };

  if (!quizId) {
    return (
      <div className="p-10 text-center text-gray-500">Missing quiz reference.</div>
    );
  }

  if (!cases.length) {
    return (
      <div className="max-w-lg mx-auto p-10 text-center">
        <p className="text-gray-600 mb-4">
          No recommended cases found. Return to your quiz analysis and generate
          recommendations again.
        </p>
        <PrimaryButton onClick={handleBack}>Back to analysis</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to quiz analysis</span>
      </button>

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Recommended clinical cases
          </h1>
          <p className="text-sm text-gray-600">
            Based on your missed questions — open each case to review.
          </p>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {cases.map((c, idx) => (
          <li
            key={c._id || idx}
            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-purple-100 bg-purple-50/60"
          >
            <div>
              <p className="font-semibold text-purple-950">
                Case {idx + 1}: {c.caseTitle || "Clinical case"}
              </p>
              {c.subject ? (
                <p className="text-xs text-purple-800 mt-1">{c.subject}</p>
              ) : null}
            </div>
            <PrimaryButton
              type="button"
              className="shrink-0 bg-purple-600 hover:bg-purple-700 h-9 px-4 text-sm"
              onClick={() => openCase(idx, c)}
            >
              Open
            </PrimaryButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

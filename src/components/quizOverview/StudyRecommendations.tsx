import { useNavigate, useParams } from "react-router-dom";
import { Recommendations } from "./type";
import {
  BookOpen,
  Brain,
  GraduationCap,
  NotebookText,
  Sparkles,
} from "lucide-react";
import PrimaryButton from "../reusable/PrimaryButton";
import { hasAnyRecommendationContent } from "./normalizeRecommendations";

const CLINICAL_BUNDLE_STORAGE = (quizId: string) =>
  `recommended_clinical_bundle_${quizId}`;

interface StudyRecommendationsProps {
  recommendations: Recommendations;
  isLoading?: boolean;
}

const StudyRecommendations: React.FC<StudyRecommendationsProps> = ({
  recommendations,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const mcqCount =
    recommendations.post_quiz_recommendations?.mcqs?.length ?? 0;
  const flashCount = recommendations.flashcards?.flashcards?.length ?? 0;
  const clinicalCases = recommendations.clinical_cases?.length
    ? recommendations.clinical_cases
    : recommendations.clinical_case
      ? [recommendations.clinical_case]
      : [];
  const noteItems = recommendations.notes?.items?.length
    ? recommendations.notes.items
    : recommendations.notes?.title || recommendations.notes?.note
      ? [
          {
            title: recommendations.notes.title || "Study notes",
            note: recommendations.notes.note || "",
          },
        ]
      : [];

  const handleStartPractice = (type: string) => {
    if (!id) return;

    switch (type) {
      case "mcq":
        if (recommendations.post_quiz_recommendations) {
          navigate(`/dashboard/daily-challenge-quiz/recommended-${id}`, {
            state: {
              challengeData: {
                title: `Review: ${recommendations.post_quiz_recommendations.weak_area_name}`,
                mcqs: recommendations.post_quiz_recommendations.mcqs,
                subject:
                  recommendations.post_quiz_recommendations.weak_area_name,
                system:
                  recommendations.post_quiz_recommendations.weak_area_level,
                topic: recommendations.post_quiz_recommendations.weak_area_name,
              },
              fromAnalysis: true,
              quizId: id,
            },
          });
        }
        break;
      case "flashcard":
        if (recommendations.flashcards) {
          navigate(`/dashboard/solve-flash-card/recommended-${id}`, {
            state: {
              flashCardData: {
                flashCards: recommendations.flashcards.flashcards,
                title: "Recommended Flashcards",
                subject: "AI Generated",
              },
              fromAnalysis: true,
              quizId: id,
            },
          });
        }
        break;
      case "clinical_case": {
        if (!clinicalCases.length) break;
        try {
          sessionStorage.setItem(
            CLINICAL_BUNDLE_STORAGE(id),
            JSON.stringify(clinicalCases),
          );
        } catch {
          // ignore
        }
        navigate(`/dashboard/clinical-case/recommended-bundle/${id}`, {
          state: {
            clinicalCases,
            fromAnalysis: true,
            quizId: id,
          },
        });
        break;
      }
      case "notes":
        if (noteItems.length) {
          navigate(`/dashboard/generated-notes/recommended-${id}`, {
            state: {
              noteData: { items: noteItems },
              fromAnalysis: true,
              quizId: id,
            },
          });
        }
        break;
    }
  };

  const hasContent = hasAnyRecommendationContent(recommendations);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6 mt-2">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <p className="text-[#1A1C1C] font-semibold text-lg">
          AI Study Recommendations
        </p>
      </div>

      {isLoading ? (
        <div className="py-10 text-center border rounded-lg bg-gray-50 border-dashed">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-blue-600 font-inter font-medium">
              Recommendation is generating
            </p>
          </div>
        </div>
      ) : hasContent ? (
        <div className="space-y-4">
          {recommendations.post_quiz_recommendations && (
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Mock Exam Case</h4>
                  <p className="text-xs text-blue-700">
                    {mcqCount} MCQs from your missed questions (max 5)
                  </p>
                </div>
              </div>
              <PrimaryButton
                onClick={() => handleStartPractice("mcq")}
                className="h-9 px-6 text-sm bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                Start
              </PrimaryButton>
            </div>
          )}

          {clinicalCases.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100 group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg text-purple-600 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-purple-900">
                    Clinical case studies
                  </h4>
                  <p className="text-xs text-purple-700">
                    {clinicalCases.length} full case
                    {clinicalCases.length === 1 ? "" : "s"} tied to mistakes
                    (max 5)
                  </p>
                </div>
              </div>
              <PrimaryButton
                onClick={() => handleStartPractice("clinical_case")}
                className="h-9 px-6 text-sm bg-purple-600 hover:bg-purple-700 shadow-sm"
              >
                Start
              </PrimaryButton>
            </div>
          )}

          {recommendations.flashcards && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900">Review Flashcards</h4>
                  <p className="text-xs text-emerald-700">
                    {flashCount} cards from missed topics (max 5)
                  </p>
                </div>
              </div>
              <PrimaryButton
                onClick={() => handleStartPractice("flashcard")}
                className="h-9 px-6 text-sm bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              >
                Start
              </PrimaryButton>
            </div>
          )}

          {noteItems.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100 group hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg text-amber-600 shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <NotebookText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900">Generated Notes</h4>
                  <p className="text-xs text-amber-700">
                    {noteItems.length} focused note
                    {noteItems.length === 1 ? "" : "s"} (max 5)
                  </p>
                </div>
              </div>
              <PrimaryButton
                onClick={() => handleStartPractice("notes")}
                className="h-9 px-6 text-sm bg-amber-600 hover:bg-amber-700 shadow-sm"
              >
                View
              </PrimaryButton>
            </div>
          )}
        </div>
      ) : (
        <div className="py-10 text-center border rounded-lg bg-gray-50 border-dashed">
          <p className="text-gray-500 font-inter font-medium">
            No recommendation found
          </p>
        </div>
      )}
    </div>
  );
};

export default StudyRecommendations;

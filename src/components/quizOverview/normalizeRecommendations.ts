import type { ClinicalCaseData } from "@/types/clinicalCase";
import type { Recommendations, RecommendedNoteItem } from "./type";

const MAX = 5;

const sliceFive = <T>(arr: T[] | undefined | null): T[] => {
  if (!Array.isArray(arr)) return [];
  return arr.slice(0, MAX);
};

function ensureClinicalCaseShape(
  raw: unknown,
  contextId: string,
  index: number,
): ClinicalCaseData {
  const c = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  const now = new Date().toISOString();
  const id =
    String(c._id || "").trim() ||
    `recommended-${contextId}-case-${index}`;
  return {
    ...c,
    _id: id,
    caseTitle: String(c.caseTitle ?? "Clinical case"),
    patientPresentation: String(c.patientPresentation ?? ""),
    historyOfPresentIllness: String(c.historyOfPresentIllness ?? ""),
    physicalExamination: String(c.physicalExamination ?? ""),
    laboratoryResults: Array.isArray(c.laboratoryResults)
      ? (c.laboratoryResults as ClinicalCaseData["laboratoryResults"])
      : [],
    imaging: String(c.imaging ?? ""),
    diagnosisQuestion: (c.diagnosisQuestion ?? {
      question: "",
      diagnosisOptions: [],
    }) as ClinicalCaseData["diagnosisQuestion"],
    correctOption: (c.correctOption ?? {
      optionName: "A",
      explanation: "",
    }) as ClinicalCaseData["correctOption"],
    difficultyLevel: String(c.difficultyLevel ?? "Basic"),
    mcqs: Array.isArray(c.mcqs) ? (c.mcqs as ClinicalCaseData["mcqs"]) : [],
    subject: String(c.subject ?? ""),
    system: String(c.system ?? ""),
    topic: String(c.topic ?? ""),
    subtopic: String(c.subtopic ?? ""),
    studentType: String(c.studentType ?? ""),
    createdAt: String(c.createdAt ?? now),
    updatedAt: String(c.updatedAt ?? now),
  } as ClinicalCaseData;
}

/**
 * Coerce API / DB recommendedContent (v1 or v2) into a consistent Recommendations
 * object for the quiz analysis UI.
 */
export function normalizeRecommendations(
  raw: unknown,
  quizContentId: string,
): Recommendations {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const o = raw as Record<string, unknown>;
  const base: Recommendations = { ...(o as Recommendations) };

  let clinicalList: any[] = [];
  if (Array.isArray(base.clinical_cases) && base.clinical_cases.length) {
    clinicalList = base.clinical_cases;
  } else if (base.clinical_case) {
    clinicalList = [base.clinical_case];
  }

  base.clinical_cases = sliceFive(clinicalList).map((c, i) =>
    ensureClinicalCaseShape(c, quizContentId, i),
  );
  if (base.clinical_cases.length === 0) {
    base.clinical_cases = null;
  }

  if (base.clinical_cases?.length) {
    base.clinical_case = base.clinical_cases[0];
  } else {
    base.clinical_case = null;
  }

  let noteItems: RecommendedNoteItem[] = [];
  const n = base.notes;
  if (n && typeof n === "object") {
    if (Array.isArray(n.items)) {
      noteItems = n.items
        .map((it) => ({
          title: String(it?.title ?? "").trim(),
          note: String(it?.note ?? "").trim(),
        }))
        .filter((it) => it.title || it.note);
    } else if (n.title != null || n.note != null) {
      noteItems = [
        {
          title: String(n.title ?? "").trim() || "Study notes",
          note: String(n.note ?? "").trim(),
        },
      ];
    }
  }
  noteItems = sliceFive(noteItems);
  if (noteItems.length) {
    base.notes = { items: noteItems };
  } else {
    base.notes = null;
  }

  if (base.post_quiz_recommendations?.mcqs) {
    base.post_quiz_recommendations = {
      ...base.post_quiz_recommendations,
      mcqs: sliceFive(base.post_quiz_recommendations.mcqs),
    };
  }

  if (base.flashcards?.flashcards) {
    base.flashcards = {
      flashcards: sliceFive(base.flashcards.flashcards),
    };
  }

  return base;
}

export function hasAnyRecommendationContent(r: Recommendations): boolean {
  return Boolean(
    r.post_quiz_recommendations ||
      r.flashcards?.flashcards?.length ||
      r.clinical_case ||
      (r.clinical_cases && r.clinical_cases.length > 0) ||
      r.notes?.items?.length ||
      (r.notes && (r.notes.title || r.notes.note)),
  );
}

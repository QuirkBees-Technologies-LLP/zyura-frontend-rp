import { describe, expect, it } from "vitest";
import {
  hasAnyRecommendationContent,
  normalizeRecommendations,
} from "./normalizeRecommendations";

describe("normalizeRecommendations", () => {
  it("maps legacy clinical_case and slices to 5", () => {
    const out = normalizeRecommendations(
      {
        clinical_case: { caseTitle: "Legacy", patientPresentation: "x" },
        post_quiz_recommendations: {
          weak_area_name: "w",
          weak_area_level: "l",
          mcqs: Array.from({ length: 7 }, (_, i) => ({ mcqId: String(i) })),
        },
      },
      "quiz1",
    );
    expect(out.clinical_cases).toHaveLength(1);
    expect(out.clinical_cases![0]._id).toContain("recommended-quiz1");
    expect(out.post_quiz_recommendations?.mcqs).toHaveLength(5);
  });

  it("hasAnyRecommendationContent detects v2 clinical_cases", () => {
    expect(
      hasAnyRecommendationContent({
        clinical_cases: [{ _id: "1", caseTitle: "t" } as any],
      }),
    ).toBe(true);
  });

  it("normalizes notes.items", () => {
    const out = normalizeRecommendations(
      {
        notes: {
          items: [
            { title: "A", note: "n1" },
            { title: "B", note: "n2" },
          ],
        },
      },
      "q",
    );
    expect(out.notes?.items).toHaveLength(2);
  });
});

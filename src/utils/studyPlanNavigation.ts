/**
 * Study plan hourly task routing: bank vs AI-generated (my_content) repositories.
 */

export type StudyPlanContentRepository = "bank" | "my_content" | undefined;

export function isMyContentRepository(
  repo: StudyPlanContentRepository,
): boolean {
  return String(repo ?? "bank") === "my_content";
}

/** Use client-side question index when my_content returns a full MCQ array in one response. */
export function shouldUseClientMcqPagination(
  repo: StudyPlanContentRepository,
): boolean {
  return isMyContentRepository(repo);
}

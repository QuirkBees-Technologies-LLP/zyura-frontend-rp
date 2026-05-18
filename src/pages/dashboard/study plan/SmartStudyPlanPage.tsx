import StudyPlanListSection from "./StudyPlanListSection";

export default function SmartStudyPlanPage() {
  return (
    <div className="my-6 md:my-10">
      {/* <MedicalStudyGoalTracker /> */}
      <div className="mt-8">
        <StudyPlanListSection
          title="Smart Study Planner"
          description="Create multiple plans with their own coverage and chat threads."
          showCreateButton
          createPath="/dashboard/smart-study/create"
          createLabel="Create new plan"
          queryParams={{ created_from: "smart_study_planner" }}
          wrapperClassName="px-1 md:px-2"
        />
      </div>
    </div>
  );
}


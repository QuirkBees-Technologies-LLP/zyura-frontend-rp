import StudyPlanListSection from "./StudyPlanListSection";

export default function MyPlan() {
  return (
    <StudyPlanListSection
      title="All Preference"
      description="A structured path to smarter learning and better results."
      createPath="/dashboard/create-study-plan"
      createLabel="Create new preference"
      queryParams={{ created_from: "smart_study" }}
    />
  );
}

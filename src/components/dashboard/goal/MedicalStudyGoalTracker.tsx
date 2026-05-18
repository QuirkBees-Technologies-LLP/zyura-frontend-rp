/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Subject, FormData as GoalFormData } from "./type";
import { GoalModal, Step1, Step2, Step3 } from "./GoalModal";
import { GoalEmptyState } from "./GoalEmptyState";
import { GoalDashboard } from "./GoalDashboard";
import {
  useCreateGoalMutation,
  useGetGoalQuery,
  useUpdateGoalMutation,
} from "@/store/features/goal/goal.api";
import { toast } from "sonner";
import GlobalLoader from "@/common/GlobalLoader";
import { useGetMCQBankTreeQuery } from "@/store/features/MCQBank/MCQBank.api";
import { useSubjectTreeSelection } from "./useSubjectTreeSelection";

// Main Component
const MedicalStudyGoalTracker: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
  const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();
  const { data, isLoading } = useGetGoalQuery({});

  const { data: treeData, isLoading: isTreeLoading } = useGetMCQBankTreeQuery(
    {},
  );

  const availableSubjects: Subject[] =
    treeData?.data?.map((subject: any) => ({
      name: subject.subjectName,
      systems: subject.systems.map((system: any) => ({
        name: system.name,
        topics: system.topics.map((topic: any) => ({
          topicName: topic.topicName,
          subTopics: topic.subTopics || [],
        })),
      })),
    })) || [];

  const {
    selectedSubjects,
    setSelectedSubjects,
    handleSubjectToggle,
    handleFullSubjectToggle,
    handleSystemToggle,
    handleFullSystemToggle,
    handleTopicToggle,
    handleFullTopicToggle,
    handleSubTopicToggle,
  } = useSubjectTreeSelection(availableSubjects);

  const apiGoal = data?.data?.[0];

  const [formData, setFormData] = useState<GoalFormData>({
    goalName: "",
    studyHoursPerDay: 0,
    startDate: "",
    endDate: "",
  });

  const calculateDuration = (): number => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalStudyHours = (): number => {
    return calculateDuration() * formData.studyHoursPerDay;
  };

  const calculateHoursPerSystem = (): string => {
    const totalSystems = selectedSubjects.reduce(
      (total, subject) => total + (subject.systems?.length ?? 0),
      0,
    );
    if (totalSystems === 0) return "0";
    return (calculateTotalStudyHours() / totalSystems).toFixed(1);
  };

  const handleCreateGoal = async () => {
    const goalDataToSend = {
      goalName: formData.goalName,
      studyHoursPerDay: Number(formData.studyHoursPerDay),
      startDate: formData.startDate,
      endDate: formData.endDate,
      selectedSubjects: selectedSubjects.map((s) => ({
        subjectName: s.subjectName,
        systemNames: s.systemNames,
        systems: s.systems ?? [],
        fullSubject: s.fullSubject ?? false,
      })),
    };

    try {
      if (isEditMode) {
        await updateGoal(goalDataToSend).unwrap();
      } else {
        await createGoal(goalDataToSend).unwrap();
      }

      handleCloseModal();
    } catch (error: any) {
      console.error("Goal operation error:", error);
      toast.error(
        error?.data?.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } goal. Please try again ❌`,
      );
      return;
    }
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setCurrentStep(1);
    setIsEditMode(false);
    setFormData({
      goalName: "",
      studyHoursPerDay: 0,
      startDate: "",
      endDate: "",
    });
    setSelectedSubjects([]);
  };

  const handleChangeGoal = (): void => {
    if (apiGoal) {
      setIsEditMode(true);
      setFormData({
        goalName: apiGoal.goalName,
        studyHoursPerDay: apiGoal.studyHoursPerDay,
        startDate: apiGoal.startDate.split("T")[0],
        endDate: apiGoal.endDate.split("T")[0],
      });

      setSelectedSubjects(
        apiGoal.selectedSubjects.map((subject: any) => {
          const availableSubject = availableSubjects.find(
            (s) => s.name === subject.subjectName,
          );

          const systemNames = subject.systemNames ?? [];
          const fullSubject = subject.fullSubject || false;

          if (subject.systems && subject.systems.length > 0) {
            return {
              subjectName: subject.subjectName,
              systemNames,
              systems: subject.systems,
              fullSubject,
            };
          }

          const systems = systemNames
            .map((sysName: string) => {
              const system = availableSubject?.systems.find(
                (s) => s.name === sysName,
              );
              if (!system) return null;
              return {
                systemName: sysName,
                fullSystem: false,
                topics: system.topics.map((t) => ({
                  topicName: t.topicName,
                  fullTopic: true,
                  subTopicNames: [...t.subTopics],
                })),
              };
            })
            .filter(Boolean);

          return {
            subjectName: subject.subjectName,
            systemNames,
            systems,
            fullSubject,
          };
        }),
      );
    }
    setShowModal(true);
  };

  if (isLoading || isTreeLoading)
    return (
      <div>
        <GlobalLoader />
      </div>
    );

  return (
    <div className="bg-gray-50 mb-12">
      <div>
        {!apiGoal ? (
          <GoalEmptyState onSetGoal={() => setShowModal(true)} />
        ) : (
          <GoalDashboard goal={apiGoal} onChangeGoal={handleChangeGoal} />
        )}

        <GoalModal
          showModal={showModal}
          currentStep={currentStep}
          onClose={handleCloseModal}
          isEditMode={isEditMode}
        >
          {currentStep === 1 && (
            <Step1
              formData={formData}
              onFormDataChange={setFormData}
              onNext={() => setCurrentStep(2)}
              onCancel={handleCloseModal}
            />
          )}
          {currentStep === 2 && (
            <Step2
              availableSubjects={availableSubjects}
              selectedSubjects={selectedSubjects}
              onSubjectToggle={handleSubjectToggle}
              onFullSubjectToggle={handleFullSubjectToggle}
              onSystemToggle={handleSystemToggle}
              onFullSystemToggle={handleFullSystemToggle}
              onTopicToggle={handleTopicToggle}
              onFullTopicToggle={handleFullTopicToggle}
              onSubTopicToggle={handleSubTopicToggle}
              onPrevious={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
            />
          )}
          {currentStep === 3 && (
            <Step3
              formData={formData}
              selectedSubjects={selectedSubjects}
              availableSubjects={availableSubjects}
              calculateDuration={calculateDuration}
              calculateTotalStudyHours={calculateTotalStudyHours}
              calculateHoursPerSystem={calculateHoursPerSystem}
              onPrevious={() => setCurrentStep(2)}
              onCreate={handleCreateGoal}
              isEditMode={isEditMode}
              isLoading={isCreating || isUpdating}
            />
          )}
        </GoalModal>
      </div>
    </div>
  );
};

export default MedicalStudyGoalTracker;

import React from "react";
import { GoalStepIndicator } from "./GoalStepIndicator";
import { SubjectTreeSelector } from "./SubjectTreeSelector";
import {
  ModalProps,
  Step1Props,
  Step2Props,
  Step3Props,
} from "./type";

// ─── GoalModal ─────────────────────────────────────────────────────────────
export const GoalModal: React.FC<ModalProps> = ({
  showModal,
  currentStep,
  onClose,
  children,
  isEditMode = false,
}) => {
  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Update Your Smart Study Planner" : "Create Your Smart Study Planner"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4">
          <GoalStepIndicator currentStep={currentStep} />
        </div>

        {children}
      </div>
    </div>
  );
};

// ─── Step 1 ────────────────────────────────────────────────────────────────
export const Step1: React.FC<Step1Props> = ({ formData, onFormDataChange, onNext, onCancel }) => {
  const isValid = formData.goalName && formData.studyHoursPerDay > 0 && formData.startDate && formData.endDate;
  return (
    <div className="p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Plan Name</label>
        <input
          type="text"
          placeholder="e.g., Final Year MBBS Preparation"
          value={formData.goalName}
          onChange={(e) =>
            onFormDataChange({ ...formData, goalName: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Study hours per day
        </label>
        <input
          type="number"
          min="0"
          value={formData.studyHoursPerDay}
          onChange={(e) =>
            onFormDataChange({
              ...formData,
              studyHoursPerDay: Number(e.target.value),
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              onFormDataChange({ ...formData, startDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            min={formData.startDate}
            onChange={(e) =>
              onFormDataChange({ ...formData, endDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg cursor-pointer ${
            isValid
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// ─── Step 2 ────────────────────────────────────────────────────────────────
export const Step2: React.FC<Step2Props> = ({
  availableSubjects,
  selectedSubjects,
  onSubjectToggle,
  onFullSubjectToggle,
  onSystemToggle,
  onFullSystemToggle,
  onTopicToggle,
  onFullTopicToggle,
  onSubTopicToggle,
  onPrevious,
  onNext,
}) => {
  const totalSystems = selectedSubjects.reduce(
    (t, s) => t + (s.systems?.length ?? 0),
    0,
  );
  const isValid = selectedSubjects.length > 0 && totalSystems > 0;

  return (
    <div className="p-6">
      <SubjectTreeSelector
        availableSubjects={availableSubjects}
        selectedSubjects={selectedSubjects}
        onSubjectToggle={onSubjectToggle}
        onFullSubjectToggle={onFullSubjectToggle}
        onSystemToggle={onSystemToggle}
        onFullSystemToggle={onFullSystemToggle}
        onTopicToggle={onTopicToggle}
        onFullTopicToggle={onFullTopicToggle}
        onSubTopicToggle={onSubTopicToggle}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg cursor-pointer ${
            isValid
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// ─── Step 3 ────────────────────────────────────────────────────────────────
export const Step3: React.FC<Step3Props> = ({
  formData,
  selectedSubjects,
  calculateDuration,
  calculateTotalStudyHours,
  calculateHoursPerSystem,
  onPrevious,
  isEditMode = false,
  onCreate,
  isLoading = false,
}) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold mb-4">Goal Overview</h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Goal Name</div>
          <div className="font-medium">{formData.goalName}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Study Hours/Day</div>
          <div className="font-medium">{formData.studyHoursPerDay} hours</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Total Duration</div>
          <div className="font-medium">{calculateDuration()} days</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Total Study Hours</div>
          <div className="font-medium">{calculateTotalStudyHours()} hours</div>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
        Each system will receive approximately{" "}
        <span className="font-semibold">{calculateHoursPerSystem()} hours</span>
      </div>

    <div className="max-h-60 overflow-y-auto space-y-4 mb-6">
      {selectedSubjects.map((subject) => (
        <div key={subject.subjectName} className="border-l-4 border-blue-500 pl-4">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-lg">{subject.subjectName}</div>
            <div className="text-sm text-gray-600">
              {subject.fullSubject ? "Full Subject" : `${subject.systems?.length ?? 0} systems`}
            </div>
          </div>

          {!subject.fullSubject &&
            (subject.systems ?? []).map((sys) => (
              <div key={sys.systemName} className="mb-2 pl-2 border-l border-gray-200">
                <div className="text-sm font-medium text-gray-700 flex justify-between">
                  <span>{sys.systemName}</span>
                  <span className="text-gray-400 text-xs">
                    {sys.fullSystem ? "Full System" : `${sys.topics.length} topics`}
                  </span>
                </div>

                {!sys.fullSystem && sys.topics.length > 0 && (
                  <div className="pl-3 mt-1 flex flex-wrap gap-1">
                    {sys.topics.map((topic) => (
                      <span
                        key={topic.topicName}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                      >
                        {topic.topicName}
                        {topic.subTopicNames.length > 0 &&
                          ` (${topic.subTopicNames.length} sub-topics)`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>

    <div className="flex justify-between mt-6">
      <button
        onClick={onPrevious}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
      >
        ← Previous
      </button>
      <button
        onClick={onCreate}
        disabled={isLoading}
        className={`px-6 py-2 rounded-lg cursor-pointer ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isLoading
          ? "Saving..."
          : isEditMode
            ? "Update Smart Study Planner"
            : "Create Preference"}
      </button>
    </div>
  </div>
);

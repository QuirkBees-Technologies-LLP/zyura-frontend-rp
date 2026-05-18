import React from "react";
import type {
  SelectedSubject,
  SelectedSystem,
  SelectedTopic,
  Subject,
  System,
  Topic,
} from "./type";

// ─── Reusable Toggle ───────────────────────────────────────────────────────
const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange,
}) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
      checked ? "bg-blue-500" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);

// ─── SubTopic Row ──────────────────────────────────────────────────────────
const SubTopicRow: React.FC<{
  subTopicName: string;
  isChecked: boolean;
  onToggle: () => void;
}> = ({ subTopicName, isChecked, onToggle }) => (
  <label className="flex items-center gap-2 text-xs text-gray-600 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onToggle}
      className="w-3 h-3 accent-blue-500"
    />
    {subTopicName}
  </label>
);

// ─── Topic Row ─────────────────────────────────────────────────────────────
const TopicRow: React.FC<{
  topic: Topic;
  selectedTopic: SelectedTopic | undefined;
  onTopicToggle: () => void;
  onFullTopicToggle: () => void;
  onSubTopicToggle: (subTopicName: string) => void;
}> = ({
  topic,
  selectedTopic,
  onTopicToggle,
  onFullTopicToggle,
  onSubTopicToggle,
}) => {
  const isSelected = !!selectedTopic;
  const hasSubTopics = topic.subTopics.length > 0;

  return (
    <div className="pl-2 border-l-2 border-gray-100 ml-1 mb-1">
      <div className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onTopicToggle}
          className="w-3.5 h-3.5 accent-blue-500 shrink-0"
        />
        <span
          className={`text-sm ${isSelected ? "text-gray-800 font-medium" : "text-gray-600"}`}
        >
          {topic.topicName}
        </span>
        {isSelected && hasSubTopics && (
          <span className="ml-auto text-xs text-gray-400">
            {selectedTopic?.subTopicNames?.length ?? 0}/{topic.subTopics.length}{" "}
            sub-topics
          </span>
        )}
      </div>

      {isSelected && hasSubTopics && (
        <div className="ml-4 mt-1 mb-2">
          <div className="flex items-center justify-between bg-blue-50 px-2 py-1.5 rounded mb-1.5">
            <span className="text-xs text-gray-600">Cover all sub-topics</span>
            <Toggle
              checked={selectedTopic?.fullTopic ?? false}
              onChange={onFullTopicToggle}
            />
          </div>

          {!selectedTopic?.fullTopic && (
            <div className="space-y-0.5 pl-1 border-l border-gray-100">
              {topic.subTopics.map((st) => (
                <SubTopicRow
                  key={st}
                  subTopicName={st}
                  isChecked={selectedTopic?.subTopicNames?.includes(st) ?? false}
                  onToggle={() => onSubTopicToggle(st)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── System Row ────────────────────────────────────────────────────────────
const SystemRow: React.FC<{
  system: System;
  selectedSystem: SelectedSystem | undefined;
  onSystemToggle: () => void;
  onFullSystemToggle: () => void;
  onTopicToggle: (topicName: string) => void;
  onFullTopicToggle: (topicName: string) => void;
  onSubTopicToggle: (topicName: string, subTopicName: string) => void;
}> = ({
  system,
  selectedSystem,
  onSystemToggle,
  onFullSystemToggle,
  onTopicToggle,
  onFullTopicToggle,
  onSubTopicToggle,
}) => {
  const isSelected = !!selectedSystem;
  const hasTopics = system.topics.length > 0;
  const selectedTopicCount = selectedSystem?.topics?.length ?? 0;

  return (
    <div className="pl-3 border-l-2 border-gray-200 ml-2 mb-2">
      <div className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSystemToggle}
          className="w-3.5 h-3.5 accent-blue-500 shrink-0"
        />
        <span
          className={`text-sm ${isSelected ? "text-gray-800 font-medium" : "text-gray-500"}`}
        >
          {system.name}
        </span>
        {isSelected && hasTopics && (
          <span className="ml-auto text-xs text-gray-400">
            {selectedTopicCount}/{system.topics.length} topics
          </span>
        )}
      </div>

      {isSelected && (
        <div className="ml-4 mt-1 mb-1">
          <div className="flex items-center justify-between bg-blue-50 px-2 py-1.5 rounded mb-2">
            <span className="text-xs text-gray-600">Cover full system</span>
            <Toggle
              checked={selectedSystem?.fullSystem ?? false}
              onChange={onFullSystemToggle}
            />
          </div>

          {!selectedSystem?.fullSystem && hasTopics && (
            <div className="space-y-1">
              <p className="text-xs text-gray-400 mb-1 px-1">Select topics</p>
              {system.topics.map((topic) => {
                const selTopic = selectedSystem?.topics?.find(
                  (t) => t.topicName === topic.topicName,
                );
                return (
                  <TopicRow
                    key={topic.topicName}
                    topic={topic}
                    selectedTopic={selTopic}
                    onTopicToggle={() => onTopicToggle(topic.topicName)}
                    onFullTopicToggle={() => onFullTopicToggle(topic.topicName)}
                    onSubTopicToggle={(st) => onSubTopicToggle(topic.topicName, st)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Subject Item ──────────────────────────────────────────────────────────
export const SubjectItem: React.FC<{
  subject: Subject;
  selected: SelectedSubject | undefined;
  onSubjectToggle: (name: string) => void;
  onFullSubjectToggle: (name: string) => void;
  onSystemToggle: (subjectName: string, systemName: string) => void;
  onFullSystemToggle: (subjectName: string, systemName: string) => void;
  onTopicToggle: (subjectName: string, systemName: string, topicName: string) => void;
  onFullTopicToggle: (subjectName: string, systemName: string, topicName: string) => void;
  onSubTopicToggle: (
    subjectName: string,
    systemName: string,
    topicName: string,
    subTopicName: string,
  ) => void;
}> = ({
  subject,
  selected,
  onSubjectToggle,
  onFullSubjectToggle,
  onSystemToggle,
  onFullSystemToggle,
  onTopicToggle,
  onFullTopicToggle,
  onSubTopicToggle,
}) => {
  const isSelected = !!selected;
  const selectedSystemCount = selected?.systems?.length ?? 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSubjectToggle(subject.name)}
          className="mt-1 w-4 h-4 accent-blue-500 shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">{subject.name}</div>
            {isSelected && (
              <span className="text-xs text-gray-400">
                {selectedSystemCount}/{subject.systems.length} systems
              </span>
            )}
          </div>
          <div className="text-sm text-gray-400 mb-1">
            {subject.systems.length} systems
          </div>

          {isSelected && selected && (
            <>
              <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded">
                <span className="text-sm text-gray-600">Cover Full Subject</span>
                <Toggle
                  checked={selected.fullSubject ?? false}
                  onChange={() => onFullSubjectToggle(subject.name)}
                />
              </div>

              {!selected.fullSubject && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-400 mb-1">
                    Select Systems &amp; Topics
                  </p>
                  {subject.systems.map((system) => {
                    const selSystem = (selected.systems ?? []).find(
                      (s) => s.systemName === system.name,
                    );
                    return (
                      <SystemRow
                        key={system.name}
                        system={system}
                        selectedSystem={selSystem}
                        onSystemToggle={() => onSystemToggle(subject.name, system.name)}
                        onFullSystemToggle={() =>
                          onFullSystemToggle(subject.name, system.name)
                        }
                        onTopicToggle={(topicName) =>
                          onTopicToggle(subject.name, system.name, topicName)
                        }
                        onFullTopicToggle={(topicName) =>
                          onFullTopicToggle(subject.name, system.name, topicName)
                        }
                        onSubTopicToggle={(topicName, st) =>
                          onSubTopicToggle(subject.name, system.name, topicName, st)
                        }
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export type SubjectTreeSelectorProps = {
  availableSubjects: Subject[];
  selectedSubjects: SelectedSubject[];
  onSubjectToggle: (subjectName: string) => void;
  onFullSubjectToggle: (subjectName: string) => void;
  onSystemToggle: (subjectName: string, systemName: string) => void;
  onFullSystemToggle: (subjectName: string, systemName: string) => void;
  onTopicToggle: (subjectName: string, systemName: string, topicName: string) => void;
  onFullTopicToggle: (subjectName: string, systemName: string, topicName: string) => void;
  onSubTopicToggle: (
    subjectName: string,
    systemName: string,
    topicName: string,
    subTopicName: string,
  ) => void;
  /** Optional heading (default: Select Subjects) */
  heading?: string;
  /** Optional description under heading */
  description?: string;
  /** Max height for scroll area (Tailwind class), default max-h-80 */
  scrollClassName?: string;
};

/**
 * Reusable subject → system → topic → sub-topic tree (same as Goal modal Step 2 body).
 */
export const SubjectTreeSelector: React.FC<SubjectTreeSelectorProps> = ({
  availableSubjects,
  selectedSubjects,
  onSubjectToggle,
  onFullSubjectToggle,
  onSystemToggle,
  onFullSystemToggle,
  onTopicToggle,
  onFullTopicToggle,
  onSubTopicToggle,
  heading = "Select Subjects",
  description = "Choose subjects and decide whether to cover them fully or select specific systems",
  scrollClassName = "max-h-80",
}) => {
  const totalSystems = selectedSubjects.reduce(
    (t, s) => t + (s.systems?.length ?? 0),
    0,
  );

  return (
    <>
      <h3 className="text-lg font-semibold mb-2">{heading}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
        <span className="font-medium">{selectedSubjects.length} subjects selected</span>
        <span className="mx-2">·</span>
        <span className="font-medium">{totalSystems} systems total</span>
      </div>

      <div className={`${scrollClassName} overflow-y-auto mb-4 space-y-3`}>
        {availableSubjects.map((subject) => {
          const selected = selectedSubjects.find(
            (s) => s.subjectName === subject.name,
          );
          return (
            <SubjectItem
              key={subject.name}
              subject={subject}
              selected={selected}
              onSubjectToggle={onSubjectToggle}
              onFullSubjectToggle={onFullSubjectToggle}
              onSystemToggle={onSystemToggle}
              onFullSystemToggle={onFullSystemToggle}
              onTopicToggle={onTopicToggle}
              onFullTopicToggle={onFullTopicToggle}
              onSubTopicToggle={onSubTopicToggle}
            />
          );
        })}
      </div>
    </>
  );
};

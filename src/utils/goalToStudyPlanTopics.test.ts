import { describe, expect, it } from "vitest";
import { goalToStudyPlanTopics } from "./goalToStudyPlanTopics";

describe("goalToStudyPlanTopics", () => {
  const tree = [
    {
      name: "Medicine",
      systems: [
        {
          name: "Cardiology",
          topics: [
            { topicName: "Hypertension", subTopics: ["Primary", "Secondary"] },
            { topicName: "HeartFailure", subTopics: [] },
          ],
        },
      ],
    },
  ] as any;

  it("expands explicit subtopics only", () => {
    const selectedSubjects = [
      {
        subjectName: "Medicine",
        systemNames: ["Cardiology"],
        systems: [
          {
            systemName: "Cardiology",
            topics: [
              {
                topicName: "Hypertension",
                fullTopic: false,
                subTopicNames: ["Secondary"],
              },
            ],
            fullSystem: false,
          },
        ],
        fullSubject: false,
      },
    ] as any;

    const topics = goalToStudyPlanTopics(selectedSubjects, tree);
    expect(topics).toEqual([
      {
        subject: "Medicine",
        system: "Cardiology",
        topic: "Hypertension",
        subtopic: "Secondary",
      },
    ]);
  });

  it("expands fullTopic to all subtopics", () => {
    const selectedSubjects = [
      {
        subjectName: "Medicine",
        systemNames: ["Cardiology"],
        systems: [
          {
            systemName: "Cardiology",
            topics: [
              {
                topicName: "Hypertension",
                fullTopic: true,
                subTopicNames: [],
              },
            ],
            fullSystem: false,
          },
        ],
        fullSubject: false,
      },
    ] as any;

    const topics = goalToStudyPlanTopics(selectedSubjects, tree);
    expect(topics).toEqual([
      {
        subject: "Medicine",
        system: "Cardiology",
        topic: "Hypertension",
        subtopic: "Primary",
      },
      {
        subject: "Medicine",
        system: "Cardiology",
        topic: "Hypertension",
        subtopic: "Secondary",
      },
    ]);
  });

  it("emits topic-only tuple when no subtopics exist", () => {
    const selectedSubjects = [
      {
        subjectName: "Medicine",
        systemNames: ["Cardiology"],
        systems: [
          {
            systemName: "Cardiology",
            topics: [
              {
                topicName: "HeartFailure",
                fullTopic: false,
                subTopicNames: [],
              },
            ],
            fullSystem: false,
          },
        ],
        fullSubject: false,
      },
    ] as any;

    const topics = goalToStudyPlanTopics(selectedSubjects, tree);
    expect(topics).toEqual([
      {
        subject: "Medicine",
        system: "Cardiology",
        topic: "HeartFailure",
        subtopic: "",
      },
    ]);
  });
});


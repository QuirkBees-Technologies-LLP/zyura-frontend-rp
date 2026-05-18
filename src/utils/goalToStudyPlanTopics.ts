import type { SelectedSubject, Subject } from "@/components/dashboard/goal/type";

export type StudyPlanTopicTuple = {
  subject: string;
  system: string;
  topic: string;
  subtopic: string;
};

const topicKey = (t: StudyPlanTopicTuple) =>
  `${t.subject}__${t.system}__${t.topic}__${t.subtopic}`;

/**
 * Expand the Goal's selected subjects/systems/topics/subtopics into the
 * `topics[]` payload expected by `POST /ai_part/create-study-plan`.
 *
 * Rules:
 * - If explicit subtopics are chosen for a topic, use only those subtopics.
 * - Else, if the topic has subtopics, expand to all subtopics.
 * - Else, emit a topic-only tuple with `subtopic=""`.
 * - `fullSubject` / `fullSystem` / `fullTopic` expand to full scope using the tree.
 */
export function goalToStudyPlanTopics(
  selectedSubjects: SelectedSubject[] | undefined,
  tree: Subject[],
): StudyPlanTopicTuple[] {
  const out: StudyPlanTopicTuple[] = [];
  const selected: SelectedSubject[] = Array.isArray(selectedSubjects)
    ? selectedSubjects
    : [];

  for (const selSub of selected) {
    const subjectName = selSub.subjectName;
    if (!subjectName) continue;
    const subject = tree.find((s) => s.name === subjectName);
    if (!subject) continue;

    const fullSubject = Boolean((selSub as any).fullSubject);

    const systemsToUse =
      fullSubject
        ? subject.systems.map((sys) => ({
            systemName: sys.name,
            fullSystem: true,
            topics: [],
          }))
        : Array.isArray((selSub as any).systems) && (selSub as any).systems.length
          ? (selSub as any).systems
          : (selSub.systemNames ?? []).map((sysName) => ({
              systemName: sysName,
              fullSystem: true,
              topics: [],
            }));

    for (const selSys of systemsToUse) {
      const systemName = selSys.systemName;
      if (!systemName) continue;
      const system = subject.systems.find((s) => s.name === systemName);
      if (!system) continue;

      const fullSystem = Boolean(selSys.fullSystem);
      const selectedTopics =
        fullSystem || !Array.isArray(selSys.topics) || selSys.topics.length === 0
          ? system.topics.map((t) => ({
              topicName: t.topicName,
              fullTopic: true,
              subTopicNames: [...(t.subTopics ?? [])],
            }))
          : selSys.topics;

      for (const selTopic of selectedTopics) {
        const topicName = selTopic.topicName;
        if (!topicName) continue;
        const topic = system.topics.find((t) => t.topicName === topicName);
        if (!topic) continue;

        const fullTopic = Boolean(selTopic.fullTopic);
        const subTopics = Array.isArray(topic.subTopics) ? topic.subTopics : [];
        const pickedSubTopics = Array.isArray(selTopic.subTopicNames)
          ? selTopic.subTopicNames
          : [];

        if (!fullTopic && pickedSubTopics.length > 0) {
          for (const st of pickedSubTopics) {
            out.push({
              subject: subjectName,
              system: systemName,
              topic: topicName,
              subtopic: st,
            });
          }
        } else if (subTopics.length > 0) {
          for (const st of subTopics) {
            out.push({
              subject: subjectName,
              system: systemName,
              topic: topicName,
              subtopic: st,
            });
          }
        } else {
          out.push({
            subject: subjectName,
            system: systemName,
            topic: topicName,
            subtopic: "",
          });
        }
      }
    }
  }

  return Array.from(new Map(out.map((t) => [topicKey(t), t])).values());
}


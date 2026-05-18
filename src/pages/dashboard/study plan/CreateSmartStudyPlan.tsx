/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import DashboardHeading from "@/components/reusable/DashboardHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Atom } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  useCreateStudyPlanMutation,
  useUpdateStudyPlanMutation,
} from "@/store/features/studyPlan/studyPlan.api";
import { useGetMCQBankTreeQuery } from "@/store/features/MCQBank/MCQBank.api";
import { toast } from "sonner";
import type { SelectedSubject, Subject } from "@/components/dashboard/goal/type";
import { SubjectTreeSelector } from "@/components/dashboard/goal/SubjectTreeSelector";
import { useSubjectTreeSelection } from "@/components/dashboard/goal/useSubjectTreeSelection";
import { goalToStudyPlanTopics } from "@/utils/goalToStudyPlanTopics";

/** Best-effort restore coverage when selection_snapshot is missing */
function topicsRowsToSelectedSubjects(
  rows: Array<{ subject?: string; system?: string; topic?: string; subtopic?: string }>,
): SelectedSubject[] {
  const bySubject = new Map<string, SelectedSubject>();
  for (const row of rows ?? []) {
    const s = String(row?.subject ?? "").trim();
    const sysName = String(row?.system ?? "").trim();
    if (!s || !sysName) continue;
    let subj = bySubject.get(s);
    if (!subj) {
      subj = {
        subjectName: s,
        systemNames: [],
        systems: [],
        fullSubject: false,
      };
      bySubject.set(s, subj);
    }
    if (!subj.systemNames.includes(sysName)) {
      subj.systemNames.push(sysName);
    }
    let sys = subj.systems?.find((x) => x.systemName === sysName);
    if (!sys) {
      sys = { systemName: sysName, topics: [], fullSystem: false };
      subj.systems = [...(subj.systems ?? []), sys];
    }
    const tName = String(row?.topic ?? "").trim();
    const st = String(row?.subtopic ?? "").trim();
    let topic = sys.topics.find((t) => t.topicName === tName);
    if (!topic) {
      topic = {
        topicName: tName,
        subTopicNames: st ? [st] : [],
        fullTopic: false,
      };
      sys.topics.push(topic);
    } else if (st && !topic.subTopicNames.includes(st)) {
      topic.subTopicNames.push(st);
    }
  }
  return Array.from(bySubject.values());
}

export default function CreateSmartStudyPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const editState = location.state as { mode?: "edit"; plan?: any } | undefined;
  const editPlan = editState?.plan;
  const isEdit = editState?.mode === "edit" && Boolean(editPlan?._id);

  const [createStudyPlan, { isLoading }] = useCreateStudyPlanMutation();
  const [updateStudyPlan, { isLoading: isUpdating }] =
    useUpdateStudyPlanMutation();
  const { data: treeData, isLoading: isTreeLoading } = useGetMCQBankTreeQuery(
    {},
  );

  const availableSubjects: Subject[] =
    treeData?.data?.map((subject: any) => ({
      name: subject.subjectName,
      systems: (subject.systems || []).map((system: any) => ({
        name: system.name || system.systemName, // Backend data key check karjo
        topics: (system.topics || []).map((topic: any) => ({
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

  const seededPlanIdRef = useRef<string | null>(null);

  const [title, setTitle] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [examDate, setExamDate] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const clearError = (field: string) => {
    setErrors((prev) => prev.filter((item) => item !== field));
  };

  const totalSystems = selectedSubjects.reduce(
    (t, s) => t + (s.systems?.length ?? 0),
    0,
  );

  useEffect(() => {
    if (!isEdit) {
      seededPlanIdRef.current = null;
      return;
    }
    if (!editPlan?._id || availableSubjects.length === 0) return;
    if (seededPlanIdRef.current === editPlan._id) return;
    seededPlanIdRef.current = editPlan._id;

    setTitle(String(editPlan.title ?? editPlan.exam_name ?? "").trim());
    setDailyTime(String(editPlan.daily_study_time ?? ""));
    setStartDate(
      typeof editPlan.start_date === "string"
        ? editPlan.start_date.split("T")[0]
        : "",
    );
    setExamDate(
      typeof editPlan.exam_date === "string"
        ? editPlan.exam_date.split("T")[0]
        : "",
    );

    const snap = editPlan.selection_snapshot;
    if (Array.isArray(snap) && snap.length > 0) {
      setSelectedSubjects(snap as SelectedSubject[]);
    } else {
      const fromTopics = topicsRowsToSelectedSubjects(editPlan.topics ?? []);
      if (fromTopics.length > 0) {
        setSelectedSubjects(fromTopics);
        toast.warning(
          "Coverage couldn't be fully restored from this plan. Please review your selections.",
        );
      }
    }
  }, [
    isEdit,
    editPlan,
    availableSubjects.length,
    setSelectedSubjects,
  ]);

  const isBusy = isLoading || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    const parsedTime = Number(dailyTime);

    if (!title.trim()) newErrors.push("title");
    if (!parsedTime || parsedTime <= 0) newErrors.push("dailyTime");
    if (!startDate) newErrors.push("startDate");
    if (!examDate) newErrors.push("examDate");
    if (startDate && examDate && new Date(startDate) > new Date(examDate)) {
      newErrors.push("startDate");
      newErrors.push("examDate");
      toast.error("Start date must be before or equal to finish date");
    }
    const todayString = new Date().toISOString().split("T")[0];
    if (examDate && examDate < todayString) newErrors.push("examDate");
    if (selectedSubjects.length === 0 || totalSystems === 0) {
      newErrors.push("subjects");
      toast.error("Select at least one subject with systems or full coverage");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      if (!newErrors.includes("subjects")) {
        toast.error("Please fill in all required fields");
      }
      return;
    }

    const selectionSnapshot = selectedSubjects.map((s) => ({
      subjectName: s.subjectName,
      systemNames: s.systemNames,
      systems: s.systems ?? [],
      fullSubject: s.fullSubject ?? false,
    }));

    const topics = goalToStudyPlanTopics(
      selectionSnapshot as any,
      availableSubjects,
    );
    if (!topics.length) {
      toast.error("Could not build topics from your selection");
      return;
    }

    const examName = title.trim();

    try {
      if (isEdit && editPlan?._id) {
        await updateStudyPlan({
          planId: editPlan._id,
          title: examName,
          exam_name: examName,
          start_date: startDate,
          exam_date: examDate,
          daily_study_time: parsedTime,
          exam_type: "",
          topics,
          selection_snapshot: selectionSnapshot,
          created_from: "smart_study_planner",
        }).unwrap();
        navigate("/dashboard/smart-study-plan", { replace: true });
        return;
      }

      const response: any = await createStudyPlan({
        title: examName,
        exam_name: examName,
        start_date: startDate,
        exam_date: examDate,
        daily_study_time: parsedTime,
        exam_type: "",
        topics,
        selection_snapshot: selectionSnapshot,
        created_from: "smart_study_planner",
      }).unwrap();

      const planId = response?.data?._id ?? response?._id;
      if (planId) {
        navigate(`/dashboard/weekly-plan/${planId}`);
      } else {
        toast.error("Failed to retrieve study plan ID");
      }
    } catch (error) {
      console.error("Create plan error:", error);
      toast.error(
        isEdit ? "Failed to update study plan" : "Failed to create study plan",
      );
    }
  };

  if (isTreeLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading subject tree…</div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link to="/dashboard/smart-study-plan" className="mb-7">
          <ArrowLeft />
        </Link>
        <DashboardHeading
          title={isEdit ? "Edit Smart Study Plan" : "Create Smart Study Plan"}
          titleSize="text-xl"
          description={
            isEdit
              ? "Update your coverage, schedule, or daily hours. Progress is preserved where tasks still match."
              : "Choose coverage and generate a dedicated plan with its own chat thread"
          }
          className="mt-12 mb-12 space-y-1"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-1 md:p-6"
      >
        <div className="p-6 border rounded-xl border-black/10 bg-white h-fit">
          <h3 className="text-lg font-semibold mb-2">Plan details</h3>
          <p className="text-sm text-gray-500 mb-4">
            Name your plan and set your study window
          </p>

          <div className="grid grid-cols-1 gap-6 py-4">
            <div className="grid gap-2">
              <Label
                className={errors.includes("title") ? "text-red-500" : ""}
              >
                Plan title
              </Label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearError("title");
                }}
                placeholder="e.g., Cardiology sprint"
                className={
                  errors.includes("title") ? "border-red-500 bg-red-50" : ""
                }
              />
            </div>

            <div className="grid gap-2">
              <Label
                className={errors.includes("dailyTime") ? "text-red-500" : ""}
              >
                Daily study time (hours)
              </Label>
              <Input
                type="number"
                min={0}
                max={12}
                value={dailyTime}
                onChange={(e) => {
                  setDailyTime(e.target.value);
                  clearError("dailyTime");
                }}
                className={
                  errors.includes("dailyTime")
                    ? "border-red-500 bg-red-50"
                    : ""
                }
              />
            </div>

            <div className="grid gap-2">
              <Label
                className={errors.includes("startDate") ? "text-red-500" : ""}
              >
                Start date
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  clearError("startDate");
                }}
                className={
                  errors.includes("startDate")
                    ? "border-red-500 bg-red-50"
                    : ""
                }
              />
            </div>

            <div className="grid gap-2">
              <Label
                className={errors.includes("examDate") ? "text-red-500" : ""}
              >
                Finish date
              </Label>
              <Input
                type="date"
                min={startDate || undefined}
                value={examDate}
                onChange={(e) => {
                  setExamDate(e.target.value);
                  clearError("examDate");
                }}
                className={
                  errors.includes("examDate")
                    ? "border-red-500 bg-red-50"
                    : ""
                }
              />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-xl border-black/10 bg-white flex flex-col gap-4">
          <SubjectTreeSelector
            availableSubjects={availableSubjects}
            selectedSubjects={selectedSubjects}
            onSubjectToggle={handleSubjectToggle}
            onFullSubjectToggle={handleFullSubjectToggle}
            onSystemToggle={handleSystemToggle}
            onFullSystemToggle={handleFullSystemToggle}
            onTopicToggle={handleTopicToggle}
            onFullTopicToggle={handleFullTopicToggle}
            onSubTopicToggle={handleSubTopicToggle}
            heading="Coverage"
            description="Select subjects, systems, and topics — or use Cover Full Subject / system"
            scrollClassName="max-h-[min(420px,50vh)]"
          />

          {errors.includes("subjects") && (
            <p className="text-sm text-red-600">Select at least one system or full subject.</p>
          )}

          <button
            disabled={isBusy}
            type="submit"
            className="w-full flex justify-center gap-4 bg-blue-main text-white py-2 rounded-lg disabled:opacity-60"
          >
            <Atom className={isBusy ? "animate-spin" : ""} />
            {isBusy
              ? isEdit
                ? "Updating…"
                : "Generating…"
              : isEdit
                ? "Update plan"
                : "Generate plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

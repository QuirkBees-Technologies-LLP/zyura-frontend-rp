import { useEffect, useState } from "react";
import DashboardHeading from "@/components/reusable/DashboardHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Atom } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateStudyPlanMutation } from "@/store/features/studyPlan/studyPlan.api";
import { useGetMCQBankTreeQuery } from "@/store/features/MCQBank/MCQBank.api";
import { toast } from "sonner";

interface Topic {
  topicName: string;
  subTopics: string[];
}

interface System {
  name: string;
  topics: Topic[];
}

interface SubjectTree {
  _id: string;
  subjectName: string;
  systems: System[];
}

export default function CreateStudyPlan() {
  const navigate = useNavigate();

  const [createStudyPlan, { isLoading }] = useCreateStudyPlanMutation();
  const { data: treeData } = useGetMCQBankTreeQuery({});

  const allSubjects: SubjectTree[] = treeData?.data || [];
  const subjects: SubjectTree[] = allSubjects;

  const [examName, setExamName] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [examDate, setExamDate] = useState("");
  const [subject, setSubject] = useState("");
  const [system, setSystem] = useState("");
  const [topic, setTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const clearError = (field: string) => {
    setErrors((prev) => prev.filter((item) => item !== field));
  };

  const selectedSubjectObj = subjects.find((s) => s.subjectName === subject);
  const systemList = selectedSubjectObj?.systems || [];
  const selectedSystemObj = systemList.find((sys) => sys.name === system);
  const topicList = selectedSystemObj?.topics || [];
  const selectedTopicObj = topicList.find((t) => t.topicName === topic);
  const subTopicList = selectedTopicObj?.subTopics || [];

  useEffect(() => {
    setSystem("");
    setTopic("");
    setSubTopic("");
    if (subject) clearError("subject");
  }, [subject]);

  useEffect(() => {
    setTopic("");
    setSubTopic("");
  }, [system]);

  useEffect(() => {
    setSubTopic("");
  }, [topic]);

  useEffect(() => {
    if (!systemList.find((s) => s.name === system)) {
      setSystem("");
    }
  }, [systemList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: string[] = [];
    const parsedTime = Number(dailyTime);

    if (!examName) newErrors.push("examName");
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

    if (!subject) newErrors.push("subject");
    if (!system) newErrors.push("system");
    if (!topic) newErrors.push("topic");
    if (topic && subTopicList.length > 0 && !subTopic) newErrors.push("subTopic");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      exam_name: examName,
      start_date: startDate,
      exam_date: examDate,
      daily_study_time: parsedTime,
      exam_type: "",
      topics: [{ subject, system, topic, subtopic: subTopic }],
    };

    try {
      const response: any = await createStudyPlan(payload).unwrap();
      const planId = response?.data?._id || response?._id;
      if (planId) {
        navigate(`/dashboard/weekly-plan/${planId}`);
      } else {
        toast.error("Failed to retrieve study plan ID");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      toast.error("Failed to create study plan");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link to={"/dashboard/smart-study"} className="mb-7">
          <ArrowLeft />
        </Link>
        <DashboardHeading
          title="Create New Preference"
          titleSize="text-xl"
          description="Your roadmap to organized and effective studying"
          className="mt-12 mb-12 space-y-1"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-1 md:p-6"
      >
        {/* Left Side */}
        <div className="p-6 border rounded-xl border-black/10 bg-white">
          <h3 className="text-lg font-semibold mb-2">Exam Information</h3>
          <p className="text-sm text-gray-500 mb-4">
            Set up your exam details and timeline
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2 col-span-1 lg:col-span-2">
              <Label className={errors.includes("examName") ? "text-red-500" : ""}>
                Exam Name
              </Label>
              <Input
                value={examName}
                onChange={(e) => { setExamName(e.target.value); clearError("examName"); }}
                placeholder="e.g., Gastroenterology Exam"
                className={errors.includes("examName") ? "border-red-500 bg-red-50" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label className={errors.includes("dailyTime") ? "text-red-500" : ""}>
                Daily Study Time (hours)
              </Label>
              <Input
                type="number"
                min="0"
                max={12}
                value={dailyTime}
                onChange={(e) => { setDailyTime(e.target.value); clearError("dailyTime"); }}
                className={errors.includes("dailyTime") ? "border-red-500 bg-red-50" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label className={errors.includes("startDate") ? "text-red-500" : ""}>
                Start Date
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); clearError("startDate"); }}
                className={errors.includes("startDate") ? "border-red-500 bg-red-50" : ""}
              />
            </div>

            <div className="grid gap-2">
              <Label className={errors.includes("examDate") ? "text-red-500" : ""}>
                Finish Date
              </Label>
              <Input
                type="date"
                min={startDate || undefined}
                value={examDate}
                onChange={(e) => { setExamDate(e.target.value); clearError("examDate"); }}
                className={errors.includes("examDate") ? "border-red-500 bg-red-50" : ""}
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-6 border rounded-xl border-black/10 bg-white flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Topics to Cover</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label className={errors.includes("subject") ? "text-red-500" : ""}>
                Subject
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((sub) => (
                    <SelectItem key={sub._id} value={sub.subjectName}>
                      {sub.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className={errors.includes("system") ? "text-red-500" : ""}>
                System
              </Label>
              <Select value={system} onValueChange={setSystem} disabled={!subject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select System" />
                </SelectTrigger>
                <SelectContent>
                  {systemList.map((sys) => (
                    <SelectItem key={sys.name} value={sys.name}>
                      {sys.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className={errors.includes("topic") ? "text-red-500" : ""}>
                Topic
              </Label>
              <Select value={topic} onValueChange={setTopic} disabled={!system}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  {topicList.map((t) => (
                    <SelectItem key={t.topicName} value={t.topicName}>
                      {t.topicName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className={errors.includes("subTopic") ? "text-red-500" : ""}>
                Sub-Topic
              </Label>
              <Select value={subTopic} onValueChange={setSubTopic} disabled={!topic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sub-Topic" />
                </SelectTrigger>
                <SelectContent>
                  {subTopicList.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full flex justify-center gap-4 bg-blue-main text-white py-2 rounded-lg"
          >
            <Atom className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Generating..." : "Generate Preference"}
          </button>
        </div>
      </form>
    </div>
  );
}
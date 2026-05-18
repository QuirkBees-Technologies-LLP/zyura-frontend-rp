import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cloud, X, Zap } from "lucide-react";
import { toast } from "sonner";
import { useGenerateMCQWithFileMutation } from "@/store/features/MCQBank/MCQBank.api";
import { useNavigate } from "react-router-dom";
import { Controller, useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// =======================
// Zod Schema (RESTORED from old code with duration)
// =======================
const quizSchema = z.object({
  difficulty: z.enum(["Basic", "Intermediate", "Advance"]),
  questionCount: z
    .number()
    .min(1, "At least 1 question is required")
    .max(50, "Max 50 questions"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
});

type QuizFormValues = z.infer<typeof quizSchema>;

interface QuizGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizGenerator({ isOpen, onClose }: QuizGeneratorProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [files, setFiles] = useState<File[]>([]); // Using 'files' to match old code
  const [note, setNote] = useState(""); // Using 'note' to match old code
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const [quizTitle, setQuizTitle] = useState(""); // New state for quiz title

  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [generateMCQWithFile, { isLoading }] = useGenerateMCQWithFileMutation();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema) as Resolver<QuizFormValues>,
    defaultValues: {
      questionCount: 10, // RESTORED: Old default was 10
      duration: 40, // RESTORED: Old default was 40
      difficulty: "Basic",
    },
  });

  // Reset when modal opens (RESTORED from old code)
  useEffect(() => {
    if (isOpen) {
      reset({
        questionCount: 5, // RESTORED: Reset to 5 as per old code
        duration: 10, // RESTORED: Reset to 10 as per old code
        difficulty: "Basic",
      });
    }
  }, [isOpen, reset]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf",
    );

    console.log("SELECTED FILES:", selectedFiles);

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    if (isLoading) return; // prevent closing while generating
    setFiles([]);
    setNote("");
    reset({
      questionCount: 5,
      duration: 10,
      difficulty: "Basic",
    });
    onClose();
  };

  // =======================
  // API CALL INSIDE MODAL (RESTORED from old code)
  // =======================
  const onFormSubmit = async (data: QuizFormValues) => {
    try {
      // RESTORED: Old validation logic - allows file OR note OR both
      if (files.length === 0 && !note.trim()) {
        console.log("FILES STATE:", files);

        toast.error("Please upload a file or enter a prompt.");

        return;
      }

      const formData = new FormData();

      // RESTORED: Append file if available (works with prompt too)
      if (files && files.length > 0) {
        // Appending the first file as per API requirement
        formData.append("file", files[0]);
      }

      const difficultyPromptMap = {
        Basic:
          "Generate beginner-level MCQs with simple conceptual questions and easy difficulty.",

        Intermediate:
          "Generate intermediate-level MCQs with moderate conceptual difficulty, analytical thinking, and practical understanding.",

        Advance:
          "Generate advanced-level MCQs with high complexity, deep conceptual understanding, critical thinking, and scenario-based questions.",
      };

      const finalPrompt = `
        ${note || "Generate MCQ"}

        Difficulty Level: ${data.difficulty}

        Instructions:
        ${difficultyPromptMap[data.difficulty]}
        Generate exactly ${data.questionCount} multiple-choice questions.
        `;

      const jsonData = {
        prompt: finalPrompt,
        d_level: data.difficulty,
        q_count: data.questionCount,
        quiz_name: quizTitle,
        duration: data.duration,
      };

      formData.append("data", JSON.stringify(jsonData));

      const res = await generateMCQWithFile(formData).unwrap();
      console.log("Response from AI:", res);

      // Assume res.data contains the questions array or is the array itself
      // If the backend returns something like { data: [...] }
      // const questionsArray = res.data || res;

      // if (Array.isArray(questionsArray)) {
      if (res.success) {
        const quizId = res.data?._id || res._id;
        console.log(
          "Quiz Generated and stored in Redux. Redirecting to ID:",
          quizId,
        );
        handleClose();
        navigate(
          `/dashboard/quiz/${quizId}?duration=${data.duration * 60}&limit=${data.questionCount}`,
        );
      } else {
        console.error(
          "Invalid response format: expected an array of questions",
        );
        toast.error("Failed to generate quiz. Please try again.");
      }
    } catch (error) {
      console.error("Quiz generation failed", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] p-5">
        <DialogHeader>
          <DialogTitle>Generate Quiz</DialogTitle>
          <DialogDescription>
            Make your quiz from your uploaded files and prompt using AI.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="w-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-fit mx-auto p-1 mb-3 bg-gray-200 h-auto border-b border-gray-100 rounded-sm overflow-hidden">
              <TabsTrigger
                value="upload"
                className="!bg-transparent w-fit rounded-sm !text-gray-700 border-b-4 border-transparent py-3 hover:bg-gray-50 data-[state=active]:!bg-[#0A5BB8] data-[state=active]:!text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none"
              >
                Upload Media
              </TabsTrigger>
              <TabsTrigger
                value="prompt"
                className="!bg-transparent w-fit rounded-sm !text-gray-700 border-b-4 border-transparent py-3 hover:bg-gray-50 data-[state=active]:!bg-[#0A5BB8] data-[state=active]:!text-white data-[state=active]:border-b-0 data-[state=active]:shadow-none"
              >
                AI Prompt
              </TabsTrigger>
            </TabsList>

            {/* Upload Media Tab */}
            <TabsContent value="upload" className="space-y-3">
              <p className="text-center text-gray-600 text-sm mb-4">
                Upload images to generate AI-powered quizzes
              </p>

              <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                }`}
              >
                <Cloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-700 font-medium mb-1">
                  Drag and Drop or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Browse
                  </button>{" "}
                  to upload
                </p>
                <p className="text-gray-500 text-sm">Support: JPG, PNG, PDF</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => {
                    const uploadedFiles = Array.from(e.target.files || []);

                    console.log("UPLOADED FILES:", uploadedFiles);

                    setFiles(uploadedFiles);
                  }}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Uploaded Files:
                  </p>
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">
                          📄
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* AI Prompt Tab */}
            <TabsContent value="prompt" className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Write a prompt for generate quiz (example: generate mcq on
                  anatomy)
                </label>
                <textarea
                  placeholder="Ask me anything! make your quiz"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quiz Title</label>

            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="w-full border rounded-lg px-3 py-2 outline-none"
            />
          </div>

          {/* Difficulty, Question Count & Duration (RESTORED 3 fields from old code) */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* Difficulty */}
            <div className="grid gap-2">
              <Label className="text-[#5A7183]">Difficulty</Label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={errors.difficulty ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select Difficulty" />
                    </SelectTrigger>
                    <SelectContent className="border border-slate-300">
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advance">Advance</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.difficulty && (
                <p className="text-xs text-red-500">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            {/* Question Count */}
            <div className="grid gap-2">
              <Label className="text-[#5A7183]">Question count(Upto 50)</Label>
              <Input
                type="number"
                min={1}
                max={50}
                {...register("questionCount", { valueAsNumber: true })}
                className={errors.questionCount ? "border-red-500" : ""}
              />
              {errors.questionCount && (
                <p className="text-xs text-red-500">
                  {errors.questionCount.message}
                </p>
              )}
            </div>
          </div>

          {/* RESTORED: Duration field (was missing in new design) */}
          <div className="grid gap-2 mt-2">
            <Label className="text-[#5A7183]">Duration (minutes)</Label>
            <Input
              type="number"
              min={1}
              {...register("duration", { valueAsNumber: true })}
              className={errors.duration ? "border-red-500" : ""}
            />
            {errors.duration && (
              <p className="text-xs text-red-500">{errors.duration.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <DialogFooter className="mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-brand text-white hover:bg-violet-800"
              disabled={isLoading}
            >
              <Zap
                className={`mr-2 h-4 w-4 fill-white ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "Generating..." : "Generate Quiz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

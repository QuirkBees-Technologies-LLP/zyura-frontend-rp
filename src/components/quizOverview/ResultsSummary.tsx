import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  CheckCheck,
  ClipboardList,
  Clock3,
  XCircle,
} from "lucide-react";

import CompleteExam from "../../assets/dashboard/Completed-exam.png";

interface ResultsSummaryProps {
  completed: number;
  total: number;
  correct: number;
  incorrect: number;
  quizId?: string;
  justSubmitted?: boolean;
  isExamMode?: boolean;
  trackingData?: {
    timeTaken?: string;
  };
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  completed = 0,
  total = 0,
  correct = 0,
  incorrect = 0,
  quizId,
  justSubmitted,
  isExamMode,
  trackingData,
}) => {
  const navigate = useNavigate();

  const correctPercentage =
    total > 0 ? Math.round((correct / total) * 100) : 0;

  const incorrectPercentage =
    total > 0 ? Math.round((incorrect / total) * 100) : 0;

  const stats = [
    {
      id: 1,
      icon: ClipboardList,
      value: completed,
      label: "Completed",
      iconBg: "bg-brand/10",
      iconColor: "text-brand",
    },
    {
      id: 2,
      icon: CheckCheck,
      value: correct,
      label: "Correct",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: 3,
      icon: XCircle,
      value: incorrect,
      label: "Wrong",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      id: 4,
      icon: Clock3,
      value: trackingData?.timeTaken || "00:00",
      label: "Total time spent",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 bg-gray-50">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        {/* Top Illustration */}
        {/* <div className="mb-10 flex items-center justify-center">
          <img
            src={CompleteExam}
            alt="Result Illustration"
            className="h-[180px] w-[280px] rounded-xl object-contain sm:h-[320px] sm:w-[440px]"
          />
        </div> */}

        {/* Stats Cards */}
        <div className="grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-xl text-center border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div
                  className={`mb-5 flex h-12 w-12 mx-auto items-center justify-center rounded-2xl ${item.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>

                <h3 className="text-3xl font-semibold text-[#3e4450]">
                  {item.value}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Result Heading */}
        <div className="mt-12 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#7b808c] sm:text-4xl">
            You completed {completed}/{total} questions.
          </h1>
        </div>

        {/* Answer Section */}
        <div className="mt-10 w-full max-w-md text-center">
          <h2 className="mb-8 text-2xl font-medium text-[#7b808c]">
            You answered
          </h2>

          <div className="space-y-6">
            {/* Correct */}
            <div className="flex items-center justify-center gap-4 text-left">
              <div className="h-5 w-5 rounded-full bg-green-500" />

              <p className="text-sm text-gray-500 sm:text-base">
                {correctPercentage}% correctly ({correct} questions)
              </p>
            </div>

            {/* Incorrect */}
            <div className="flex items-center justify-center gap-4 text-left">
              <div className="h-5 w-5 rounded-full bg-red-500" />

              <p className="text-sm text-gray-500 sm:text-base">
                {incorrectPercentage}% incorrectly ({incorrect} questions)
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/dashboard/quiz/${quizId}?mode=review&limit=${total}${
                isExamMode ? "&source=exam" : ""
              }`}
              state={{ justSubmitted }}
            >
              <Button
                variant="outline"
                className="h-11 px-6 border-slate-300 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
              >
                Review Session
              </Button>
            </Link>

            <Button
              onClick={() =>
                navigate(
                  isExamMode
                    ? "/dashboard/mcq-bank"
                    : "/dashboard/quiz-page",
                )
              }
              className="rounded-lg bg-brand px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#0047a1]"
            >
              Back to {isExamMode ? "MCQ Bank" : "Quiz Generator"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;
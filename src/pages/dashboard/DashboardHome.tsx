import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/features/auth/auth.slice";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  Download,
  DollarSign,
  UserRound,
  FileText,
  EllipsisVertical,
  // Ellipsis,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import OverviewSection from "@/components/dashboard_new/OverviewSection";
import { useGetGoalOverviewQuery } from "@/store/features/goal/goal.api";
// import DailyChallenge from "@/components/dashboard_new/DailyChallenge";
// import PerformanceBySubject from "@/components/dashboard_new/PerformanceBySubject";
// import WeeklyLeaderboard from "@/components/dashboard_new/WeeklyLeaderboard";
// import DailyChallenge from "@/components/dashboard_new/DailyChallenge";
// import MedicalStudyGoalTracker from "./MedicalStudyGoalTracker";
// import ChatInterface from "@/components/dashboard_new/message";

const DATE_RANGE_OPTIONS = [
  "Today",
  "Last 7 days",
  "Last 14 days",
  "Last 30 days",
];

const DateRangeDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#eceef3] bg-white px-3 py-2 text-sm text-[#667084]"
      >
        <Calendar className="h-4 w-4" />
        {value}
        <ChevronDown
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 min-w-[170px] overflow-hidden rounded-xl border border-[#eceef3] bg-white shadow-lg">
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition ${
                value === option
                  ? "bg-[#edf3ff] text-[#205db4]"
                  : "text-[#667084] hover:bg-[#f6f8fc]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [topDateRange, setTopDateRange] = useState("Last 7 days");
  const [quizDateRange, setQuizDateRange] = useState("19 Aug - 25 Aug");
  const [clinicalDateRange, setClinicalDateRange] = useState("19 Aug - 25 Aug");
  const [leaderboardDateRange, setLeaderboardDateRange] =
    useState("19 Aug - 25 Aug");
  const [activeNoteMenu, setActiveNoteMenu] = useState<number | null>(null);

  const user = useSelector(selectUser);
  const { data: overviewData } = useGetGoalOverviewQuery();

  const displayName = [user?.profile?.firstName, user?.profile?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const overallAccuracy = Math.round(overviewData?.data?.progress?.overall ?? 0);
  const totalStudyHours = overviewData?.data?.timeCount?.todayStudy ?? 0;
  const currentStreak = overviewData?.data?.steak ?? 0;
  const currentStreakLabel =
    currentStreak < 10 ? `0${currentStreak}` : String(currentStreak);

  const quizData = [
    { day: "Mon", correct: 340, wrong: 190 },
    { day: "Tue", correct: 260, wrong: 110 },
    { day: "Wed", correct: 380, wrong: 250 },
    { day: "Thu", correct: 260, wrong: 190 },
    { day: "Fri", correct: 370, wrong: 210 },
    { day: "Sat", correct: 330, wrong: 185 },
    { day: "Sun", correct: 225, wrong: 155 },
  ];

  const clinicalData = [
    { day: "Mon", value: 45, color: "#23A044" },
    { day: "Tue", value: 12, color: "#F4DEDE" },
    { day: "Wed", value: 37, color: "#23A044" },
    { day: "Thu", value: 22, color: "#F0E9D6" },
    { day: "Fri", value: 30, color: "#23A044" },
    { day: "Sat", value: 52, color: "#23A044", marked: true },
    { day: "Sun", value: 18, color: "#F0E9D6" },
  ];

  const leaderboardData = [
    {
      name: "Regina Cooper",
      rank: "#01",
      student: "Dermatologists",
      points: 78,
    },
    {
      name: "Robert Edwards",
      rank: "#02",
      student: "Cardiologists",
      points: 77,
    },
    {
      name: "Gloria Mckinney",
      rank: "#03",
      student: "Endocrinologists",
      points: 73,
    },
    {
      name: "Randall Fisher",
      rank: "#04",
      student: "Gastroenterologists",
      points: 72,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const notesData = [
    {
      id: 1,
      title: "Cardiology Notes",
    },
    {
      id: 2,
      title: "Neurology Revision",
    },
    {
      id: 3,
      title: "Pharmacology Summary",
    },
    {
      id: 4,
      title: "Anatomy Quick Guide",
    },
  ];

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveNoteMenu(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      className="my-6 md:my-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Goal Tracker */}
      <motion.div variants={itemVariants} className="mb-8">
        {/* <MedicalStudyGoalTracker /> */}
      </motion.div>

      {/* Overview Section */}
      <motion.div
        variants={itemVariants}
        viewport={{ once: true, margin: "-100px" }}
        whileInView="visible"
        initial="hidden"
      >
        <OverviewSection />
      </motion.div>

      {/* Smart Study Plan (commented out temporarily) */}
      {/*
        <motion.div
          variants={itemVariants}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
          initial="hidden"
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-6"
        >
          <SmartStudyPlan />
        </motion.div>
      */}

      {/* Daily Challenge + Weekly Leaderboard */}
      <motion.div
        variants={itemVariants}
        viewport={{ once: true, margin: "-100px" }}
        whileInView="visible"
        initial="hidden"
        // className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
      >
        {/* <PerformanceBySubject /> */}
        {/* <DailyChallenge />
        <WeeklyLeaderboard /> */}
      </motion.div>

      {/* Highlights of the Week (commented out temporarily) */}
      {/*
        <motion.div
          variants={itemVariants}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
          initial="hidden"
          className="mb-6"
        >
          <WeeklyHighlights />
        </motion.div>
      */}

      <motion.section
        variants={itemVariants}
        viewport={{ once: true, margin: "-100px" }}
        whileInView="visible"
        initial="hidden"
        className="mt-8 p-4 md:p-6"
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            {getGreeting()}, {displayName || "Michael"}
          </h2>
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-[#ebeef3] bg-white text-[#666f80]">
              <Download className="h-4 w-4" />
            </button>
            <DateRangeDropdown
              value={topDateRange}
              onChange={setTopDateRange}
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-[#e7e8ee] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-3">Overall Accuracy</p>
                <p className="mt-1 text-3xl leading-none font-semibold text-gray-700">
                  {overallAccuracy}%
                </p>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#eaf1fb] text-[#1e63bb]">
                <DollarSign className="h-9 w-9" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e7e8ee] bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-3">Total Study Time</p>
                <p className="mt-1 text-3xl leading-none font-semibold text-gray-700">
                  {totalStudyHours} hrs
                </p>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#eaf1fb] text-[#1e63bb]">
                <div className="flex items-end gap-1">
                  <span className="h-2.5 w-2 rounded-sm bg-current" />
                  <span className="h-4.5 w-2 rounded-sm bg-current" />
                  <span className="h-6.5 w-2 rounded-sm bg-current" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#e7e8ee] bg-white p-5 sm:col-span-2 xl:col-span-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-3">Current Streak</p>
                <p className="mt-1 text-3xl leading-none font-semibold text-gray-700">
                  {currentStreakLabel}
                </p>
              </div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#eaf1fb] text-[#1e63bb]">
                <UserRound className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-[#e7e8ee] bg-white p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="text-2xl font-semibold text-gray-700">
                Quiz Test
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <DateRangeDropdown
                  value={quizDateRange}
                  onChange={setQuizDateRange}
                />
              </div>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizData} barGap={-16}>
                  <CartesianGrid vertical={false} stroke="#eef0f4" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9AA1AF" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9AA1AF" }}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="correct"
                    fill="#1659B6"
                    barSize={12}
                    radius={[8, 8, 8, 8]}
                  />
                  <Bar
                    dataKey="wrong"
                    fill="#0D3A79"
                    barSize={12}
                    radius={[8, 8, 8, 8]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-end gap-6 text-sm text-[#9aa1af]">
              <span>
                <span className="mr-2 text-[#0d3a79]">●</span>Correct
              </span>
              <span>
                <span className="mr-2 text-[#1659b6]">●</span>wrong
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#e7e8ee] bg-white p-4 md:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="text-2xl font-semibold text-gray-700">
                Clinical Cases
              </h3>
              <DateRangeDropdown
                value={clinicalDateRange}
                onChange={setClinicalDateRange}
              />
            </div>

            <div className="mb-3 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-[#eca4a4]" />
                <div>
                  <div className="text-2xl text-[#414753]">21.80%</div>
                  <div className="text-xs text-[#9aa1af]">LOW</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-[#e8ce71]" />
                <div>
                  <div className="text-2xl text-[#414753]">19.40%</div>
                  <div className="text-xs text-[#9aa1af]">AVERAGE</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-[#82c996]" />
                <div>
                  <div className="text-2xl text-[#414753]">10%</div>
                  <div className="text-xs text-[#9aa1af]">HIGH</div>
                </div>
              </div>
            </div>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clinicalData}>
                  <CartesianGrid vertical={false} stroke="#eef0f4" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9AA1AF" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9AA1AF" }}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar dataKey="value" barSize={16} radius={[10, 10, 10, 10]}>
                    {clinicalData.map((entry) => (
                      <Cell key={entry.day} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          {/* Notes Section */}
          <div className="rounded-xl border border-[#e7e8ee] bg-white p-4 md:p-5 xl:col-span-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-700">
                Note&apos;s
              </h3>
            </div>

            <div className="max-h-[290px] overflow-y-auto pr-1">
              {notesData.map((note: any) => (
                <div
                  key={note.id}
                  className="relative flex items-center justify-between border-b border-[#eceef3] py-3 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#e7e8ee] bg-[#f9fbff] text-[#205db4]">
                      <FileText className="h-4 w-4" />
                    </div>

                    <p className="text-sm text-[#4a515e]">{note.title}</p>
                  </div>

                  <div
                    className="relative"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNoteMenu((prev) =>
                          prev === note.id ? null : note.id,
                        );
                      }}
                      className="rounded-md p-1 text-[#9aa1af] transition hover:bg-[#f6f8fc]"
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </button>

                    {activeNoteMenu === note.id && (
                      <div className="absolute right-0 z-20 mt-2 w-28 overflow-hidden rounded-lg border border-[#eceef3] bg-white shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            console.log("View", note);
                            setActiveNoteMenu(null);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm text-[#667084] transition hover:bg-[#f6f8fc]"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            console.log("Edit", note);
                            setActiveNoteMenu(null);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm text-[#667084] transition hover:bg-[#f6f8fc]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            console.log("Delete", note);
                            setActiveNoteMenu(null);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Section */}
          <div className="rounded-xl border border-[#e7e8ee] bg-white p-4 md:p-5 xl:col-span-8">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-2xl font-semibold text-gray-700">
                Leaderboard
              </h3>

              <DateRangeDropdown
                value={leaderboardDateRange}
                onChange={setLeaderboardDateRange}
              />
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[640px] space-y-3">
                <div className="grid grid-cols-12 px-4 text-sm text-[#9aa1af]">
                  <p className="col-span-4">Name</p>
                  <p className="col-span-2">No.</p>
                  <p className="col-span-4">Student</p>
                  <p className="col-span-2">Points</p>
                </div>

                {leaderboardData.map((user: any, index: number) => (
                  <div
                    key={user.name}
                    className="grid grid-cols-12 items-center rounded-2xl bg-[#f5f6f8] px-4 py-3"
                  >
                    <div className="col-span-4 flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/44?img=${index + 9}`}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />

                      <p className="text-[#4a515e]">{user.name}</p>
                    </div>

                    <p className="col-span-2 text-[#9aa1af]">{user.rank}</p>

                    <p className="col-span-4 text-[#4a515e]">{user.student}</p>

                    <p className="col-span-2 text-[#4a515e]">{user.points}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;

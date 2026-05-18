import { useGetFlashCardBankQuery } from "@/store/features/flashCard/flashCard.api";
import { Filter, Search } from "lucide-react";
import { useState } from "react";
import AllGeneratedFlashCard from "./AllGeneratedFlashCard";
import GeneratedFlashCard from "./GeneratedFlashCard";
import FlashCardFilterModal from "./FlashCardFilterModal";

export default function FlashCardCollection() {
  const tabs = [
    { id: "all", label: "All" },
    { id: "generated", label: "Generated" },
  ];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    system: "",
    topic: "",
  });

  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  const { data: flashcardData, isLoading: flashcardBankLoading } =
    useGetFlashCardBankQuery({
      searchTerm,
      ...filters,
      page,
      limit: 12,
    });

  const flashcardBank = flashcardData?.data;
  const meta = flashcardData?.meta;

  return (
    <div className="mt-8">

      {/* Search + Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full lg:w-auto">

          {/* Search */}
          <div className="relative w-full md:w-[450px]">
            <input
              type="text"
              placeholder="Search by condition, subject or keyword..."
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-brand outline-none transition-all placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>

          {/* Count */}
          <p className="text-sm text-slate-500 font-medium">
            <span className="text-slate-900 font-bold">
              {meta?.total || 0}
            </span>{" "}
            Flash Cards available
          </p>
        </div>

        {/* Filter */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center justify-center gap-2 bg-brand border border-slate-200 text-white px-6 py-2 h-12 rounded-xl cursor-pointer hover:bg-brand/90 hover:border-slate-300 transition-all w-full lg:w-auto font-bold shadow-sm"
        >
          <Filter className="w-4 h-4 text-white" />
          Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 my-8 items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border
              ${
                activeTab === tab.id
                  ? "bg-brand text-white border-brand shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:border-brand/30"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "all" && (
          <AllGeneratedFlashCard
            flashcardBanks={flashcardBank}
            flashcardBankLoading={flashcardBankLoading}
            meta={meta}
            page={page}
            setPage={setPage}
          />
        )}

        {activeTab === "generated" && (
          <GeneratedFlashCard
            searchTerm={searchTerm}
            filters={filters}
          />
        )}
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <FlashCardFilterModal
          close={() => setIsFilterOpen(false)}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setPage(1);
            setIsFilterOpen(false);
          }}
        />
      )}
    </div>
  );
}
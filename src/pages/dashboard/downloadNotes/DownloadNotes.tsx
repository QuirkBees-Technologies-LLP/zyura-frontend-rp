/* eslint-disable @typescript-eslint/no-explicit-any */
import Pagination from "@/common/custom/Pagination";
import DashboardHeading from "@/components/reusable/DashboardHeading";
import FilePreviewList from "@/components/reusable/FilePreview";
import FileUploader from "@/components/reusable/FileUploader";
import {
  useGetSingleUserNotesQuery,
  useGenerateNoteMutation,
} from "@/store/features/note/NoteAPI";
import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Atom,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FlashCardFilterModal from "../flashcard/FlashCardFilterModal";
import AllNotesTab from "./AllNotesTab";
import GeneratedNotes from "./GeneratedNotes";
import { useLocation, useNavigate } from "react-router-dom";

export default function DownloadNotes() {
  const location = useLocation();
  const navigate = useNavigate();

  // ── Tabs & Modals ──
  const [activeTab, setActiveTab] = useState("allNotes");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ── Create Note State ──
  const [generateNote, { isLoading }] = useGenerateNoteMutation();
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [noteName, setNoteName] = useState("");
  const [noteFormat, setNoteFormat] = useState("Bullet point");
  const [fileError, setFileError] = useState("");
  const [promptError, setPromptError] = useState("");

  // ── Search & Filter State ──
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    system: "",
    topic: "",
  });
  const [page, setPage] = useState(1);
  const limit = 6;

  // ── Effects ──
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Debounce search term (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(tempSearchTerm);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [tempSearchTerm]);

  // ── Tab Configuration ──
  const tabs = [
    { id: "allNotes", label: "All Notes" },
    { id: "generatedNotes", label: "Generated Notes" },
  ];

  // ── API Query for Notes List ──
  const { data: noteResponse, isLoading: noteLoading } =
    useGetSingleUserNotesQuery({
      searchTerm,
      subject: filters.subject,
      system: filters.system,
      topic: filters.topic,
      page,
      limit,
    });

  const noteData = noteResponse?.data;
  const totalPages = noteResponse?.meta?.totalPages || 1;
  const currentPage = noteResponse?.meta?.page || 1;

  // ── Handler: Search ──
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(tempSearchTerm);
      setPage(1);
    }
  };

  // ── Handler: Pagination ──
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Handler: Apply Filters ──
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
    setIsFilterOpen(false);
  };

  // ── Handler: Tab Change ──
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchTerm("");
    setTempSearchTerm("");
    setFilters({ subject: "", system: "", topic: "" });
    setPage(1);
  };

  // ── Computed: Active Filters Count ──
  const activeFiltersCount = [
    filters.subject,
    filters.system,
    filters.topic,
  ].filter(Boolean).length;

  // ── Handler: Close Modal & Reset Form ──
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFiles([]);
    setNote("");
    setNoteName("");
    setNoteFormat("Bullet point");
    setFileError("");
    setPromptError("");
  };

  // ── Handler: Create Note (Form Submission) ──
  const handleCreateNote = async () => {
    // Validation: At least one of file OR prompt required
    if (!files.length && !note.trim()) {
      setFileError("Please upload a file or enter a prompt");
      setPromptError("Please upload a file or enter a prompt");
      return;
    }

    // Clear previous errors
    setFileError("");
    setPromptError("");

    // Build FormData
    const formData = new FormData();

    // Only append file if it exists
    if (files.length > 0) {
      formData.append("file", files[0]);
    }

    // Append data as JSON string
    formData.append(
      "data",
      JSON.stringify({
        make_your_note: note,
        topic_name: noteName,
        note_format: noteFormat,
      })
    );

    try {
      const res = await generateNote(formData).unwrap();
      if (res.success) {
        toast.success("Note generated successfully!");
        handleCloseModal();
        navigate(`/dashboard/generated-notes/${res.data._id}`);
      }
    } catch (error: any) {
      console.error("Generate note error:", error);
      toast.error(error?.data?.message || "Failed to generate note");
    }
  };

  // ── Handler: Remove File ──
  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  // ── Handler: File Upload ──
  const handleFilesChange = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    // Clear errors when files are added
    if (newFiles.length > 0) {
      setFileError("");
      setPromptError("");
    }
  };

  // ── Handler: Note Textarea Change ──
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);
    // Clear errors when user types
    if (value.trim()) {
      setFileError("");
      setPromptError("");
    }
  };

  return (
    <div className="mb-5 px-2">
      {/* ── Page Heading ── */}
      <DashboardHeading
        title="High-Yield Medical Study Notes"
        description="Download concise, topic-focused PDF notes for anatomy, pathology, pharmacology, and more."
        className="mt-4 mb-8 space-y-2"
      />

      {/* ── Top Action Bar ── */}
      <div className="md:flex gap-5 space-y-3 justify-between items-center">
        {/* Search + Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by condition or keyword"
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full md:w-[420px] h-11 pl-10 pr-4 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#063C79]/20 focus:border-[#063C79] transition-all text-gray-700 text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="relative flex items-center gap-2 bg-white border border-slate-200 text-gray-600 px-4 py-2.5 rounded-xl cursor-pointer hover:border-[#063C79] hover:text-[#063C79] transition-colors text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#063C79] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Create Note Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#063C79] text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity font-medium text-sm"
        >
          <Plus size={18} />
          <span>Create Notes</span>
        </button>
      </div>

      {/* ── Active Filter Tags ── */}
      {(filters.subject || filters.system || filters.topic || searchTerm) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm flex items-center gap-1.5">
              Search: {searchTerm}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setTempSearchTerm("");
                  setPage(1);
                }}
                className="hover:text-blue-900"
              >
                <X size={13} />
              </button>
            </span>
          )}
          {filters.subject && (
            <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-sm flex items-center gap-1.5">
              Subject: {filters.subject}
              <button
                onClick={() => {
                  setFilters({ ...filters, subject: "" });
                  setPage(1);
                }}
                className="hover:text-green-900"
              >
                <X size={13} />
              </button>
            </span>
          )}
          {filters.system && (
            <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm flex items-center gap-1.5">
              System: {filters.system}
              <button
                onClick={() => {
                  setFilters({ ...filters, system: "" });
                  setPage(1);
                }}
                className="hover:text-purple-900"
              >
                <X size={13} />
              </button>
            </span>
          )}
          {filters.topic && (
            <span className="px-3 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-full text-sm flex items-center gap-1.5">
              Topic: {filters.topic}
              <button
                onClick={() => {
                  setFilters({ ...filters, topic: "" });
                  setPage(1);
                }}
                className="hover:text-orange-900"
              >
                <X size={13} />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchTerm("");
              setTempSearchTerm("");
              setFilters({ subject: "", system: "", topic: "" });
              setPage(1);
            }}
            className="px-3 py-1 text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            <X size={13} />
            Clear All
          </button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-6 mt-8 mb-6 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pb-3 text-sm font-semibold transition-colors duration-200 cursor-pointer border-b-2 -mb-px
              ${
                activeTab === tab.id
                  ? "border-[#063C79] text-[#063C79]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div>
        {activeTab === "allNotes" && (
          <>
            <AllNotesTab notes={noteData} loading={noteLoading} />
            {!noteLoading && totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
        {activeTab === "generatedNotes" && (
          <GeneratedNotes
            searchTerm={searchTerm}
            subject={filters.subject}
            system={filters.system}
            topic={filters.topic}
          />
        )}
      </div>

      {/* ── Filter Modal ── */}
      {isFilterOpen && (
        <FlashCardFilterModal
          close={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
        />
      )}

      {/* ── Create Note Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Create Note</h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Body – Two Column Layout */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left – File Upload Section */}
              <div
                className={`p-4 border rounded-xl bg-slate-50 ${
                  fileError ? "border-red-500" : "border-black/10"
                }`}
              >
                <FileUploader onFilesChange={handleFilesChange} />
                {fileError && (
                  <p className="text-red-500 text-sm mt-2">{fileError}</p>
                )}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-1">
                      Recent Uploads
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      Your uploaded files ready for note generation
                    </p>
                    <FilePreviewList
                      files={files}
                      onRemove={handleRemoveFile}
                    />
                  </div>
                )}
              </div>

              {/* Right – Prompt & Options */}
              <div className="space-y-4">
                {/* Prompt Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Prompt
                  </label>
                  <textarea
                    placeholder="Enter prompt (optional if file uploaded)"
                    value={note}
                    rows={4}
                    onChange={handleNoteChange}
                    className={`w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#063C79]/20 focus:border-[#063C79] transition-all resize-none ${
                      promptError ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {promptError && (
                    <p className="text-red-500 text-sm mt-1">{promptError}</p>
                  )}
                </div>

                {/* Note Name / Topic Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Note Name / Topic
                  </label>
                  <input
                    value={noteName}
                    onChange={(e) => setNoteName(e.target.value)}
                    placeholder="e.g. Cardiology Basics"
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#063C79]/20 focus:border-[#063C79] transition-all"
                  />
                </div>

                {/* Note Format Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Note Format
                  </label>
                  <select
                    value={noteFormat}
                    onChange={(e) => setNoteFormat(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#063C79]/20 focus:border-[#063C79] transition-all"
                  >
                    <option value="Bullet point">Bullet point</option>
                    <option value="Summary">Summary</option>
                    <option value="Paragraph">Paragraph</option>
                  </select>
                </div>

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={handleCreateNote}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 bg-[#063C79] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Atom className="w-4 h-4" />
                      Generate Notes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
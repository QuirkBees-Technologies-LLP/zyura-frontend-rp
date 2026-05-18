import { useGetGeneratedNoteByIdQuery } from "@/store/features/note/NoteAPI";
import { ArrowLeft, Calendar, Loader2, Download } from "lucide-react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type NoteItem = { title: string; note: string };

type StateNoteData = {
  items?: NoteItem[];
  title?: string;
  note?: string;
  createdAt?: string;
};

const downloadAsHTML = (title: string, content: string) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body {
          font-family: Georgia, serif;
          max-width: 800px;
          margin: 40px auto;
          padding: 0 20px;
          color: #1e293b;
          line-height: 1.8;
        }
        h1 { font-size: 28px; margin-bottom: 8px; color: #0f172a; }
        h2, h3 { color: #1e3a5f; margin-top: 24px; }
        p { margin: 12px 0; }
        ul, ol { padding-left: 24px; }
        li { margin: 6px 0; }
        hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
        .meta { color: #64748b; font-size: 14px; margin-bottom: 32px; }
        @media print {
          body { margin: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p class="meta">AI Generated Study Note • ${new Date().toLocaleDateString(undefined, { dateStyle: "long" })}</p>
      <hr />
      <div>${content
        .split("\n")
        .map((line) => {
          if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
          if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
          if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
          if (line.startsWith("- ")) return `<li>${line.slice(2)}</li>`;
          if (line.trim() === "") return "<br/>";
          return `<p>${line}</p>`;
        })
        .join("\n")}</div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title.replace(/\s+/g, "_")}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function GeneratedNoteDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const rawState = location.state?.noteData as StateNoteData | undefined;

  const noteItems = useMemo(() => {
    if (!rawState || !Array.isArray(rawState.items)) return null;
    const cleaned = rawState.items
      .map((it) => ({
        title: String(it?.title ?? "").trim(),
        note: String(it?.note ?? "").trim(),
      }))
      .filter((it) => it.title || it.note);
    return cleaned.length ? cleaned : null;
  }, [rawState]);

  const singleFromState =
    rawState && !noteItems && (rawState.title || rawState.note)
      ? rawState
      : null;

  const { data: noteResponse, isLoading: isNoteLoading } =
    useGetGeneratedNoteByIdQuery(id, {
      skip: Boolean(rawState),
    });

  const singleFromApi = Array.isArray(noteResponse?.data)
    ? noteResponse.data[0]
    : noteResponse?.data;

  const isLoading = !rawState && isNoteLoading;

  const fromAnalysis = location.state?.fromAnalysis;
  const quizId = location.state?.quizId;

  const handleBack = () => {
    if (fromAnalysis && quizId) {
      navigate(`/dashboard/quiz-analysis/${quizId}`);
    } else {
      navigate("/dashboard/download-notes");
    }
  };

  const handleDownload = (title: string, content: string) => {
    setIsDownloading(true);
    try {
      downloadAsHTML(title, content);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (noteItems) {
    const safeIndex = Math.min(activeTab, Math.max(0, noteItems.length - 1));
    const current = noteItems[safeIndex];

    return (
      <div className="w-full max-w-5xl mx-auto mb-3">
        <div className="flex items-center gap-3 mb-6 mt-4">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              Recommended notes
            </h1>
            <p className="text-slate-500 text-sm">
              From your missed questions ({noteItems.length} sections, max 5)
            </p>
          </div>

          {/* Download button for multi-tab notes */}
          <button
            onClick={() => handleDownload(current.title || `Note ${safeIndex + 1}`, current.note)}
            disabled={isDownloading}
            className="flex items-center gap-2 bg-[#063C79] hover:bg-[#063C79]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? "Downloading..." : "Download"}
          </button>
        </div>

        <div
          className="flex flex-wrap gap-2 mb-4 border-b border-slate-200 pb-3"
          role="tablist"
        >
          {noteItems.map((it, idx) => (
            <button
              key={`${it.title}-${idx}`}
              type="button"
              role="tab"
              aria-selected={safeIndex === idx}
              onClick={() => setActiveTab(idx)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                safeIndex === idx
                  ? "bg-amber-100 text-amber-900 ring-1 ring-amber-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {it.title || `Note ${idx + 1}`}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[60vh]">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            {current.title || `Note ${safeIndex + 1}`}
          </h2>
          <article className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {current.note}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    );
  }

  const note = singleFromState || singleFromApi;

  if (!note) {
    return (
      <div className="p-10 text-center text-gray-500">
        <h3 className="text-xl font-semibold">Note not found</h3>
        <p>The requested note could not be retrieved.</p>
        <Link
          to="/dashboard/download-notes"
          className="text-blue-500 hover:underline mt-4 inline-block"
        >
          Back to Notes
        </Link>
      </div>
    );
  }

  const createdLabel = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString(undefined, {
        dateStyle: "long",
      })
    : null;

  const noteTitle = note.title || "Generated Note";
  const noteContent = note.note || "";

  return (
    <div className="w-full max-w-5xl mx-auto mb-3">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 mt-4">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{noteTitle}</h1>
          <p className="text-slate-500 text-sm">AI Generated Study Content</p>
        </div>

        {/* Download Button */}
        <button
          onClick={() => handleDownload(noteTitle, noteContent)}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-[#063C79] hover:bg-[#063C79]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>

      {/* Note Content */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[60vh] print:shadow-none print:border-none">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 pb-4 border-b border-slate-100">
          {createdLabel ? (
            <>
              <Calendar className="w-4 h-4" />
              <span>Created on {createdLabel}</span>
              <span className="mx-2">•</span>
            </>
          ) : null}
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">
            Generated
          </span>
        </div>

        <article className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{noteContent}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
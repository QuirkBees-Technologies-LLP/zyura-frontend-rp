import { useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useSendQuestionMutation,
  useGetHistoryQuery,
  type IMessage,
} from "@/store/features/aiTutor/aiTutor.api";
import { toast } from "sonner";

type ChatMessage = { role: "user" | "ai"; content: string };

type Props = {
  threadId: string;
  onClose?: () => void;
};

export default function StudyPlanChatPanel({ threadId, onClose }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sendQuestion] = useSendQuestionMutation();
  const { data: historyData, isLoading: isHistoryLoading } = useGetHistoryQuery(
    threadId,
    { skip: !threadId, refetchOnMountOrArgChange: true },
  );

  useEffect(() => {
    if (!threadId || !historyData) return;
    const messages: ChatMessage[] = [];
    const sortedHistory = [...historyData].reverse();
    sortedHistory.forEach((item) => {
      item.messages.forEach((msg: IMessage) => {
        messages.push({
          role: msg.type === "HumanMessage" ? "user" : "ai",
          content: msg.content,
        });
      });
    });
    setDisplayMessages(messages);
  }, [historyData, threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, isWaitingForResponse]);

  const handleSend = async () => {
    if (!inputValue.trim() || !threadId) return;
    const questionText = inputValue.trim();
    setInputValue("");
    setDisplayMessages((prev) => [...prev, { role: "user", content: questionText }]);
    setIsWaitingForResponse(true);

    try {
      const responseData = await sendQuestion({
        question: questionText,
        thread_id: threadId,
      }).unwrap();
      if (responseData?.response) {
        setDisplayMessages((prev) => [
          ...prev,
          { role: "ai", content: responseData.response },
        ]);
      }
    } catch (error: unknown) {
      console.error("Study plan chat error:", error);
      toast.error("Failed to get AI response.");
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  return (
    <div className="flex flex-col border border-slate-200 rounded-xl bg-white shadow-sm h-[min(640px,70vh)] lg:sticky lg:top-24">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <MessageSquare className="w-4 h-4" />
          Plan chat
        </div>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {isHistoryLoading && displayMessages.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : displayMessages.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            Ask questions about this study plan. Your thread is saved for this plan only.
          </p>
        ) : (
          displayMessages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {isWaitingForResponse && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg px-3 py-2 text-sm text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              Thinking…
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-100 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Ask about this plan…"
          disabled={isWaitingForResponse}
          className="flex-1"
        />
        <Button
          type="button"
          size="icon"
          onClick={() => void handleSend()}
          disabled={isWaitingForResponse || !inputValue.trim()}
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

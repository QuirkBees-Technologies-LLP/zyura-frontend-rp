import { useGetGeneratedFlashCardQuery } from "@/store/features/flashCard/flashCard.api";
import { IFlashcardBank } from "@/types";
import FlashCard from "./FlashCard";
// import { Link } from "react-router-dom";
import GlobalLoader2 from "@/common/GlobalLoader2";
import Pagination from "@/common/custom/Pagination";
import { useState } from "react";
import { useDeleteMyContentMutation } from "@/store/features/content/content.api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

export default function GeneratedFlashCard({
  searchTerm,
  filters,
}: {
  searchTerm: string;
  filters: { subject: string; system: string; topic: string };
}) {
  const [page, setPage] = useState(1);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  const { data: flashcardData, isLoading } = useGetGeneratedFlashCardQuery({
    searchTerm,
    ...filters,
    page,
    limit: 12,
  });

  const [deleteContent, { isLoading: isDeleting }] =
    useDeleteMyContentMutation();

  const allGeneratedFlashcard = flashcardData?.data ?? [];
  const meta = flashcardData?.meta;
  const totalPages = meta?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDeleteConfirm = async () => {
    if (!cardToDelete) return;
    try {
      await deleteContent({ id: cardToDelete, key: "flashcard" }).unwrap();
      setCardToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (isLoading) return <GlobalLoader2 />;
  if (isLoading) return <GlobalLoader2 />;

  return (
    <div>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {allGeneratedFlashcard?.length > 0 ? (
          allGeneratedFlashcard.map(
            (flashcard: IFlashcardBank, idx: number) => (
              <FlashCard
                key={idx}
                source="generated"
                {...flashcard}
                onDelete={() => setCardToDelete(flashcard._id)}
                isDeleting={isDeleting && cardToDelete === flashcard._id}
              />
            ),
          )
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />

            <p className="text-slate-500 font-bold text-lg">
              No Flashcards Found
            </p>

            <p className="text-slate-400 text-sm mt-1">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!cardToDelete}
        onOpenChange={(open) => !open && setCardToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <AlertCircle className="w-6 h-6" />
              <DialogTitle>Delete Flashcard</DialogTitle>
            </div>

            <DialogDescription>
              Are you sure you want to delete this flashcard? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCardToDelete(null)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="cursor-pointer flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Flashcard"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

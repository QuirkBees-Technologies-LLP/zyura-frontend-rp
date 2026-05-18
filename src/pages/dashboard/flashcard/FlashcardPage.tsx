import DashboardHeading from "@/components/reusable/DashboardHeading";
import PrimaryButton from "@/components/reusable/PrimaryButton";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import FlashCardCollection from "./FlashCardCollection";
import { BreadcrumbItem } from "@/components/dashboard/gamified-learning/types";
import Breadcrumb from "@/components/reusable/CommonBreadcrumb";

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Flashcards", link: "/dashboard/flashcard-page" },
];

const FlashcardPage = () => {
  return (
    <div className="my-3 px-2">
      <Breadcrumb breadcrumbs={breadcrumbs} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DashboardHeading
          title="Flash Cards"
          titleSize="text-2xl"
          titleColor="text-slate-900"
          description="Access AI-powered flashcards to improve memory retention and active recall learning."
          descColor="text-slate-500"
          descFont="text-sm"
          className="mb-0"
        />

        <Link to={"/dashboard/flashcard-generator"}>
          <PrimaryButton
            icon={<Plus className="w-5 h-5" />}
            bgType="solid"
            iconPosition="left"
            bgColor="bg-brand"
            className="h-11 hover:bg-brand/90 shadow-md hover:shadow-lg transition-all rounded-md cursor-pointer w-full sm:w-auto font-bold"
          >
            Generate Flash Card
          </PrimaryButton>
        </Link>
      </div>

      <FlashCardCollection />
    </div>
  );
};

export default FlashcardPage;
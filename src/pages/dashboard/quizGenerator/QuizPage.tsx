import DashboardHeading from "@/components/reusable/DashboardHeading";
import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import QuizCollection from "./QuizCollection";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuizGenerator from "./QuizGenerator";

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(id ? "myQuiz" : "overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    } else if (id) {
      setActiveTab("myQuiz");
    }
  }, [location.state, id]);

  return (
    <div>
      <div className="md:flex justify-between items-center">
        <DashboardHeading
          title="Quiz Generator"
          titleSize="text-xl"
          titleColor="text-[#0A0A0A]"
          description="Create custom quizzes from your images and prompts using AI"
          descColor="text-[#4A5565]"
          descFont="text-sm"
          className="mt-5 mb-3"
        />
        <Button
          className="bg-[#063C79] h-12 mb-4 hover:bg-[#063C79] hover:opacity-80 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Quiz
        </Button>
      </div>

      <div>
        <div>
          <div>
            <div className="">
              {activeTab === "overview" && <QuizCollection />}
            </div>
          </div>
        </div>
      </div>

      <QuizGenerator
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default QuizPage;
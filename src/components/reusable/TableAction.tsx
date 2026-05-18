import AlertDialogBox from "@/common/custom/AlertDialogBox";
import CommonDropdown from "@/common/custom/CommonDropdown";
import { MoreVertical } from "lucide-react";

interface TableActionProps {
  handleDelete: () => void;
  handleEdit: () => void;
  isDeleting?: boolean;
}
const TableAction: React.FC<TableActionProps> = ({
  handleDelete,
  handleEdit,
  isDeleting = false,
}) => {
  return (
    <div>
      <CommonDropdown
        items={[
          { label: "Edit", onClick: () => handleEdit() },
          {
            label: "",
            onClick: () => {},
            component: (
              <AlertDialogBox
                action={async () => handleDelete()}
                isLoading={isDeleting}
                trigger={
                  <button className="w-full text-left px-2 py-1 text-[#262626] cursor-pointer hover:bg-gray-100">
                    Delete
                  </button>
                }
              />
            ),
          },
        ]}
        trigger={
          <button className="text-[#0A0A0A] hover:text-gray-600 cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        }
      />
    </div>
  );
};

export default TableAction;

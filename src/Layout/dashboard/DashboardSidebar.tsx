import { NavLink, matchPath, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { type FC } from "react";
import { cn } from "@/lib/utils";
//import { SidebarItem, sidebarItems } from "./sidebarConfig";

import {
  SidebarItem,
  sidebarItems,
  filterSidebarItemsForLearnerDashboard,
} from "./sidebarConfig";
import { useSelector } from "react-redux";
import { selectRole } from "@/store/features/auth/auth.slice";
import DashboardSearch from "./DashboardSearch";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onLinkClick?: () => void;
}

const DashboardSidebar: FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  onLinkClick,
}) => {
  const role = useSelector(selectRole);
  const location = useLocation();

  // const hiddenForStudent = new Set([
  //   "Diagram",
  //   "Drug Cards",
  //   "CME/CPD Courses",
  //   "Resources",
  //   "Upgrade Plan",
  // ]);

  // Professionals use the same dashboard nav as students (no Diagram / Drug Cards / etc.).
  const visibleSidebarItems =
    role === "STUDENT" || role === "PROFESSIONAL"
    //? sidebarItems.filter((i) => !hiddenForStudent.has(i.label))
      ? filterSidebarItemsForLearnerDashboard(sidebarItems)
      : sidebarItems;

  const groupedItems = visibleSidebarItems.reduce(
    (acc, item) => {
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
      return acc;
    },
    {} as Record<string, SidebarItem[]>,
  );

  const isItemActive = (item: SidebarItem) => {
    if (item.path === "/dashboard") return location.pathname === item.path;

    return Boolean(
      matchPath({ path: item.path, end: true }, location.pathname) ||
      matchPath({ path: `${item.path}/*` }, location.pathname),
    );
  };

  const renderNavItem = (item: SidebarItem) => (
    <div className="flex gap-1">
      <div
        className={cn(
          "h-12 w-2 rounded-tr-2xl rounded-br-2xl",
          collapsed ? "h-[52px]" : "",
          isItemActive(item) ? "bg-brand-gradient" : "bg-transparent",
        )}
      ></div>
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === "/dashboard"}
        onClick={(e) => {
          if (item.disabled) {
            e.preventDefault();
            return;
          }
          onLinkClick?.();
        }}
        className={({ isActive }) =>
          cn(
            `flex w-full items-center gap-3 px-1.5 py-2 rounded-lg transition-all duration-200 group relative ${item.fieldBg}`,
            collapsed ? "justify-center" : "",
            item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
            !item.disabled &&
            (isActive
              ? " text-white font-medium bg-brand-gradient"
              : "text-gray-700 hover:bg-gray-50"),
          )
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={cn(
                "flex items-center justify-center rounded-lg transition-colors",
                collapsed ? "w-8 h-8" : "w-8 h-8",
                isActive ? "bg-transparent" : "",
              )}
            >
              {item.isImageIcon ? (
                <img
                  src={item.icon as string}
                  alt={item.label}
                  className={cn(
                    "shrink-0 object-contain",
                    collapsed ? "h-6 w-6" : "h-6 w-6",
                  )}
                />
              ) : (
                <item.icon
                  className={cn(
                    "shrink-0",
                    collapsed ? "h-6 w-6" : "h-6 w-6",
                    isActive ? "text-white" : item.iconColor,
                  )}
                />
              )}
            </div>
            {!collapsed && <span className="text-sm truncate">{item.label}</span>}

            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </>
        )}
      </NavLink>
    </div>
  );

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-30",
        collapsed ? "w-20" : "w-[280px]",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div
          className={cn(
            "flex items-center border-b border-gray-200 justify-center",
            collapsed ? " px-2 h-16" : "px-4 h-[69px]",
          )}
        >
          {!collapsed && <img src="/logo.svg" alt="Logo" className="h-10" />}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
          )}
        </div>

        {/* Scrollable Menu */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden thin-scrollbar scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Search */}
          <div className=" py-4 px-3">
            {!collapsed ? (
              <DashboardSearch />
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md border bg-gray-300 border-gray-200 text-gray-500"
                  aria-label="Search anything"
                  title="Search anything"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className="pe-3">
            {/* Main Navigation */}
            <div className="space-y-1 mb-6">
              {groupedItems.main?.map((item) => renderNavItem(item))}
            </div>

            {/* AI Tools */}
            {!collapsed && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  AI Tools
                </h3>
              </div>
            )}
            {collapsed && <div className="border-t border-gray-200 my-3" />}
            <div className="space-y-1 mb-6">
              {groupedItems["AI Tools"]?.map((item) => renderNavItem(item))}
            </div>

            {/* Study Materials */}
            {!collapsed && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Study Materials
                </h3>
              </div>
            )}
            {collapsed && <div className="border-t border-gray-200 my-3" />}
            <div className="space-y-1 mb-6">
              {groupedItems["Study Materials"]?.map((item) =>
                renderNavItem(item),
              )}
            </div>
          </div>
        </div>

        {/* Bottom Items */}
        {/* <div className="border-t border-gray-200 p-3 space-y-1">
          {groupedItems.bottom?.map((item) => renderNavItem(item))}

          
          <button
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-gray-700 hover:bg-red-50 hover:text-red-600 group relative",
              collapsed ? "justify-center" : ""
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-red-100 transition-colors",
                collapsed ? "w-9 h-9" : "w-8 h-8"
              )}
            >
              <LogOut
                className={cn(
                  "flex-shrink-0 text-gray-600 group-hover:text-red-600",
                  collapsed ? "h-5 w-5" : "h-4 w-4"
                )}
              />
            </div>
            {!collapsed && <span className="text-sm">Logout</span>}

            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div> */}

        {/* Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3 text-gray-600" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-gray-600" />
            )}
          </button>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;

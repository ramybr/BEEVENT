import { ThemeProvider } from "./providers/theme-provider";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
  return (
    //className="bg-white dark:bg-gray-800 text-black dark:text-white"
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm dark:text-white dark:bg-gray-800">
      <div className="p-6"></div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

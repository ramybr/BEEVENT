import { ThemeProvider } from "./providers/theme-provider";
import { SidebarRoutes } from "./sidebar-routes";
import { ModeToggle } from "./ui/mode-toggle";

export const Sidebar = () => {
  return (
    //className="bg-white dark:bg-gray-800 text-black dark:text-white"
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-md bg-white  dark:text-bg2-contrast dark:bg-background-2nd-level">
      <div className="flex flex-col w-full">
        <ModeToggle />
        <SidebarRoutes />
      </div>
    </div>
  );
};

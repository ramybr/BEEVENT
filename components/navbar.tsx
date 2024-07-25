import { NavbarRoutes } from "@/components/navbar-routes";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center md:justify-end shadow-sm bg-white dark:bg-background-2nd-level">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

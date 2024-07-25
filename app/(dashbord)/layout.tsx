"use client";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { usePathname } from "next/navigation";

const DashbordLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isProfilePage = pathname?.includes("profile");

  console.log("current pathname", pathname);

  return (
    <div className=" h-full dark:bg-background-1st-level dark:text-bg1-contrast">
      {!isProfilePage && (
        <>
          <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
            <Navbar />
          </div>
          <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
            <Sidebar />
          </div>
          <main className="md:pl-56 pt-[40px] h-full dark:bg-background-1st-level dark:border-background-1st-level dark:text-bg1-contrast">
            {children}
          </main>
        </>
      )}
      {isProfilePage && (
        <>
          <div className="h-[80px]  fixed inset-y-0 w-full z-50">
            <Navbar />
          </div>

          <main className="pt-[80px] h-full w-full">{children}</main>
        </>
      )}
    </div>
  );
};

export default DashbordLayout;

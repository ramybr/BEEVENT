"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export const SidebarItem = ({ label, href, icon: Icon }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/search" && href === "/search") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center items-between gap-x-4 py-4 text-primary text-xs font-bold dark:text-bg1-contrast">
        <Icon size={22} className={cn("text-primary")} />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-bg1-contrast h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

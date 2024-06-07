"use client";

import { BarChart, Compass, Key, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
];

const userRoutes = [
  {
    icon: List,
    label: "Events",
    href: "/user/events",
  },

  {
    icon: BarChart,
    label: "Analytics",
    href: "/user/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isUserPage = pathname?.includes("/user");

  const routes = isUserPage ? userRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem key={route.href} label={route.label} href={route.href} />
      ))}
    </div>
  );
};

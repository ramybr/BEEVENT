"use client";

import {
  BarChart3,
  CalendarCheck,
  Compass,
  Key,
  Layout,
  List,
  QrCode,
  ScanLine,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

// const guestRoutes = [
//   {
//     icon: Compass,
//     label: "Browse",
//     href: "/search",
//   },
//   {
//     icon: Layout,
//     label: "Dashboard",
//     href: "/",
//   },
// ];

const userRoutes = [
  {
    icon: List,
    label: "My Events",
    href: "/user/events",
  },

  {
    icon: CalendarCheck,
    label: "My Participations",
    href: "/user/participations",
  },
  {
    icon: QrCode,
    label: "My Attendances",
    href: "/user/attendances",
  },
  {
    icon: BarChart3,
    label: "My Analytics",
    href: "/user/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isProfilePage = pathname?.includes("/profile");

  return (
    <>
      {!isProfilePage && (
        <div className="flex flex-col w-full">
          {userRoutes.map((userRoute) => (
            <SidebarItem
              key={userRoute.href}
              icon={userRoute.icon}
              label={userRoute.label}
              href={userRoute.href}
            />
          ))}
        </div>
      )}
    </>
  );
};

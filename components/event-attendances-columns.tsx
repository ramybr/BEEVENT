// components/event-attendances-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Attendance, Event, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export interface AttendanceWithRelations extends Attendance {
  user: User;
  event: Event;
}

export const eventAttendancesColumns: ColumnDef<AttendanceWithRelations>[] = [
  {
    accessorKey: "user.firstName",
    header: "First Name",
    cell: ({ row }) => row.original.user?.firstName ?? "N/A",
  },
  {
    accessorKey: "user.lastName",
    header: "Last Name",
    cell: ({ row }) => row.original.user?.lastName ?? "N/A",
  },

  {
    accessorKey: "event.startDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const startDate = row.original.event?.startDate as string | null;
      return startDate ? formatDate(startDate) : "Not set";
    },
  },
  {
    accessorKey: "isPresent",
    header: "Attendance",
    cell: ({ row }) => {
      const isPresent = row.getValue("isPresent") as boolean;
      return (
        <Badge
          className={cn(
            "bg-background-1st-level-slate100 dark:bg-bg1-contrast",
            isPresent && "bg-secondary"
          )}
        >
          {isPresent ? "Present" : "Absent"}
        </Badge>
      );
    },
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

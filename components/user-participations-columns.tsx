// components/user-participations-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Participation, Event, User } from "@prisma/client";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const participationColumns: ColumnDef<
  Participation & { event: Event & { user: User } }
>[] = [
  {
    accessorKey: "event.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Event Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <a href={`/events/${row.original.eventId}`} className="hover:underline">
        {row.original.event.name}
      </a>
    ),
  },
  {
    accessorKey: "event.location",
    header: "Location",
    cell: ({ row }) => row.original.event.location,
  },
  {
    accessorKey: "event.user.firstName",
    header: "Organizer",
    cell: ({ row }) => row.original.event.user.firstName,
  },
  {
    accessorKey: "event.startDate",
    header: "Start Date",
    cell: ({ row }) => row.original.event.startDate,
  },
  {
    accessorKey: "event.endDate",
    header: "End Date",
    cell: ({ row }) => row.original.event.endDate,
  },
  {
    accessorKey: "roleInEvent",
    header: "Role",
    cell: ({ row }) => row.original.roleInEvent,
  },
];

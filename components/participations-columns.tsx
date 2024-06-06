"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Participation, Event, User } from "@prisma/client";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const participationColumns: ColumnDef<
  Participation & { event: Event & { user: User } }
>[] = [
  {
    accessorKey: "name",
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Location
      </Button>
    ),
  },
  {
    accessorKey: "event.user",
    header: "Organizer",
    cell: ({ row }) => {
      const user = row.original.event.user;
      return `${user.firstName} ${user.lastName}`;
    },
  },
  {
    accessorKey: "event.startDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        From
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const startDate = row.original.event.startDate as string | null;
      return startDate ? formatDate(startDate) : "Not set";
    },
  },
  {
    accessorKey: "event.endDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        To
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const endDate = row.original.event.endDate as string | null;
      return endDate ? formatDate(endDate) : "Not set";
    },
  },
];

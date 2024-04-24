"use client";

import { Event } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "userId",
    header: "Organizer",
  },
  {
    accessorKey: "isOpen",
    header: "Open",
  },
  {
    accessorKey: "isMandatory",
    header: "Mandatory",
  },
];

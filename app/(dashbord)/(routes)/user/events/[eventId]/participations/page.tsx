"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import ChangeRoleDialog from "@/components/change-role-dialog";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

interface User {
  firstName: string;
  lastName: string;
}

interface Event {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  user: User;
}

interface Participation {
  id: number;
  userId: number;
  eventId: number;
  roleInEvent: string;
  user: User;
  event: Event;
}

const participationColumns: ColumnDef<Participation>[] = [
  {
    accessorKey: "user.firstName",
    header: "First Name",
  },
  {
    accessorKey: "user.lastName",
    header: "Last Name",
  },
  {
    accessorKey: "roleInEvent",
    header: "Role",
    cell: ({ row }) => {
      const { eventId } = useParams();

      const { theme, resolvedTheme } = useTheme();

      type ButtonVariant =
        | "default"
        | "link"
        | "ghost-dark"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost";

      const [buttonVariant, setButtonVariant] =
        useState<ButtonVariant>("ghost");

      useEffect(() => {
        const currentTheme: ButtonVariant =
          theme === "dark" || resolvedTheme === "dark" ? "ghost-dark" : "ghost";
        setButtonVariant(currentTheme);
      }, [theme, resolvedTheme]);

      return (
        <div className="flex items-center">
          {row.original.roleInEvent}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-48" variant={buttonVariant}>
                Change Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ChangeRoleDialog
                eventId={eventId as string}
                participationId={row.original.id.toString()}
                initialRole={row.original.roleInEvent}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];

export default function EventParticipations() {
  const [data, setData] = useState<Participation[]>([]);
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/events/${eventId}/participations`);
      const result = await response.json();
      setLoading(false);
      setData(result);
    };

    fetchData();
  }, [eventId]);

  if (loading)
    return (
      <div className="flex items-center justify-center pt-48">
        <Loader2 className="animate-spin h-6 w-6 dark:text-bg1-contrast" />
      </div>
    );
  return (
    <DataTable
      columns={participationColumns}
      data={data}
      filterColumnId="user.firstName"
    />
  );
}

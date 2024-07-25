"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import {
  eventAttendancesColumns,
  AttendanceWithRelations,
} from "@/components/event-attendances-columns";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

const fetchAttendances = async (eventId: string) => {
  const response = await fetch(`/api/events/${eventId}/attendances`);
  if (!response.ok) {
    throw new Error("Failed to fetch attendances");
  }
  const data = await response.json();
  return data;
};

const EventAttendancesPage = () => {
  const params = useParams();
  const eventId = Array.isArray(params.eventId)
    ? params.eventId[0]
    : params.eventId;
  const [attendances, setAttendances] = useState<AttendanceWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAttendances = async () => {
      try {
        const data = await fetchAttendances(eventId);
        setAttendances(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAttendances();
  }, [eventId]);

  if (loading)
    return (
      <div className="flex items-center justify-center pt-48">
        <Loader2 className="animate-spin h-6 w-6 dark:text-bg1-contrast" />
      </div>
    );

  return (
    <div className="p-6">
      <span>
        <h1 className="text-2xl">Event Attendances</h1>
      </span>
      <DataTable
        columns={eventAttendancesColumns}
        data={attendances}
        filterColumnId="user.firstName"
      />
    </div>
  );
};

export default EventAttendancesPage;

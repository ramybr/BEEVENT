"use client";

import * as React from "react";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

type SessionTimeFormProps = {
  initialData: {
    sessionStart: string | null;
    sessionEnd: string | null;
  };
  eventId: number;
  sessionId: number;
  editable: boolean; // Add editable prop
};

const formSchema = z.object({
  sessionStart: z.date(),
  sessionEnd: z.date().nullable(),
});

export const SessionTimeForm = ({
  initialData,
  eventId,
  sessionId,
  editable,
}: SessionTimeFormProps) => {
  const defaultStartTime = setSeconds(
    setMinutes(setHours(new Date(), 8), 0),
    0
  ); // 08:00 local time
  const defaultEndTime = setSeconds(setMinutes(setHours(new Date(), 17), 0), 0); // 17:00 local time

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialData.sessionStart
      ? new Date(initialData.sessionStart)
      : defaultStartTime,
    to: initialData.sessionEnd
      ? new Date(initialData.sessionEnd)
      : defaultEndTime,
  });

  const [isEditing, setIsEditing] = React.useState(false);
  const [isPickingStartTime, setIsPickingStartTime] = React.useState(true);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}/sessions/${sessionId}`, values);
      toast.success("Session time updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleSave = () => {
    if (date?.from) {
      onSubmit({
        sessionStart: date.from,
        sessionEnd: date.to ?? null,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDate({
      from: initialData.sessionStart
        ? new Date(initialData.sessionStart)
        : defaultStartTime,
      to: initialData.sessionEnd
        ? new Date(initialData.sessionEnd)
        : defaultEndTime,
    });
    setIsEditing(false);
  };

  const [startTime, setStartTime] = React.useState<string | null>(
    initialData.sessionStart
      ? format(new Date(initialData.sessionStart), "HH:mm")
      : "08:00"
  );

  const [endTime, setEndTime] = React.useState<string | null>(
    initialData.sessionEnd
      ? format(new Date(initialData.sessionEnd), "HH:mm")
      : "17:00"
  );

  const handleTimeChange = (time: string | null, type: "start" | "end") => {
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      if (type === "start" && date?.from) {
        setDate({
          ...date,
          from: setMinutes(setHours(new Date(date.from), hours), minutes),
        });
        setStartTime(time);
      } else if (type === "end" && date?.to) {
        setDate({
          ...date,
          to: setMinutes(setHours(new Date(date.to), hours), minutes),
        });
        setEndTime(time);
      }
    }
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && !range.to) {
      setIsPickingStartTime(true);
    } else if (range?.to) {
      setIsPickingStartTime(false);
    }
  };

  if (!editable) {
    return (
      <div className="grid gap-2">
        <div>
          <strong>Session Start:</strong>{" "}
          {initialData.sessionStart
            ? format(new Date(initialData.sessionStart), "MMM dd, yyyy HH:mm")
            : "Not set"}
        </div>
        <div>
          <strong>Session End:</strong>{" "}
          {initialData.sessionEnd
            ? format(new Date(initialData.sessionEnd), "MMM dd, yyyy HH:mm")
            : "Not set"}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium mb-4">Event Dates</div>
      {isEditing ? (
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Calendar
              className="flex-grow"
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={1}
            />
          </div>
          <div className="flex items-center gap-2">
            {isPickingStartTime ? (
              <TimePicker
                className="w-full p-2 border rounded-md"
                onChange={(time) => handleTimeChange(time, "start")}
                value={startTime}
                disableClock
              />
            ) : (
              <TimePicker
                className="w-full p-2 border rounded-md"
                onChange={(time) => handleTimeChange(time, "end")}
                value={endTime}
                disableClock
              />
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>Save Dates</Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <div>
            <strong>Session Start:</strong>{" "}
            {initialData.sessionStart
              ? format(new Date(initialData.sessionStart), "MMM dd, yyyy HH:mm")
              : "Not set"}
          </div>
          <div>
            <strong>Session End:</strong>{" "}
            {initialData.sessionEnd
              ? format(new Date(initialData.sessionEnd), "MMM dd, yyyy HH:mm")
              : "Not set"}
          </div>
          <Button onClick={() => setIsEditing(true)} className="mt-4">
            Edit Dates
          </Button>
        </div>
      )}
    </div>
  );
};

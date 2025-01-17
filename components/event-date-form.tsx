"use client";

import * as React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

type DateRangeFormProps = {
  initialData: {
    startDate: string | null;
    endDate: string | null;
  };
  eventId: number;
  editable: boolean;
};

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date().nullable(),
});

export const DateRangeForm = ({
  initialData,
  eventId,
  editable,
}: DateRangeFormProps) => {
  const defaultStartTime = setMinutes(setHours(new Date(), 8), 0); // 08:00 local time
  const defaultEndTime = setMinutes(setHours(new Date(), 17), 0); // 17:00 local time

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialData.startDate
      ? setMinutes(setHours(new Date(initialData.startDate), 8), 0)
      : defaultStartTime,
    to: initialData.endDate
      ? setMinutes(setHours(new Date(initialData.endDate), 17), 0)
      : defaultEndTime,
  });

  const [isEditing, setIsEditing] = React.useState(false);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}`, values);
      toast.success("Event dates updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleSave = () => {
    if (date?.from) {
      onSubmit({
        startDate: date.from,
        endDate: date.to ?? null,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDate({
      from: initialData.startDate
        ? setMinutes(setHours(new Date(initialData.startDate), 8), 0)
        : defaultStartTime,
      to: initialData.endDate
        ? setMinutes(setHours(new Date(initialData.endDate), 17), 0)
        : defaultEndTime,
    });
    setIsEditing(false);
  };

  if (!editable) {
    return (
      <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-background-2nd-level dark:text-bg2-contrast">
        <div className="font-medium mb-4">Event Dates</div>
        <div className="grid gap-2">
          <div>
            <strong>Start Date:</strong>{" "}
            {initialData.startDate
              ? format(new Date(initialData.startDate), "MMM dd, yyyy")
              : "Not set"}{" "}
          </div>
          <div>
            <strong>End Date:</strong>{" "}
            {initialData.endDate
              ? format(new Date(initialData.endDate), "MMM dd, yyyy")
              : "Not set"}{" "}
          </div>
        </div>
      </div>
    );
  }

  const { theme, resolvedTheme } = useTheme();

  type ButtonVariant =
    | "default"
    | "link"
    | "ghost-dark"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";

  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("ghost");

  useEffect(() => {
    const currentTheme: ButtonVariant =
      theme === "dark" || resolvedTheme === "dark" ? "ghost-dark" : "ghost";
    setButtonVariant(currentTheme);
  }, [theme, resolvedTheme]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-background-2nd-level dark:text-bg2-contrast">
      <div className="font-medium mb-4">Event dates</div>
      {isEditing ? (
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Calendar
              className="flex-grow"
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} variant={buttonVariant}>
              Save Dates
            </Button>
            <Button variant={buttonVariant} onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          <div>
            <strong>Start Date:</strong>{" "}
            {initialData.startDate
              ? format(new Date(initialData.startDate), "MMM dd, yyyy")
              : "Not set"}{" "}
          </div>
          <div>
            <strong>End Date:</strong>{" "}
            {initialData.endDate
              ? format(new Date(initialData.endDate), "MMM dd, yyyy")
              : "Not set"}{" "}
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            className="mt-4"
            variant={buttonVariant}
          >
            Edit dates
          </Button>
        </div>
      )}
    </div>
  );
};

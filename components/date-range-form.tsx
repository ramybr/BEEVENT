"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Pencil, PlusCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DateRangeFormProps = {
  initialData: {
    startDate: string | null;
    endDate: string | null;
  };
  eventId: number;
};

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date().nullable(),
});

export const DateRangeForm = ({ initialData, eventId }: DateRangeFormProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialData.startDate ? new Date(initialData.startDate) : undefined,
    to: initialData.endDate ? new Date(initialData.endDate) : undefined,
  });

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}`, values);
      toast.success("Event edited");
      toggleEdit();
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
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Event Dates
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.startDate && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Dates
            </>
          )}
          {!isEditing && initialData.startDate && (
            <>
              <Pencil className="h-4 m-4 mr-2" />
              Edit Dates
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          {date?.from ? (
            <div>
              {date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )}
            </div>
          ) : (
            <span>No dates selected</span>
          )}
        </div>
      )}
      {isEditing && (
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleSave} className="mt-4">
            Save Dates
          </Button>
        </div>
      )}
    </div>
  );
};

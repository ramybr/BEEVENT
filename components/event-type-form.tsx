"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Event } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
import { useTheme } from "next-themes";

type EventTypeFormProps = {
  initialData: Event;
  eventId: number;
  options: { label: string; value: number }[];
  editable: boolean;
};

const formSchema = z.object({
  eventTypeId: z.number().int().min(1),
});

export const EventTypeForm = ({
  initialData,
  eventId,
  options,
  editable,
}: EventTypeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventTypeId: initialData?.eventTypeId || 0,
    },
  });

  const { isSubmitting, isValid } = form.formState;

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

  const selectedOption = options.find(
    (option) => option.value === initialData.eventTypeId
  );

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
    <>
      {editable && (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-background-2nd-level">
          <div className="font-medium flex items-center justify-between">
            Event Type
            <Button onClick={toggleEdit} variant={buttonVariant}>
              {isEditing ? (
                <>Cancel</>
              ) : (
                <>
                  <Pencil className="h-4 m-4 mr-2" />
                  Edit type
                </>
              )}
            </Button>
          </div>
          {!isEditing && (
            <p
              className={cn(
                "text-sm mt-2",
                !initialData.eventTypeId && "text-slate-500 italic"
              )}
            >
              {selectedOption?.label || "No event type selected"}
            </p>
          )}
          {isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={form.control}
                  name="eventTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Combobox options={options} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <Button
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    variant={buttonVariant}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      )}
      {!editable && (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-background-2nd-level">
          <p className="font-medium flex items-center justify-between">
            Event Type
          </p>
          {selectedOption?.label || "No event type selected"}
        </div>
      )}
    </>
  );
};

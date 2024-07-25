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
import { Session } from "@prisma/client";
import { Textarea } from "./ui/textarea";
import { useTheme } from "next-themes";

type SessionDescriptionFormProps = {
  initialData: Session;
  eventId: number;
  sessionId: number;
  editable: boolean; // Add editable prop
};

const formSchema = z.object({
  description: z.string().min(1),
});

export const SessionDescriptionForm = ({
  initialData,
  eventId,
  sessionId,
  editable,
}: SessionDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/events/${eventId}/sessions/${sessionId}`, values);
      toast.success("Session edited");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (!editable) {
    return (
      <p
        className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}
      >
        {initialData.description || "No description"}
      </p>
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
      <div className="font-medium flex items-center justify-between">
        Session description
        <Button onClick={toggleEdit} variant={buttonVariant}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 " />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {initialData.description || "No description"}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Brief session description"
                      {...field}
                    />
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
  );
};

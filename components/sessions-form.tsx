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
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Session, Event } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { SessionsList } from "./sessions-list";
import { SessionDescriptionForm } from "./session-description-form";
import { SessionTimeForm } from "./session-time-form";

type SessionsFormProps = {
  initialData: Event & { sessions: Session[] };
  eventId: number;
  editable: boolean; // Add editable prop
};

const formSchema = z.object({
  title: z.string().min(1),
});

export const SessionsForm = ({
  initialData,
  eventId,
  editable,
}: SessionsFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/events/${eventId}/sessions`, values);
      toast.success("Session created");
      toggleCreating();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: number; position: number }[]) => {
    try {
      setIsUpdating(true);

      await axios.put(`/api/events/${eventId}/sessions/reorder`, {
        list: updateData,
      });
      toast.success("Sessions reordered");
    } catch (error) {
      toast.error("Something went wrong");
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: number) => {
    router.push(`/user/events/${eventId}/sessions/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Event sessions
        {editable && (
          <Button onClick={toggleCreating} variant="ghost">
            {isCreating ? (
              <>Cancel</>
            ) : (
              <>
                <PlusCircle className="h-4 m-4 mr-2" />
                Add session
              </>
            )}
          </Button>
        )}
      </div>
      {isCreating && editable && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Session title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.sessions.length && "text-slate-500 italic"
          )}
        >
          {!initialData.sessions.length && "No sessions"}
          <SessionsList
            onEdit={editable ? onEdit : undefined}
            onReorder={editable ? onReorder : undefined}
            items={initialData.sessions || []}
            editable={editable} // Pass editable prop to SessionsList
          />
        </div>
      )}
      {!editable &&
        initialData.sessions.map((session) => (
          <div
            key={session.id}
            className="mt-6 border bg-slate-100 rounded-md p-4"
          >
            <h3 className="font-medium">Session: {session.title}</h3>
            <SessionDescriptionForm
              initialData={session}
              eventId={eventId}
              sessionId={session.id}
              editable={false} // Set to false to render read-only
            />
            <SessionTimeForm
              initialData={{
                sessionStart: session.sessionStart,
                sessionEnd: session.sessionEnd,
              }}
              eventId={eventId}
              sessionId={session.id}
              editable={false} // Set to false to render read-only
            />
          </div>
        ))}
    </div>
  );
};

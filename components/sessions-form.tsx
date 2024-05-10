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
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Session, Event } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { SessionsList } from "./sessions-list";

type SessionsFormProps = {
  initialData: Event & { sessions: Session[] };
  eventId: number;
};

const formSchema = z.object({
  title: z.string().min(1),
});

export const SessionsForm = ({ initialData, eventId }: SessionsFormProps) => {
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
      </div>
      {isCreating && (
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
                      placeholder="Session content"
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
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.sessions || []}
          />
        </div>
      )}
    </div>
  );
};

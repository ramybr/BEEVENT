"use client";

import * as React from "react";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

type VisibilityFormProps = {
  initialData: {
    isOpen: boolean;
    id: number;
  };
  eventId: number;
  editable: boolean;
};

const formSchema = z.object({
  isOpen: z.boolean(),
});

export const VisibilityForm = ({
  initialData,
  eventId,
  editable,
}: VisibilityFormProps) => {
  const [isOpen, setIsOpen] = React.useState(initialData.isOpen);

  const router = useRouter();

  const onSubmit = async () => {
    try {
      await axios.patch(`/api/events/${eventId}`, { isOpen });
      toast.success("Event visibility updated");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

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
    <div className="mt-6 border bg-slate-100 rounded-md p-4  dark:bg-background-2nd-level">
      <div className="font-medium flex items-center justify-between">
        Event Visibility
      </div>
      {editable ? (
        <>
          <RadioGroup
            value={isOpen.toString()}
            onValueChange={(value) => setIsOpen(value === "true")}
            className="mt-4 space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="public" />
              <label htmlFor="public">Public</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="private" />
              <label htmlFor="private">Private</label>
            </div>
          </RadioGroup>
          <div className="mt-4 flex justify-end space-x-2">
            <Button onClick={onSubmit} variant={buttonVariant}>
              Save
            </Button>
          </div>
        </>
      ) : (
        <p className="text-sm mt-2 dark:bg-background-2nd-level">
          {isOpen ? "Public" : "Private"}
        </p>
      )}
    </div>
  );
};

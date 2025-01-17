"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useTheme } from "next-themes";

interface ActionsProps {
  eventId: number;
  isPublished: boolean;
  isEventCreator: boolean;
  isParticipating: boolean;
}

export const Actions = ({
  eventId,
  isPublished,
  isEventCreator,
  isParticipating,
}: ActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  type ButtonVariant =
    | "default"
    | "link"
    | "ghost-dark"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";

  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("default");

  useEffect(() => {
    const currentTheme: ButtonVariant =
      theme === "dark" || resolvedTheme === "dark" ? "ghost-dark" : "default";
    setButtonVariant(currentTheme);
  }, [theme, resolvedTheme]);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/events/${eventId}/unpublish`);
        toast.success("Event unpublished");
      } else {
        await axios.patch(`/api/events/${eventId}/publish`);
        toast.success("Event published");
      }
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/events/${eventId}`);

      toast.success("Event deleted");
      router.refresh();
      router.push(`/user/events`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onParticipate = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/participations`, { eventId });
      toast.success("Participation confirmed");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelParticipation = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/participations`, { data: { eventId } });
      toast.success("Participation cancelled");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      {isEventCreator ? (
        <>
          <Button
            onClick={onClick}
            disabled={isLoading}
            size="sm"
            variant={buttonVariant}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <ConfirmModal onConfirm={onDelete}>
            <Button
              size="lg"
              disabled={isLoading}
              variant="outline"
              className="hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </ConfirmModal>
        </>
      ) : (
        <>
          {!isEventCreator && !isParticipating ? (
            <Button
              onClick={onParticipate}
              disabled={isLoading}
              variant={buttonVariant}
              size="sm"
            >
              Participate
            </Button>
          ) : (
            <Button
              onClick={onCancelParticipation}
              disabled={isLoading}
              variant={buttonVariant}
              size="sm"
            >
              Cancel Participation
            </Button>
          )}
        </>
      )}
    </div>
  );
};

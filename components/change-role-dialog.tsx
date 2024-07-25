"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ChangeRoleDialogProps {
  eventId: string;
  participationId: string;
  initialRole: string;
}

export default function ChangeRoleDialog({
  eventId,
  participationId,
  initialRole,
}: ChangeRoleDialogProps) {
  const [roleInEvent, setRoleInEvent] = useState(initialRole);
  const router = useRouter();

  const handleSave = async () => {
    await fetch(`/api/events/${eventId}/participations/${participationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleInEvent }),
    });

    router.refresh();
  };

  return (
    <div>
      <h2>Change Role</h2>
      <div className="flex justify-between">
        <select
          value={roleInEvent}
          onChange={(e) => setRoleInEvent(e.target.value)}
        >
          <option value="Attendee">Attendee</option>
          <option value="Speaker">Speaker</option>
        </select>
        <Button onClick={handleSave} className="ml-2 py-0 px-2">
          Save
        </Button>
      </div>
    </div>
  );
}

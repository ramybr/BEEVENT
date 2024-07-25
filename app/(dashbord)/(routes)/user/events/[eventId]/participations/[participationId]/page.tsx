"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ChangeRole() {
  const [roleInEvent, setRoleInEvent] = useState("");
  const { eventId, participationId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `/api/events/${eventId}/participations/${participationId}`
      );
      const result = await response.json();
      setRoleInEvent(result.roleInEvent);
    };

    fetchData();
  }, [eventId, participationId]);

  const handleSave = async () => {
    await fetch(`/api/events/${eventId}/participations/${participationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roleInEvent }),
    });

    router.push(`/user/events/${eventId}/participations`);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Change Role</h2>
        <select
          value={roleInEvent}
          onChange={(e) => setRoleInEvent(e.target.value)}
        >
          <option value="Attendee">Attendee</option>
          <option value="Speaker">Speaker</option>
        </select>
        <Button onClick={handleSave} className="ml-2">
          Save
        </Button>
      </div>
    </div>
  );
}

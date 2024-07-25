// /components/InvitationForm.tsx

"use client";

import { useState } from "react";
import axios from "axios";

export const InvitationForm = ({
  eventId,
  eventName,
}: {
  eventId: number;
  eventName: string;
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("/api/send", {
        email,
        eventId,
        eventName,
      });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data.error || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Recipient's Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Invitation"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

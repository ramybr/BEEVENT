"use client";

import { useState } from "react";
import { Button } from "./button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ConfirmAttendanceButton = ({ eventId }: { eventId: number }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConfirmPresence = async () => {
    setIsLoading(true);

    const response = await fetch(`/api/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId }),
    });

    setIsLoading(false);

    if (response.ok) {
      // Handle successful attendance confirmation
      toast.success("Attendance confirmed");
      router.push("attendance-confirmed"); // Navigate to the confirmation page
    } else {
      // Handle errors
      toast.error("Something went wrong");
    }
  };

  return (
    <Button
      onClick={handleConfirmPresence}
      className="mt-6  text-white py-2 px-4 rounded"
      disabled={isLoading}
    >
      {isLoading ? "Confirming..." : "Confirm Presence"}
    </Button>
  );
};

export default ConfirmAttendanceButton;

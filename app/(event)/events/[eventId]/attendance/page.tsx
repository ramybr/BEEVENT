import ConfirmAttendanceButton from "@/components/ui/confirm-attendance-button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function AttendancePage({
  params,
}: {
  params: { eventId: number };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const event = await db.event.findUnique({
    where: {
      id: Number(params.eventId),
    },
  });

  if (!event) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  const attendance = await db.attendance.findFirst({
    where: {
      eventId: event.id,
      userId: user?.id,
    },
  });

  return (
    <div className="flex flex-col justify-center items-center max-w-2xl max-h-xl mx-auto p-6 ">
      <div className=" flex flex-col justify-center items-center border rounded-lg shadow p-4">
        <div className="text-2xl font-bold">{event.name}</div>
        <div>
          <Image
            src={event.imageUrl || "/no-image-available.png"}
            alt={event.name}
            width={600}
            height={400}
            className="mt-4"
          />
        </div>
        <div className="mt-4 text-sm text-slate-500">
          {event.description || "No description"}
        </div>
      </div>
      {attendance && attendance.isPresent ? (
        <span className="mt-4 text-xl">
          Attendance already confirmed for this event
        </span>
      ) : (
        <ConfirmAttendanceButton eventId={event.id} />
      )}
    </div>
  );
}

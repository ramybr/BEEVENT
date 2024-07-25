import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import ConfirmAttendanceButton from "@/components/ui/confirm-attendance-button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
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
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center max-w-2xl p-4  mx-auto">
        {attendance && attendance.isPresent ? (
          <>
            <span className="mt-4 text-xl dark:text-bg1-contrast">
              Your attendance is already confirmed for this event
            </span>
            <Button variant="dark" className="my-4">
              <Link href="/search">Explore More Events</Link>
            </Button>
          </>
        ) : (
          <ConfirmAttendanceButton eventId={event.id} />
        )}
        <div className=" flex flex-col justify-center max-w-md max-h-md items-center border rounded-lg shadow p-4 dark:bg-background-2nd-level">
          <div className="text-2xl font-bold">{event.name}</div>
          <div>
            <Image
              src={event.imageUrl || "/images/upload-image.svg"}
              alt={event.name}
              width={600}
              height={400}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </>
  );
}

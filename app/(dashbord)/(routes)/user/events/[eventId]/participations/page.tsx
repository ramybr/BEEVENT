// file: /pages/user/participations.tsx

import { DataTable } from "@/components/data-table";
import { participationColumns } from "@/components/participations-columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ParticipationsPage = async ({
  params,
}: {
  params: { eventId: number };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const event = await db.event.findUnique({
    where: {
      id: Number(params.eventId),
    },
  });

  if (!event) {
    return new NextResponse("Event not found", { status: 404 });
  }

  const participations = await db.participation.findMany({
    where: {
      eventId: event.id,
    },
    include: {
      event: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return (
    <div className="p-6">
      <span>
        <h1 className="text-2xl"> Participations in {event.name}</h1>
      </span>
      <DataTable columns={participationColumns} data={participations} />
    </div>
  );
};

export default ParticipationsPage;

// file: /pages/user/participations.tsx

import { DataTable } from "@/components/data-table";
import { participationColumns } from "@/components/participations-columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const ParticipationsPage = async () => {
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

  const participations = await db.participation.findMany({
    where: {
      userId: user.id,
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
        <h1 className="text-2xl">{user.firstName}'s Participations</h1>
      </span>
      <DataTable columns={participationColumns} data={participations} />
    </div>
  );
};

export default ParticipationsPage;

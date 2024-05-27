import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUserByClerkUserId } from "@/utils/userService";
import { NextResponse } from "next/server";

const EventsPage = async () => {
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

  const events = await db.event.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <span>
        <h1 className="text-2xl">{user.firstName}'s events</h1>
      </span>
      <DataTable columns={columns} data={events} />
    </div>
  );
};

export default EventsPage;

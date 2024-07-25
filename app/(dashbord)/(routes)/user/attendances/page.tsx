import { DataTable } from "@/components/data-table";
import { columns } from "@/components/user-attendaces-columns"; // Assuming columns are defined in a separate file as provided
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const AttendancePage = async () => {
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
    return new Response("User not found", { status: 404 });
  }

  const attendances = await db.attendance.findMany({
    where: {
      userId: user.id,
    },
    include: {
      event: true,
      user: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl">{user.firstName}'s Attendances</h1>
      <DataTable
        columns={columns}
        data={attendances}
        filterColumnId="event.name"
      />
    </div>
  );
};

export default AttendancePage;

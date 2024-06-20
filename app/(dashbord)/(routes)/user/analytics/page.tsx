import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { DataCard } from "@/components/data-card";
import { Chart } from "@/components/chart";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const AnalyticsPage = async () => {
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

  const { data, totalParticipations, totalAttendances, totalAttendanceRate } =
    await getAnalytics(user.id);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label="Total Participations"
          value={`${totalParticipations}`}
        />
        <DataCard label="Total Attendances" value={`${totalAttendances}`} />
        <DataCard
          label="Attendance Rate"
          value={`${totalAttendanceRate.toFixed(2)}%`}
        />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;

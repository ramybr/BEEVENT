import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

// Fetch user attendances
export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    const attendances = await db.attendance.findMany({
      where: { userId: user?.id },
      include: {
        user: true,
        event: true,
      },
    });

    return NextResponse.json(attendances);
  } catch (error) {
    console.log("[Attendance GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

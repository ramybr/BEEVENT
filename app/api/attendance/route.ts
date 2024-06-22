import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  const { eventId } = await req.json();

  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is required" },
      { status: 400 }
    );
  }

  try {
    await db.attendance.create({
      data: {
        eventId: Number(eventId),
        userId: user!.id,
        isPresent: true,
      },
    });
    return NextResponse.json(
      { message: "Attendance confirmed" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to confirm attendance" },
      { status: 500 }
    );
  }
}

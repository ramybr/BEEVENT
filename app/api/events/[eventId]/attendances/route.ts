// app/api/events/[eventId]/attendances.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await db.event.findUnique({
      where: { id: Number(params.eventId) },
      include: {
        attendances: {
          include: { user: true, event: true },
        },
      },
    });

    if (!event) {
      return new NextResponse("Event not found", { status: 404 });
    }

    return NextResponse.json(event.attendances);
  } catch (error) {
    console.log("[ATTENDANCES GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

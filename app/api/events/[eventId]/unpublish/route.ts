import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: number } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    const eventOrganizer = await db.event.findUnique({
      where: {
        id: Number(params.eventId),
        userId: user?.id,
      },
    });

    if (!eventOrganizer) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedEvent = await db.event.update({
      where: {
        id: Number(params.eventId),
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedEvent);
  } catch (error) {
    console.log("[EVENT_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

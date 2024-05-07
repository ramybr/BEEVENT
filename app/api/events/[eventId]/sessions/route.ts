import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { eventId: number } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const eventOrganizer = await db.event.findUnique({
      where: {
        id: Number(params.eventId),
        userId: user.id,
      },
    });

    if (!eventOrganizer) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const session = await db.session.create({
      data: {
        title,
        eventId: Number(params.eventId),
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.log("sessionS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Handle participation
export async function POST(req: Request) {
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { eventId } = await req.json();

    if (!eventId) {
      return new NextResponse("Event ID is required", { status: 400 });
    }

    const participation = await db.participation.create({
      data: {
        userId: user.id,
        eventId: Number(eventId),
      },
    });

    return NextResponse.json(participation);
  } catch (error) {
    console.log("[Participation POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Handle cancel participation
export async function DELETE(req: Request) {
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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { eventId } = await req.json();

    if (!eventId) {
      return new NextResponse("Event ID is required", { status: 400 });
    }

    await db.participation.deleteMany({
      where: {
        userId: user.id,
        eventId: Number(eventId),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[Participation DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

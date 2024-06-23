import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getUserByClerkUserId } from "@/utils/userService";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await getUserByClerkUserId(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const event = await db.event.create({
      data: {
        userId: user.id,
        name,
      },
    });

    const participation = await db.participation.create({
      data: {
        userId: user.id,
        eventId: event.id,
        roleInEvent: "Organizer",
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.log("[Events]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

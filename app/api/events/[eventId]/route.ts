import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getUserByClerkUserId } from "@/utils/userService";

export async function DELETE(
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

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const event = await db.event.findUnique({
      where: {
        id: params.eventId,
        userId: user.id,
      },
    });

    if (!event) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedevent = await db.event.delete({
      where: {
        id: params.eventId,
      },
    });

    return NextResponse.json(deletedevent);
  } catch (error) {
    console.log("[event_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { eventId: number } }
) {
  try {
    const { userId } = auth();
    const { eventId } = params;
    const values = await req.json();

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

    const event = await db.event.update({
      where: {
        id: eventId,
        userId: user.id,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.log("[event_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

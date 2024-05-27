import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

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

    const ownEvent = await db.event.findUnique({
      where: {
        id: Number(params.eventId),
        userId: user?.id,
      },
    });

    // if (!event) {
    //   return new NextResponse("Not Found", { status: 404 });
    // }

    const deletedEvent = await db.event.delete({
      where: {
        id: Number(params.eventId),
      },
    });

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.log("[EVENT_ID_DELETE]", error);
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

    const event = await db.event.update({
      where: {
        id: eventId,
        userId: user?.id,
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.log("[EVENT_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
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
    const { list } = await req.json();

    const ownEvent = await db.event.findUnique({
      where: {
        id: Number(params.eventId),
        userId: Number(user?.id),
      },
    });

    if (!ownEvent) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await db.session.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

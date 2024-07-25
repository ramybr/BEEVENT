import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
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

    const participation = await db.participation.create({
      data: {
        userId: user.id,
        eventId: Number(params.eventId),
      },
    });

    return NextResponse.json(participation);
  } catch (error) {
    console.log("[PARTICIPATIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
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

    const participation = await db.participation.deleteMany({
      where: {
        userId: user.id,
        eventId: Number(params.eventId),
      },
    });

    return NextResponse.json(participation);
  } catch (error) {
    console.log("[PARTICIPATIONS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

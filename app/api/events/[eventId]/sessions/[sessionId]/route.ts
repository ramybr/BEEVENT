import { Session } from "@prisma/client";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getUserByClerkUserId } from "@/utils/userService";

export async function DELETE(
  req: Request,
  { params }: { params: { sessionId: number; eventId: number } }
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

    const session = await db.session.findUnique({
      where: {
        id: Number(params.sessionId),
        eventId: Number(params.eventId),
      },
    });

    if (!session) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletesession = await db.session.delete({
      where: {
        id: Number(params.eventId),
      },
    });

    return NextResponse.json(deletesession);
  } catch (error) {
    console.log("[session_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sessionId: number; eventId: number } }
) {
  try {
    const { userId } = auth();
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

    const event = await db.session.update({
      where: {
        id: Number(params.sessionId),
        eventId: Number(params.eventId),
      },
      data: {
        ...values,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.log("[session_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

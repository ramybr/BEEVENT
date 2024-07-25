import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { participationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { roleInEvent } = await req.json();

    if (roleInEvent !== "Attendee" && roleInEvent !== "Speaker") {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const participation = await db.participation.update({
      where: {
        id: Number(params.participationId),
      },
      data: {
        roleInEvent,
      },
    });

    return NextResponse.json(participation);
  } catch (error) {
    console.log("[Participation PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// file: app/api/events/[eventId]/participations/route.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// Fetch participants for an event
export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await db.event.findUnique({
      where: { id: Number(params.eventId) },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const participations = await db.participation.findMany({
      where: { eventId: event.id },
      include: { user: true },
    });

    return NextResponse.json(participations);
  } catch (error) {
    console.error("[FETCH PARTICIPATIONS]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update participant role
export async function PUT(
  req: NextRequest,
  { params }: { params: { eventId: string; participantId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roleInEvent } = await req.json();

    if (roleInEvent !== "Attendee" && roleInEvent !== "Speaker") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const participant = await db.participation.update({
      where: {
        id: Number(params.participantId),
      },
      data: {
        roleInEvent,
      },
    });

    return NextResponse.json(participant);
  } catch (error) {
    console.error("[UPDATE PARTICIPATION]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

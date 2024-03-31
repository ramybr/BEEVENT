import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await db.event.create({
      data: {
        userId,
        name,
      },
    });

    return NextResponse.json(event);

    //TODO : User route
  } catch (error) {
    console.log("[Courses]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

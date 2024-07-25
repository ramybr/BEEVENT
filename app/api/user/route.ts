import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userData = await req.json();

    const user = await db.user.create({
      data: {
        clerkId: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[Users]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

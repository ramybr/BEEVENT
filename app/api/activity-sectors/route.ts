import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET() {
  try {
    const activitySectors = await db.activitySector.findMany();
    return NextResponse.json(activitySectors);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch activity sectors" },
      { status: 500 }
    );
  }
}

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

    const organization = await db.organization.findUnique({
      where: { id: user.organization_id! },
    });

    if (!organization) {
      return new NextResponse("Organization not found", { status: 404 });
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.log("[ORGANIZATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { organizationName, activitySectorId } = await req.json();

    if (!organizationName || !activitySectorId) {
      return new NextResponse(
        "Missing organization name or activity sector ID",
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    let organization;

    if (!user.organization_id) {
      organization = await db.organization.create({
        data: {
          name: organizationName,
          activitySectorId,
          employees: {
            connect: { id: user.id },
          },
        },
      });

      // Update the user's organization_id with the new organization's ID
      await db.user.update({
        where: { id: user.id },
        data: { organization_id: organization.id },
      });
    } else {
      organization = await db.organization.findUnique({
        where: { id: user.organization_id },
      });

      if (!organization) {
        return new NextResponse("Organization not found", { status: 404 });
      }

      organization = await db.organization.update({
        where: { id: organization.id },
        data: {
          name: organizationName,
          activitySectorId,
        },
      });
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.log("[ORGANIZATION]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

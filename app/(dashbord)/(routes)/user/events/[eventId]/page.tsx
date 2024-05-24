// /pages/events/[eventId].tsx

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "@/components/title-form";
import { DescriptionForm } from "@/components/description-form";
import { ImageForm } from "@/components/image-form";
import { EventTypeForm } from "@/components/event-type-form";
import { Banner } from "@/components/banner";
import { Actions } from "@/components/actions";
import { NextResponse } from "next/server";
import { getUserByClerkUserId } from "@/utils/userService";
import { SessionsForm } from "@/components/sessions-form";
import { IconBadge } from "@/components/icon-badge";
import { DateRangeForm } from "@/components/date-range-form";
import { VisibilityForm } from "@/components/visibility-form";
import dynamic from "next/dynamic";

const LocationForm = dynamic(() => import("@/components/location-form"), {
  ssr: false,
});

const EventIdPage = async ({ params }: { params: { eventId: number } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const event = await db.event.findUnique({
    where: {
      id: Number(params.eventId),
      userId: user.id,
    },
    include: {
      sessions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const eventTypes = await db.eventType.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!event) {
    return redirect("/");
  }

  return (
    <>
      {event.isOpen ? (
        <Banner label="This event is public. It will be visible to all users." />
      ) : (
        <Banner label="This event is private. It will be visible to invited participants only." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Event setup</h1>
            <span className="text-sm text-slate-700">
              Complete event information
            </span>
          </div>
          <Actions eventId={params.eventId} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-6">
            <TitleForm initialData={event} eventId={event.id} />
            <DescriptionForm initialData={event} eventId={event.id} />
            <ImageForm initialData={event} eventId={event.id} />
            <EventTypeForm
              initialData={event}
              eventId={event.id}
              options={eventTypes.map((eventType) => ({
                label: eventType.name,
                value: eventType.id,
              }))}
            />
            <SessionsForm initialData={event} eventId={event.id} />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                {/* <IconBadge icon={ListChecks} /> */}
              </div>
            </div>
            <DateRangeForm initialData={event} eventId={event.id} />
            <VisibilityForm initialData={event} eventId={event.id} />
            <LocationForm initialData={event} eventId={event.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventIdPage;

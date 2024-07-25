// /app/events/[eventId]/page.tsx

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { TitleForm } from "@/components/title-form";
import { DescriptionForm } from "@/components/description-form";
import { ImageForm } from "@/components/image-form";
import { EventTypeForm } from "@/components/event-type-form";
import { Banner } from "@/components/banner";
import { Actions } from "@/components/actions";
import { NextResponse } from "next/server";
import { SessionsForm } from "@/components/sessions-form";
import { DateRangeForm } from "@/components/event-date-form";
import { VisibilityForm } from "@/components/visibility-form";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { InvitationForm } from "@/components/email-template";
import { CalendarCheck, Info, QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";

// Dynamically import the LocationForm to avoid SSR issues
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
          position: "asc",
        },
      },
    },
  });

  const eventTypes = await db.eventType.findMany({
    orderBy: {
      id: "asc",
    },
  });

  if (!event) {
    return redirect("/");
  }

  return (
    <>
      {event.isOpen ? (
        <Banner
          variant="success"
          label="This event is public. It will be visible to all users."
        />
      ) : (
        <Banner
          variant="success"
          label="This event is private. It will be visible to invited participants only."
        />
      )}
      <div className="p-6 flex justify-center w-full">
        <div className=" w-full flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">{event.name}</h1>
              <h2 className="text-xl text-slate-500">Customize your event</h2>
            </div>

            <Actions
              eventId={params.eventId}
              isPublished={event.isPublished}
              isEventCreator={true}
              isParticipating={true}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full ">
            <div className="flex flex-col space-y-6">
              <Card className="flex p-4  content-center justify-center text-md bg-slate-300 dark:bg-bg1-contrast dark:text-background-1st-level max-w-80 self-center ">
                <div className="flex justify-center content-center hover:text-banner-dark dark:hover:text-background-1st-level-slate100 transition">
                  <span>
                    <CalendarCheck className="mr-2" />
                  </span>
                  <Link href={`/user/events/${event.id}/participations`}>
                    <span>Event participations</span>
                  </Link>
                </div>
              </Card>
              <TitleForm
                initialData={event}
                eventId={event.id}
                editable={true}
              />
              <DescriptionForm
                initialData={event}
                eventId={event.id}
                editable={true}
              />
              <ImageForm
                initialData={event}
                eventId={event.id}
                editable={true}
              />
              <VisibilityForm initialData={event} eventId={event.id} editable />
            </div>
            <div className="flex flex-col space-y-6">
              <Card className="flex p-4  content-center justify-center text-md bg-slate-300 dark:bg-bg1-contrast dark:text-background-1st-level max-w-80 self-center ">
                <div className="flex justify-center content-center hover:text-banner-dark dark:hover:text-background-1st-level-slate100 transition">
                  <span>
                    <QrCode className="mr-2" />
                  </span>
                  <Link href={`/user/events/${event.id}/attendances`}>
                    <span>Event attendances</span>
                  </Link>
                </div>
              </Card>
              <EventTypeForm
                initialData={event}
                eventId={event.id}
                options={eventTypes.map((eventType) => ({
                  label: eventType.name,
                  value: eventType.id,
                }))}
                editable={true}
              />
              <DateRangeForm
                initialData={event}
                eventId={event.id}
                editable={true}
              />
              <LocationForm initialData={event} eventId={event.id} editable />
              <SessionsForm
                initialData={event}
                eventId={event.id}
                editable={true}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button variant="dark" className="px-8">
              <Link href={`${event.id}/qrcode`}>
                <span className="button justify-self-center">
                  Generate QR Code
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventIdPage;

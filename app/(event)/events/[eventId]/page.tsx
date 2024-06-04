import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { Banner } from "@/components/banner";
import { SessionsForm } from "@/components/sessions-form";
import { IconBadge } from "@/components/icon-badge";
import LocationForm from "@/components/location-form";
import { ImageForm } from "@/components/image-form";
import { TitleForm } from "@/components/title-form";
import { DescriptionForm } from "@/components/description-form";
import { EventTypeForm } from "@/components/event-type-form";
import { Actions } from "@/components/actions";
import { NextResponse } from "next/server";
import { DateRangeForm } from "@/components/event-date-form";

const EventPage = async ({ params }: { params: { eventId: number } }) => {
  const { userId } = auth();

  const user = await db.user.findUnique({
    where: {
      clerkId: userId || undefined,
    },
  });

  const event = await db.event.findUnique({
    where: {
      id: Number(params.eventId),
    },
    include: {
      sessions: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!event) {
    return redirect("/");
  }

  const eventTypes = await db.eventType.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const isEventCreator = event.userId === user?.id;

  return (
    <>
      {!isEventCreator && (
        <ImageForm initialData={event} eventId={event.id} editable={false} />
      )}
      <div className={`p-6 ${!isEventCreator ? "mt-6" : ""}`}>
        {isEventCreator && (
          <>
            {event.isOpen && (
              <Banner label="This event is public. It will be visible to all users." />
            )}
            {!event.isOpen && (
              <Banner label="This event is private. It will be visible to invited participants only." />
            )}
          </>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">{event.name}</h1>
            <span className="text-sm text-slate-700">{event.description}</span>
          </div>
          {isEventCreator && (
            <Actions eventId={params.eventId} isPublished={event.isPublished} />
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-16">
          <div className="p-6 flex justify-center">
            {isEventCreator && (
              <>
                <div className="flex items-center gap-x-2">
                  <h2 className="text-xl">Customize your event</h2>
                </div>
                <TitleForm
                  initialData={event}
                  eventId={event.id}
                  editable={isEventCreator}
                />
                <DescriptionForm
                  initialData={event}
                  eventId={event.id}
                  editable={isEventCreator}
                />
                <ImageForm
                  initialData={event}
                  eventId={event.id}
                  editable={isEventCreator}
                />
              </>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <SessionsForm
                initialData={event}
                eventId={event.id}
                editable={isEventCreator}
              />
            </div>
            <div className="space-y-6">
              <EventTypeForm
                initialData={event}
                eventId={event.id}
                options={eventTypes.map((eventType) => ({
                  label: eventType.name,
                  value: eventType.id,
                }))}
                editable={isEventCreator}
              />
            </div>
            <div className="space-y-6">
              <LocationForm
                initialData={event}
                eventId={event.id}
                editable={isEventCreator}
              />
            </div>
            <div className="space-y-6">
              <DateRangeForm
                initialData={event}
                eventId={event.id}
                editable={isEventCreator}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventPage;

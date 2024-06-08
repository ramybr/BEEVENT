import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { Banner } from "@/components/banner";
import { SessionsForm } from "@/components/sessions-form";
import { IconBadge } from "@/components/icon-badge";
import { ImageForm } from "@/components/image-form";
import { TitleForm } from "@/components/title-form";
import { DescriptionForm } from "@/components/description-form";
import { EventTypeForm } from "@/components/event-type-form";
import { Actions } from "@/components/actions";
import { NextResponse } from "next/server";
import { DateRangeForm } from "@/components/event-date-form";
import dynamic from "next/dynamic";

const LocationForm = dynamic(() => import("@/components/location-form"), {
  ssr: false,
});

const EventPage = async ({ params }: { params: { eventId: number } }) => {
  const { userId } = auth();

  const user = await db.user.findUnique({
    where: {
      clerkId: userId || undefined,
    },
  });

  if (!user) {
    return redirect("/");
  }

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
      participations: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  if (!event) {
    return redirect("/");
  }

  const eventTypes = await db.eventType.findMany({
    orderBy: {
      id: "asc",
    },
  });

  const isEventCreator = event.userId === user.id;
  const isParticipating = event.participations.length > 0;

  return (
    <>
      <div className="w-full">
        {!isEventCreator && (
          <div className="w-full">
            <ImageForm
              initialData={event}
              eventId={event.id}
              editable={false}
            />
          </div>
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
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">{event.name}</h1>
              <span className="text-sm text-slate-700">
                {event.description}
              </span>
            </div>
            <Actions
              eventId={params.eventId}
              isPublished={event.isPublished}
              isEventCreator={isEventCreator}
              isParticipating={isParticipating}
            />
          </div>
          <div
            className={`grid ${
              isEventCreator ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            } gap-6 mt-8`}
          >
            {isEventCreator && (
              <div className="flex flex-col space-y-6">
                <div>
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
                </div>
              </div>
            )}
            <div className="flex flex-col space-y-6">
              <div>
                <div>
                  <DateRangeForm
                    initialData={event}
                    eventId={event.id}
                    editable={isEventCreator}
                  />
                </div>
                <div>
                  <div>
                    <LocationForm
                      initialData={event}
                      eventId={event.id}
                      editable={isEventCreator}
                    />
                  </div>
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
                <SessionsForm
                  initialData={event}
                  eventId={event.id}
                  editable={isEventCreator}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventPage;

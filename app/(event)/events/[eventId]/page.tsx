import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ListChecks } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { VisibilityForm } from "@/components/visibility-form";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useTheme } from "next-themes";

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
      <div className="h-full">
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
          <Navbar />
        </div>
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
          <Sidebar />
        </div>

        <div className="md:pl-56 pt-[80px] h-full dark:text-bg2-contrast px-4 md:px-6">
          {!isEventCreator && (
            <div className="h-full">
              <ImageForm
                initialData={event}
                eventId={event.id}
                editable={false}
              />
            </div>
          )}
          <div>
            {isEventCreator && (
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
              </>
            )}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-4 px-2 md:px-6">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">{event.name}</h1>
                {!isEventCreator && (
                  <span className="text-sm text-slate-700 dark:text-bg1-contrast">
                    {event.description}
                  </span>
                )}
              </div>
              <Actions
                eventId={params.eventId}
                isPublished={event.isPublished}
                isEventCreator={isEventCreator}
                isParticipating={isParticipating}
              />
            </div>
            {isEventCreator && (
              <div className="flex items-center gap-x-2 pl-2 md:pl-6 mt-4 dark:bg-background-1st-level dark:text-bg1-contrast">
                <h2 className="text-xl text-slate-500">Customize your event</h2>
              </div>
            )}
            <div
              className={`grid ${
                isEventCreator ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              } gap-6 mt-8 px-2 md:px-6`}
            >
              <div className="flex flex-col space-y-6">
                {isEventCreator && (
                  <>
                    <div>
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
                    </div>
                    <ImageForm
                      initialData={event}
                      eventId={event.id}
                      editable={isEventCreator}
                    />
                  </>
                )}

                <VisibilityForm
                  initialData={event}
                  eventId={event.id}
                  editable={isEventCreator}
                />
                {/* {isEventCreator && (
                  <Button>
                    <Link href={`/user/events/${event.id}/qrcode`} replace>
                      <span className="button">Generate QR Code</span>
                    </Link>
                  </Button>
                )} */}
              </div>

              <div className="flex flex-col space-y-6 pl-0 md:pl-6">
                <div>
                  <div>
                    <DateRangeForm
                      initialData={event}
                      eventId={event.id}
                      editable={isEventCreator}
                    />
                  </div>
                  <div>
                    <EventTypeForm
                      initialData={event}
                      eventId={event.id}
                      options={eventTypes.map((eventType) => ({
                        label: eventType.name,
                        value: eventType.id,
                      }))}
                      editable={isEventCreator}
                    />
                    <LocationForm
                      initialData={event}
                      eventId={event.id}
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
      </div>
    </>
  );
};

export default EventPage;

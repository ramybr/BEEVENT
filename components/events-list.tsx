import { EventType, Event } from "@prisma/client";
import EventCard from "@/components/event-card";
import { auth } from "@clerk/nextjs";
import { getUserByClerkUserId } from "@/utils/userService";

type EventWithCategory = Event & {
  category: EventType | null;
  sessions: { id: number }[];
};

type EventsListProps = {
  items: EventWithCategory[];
};

const getStatus = (startDate: string, endDate: string): string => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) return "Upcoming";
  if (today > end) return "Past";
  return "Ongoing";
};

const { userId } = auth();
const user = await getUserByClerkUserId(userId!);

export const EventsList = ({ items }: EventsListProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-max auto-cols-max dark:bg-background-1st-level p-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col hover:scale-105 transition"
          >
            <EventCard
              id={item.id}
              name={item.name}
              imageUrl={item.imageUrl || "/images/upload-image.svg"}
              sessionsLength={item.sessions.length}
              category={item?.category?.name!}
              startDate={item.startDate || "Not set"}
              endDate={item.endDate || "Not set"}
              status={getStatus(item.startDate!, item.endDate!)}
              description={item.description || "No description"}
              isEventCreator={user?.id === item.userId}
            />
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-gray-500 mt-10">No Events</div>
      )}
    </>
  );
};

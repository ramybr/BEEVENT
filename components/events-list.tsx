import { EventType, Event } from "@prisma/client";
import { EventCard } from "@/components/event-card";

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

export const EventsList = ({ items }: EventsListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {items.map((item) => (
        <div key={item.id} className="hover:scale-105 transition">
          <EventCard
            id={item.id}
            name={item.name}
            imageUrl={
              item.imageUrl ||
              "https://utfs.io/f/7985b43d-e45f-47c0-ad5c-e22f87394619-gv5of9.png"
            }
            sessionsLength={item.sessions.length}
            category={item?.category?.name!}
            startDate={item.startDate || "Not set"}
            endDate={item.endDate || "Not set"}
            status={getStatus(item.startDate!, item.endDate!)}
          />
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center text-sm text-gray-500 mt-10">No Events</div>
      )}
    </div>
  );
};

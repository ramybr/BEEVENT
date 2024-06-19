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
              "https://utfs.io/f/e4e3daee-cb35-4c9b-a031-3f3f1a480ca2-l29tif.png"
            }
            sessionsLength={item.sessions.length}
            category={item?.category?.name!}
            startDate={item.startDate || "Not set"}
            endDate={item.endDate || "Not set"}
            status={getStatus(item.startDate!, item.endDate!)}
            description={item.description || "No description"}
          />
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center text-sm text-gray-500 mt-10">No Events</div>
      )}
    </div>
  );
};

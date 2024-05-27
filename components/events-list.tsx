import { EventType, Event } from "@prisma/client";
import { EventCard } from "@/components/event-card";

type EventWithCategory = Event & {
  category: EventType | null;
  sessions: { id: number }[];
};

type EventsListProps = {
  items: EventWithCategory[];
};

export const EventsList = ({ items }: EventsListProps) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <div className="hover:scale-105 transition">
          <EventCard
            key={item.id}
            id={item.id}
            name={item.name}
            imageUrl={item.imageUrl!}
            sessionsLength={item.sessions.length}
            category={item?.category?.name!}
          />
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No events found
        </div>
      )}
    </div>
  );
};

import { db } from "@/lib/db";
import { EventType, Event } from "@prisma/client";

type EventWithCategory = Event & {
  category: EventType | null;
  sessions: { id: number }[];
};

type GetEvents = {
  userId: number | undefined;
  title?: string;
  eventTypeId?: number;
};

export const getEvents = async ({
  userId,
  title,
  eventTypeId,
}: GetEvents): Promise<EventWithCategory[]> => {
  try {
    const events = await db.event.findMany({
      where: {
        isPublished: true,
        name: {
          contains: title,
        },
      },
      include: {
        eventType: true,
        sessions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const eventsWithCategory: EventWithCategory[] = await Promise.all(
      events.map(async (event) => {
        return {
          ...event,
          category: event.eventType,
        };
      })
    );

    return eventsWithCategory;
  } catch (error) {
    console.log("[GET_EVENTS]", error);
    return [];
  }
};

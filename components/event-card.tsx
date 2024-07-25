"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { formatDate } from "@/utils/format-date";

interface EventCardProps {
  id: number;
  name: string;
  imageUrl: string;
  sessionsLength: number;
  category: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  isEventCreator: boolean;
}

const EventCard = ({
  id,
  name,
  imageUrl,
  sessionsLength,
  category,
  startDate,
  endDate,
  status,
  description,
  isEventCreator,
}: EventCardProps) => {
  return (
    <Link href={`/events/${id}`}>
      <div className="group hover:shadow-lg transition overflow-hidden rounded-xl border-none shadow-lg dark:bg-background-2nd-level">
        <div className="relative w-full aspect-video rounded-t-2xl overflow-hidden mb-4 dark:mb-0">
          <Image
            fill
            className="object-cover"
            alt={name}
            src={imageUrl || "/images/upload-image.svg"}
          />
        </div>
        <div className="flex flex-col p-4 dark:bg-background-2nd-level min-w-sm">
          <div className="text-lg font-bold group-hover:text-primary transition line-clamp-1">
            {name}
          </div>
          <p className="text-sm text-gray-500 mb-2">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {sessionsLength} {sessionsLength === 1 ? "Session" : "Sessions"}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-x-2">
              <button
                className={`inline-block px-4 py-1 text-sm font-medium rounded-full ${
                  status === "Upcoming"
                    ? "bg-green-100 text-green-800 dark:bg-green-dark dark:text-background-2nd-level"
                    : status === "Past"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-magenta-dark dark:text-background-2nd-level"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-dark dark:text-background-2nd-level"
                }`}
              >
                {status}
              </button>
              <div className="flex flex-col">
                <strong>From :</strong> {formatDate(startDate)}
              </div>
              <div className="flex flex-col">
                <strong>To :</strong> {formatDate(endDate)}
              </div>
            </div>
          </div>
          <div className="text-slate-500 text-xs line-clamp-1 mb-4">
            {description}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between items-center">
            {isEventCreator && (
              <button className="inline-block px-4 py-2 text-sm font-medium rounded-full bg-secondary text-primary-foreground dark:bg-light-green-dark dark:text-background-2nd-level mb-2 sm:mb-0">
                My event
              </button>
            )}
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 dark:bg-bg1-contrast dark:text-background-2nd-level ml-auto">
              See details &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

interface EventCardProps {
  id: number;
  name: string;
  imageUrl: string;
  sessionsLength: number;
  category: string;
}

export const EventCard = ({
  id,
  name,
  imageUrl,
  sessionsLength,
  category,
}: EventCardProps) => {
  return (
    <Link href={`/events/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-auto">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={name} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {name}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {sessionsLength} {sessionsLength === 1 ? "Session" : "Sessions"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

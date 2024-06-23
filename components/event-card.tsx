import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

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
}

export const EventCard = async ({
  id,
  name,
  imageUrl,
  sessionsLength,
  category,
  startDate,
  endDate,
  status,
  description,
}: EventCardProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const event = await db.event.findUnique({
    where: {
      id: id,
    },
  });

  const isEventCreator = user.id === event?.userId;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (!date) {
      return "Not set";
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <Link href={`/events/${id}`}>
      <div className="group hover:shadow-lg transition overflow-hidden border rounded-xl  bg-white h-auto">
        <div className="relative w-full aspect-video rounded-t-lg overflow-hidden mb-4">
          <Image
            fill
            className="object-cover"
            alt={name}
            src={
              imageUrl ||
              "https://utfs.io/f/7985b43d-e45f-47c0-ad5c-e22f87394619-gv5of9.png"
            }
          />
        </div>
        <div className="flex flex-col pb-4 p-4">
          <div className="text-xl font-bold group-hover:text-sky-700 transition line-clamp-2">
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
          <div className=" flex justify-between text-sm text-gray-500 mb-4">
            <div>
              <button
                className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
                  status === "Upcoming"
                    ? "bg-green-100 text-green-800"
                    : status === "Past"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {status}
              </button>
            </div>

            <div>
              <strong>From :</strong> {formatDate(startDate)} <br />
              <strong>To :</strong> {formatDate(endDate)}
            </div>
          </div>
          <div className=" text-slate-500 text-sm tracking-tighter line-clamp-1 italic">
            {description}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-center mt-4">
              {isEventCreator && (
                <button className="inline-block px-4 py-2 text-sm font-medium rounded-full bg-secondary text-primary-foreground">
                  My event
                </button>
              )}
            </div>
            <div className="text-center mt-4">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90">
                See details &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

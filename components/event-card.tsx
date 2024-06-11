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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Link href={`/events/${id}`}>
      <div className="group hover:shadow-lg transition overflow-hidden border rounded-xl p-5 bg-white h-auto">
        <div className="relative w-full aspect-video rounded-t-lg overflow-hidden mb-4">
          <Image fill className="object-cover" alt={name} src={imageUrl} />
        </div>
        <div className="flex flex-col pb-4">
          <div className="text-xl font-semibold group-hover:text-sky-700 transition line-clamp-2">
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
          <div className="text-sm text-gray-500 mb-4">
            <strong>From :</strong> {formatDate(startDate) || "Not set"} <br />
            <strong>To :</strong> {formatDate(endDate) || "Not set"}
          </div>
          <div className="flex justify-between">
            <div className="text-center mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm">
                See details &gt;&gt;
              </button>
            </div>
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
          </div>
        </div>
      </div>
    </Link>
  );
};

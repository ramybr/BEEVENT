import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

const EventLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { eventId: number };
}) => {
  const { userId } = auth();

  if (!userId) {
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
    },
  });

  if (!event) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default EventLayout;

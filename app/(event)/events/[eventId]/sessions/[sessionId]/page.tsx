import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionTitleForm } from "@/components/session-title-form";
import { SessionDescriptionForm } from "@/components/session-description-form";

const ChapterIdPage = async ({
  params,
}: {
  params: { eventId: number; sessionId: number };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const session = await db.session.findUnique({
    where: {
      id: Number(params.sessionId),
      eventId: Number(params.eventId),
    },
  });

  if (!session) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/user/events/${params.eventId}`}
            className="flex items-center text-sm hover:opacity-75 transition
            mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Event setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2-xl font-medium">Session creation</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize session</h2>
            </div>
            <SessionTitleForm
              initialData={session}
              eventId={params.eventId}
              sessionId={params.sessionId}
            />
            <SessionDescriptionForm
              initialData={session}
              eventId={params.eventId}
              sessionId={params.sessionId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ChapterIdPage;

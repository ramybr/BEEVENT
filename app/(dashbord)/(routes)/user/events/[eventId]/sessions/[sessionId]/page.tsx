import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionTitleForm } from "@/components/session-title-form";
import { SessionDescriptionForm } from "@/components/session-description-form";
import { SessionActions } from "@/components/session-actions";
import { SessionTimeForm } from "@/components/session-time-form";
import { Button } from "@/components/ui/button";

const SessionIdPage = async ({
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
      <div className="flex justify-end  ">
        <div className="flex flex-col items-center">
          <Button variant="ghost-dark" className="text-center mb-2">
            <Link
              href={`/user/events/${params.eventId}`}
              className="flex items-center text-md hover:opacity-75 transition
              "
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Event setup
            </Link>
          </Button>
          <SessionActions
            eventId={params.eventId}
            sessionId={params.sessionId}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
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
              editable={true}
            />
            <SessionTimeForm
              initialData={session}
              eventId={params.eventId}
              sessionId={params.sessionId}
              editable={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionIdPage;

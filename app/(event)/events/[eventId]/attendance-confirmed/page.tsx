import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const AttendanceConfirmedPage = () => {
  return (
    <div className="flex gap-4 items-center justify-center h-screen w-auto">
      <Card className=" flex flex-col gap-4 p-4 justify-center items-center">
        <h1 className="text-2xl">Attendance Confirmed</h1>
        <p className="text-sm">
          Your attendance has been confirmed. You may proceed to the event.
        </p>
        <Link href="/search">
          <Button>Explore More Events</Button>
        </Link>
      </Card>
    </div>
  );
};

export default AttendanceConfirmedPage;

import { db } from "@/lib/db";
import { Categories } from "@/components/categories";
import { SearchInput } from "@/components/search-input";
import { getEvents } from "@/actions/get-events";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { EventsList } from "@/components/events-list";
import { Sidebar } from "lucide-react";

type SearchPageProps = {
  searchParams: {
    title: string;
    eventTypeId: number;
  };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  // const { userId } = auth();
  // if (!userId) {
  //   return redirect("/");
  // }

  // const user = await db.user.findUnique({
  //   where: {
  //     clerkId: userId!,
  //   },
  // });

  const categories = await db.eventType.findMany({
    orderBy: {
      id: "asc",
    },
  });

  const events = await getEvents({
    // userId: user?.id,
    ...searchParams,
  });

  return (
    <>
      <div className="flex md:justify-center px-6 pt-6 md:hidden md:mb-0 dark:bg-background-2nd-level">
        <SearchInput />
      </div>

      <div className=" p-2 space-y-4 shadow-md sticky top-0 z-10 dark:bg-background-2nd-level">
        <Categories items={categories} />
      </div>

      <div className="md:mx-10 p-10 mx-10 space-y-4  shadow-inner rounded-sm h-full dark:bg-background-1st-level dark:shadow-none">
        <div>
          <EventsList items={events} />
        </div>
      </div>
    </>
  );
};

export default SearchPage;

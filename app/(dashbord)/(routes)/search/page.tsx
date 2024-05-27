import { db } from "@/lib/db";
import { Categories } from "@/components/categories";
import { SearchInput } from "@/components/search-input";
import { getEvents } from "@/actions/get-events";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { EventsList } from "@/components/events-list";

type SearchPageProps = {
  searchParams: {
    title: string;
    eventTypeId: number;
  };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  const categories = await db.eventType.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const events = await getEvents({
    userId: user?.id,
    ...searchParams,
  });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <EventsList items={events} />
      </div>
    </>
  );
};

export default SearchPage;

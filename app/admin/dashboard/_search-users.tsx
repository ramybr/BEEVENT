"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export const SearchUsers = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const formData = new FormData(form);
          const queryTerm = formData.get("search") as string;
          router.push(pathname + "?search=" + queryTerm);
        }}
      >
        <div className="mt-2">
          <label htmlFor="search">Search for Users</label>
        </div>
        <div className="px-6 pt-6 md:mb-0">
          <input
            id="search"
            name="search"
            type="text"
            className="block w-max rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none   disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" className="mt-2">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

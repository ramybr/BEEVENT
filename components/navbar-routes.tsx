"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Ghost, LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isUserPage = pathname?.startsWith("/user");
  const isEventPage = pathname?.includes("/events");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isUserPage || isEventPage ? (
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 mr-2 w-4" />
              Back
            </Button>
          </Link>
        ) : (
          <Link href="/user/create">
            <Button size="sm" variant="ghost">
              Create your event
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

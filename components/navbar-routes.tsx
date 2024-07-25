"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { ModeToggle } from "./ui/mode-toggle";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isUserPage = pathname?.startsWith("/user");
  const isEventPage = pathname?.includes("/events");
  const isSearchPage = pathname === "/search";
  const isProfilePage = pathname?.includes("/profile");

  const { theme, resolvedTheme } = useTheme();
  const { isSignedIn } = useAuth();

  type ButtonVariant =
    | "default"
    | "link"
    | "ghost-dark"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";

  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("ghost");

  useEffect(() => {
    const currentTheme: ButtonVariant =
      theme === "dark" || resolvedTheme === "dark" ? "ghost-dark" : "ghost";
    setButtonVariant(currentTheme);
  }, [theme, resolvedTheme]);

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block md:mr-36">
          <SearchInput />
        </div>
      )}
      <div className="flex items-center gap-x-2 ml-auto md:ml-48">
        {isUserPage || isEventPage ? (
          <Link href="/search">
            <Button size="sm" variant={buttonVariant} className="md:mr-2">
              <HomeIcon className="h-4 mr-2 w-4" />
              Home
            </Button>
          </Link>
        ) : (
          <Link href="/user/create">
            <Button size="sm" variant={buttonVariant}>
              Create your event
            </Button>
          </Link>
        )}
        {isSignedIn && !isProfilePage && (
          <Link href="/user/profile">
            <Button variant={buttonVariant}>Profile</Button>
          </Link>
        )}
        {isProfilePage && <ModeToggle />}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

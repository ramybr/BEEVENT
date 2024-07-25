"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Header = () => {
  const { theme, resolvedTheme } = useTheme();

  type ButtonVariant =
    | "default"
    | "link"
    | "ghost-dark"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";

  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("ghost");

  const { isSignedIn } = useAuth();

  useEffect(() => {
    const currentTheme: ButtonVariant =
      theme === "dark" || resolvedTheme === "dark" ? "ghost-dark" : "ghost";
    setButtonVariant(currentTheme);
  }, [theme, resolvedTheme]);

  return (
    <header className="w-full pb-4 shadow-md dark:bg-background-1st-level">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
          EventManager
        </h1>
        <nav className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {isSignedIn && (
            <Link href="/user/profile">
              <Button variant={buttonVariant}>Profile</Button>
            </Link>
          )}
          <UserButton afterSignOutUrl="/" />
          <SignedOut>
            <SignInButton>
              <Button variant={buttonVariant}>Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="dark">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
};

export default Header;

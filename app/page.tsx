"use client";

import Link from "next/link";
import FeatureCard from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/header";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const HomePage = () => {
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

  useEffect(() => {
    const currentTheme: ButtonVariant =
      theme === "dark" || resolvedTheme === "dark" ? "ghost-dark" : "ghost";
    setButtonVariant(currentTheme);
  }, [theme, resolvedTheme]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Header />
      <div className="min-h-screen pt-8 flex flex-col justify-center items-center dark:bg-background-2nd-level">
        <main className="container mx-auto px-4 py-12 text-center dark:text-bg1-contrast">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Welcome to EventManager
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-12 dark:text-bg1-contrast">
            Manage and explore events effortlessly. Create, update, and share
            your events with ease.
          </p>

          <div className="grid grid-cols-1  md:grid-cols-3 gap-8 dark:bg-background-2nd-level">
            <FeatureCard
              title="Create Events"
              description="Easily create events with detailed information and images."
              imageSrc="/images/create.svg"
            />
            <FeatureCard
              title="Manage Your Events"
              description="Update, publish, or delete your events as needed."
              imageSrc="/images/manage.svg"
            />
            <FeatureCard
              title="Explore Events"
              description="Search and explore events created by others."
              imageSrc="/images/explore.svg"
            />
          </div>

          <div className="mt-12">
            <Link href="/search">
              <Button size="lg" variant={buttonVariant} className="text-lg">
                Explore Events
              </Button>
            </Link>
          </div>
        </main>

        <footer className="w-full py-6 bg-white shadow-md mt-auto dark:bg-background-2nd-level">
          <div className="container mx-auto text-center">
            <div className="flex justify-center items-center"></div>
            <p className="text-gray-700 mt-4 dark:text-bg1-contrast">
              © 2024 EventManager. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;

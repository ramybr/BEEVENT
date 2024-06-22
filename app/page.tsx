import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import FeatureCard from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/header";

const HomePage = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <Header />
        <main className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-4xl font-semibold mb-6">
            Welcome to EventManager
          </h2>
          <p className="text-lg text-gray-700 mb-12">
            Manage and explore events effortlessly. Create, update, and share
            your events with ease.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Create Events"
              description="Easily create events with detailed information and images."
              imageSrc="/images/create-events.png"
            />
            <FeatureCard
              title="Manage Your Events"
              description="Update, publish, or delete your events as needed."
              imageSrc="/images/manage-events.png"
            />
            <FeatureCard
              title="Explore Events"
              description="Search and explore events created by others."
              imageSrc="/images/explore-events.png"
            />
          </div>

          <div className="mt-12">
            <Link href="/search">
              <Button size="lg">Explore Events</Button>
            </Link>
          </div>
        </main>

        <footer className="w-full py-6 bg-white shadow-md mt-auto">
          <div className="container mx-auto text-center">
            <p className="text-gray-700">
              © 2024 EventManager. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default HomePage;

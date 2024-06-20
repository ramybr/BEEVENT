import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full py-6 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">EventManager</h1>
        <nav className="space-x-4">
          <UserButton afterSignOutUrl="/" />
          <SignedOut>
            <SignInButton>
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Header;

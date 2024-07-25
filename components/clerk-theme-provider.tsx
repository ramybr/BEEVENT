"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark, experimental__simple, shadesOfPurple } from "@clerk/themes";

const ClerkThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(296, 52%, 30%)",
        },
        baseTheme: theme === "dark" ? dark : experimental__simple,
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkThemeProvider;

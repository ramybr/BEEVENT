import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getUserByClerkUserId } from "@/utils/userService";

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
  console.log("userId", userId);
  return { userId };
};

export const ourFileRouter = {
  eventImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

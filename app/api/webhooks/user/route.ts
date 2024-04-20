import { PrismaClient } from "@prisma/client";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  // if (!id) {
  //   console.error("Error: id is undefined");
  //   return new Response("Error occured", { status: 400 });
  // }

  switch (eventType) {
    case "user.created":
      if (id) {
        const newUser = await prisma.user.create({
          data: {
            clerkId: id,
            firstName: evt.data.first_name,
            lastName: evt.data.last_name,
            email: evt.data.email_addresses[0]?.email_address,
          },
        });
        console.log("Created new user:", newUser);
      } else {
        console.error("Error: id is undefined");
      }
      break;
    case "user.updated":
      // Get the user from the database using the clerkId
      const user = await prisma.user.findFirst({
        where: { clerkId: id },
      });

      if (user) {
        // If the user exists, update their data
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            firstName: evt.data.first_name,
            lastName: "test",
            email: evt.data.email_addresses[0]?.email_address,
          },
        });
        console.log("Updated user:", updatedUser);
      } else {
        console.error("Error: User not found");
      }
      break;
    case "user.deleted":
      // Get the user from the database using the clerkId
      const userToDelete = await prisma.user.findFirst({
        where: { clerkId: id },
      });
      console.log(userToDelete);

      if (userToDelete) {
        // If the user exists, delete them from the database
        const deletedUser = await prisma.user.delete({
          where: { id: userToDelete.id },
        });
        console.log("Deleted user:", deletedUser);
      } else {
        console.error("Error: User not found");
      }
      break;
    // ...
  }

  return new Response("", { status: 200 });
}

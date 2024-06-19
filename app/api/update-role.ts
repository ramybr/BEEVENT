// pages/api/set-role.ts

import { NextApiRequest, NextApiResponse } from "next";
import { clerkClient } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id, role } = req.body;

  if (!id || !role) {
    return res.status(400).json({ message: "Invalid request payload" });
  }

  try {
    // Update role in Clerk
    await clerkClient.users.updateUser(id, {
      publicMetadata: { role },
    });

    // Update role in PostgreSQL database
    await prisma.user.update({
      where: { clerkId: id },
      data: { role },
    });

    return res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

"use server";

import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function setRole(formData: FormData) {
  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await clerkClient.users.updateUser(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      }
    );

    const updatedRole = await db.user.update({
      where: {
        clerkId: formData.get("id") as string,
      },
      data: {
        role: formData.get("role") as string,
      },
    });
    return { message: res.publicMetadata, updatedRole };
  } catch (err) {
    return { message: err };
  }
}

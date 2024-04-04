import { db } from "@/lib/db";
import { Participation } from "@prisma/client";

type GetUserParticipationsProps = {
  userId: string;
};

export const getUserParticipations = async ({
  userId,
  
}: GetUserParticipationsProps) => {
  try {
    let participations: Participation[] = [];
    participations = await db.participation.findMany({
      where: {
        userId,
      },
      include: {
        event: true,
      },
    });
    return participations;
  } catch (error) {
    console.error("[User Participations]", error);
    throw new Error("Failed to fetch user participations");
  }
};

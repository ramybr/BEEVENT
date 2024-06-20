import { db } from "@/lib/db";
import { Event, Participation, Attendance } from "@prisma/client";

type ParticipationWithEvent = Participation & {
  event: Event;
};

type AttendanceWithEvent = Attendance & {
  event: Event;
};

const groupByEvent = (
  participations: ParticipationWithEvent[],
  attendances: AttendanceWithEvent[]
) => {
  const grouped: {
    [eventName: string]: { participations: number; attendances: number };
  } = {};

  participations.forEach((participation) => {
    const eventName = participation.event.name;
    if (!grouped[eventName]) {
      grouped[eventName] = { participations: 0, attendances: 0 };
    }
    grouped[eventName].participations += 1;
  });

  attendances.forEach((attendance) => {
    const eventName = attendance.event.name;
    if (!grouped[eventName]) {
      grouped[eventName] = { participations: 0, attendances: 0 };
    }
    grouped[eventName].attendances += 1;
  });

  return grouped;
};

export const getAnalytics = async (userId: number) => {
  try {
    const participations = await db.participation.findMany({
      where: {
        event: {
          userId: userId,
        },
      },
      include: {
        event: true,
      },
    });
    const attendances = await db.attendance.findMany({
      where: {
        event: {
          userId: userId,
        },
      },
      include: {
        event: true,
      },
    });

    const groupedData = groupByEvent(participations, attendances);
    const data = Object.entries(groupedData).map(([eventName, values]) => ({
      name: eventName,
      participations: values.participations,
      attendances: values.attendances,
      attendanceRate:
        values.participations > 0
          ? (values.attendances / values.participations) * 100
          : 0,
    }));

    const totalParticipations = participations.length;
    const totalAttendances = attendances.length;
    const totalAttendanceRate =
      totalParticipations > 0
        ? (totalAttendances / totalParticipations) * 100
        : 0;

    return {
      data,
      totalParticipations,
      totalAttendances,
      totalAttendanceRate,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalParticipations: 0,
      totalAttendances: 0,
      totalAttendanceRate: 0,
    };
  }
};

// /app/api/send-invitation/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend("RESEND_API_KEY");

export async function POST(request: NextRequest) {
  const { email, eventId, eventName } = await request.json();

  if (!email || !eventId || !eventName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await resend.emails.send({
      from: "your-email@example.com",
      to: email,
      subject: `Invitation to ${eventName}`,
      html: `<p>You have been invited to the event: ${eventName}.</p>
             <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventId}">Click here to view the event</a></p>`,
    });

    return NextResponse.json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    );
  }
}

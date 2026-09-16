import { NextResponse } from "next/server";

/**
 * Assessment submissions land here.
 *
 * Nothing is persisted yet — wire this up to whichever of these you use:
 *   - Email:  Resend, SendGrid, Postmark
 *   - CRM:    HubSpot, Pipedrive, Zoho
 *   - Sheet:  Google Sheets API
 *   - DB:     Vercel Postgres, Supabase
 *
 * Keep API keys in environment variables (Vercel → Settings → Environment Variables).
 * Never commit them.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Example with Resend — install `resend`, set RESEND_API_KEY, then uncomment:
    //
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "assessment@skyvis.mn",
    //   to: "hello@skyvis.mn",
    //   subject: `New assessment — ${payload.company?.company ?? "Unknown company"}`,
    //   text: JSON.stringify(payload, null, 2),
    // });

    console.log("Assessment submission:", JSON.stringify(payload));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
}

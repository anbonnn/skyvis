import { notFound } from "next/navigation";
import { sql } from "@vercel/postgres";
import { Wordmark } from "@/components/Wordmark";
import { AcceptInviteForm } from "./AcceptInviteForm";

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { rows } = await sql`
    SELECT i.id, i.email, i.job_role, i.department, i.accepted_at, i.expires_at,
           c.name AS company_name
    FROM invitations i
    JOIN companies c ON c.id = i.company_id
    WHERE i.token = ${token}
    LIMIT 1
  `;

  const invite = rows[0];
  if (!invite) notFound();

  const expired = new Date(invite.expires_at) < new Date();
  const used = Boolean(invite.accepted_at);

  return (
    <main className="mx-auto max-w-[460px] px-6 py-16">
      <Wordmark href="/" />
      {used || expired ? (
        <>
          <h1 className="mt-10 text-[1.7rem]">
            {used ? "This invitation has been used" : "This invitation has expired"}
          </h1>
          <p className="lede mt-3">
            Ask whoever invited you to send a new one.
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-10 text-[1.7rem]">Join {invite.company_name}</h1>
          <p className="lede mt-3">
            You&apos;ve been invited to complete the SKYVIS assessment for {invite.company_name}.
            Set a password to get started.
          </p>
          <AcceptInviteForm
            token={token}
            email={invite.email}
            jobRole={invite.job_role}
            department={invite.department}
          />
        </>
      )}
    </main>
  );
}

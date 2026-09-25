# SKYVIS — deployment and setup

Next.js 16 · React 19 · TypeScript · Tailwind · Auth.js v5 · Vercel Postgres

## 1. Create the database

In your Vercel project: **Storage → Create Database → Postgres**, then connect it to the
project. (Vercel now provisions Postgres through the marketplace — Neon is the usual
provider. Either way you get a `POSTGRES_URL` environment variable, which is all this app
needs.)

## 2. Environment variables

Set these in **Vercel → Settings → Environment Variables**:

| Variable | What it is |
| --- | --- |
| `POSTGRES_URL` | Added automatically when you connect the database |
| `AUTH_SECRET` | Session signing key. Generate with `npx auth secret` |
| `AUTH_TRUST_HOST` | Set to `true` |
| `SETUP_SECRET` | Any long random string. Used once, in step 3 |
| `STAFF_EMAIL` | Your email — becomes the first SKYVIS staff account |
| `STAFF_PASSWORD` | A strong password, at least 10 characters |

Generate the secrets yourself and let Vercel store them. Don't commit them, and don't
paste them into a chat.

## 3. Create the tables

Deploy, then call the setup endpoint once:

```bash
curl -X POST https://your-domain.vercel.app/api/setup \
  -H "x-setup-secret: YOUR_SETUP_SECRET"
```

This creates every table and your staff account. **Then delete `STAFF_EMAIL`,
`STAFF_PASSWORD` and `SETUP_SECRET` from Vercel** and redeploy — they're single-use.

## 4. Check it works

- `/register` — register a test company
- `/dashboard` — create an assessment, invite yourself a colleague
- `/admin` — sign in with your staff account; every company appears here

## Roles

| Role | Sees |
| --- | --- |
| `member` | Their own company's assessments; completes responses |
| `company_admin` | The above, plus invites colleagues and creates assessments |
| `staff` | `/admin` — every registered company, their people and their answers |

Registering a company makes that first user a `company_admin`. Invited colleagues are
`member`. `staff` is only created by the setup endpoint, or by updating the row directly.

## Still to wire up

**Invitation emails.** Invitations generate a working link but nothing sends it — the
inviter copies the link from the screen. To send automatically, add
[Resend](https://resend.com), set `RESEND_API_KEY`, and send the link from
`app/api/invitations/route.ts` where the comment marks the spot.

**Password reset.** There is no reset flow yet. A forgotten password currently needs a
manual database update.

**Rate limiting.** `/api/register` and the login route have no throttling. Before you
promote this publicly, add Vercel's firewall rules or an Upstash rate limiter — otherwise
login is open to unlimited password guessing.

## What the assessment does now

Signed-in users answer against a company assessment; progress autosaves every question,
so a long instrument can be paused and resumed. On submission the response is scored per
dimension and stored.

With two or more respondents the results page shows **where they disagree** — the spread
between the highest and lowest score on each dimension. That divergence is usually more
diagnostic than the average: when leadership and operational staff describe the same
capability a full level apart, the gap is the finding.

Signed-out visitors can still take the public self-assessment; nothing is stored.

---

## Business map — migration

The map adds three tables: `org_nodes`, `processes`, `process_steps`. They are in
`lib/schema.sql`, which uses `create table if not exists`, so re-running setup is safe
and will not touch your existing data.

1. In Vercel, temporarily re-add `SETUP_SECRET` with any long random string.
2. Redeploy so the variable reaches the running build.
3. Run it once:

```bash
curl -X POST https://skyvis.vercel.app/api/setup \
  -H "x-setup-secret: YOUR_SETUP_SECRET"
```

4. Delete `SETUP_SECRET` again and redeploy.

Then open `/dashboard/map`.

## Using the map

**Structure tab.** Add the company node first — everything hangs from it. Then
departments, teams and positions. Each level has its own shape: hexagon, square,
triangle, circle.

Tick *Required by policy, not staffed* for a role a policy demands but nobody holds. It
draws hollow and dashed, so the gap between the declared organization and the real one
is visible rather than argued about.

**Process tab.** Create a process, then add steps in order. Each step records who does
it, what they actually do, which system carries it, and any timing rule.

The *how it's carried* field is the one that matters. "No system" and "Excel" are
different findings: one usually needs an owner or a policy, the other needs a tool. Get
this wrong and the diagnosis collapses — if everything is marked as a system, nothing
looks wrong.

Steps whose owner was deleted show as *no owner*, which is a finding rather than a bug.

**Permissions.** Company admins and SKYVIS staff can edit. Members can view.

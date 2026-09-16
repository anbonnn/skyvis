# SKYVIS

Corporate site for SKYVIS — business assessment, digital transformation, and technology
development. Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, lucide icons.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Create a new repository on GitHub and push this folder:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/skyvis.git
   git push -u origin main
   ```

2. Go to vercel.com → **Add New → Project** → import the repository.
3. Vercel detects Next.js automatically. No build settings to change. Click **Deploy**.
4. Add your domain under **Settings → Domains** once you have it.

## Project structure

```
app/
  layout.tsx              Fonts, metadata, global CSS
  page.tsx                Home page — composes every section
  globals.css             Design tokens and shared component classes
  assessment/page.tsx     The seven-step assessment wizard
  api/assessment/route.ts Submission endpoint (stub — see below)
  sitemap.ts, robots.ts   SEO

components/
  Navbar, Hero, ProblemSection, AssessmentSection, ServicesSection,
  MethodologySection, ValueSection, IndustriesSection, CaseStudySection,
  AboutSection, InsightsSection, CTASection, Footer
  Reveal.tsx              Scroll-reveal wrapper
  Counter.tsx             Animated number counter
  RadarChart.tsx          Maturity radar + score bars
  Wordmark.tsx            Logo
  assessment/
    AssessmentWizard.tsx  Wizard state, scoring, navigation
    steps.ts              All 24 questions and their dimension mapping
    ResultPanel.tsx       Score, radar, and narrative

lib/
  dimensions.ts           The ten dimensions, demo scores, maturity bands
  utils.ts                cn() class helper
```

## Design tokens

All colour, typography and elevation values live as CSS custom properties in
`app/globals.css` and are exposed to Tailwind in `tailwind.config.ts`. Change the brand
colour in one place:

```css
--ink: #08152b;   /* midnight navy */
--sky: #1e8bf5;   /* accent */
```

Dark mode follows the visitor's system setting automatically.

## The assessment

24 questions across six steps, each mapped to one of the ten maturity dimensions in
`lib/dimensions.ts`. Scores are averaged per dimension and rendered as a radar chart plus a
narrative that changes with the maturity band.

To change the questions, edit `components/assessment/steps.ts`. Each question declares the
dimension it feeds via its `dim` field — the scoring picks that up automatically.

## Before you launch

- [ ] **Wire up submissions.** `app/api/assessment/route.ts` currently only logs. Connect
      Resend, HubSpot, or Google Sheets. Put keys in Vercel environment variables.
- [ ] **Replace the case study metrics.** The 300 outlets / 40% figures are illustrative and
      labelled as such on the page. Swap in verified, client-approved results.
- [ ] **Write the insights articles.** Three cards currently link to anchors.
- [ ] **Add an OG image** at `public/og.png` (1200×630) and reference it in `app/layout.tsx`.
- [ ] **Update the domain** in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` — all
      three currently assume `skyvis.mn`.
- [ ] **Check the trademark.** Register SKYVIS in Mongolia and your target markets before
      printing anything.

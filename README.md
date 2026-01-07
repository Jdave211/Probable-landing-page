# Probable Landing Page

This repo contains the **marketing + lead-capture landing page** for **Probable**.

Probable is building a **decision intelligence layer on top of prediction markets**—turning real‑time market probabilities into:
- **Signals**: what to watch (industry + macro + policy)
- **Meaning**: why odds are moving (drivers + what could change next)
- **Action**: what to do (decision options + hedges + alerts)

The landing page showcases that end-to-end story and captures:
- **Waitlist signups** (stored in Supabase)
- **Demo requests** (stored in Supabase)

---

## What this landing page includes

- **Hero**: Flip-words headline + primary CTA (Join Waitlist) + secondary CTA (Schedule Demo)
- **How it works**: Embedded product walkthrough video (YouTube embed; no large video files committed)
- **Personas + social proof**: scrolling personas + “Trusted by” logos
- **Examples**: hedging cards (mobile uses lightweight static images; desktop uses animation)
- **Global section**: world map visualization (disabled on mobile for performance)

---

## Tech stack

- **Vite + React**
- **Supabase** for lead capture
- **Framer Motion** for UI motion

---

## Getting started (local dev)

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: where “Product” links should point (chat/pricing/etc.)
VITE_PRODUCT_APP_URL=http://localhost:5174

# Optional: only used if you wire lead capture via an API proxy instead of Supabase direct
VITE_API_URL=
```

### 3) Run the dev server

```bash
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173/`).

---

## Supabase (waitlist + demo requests)

### Tables used

- **`waitlist_users`**: waitlist signups
- **`demo_requests`**: demo/scheduling requests

### Migration for `waitlist_users`

This repo includes a migration that creates `waitlist_users`:

- `supabase/migrations/20260106120000_create_waitlist_users.sql`

It creates the table + a **unique index on `email`** (for dedupe/upserts) and enables RLS with a public insert policy.

### Apply migrations

If you use the Supabase CLI:

```bash
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

If you don’t want to use the CLI, copy/paste the SQL in
`supabase/migrations/20260106120000_create_waitlist_users.sql` into the **Supabase SQL Editor** and run it.

---

## Lead capture flows

### Waitlist

- UI: `src/components/WaitlistModal.jsx`
- Supabase write: `src/services/leadsSupabase.js` → `submitWaitlistToSupabase()`
- Table: `waitlist_users`

Notes:
- Email is normalized to lowercase.
- Uses an upsert on `email` to prevent duplicates (requires unique index/constraint).
- Success UX is **inside the modal only** (modal shows success + closes shortly after).

### Demo requests (Schedule Demo)

- Page: `src/pages/Support.jsx`
- Supabase write: `src/services/leadsSupabase.js` → `submitDemoRequestToSupabase()`
- Table: `demo_requests`
- Optionally invokes an edge function `send-demo-request` (best effort; doesn’t block success)

---

## Performance notes

This landing page is intentionally animation-heavy on desktop, but mobile uses a lighter path:
- Expensive background animations are disabled on mobile.
- World map is disabled on mobile.
- Hedging card animation is replaced with static images on mobile.

---

## Scripts

- `npm run dev`: start Vite dev server
- `npm run build`: production build
- `npm run preview`: preview production build
- `npm run lint`: lint

---

## Deployment

This is a standard Vite SPA. Typical deployment options:
- **Netlify** (see `netlify.toml`)
- Vercel / Cloudflare Pages / any static host

Make sure you set the same `VITE_*` environment variables in your hosting provider.


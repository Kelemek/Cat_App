# Ragdoll diary

A private Next.js app for ragdoll cat guardians: a **diary** with dated photos and written memories, plus a **structured symptom journal**. Access is gated with a single site password (no user accounts).

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project

## Setup

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy environment variables and fill them in:

   ```bash
   cp .env.example .env.local
   ```

   - `SITE_PASSWORD`: password you type on `/login`.
   - `AUTH_SECRET`: long random string (16+ characters) used to sign the session cookie.
   - `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: from the Supabase project API settings. Use the **service role** key only on the server (already limited to server actions and data helpers in this repo—never expose it in client code).

3. Apply the database migration in the Supabase SQL editor (or via the Supabase CLI), using the file:

   `supabase/migrations/20260421120000_init.sql`

   This creates the `diary_day`, `diary_photo`, and `symptom_entry` tables, enables row-level security (no policies, so the data API is closed to anon/authenticated clients), and registers the private `diary-photos` storage bucket with a 5 MB limit and image MIME allowlist.

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000), sign in with `SITE_PASSWORD`, then use **Diary** and **Symptom journal**.

## How it works

- **Auth**: Middleware checks a signed JWT stored in an httpOnly cookie after you submit the site password.
- **Data & files**: Server actions use the Supabase service role to read/write Postgres and upload/delete objects in the `diary-photos` bucket. Diary images are served via short-lived signed URLs. On upload, images are re-encoded as **WebP** (quality ~82) at the **same dimensions** as the source after EXIF rotation (no cropping or scaling); GIFs become animated WebP when Sharp supports it, otherwise the first frame.

## Scripts

- `npm run dev` — development server (Turbopack)
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint

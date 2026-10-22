# CaseSaarthi

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Sign-in

The prototype demo login checks credentials in the browser only. It is not secure authentication and cannot create database records. The credentials are displayed on the login screen:

- Email: `demo@casesaarthi.local`
- Password: `SaarthiDemo2026!`

Create real users in Supabase Authentication to use database-backed reads and complaint creation. Sign in with that user's email and password in the same login form. Sign-in state and the Supabase Auth session are managed by the Supabase client.

## Supabase database foundation

Copy `.env.example` to `.env.local` and set the project URL and publishable/anon key to enable the Supabase client. Apply the SQL migrations in `supabase/migrations/` to the project. Database reads and complaint writes require a Supabase Auth session.

### Enable complaint creation

1. Add a user in **Supabase Dashboard → Authentication → Users** (or use your existing Auth user).
2. Apply `supabase/migrations/20261023000000_authenticated_complaint_insert.sql` in the Supabase SQL Editor. This grants only the complaint fields used by the form and restricts inserts to authenticated sessions with row-level security.
3. Apply `supabase/migrations/20261024000000_authenticated_complaint_updates.sql` to allow authenticated users to update only the complaint Bureau and status fields.
4. Complaint creation requires the selected institution ID to already exist in `public.institutions`. If that institution is not present, the form shows a clear error and does not add a fake local complaint.
5. Run the app with `npm.cmd run dev`, sign in with the Supabase Auth user, then use **Complaints → Register complaint**. Open a complaint detail to update its Bureau or status. The prototype demo login continues to work, but it is read-only when Supabase is configured.

Do not apply a migration or import institutions unless you are ready to make those database changes. The app does not seed institutions automatically.

### Password recovery links

The login screen sends recovery email requests through Supabase Auth with a redirect to `/reset-password` on the origin currently used to open the app. The reset page requires a Supabase recovery session and updates the password through Supabase Auth.

In Supabase Dashboard, open **Authentication → URL Configuration**:

- Set **Site URL** to the actual deployed CaseSaarthi origin (for example, `https://casesaarthi.example.org`), not `localhost`.
- Under **Redirect URLs**, add the exact production callback URL: `https://<your-deployed-domain>/reset-password`.
- For desktop local development, allow `http://localhost:5173/reset-password` and `http://127.0.0.1:5173/reset-password`.
- To test recovery on a phone over the same Wi-Fi, start Vite bound to the local network with `npm.cmd run dev -- --host 0.0.0.0`, find the laptop IPv4 address using `ipconfig`, then open `http://<laptop-ipv4>:5173` on both laptop and phone. Add the exact callback URL `http://<laptop-ipv4>:5173/reset-password` to Redirect URLs. The phone cannot reach a link that points to the phone's own `localhost`; allow Vite through Windows Firewall if prompted.

Request the recovery email from the same origin you intend to open the link on. For production, visit the deployed CaseSaarthi URL first and request the email there.

### Seed the mock institution and complaint data (Windows)

The existing seed script is `scripts/seed-mock-data.js`. It reads the unchanged arrays from `src/data/mockData.js`, checks that every complaint references an institution in that data, then upserts institutions by `id` and complaints by `id`. It does not delete or truncate records. Running it again updates those same mock IDs; unrelated IDs are not targeted. Matching existing IDs are updated with the mock values.

1. In VS Code, open the project folder `C:\Users\Vedant\CaseSaarthi`.
2. Open **Terminal → New Terminal**. Check that the terminal is at the project root (the prompt should end in `CaseSaarthi`).
3. Create the private seed environment file from the checked-in template:

   ```powershell
   Copy-Item .env.seed.example .env.seed.local
   ```

4. Open `.env.seed.local` in VS Code and set these variables:

   ```text
   SUPABASE_URL=<your Supabase project URL>
   SUPABASE_SERVICE_ROLE_KEY=<your private service-role or secret key>
   ```

   Use the project's actual URL and its service-role or secret key from Supabase Project Settings → API Keys. Do not paste the key into chat, commit this file, or use a `VITE_` prefix. Do not use the publishable/anon key or a session JWT; those are not the server-side seed key. The existing `.env` frontend URL and publishable key are not sufficient for this seed script. `.env.seed.local` is excluded by `.gitignore`.

5. From the same project-root terminal, run:

   ```powershell
   npm.cmd run seed:mock
   ```

The script should report the number of institution and complaint records seeded. It writes only the mock IDs it knows about. Do not run this command until you are ready for the existing rows with those IDs to be updated to match the mock dataset.

The service-role/secret key bypasses row-level security, so keep it local and private. The seed script first makes a harmless read-only access check and stops before writing if Supabase rejects the key. It then upserts only the known mock institution and complaint IDs; it does not delete unrelated rows. The seed script is for this one-time data import; it does not enable browser writes. The application continues to use mock data for its demo login because that login is not a Supabase Auth session.

Authenticated users can create complaints and update their Bureau assignment or status in Supabase. The application does not currently write complaint activity events, SLA tracking, overlap detection, or confirmed-relationship changes.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

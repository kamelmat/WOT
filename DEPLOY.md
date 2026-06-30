# WOT — Deploy

Frontend on **Vercel**, backend on **Koyeb** (or similar).

## 1. Database

Create a managed Postgres instance (Neon free tier, Koyeb Postgres, etc.) and note `DB_URL`, `DB_USER`, `DB_PASSWORD`.

## 2. Backend (Koyeb)

1. New App → Docker → point at `app/` (uses `Dockerfile`).
2. Set environment variables from `app/.env.example`:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `DB_URL`, `DB_USER`, `DB_PASSWORD`
   - `CORS_ALLOWED_ORIGINS` = your Vercel URL(s), comma-separated
   - `WOT_UPLOAD_DIR=/tmp/wot-uploads`
   - `WOT_JWT_SECRET` = random string, at least 32 characters
3. Health check path: `/health/ready`
4. Note the public URL (e.g. `https://wot-api-xxx.koyeb.app`).

## 3. Frontend (Vercel)

1. Import repo, **Root Directory** = `frontend`.
2. Set `VITE_API_BASE_URL` = Koyeb backend URL (no trailing slash).
3. Deploy. `vercel.json` handles SPA routing and security headers.

## 4. Wire CORS

After Vercel gives you a URL, update Koyeb `CORS_ALLOWED_ORIGINS` to match (include preview URL if needed).

## Local dev

```bash
# Terminal 1 — backend
cd app && docker compose up    # or ./mvnw spring-boot:run with local Postgres

# Terminal 2 — frontend
cd frontend && npm install && npm run dev
```

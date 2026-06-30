# WOT — Deploy

Frontend on **Vercel**, backend on **Render**, database on **Neon**.

## 1. Database (Neon)

1. Create a project at [console.neon.tech](https://console.neon.tech).
2. **Connect** → copy the connection string.
3. Map to Spring env vars:

| Neon | Render env var |
|------|----------------|
| user (e.g. `neondb_owner`) | `DB_USER` |
| password | `DB_PASSWORD` |
| host + `/neondb` | `DB_URL` (see below) |

`DB_URL` format (add `jdbc:` prefix and port `5432`):

```
jdbc:postgresql://YOUR_HOST.neon.tech:5432/neondb?sslmode=require
```

Use the **pooler** host from Neon (`-pooler` in the hostname) for Render.

Flyway migrations run automatically on first backend start.

## 2. JWT secret

Generate once (never commit):

```bash
openssl rand -base64 48
```

Set on Render as `WOT_JWT_SECRET` (min 32 characters).

## 3. Backend (Render)

**Why Docker?** Render has no native Java runtime (unlike Node/Python). For Spring Boot, Docker is the standard path: Maven builds the `.jar`, Docker provides Java 21 + runs the jar. You are not "running Docker in production" manually — Render builds and hosts the container for you.

### Render settings

| Setting | Value |
|---------|-------|
| **Root Directory** | *(leave blank — uses repo root)* |
| **Runtime** | Docker |
| **Dockerfile Path** | `Dockerfile` |
| **Health Check Path** | `/health/ready` |

Repo includes a root `Dockerfile` that builds `app/` automatically.

If you previously set Root Directory to `app`, clear it and use the root `Dockerfile` instead.

### Environment variables

| Variable | Value |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_URL` | `jdbc:postgresql://...neon.tech:5432/neondb?sslmode=require` |
| `DB_USER` | `neondb_owner` |
| `DB_PASSWORD` | *(from Neon)* |
| `WOT_JWT_SECRET` | *(openssl output)* |
| `WOT_JWT_EXPIRY_HOURS` | `168` |
| `WOT_UPLOAD_DIR` | `/tmp/wot-uploads` |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` *(update after Vercel)* |

5. Deploy and note the URL (e.g. `https://wot-api.onrender.com`).

Render sets `PORT` automatically — `application-prod.yml` uses it.

## 4. Frontend (Vercel)

1. Import repo → **Root Directory** = `frontend`.
2. Env var: `VITE_API_BASE_URL` = your Render URL (no trailing slash).
3. Deploy.

## 5. Wire CORS

Update Render `CORS_ALLOWED_ORIGINS` to your exact Vercel URL(s), comma-separated for preview + production.

## Local dev

```bash
# Terminal 1 — backend
cd app && docker compose up

# Terminal 2 — frontend
cd frontend && npm install && npm run dev
```

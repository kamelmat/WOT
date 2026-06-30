# Wizard of Toes (WOT)

Shoe fit recommendations app — React frontend + Spring Boot API.

## Structure

| Folder | What |
|--------|------|
| [`frontend/`](frontend/) | Vite + React UI (deploy to **Vercel**) |
| [`app/`](app/) | Spring Boot API (deploy to **Render** via Docker) |
| [`DEPLOY.md`](DEPLOY.md) | Step-by-step: Neon + Render + Vercel |

## Quick start (local)

```bash
# Backend
cd app && docker compose up

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

## Deploy

See **[DEPLOY.md](DEPLOY.md)** for production setup (Neon Postgres, Render, Vercel, JWT secret).

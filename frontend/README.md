# Wizard of Toes (Frontend)

React (Vite) frontend for the WOT Fit Service.

## Prereqs

- Node 20+

## Configure

Copy `.env.example` to `.env.local` for local overrides.

- `VITE_API_BASE_URL` — backend URL (required in production on Vercel). No trailing slash.
- `VITE_API_PROXY_TARGET` — dev-only proxy target (default `http://localhost:8080`)

## Run (dev)

```bash
npm install
npm run dev
```

Dev server proxies `/api`, `/health`, `/uploads` to the backend (see `vite.config.ts`).

## Deploy (Vercel)

1. Import repo, set **Root Directory** to `frontend`.
2. Add env var `VITE_API_BASE_URL` = your Koyeb backend URL (e.g. `https://wot-api-xxx.koyeb.app`).
3. Build: `npm run build` · Output: `dist` (handled by `vercel.json`).

## Backend wiring

Auth (public):

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

Fit API (requires `Authorization: Bearer <token>`):

- `POST /api/v1/fit/add-shoe`
- `POST /api/v1/fit/add-shoe-with-image`
- `POST /api/v1/fit/validate`
- `GET /api/v1/fit/recommendations?fitProfileId=...`
- `PUT /api/v1/fit/profile/{fitProfileId}`

It stores `fitProfileId` in localStorage (`wot.fitProfileId`) after the first shoe is added.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

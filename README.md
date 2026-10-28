# UPSC Track

A calm, responsive UPSC study planner built with React, Vite, Redux Toolkit, React Router, Bootstrap, Axios, and Chart.js. The project includes a browser-persisted demo mode and an optional Express API that saves data to a local JSON file.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

From the project root (`UPSCTrackAI/`):

```bash
npm install
npm start
```

This runs the Vite frontend at <http://localhost:5173> and the API at <http://localhost:3001>. The API creates `server/data.json` the first time it is used. It is intentionally ignored by Git.

To run either process separately, use `npm run dev` for the frontend or `npm run server` for the API, each from the project root.

## Demo and API configuration

Copy `.env.example` to `.env` in the project root to configure Vite. `VITE_API_BASE_URL` points to the API. `VITE_DEMO_MODE=true` (the default) keeps the app usable with seeded sample data and local browser persistence when the API is offline. Set it to `false` to surface API connection failures rather than use demo fallback.

The Express API supports subjects, tasks, planner sessions, and a study-assistant endpoint. When the API is running, data changes are saved to `server/data.json`.

### Optional AI provider

The assistant returns safe, built-in study suggestions when no provider is configured. To connect an OpenAI-compatible chat-completions endpoint, set `AI_API_URL`, `AI_API_KEY`, and optionally `AI_MODEL` in the environment where the backend runs. Never put AI credentials in `VITE_*` variables or frontend code. If a configured provider fails, the API reports an error instead of silently presenting it as an AI response.

## Features

- Dashboard with live task counts, planned sessions, completion, and focus timer.
- Subject cards with study targets and progress derived from tasks.
- Daily timetable with date navigation, session editing, priorities, and completion tracking.
- Task creation, editing, search, filters, status, and overdue view.
- Progress charts computed from actual task state.
- Study assistant using backend context and an optional server-side AI provider.
- Responsive navigation and layouts for desktop and mobile.

## Production build

From the project root:

```bash
npm run build
npm run preview
```

The frontend is a static Vite build in `dist/`; the API must be deployed separately and `VITE_API_BASE_URL` configured to its public URL at build time. Netlify redirect rules are included in `public/_redirects` for React Router routes. No deployment has been performed by this project setup.

# VibeBite

Simple React + Tailwind frontend (Vite) and FastAPI backend starter.

## Quick Setup

From the repository root, run:

```sh
npm run setup
```

The helper script installs Node dependencies, creates `backend/.venv`, and installs the FastAPI requirements. It relies on `python3` (or `python`) being available on your PATH.

## Frontend (React + Vite)

1. Install dependencies:

   ```sh
   npm install
   ```

2. Start the dev server:

   ```sh
   npm run dev
   ```

   The app opens at `http://localhost:5173`.

3. Create a production build:

   ```sh
   npm run build
   ```

   Netlify can deploy the contents of the generated `dist/` directory.

## Backend (FastAPI)

1. Create and activate a virtual environment (optional but recommended):

   ```sh
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   ```

2. Install backend dependencies:

   ```sh
   pip install -r requirements.txt
   ```

3. Run the FastAPI dev server:

   ```sh
   uvicorn app.main:app --reload
   ```

   The API is available at `http://127.0.0.1:8000` with docs at `/docs`.

## Netlify Deployment

- `netlify.toml` is preconfigured so Netlify runs `npm run build` and publishes the `dist/` directory.
- The build environment pins Node 20 and Python 3.11 (useful if you later add build-time scripts that depend on Python).
- Deploy by connecting the repository to Netlify or running:

  ```sh
  netlify deploy --build
  ```

### Backend deployment

Netlify hosts the frontend only. Run the FastAPI backend on a separate service (e.g., Fly.io, Render, Railway, or a traditional VM) and point your frontend API calls to that host. For local development you can run both with:

```sh
npm run dev          # frontend on http://localhost:5173
uvicorn app.main:app --reload  # backend on http://127.0.0.1:8000
```

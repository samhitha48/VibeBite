# VibeBite

Simple React + Tailwind starter powered by Vite with a companion FastAPI backend.

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

   Netlify deploys the contents of the generated `dist/` directory using the provided `netlify.toml`.

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

   The API is available at `http://127.0.0.1:8000` with docs at `/docs`. A simple `/health` endpoint is provided for uptime checks.

## Deploying the Backend (Render.com example)

The repo includes a `render.yaml` blueprint that provisions a Python web service on Render.

1. Commit and push the repo to GitHub (or another Git provider supported by Render).
2. In the Render dashboard choose **Blueprint** → **New Blueprint Instance** → connect the repository.
3. Render reads `render.yaml` and creates a service that:
   - Installs dependencies via `cd backend && pip install -r requirements.txt`
   - Starts Uvicorn with `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000`
   - Performs health checks against `/health`
   - Pins Python 3.11.8
4. Set any required environment variables in the Render dashboard (mirroring what you would store locally in `.env`).
5. Deploy. The rendered URL can be used from the VibeBite frontend once CORS or routing is configured.

## Deploying the Frontend (Netlify)

1. Ensure `npm run build` succeeds locally.
2. Connect the repository to Netlify (or push via `netlify deploy --build`).
3. Netlify uses the included `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Netlify dev proxy to Vite on port 5173 for local previews.

## Notes

- Keep the backend service URL in an environment variable (e.g., `VITE_API_BASE_URL`) when connecting the frontend.
- Remember to add `.venv`, build artifacts, and other generated files to `.gitignore` (already configured).
- Update `render.yaml` service name or plan before production deployment if necessary.

# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# allow localhost and your Netlify/Render domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://graceful-gingersnap-e9f2ff.netlify.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

# Project API
app = FastAPI(title="VibeBite API", version="0.1.0")


@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/vibes", tags=["Vibes"])
async def list_vibes() -> dict[str, list[str]]:
    """Return sample vibe names to keep the frontend unblocked."""
    return {
        "vibes": [
            "Chill brunch",
            "Sunset rooftop",
            "Late-night coding",
            "Rainy day focus",
            "Dance-floor energy",
        ]
    }


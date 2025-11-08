from fastapi import FastAPI

app = FastAPI(title="VibeBite API", version="0.1.0")


@app.get("/health", tags=["Health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/vibes", tags=["Vibes"])
async def list_vibes() -> dict[str, list[str]]:
    mock_vibes = [
        "Chill brunch",
        "Sunset rooftop",
        "Late-night coding",
        "Rainy day focus",
        "Dance-floor energy",
    ]
    return {"vibes": mock_vibes}


from fastapi import FastAPI, Query, Request
import requests
import os
from dotenv import load_dotenv
import json
import hashlib
from typing import Tuple
from cachetools import TTLCache
from fastapi.responses import JSONResponse
from threading import Lock
load_dotenv()  # Loads variables from a .env file if present

# Cache up to 1000 distinct queries for 1 hour (3600s)
YELP_CACHE_TTL_SECONDS = 10800
YELP_CACHE_MAXSIZE = 1000
_yelp_cache = TTLCache(maxsize=YELP_CACHE_MAXSIZE, ttl=YELP_CACHE_TTL_SECONDS)
_yelp_cache_lock = Lock()

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


@app.get("/yelp/search", tags=["Yelp"])
async def yelp_search(
    request: Request,
    location: str = Query(..., description="Location to search in"),
    term: str | None = Query(None, description="Search term"),
    limit: int | None = Query(10, description="Number of results to return"),
    offset: int | None = Query(0, description="Offset for results"),
    sort_by: str | None = Query(None, description="Sort mode"),
    price: str | None = Query(None, description="Price levels"),
    open_now: bool | None = Query(None, description="Only return businesses open now"),
):
    api_key = os.getenv("YELP_API_KEY")
    if not api_key:
        return {"error": "YELP_API_KEY environment variable is not set"}

    url = "https://api.yelp.com/v3/businesses/search"
    headers = {"Authorization": f"Bearer {api_key}"}
    params = {
        "location": location,
        "term": term,
        "limit": limit,
        "offset": offset,
        "sort_by": sort_by,
        "price": price,
        "open_now": open_now,
    }
    # Remove None values from params
    params = {k: v for k, v in params.items() if v is not None}

    # Build a stable cache key from sorted params
    key_source = json.dumps(params, sort_keys=True, separators=(",", ":"))
    cache_key = hashlib.sha256(key_source.encode("utf-8")).hexdigest()
    bypass = request.headers.get("x-cache-bust") == "1" if hasattr(request, "headers") else False
    if not bypass:
        with _yelp_cache_lock:
            cached = _yelp_cache.get(cache_key)
        if cached is not None:
            # Return cached with a helpful header
            return JSONResponse(content=cached, headers={"X-Cache": "HIT", "Cache-Control": f"public, max-age={YELP_CACHE_TTL_SECONDS}"})

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        with _yelp_cache_lock:
            _yelp_cache[cache_key] = data
        return JSONResponse(content=data, headers={"X-Cache": "MISS", "Cache-Control": f"public, max-age={YELP_CACHE_TTL_SECONDS}"})
    except requests.RequestException as e:
        return {"error": "Failed to fetch data from Yelp API", "details": str(e)}

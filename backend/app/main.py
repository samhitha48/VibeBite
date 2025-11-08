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

# Cache up to 1000 distinct queries for 3 hours (10800s)
YELP_CACHE_TTL_SECONDS = 10800
YELP_CACHE_MAXSIZE = 1000
_yelp_cache = TTLCache(maxsize=YELP_CACHE_MAXSIZE, ttl=YELP_CACHE_TTL_SECONDS)
_yelp_cache_lock = Lock()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="VibeBite API", version="0.1.0")

# Allow localhost + Netlify + Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://graceful-gingersnap-e9f2ff.netlify.app",
        "https://vibebite-tddq.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


@app.get("/yelp/search/", tags=["Yelp"])
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
    # Remove None/empty values from params
    params = {k: v for k, v in params.items() if v not in (None, "", [])}

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


# Dialogflow ES Fulfillment webhook: queries Yelp and returns fulfillmentText
@app.post("/dialogflow/es-webhook/", tags=["Dialogflow"])
@app.post("/dialogflow/es-webhook", tags=["Dialogflow"])
async def dialogflow_es_webhook(request: Request):
    """
    Dialogflow ES Fulfillment webhook.
    Extracts parameters (location, cuisine/term, price, open_now) from the ES payload,
    queries Yelp (reusing the same API key and cache pattern), and returns fulfillmentText.
    """
    body = await request.json()
    query_result = body.get("queryResult", {}) or {}
    params_in = query_result.get("parameters", {}) or {}

    # Extract parameters from Dialogflow ES
    # Normalize empty strings to None and sanitize the term
    location = (params_in.get("location") or "").strip() or "Denver"
    raw_term = (params_in.get("cuisine") or params_in.get("term") or "food").strip()

    # Defensive cleanup of term like "find sushi in Denver" -> "sushi"
    t = raw_term
    tl = t.lower()
    if tl.startswith("find "):
        t = t[5:]
    t = t.split(" in ", 1)[0].strip()
    term = t or "food"

    price = params_in.get("price")
    open_now = params_in.get("open_now")

    # Convert Dialogflow "" to None / coerce boolean text
    if isinstance(price, str) and price.strip() == "":
        price = None
    if isinstance(open_now, str):
        if open_now.strip() == "":
            open_now = None
        elif open_now.lower() in ("true", "false"):
            open_now = open_now.lower() == "true"

    limit = 5

    # Prepare Yelp call (reuse env var)
    api_key = os.getenv("YELP_API_KEY")
    if not api_key:
        return JSONResponse({"fulfillmentText": "Yelp API key is not configured."})

    url = "https://api.yelp.com/v3/businesses/search"
    headers = {"Authorization": f"Bearer {api_key}"}
    params = {
        "location": location,
        "term": term,
        "limit": limit,
        "price": price,
        "open_now": open_now,
    }
    # Remove None/empty values so Yelp doesn't get bad params
    params = {k: v for k, v in params.items() if v not in (None, "", [])}

    # Cache key identical to /yelp/search behavior
    key_source = json.dumps(params, sort_keys=True, separators=(",", ":"))
    cache_key = hashlib.sha256(key_source.encode("utf-8")).hexdigest()

    with _yelp_cache_lock:
        cached = _yelp_cache.get(cache_key)
    if cached is not None:
        businesses = cached.get("businesses", [])
    else:
        try:
            resp = requests.get(url, headers=headers, params=params, timeout=12)
            resp.raise_for_status()
            data = resp.json()
            with _yelp_cache_lock:
                _yelp_cache[cache_key] = data
            businesses = data.get("businesses", [])
        except requests.RequestException as e:
            # Log details to Render logs to help debug
            print("Yelp request failed:", repr(e))
            status = getattr(getattr(e, "response", None), "status_code", None)
            msg = "I couldn't reach Yelp right now. Please try again."
            if status:
                msg = f"I couldn't reach Yelp (HTTP {status}). Please try again."
            return JSONResponse({"fulfillmentText": msg})

    # Build a short, user-friendly response
    if not businesses:
        text = f"I couldn’t find {term} places in {location} right now."
    else:
        top = businesses[:3]
        parts = []
        for b in top:
            name = b.get("name")
            rating = b.get("rating")
            price_sym = b.get("price", "")
            addr = ", ".join((b.get("location") or {}).get("display_address", [])[:2])
            snippet = f"{name} (⭐ {rating}{f', {price_sym}' if price_sym else ''})"
            if addr:
                snippet += f" — {addr}"
            parts.append(snippet)
        text = f"Here are some {term} spots in {location}: " + "; ".join(parts)

    return JSONResponse({"fulfillmentText": text})

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime

from .database import init_db, create_event, get_event, add_participant, get_cached_restaurants, cache_restaurants
from .models import CreateEventRequest, ParticipantResponse, EventResponse, AvailabilityResponse, Restaurant
from .recommendations import get_restaurant_recommendations

app = FastAPI()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/events")
async def create_new_event(event: CreateEventRequest) -> dict:
    """Create a new event with datetime candidates"""
    # Extract datetime strings from the request
    datetimes = [candidate.datetime for candidate in event.candidate_datetimes]

    # Create event and get tokens
    result = create_event(event.station_name, datetimes)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to create event")

    # Ensure we return the complete result including both tokens
    return {
        "event_id": result["event_id"],
        "organizer_token": result["organizer_token"],
        "participant_token": result["participant_token"]
    }

@app.get("/api/events/{event_id}")
async def get_event_details(event_id: str, token: str) -> EventResponse:
    """Get event details including participant responses"""
    event_data = get_event(event_id, token)
    if not event_data:
        raise HTTPException(status_code=404, detail="Event not found or invalid token")

    # Get restaurant recommendations based on comments
    restaurants = get_cached_restaurants(event_id)
    if not restaurants:
        # If no cached recommendations, generate new ones
        comments = [p["comment"] for p in event_data["participants"] if p["comment"]]
        restaurants = get_restaurant_recommendations(
            event_data["station_name"],
            comments
        )
        # Cache the recommendations
        cache_restaurants(event_id, restaurants)

    return EventResponse(
        event_id=event_id,
        station_name=event_data["station_name"],
        candidate_datetimes=event_data["candidate_datetimes"],
        participants=event_data["participants"],
        restaurants=[Restaurant(**r) for r in (restaurants or [])]
    )

@app.post("/api/events/{event_id}/participants")
async def add_participant_response(
    event_id: str,
    response: ParticipantResponse
) -> dict:
    """Submit participant availability and comment"""
    # Ensure consistent UUID string format
    event_id = str(event_id).lower()
    response.token = str(response.token).lower()

    # Convert availability responses to the format expected by database
    availabilities = [
        {"datetime": av.datetime.isoformat(), "status": av.status}
        for av in response.availabilities
    ]

    participant_id = add_participant(event_id, response.token, availabilities, response.comment)
    if not participant_id:
        raise HTTPException(status_code=404, detail="Event not found or invalid token")

    return {"participant_id": participant_id}

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

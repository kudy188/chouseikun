from pydantic import BaseModel, constr, validator
from typing import List, Optional
from datetime import datetime

class DatetimeCandidate(BaseModel):
    datetime: datetime

class CreateEventRequest(BaseModel):
    station_name: constr(min_length=1, max_length=100)
    candidate_datetimes: List[DatetimeCandidate]

    @validator('candidate_datetimes')
    def validate_candidates(cls, v):
        if not 1 <= len(v) <= 3:
            raise ValueError('Must provide 1-3 datetime candidates')
        return v

class AvailabilityResponse(BaseModel):
    datetime: datetime
    status: str

    @validator('status')
    def validate_status(cls, v):
        valid_statuses = ['AVAILABLE', 'UNAVAILABLE', 'MAYBE']
        if v not in valid_statuses:
            raise ValueError(f'Status must be one of: {valid_statuses}')
        return v

class ParticipantResponse(BaseModel):
    token: str
    availabilities: List[AvailabilityResponse]
    comment: Optional[str] = None

    @validator('availabilities')
    def validate_availabilities(cls, v):
        if not 1 <= len(v) <= 3:
            raise ValueError('Must provide 1-3 availability responses')
        return v

class Restaurant(BaseModel):
    name: str
    address: str
    genre: str
    url: Optional[str] = None
    features: List[str]
    price_range: str
    distance_from_station: str
    matching_comments: Optional[List[str]] = None

class EventResponse(BaseModel):
    event_id: str
    station_name: str
    candidate_datetimes: List[dict]
    participants: List[dict]
    restaurants: Optional[List[Restaurant]] = None

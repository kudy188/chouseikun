from typing import Optional, List
import psycopg
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg.connect(DATABASE_URL)

def init_db():
    """Initialize the database tables"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Drop existing tables in reverse order of dependencies
            cur.execute("""
                DROP TABLE IF EXISTS shops CASCADE;
                DROP TABLE IF EXISTS participants CASCADE;
                DROP TABLE IF EXISTS events CASCADE;
            """)

            # Create events table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS events (
                    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    station_name TEXT NOT NULL,
                    candidate_datetime_1 TIMESTAMP NOT NULL,
                    candidate_datetime_2 TIMESTAMP,
                    candidate_datetime_3 TIMESTAMP,
                    organizer_token UUID DEFAULT gen_random_uuid(),
                    participant_token UUID DEFAULT gen_random_uuid(),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Create participants table with TEXT status fields
            cur.execute("""
                CREATE TABLE IF NOT EXISTS participants (
                    participant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
                    availability_candidate_1 TEXT NOT NULL,
                    availability_candidate_2 TEXT,
                    availability_candidate_3 TEXT,
                    comment TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Create shops table for caching restaurant recommendations
            cur.execute("""
                CREATE TABLE IF NOT EXISTS shops (
                    shop_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    event_id UUID REFERENCES events(event_id) ON DELETE CASCADE,
                    shop_name TEXT NOT NULL,
                    shop_address TEXT NOT NULL,
                    genre TEXT,
                    url TEXT,
                    features TEXT[],
                    price_range TEXT NOT NULL DEFAULT '不明',
                    distance_from_station TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            conn.commit()

def create_event(station_name: str, datetimes: List[datetime]) -> Optional[dict]:
    """Create a new event with datetime candidates"""
    if not 1 <= len(datetimes) <= 3:
        return None

    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO events (station_name, candidate_datetime_1, candidate_datetime_2, candidate_datetime_3)
                VALUES (%s, %s, %s, %s)
                RETURNING event_id, organizer_token, participant_token
            """, (station_name, datetimes[0],
                 datetimes[1] if len(datetimes) > 1 else None,
                 datetimes[2] if len(datetimes) > 2 else None))
            event_id, organizer_token, participant_token = cur.fetchone()
            conn.commit()
            return {
                "event_id": str(event_id),
                "organizer_token": str(organizer_token),
                "participant_token": str(participant_token)
            }

def get_event(event_id: str, token: str) -> Optional[dict]:
    """Get event details including participants"""
    print(f"Attempting to get event with ID: {event_id} and token: {token}")
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Verify token
            cur.execute("""
                SELECT station_name, candidate_datetime_1, candidate_datetime_2, candidate_datetime_3,
                       participant_token
                FROM events WHERE event_id = %s
            """, (event_id,))
            result = cur.fetchone()
            print(f"Database query result: {result}")
            if not result:
                print(f"No event found with ID: {event_id}")
                return None

            station_name, dt1, dt2, dt3, part_token = result
            # Convert UUIDs to lowercase string format for consistent comparison
            token = str(token).lower()
            part_token = str(part_token).lower()
            print(f"Comparing tokens - Input: {token}, Participant: {part_token}")
            if token != part_token:
                return None

            # Get participants
            cur.execute("""
                SELECT participant_id, availability_candidate_1, availability_candidate_2,
                       availability_candidate_3, comment
                FROM participants WHERE event_id = %s
            """, (event_id,))
            participants = [{
                "participant_id": p[0],
                "availabilities": [{"datetime": dt, "status": status}
                                 for dt, status in zip([dt1, dt2, dt3], [p[1], p[2], p[3]])
                                 if dt is not None and status is not None],
                "comment": p[4]
            } for p in cur.fetchall()]

            # Get participant counts
            counts = [0, 0, 0]
            for p in participants:
                for i, av in enumerate(p["availabilities"]):
                    if av["status"] == "AVAILABLE":
                        counts[i] += 1

            return {
                "event_id": event_id,
                "station_name": station_name,
                "candidate_datetimes": [
                    {"datetime": dt, "participant_count": count}
                    for dt, count in zip([dt1, dt2, dt3], counts)
                    if dt is not None
                ],
                "participants": participants
            }

def add_participant(event_id: str, token: str, availabilities: List[dict], comment: str) -> Optional[str]:
    """Add a participant response to an event"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Verify token
            cur.execute("""
                SELECT participant_token FROM events WHERE event_id = %s
            """, (event_id,))
            result = cur.fetchone()
            if not result:
                return None
            # Convert UUIDs to lowercase string format for consistent comparison
            token = str(token).lower()
            db_token = str(result[0]).lower()
            if token != db_token:
                return None

            # Extract status from availability responses
            statuses = [av["status"] for av in availabilities]

            cur.execute("""
                INSERT INTO participants
                (event_id, availability_candidate_1, availability_candidate_2, availability_candidate_3, comment)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING participant_id
            """, (event_id, statuses[0],
                 statuses[1] if len(statuses) > 1 else None,
                 statuses[2] if len(statuses) > 2 else None,
                 comment))
            participant_id = cur.fetchone()[0]
            return str(participant_id)

def cache_restaurants(event_id: str, restaurants: List[dict]):
    """Cache restaurant recommendations for an event"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            # Clear existing cache for this event
            cur.execute("DELETE FROM shops WHERE event_id = %s", (event_id,))

            # Insert new recommendations
            for restaurant in restaurants:
                cur.execute("""
                    INSERT INTO shops
                    (event_id, shop_name, shop_address, genre, url, features, price_range, distance_from_station)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (event_id, restaurant["name"], restaurant["address"],
                     restaurant.get("genre"), restaurant.get("url"),
                     restaurant.get("features", ["未分類"]), restaurant.get("price_range", "不明"),
                     restaurant.get("distance_from_station")))
            conn.commit()

def get_cached_restaurants(event_id: str) -> List[dict]:
    """Get cached restaurant recommendations for an event"""
    with get_db_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT shop_name, shop_address, genre, url, features, price_range, distance_from_station
                FROM shops WHERE event_id = %s
            """, (event_id,))
            return [{
                "name": r[0],
                "address": r[1],
                "genre": r[2],
                "url": r[3],
                "features": r[4] if r[4] else ["未分類"],
                "price_range": r[5] or "不明",
                "distance_from_station": r[6]
            } for r in cur.fetchall()]

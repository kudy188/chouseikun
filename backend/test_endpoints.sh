#!/bin/bash

BASE_URL="https://app-nyqocbct.fly.dev"

# Test 1: Create Event
echo "Test 1: Creating event..."
EVENT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/events" -H "Content-Type: application/json" -d '{
    "station_name": "新宿駅",
    "candidate_datetimes": [
        {"datetime": "2024-12-13T19:00:00"},
        {"datetime": "2024-12-14T19:00:00"}
    ]
}')
echo "Event Response: $EVENT_RESPONSE"

# Extract event_id and token
EVENT_ID=$(echo $EVENT_RESPONSE | jq -r '.event_id')
TOKEN=$(echo $EVENT_RESPONSE | jq -r '.participant_token')

echo "Event ID: $EVENT_ID"
echo "Token: $TOKEN"

# Test 2: Add Participant Response
echo -e "\nTest 2: Adding participant response..."
PARTICIPANT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/events/$EVENT_ID/participants" -H "Content-Type: application/json" -d "{
    \"token\": \"$TOKEN\",
    \"availabilities\": [
        {\"datetime\": \"2024-12-13T19:00:00\", \"status\": \"AVAILABLE\"},
        {\"datetime\": \"2024-12-14T19:00:00\", \"status\": \"UNAVAILABLE\"}
    ],
    \"comment\": \"和食が食べたい、個室希望\"
}")
echo "Participant Response: $PARTICIPANT_RESPONSE"

# Test 3: Get Event Details
echo -e "\nTest 3: Getting event details..."
sleep 1
EVENT_DETAILS=$(curl -s -X GET "$BASE_URL/api/events/$EVENT_ID?token=$TOKEN")
echo "Event Details: $EVENT_DETAILS"

# Test 4: Concurrent Access Test (10 users)
echo -e "\nTest 4: Testing concurrent access (10 users)..."
for i in {1..10}; do
    (curl -s -X GET "$BASE_URL/api/events/$EVENT_ID?token=$TOKEN" > /dev/null) &
done
wait
echo "Concurrent access test completed"

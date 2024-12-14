from typing import List, Dict
import random

# Pre-defined restaurant data by area and type
RESTAURANT_DATABASE: Dict[str, List[Dict]] = {
    "default": [
        {
            "name": "居酒屋 むらた",
            "address": "東京都千代田区...",
            "genre": "居酒屋",
            "url": "https://example.com/murata",
            "features": ["飲み放題", "個室", "和食", "ビール", "日本酒"],
            "price_range": "3000-4000",
            "distance_from_station": "徒歩3分"
        },
        # Add more default restaurants...
    ],
    "新宿": [
        {
            "name": "個室居酒屋 和み",
            "address": "東京都新宿区新宿3-1-1",
            "genre": "居酒屋",
            "url": "https://example.com/nagomi",
            "features": ["個室", "和食", "日本酒", "飲み放題"],
            "price_range": "4000-5000",
            "distance_from_station": "徒歩5分"
        },
        {
            "name": "ビアホール麦酒",
            "address": "東京都新宿区西新宿1-1-1",
            "genre": "ビアホール",
            "url": "https://example.com/bakushu",
            "features": ["ビール", "洋食", "宴会"],
            "price_range": "3000-4000",
            "distance_from_station": "徒歩2分"
        },
        # Add more Shinjuku restaurants...
    ],
    # Add more areas...
}

# Keyword mapping for better matching
KEYWORD_MAPPING = {
    "ビール": ["ビール", "ビアホール", "クラフトビール"],
    "和食": ["和食", "日本料理", "居酒屋"],
    "個室": ["個室", "プライベート"],
    "安い": ["安い", "コスパ", "飲み放題"],
    "宴会": ["宴会", "パーティー", "飲み会"],
}

def extract_keywords(comments: List[str]) -> List[str]:
    """Extract keywords from comments"""
    keywords = set()
    for comment in comments:
        for key, variations in KEYWORD_MAPPING.items():
            if any(variation in comment for variation in variations):
                keywords.add(key)
    return list(keywords) if keywords else ["居酒屋"]  # Default to izakaya if no keywords found

def score_restaurant(restaurant: Dict, keywords: List[str]) -> float:
    """Score a restaurant based on how well it matches the keywords"""
    score = 0
    for keyword in keywords:
        # Check if keyword matches any feature
        if any(keyword in feature.lower() for feature in restaurant["features"]):
            score += 1
    return score

def get_restaurant_recommendations(station_name: str, comments: List[str]) -> List[Dict]:
    """Get restaurant recommendations based on station name and comments"""
    # Get keywords from comments
    keywords = extract_keywords(comments)

    # Get restaurants for the area
    area_restaurants = RESTAURANT_DATABASE.get(station_name, RESTAURANT_DATABASE["default"])

    # Score and sort restaurants
    scored_restaurants = [
        (restaurant, score_restaurant(restaurant, keywords))
        for restaurant in area_restaurants
    ]
    scored_restaurants.sort(key=lambda x: x[1], reverse=True)

    # Return top 5 restaurants with matching comments
    recommendations = []
    for restaurant, score in scored_restaurants[:5]:
        restaurant_copy = restaurant.copy()
        restaurant_copy["matching_comments"] = comments
        recommendations.append(restaurant_copy)

    # If we don't have enough recommendations, add some random ones from default
    while len(recommendations) < 5:
        random_restaurant = random.choice(RESTAURANT_DATABASE["default"])
        if random_restaurant not in recommendations:
            random_restaurant = random_restaurant.copy()
            random_restaurant["matching_comments"] = comments
            recommendations.append(random_restaurant)

    return recommendations[:5]

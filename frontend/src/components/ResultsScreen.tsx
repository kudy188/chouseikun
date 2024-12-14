import * as React from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';

interface Restaurant {
  name: string;
  address: string;
  distance_from_station: string;
  genre: string;
  features: string[];
  price_range: string;
  url?: string;
}

interface ParticipantResponse {
  availabilities: boolean[];
  comment: string;
}

export function ResultsScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = React.useState<any>(null);
  const [responses, setResponses] = React.useState<ParticipantResponse[]>([]);
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);

  React.useEffect(() => {
    const fetchEventAndResponses = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const participantToken = urlParams.get('token');

        if (!participantToken || !eventId) {
          throw new Error('Invalid URL parameters');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}?token=${participantToken}`);
        if (!response.ok) throw new Error('Event not found');
        const data = await response.json();
        console.log('Results data:', data);  // Debug log
        setEvent(data);
        setResponses(data.participants || []);
        setRestaurants(data.recommended_restaurants || []);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    if (eventId) fetchEventAndResponses();
  }, [eventId]);

  if (!event) return <div>Loading...</div>;

  const calculateAvailability = (dateIndex: number) => {
    const available = responses.filter(r => r.availabilities[dateIndex]).length;
    return {
      count: available,
      percentage: (available / responses.length) * 100,
    };
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="grid gap-6">
        {/* Availability Summary */}
        <Card className="border-2 border-green-200 bg-gradient-to-b from-green-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">参加可否集計</CardTitle>
            <CardDescription className="text-lg text-green-600">各候補日時の参加可能人数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.candidate_datetimes.map((datetime: { datetime: string }, index: number) => {
              const availability = calculateAvailability(index);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <Label>
                      {new Date(datetime.datetime).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Label>
                    <span>{availability.count}人参加可能</span>
                  </div>
                  <Progress value={availability.percentage} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="border-2 border-green-200 bg-gradient-to-b from-green-50 to-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">参加者コメント</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {responses.map((response, index) => (
                response.comment && (
                  <div key={index} className="p-3 bg-green-50 rounded-xl border-2 border-green-100 text-green-800">
                    {response.comment}
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Recommendations */}
        <Card className="relative">
          <div className="absolute -right-4 -top-4 animate-bounce">
            <img
              src="/src/assets/cho-chosei-kun.svg"
              alt="超調整くん"
              className="w-16 h-16"
            />
          </div>
          <CardHeader>
            <CardTitle>超調整くんのおすすめ店舗</CardTitle>
            <CardDescription className="text-lg text-green-600">みなさんの希望を考慮したおすすめ店舗です</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {restaurants.map((restaurant, index) => (
              <div key={index} className="p-4 border-2 border-green-100 rounded-xl bg-green-50 space-y-2 transition-transform hover:scale-[1.02]">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-xl text-green-800">{restaurant.name}</h3>
                  {restaurant.url && (
                    <a
                      href={restaurant.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 hover:underline font-medium"
                    >
                      詳細を見る
                    </a>
                  )}
                </div>
                <p className="text-green-700">
                  {restaurant.address} ({restaurant.distance_from_station})
                </p>
                <p className="text-green-600 font-medium">{restaurant.genre}</p>
                <div className="text-green-700">
                  <span className="font-bold">特徴：</span>
                  {restaurant.features.join('、')}
                </div>
                <div className="text-green-700">
                  <span className="font-bold">予算：</span>
                  {restaurant.price_range}円
                </div>
              </div>
            ))}
            {restaurants.length === 0 && (
              <div className="text-center text-gray-500">
                まだおすすめの店舗がありません。参加者のコメントをお待ちください！
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

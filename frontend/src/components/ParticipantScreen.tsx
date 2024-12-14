import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import choChoseiKun from '../assets/cho-chosei-kun.svg';

interface Availability {
  AVAILABLE: string;
  UNAVAILABLE: string;
  MAYBE: string;
}

const AVAILABILITY: Availability = {
  AVAILABLE: '参加可能',
  UNAVAILABLE: '不参加',
  MAYBE: 'どちらでもよい',
};

export function ParticipantScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = React.useState<any>(null);
  const [availabilities, setAvailabilities] = React.useState<string[]>([]);
  const [comment, setComment] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const participantToken = urlParams.get('token');

        if (!participantToken || !eventId) {
          throw new Error('Invalid URL parameters');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}?token=${participantToken}`);
        if (!response.ok) throw new Error('Event not found');

        const data = await response.json();
        console.log('Event data:', data);
        setEvent(data);
        setAvailabilities(new Array(data.candidate_datetimes.length).fill('MAYBE'));
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('イベントの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const participantToken = urlParams.get('token');

      if (!participantToken || !eventId) {
        throw new Error('Invalid URL parameters');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${eventId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: participantToken,
          availabilities: availabilities.map(status => ({
            'AVAILABLE': true,
            'UNAVAILABLE': false,
            'MAYBE': false
          }[status])),
          comment,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit response');
      toast.success('回答を送信しました！');
      window.location.href = `/results/${eventId}?token=${participantToken}`;
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('回答の送信に失敗しました。');
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!event) return <div className="flex justify-center items-center min-h-screen">イベントが見つかりませんでした。</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="border-2 border-green-200 bg-gradient-to-b from-green-50 to-white">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-green-800">突然の飲み会調整くん</CardTitle>
            <img src={choChoseiKun} alt="超調整くん" className="w-16 h-16 animate-bounce" />
          </div>
          <CardDescription className="text-lg text-green-600">
            参加可能な日時を選択し、リクエストがあれば一言コメントを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {event.candidate_datetimes.map((datetime: { datetime: string }, index: number) => (
            <div key={index} className="space-y-2">
              <Label className="text-lg font-medium text-green-700">
                {new Date(datetime.datetime).toLocaleString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Label>
              <RadioGroup
                value={availabilities[index]}
                onValueChange={(value) => {
                  const newAvailabilities = [...availabilities];
                  newAvailabilities[index] = value;
                  setAvailabilities(newAvailabilities);
                }}
              >
                {Object.entries(AVAILABILITY).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={`${index}-${key}`} />
                    <Label htmlFor={`${index}-${key}`} className="text-green-700">{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-lg font-medium text-green-700">一言コメント（任意）</Label>
            <Textarea
              id="comment"
              placeholder="例：和食が食べたい、個室希望、など"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border-2 border-green-200 focus:border-green-400 rounded-xl text-lg min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-medium transition-transform hover:scale-105"
          >
            送信
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

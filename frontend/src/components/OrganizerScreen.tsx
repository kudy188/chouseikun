import * as React from 'react';
import { Plus, Minus, Copy } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { DateTimePicker } from './DateTimePicker';
import choChoseiKun from '../assets/cho-chosei-kun.svg';

interface DateTimeCandidate {
  datetime: Date;
}

export function OrganizerScreen() {
  const [station, setStation] = React.useState('');
  const [candidates, setCandidates] = React.useState<DateTimeCandidate[]>(() => {
    const initialDate = new Date();
    initialDate.setHours(19, 0, 0, 0); // Set initial time to 19:00
    return [{ datetime: initialDate }];
  });
  const [generatedUrls, setGeneratedUrls] = React.useState<{ organizer: string; participant: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAddCandidate = () => {
    if (candidates.length < 3) {
      const newDate = new Date();
      newDate.setHours(19, 0, 0, 0); // Set new candidate time to 19:00
      setCandidates([...candidates, { datetime: newDate }]);
    }
  };

  const handleRemoveCandidate = (index: number) => {
    if (candidates.length > 1) {
      setCandidates(candidates.filter((_, i) => i !== index));
    }
  };

  const handleDateTimeChange = (index: number, newDate: Date) => {
    const newCandidates = [...candidates];
    newCandidates[index] = { datetime: newDate };
    setCandidates(newCandidates);
  };

  const handleSubmit = async () => {
    if (!station.trim()) {
      toast.error('駅名を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          station_name: station,
          candidate_datetimes: candidates.map(c => ({
            datetime: c.datetime.toISOString()
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to create event');

      const data = await response.json();
      setGeneratedUrls({
        organizer: `${window.location.origin}/#/results/${data.event_id}?token=${data.organizer_token}`,
        participant: `${window.location.origin}/#/participate/${data.event_id}?token=${data.participant_token}`
      });
      toast.success('イベントが作成されました');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('イベントの作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string, type: '主催者' | '参加者') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type}用URLをコピーしました`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('URLのコピーに失敗しました');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="border-2 border-green-200 bg-gradient-to-b from-green-50 to-white shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl md:text-3xl font-bold text-green-800">突然の飲み会調整くん</CardTitle>
            <img src={choChoseiKun} alt="超調整くん" className="w-16 h-16 md:w-20 md:h-20 animate-bounce" />
          </div>
          <CardDescription className="text-lg text-green-600">
            日時候補と駅名を入力して、参加者と共有するURLを発行します。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-lg font-medium text-green-700" htmlFor="station">駅名</Label>
            <Input
              id="station"
              placeholder="例：新宿駅"
              value={station}
              onChange={(e) => setStation(e.target.value)}
              className="border-2 border-green-200 focus:border-green-400 rounded-xl text-lg"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium text-green-700">日時候補</Label>
              {candidates.length < 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCandidate}
                  className="flex items-center gap-1 border-2 border-green-200 hover:bg-green-100 rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                  候補を追加
                </Button>
              )}
            </div>

            {candidates.map((candidate, index) => (
              <div key={index} className="flex items-start gap-2">
                <DateTimePicker
                  date={candidate.datetime}
                  setDate={(date) => handleDateTimeChange(index, date)}
                />
                {candidates.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCandidate(index)}
                    className="shrink-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {!generatedUrls ? (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-medium transition-transform hover:scale-105"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'URL発行中...' : 'URL発行'}
            </Button>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <div className="space-y-2">
                <Label className="text-lg font-medium text-green-700">主催者用URL</Label>
                <div className="flex gap-2">
                  <Input value={generatedUrls.organizer} readOnly className="border-2 border-green-200 rounded-xl" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(generatedUrls.organizer, '主催者')}
                    className="border-2 border-green-200 hover:bg-green-100 rounded-xl"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-lg font-medium text-green-700">参加者用URL</Label>
                <div className="flex gap-2">
                  <Input value={generatedUrls.participant} readOnly className="border-2 border-green-200 rounded-xl" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(generatedUrls.participant, '参加者')}
                    className="border-2 border-green-200 hover:bg-green-100 rounded-xl"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

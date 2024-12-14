import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const minutes = React.useMemo(() => {
    const mins: string[] = [];
    for (let i = 0; i < 60; i += 15) {
      mins.push(i.toString().padStart(2, "0"));
    }
    return mins;
  }, []);

  const hours = React.useMemo(() => {
    const hrs: string[] = [];
    for (let i = 17; i <= 22; i++) {  // Common dinner time hours
      hrs.push(i.toString());
    }
    return hrs;
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP HH:mm", { locale: ja })
          ) : (
            <span>日時を選択</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate: Date | undefined) => newDate && setDate(newDate)}
          initialFocus
        />
        <div className="flex items-center justify-center p-2 border-t">
          <Select
            value={date.getHours().toString()}
            onValueChange={(value) => {
              const newDate = new Date(date);
              newDate.setHours(parseInt(value));
              setDate(newDate);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="時" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((hour) => (
                <SelectItem key={hour} value={hour}>
                  {hour}時
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="mx-2">:</span>
          <Select
            value={date.getMinutes().toString().padStart(2, "0")}
            onValueChange={(value) => {
              const newDate = new Date(date);
              newDate.setMinutes(parseInt(value));
              setDate(newDate);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="分" />
            </SelectTrigger>
            <SelectContent>
              {minutes.map((minute) => (
                <SelectItem key={minute} value={minute}>
                  {minute}分
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}

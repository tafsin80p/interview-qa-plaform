import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isRunning: boolean;
}

export const QuizTimer = ({ duration, onTimeUp, isRunning }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft < 60;
  const isCritical = timeLeft < 30;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg transition-all duration-300 ${
        isCritical
          ? 'bg-destructive/20 text-destructive animate-pulse'
          : isLow
          ? 'bg-warning/20 text-warning'
          : 'bg-secondary text-foreground'
      }`}
    >
      <Clock className={`w-5 h-5 ${isCritical ? 'animate-pulse' : ''}`} />
      <span className="font-bold tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

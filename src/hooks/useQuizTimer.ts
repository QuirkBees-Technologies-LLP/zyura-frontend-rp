import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/features/auth/auth.slice';
import { RootState } from '@/store/store';

interface UseQuizTimerProps {
  durationSeconds: number | null;
  isReviewMode: boolean;
  isExamMode?: boolean;
  onTimeUp?: () => void;
}

export const useQuizTimer = ({ durationSeconds, isReviewMode, isExamMode = false, onTimeUp }: UseQuizTimerProps) => {
  const user = useSelector((state: RootState) => selectUser(state));
  const isProfessional = user?.account?.role === 'PROFESSIONAL';

  // Apply mode multiplier only for study mode professionals (not exams)
  const effectiveDuration = durationSeconds
    ? Math.floor(durationSeconds * (isProfessional && !isExamMode ? 1.2 : 1.0))
    : null;

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [oneMinuteAlertShown, setOneMinuteAlertShown] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const getTimeRemaining = useCallback(() => {
    return effectiveDuration ? Math.max(0, effectiveDuration - timeElapsed) : 0;
  }, [effectiveDuration, timeElapsed]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  useEffect(() => {
    if (isReviewMode || !effectiveDuration || isPaused || timeElapsed >= effectiveDuration) {
      return;
    }

    const tick = () => {
      setTimeElapsed(prev => {
        const newElapsed = prev + 1;
        const remaining = effectiveDuration - newElapsed;

        if (remaining === 60 && !oneMinuteAlertShown) {
          setOneMinuteAlertShown(true);
          toast('⏰ 1 minute left! Please finish your quiz.', {
            style: {
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
            },
            duration: 5000,
          });
        }

        if (newElapsed >= effectiveDuration) {
          onTimeUp?.();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return effectiveDuration;
        }

        return newElapsed;
      });
    };

    intervalRef.current = window.setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [effectiveDuration, isReviewMode, isPaused, oneMinuteAlertShown, onTimeUp, timeElapsed]);

  // Pause/resume effect
  useEffect(() => {
    // Timer already handles pause in its interval check
  }, [isPaused]);

  return {
    timeElapsed,
    timeRemaining: getTimeRemaining(),
    isPaused,
    togglePause,
    isProfessional,
    effectiveDuration,
    oneMinuteAlertShown,
  };
};



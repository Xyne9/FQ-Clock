import { useState, useCallback, useRef, useMemo } from 'react';
import { PomodoroTimer } from '../core/PomodoroTimer';
import { TaskManager } from '../core/TaskManager';
import {
  TimerState,
  SessionConfig,
  PomodoroStats,
  SessionType,
} from '../core/types';

const DEFAULT_CONFIG: SessionConfig = {
  workDuration: 25 * 60 * 1000,
  shortBreakDuration: 5 * 60 * 1000,
  longBreakDuration: 15 * 60 * 1000,
  longBreakInterval: 4,
};

const SESSION_LABELS: Record<SessionType, string> = {
  work: '专注工作',
  shortBreak: '短暂休息',
  longBreak: '长休息',
};

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function usePomodoro() {
  const timerRef = useRef(new PomodoroTimer(DEFAULT_CONFIG));
  const taskManagerRef = useRef(new TaskManager());

  const [state, setState] = useState<TimerState>(
    timerRef.current.getState(),
  );
  const [stats, setStats] = useState<PomodoroStats>({
    totalCompletedPomodoros: 0,
    totalWorkMinutes: 0,
    dailyCount: {},
  });

  const updateState = useCallback(() => {
    setState({ ...timerRef.current.getState() });
  }, []);

  const start = useCallback(() => {
    timerRef.current.start();
    updateState();
  }, [updateState]);

  const pause = useCallback(() => {
    timerRef.current.pause();
    updateState();
  }, [updateState]);

  const resume = useCallback(() => {
    timerRef.current.resume();
    updateState();
  }, [updateState]);

  const reset = useCallback(() => {
    timerRef.current.reset();
    updateState();
  }, [updateState]);

  const tick = useCallback(
    (ms: number) => {
      timerRef.current.tick(ms);
      const newState = timerRef.current.getState();
      setState({ ...newState });

      if (newState.status === 'completed' && newState.sessionType === 'work') {
        setStats(prev => ({
          ...prev,
          totalCompletedPomodoros: prev.totalCompletedPomodoros + 1,
          totalWorkMinutes:
            prev.totalWorkMinutes +
            Math.floor(DEFAULT_CONFIG.workDuration / 60000),
        }));
      }
    },
    [],
  );

  const nextSession = useCallback(() => {
    timerRef.current.nextSession();
    updateState();
  }, [updateState]);

  const skip = useCallback(() => {
    timerRef.current.skip();
    updateState();
  }, [updateState]);

  const formattedTime = useMemo(
    () => formatTime(state.remainingTime),
    [state.remainingTime],
  );

  const progress = useMemo(() => {
    if (state.totalDuration === 0) return 0;
    return 1 - state.remainingTime / state.totalDuration;
  }, [state.remainingTime, state.totalDuration]);

  const sessionLabel = useMemo(
    () => SESSION_LABELS[state.sessionType],
    [state.sessionType],
  );

  return {
    state,
    stats,
    formattedTime,
    progress,
    sessionLabel,
    start,
    pause,
    resume,
    reset,
    tick,
    nextSession,
    skip,
    taskManager: taskManagerRef.current,
  };
}
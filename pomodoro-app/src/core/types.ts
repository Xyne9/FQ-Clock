export type SessionType = 'work' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface SessionConfig {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export interface TimerState {
  remainingTime: number;
  totalDuration: number;
  status: TimerStatus;
  sessionType: SessionType;
}

export interface PomodoroTask {
  id: string;
  title: string;
  completedPomodoros: number;
  estimatedPomodoros: number;
  completed: boolean;
}

export interface PomodoroStats {
  totalCompletedPomodoros: number;
  totalWorkMinutes: number;
  dailyCount: Record<string, number>;
}
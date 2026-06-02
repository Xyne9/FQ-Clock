import { TimerState, SessionType, SessionConfig, TimerStatus } from './types';

export class PomodoroTimer {
  private config: SessionConfig;
  private currentSessionType: SessionType;
  private status: TimerStatus;
  private remainingTime: number;
  private completedWorkSessions: number;
  private onTickCallback?: (state: TimerState) => void;
  private onCompleteCallback?: (state: TimerState) => void;

  constructor(config: SessionConfig) {
    this.config = config;
    this.currentSessionType = 'work';
    this.status = 'idle';
    this.remainingTime = config.workDuration;
    this.completedWorkSessions = 0;
  }

  getState(): TimerState {
    const totalDuration = this.getDurationForType(this.currentSessionType);
    return {
      remainingTime: this.remainingTime,
      totalDuration,
      status: this.status,
      sessionType: this.currentSessionType,
    };
  }

  start(): void {
    if (this.status === 'running') {
      throw new Error('Timer is already running');
    }
    this.status = 'running';
  }

  pause(): void {
    if (this.status !== 'running') {
      throw new Error('Timer is not running');
    }
    this.status = 'paused';
  }

  resume(): void {
    if (this.status !== 'paused') {
      throw new Error('Timer is not paused');
    }
    this.status = 'running';
  }

  reset(): void {
    this.remainingTime = this.getDurationForType(this.currentSessionType);
    this.status = 'idle';
  }

  tick(deltaMs: number): void {
    if (this.status !== 'running') {
      return;
    }

    this.remainingTime = Math.max(0, this.remainingTime - deltaMs);

    this.notifyTick();

    if (this.remainingTime === 0) {
      this.status = 'completed';
      if (this.currentSessionType === 'work') {
        this.completedWorkSessions++;
      }
      this.notifyComplete();
    }
  }

  nextSession(): void {
    this.currentSessionType = this.getNextSessionType();
    this.remainingTime = this.getDurationForType(this.currentSessionType);
    this.status = 'idle';
  }

  skip(): void {
    if (this.status === 'running') {
      this.remainingTime = 0;
      if (this.currentSessionType === 'work') {
        this.completedWorkSessions++;
      }
    }
    this.nextSession();
  }

  onTick(callback: (state: TimerState) => void): void {
    this.onTickCallback = callback;
  }

  onComplete(callback: (state: TimerState) => void): void {
    this.onCompleteCallback = callback;
  }

  private getDurationForType(type: SessionType): number {
    switch (type) {
      case 'work':
        return this.config.workDuration;
      case 'shortBreak':
        return this.config.shortBreakDuration;
      case 'longBreak':
        return this.config.longBreakDuration;
    }
  }

  private getNextSessionType(): SessionType {
    if (this.currentSessionType === 'work') {
      if (this.completedWorkSessions % this.config.longBreakInterval === 0) {
        return 'longBreak';
      }
      return 'shortBreak';
    }
    return 'work';
  }

  private notifyTick(): void {
    if (this.onTickCallback) {
      this.onTickCallback(this.getState());
    }
  }

  private notifyComplete(): void {
    if (this.onCompleteCallback) {
      this.onCompleteCallback(this.getState());
    }
  }
}
import { PomodoroTimer } from '../core/PomodoroTimer';
import { SessionConfig } from '../core/types';

const DEFAULT_CONFIG: SessionConfig = {
  workDuration: 25 * 60 * 1000,
  shortBreakDuration: 5 * 60 * 1000,
  longBreakDuration: 15 * 60 * 1000,
  longBreakInterval: 4,
};

describe('PomodoroTimer', () => {
  describe('initialization', () => {
    test('creates a timer with work session by default', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);

      const state = timer.getState();

      expect(state.sessionType).toBe('work');
      expect(state.status).toBe('idle');
      expect(state.remainingTime).toBe(DEFAULT_CONFIG.workDuration);
      expect(state.totalDuration).toBe(DEFAULT_CONFIG.workDuration);
    });

    test('creates a timer with custom config', () => {
      const config: SessionConfig = {
        workDuration: 30 * 60 * 1000,
        shortBreakDuration: 3 * 60 * 1000,
        longBreakDuration: 10 * 60 * 1000,
        longBreakInterval: 3,
      };
      const timer = new PomodoroTimer(config);

      const state = timer.getState();

      expect(state.remainingTime).toBe(config.workDuration);
      expect(state.totalDuration).toBe(config.workDuration);
    });
  });

  describe('start', () => {
    test('changes status to running when started', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);

      timer.start();

      const state = timer.getState();
      expect(state.status).toBe('running');
    });

    test('cannot start an already running timer', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();

      expect(() => timer.start()).toThrow('Timer is already running');
    });
  });

  describe('pause and resume', () => {
    test('pauses a running timer', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();

      timer.pause();

      const state = timer.getState();
      expect(state.status).toBe('paused');
    });

    test('cannot pause an idle timer', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);

      expect(() => timer.pause()).toThrow('Timer is not running');
    });

    test('cannot pause a paused timer', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();
      timer.pause();

      expect(() => timer.pause()).toThrow('Timer is not running');
    });

    test('resumes a paused timer', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();
      timer.pause();

      timer.resume();

      const state = timer.getState();
      expect(state.status).toBe('running');
    });

    test('cannot resume a timer that is not paused', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);

      expect(() => timer.resume()).toThrow('Timer is not paused');
    });
  });

  describe('reset', () => {
    test('resets timer to idle state with full duration', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();
      timer.tick(10 * 60 * 1000);

      timer.reset();

      const state = timer.getState();
      expect(state.status).toBe('idle');
      expect(state.remainingTime).toBe(DEFAULT_CONFIG.workDuration);
    });
  });

  describe('tick', () => {
    test('decreases remaining time when ticked', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();

      timer.tick(1000);

      const state = timer.getState();
      expect(state.remainingTime).toBe(DEFAULT_CONFIG.workDuration - 1000);
    });

    test('does not decrease time when paused', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();
      timer.pause();

      timer.tick(1000);

      const state = timer.getState();
      expect(state.remainingTime).toBe(DEFAULT_CONFIG.workDuration);
    });

    test('completes when remaining time reaches zero', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();

      timer.tick(DEFAULT_CONFIG.workDuration);

      const state = timer.getState();
      expect(state.status).toBe('completed');
      expect(state.remainingTime).toBe(0);
    });

    test('does not go below zero remaining time', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();

      timer.tick(DEFAULT_CONFIG.workDuration + 1000);

      const state = timer.getState();
      expect(state.remainingTime).toBe(0);
    });
  });

  describe('callbacks', () => {
    test('calls onTick callback when time changes', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      const onTick = jest.fn();
      timer.onTick(onTick);
      timer.start();

      timer.tick(1000);

      expect(onTick).toHaveBeenCalledTimes(1);
      expect(onTick).toHaveBeenCalledWith(
        expect.objectContaining({
          remainingTime: DEFAULT_CONFIG.workDuration - 1000,
          status: 'running',
        }),
      );
    });

    test('calls onComplete callback when timer finishes', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      const onComplete = jest.fn();
      timer.onComplete(onComplete);
      timer.start();

      timer.tick(DEFAULT_CONFIG.workDuration);

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'completed',
          remainingTime: 0,
        }),
      );
    });
  });

  describe('session switching', () => {
    test('switches to short break after completing a work session', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();
      timer.tick(DEFAULT_CONFIG.workDuration);

      timer.nextSession();

      const state = timer.getState();
      expect(state.sessionType).toBe('shortBreak');
      expect(state.remainingTime).toBe(DEFAULT_CONFIG.shortBreakDuration);
      expect(state.status).toBe('idle');
    });

    test('switches to long break after completing 4 work sessions', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();
      timer.tick(DEFAULT_CONFIG.workDuration);

      timer.nextSession();
      timer.start();
      timer.tick(DEFAULT_CONFIG.shortBreakDuration);
      timer.nextSession();
      timer.start();
      timer.tick(DEFAULT_CONFIG.workDuration);
      timer.nextSession();
      timer.start();
      timer.tick(DEFAULT_CONFIG.shortBreakDuration);
      timer.nextSession();
      timer.start();
      timer.tick(DEFAULT_CONFIG.workDuration);
      timer.nextSession();
      timer.start();
      timer.tick(DEFAULT_CONFIG.shortBreakDuration);
      timer.nextSession();
      timer.start();
      timer.tick(DEFAULT_CONFIG.workDuration);

      timer.nextSession();

      const state = timer.getState();
      expect(state.sessionType).toBe('longBreak');
      expect(state.remainingTime).toBe(DEFAULT_CONFIG.longBreakDuration);
    });

    test('switches back to work after break completes', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();
      timer.tick(DEFAULT_CONFIG.workDuration);
      timer.nextSession();

      timer.start();
      timer.tick(DEFAULT_CONFIG.shortBreakDuration);
      timer.nextSession();

      const state = timer.getState();
      expect(state.sessionType).toBe('work');
    });
  });

  describe('skip session', () => {
    test('skips current session and moves to next', () => {
      const timer = new PomodoroTimer(DEFAULT_CONFIG);
      timer.start();

      timer.skip();

      const state = timer.getState();
      expect(state.sessionType).toBe('shortBreak');
      expect(state.status).toBe('idle');
      expect(state.remainingTime).toBe(DEFAULT_CONFIG.shortBreakDuration);
    });
  });
});
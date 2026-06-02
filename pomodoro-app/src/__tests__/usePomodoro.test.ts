import { renderHook, act } from '@testing-library/react-native';
import { usePomodoro } from '../hooks/usePomodoro';

describe('usePomodoro', () => {
  describe('timer state', () => {
    test('initializes with default work session', () => {
      const { result } = renderHook(() => usePomodoro());

      expect(result.current.state.sessionType).toBe('work');
      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.remainingTime).toBe(25 * 60 * 1000);
    });

    test('starts timer', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });

      expect(result.current.state.status).toBe('running');
    });

    test('pauses timer', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.pause();
      });

      expect(result.current.state.status).toBe('paused');
    });

    test('resumes timer', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.pause();
      });
      act(() => {
        result.current.resume();
      });

      expect(result.current.state.status).toBe('running');
    });

    test('resets timer', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(5 * 60 * 1000);
      });
      act(() => {
        result.current.reset();
      });

      expect(result.current.state.status).toBe('idle');
      expect(result.current.state.remainingTime).toBe(25 * 60 * 1000);
    });
  });

  describe('display formatting', () => {
    test('formats minutes and seconds', () => {
      const { result } = renderHook(() => usePomodoro());

      expect(result.current.formattedTime).toBe('25:00');

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(65 * 1000);
      });

      expect(result.current.formattedTime).toBe('23:55');
    });

    test('shows 00:00 when completed', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(25 * 60 * 1000);
      });

      expect(result.current.formattedTime).toBe('00:00');
    });
  });

  describe('progress', () => {
    test('calculates progress percentage', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(12.5 * 60 * 1000);
      });

      expect(result.current.progress).toBeCloseTo(0.5, 1);
    });

    test('starts at 0 progress', () => {
      const { result } = renderHook(() => usePomodoro());

      expect(result.current.progress).toBe(0);
    });

    test('reaches 100% when completed', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(25 * 60 * 1000);
      });

      expect(result.current.progress).toBe(1);
    });
  });

  describe('session switching', () => {
    test('switches to short break after work completes', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(25 * 60 * 1000);
      });
      act(() => {
        result.current.nextSession();
      });

      expect(result.current.state.sessionType).toBe('shortBreak');
      expect(result.current.state.remainingTime).toBe(5 * 60 * 1000);
      expect(result.current.state.status).toBe('idle');
    });
  });

  describe('session label', () => {
    test('returns correct label for work', () => {
      const { result } = renderHook(() => usePomodoro());
      expect(result.current.sessionLabel).toBe('专注工作');
    });

    test('returns correct label for short break', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(25 * 60 * 1000);
      });
      act(() => {
        result.current.nextSession();
      });

      expect(result.current.sessionLabel).toBe('短暂休息');
    });

    test('returns correct label for long break', () => {
      const { result } = renderHook(() => usePomodoro());

      for (let i = 0; i < 4; i++) {
        act(() => {
          result.current.start();
        });
        act(() => {
          result.current.tick(25 * 60 * 1000);
        });
        act(() => {
          result.current.nextSession();
        });
        if (i < 3) {
          act(() => {
            result.current.start();
          });
          act(() => {
            result.current.tick(5 * 60 * 1000);
          });
          act(() => {
            result.current.nextSession();
          });
        }
      }

      expect(result.current.sessionLabel).toBe('长休息');
    });
  });

  describe('stats', () => {
    test('tracks completed pomodoros', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(25 * 60 * 1000);
      });

      expect(result.current.stats.totalCompletedPomodoros).toBe(1);
    });

    test('tracks total work minutes', () => {
      const { result } = renderHook(() => usePomodoro());

      act(() => {
        result.current.start();
      });
      act(() => {
        result.current.tick(25 * 60 * 1000);
      });

      expect(result.current.stats.totalWorkMinutes).toBe(25);
    });
  });
});
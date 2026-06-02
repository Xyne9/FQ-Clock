import { renderHook, act } from '@testing-library/react-native';
import { useTasks } from '../hooks/useTasks';

describe('useTasks', () => {
  test('starts with empty tasks', () => {
    const { result } = renderHook(() => useTasks());

    expect(result.current.tasks).toHaveLength(0);
    expect(result.current.activeTasks).toHaveLength(0);
    expect(result.current.completedTasks).toHaveLength(0);
  });

  test('adds a new task', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      result.current.addTask('Write tests');
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Write tests');
    expect(result.current.tasks[0].completed).toBe(false);
  });

  test('removes a task', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      const task = result.current.addTask('Remove me');
      result.current.removeTask(task.id);
    });

    expect(result.current.tasks).toHaveLength(0);
  });

  test('toggles task completion', () => {
    const { result } = renderHook(() => useTasks());
    let taskId: string;

    act(() => {
      const task = result.current.addTask('Test task');
      taskId = task.id;
    });

    act(() => {
      result.current.toggleComplete(taskId);
    });

    expect(result.current.tasks[0].completed).toBe(true);
    expect(result.current.activeTasks).toHaveLength(0);
    expect(result.current.completedTasks).toHaveLength(1);
  });

  test('increments pomodoro count', () => {
    const { result } = renderHook(() => useTasks());
    let taskId: string;

    act(() => {
      const task = result.current.addTask('Test task');
      taskId = task.id;
    });

    act(() => {
      result.current.incrementPomodoro(taskId);
    });
    act(() => {
      result.current.incrementPomodoro(taskId);
    });

    expect(result.current.tasks[0].completedPomodoros).toBe(2);
  });

  test('updates task title', () => {
    const { result } = renderHook(() => useTasks());
    let taskId: string;

    act(() => {
      const task = result.current.addTask('Old title');
      taskId = task.id;
    });

    act(() => {
      result.current.updateTask(taskId, { title: 'New title' });
    });

    expect(result.current.tasks[0].title).toBe('New title');
  });

  test('clears completed tasks', () => {
    const { result } = renderHook(() => useTasks());
    let completedId: string;

    act(() => {
      const t1 = result.current.addTask('Task 1');
      result.current.addTask('Task 2');
      completedId = t1.id;
      result.current.toggleComplete(completedId);
    });

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].completed).toBe(false);
  });
});

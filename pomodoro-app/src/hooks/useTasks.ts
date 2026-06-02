import { useState, useCallback, useRef } from 'react';
import { TaskManager } from '../core/TaskManager';
import { PomodoroTask } from '../core/types';

export function useTasks() {
  const [tasks, setTasks] = useState<PomodoroTask[]>([]);
  const taskManagerRef = useRef(new TaskManager());

  const refreshTasks = useCallback(() => {
    setTasks([...taskManagerRef.current.getTasks()]);
  }, []);

  const addTask = useCallback(
    (title: string, estimatedPomodoros: number = 1): PomodoroTask => {
      const task = taskManagerRef.current.addTask(title, estimatedPomodoros);
      refreshTasks();
      return task;
    },
    [refreshTasks],
  );

  const removeTask = useCallback(
    (id: string) => {
      taskManagerRef.current.removeTask(id);
      refreshTasks();
    },
    [refreshTasks],
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<PomodoroTask, 'id'>>) => {
      taskManagerRef.current.updateTask(id, updates);
      refreshTasks();
    },
    [refreshTasks],
  );

  const toggleComplete = useCallback(
    (id: string) => {
      taskManagerRef.current.toggleComplete(id);
      refreshTasks();
    },
    [refreshTasks],
  );

  const incrementPomodoro = useCallback(
    (id: string) => {
      taskManagerRef.current.incrementPomodoro(id);
      refreshTasks();
    },
    [refreshTasks],
  );

  const clearCompleted = useCallback(() => {
    taskManagerRef.current.clearCompleted();
    refreshTasks();
  }, [refreshTasks]);

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return {
    tasks,
    activeTasks,
    completedTasks,
    addTask,
    removeTask,
    updateTask,
    toggleComplete,
    incrementPomodoro,
    clearCompleted,
  };
}
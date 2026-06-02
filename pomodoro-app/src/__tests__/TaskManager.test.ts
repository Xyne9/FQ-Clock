import { TaskManager } from '../core/TaskManager';
import { PomodoroTask } from '../core/types';

describe('TaskManager', () => {
  describe('addTask', () => {
    test('adds a new task with default values', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Write tests');

      expect(task.title).toBe('Write tests');
      expect(task.completedPomodoros).toBe(0);
      expect(task.estimatedPomodoros).toBe(1);
      expect(task.completed).toBe(false);
      expect(task.id).toBeDefined();
    });

    test('adds a task with custom estimated pomodoros', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Implement feature', 3);

      expect(task.estimatedPomodoros).toBe(3);
    });

    test('adds multiple tasks with unique IDs', () => {
      const manager = new TaskManager();
      const task1 = manager.addTask('Task 1');
      const task2 = manager.addTask('Task 2');

      expect(task1.id).not.toBe(task2.id);
    });
  });

  describe('removeTask', () => {
    test('removes a task by id', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Task to remove');

      manager.removeTask(task.id);

      const tasks = manager.getTasks();
      expect(tasks).toHaveLength(0);
    });

    test('throws when removing non-existent task', () => {
      const manager = new TaskManager();

      expect(() => manager.removeTask('non-existent')).toThrow(
        'Task not found',
      );
    });
  });

  describe('updateTask', () => {
    test('updates task title', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Old title');

      manager.updateTask(task.id, { title: 'New title' });

      const updated = manager.getTask(task.id);
      expect(updated?.title).toBe('New title');
    });

    test('updates estimated pomodoros', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Task');

      manager.updateTask(task.id, { estimatedPomodoros: 5 });

      const updated = manager.getTask(task.id);
      expect(updated?.estimatedPomodoros).toBe(5);
    });

    test('throws when updating non-existent task', () => {
      const manager = new TaskManager();

      expect(() =>
        manager.updateTask('non-existent', { title: 'New' }),
      ).toThrow('Task not found');
    });
  });

  describe('toggleComplete', () => {
    test('marks task as completed', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Task');

      manager.toggleComplete(task.id);

      const updated = manager.getTask(task.id);
      expect(updated?.completed).toBe(true);
    });

    test('unmarks completed task', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Task');
      manager.toggleComplete(task.id);

      manager.toggleComplete(task.id);

      const updated = manager.getTask(task.id);
      expect(updated?.completed).toBe(false);
    });
  });

  describe('incrementPomodoro', () => {
    test('increments completed pomodoros', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Task');

      manager.incrementPomodoro(task.id);

      const updated = manager.getTask(task.id);
      expect(updated?.completedPomodoros).toBe(1);
    });

    test('throws when incrementing non-existent task', () => {
      const manager = new TaskManager();

      expect(() => manager.incrementPomodoro('non-existent')).toThrow(
        'Task not found',
      );
    });
  });

  describe('getTasks', () => {
    test('returns all tasks', () => {
      const manager = new TaskManager();
      manager.addTask('Task 1');
      manager.addTask('Task 2');
      manager.addTask('Task 3');

      const tasks = manager.getTasks();

      expect(tasks).toHaveLength(3);
    });

    test('filters active tasks', () => {
      const manager = new TaskManager();
      const task1 = manager.addTask('Task 1');
      manager.addTask('Task 2');
      manager.toggleComplete(task1.id);

      const active = manager.getTasks('active');

      expect(active).toHaveLength(1);
      expect(active[0].completed).toBe(false);
    });

    test('filters completed tasks', () => {
      const manager = new TaskManager();
      const task1 = manager.addTask('Task 1');
      manager.addTask('Task 2');
      manager.toggleComplete(task1.id);

      const completed = manager.getTasks('completed');

      expect(completed).toHaveLength(1);
      expect(completed[0].completed).toBe(true);
    });
  });

  describe('getTask', () => {
    test('returns task by id', () => {
      const manager = new TaskManager();
      const task = manager.addTask('Task');

      const found = manager.getTask(task.id);

      expect(found).toEqual(task);
    });

    test('returns undefined for non-existent task', () => {
      const manager = new TaskManager();

      const found = manager.getTask('non-existent');

      expect(found).toBeUndefined();
    });
  });

  describe('reorder', () => {
    test('moves task to new position', () => {
      const manager = new TaskManager();
      const task1 = manager.addTask('Task 1');
      const task2 = manager.addTask('Task 2');
      const task3 = manager.addTask('Task 3');

      manager.reorder(task1.id, 2);

      const tasks = manager.getTasks();
      expect(tasks[0].id).toBe(task2.id);
      expect(tasks[1].id).toBe(task3.id);
      expect(tasks[2].id).toBe(task1.id);
    });
  });

  describe('clearCompleted', () => {
    test('removes all completed tasks', () => {
      const manager = new TaskManager();
      const task1 = manager.addTask('Task 1');
      manager.addTask('Task 2');
      manager.toggleComplete(task1.id);

      manager.clearCompleted();

      const tasks = manager.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].completed).toBe(false);
    });
  });
});
import { PomodoroTask } from './types';

type Filter = 'all' | 'active' | 'completed';

export class TaskManager {
  private tasks: PomodoroTask[] = [];

  addTask(title: string, estimatedPomodoros: number = 1): PomodoroTask {
    const task: PomodoroTask = {
      id: this.generateId(),
      title,
      completedPomodoros: 0,
      estimatedPomodoros,
      completed: false,
    };
    this.tasks.push(task);
    return task;
  }

  removeTask(id: string): void {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    this.tasks.splice(index, 1);
  }

  updateTask(id: string, updates: Partial<Omit<PomodoroTask, 'id'>>): void {
    const task = this.getTask(id);
    if (!task) {
      throw new Error('Task not found');
    }
    Object.assign(task, updates);
  }

  toggleComplete(id: string): void {
    const task = this.getTask(id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.completed = !task.completed;
  }

  incrementPomodoro(id: string): void {
    const task = this.getTask(id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.completedPomodoros++;
  }

  getTasks(filter: Filter = 'all'): PomodoroTask[] {
    if (filter === 'all') {
      return [...this.tasks];
    }
    return this.tasks.filter(t =>
      filter === 'active' ? !t.completed : t.completed,
    );
  }

  getTask(id: string): PomodoroTask | undefined {
    return this.tasks.find(t => t.id === id);
  }

  reorder(taskId: string, toIndex: number): void {
    const fromIndex = this.tasks.findIndex(t => t.id === taskId);
    if (fromIndex === -1) {
      return;
    }
    const [task] = this.tasks.splice(fromIndex, 1);
    this.tasks.splice(toIndex, 0, task);
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter(t => !t.completed);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
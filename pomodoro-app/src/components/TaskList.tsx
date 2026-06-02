import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { PomodoroTask } from '../core/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: PomodoroTask[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onAddPomodoro: (id: string) => void;
  onClearCompleted: () => void;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  onAddPomodoro,
  onClearCompleted,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>暂无任务，添加一个吧 🍅</Text>
      </View>
    );
  }

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <View style={styles.container}>
      <FlatList
        data={[...activeTasks, ...completedTasks]}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onAddPomodoro={onAddPomodoro}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {completedTasks.length > 0 && (
        <Pressable style={styles.clearButton} onPress={onClearCompleted}>
          <Text style={styles.clearButtonText}>清除已完成</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  clearButton: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
    borderStyle: 'dashed',
  },
  clearButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
});

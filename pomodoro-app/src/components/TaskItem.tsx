import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { PomodoroTask } from '../core/types';
import { Check, Trash } from 'lucide-react-native';

interface TaskItemProps {
  task: PomodoroTask;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onAddPomodoro: (id: string) => void;
}

export function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onAddPomodoro,
}: TaskItemProps) {
  return (
    <Pressable
      style={[
        styles.container,
        task.completed && styles.completedContainer,
      ]}
      onPress={() => onToggleComplete(task.id)}
    >
      <View style={styles.checkbox}>
        {task.completed && <Check size={16} color="#fff" />}
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            task.completed && styles.completedTitle,
          ]}
        >
          {task.title}
        </Text>
        <Text style={styles.pomodoroCount}>
          {task.completedPomodoros}/{task.estimatedPomodoros}
        </Text>
      </View>

      <View style={styles.actions}>
        {!task.completed && (
          <Pressable
            style={styles.addButton}
            onPress={() => onAddPomodoro(task.id)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        )}
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Trash size={18} color="#888" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 8,
  },
  completedContainer: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E74C3C',
    marginRight: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  pomodoroCount: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  deleteButton: {
    padding: 4,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SessionType } from '../core/types';

interface SessionIndicatorProps {
  sessionType: SessionType;
  sessionLabel: string;
  completedPomodoros: number;
}

const SESSION_COLORS: Record<SessionType, string> = {
  work: '#E74C3C',
  shortBreak: '#2ECC71',
  longBreak: '#3498DB',
};

export function SessionIndicator({
  sessionType,
  sessionLabel,
  completedPomodoros,
}: SessionIndicatorProps) {
  const color = SESSION_COLORS[sessionType];

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{sessionLabel}</Text>
      </View>
      {sessionType === 'work' && (
        <Text style={styles.countText}>
          已完成 {completedPomodoros} 个番茄
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  countText: {
    color: '#888',
    fontSize: 13,
  },
});
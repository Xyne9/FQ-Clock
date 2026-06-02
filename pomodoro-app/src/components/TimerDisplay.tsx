import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircularProgress } from './CircularProgress';
import { SessionType, TimerStatus } from '../core/types';

interface TimerDisplayProps {
  formattedTime: string;
  progress: number;
  sessionType: SessionType;
  status: TimerStatus;
  size: number;
}

const SESSION_COLORS: Record<SessionType, string> = {
  work: '#E74C3C',
  shortBreak: '#2ECC71',
  longBreak: '#3498DB',
};

export function TimerDisplay({
  formattedTime,
  progress,
  sessionType,
  size,
}: TimerDisplayProps) {
  const color = SESSION_COLORS[sessionType];

  return (
    <View style={styles.container}>
      <CircularProgress
        progress={progress}
        size={size}
        strokeWidth={8}
        color={color}
        backgroundColor="#2C2C2E"
      >
        <Text style={[styles.timeText, { color }]}>
          {formattedTime}
        </Text>
      </CircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 64,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
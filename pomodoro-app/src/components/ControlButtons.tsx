import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { TimerStatus } from '../core/types';

interface ControlButtonsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function ControlButtons({
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: ControlButtonsProps) {
  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {isIdle && (
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={onStart}
          >
            <Text style={styles.primaryButtonText}>开始</Text>
          </Pressable>
        )}

        {isRunning && (
          <Pressable
            style={[styles.button, styles.warningButton]}
            onPress={onPause}
          >
            <Text style={styles.warningButtonText}>暂停</Text>
          </Pressable>
        )}

        {isPaused && (
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={onResume}
          >
            <Text style={styles.primaryButtonText}>继续</Text>
          </Pressable>
        )}

        {isCompleted && (
          <Pressable
            style={[styles.button, styles.primaryButton]}
            onPress={onSkip}
          >
            <Text style={styles.primaryButtonText}>下一个</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.row}>
        {!isIdle && !isCompleted && (
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={onReset}
          >
            <Text style={styles.secondaryButtonText}>重置</Text>
          </Pressable>
        )}

        {(isRunning || isPaused) && (
          <Pressable
            style={[styles.button, styles.secondaryButton]}
            onPress={onSkip}
          >
            <Text style={styles.secondaryButtonText}>跳过</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#E74C3C',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  warningButton: {
    backgroundColor: '#F39C12',
  },
  warningButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#555',
  },
  secondaryButtonText: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
  },
});
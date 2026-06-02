import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { usePomodoro } from '../hooks/usePomodoro';
import { useTasks } from '../hooks/useTasks';
import { TimerDisplay } from '../components/TimerDisplay';
import { ControlButtons } from '../components/ControlButtons';
import { SessionIndicator } from '../components/SessionIndicator';
import { TaskInput } from '../components/TaskInput';
import { TaskList } from '../components/TaskList';
import { useScaledSize } from '../utils/scale';

const TIMER_INTERVAL = 1000;
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

export function PomodoroScreen() {
  const { hs, vs, ms, fs, width, height, scale } = useScaledSize();
  const {
    state,
    stats,
    formattedTime,
    progress,
    sessionLabel,
    start,
    pause,
    resume,
    reset,
    tick,
    nextSession,
    skip,
  } = usePomodoro();

  const {
    tasks,
    addTask,
    removeTask,
    toggleComplete,
    incrementPomodoro,
    clearCompleted,
  } = useTasks();

  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'stats'>(
    'timer',
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.status === 'running') {
      intervalRef.current = setInterval(() => {
        tick(TIMER_INTERVAL);
      }, TIMER_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.status, tick]);

  useEffect(() => {
    if (state.status === 'completed') {
      nextSession();
    }
  }, [state.status, nextSession]);

  const timerSize = useMemo(() => {
    const availableHeight =
      height - STATUS_BAR_HEIGHT - hs(220) - hs(120);
    const maxFromWidth = width * 0.75;
    const maxFromHeight = Math.min(availableHeight * 0.6, 320);
    return Math.min(maxFromWidth, maxFromHeight, 320);
  }, [width, height, hs, scale]);

  const screenPadding = ms(20);

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case 'timer':
        return (
          <View style={styles.timerSection}>
            <SessionIndicator
              sessionType={state.sessionType}
              sessionLabel={sessionLabel}
              completedPomodoros={stats.totalCompletedPomodoros}
            />

            <TimerDisplay
              formattedTime={formattedTime}
              progress={progress}
              sessionType={state.sessionType}
              status={state.status}
              size={timerSize}
            />

            <View style={styles.controlsSection}>
              <ControlButtons
                status={state.status}
                onStart={start}
                onPause={pause}
                onResume={resume}
                onReset={reset}
                onSkip={skip}
              />
            </View>
          </View>
        );

      case 'tasks':
        return (
          <View style={styles.tabContent}>
            <TaskInput onAddTask={addTask} />
            <TaskList
              tasks={tasks}
              onToggleComplete={toggleComplete}
              onDelete={removeTask}
              onAddPomodoro={incrementPomodoro}
              onClearCompleted={clearCompleted}
            />
          </View>
        );

      case 'stats':
        return (
          <View style={styles.statsSection}>
            <Text style={[styles.statsTitle, { fontSize: fs(24) }]}>
              统计
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statsCard}>
                <Text
                  style={[styles.statsNumber, { fontSize: fs(36) }]}
                >
                  {stats.totalCompletedPomodoros}
                </Text>
                <Text style={[styles.statsLabel, { fontSize: fs(14) }]}>
                  完成番茄数
                </Text>
              </View>
              <View style={styles.statsCard}>
                <Text
                  style={[styles.statsNumber, { fontSize: fs(36) }]}
                >
                  {stats.totalWorkMinutes}
                </Text>
                <Text style={[styles.statsLabel, { fontSize: fs(14) }]}>
                  专注分钟
                </Text>
              </View>
            </View>
          </View>
        );
    }
  }, [
    activeTab,
    state,
    stats,
    formattedTime,
    progress,
    sessionLabel,
    timerSize,
    tasks,
    start,
    pause,
    resume,
    reset,
    skip,
    addTask,
    toggleComplete,
    removeTask,
    incrementPomodoro,
    clearCompleted,
    fs,
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          {
            paddingHorizontal: screenPadding,
            paddingTop: screenPadding,
          },
        ]}
      >
        {renderTabContent}

        <View style={styles.tabBar}>
          <TabButton
            label="计时"
            isActive={activeTab === 'timer'}
            onPress={() => setActiveTab('timer')}
            fontSize={fs(16)}
          />
          <TabButton
            label="任务"
            isActive={activeTab === 'tasks'}
            onPress={() => setActiveTab('tasks')}
            fontSize={fs(16)}
          />
          <TabButton
            label="统计"
            isActive={activeTab === 'stats'}
            onPress={() => setActiveTab('stats')}
            fontSize={fs(16)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function TabButton({
  label,
  isActive,
  onPress,
  fontSize,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  fontSize: number;
}) {
  return (
    <Pressable
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
      android_ripple={{ color: '#E74C3C20' }}
    >
      <Text
        style={[
          styles.tabButtonText,
          { fontSize },
          isActive && styles.tabButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  container: {
    flex: 1,
  },
  timerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlsSection: {
    marginTop: 8,
  },
  tabContent: {
    flex: 1,
  },
  statsSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  statsTitle: {
    fontWeight: '700',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statsCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 140,
  },
  statsNumber: {
    fontWeight: '800',
    color: '#E74C3C',
  },
  statsLabel: {
    color: '#888',
    marginTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#1C1C1E',
  },
  tabButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#E74C3C',
  },
});
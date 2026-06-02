import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (trimmed.length > 0) {
      onAddTask(trimmed);
      setTitle('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="添加新任务..."
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <Pressable
        style={[
          styles.addButton,
          title.trim().length === 0 && styles.addButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={title.trim().length === 0}
      >
        <Text style={styles.addButtonText}>添加</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTodoFiltering } from './useTodoFiltering';
import type { TodoTask } from '../types/todo';

// Mock data
const mockTodos: TodoTask[] = [
  {
    id: 1,
    title: 'Buy groceries',
    description: 'Get milk, bread, and eggs',
    isCompleted: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    dueDate: '2024-01-02T00:00:00Z',
    priority: 2,
  },
  {
    id: 2,
    title: 'Walk the dog',
    description: 'Take Fido for a walk in the park',
    isCompleted: true,
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z',
    dueDate: '2024-01-01T18:00:00Z',
    priority: 1,
  },
  {
    id: 3,
    title: 'Finish report',
    description: 'Complete the quarterly report for work',
    isCompleted: false,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
    priority: 3,
  },
  {
    id: 4,
    title: 'Call mom',
    isCompleted: true,
    createdAt: '2024-01-01T07:00:00Z',
    updatedAt: '2024-01-01T07:00:00Z',
    dueDate: '2024-01-01T20:00:00Z',
    priority: 1,
  },
];

describe('useTodoFiltering', () => {
  it('should return all todos when no filters are applied', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, {})
    );

    expect(result.current).toHaveLength(4);
    // Should maintain original order when no sorting is specified
    expect(result.current.map(todo => todo.id)).toEqual([1, 2, 3, 4]);
  });

  it('should filter by completion status (pending)', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { isCompleted: false })
    );

    expect(result.current).toHaveLength(2);
    expect(result.current.every(todo => !todo.isCompleted)).toBe(true);
    // Should maintain original order: Buy groceries (id: 1) comes before Finish report (id: 3)
    expect(result.current.map(todo => todo.title)).toEqual(['Buy groceries', 'Finish report']);
  });

  it('should filter by completion status (completed)', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { isCompleted: true })
    );

    expect(result.current).toHaveLength(2);
    expect(result.current.every(todo => todo.isCompleted)).toBe(true);
    // Should maintain original order: Walk the dog (id: 2) comes before Call mom (id: 4)
    expect(result.current.map(todo => todo.title)).toEqual(['Walk the dog', 'Call mom']);
  });

  it('should filter by priority', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { priority: 1 })
    );

    expect(result.current).toHaveLength(2);
    expect(result.current.every(todo => todo.priority === 1)).toBe(true);
    // Should maintain original order: Walk the dog (id: 2) comes before Call mom (id: 4)
    expect(result.current.map(todo => todo.title)).toEqual(['Walk the dog', 'Call mom']);
  });

  it('should filter by search term', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { search: 'report' })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Finish report');
  });

  it('should filter by search term in description', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { search: 'dog' })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Walk the dog');
  });

  it('should filter by search term (case insensitive)', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { search: 'GROCERIES' })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Buy groceries');
  });

  it('should combine multiple filters', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { isCompleted: false, priority: 2 })
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Buy groceries');
    expect(result.current[0].isCompleted).toBe(false);
    expect(result.current[0].priority).toBe(2);
  });

  it('should sort by title (ascending)', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { sortBy: 'title' })
    );

    const titles = result.current.map(todo => todo.title);
    expect(titles).toEqual(['Buy groceries', 'Call mom', 'Finish report', 'Walk the dog']);
  });

  it('should sort by title (descending)', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { sortBy: 'title', sortDescending: true })
    );

    const titles = result.current.map(todo => todo.title);
    expect(titles).toEqual(['Walk the dog', 'Finish report', 'Call mom', 'Buy groceries']);
  });

  it('should sort by priority (high to low)', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { sortBy: 'priority' })
    );

    const priorities = result.current.map(todo => todo.priority);
    expect(priorities).toEqual([3, 2, 1, 1]);
  });

  it('should sort by due date', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { sortBy: 'dueDate' })
    );

    // Items without due dates should come after items with due dates
    // Walk the dog (6 PM today) -> Call mom (8 PM today) -> Buy groceries (tomorrow) -> Finish report (no date)
    expect(result.current[0].title).toBe('Walk the dog'); // Has due date today (earlier)
    expect(result.current[1].title).toBe('Call mom'); // Has due date today (later)
    expect(result.current[2].title).toBe('Buy groceries'); // Has due date tomorrow
    expect(result.current[3].title).toBe('Finish report'); // No due date
  });

  it('should sort by created date when explicitly specified', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { sortBy: 'createdAt' })
    );

    // Should be in creation order: earliest first
    const createdDates = result.current.map(todo => todo.createdAt);
    expect(createdDates).toEqual([
      '2024-01-01T07:00:00Z', // Call mom (earliest)
      '2024-01-01T08:00:00Z', // Finish report
      '2024-01-01T09:00:00Z', // Walk the dog
      '2024-01-01T10:00:00Z', // Buy groceries (latest)
    ]);
  });

  it('should handle empty todo list', () => {
    const { result } = renderHook(() =>
      useTodoFiltering([], { search: 'test' })
    );

    expect(result.current).toHaveLength(0);
    expect(result.current).toEqual([]);
  });

  it('should handle undefined todos', () => {
    const { result } = renderHook(() =>
      useTodoFiltering(undefined, { search: 'test' })
    );

    expect(result.current).toHaveLength(0);
    expect(result.current).toEqual([]);
  });

  it('should not mutate original array', () => {
    const originalTodos = [...mockTodos];

    const { result } = renderHook(() =>
      useTodoFiltering(mockTodos, { isCompleted: true })
    );

    // Original array should remain unchanged
    expect(mockTodos).toEqual(originalTodos);
    // Filtered result should be different
    expect(result.current).not.toEqual(mockTodos);
    expect(result.current).toHaveLength(2);
  });
});

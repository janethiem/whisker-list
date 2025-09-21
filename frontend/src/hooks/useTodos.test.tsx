import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import {
  useTodos,
  useTodo,
  useTodoStats,
  useCreateTodo,
  useUpdateTodo,
  useToggleTodoComplete,
  useDeleteTodo,
  todoKeys,
} from './useTodos';
import * as todoService from '../services/todoService';
import type { TodoTask, CreateTodoRequest, UpdateTodoRequest, TodoStats } from '../types/todo';

// Mock the entire todoService module
vi.mock('../services/todoService');
const mockedTodoService = vi.mocked(todoService);

// Mock data
const mockTodo: TodoTask = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  isCompleted: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  dueDate: '2024-01-02T00:00:00Z',
  priority: 2,
};

const mockTodos: TodoTask[] = [mockTodo];

const mockStats: TodoStats = {
  total: 10,
  completed: 6,
  pending: 4,
  overdue: 2,
  completionRate: 0.6,
};

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTodos Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useTodos', () => {
    it('should fetch todos successfully', async () => {
      mockedTodoService.fetchTodos.mockResolvedValueOnce(mockTodos);

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTodos);
      expect(mockedTodoService.fetchTodos).toHaveBeenCalledWith({});
    });

    it('should fetch todos with params', async () => {
      const params = { isCompleted: false, priority: 2 };
      mockedTodoService.fetchTodos.mockResolvedValueOnce([mockTodo]);

      const { result } = renderHook(() => useTodos(params), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockedTodoService.fetchTodos).toHaveBeenCalledWith(params);
    });

    it('should handle fetch errors', async () => {
      const error = new Error('Failed to fetch');
      mockedTodoService.fetchTodos.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useTodos(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should use correct query key', () => {
      const params = { isCompleted: true };
      renderHook(() => useTodos(params), {
        wrapper: createWrapper(),
      });

      expect(mockedTodoService.fetchTodos).toHaveBeenCalledWith(params);
    });
  });

  describe('useTodo', () => {
    it('should fetch single todo successfully', async () => {
      mockedTodoService.fetchTodo.mockResolvedValueOnce(mockTodo);

      const { result } = renderHook(() => useTodo(1), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockTodo);
      expect(mockedTodoService.fetchTodo).toHaveBeenCalledWith(1);
    });

    it('should not fetch when id is falsy', () => {
      renderHook(() => useTodo(0), {
        wrapper: createWrapper(),
      });

      expect(mockedTodoService.fetchTodo).not.toHaveBeenCalled();
    });
  });

  describe('useTodoStats', () => {
    it('should fetch stats successfully', async () => {
      mockedTodoService.fetchTodoStats.mockResolvedValueOnce(mockStats);

      const { result } = renderHook(() => useTodoStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockStats);
      expect(mockedTodoService.fetchTodoStats).toHaveBeenCalled();
    });
  });

  describe('useCreateTodo', () => {
    it('should create todo successfully', async () => {
      const newTodo = { ...mockTodo, id: 2, title: 'New Todo' };
      const createRequest: CreateTodoRequest = {
        title: 'New Todo',
        priority: 1,
      };

      mockedTodoService.createTodo.mockResolvedValueOnce(newTodo);

      const { result } = renderHook(() => useCreateTodo(), {
        wrapper: createWrapper(),
      });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.mutateAsync(createRequest);
      });

      expect(mutationResult).toEqual(newTodo);
      expect(mockedTodoService.createTodo).toHaveBeenCalledWith(
        expect.objectContaining(createRequest),
        expect.anything()
      );
    });

    it('should handle create errors', async () => {
      const error = new Error('Failed to create');
      const createRequest: CreateTodoRequest = {
        title: '',
        priority: 1,
      };

      mockedTodoService.createTodo.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCreateTodo(), {
        wrapper: createWrapper(),
      });

      let thrownError;
      await act(async () => {
        try {
          await result.current.mutateAsync(createRequest);
        } catch (e) {
          thrownError = e;
        }
      });

      expect(thrownError).toEqual(error);
      expect(mockedTodoService.createTodo).toHaveBeenCalledWith(
        expect.objectContaining(createRequest),
        expect.anything()
      );
    });
  });

  describe('useUpdateTodo', () => {
    it('should update todo successfully', async () => {
      const updatedTodo = { ...mockTodo, title: 'Updated Title' };
      const updateRequest: UpdateTodoRequest = { title: 'Updated Title' };

      mockedTodoService.updateTodo.mockResolvedValueOnce(updatedTodo);

      const { result } = renderHook(() => useUpdateTodo(), {
        wrapper: createWrapper(),
      });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.mutateAsync({ id: 1, data: updateRequest });
      });

      expect(mutationResult).toEqual(updatedTodo);
      expect(mockedTodoService.updateTodo).toHaveBeenCalledWith(1, updateRequest);
    });
  });

  describe('useToggleTodoComplete', () => {
    it('should toggle completion successfully', async () => {
      const toggledTodo = { ...mockTodo, isCompleted: true };

      mockedTodoService.toggleTodoComplete.mockResolvedValueOnce(toggledTodo);

      const { result } = renderHook(() => useToggleTodoComplete(), {
        wrapper: createWrapper(),
      });

      let mutationResult;
      await act(async () => {
        mutationResult = await result.current.mutateAsync(1);
      });

      expect(mutationResult).toEqual(toggledTodo);
      expect(mockedTodoService.toggleTodoComplete).toHaveBeenCalledWith(
        1,
        expect.anything()
      );
    });
  });

  describe('useDeleteTodo', () => {
    it('should delete todo successfully', async () => {
      mockedTodoService.deleteTodo.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useDeleteTodo(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync(1);
      });

      expect(mockedTodoService.deleteTodo).toHaveBeenCalledWith(
        1,
        expect.anything()
      );
    });
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchTodos,
  fetchTodo,
  createTodo,
  updateTodo,
  toggleTodoComplete,
  deleteTodo,
} from './todoService';
import type { TodoTask, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

// Mock the api module
vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}));

import { apiClient } from './api';
const mockApiClient = apiClient as any;

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

const mockTodos: TodoTask[] = [
  mockTodo,
  {
    ...mockTodo,
    id: 2,
    title: 'Second Todo',
    isCompleted: true,
  },
];

describe('TodoService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTodos', () => {
    it('should fetch all todos for client-side filtering', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockTodos });

      const result = await fetchTodos();

      expect(mockApiClient.get).toHaveBeenCalledWith('/todo-tasks');
      expect(result).toEqual(mockTodos);
    });

    it('should handle network errors', async () => {
      const error = new Error('Network Error');
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(fetchTodos()).rejects.toThrow('Network Error');
    });
  });

  describe('fetchTodo', () => {
    it('should fetch a single todo by id', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: mockTodo });

      const result = await fetchTodo(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/todo-tasks/1');
      expect(result).toEqual(mockTodo);
    });

    it('should handle 404 errors', async () => {
      const error = { response: { status: 404 } };
      mockApiClient.get.mockRejectedValueOnce(error);

      await expect(fetchTodo(999)).rejects.toEqual(error);
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const createRequest: CreateTodoRequest = {
        title: 'New Todo',
        description: 'New Description',
        priority: 1,
      };
      const newTodo = { ...mockTodo, ...createRequest };
      mockApiClient.post.mockResolvedValueOnce({ data: newTodo });

      const result = await createTodo(createRequest);

      expect(mockApiClient.post).toHaveBeenCalledWith('/todo-tasks', createRequest);
      expect(result).toEqual(newTodo);
    });

    it('should handle validation errors', async () => {
      const invalidRequest = { title: '', priority: 1 };
      const error = { response: { status: 400, data: { message: 'Title is required' } } };
      mockApiClient.post.mockRejectedValueOnce(error);

      await expect(createTodo(invalidRequest as CreateTodoRequest)).rejects.toEqual(error);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const updateRequest: UpdateTodoRequest = { title: 'Updated Title' };
      const updatedTodo = { ...mockTodo, ...updateRequest };
      mockApiClient.patch.mockResolvedValueOnce({ data: updatedTodo });

      const result = await updateTodo(1, updateRequest);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/todo-tasks/1', updateRequest);
      expect(result).toEqual(updatedTodo);
    });

    it('should handle partial updates', async () => {
      const updateRequest: UpdateTodoRequest = { isCompleted: true, priority: 3 };
      const updatedTodo = { ...mockTodo, ...updateRequest };
      mockApiClient.patch.mockResolvedValueOnce({ data: updatedTodo });

      const result = await updateTodo(1, updateRequest);

      expect(result).toEqual(updatedTodo);
    });
  });

  describe('toggleTodoComplete', () => {
    it('should toggle todo completion', async () => {
      const toggledTodo = { ...mockTodo, isCompleted: true };
      mockApiClient.patch.mockResolvedValueOnce({ data: toggledTodo });

      const result = await toggleTodoComplete(1, false);

      expect(mockApiClient.patch).toHaveBeenCalledWith('/todo-tasks/1', { isCompleted: true });
      expect(result).toEqual(toggledTodo);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      mockApiClient.delete.mockResolvedValueOnce({ data: undefined });

      await deleteTodo(1);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/todo-tasks/1');
    });

    it('should handle delete errors', async () => {
      const error = { response: { status: 404 } };
      mockApiClient.delete.mockRejectedValueOnce(error);

      await expect(deleteTodo(999)).rejects.toEqual(error);
    });
  });

});

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTodos,
  fetchTodo,
  createTodo,
  updateTodo,
  toggleTodoComplete,
  deleteTodo,
  fetchTodoStats,
} from '../services/todoService';
import type { UpdateTodoRequest, TodoQueryParams } from '../types/todo';

// ===== QUERY KEYS =====
// Centralized query keys for consistent caching
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params: TodoQueryParams) => [...todoKeys.lists(), params] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
  stats: () => [...todoKeys.all, 'stats'] as const,
} as const;

// ===== QUERY HOOKS (for reading data) =====

/**
 * Hook to fetch todos with optional filtering/sorting
 * 🔍 This is for GET /todo-tasks
 */
export const useTodos = (params: TodoQueryParams = {}) => {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: () => fetchTodos(params),
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    // Refetch when window refocuses (good UX for todo apps)
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to fetch a single todo by ID
 * 🔍 This is for GET /todo-tasks/{id}
 */
export const useTodo = (id: number) => {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: !!id, // Only run query if ID exists
    staleTime: 10 * 60 * 1000, // Individual todos stay fresh longer
  });
};

/**
 * Hook to fetch todo statistics
 * 🔍 This is for GET /todo-tasks/stats
 */
export const useTodoStats = () => {
  return useQuery({
    queryKey: todoKeys.stats(),
    queryFn: fetchTodoStats,
    staleTime: 2 * 60 * 1000, // Stats refresh more frequently
  });
};

// ===== MUTATION HOOKS (for changing data) =====

/**
 * Hook to create a new todo
 * ✏️ This is for POST /todo-tasks
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
    },
  });
};

/**
 * Hook to update a todo
 * ✏️ This is for PUT /todo-tasks/{id}
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoRequest }) => 
      updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      // Update the specific todo in cache
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
      // Invalidate lists (in case sorting/filtering changed)
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
    },
  });
};

/**
 * Hook to toggle todo completion
 * ✏️ This is for PATCH /todo-tasks/{id}/complete
 */
export const useToggleTodoComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: toggleTodoComplete,
    onSuccess: (updatedTodo) => {
      // Optimistically update the todo in cache
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
    },
  });
};

/**
 * Hook to delete a todo
 * ✏️ This is for DELETE /todo-tasks/{id}
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, deletedId) => {
      // Remove the todo from cache
      queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.stats() });
    },
  });
};

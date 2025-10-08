import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTodos,
  fetchTodo,
  createTodo,
  updateTodo,
  toggleTodoComplete,
  deleteTodo,
} from '../services/todoService';
import type { UpdateTodoRequest } from '../types/todo';

export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
} as const;

/**
 * Hook to fetch all todos for client-side filtering
 */
export const useTodos = () => {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch a single todo by ID
 */
export const useTodo = (id: number) => {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => fetchTodo(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a new todo
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

/**
 * Hook to update a todo
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoRequest }) => 
      updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

/**
 * Hook to toggle todo completion
 */
export const useToggleTodoComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, currentIsCompleted }: { id: number; currentIsCompleted: boolean }) => 
      toggleTodoComplete(id, currentIsCompleted),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

/**
 * Hook to delete a todo
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
};

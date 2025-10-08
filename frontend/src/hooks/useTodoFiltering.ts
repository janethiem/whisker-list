import { useMemo } from 'react';
import type { TodoTask, TodoQueryParams } from '../types/todo';

/**
 * Hook to filter and sort todos on the client side
 * This handles filtering without making additional API calls
 */
export const useTodoFiltering = (todos: TodoTask[] | undefined, queryParams: TodoQueryParams) => {
  return useMemo(() => {
    if (!todos) return [];

    let filtered = [...todos];

    if (queryParams.search) {
      const searchTerm = queryParams.search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (queryParams.isCompleted !== undefined) {
      filtered = filtered.filter(todo => todo.isCompleted === queryParams.isCompleted);
    }

    if (queryParams.priority !== undefined) {
      filtered = filtered.filter(todo => todo.priority === queryParams.priority);
    }

    const sortBy = queryParams.sortBy || 'createdAt';
    
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dueDate':
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
          comparison = aDate - bDate;
          break;
        case 'priority':
          comparison = (b.priority || 0) - (a.priority || 0);
          break;
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return queryParams.sortDescending ? -comparison : comparison;
    });

    return filtered;
  }, [todos, queryParams]);
};

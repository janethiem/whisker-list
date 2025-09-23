import { useMemo } from 'react';
import type { TodoTask, TodoQueryParams } from '../types/todo';

/**
 * Hook to filter and sort todos on the client side
 * This handles filtering without making additional API calls
 */
export const useTodoFiltering = (todos: TodoTask[] | undefined, queryParams: TodoQueryParams) => {
  return useMemo(() => {
    if (!todos) return [];

    let filtered = [...todos]; // Create a copy to avoid mutating original

    // Apply client-side filtering for search, status, priority
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

    // Apply sorting client-side (only if sortBy is specified)
    if (queryParams.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (queryParams.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'dueDate':
            // Items without due dates should come after items with due dates
            const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
            const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
            comparison = aDate - bDate;
            break;
          case 'priority':
            // Sort priority from high to low (3, 2, 1)
            comparison = (b.priority || 0) - (a.priority || 0);
            break;
          case 'updatedAt':
            comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
            break;
          case 'createdAt':
            comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            break;
          default:
            comparison = 0;
        }

        // Apply descending sort if specified
        return queryParams.sortDescending ? -comparison : comparison;
      });
    }

    return filtered;
  }, [todos, queryParams]);
};

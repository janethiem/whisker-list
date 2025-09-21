// Core Todo Task type (matches your API response)
export interface TodoTask {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
  dueDate?: string; // ISO date string from API
  priority: number;
}

// Request types for API calls
export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  priority: number;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string; // ISO date string
  priority?: number;
}

// Query parameters for filtering/sorting
export interface TodoQueryParams {
  isCompleted?: boolean;
  priority?: number;
  search?: string;
  sortBy?: 'createdAt' | 'title' | 'dueDate' | 'priority' | 'updatedAt';
  sortDescending?: boolean;
}

// Statistics response
export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}

// Priority levels (you can adjust these based on your needs)
export const PRIORITY_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4,
} as const;

export type PriorityLevel = typeof PRIORITY_LEVELS[keyof typeof PRIORITY_LEVELS];

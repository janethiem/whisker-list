export interface TodoTask {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority: number;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: number;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
  priority?: number;
}

export interface TodoQueryParams {
  isCompleted?: boolean;
  priority?: number;
  search?: string;
  sortBy?: 'createdAt' | 'title' | 'dueDate' | 'priority';
  sortDescending?: boolean;
}


export const PRIORITY_LEVELS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

export type PriorityLevel = typeof PRIORITY_LEVELS[keyof typeof PRIORITY_LEVELS];

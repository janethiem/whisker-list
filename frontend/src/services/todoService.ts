import { apiClient } from './api';
import type { 
  TodoTask, 
  CreateTodoRequest, 
  UpdateTodoRequest, 
  TodoQueryParams, 
  TodoStats 
} from '../types/todo';

// ===== SERVICE FUNCTIONS =====
// These are pure functions that make HTTP calls

/**
 * GET /todo-tasks - Fetch all todos with optional filtering
 */
export const fetchTodos = async (params: TodoQueryParams = {}): Promise<TodoTask[]> => {
  const response = await apiClient.get<TodoTask[]>('/todo-tasks', { params });
  return response.data;
};

/**
 * GET /todo-tasks/{id} - Fetch a single todo
 */
export const fetchTodo = async (id: number): Promise<TodoTask> => {
  const response = await apiClient.get<TodoTask>(`/todo-tasks/${id}`);
  return response.data;
};

/**
 * POST /todo-tasks - Create a new todo
 */
export const createTodo = async (data: CreateTodoRequest): Promise<TodoTask> => {
  const response = await apiClient.post<TodoTask>('/todo-tasks', data);
  return response.data;
};

/**
 * PUT /todo-tasks/{id} - Update a todo
 */
export const updateTodo = async (id: number, data: UpdateTodoRequest): Promise<TodoTask> => {
  const response = await apiClient.put<TodoTask>(`/todo-tasks/${id}`, data);
  return response.data;
};

/**
 * PATCH /todo-tasks/{id}/complete - Toggle completion status
 */
export const toggleTodoComplete = async (id: number): Promise<TodoTask> => {
  const response = await apiClient.patch<TodoTask>(`/todo-tasks/${id}/complete`);
  return response.data;
};

/**
 * DELETE /todo-tasks/{id} - Delete a todo
 */
export const deleteTodo = async (id: number): Promise<void> => {
  await apiClient.delete(`/todo-tasks/${id}`);
};

/**
 * GET /todo-tasks/stats - Get todo statistics
 */
export const fetchTodoStats = async (): Promise<TodoStats> => {
  const response = await apiClient.get<TodoStats>('/todo-tasks/stats');
  return response.data;
};

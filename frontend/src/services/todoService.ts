import { apiClient } from './api';
import type { 
  TodoTask, 
  CreateTodoRequest, 
  UpdateTodoRequest
} from '../types/todo';

/**
 * GET /todo-tasks - Fetch all todos
 */
export const fetchTodos = async (): Promise<TodoTask[]> => {
  const response = await apiClient.get<TodoTask[]>('/todo-tasks');
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
 * PATCH /todo-tasks/{id} - Update a todo (partial update)
 */
export const updateTodo = async (id: number, data: UpdateTodoRequest): Promise<TodoTask> => {
  const response = await apiClient.patch<TodoTask>(`/todo-tasks/${id}`, data);
  return response.data;
};

/**
 * Toggle completion status using the main update endpoint
 */
export const toggleTodoComplete = async (id: number, currentIsCompleted: boolean): Promise<TodoTask> => {
  return updateTodo(id, { isCompleted: !currentIsCompleted });
};

/**
 * DELETE /todo-tasks/{id} - Delete a todo
 */
export const deleteTodo = async (id: number): Promise<void> => {
  await apiClient.delete(`/todo-tasks/${id}`);
};


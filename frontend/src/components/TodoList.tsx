import { useState } from 'react';
import { Icon } from './ui';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { useTodos } from '../hooks/useTodos';
import type { TodoTask, TodoQueryParams } from '../types/todo';

interface TodoListProps {
  queryParams?: TodoQueryParams;
}

export default function TodoList({ queryParams = {} }: TodoListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoTask | null>(null);

  const { data: todos, isLoading, error, refetch } = useTodos(queryParams);

  const handleEdit = (todo: TodoTask) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleFormSuccess = () => {
    // React Query will automatically refetch, but we can force it if needed
    refetch();
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-amber-900 flex items-center gap-3 py-2">
            <Icon name="list" size={28} />
            Your Tasks
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Icon name="add" size={22} />
            Add Task
          </button>
        </div>

        {/* Loading Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg bg-white animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-amber-900 flex items-center gap-3 py-2">
            <Icon name="list" size={28} />
            Your Tasks
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Icon name="add" size={22} />
            Add Task
          </button>
        </div>

        {/* Error State */}
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <Icon name="cat-cross-paws" size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-700 mb-4">
            {error.message || 'Failed to load your tasks'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!todos || todos.length === 0) {
    const hasFilters = Object.keys(queryParams).some(key => 
      queryParams[key as keyof TodoQueryParams] !== undefined && 
      queryParams[key as keyof TodoQueryParams] !== ''
    );

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-amber-900 flex items-center gap-3 py-2">
            <Icon name="list" size={28} />
            Your Tasks
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Icon name="add" size={22} />
            Add Task
          </button>
        </div>

        <div className="text-center py-12 bg-amber-50 rounded-lg border border-orange-200">
          <Icon name={hasFilters ? "cat-magnifying-glass" : "sleeping-cat"} size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-amber-900 mb-2">
            {hasFilters ? 'No tasks found' : 'All caught up!'}
          </h3>
          <p className="text-amber-700 mb-4">
            {hasFilters 
              ? 'Try adjusting your filters to see more tasks' 
              : 'No tasks yet. Create your first one to get started! 🐾'
            }
          </p>
          {!hasFilters && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-3 mx-auto shadow-sm"
            >
              <Icon name="add" size={22} />
              Create First Task
            </button>
          )}
        </div>

        {/* Form Modal */}
        {showForm && (
          <TodoForm
            todo={editingTodo}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    );
  }

  // Success State with Todos
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-amber-900 flex items-center gap-3 py-2">
          <Icon name="list" size={28} />
          Your Tasks
          <span className="text-base font-normal text-amber-700">
            ({todos.length} task{todos.length !== 1 ? 's' : ''})
          </span>
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-3 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
        >
          <Icon name="add" size={22} />
          Add Task
        </button>
      </div>

      {/* Todo Items */}
      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <TodoForm
          todo={editingTodo}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

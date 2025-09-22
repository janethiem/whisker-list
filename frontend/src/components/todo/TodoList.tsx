import { useState } from 'react';
import { Icon, Button } from '../ui';
import TodoItem from './TodoItem';
import TodoFilters from './TodoFilters';
import EditModal from './EditModal';
import { useTodos } from '../../hooks/useTodos';
import { UI_TEXT } from '../../constants/strings';
import type { TodoTask, TodoQueryParams } from '../../types/todo';

interface TodoListProps {
  queryParams?: TodoQueryParams;
  onFiltersChange: (filters: TodoQueryParams) => void;
}

const TodoList = ({ queryParams = {}, onFiltersChange }: TodoListProps) => {
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-3" style={{color: '#3a3a3a'}}>
            <Icon name="list" size={28} />
            {UI_TEXT.YOUR_TASKS}
          </h2>
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            icon="add"
            iconSize={20}
          >
            {UI_TEXT.ADD_TASK}
          </Button>
        </div>

        <TodoFilters onFiltersChange={onFiltersChange} initialFilters={queryParams} />

        {/* Loading Skeleton */}
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 border rounded animate-pulse" style={{backgroundColor: '#ffffff', borderColor: '#d4b8a3', boxShadow: '0 1px 3px rgba(212, 184, 163, 0.1)'}}>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full" style={{backgroundColor: '#e8e3df'}}></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded w-3/4" style={{backgroundColor: '#e8e3df'}}></div>
                  <div className="h-3 rounded w-1/2" style={{backgroundColor: '#e8e3df'}}></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded" style={{backgroundColor: '#e8e3df'}}></div>
                  <div className="w-8 h-8 rounded" style={{backgroundColor: '#e8e3df'}}></div>
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Icon name="list" size={28} />
            {UI_TEXT.YOUR_TASKS}
          </h2>
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            icon="add"
            iconSize={20}
          >
            {UI_TEXT.ADD_TASK}
          </Button>
        </div>

        <TodoFilters onFiltersChange={onFiltersChange} initialFilters={queryParams} />

        {/* Error State */}
        <div className="text-center py-12 border rounded" style={{backgroundColor: '#ffffff', borderColor: '#d4b8a3', boxShadow: '0 1px 3px rgba(212, 184, 163, 0.1)'}}>
          <Icon name="cat-cross-paws" size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{UI_TEXT.SOMETHING_WENT_WRONG}</h3>
          <p className="text-gray-600 mb-4">
            {error.message || UI_TEXT.FAILED_TO_LOAD_TASKS}
          </p>
          <Button
            onClick={() => refetch()}
            variant="danger"
          >
            {UI_TEXT.TRY_AGAIN}
          </Button>
        </div>

        {showForm && (
          <EditModal
            todo={editingTodo}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Icon name="list" size={28} />
            {UI_TEXT.YOUR_TASKS}
          </h2>
          <Button
            onClick={() => setShowForm(true)}
            variant="primary"
            icon="add"
            iconSize={20}
          >
            {UI_TEXT.ADD_TASK}
          </Button>
        </div>

        <TodoFilters onFiltersChange={onFiltersChange} initialFilters={queryParams} />

        <div className="text-center py-12 border rounded" style={{backgroundColor: '#ffffff', borderColor: '#d4b8a3', boxShadow: '0 1px 3px rgba(212, 184, 163, 0.1)'}}>
          <Icon name={hasFilters ? "cat-magnifying-glass" : "sleeping-cat"} size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasFilters ? UI_TEXT.NO_TASKS_FOUND : UI_TEXT.ALL_CAUGHT_UP}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasFilters 
              ? UI_TEXT.TRY_ADJUSTING_FILTERS 
              : UI_TEXT.NO_TASKS_YET
            }
          </p>
          {!hasFilters && (
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              icon="add"
              iconSize={20}
              className="mx-auto"
            >
              {UI_TEXT.CREATE_FIRST_TASK}
            </Button>
          )}
        </div>

        {showForm && (
          <EditModal
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
          <Icon name="list" size={35} />
          {UI_TEXT.YOUR_TASKS}
          <span className="text-base font-normal text-gray-600">
            {UI_TEXT.TASK_COUNT(todos.length)}
          </span>
        </h2>
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          icon="add"
          iconSize={20}
        >
          Add Task
        </Button>
      </div>

      <TodoFilters onFiltersChange={onFiltersChange} initialFilters={queryParams} />

      {/* Todo Items */}
      <div className="space-y-2">
        {todos.map((todo) => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onEdit={handleEdit}
          />
        ))}
      </div>

      {showForm && (
        <EditModal
          todo={editingTodo}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default TodoList;

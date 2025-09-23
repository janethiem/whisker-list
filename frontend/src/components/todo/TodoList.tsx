import { useState } from 'react';
import EditModal from './EditModal';
import TodoListHeader from './TodoListHeader';
import TodoFilters from './TodoFilters';
import LoadingSkeleton from './LoadingSkeleton';
import TodoListContent from './TodoListContent';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import { useTodos } from '../../hooks/useTodos';
import type { TodoTask, TodoQueryParams } from '../../types/todo';

interface TodoListProps {
  queryParams?: TodoQueryParams;
  onFiltersChange: (filters: TodoQueryParams) => void;
}

const TodoList = ({ queryParams = {}, onFiltersChange }: TodoListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoTask | null>(null);

  // Make a single API call to get all todos - no server-side filtering/sorting needed
  // All filtering and sorting is handled client-side for instant results
  const { data: todos, isLoading, error, refetch } = useTodos({});

  const handleEdit = (todo: TodoTask) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <TodoListHeader onAddClick={() => setShowForm(true)} />
        <TodoFilters onFiltersChange={onFiltersChange} initialFilters={queryParams} />
        <LoadingSkeleton />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <>
        <ErrorState
          error={error}
          queryParams={queryParams}
          onFiltersChange={onFiltersChange}
          onRetry={() => refetch()}
          onAddClick={() => setShowForm(true)}
        />
        {showForm && (
          <EditModal
            todo={editingTodo}
            onClose={handleCloseForm}
          />
        )}
      </>
    );
  }

  // Empty State (no todos or filtered results)
  if (!todos || todos.length === 0) {
    return (
      <>
        <EmptyState
          queryParams={queryParams}
          onFiltersChange={onFiltersChange}
          onAddClick={() => setShowForm(true)}
        />
        {showForm && (
          <EditModal
            todo={editingTodo}
            onClose={handleCloseForm}
          />
        )}
      </>
    );
  }

  // Success State with Todos
  return (
    <>
      <TodoListContent
        todos={todos}
        queryParams={queryParams}
        onFiltersChange={onFiltersChange}
        onEdit={handleEdit}
        onAddClick={() => setShowForm(true)}
      />
      {showForm && (
        <EditModal
          todo={editingTodo}
          onClose={handleCloseForm}
        />
      )}
    </>
  );
};

export default TodoList;

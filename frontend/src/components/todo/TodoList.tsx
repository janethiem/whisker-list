import { useState, useCallback } from 'react';
import EditModal from './features/EditModal';
import TodoListHeader from './containers/TodoListHeader';
import TodoFilters from './features/TodoFilters';
import LoadingSkeleton from './states/LoadingSkeleton';
import TodoListContent from './containers/TodoListContent';
import ErrorState from './states/ErrorState';
import EmptyState from './states/EmptyState';
import { useTodos } from '../../hooks/useTodos';
import type { TodoTask, TodoQueryParams } from '../../types/todo';

interface TodoListProps {
  queryParams?: TodoQueryParams;
  onFiltersChange: (filters: TodoQueryParams) => void;
}

const TodoList = ({ queryParams = {}, onFiltersChange }: TodoListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoTask | null>(null);

  const { data: todos, isLoading, error, refetch } = useTodos();

  const handleEdit = useCallback((todo: TodoTask) => {
    setEditingTodo(todo);
    setShowForm(true);
  }, []);

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TodoListHeader onAddClick={() => setShowForm(true)} />
        <TodoFilters filters={queryParams} onFiltersChange={onFiltersChange} />
        <LoadingSkeleton />
      </div>
    );
  }

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

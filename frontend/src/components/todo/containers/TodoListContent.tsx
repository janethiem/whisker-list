import { useMemo } from 'react';
import TodoItem from '../item/TodoItem';
import TodoFilters from '../features/TodoFilters';
import TodoListHeader from './TodoListHeader';
import { useTodoFiltering } from '../../../hooks/useTodoFiltering';
import type { TodoTask, TodoQueryParams } from '../../../types/todo';

interface TodoListContentProps {
  todos: TodoTask[];
  queryParams: TodoQueryParams;
  onFiltersChange: (filters: TodoQueryParams) => void;
  onEdit: (todo: TodoTask) => void;
  onAddClick: () => void;
}

const TodoListContent = ({ todos, queryParams, onFiltersChange, onEdit, onAddClick }: TodoListContentProps) => {
  const filteredTodos = useTodoFiltering(todos, queryParams);

  const memoizedTodoItems = useMemo(() => (
    <div className="space-y-2">
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
        />
      ))}
    </div>
  ), [filteredTodos, onEdit]);

  return (
    <div className="space-y-6">
      <TodoListHeader todoCount={filteredTodos.length} onAddClick={onAddClick} />

      <TodoFilters onFiltersChange={onFiltersChange} initialFilters={queryParams} />

      {memoizedTodoItems}
    </div>
  );
};

export default TodoListContent;

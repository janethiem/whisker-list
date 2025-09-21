import { useState } from 'react';
import { Icon } from './ui';
import { useToggleTodoComplete, useDeleteTodo } from '../hooks/useTodos';
import type { TodoTask } from '../types/todo';

interface TodoItemProps {
  todo: TodoTask;
  onEdit?: (todo: TodoTask) => void;
}

const priorityColors = {
  1: 'bg-green-100 text-green-800 border-green-300',  // Low
  2: 'bg-yellow-100 text-yellow-800 border-yellow-300', // Medium  
  3: 'bg-red-100 text-red-800 border-red-300',         // High
};

const priorityLabels = {
  1: 'Low',
  2: 'Medium', 
  3: 'High',
};

export default function TodoItem({ todo, onEdit }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const toggleComplete = useToggleTodoComplete();
  const deleteTodoMutation = useDeleteTodo();

  const handleToggleComplete = () => {
    toggleComplete.mutate(todo.id);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTodoMutation.mutateAsync(todo.id);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted;
  
  return (
    <div className={`p-5 border rounded-lg bg-amber-50 shadow-sm transition-all hover:shadow-md ${
      todo.isCompleted ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-300 bg-red-50' : 'border-orange-200'}`}>
      
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          onClick={handleToggleComplete}
          disabled={toggleComplete.isPending}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            todo.isCompleted 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {todo.isCompleted && (
            <Icon name="complete" size={16} className="text-white" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`font-medium text-amber-900 ${
              todo.isCompleted ? 'line-through text-amber-600' : ''
            }`}>
              {todo.title}
            </h3>
            
            {/* Priority Badge */}
            <span className={`px-3 py-2 text-sm font-medium rounded-full border ${
              priorityColors[todo.priority as keyof typeof priorityColors]
            }`}>
              {priorityLabels[todo.priority as keyof typeof priorityLabels]}
            </span>
          </div>

          {todo.description && (
            <p className={`mt-2 text-sm text-amber-700 ${
              todo.isCompleted ? 'line-through' : ''
            }`}>
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 text-xs text-amber-600">
            {todo.dueDate && (
              <div className={`flex items-center gap-1 ${
                isOverdue ? 'text-red-600 font-medium' : ''
              }`}>
                <Icon name="calendar" size={14} />
                <span>
                  {new Date(todo.dueDate).toLocaleDateString()}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}
            
            <span>Created {new Date(todo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit?.(todo)}
            className="p-3 text-amber-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Icon name="edit" size={20} />
          </button>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 text-amber-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete task"
          >
            <Icon name="delete" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

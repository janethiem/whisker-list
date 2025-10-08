import { useState, useRef, useEffect, memo } from 'react';
import { CompletionCheckbox, TodoActions, TodoMeta } from './';
import { useToggleTodoComplete, useDeleteTodo, useUpdateTodo } from '../../../hooks/useTodos';
import { UI_TEXT } from '../../../constants/strings';
import type { TodoTask } from '../../../types/todo';

interface TodoItemProps {
  todo: TodoTask;
  onEdit?: (todo: TodoTask) => void;
}

const TodoItem = ({ todo, onEdit }: TodoItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingField, setEditingField] = useState<'title' | 'description' | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  const toggleComplete = useToggleTodoComplete();
  const deleteTodoMutation = useDeleteTodo();
  const updateTodoMutation = useUpdateTodo();

  useEffect(() => {
    if (editingField === 'title' && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    } else if (editingField === 'description' && descriptionTextareaRef.current) {
      descriptionTextareaRef.current.focus();
      descriptionTextareaRef.current.select();
    }
  }, [editingField]);

  const handleToggleComplete = () => {
    toggleComplete.mutate({ id: todo.id, currentIsCompleted: todo.isCompleted });
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

  const startEditing = (field: 'title' | 'description') => {
    if (todo.isCompleted) return;
    
    setEditingField(field);
    setEditValue(field === 'title' ? todo.title : (todo.description || ''));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingField || editValue.trim() === '') {
      cancelEditing();
      return;
    }

    try {
      const updateData = {
        title: editingField === 'title' ? editValue.trim() : todo.title,
        description: editingField === 'description' ? editValue.trim() || undefined : todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
      };

      await updateTodoMutation.mutateAsync({ id: todo.id, data: updateData });
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleBlur = () => {
    setTimeout(saveEdit, 100);
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted;
  
  return (
    <div className="pl-6 pr-8 py-2 border rounded transition-all hover:shadow-sm" 
    style={{
      backgroundColor: todo.isCompleted ? '#f5f5f5' : '#ffffff',
      borderColor: isOverdue ? '#ef4444' : '#d4b8a3',
      boxShadow: '0 1px 3px rgba(212, 184, 163, 0.1)',
      opacity: todo.isCompleted ? 0.7 : 1
    }}>
      
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <CompletionCheckbox 
            isCompleted={todo.isCompleted}
            onToggle={handleToggleComplete}
            isLoading={toggleComplete.isPending}
          />
        </div>

        <div className="flex-1 min-w-0">
          {editingField === 'title' ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = '#d4b8a3'
                handleBlur()
              }}
              maxLength={200}
              className="w-full font-medium bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-1"
              style={{
                color: '#000000',
                borderColor: '#d4b8a3'
              }}
              onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#c4a484'}
              placeholder={UI_TEXT.TASK_TITLE_PLACEHOLDER}
            />
          ) : (
            <h3 
              className={`font-medium cursor-pointer rounded px-2 py-1 transition-colors ${
                todo.isCompleted ? 'line-through' : ''
              }`}
              style={{
                color: todo.isCompleted ? '#6b6b6b' : '#000000'
              }}
              onMouseEnter={(e) => {
                if (!todo.isCompleted) {
                  (e.target as HTMLElement).style.backgroundColor = '#f5f0ea'
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent'
              }}
              onClick={() => startEditing('title')}
              title={todo.isCompleted ? '' : 'Click to edit title'}
            >
              {todo.title}
            </h3>
          )}

          {editingField === 'description' ? (
            <textarea
              ref={descriptionTextareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={(e) => {
                (e.target as HTMLTextAreaElement).style.borderColor = '#d4b8a3'
                handleBlur()
              }}
              maxLength={1000}
              rows={2}
              className="w-full mt-1 text-sm bg-transparent border rounded px-2 py-1 focus:outline-none focus:ring-1 resize-none"
              style={{
                color: '#000000',
                borderColor: '#d4b8a3'
              }}
              onFocus={(e) => (e.target as HTMLTextAreaElement).style.borderColor = '#c4a484'}
              placeholder={UI_TEXT.TASK_DESCRIPTION_PLACEHOLDER}
            />
          ) : (
            <>
              {todo.description ? (
                <p 
                  className={`mt-1 text-sm cursor-pointer rounded px-2 py-1 transition-colors ${
                    todo.isCompleted ? 'line-through' : ''
                  }`}
                  style={{
                    color: todo.isCompleted ? '#6b6b6b' : '#000000'
                  }}
                  onMouseEnter={(e) => {
                    if (!todo.isCompleted) {
                      (e.target as HTMLElement).style.backgroundColor = '#f5f0ea'
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                  onClick={() => startEditing('description')}
                  title={todo.isCompleted ? '' : 'Click to edit description'}
                >
                  {todo.description}
                </p>
              ) : !todo.isCompleted && (
                <p 
                  className="mt-1 text-sm cursor-pointer rounded px-2 py-1 transition-colors italic"
                  style={{
                    color: '#666666'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#f5f0ea'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent'
                  }}
                  onClick={() => startEditing('description')}
                  title={UI_TEXT.CLICK_TO_ADD_DESCRIPTION}
                >
                  {UI_TEXT.ADD_DESCRIPTION}
                </p>
              )}
            </>
          )}

          <TodoMeta 
            createdAt={todo.createdAt}
            dueDate={todo.dueDate}
            isCompleted={todo.isCompleted}
            priority={todo.priority as 1 | 2 | 3}
          />
        </div>

        <TodoActions 
          onEdit={() => onEdit?.(todo)}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default memo(TodoItem);

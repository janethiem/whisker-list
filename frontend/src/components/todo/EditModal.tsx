import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import { Input, Textarea, Select } from '../ui/FormField';
import { useCreateTodo, useUpdateTodo } from '../../hooks/useTodos';
import { UI_TEXT } from '../../constants/strings';
import type { TodoTask, CreateTodoRequest, UpdateTodoRequest } from '../../types/todo';

interface EditModalProps {
  todo?: TodoTask | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditModal = ({ todo, onClose, onSuccess }: EditModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 1,
  });

  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const isEditing = !!todo;
  const isLoading = createTodo.isPending || updateTodo.isPending;

  // Populate form when editing
  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        priority: todo.priority,
      });
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && todo) {
        const updateData: UpdateTodoRequest = {
          title: formData.title,
          description: formData.description || undefined,
          dueDate: formData.dueDate || undefined,
          priority: formData.priority,
        };
        await updateTodo.mutateAsync({ id: todo.id, data: updateData });
      } else {
        const createData: CreateTodoRequest = {
          title: formData.title,
          description: formData.description || undefined,
          dueDate: formData.dueDate || undefined,
          priority: formData.priority,
        };
        await createTodo.mutateAsync(createData);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to save todo:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-50">
      {/* Blurred backdrop - no overlay, just blur */}
      <div 
        className="fixed inset-0 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="border rounded-lg shadow-xl w-full max-w-md mx-4 relative z-10" style={{backgroundColor: '#ffffff', borderColor: '#d4b8a3'}}>
        <div className="p-6 border-b" style={{borderColor: '#e8e3df'}}>
          <h2 className="text-lg font-medium flex items-center gap-2" style={{color: '#3a3a3a'}}>
            <Icon name={isEditing ? "edit" : "add"} size={60} />
            {isEditing ? UI_TEXT.EDIT_TASK : UI_TEXT.NEW_TASK}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label={UI_TEXT.TITLE}
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={200}
            placeholder={UI_TEXT.WHAT_NEEDS_TO_BE_DONE}
          />

          <Textarea
            label={UI_TEXT.DESCRIPTION}
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={1000}
            rows={3}
            placeholder={UI_TEXT.ADDITIONAL_DETAILS}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label={UI_TEXT.DUE_DATE}
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />

            <Select
              label={UI_TEXT.PRIORITY}
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value={1}>{UI_TEXT.LOW}</option>
              <option value={2}>{UI_TEXT.MEDIUM}</option>
              <option value={3}>{UI_TEXT.HIGH}</option>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              {UI_TEXT.CANCEL}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!formData.title.trim()}
              isLoading={isLoading}
              className="flex-1"
            >
              {isEditing ? UI_TEXT.UPDATE : UI_TEXT.CREATE} Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

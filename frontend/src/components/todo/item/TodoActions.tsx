import Icon from '../../ui/Icon';
import { UI_TEXT } from '../../../constants/strings';

interface TodoActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export default function TodoActions({ 
  onEdit, 
  onDelete, 
  isDeleting = false 
}: TodoActionsProps) {
  return (
    <div className="flex items-start gap-2">
      <button
        onClick={onEdit}
        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors flex flex-col items-center min-w-[80px]"
        title={UI_TEXT.EDIT_DUE_DATE_AND_PRIORITY}
      >
        <div className="flex items-center justify-center h-[60px]">
          <Icon name="edit" size={60} />
        </div>
        <span className="text-sm font-medium mt-1">{UI_TEXT.EDIT}</span>
      </button>
      
      <button
        onClick={onDelete}
        disabled={isDeleting}
        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 flex flex-col items-center min-w-[80px]"
        title={UI_TEXT.DELETE_TASK}
      >
        <div className="flex items-center justify-center h-[60px]">
          <Icon name="delete" size={40} />
        </div>
        <span className="text-sm font-medium mt-1">{UI_TEXT.DELETE}</span>
      </button>
    </div>
  );
}

import { Icon, Button } from '../ui';
import { UI_TEXT } from '../../constants/strings';

interface TodoListHeaderProps {
  todoCount?: number;
  onAddClick: () => void;
}

const TodoListHeader = ({ todoCount, onAddClick }: TodoListHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
        <Icon name="list" size={35} />
        {UI_TEXT.YOUR_TASKS}
        {todoCount !== undefined && (
          <span className="text-base font-normal text-gray-600">
            {UI_TEXT.TASK_COUNT(todoCount)}
          </span>
        )}
      </h2>
      <Button
        onClick={onAddClick}
        variant="primary"
        icon="add"
        iconSize={20}
      >
        Add Task
      </Button>
    </div>
  );
};

export default TodoListHeader;

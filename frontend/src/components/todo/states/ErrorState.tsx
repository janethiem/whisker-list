import { Icon, Button } from '../../ui';
import TodoFilters from '../features/TodoFilters';
import TodoListHeader from '../containers/TodoListHeader';
import { UI_TEXT } from '../../../constants/strings';
import type { TodoQueryParams } from '../../../types/todo';

interface ErrorStateProps {
  error: Error;
  queryParams: TodoQueryParams;
  onFiltersChange: (filters: TodoQueryParams) => void;
  onRetry: () => void;
  onAddClick: () => void;
}

const ErrorState = ({ error, queryParams, onFiltersChange, onRetry, onAddClick }: ErrorStateProps) => {
  return (
    <div className="space-y-6">
      <TodoListHeader onAddClick={onAddClick} />

      <TodoFilters onFiltersChange={onFiltersChange} initialFilters={queryParams} />

      {/* Error State */}
      <div className="text-center py-12 border rounded" style={{backgroundColor: '#ffffff', borderColor: '#d4b8a3', boxShadow: '0 1px 3px rgba(212, 184, 163, 0.1)'}}>
        <Icon name="cat-cross-paws" size={64} className="mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{UI_TEXT.SOMETHING_WENT_WRONG}</h3>
        <p className="text-gray-600 mb-4">
          {error.message || UI_TEXT.FAILED_TO_LOAD_TASKS}
        </p>
        <Button
          onClick={onRetry}
          variant="danger"
        >
          {UI_TEXT.TRY_AGAIN}
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;

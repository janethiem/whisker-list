import { Icon, Button } from '../../ui';
import TodoFilters from '../features/TodoFilters';
import TodoListHeader from '../containers/TodoListHeader';
import { UI_TEXT } from '../../../constants/strings';
import type { TodoQueryParams } from '../../../types/todo';

interface EmptyStateProps {
  queryParams: TodoQueryParams;
  onFiltersChange: (filters: TodoQueryParams) => void;
  onAddClick: () => void;
}

const EmptyState = ({ queryParams, onFiltersChange, onAddClick }: EmptyStateProps) => {
  const hasFilters = Object.keys(queryParams).some(key =>
    queryParams[key as keyof TodoQueryParams] !== undefined &&
    queryParams[key as keyof TodoQueryParams] !== ''
  );

  return (
    <div className="space-y-6">
      <TodoListHeader onAddClick={onAddClick} />

      <TodoFilters filters={queryParams} onFiltersChange={onFiltersChange} />

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
            onClick={onAddClick}
            variant="primary"
            icon="add"
            iconSize={20}
            className="mx-auto"
          >
            {UI_TEXT.CREATE_FIRST_TASK}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

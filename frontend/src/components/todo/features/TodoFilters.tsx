import { useState, useEffect, useCallback } from 'react';
import { Input, Select, Button } from '../../ui';
import { UI_TEXT } from '../../../constants/strings';
import type { TodoQueryParams } from '../../../types/todo';

interface TodoFiltersProps {
  onFiltersChange: (filters: TodoQueryParams) => void;
  initialFilters?: TodoQueryParams;
}

const TodoFilters = ({ onFiltersChange, initialFilters = {} }: TodoFiltersProps) => {
  const [filters, setFilters] = useState<TodoQueryParams>(initialFilters);

  // Apply filters immediately - no debounce needed for client-side filtering
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = useCallback((key: keyof TodoQueryParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border rounded mb-6" style={{backgroundColor: '#ffffff', borderColor: '#d4b8a3', boxShadow: '0 1px 3px rgba(212, 184, 163, 0.1)'}}>
      {/* Search */}
      <div className="flex-1 min-w-64">
        <Input
          type="text"
          placeholder={UI_TEXT.SEARCH_TASKS}
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filters.isCompleted === undefined ? '' : filters.isCompleted.toString()}
        onChange={(e) => updateFilter('isCompleted', e.target.value === '' ? undefined : e.target.value === 'true')}
      >
        <option value="">{UI_TEXT.ALL_TASKS}</option>
        <option value="false">{UI_TEXT.PENDING}</option>
        <option value="true">{UI_TEXT.COMPLETED}</option>
      </Select>

      {/* Priority Filter */}
      <Select
        value={filters.priority || ''}
        onChange={(e) => updateFilter('priority', e.target.value ? parseInt(e.target.value) : undefined)}
      >
        <option value="">{UI_TEXT.ALL_PRIORITIES}</option>
        <option value="1">{UI_TEXT.LOW_PRIORITY}</option>
        <option value="2">{UI_TEXT.MEDIUM_PRIORITY}</option>
        <option value="3">{UI_TEXT.HIGH_PRIORITY}</option>
      </Select>

      {/* Sort */}
      <Select
        value={filters.sortBy || 'createdAt'}
        onChange={(e) => updateFilter('sortBy', e.target.value)}
      >
        <option value="createdAt">{UI_TEXT.SORT_BY_CREATED}</option>
        <option value="title">{UI_TEXT.SORT_BY_TITLE}</option>
        <option value="dueDate">{UI_TEXT.SORT_BY_DUE_DATE}</option>
        <option value="priority">{UI_TEXT.SORT_BY_PRIORITY}</option>
      </Select>

      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="ghost"
        >
          {UI_TEXT.CLEAR}
        </Button>
      )}
    </div>
  );
};

export default TodoFilters;

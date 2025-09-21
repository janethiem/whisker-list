import { useState, useEffect } from 'react';
import { Icon } from './ui';
import type { TodoQueryParams } from '../types/todo';

interface TodoFiltersProps {
  onFiltersChange: (filters: TodoQueryParams) => void;
  initialFilters?: TodoQueryParams;
}

export default function TodoFilters({ onFiltersChange, initialFilters = {} }: TodoFiltersProps) {
  const [filters, setFilters] = useState<TodoQueryParams>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Update local state when initial filters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Debounced filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(filters);
    }, 300); // 300ms debounce for search

    return () => clearTimeout(timer);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof TodoQueryParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setShowAdvanced(false);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-amber-50 border border-orange-200 rounded-lg p-6 space-y-6 shadow-sm">
      {/* Search Bar */}
      <div className="relative">
        <Icon name="search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-amber-900 placeholder-amber-600"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
          >
            <Icon name="delete" size={16} />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => updateFilter('isCompleted', filters.isCompleted === false ? undefined : false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filters.isCompleted === false
              ? 'bg-orange-100 text-orange-800 border border-orange-300'
              : 'bg-white text-amber-700 hover:bg-orange-50 border border-orange-200'
          }`}
        >
          <Icon name="paw-print" size={16} />
          Pending
        </button>
        
        <button
          onClick={() => updateFilter('isCompleted', filters.isCompleted === true ? undefined : true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filters.isCompleted === true
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-white text-amber-700 hover:bg-green-50 border border-orange-200'
          }`}
        >
          <Icon name="complete" size={16} />
          Completed
        </button>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showAdvanced
              ? 'bg-purple-100 text-purple-800 border border-purple-300'
              : 'bg-white text-amber-700 hover:bg-purple-50 border border-orange-200'
          }`}
        >
          <Icon name="category" size={16} />
          More Filters
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors border border-red-300"
          >
            <Icon name="delete" size={16} />
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-orange-200 pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Priority
              </label>
              <select
                value={filters.priority || ''}
                onChange={(e) => updateFilter('priority', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-amber-900"
              >
                <option value="">All Priorities</option>
                <option value="1">Low Priority</option>
                <option value="2">Medium Priority</option>
                <option value="3">High Priority</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-amber-900"
              >
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Updated Date</option>
                <option value="title">Title</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            {/* Sort Direction */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Sort Direction
              </label>
              <select
                value={filters.sortDescending ? 'desc' : 'asc'}
                onChange={(e) => updateFilter('sortDescending', e.target.value === 'desc')}
                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white text-amber-900"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Active Filters:</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {filters.search && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded border border-orange-200">
                  Search: "{filters.search}"
                </span>
              )}
              {filters.isCompleted !== undefined && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded border border-green-200">
                  Status: {filters.isCompleted ? 'Completed' : 'Pending'}
                </span>
              )}
              {filters.priority && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200">
                  Priority: {filters.priority === 1 ? 'Low' : filters.priority === 2 ? 'Medium' : 'High'}
                </span>
              )}
              {filters.sortBy && filters.sortBy !== 'createdAt' && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded border border-purple-200">
                  Sort: {filters.sortBy} ({filters.sortDescending ? 'desc' : 'asc'})
                </span>
              )}
              {!hasActiveFilters && (
                <span className="text-amber-600 italic">No filters applied</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

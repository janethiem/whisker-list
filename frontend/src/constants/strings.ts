export const UI_TEXT = {
  YOUR_TASKS: 'Your Tasks',

  ADD_TASK: 'Add Task',
  CREATE_FIRST_TASK: 'Create First Task',
  EDIT: 'Edit',
  DELETE: 'Delete',
  CANCEL: 'Cancel',
  CLEAR: 'Clear',
  TRY_AGAIN: 'Try Again',
  SAVE: 'Save',
  UPDATE: 'Update',
  CREATE: 'Create',

  TITLE: 'Title',
  DESCRIPTION: 'Description',
  DUE_DATE: 'Due Date',
  PRIORITY: 'Priority',

  TASK_TITLE_PLACEHOLDER: 'Task title...',
  TASK_DESCRIPTION_PLACEHOLDER: 'Add description...',
  WHAT_NEEDS_TO_BE_DONE: 'What needs to be done?',
  ADDITIONAL_DETAILS: 'Additional details...',
  SEARCH_TASKS: 'Search tasks...',
  ADD_DESCRIPTION: 'Add description...',

  SOMETHING_WENT_WRONG: 'Something went wrong',
  FAILED_TO_LOAD_TASKS: 'Failed to load your tasks',
  ALL_CAUGHT_UP: 'All caught up!',
  NO_TASKS_FOUND: 'No tasks found',
  NO_TASKS_YET: 'No tasks yet. Create your first one to get started!',
  TRY_ADJUSTING_FILTERS: 'Try adjusting your filters to see more tasks',

  NEW_TASK: 'New Task',
  EDIT_TASK: 'Edit Task',

  ALL_TASKS: 'All Tasks',
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  ALL_PRIORITIES: 'All Priorities',
  LOW_PRIORITY: 'Low Priority',
  MEDIUM_PRIORITY: 'Medium Priority',
  HIGH_PRIORITY: 'High Priority',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',

  SORT_BY_CREATED: 'Sort by Created',
  SORT_BY_TITLE: 'Sort by Title',
  SORT_BY_DUE_DATE: 'Sort by Due Date',
  SORT_BY_PRIORITY: 'Sort by Priority',

  EDIT_DUE_DATE_AND_PRIORITY: 'Edit due date and priority',
  DELETE_TASK: 'Delete task',
  CLICK_TO_ADD_DESCRIPTION: 'Click to add description',

  TASK_COUNT: (count: number) => `(${count} task${count !== 1 ? 's' : ''})`,
} as const;

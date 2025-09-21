import { useState } from 'react'
import { Icon } from './components'
import TodoList from './components/TodoList'
import TodoFilters from './components/TodoFilters'
import type { TodoQueryParams } from './types/todo'

function App() {
  const [queryParams, setQueryParams] = useState<TodoQueryParams>({})

  const handleFiltersChange = (newFilters: TodoQueryParams) => {
    setQueryParams(newFilters)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-amber-50 shadow-sm border-b border-orange-200 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <Icon name="logo" size={56} />
              <div className="text-center">
                <h1 className="text-4xl font-bold text-amber-900">WhiskerList</h1>
                <p className="text-base text-amber-700 mt-1">Keep track of all your tasks 🐾</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-xl font-semibold text-amber-900 mb-6 flex items-center gap-3 px-2">
                  <Icon name="search" size={24} />
                  Filters
                </h3>
                <TodoFilters 
                  onFiltersChange={handleFiltersChange}
                  initialFilters={queryParams}
                />
              </div>
            </div>

            {/* Todo List */}
            <div className="lg:col-span-3">
              <TodoList queryParams={queryParams} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

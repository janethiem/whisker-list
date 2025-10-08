import { useState, useCallback } from 'react'
import { Icon } from './components'
import { TodoList } from './components'
import type { TodoQueryParams } from './types/todo'

const App = () => {
  const [queryParams, setQueryParams] = useState<TodoQueryParams>({})

  const handleFiltersChange = useCallback((newFilters: TodoQueryParams) => {
    setQueryParams(newFilters)
  }, [])

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f7f5f3'}}>
      <div className="border-b" style={{backgroundColor: '#ffffff', borderColor: '#d4b8a3'}}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl" style={{paddingLeft: '16px', paddingRight: '16px'}}>
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <Icon name="logo" size={64} />
              <div className="text-center">
                <h1 className="text-4xl font-bold" style={{color: '#3a3a3a'}}>WhiskerList</h1>
                <p className="text-lg mt-2" style={{color: '#6b6b6b'}}>Keep track of all your tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-6xl" style={{paddingLeft: '16px', paddingRight: '16px'}}>
        <TodoList 
          queryParams={queryParams} 
          onFiltersChange={handleFiltersChange}
        />
      </div>
    </div>
  )
}

export default App

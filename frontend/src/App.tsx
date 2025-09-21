import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Icon } from './components'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      {/* Add your cat logo - much bigger */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <Icon name="logo" size={64} /> {/* Increased from 32 to 64 */}
        <h1 className="text-3xl font-bold text-blue-600">WhiskerList</h1>
      </div>
      
      {/* Example todo actions - bigger icons */}
      <div className="flex gap-4 justify-center mb-6">
        <button className="flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 text-lg">
          <Icon name="add" size={32} /> {/* Increased from 20 to 32 */}
          Add Task
        </button>
        <button className="flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 text-lg">
          <Icon name="complete" size={32} />
          Complete
        </button>
        <button className="flex items-center gap-3 px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 text-lg">
          <Icon name="delete" size={32} />
          Delete
        </button>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      {/* Test all your icons with bigger sizes */}
      <div className="mt-8 p-6 border rounded bg-white">
        <h2 className="text-xl font-bold mb-4 text-black">Icon Gallery</h2>
        <div className="grid grid-cols-5 gap-6 text-center">
          <div>
            <Icon name="paw-print" size={48} /> {/* Increased from 32 to 48 */}
            <p className="text-sm mt-2 text-black">Paw Print</p>
          </div>
          <div>
            <Icon name="yarn-ball" size={48} />
            <p className="text-sm mt-2 text-black">Yarn Ball</p>
          </div>
          <div>
            <Icon name="cat-clipboard" size={48} />
            <p className="text-sm mt-2 text-black">Clipboard</p>
          </div>
          <div>
            <Icon name="sleeping-cat" size={48} />
            <p className="text-sm mt-2 text-black">Sleeping Cat</p>
          </div>
          <div>
            <Icon name="cat-cross-paws" size={48} />
            <p className="text-sm mt-2 text-black">Cross Paws</p>
          </div>
          <div>
            <Icon name="playful-cat" size={48} />
            <p className="text-sm mt-2 text-black">Playful Cat</p>
          </div>
          <div>
            <Icon name="cat-magnifying-glass" size={48} />
            <p className="text-sm mt-2 text-black">Search</p>
          </div>
          <div>
            <Icon name="cat-food-bowl" size={48} />
            <p className="text-sm mt-2 text-black">Food Bowl</p>
          </div>
          <div>
            <Icon name="cat-calendar" size={48} />
            <p className="text-sm mt-2 text-black">Calendar</p>
          </div>
          <div>
            <Icon name="whiskers-cat-face" size={48} />
            <p className="text-sm mt-2 text-black">Cat Face</p>
          </div>
        </div>
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

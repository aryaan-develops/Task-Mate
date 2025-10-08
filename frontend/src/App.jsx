// src/App.jsx (Updated with Tailwind classes)

import './App.css'
import Dashboard from './components/Dashboard'

function App() {
  return (
    // Yeh Tailwind ki utility classes hain
    <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">Task Management System</h1>
      <Dashboard />
    </div>
  )
}

export default App
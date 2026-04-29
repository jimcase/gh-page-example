function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          GitHub Pages Demo
        </h1>
        <p className="text-gray-600 mb-6">
          TypeScript + React + Vite + Tailwind CSS
        </p>
        <div className="flex gap-4 justify-center">
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            TypeScript
          </span>
          <span className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
            React
          </span>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            Vite
          </span>
          <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
            Tailwind
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
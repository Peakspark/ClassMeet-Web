import { useState } from 'react'
import Sidebar from "./components/Sidebar";


function App() {
  const [count, setCount] = useState(0)

  return (
  <div className="min-h-screen bg-[#EAF4FF]">
      <Sidebar />

      <main className="ml-64 p-10">
        <h1 className="text-3xl font-bold text-[#0B1930]">
          ClassMeet Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome to your virtual workspace.
        </p>
      </main>
    </div>
  );
}

export default App

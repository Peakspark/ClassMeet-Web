import { useState } from 'react'
import Sidebar from "./components/Sidebar";

import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0)

  return (
  <div className="min-h-screen bg-[#EAF4FF]">
          <Sidebar />

      <main className="ml-64">

        <Header />

      </main>   

    </div>
  );
}

export default App

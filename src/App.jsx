import { Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Sidebar from "./components/Sidebar";
import QuickActions from './components/QuickActions';
import Header from "./components/Header";
import VirtualOffice from "./components/VirtualOffice";
import Signup from "./pages/Signup";


function Dashboard() {
  return (
    <div className="min-h-screen bg-[#EAF4FF]">
      <Sidebar />

      <main className="ml-64">
        <Header />
        <QuickActions />
      </main>
    </div>
  );
}


function App() {

  return (
  <Routes>

      <Route path="/" element={<Dashboard />} />

      <Route path="/signup" element={<Signup />} />

    </Routes>
  );
}

export default App

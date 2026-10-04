import { Routes, Route } from "react-router-dom";
import { useState } from 'react'
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
// import QuickActions from './components/QuickActions';
import Header from "./components/Header";
import VirtualOffice from "./components/VirtualOffice";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Messages from "./pages/Messages";
import Projects from "./pages/Projects";
import MeetingRoom from "./pages/MeetingRoom";
import Profile from "./pages/Profile";

<<<<<<< HEAD
//       <main className="ml-64">
//         <Header />
//         <QuickActions />
//       </main>
//     </div>
//   );
// }
function Layout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F0FDFA]">
        <Sidebar />

        <main className="ml-64">
          <Header />
          {children}
        </main>
      </div>
    </ProtectedRoute>
=======
function Layout({children}){
  return(
    <div className ="min-h-Screen bg-[#F0FDFA]">
<Sidebar/>

<main className="ml-0 md:ml-64">

  <Header />
  {children}
</main>


    </div>
>>>>>>> cd802fc ( makeing a responsive  sidebar and header for your mobail)
  );
}


function App() {

  return (
  <Routes>

      <Route path="/" element={
        <Layout>
             <Dashboard /> 
          </Layout>

        
     
    } />
<Route path="/meetings" element={
         <Layout>
            <Meetings />
          </Layout>
} />

<Route
  path="/messages"
  element={
    <Layout>
      <Messages />
    </Layout>
  }
/>

<Route
  path="/projects"
  element={
    <Layout>
      <Projects />
    </Layout>
  }
/>
<Route 
path="/profile"
element={
  <Layout>
    <Profile/>
  </Layout>
}
/>


<Route
  path="/meeting/:roomId"
  element={
    <ProtectedRoute>
      <MeetingRoom />
    </ProtectedRoute>
  }
/>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  );
}

export default App

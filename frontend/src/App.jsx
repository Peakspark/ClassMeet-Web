import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Meetings from "./pages/Meetings";
import Messages from "./pages/Messages";
import Projects from "./pages/Projects";
import MeetingRoom from "./pages/MeetingRoom";
import Profile from "./pages/Profile";
  import { ToastContainer } from 'react-toastify';


function Layout({ children }) {
  return (
    // <ProtectedRoute>
      <div className="min-h-screen bg-[#F0FDFA]">
        <ToastContainer />
        <Sidebar />

        <main className="ml-0 md:ml-64">
          <Header />
          {children}
        </main>
      </div>
    // </ProtectedRoute>
  );n
}


// function Layout({ children }) {
//   return (
//     <div className="min-h-screen bg-[#F0FDFA]">
//       <Sidebar />

//       <main className="ml-0 md:ml-64">
//         <Header />
//         {children}
//       </main>
//     </div>
//   );
// }

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      <Route
        path="/meetings"
        element={
          <Layout>
            <Meetings />
          </Layout>
        }
      />

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
            <Profile />
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
      {/* <Route
  path="/meeting/:roomId"
  element={<MeetingRoom />}
/> */}

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
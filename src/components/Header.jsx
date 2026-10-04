import { useAuth } from "../context/AuthContext";
import { Search, Bell, Video, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
   const navigate = useNavigate();
     const { user } = useAuth();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <header className="flex items-center justify-between px-8 py-6">

      {/* Left - Greeting */}
      <div>
        <p className="text-sm text-slate-500">
          {today}
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#172033]">
          {greeting}, {firstName} 
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="flex w-64 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">

          <Search
            size={19}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm text-[#172033] outline-none placeholder:text-slate-400"
          />

        </div>

        {/* Notification */}
        <button className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition hover:bg-slate-50">

          <Bell
            size={20}
            className="text-slate-600"
          />

          {/* Notification dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />

        </button>

        {/* Join Meeting */}
        <button
  onClick={() => {
    const roomId = `classmeet-${Date.now()}`;
    navigate(`/meeting/${roomId}`);
  }}
  className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition hover:bg-[#134E4A]"
>
  <Video size={18} />
  Join Meeting
</button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14B8A6] font-semibold text-white">
            A
          </div>

          <ChevronDown
            size={16}
            className="text-slate-500"
          />

        </button>

      </div>

    </header>
  );
}

export default Header;
import { useAuth } from "../context/AuthContext";
import { Search, Bell, Video, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <header className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-6">

      {/* Left - Greeting */}
      <div className="pl-12 lg:pl-0">
        <p className="text-xs text-slate-500 sm:text-sm">
          {today}
        </p>

        <h1 className="mt-1 text-xl font-bold text-[#172033] sm:text-2xl">
          {greeting}, {firstName} 
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-3 lg:w-auto lg:gap-4">

        {/* Search */}
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-3 py-3 shadow-sm sm:px-4 lg:w-64 lg:flex-none">
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
        <button className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition hover:bg-slate-50">
          <Bell
            size={20}
            className="text-slate-600"
          />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Join Meeting */}
        <button
          onClick={() => {
            const roomId = `classmeet-${Date.now()}`;
            navigate(`/meeting/${roomId}`);
          }}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#0F766E] px-3 py-3 text-sm font-semibold text-white shadow-md shadow-teal-700/20 transition hover:bg-[#134E4A] sm:px-5"
        >
          <Video size={18} />

          <span className="hidden sm:inline">
            Join Meeting
          </span>
        </button>

        {/* Profile */}
        <button className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-2 py-2 shadow-sm transition hover:bg-slate-50 sm:px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14B8A6] font-semibold text-white">
            {firstName.charAt(0).toUpperCase()}
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
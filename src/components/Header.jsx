import {
  Search,
  Bell,
  Plus,
  Video,
  ChevronDown,
} from "lucide-react";

function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-6">

      {/* Left */}
      <div>
        <p className="text-sm text-slate-500">
          Friday, October 2, 2026
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#0B1930]">
          Good afternoon, Amit 👋
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="flex w-64 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <Search size={19} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Notification */}
        <button className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm hover:bg-slate-50">
          <Bell size={20} className="text-slate-600" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Join Meeting */}
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700">
          <Video size={18} />
          Join Meeting
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
            A
          </div>

          <ChevronDown size={16} className="text-slate-500" />
        </button>

      </div>

    </header>
  );
}

export default Header;